import { NextRequest, NextResponse } from 'next/server';
import { ThinkingLevel, Type } from '@google/genai';
import { getGeminiClient } from '@/lib/gemini';
import type {
  HistoryQuizDifficulty,
  HistoryQuizQuestion,
  HistoryQuizResponse,
  HistoryQuizTopic,
} from '@/types';

const HISTORICAL_GROUNDING = `
Faits historiques vérifiés de référence sur Béjaïa (Algérie) :
1. Période romaine (Saldae, Ier av. J.-C. – Ve siècle) :
- Ancien comptoir punique et numide devenu colonie romaine sous Auguste : Colonia Julia Augusta Saldensium (Saldae), port stratégique de Maurétanie Césarienne puis Sitifienne.
- L'aqueduc romain de Toudja acheminait l'eau des sources montagneuses de Toudja jusqu'à Saldae sur environ 21 km.
- Au IIe siècle (vers 148–152 apr. J.-C.), le librator (ingénieur hydraulique militaire) de la IIIe Légion Auguste, Nonius Datus, fut appelé depuis Lambèse pour résoudre un défaut d'alignement lors du percement du tunnel d'El-Habel sous la montagne ; cet épisode est attesté par la célèbre inscription latine de Lambèse.
- Vestiges archéologiques attestés : citernes romaines, mosaïques (notamment les mosaïques marines conservées au musée de Bordj Moussa), stèles et fragments portuaires.

2. Période hammadide (En-Naciria, XIe – XIIe siècles) :
- Vers 1067 (XIe siècle), le prince hammadide En-Nacer ben Alennas fonde sa nouvelle capitale maritime à Béjaïa, baptisée En-Naciria, transférant progressivement le pouvoir depuis la Kalâa des Béni Hammad (transfert achevé sous son fils El-Mansour vers 1090).
- Construction de vastes remparts fortifiés, de palais princiers célèbres dans les chroniques médiévales (Qasr El-Loulou ou Palais de la Perle, Qasr Amimoun) et de la porte maritime monumentale Bab El Bhar (Porte de la Mer / Porte Sarrasine) ouvrant sur l'arsenal et le port.
- Rayonnement commercial et maritime majeur en Méditerranée avec marchands italiens (Pise, Gênes), catalans et andalous ; la qualité de la cire d'abeille exportée depuis le port de « Bougie » est à l'origine du mot français « bougie ».
- Foyer architectural, artisanal et intellectuel qui prépara le séjour ultérieur de savants comme Fibonacci (fin XIIe siècle) et le prestige savant de la cité.
`;

interface RawQuizPayload {
  questions?: Array<{
    period?: string;
    question?: string;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
    historicalAnchor?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      topic?: string;
      difficulty?: string;
      count?: number;
      locale?: string;
    };

    const topic: HistoryQuizTopic =
      body?.topic === 'romaine' || body?.topic === 'hammadite' ? body.topic : 'both';

    const difficulty: HistoryQuizDifficulty =
      body?.difficulty === 'decouverte' || body?.difficulty === 'expert'
        ? body.difficulty
        : 'intermediaire';

    const count =
      typeof body?.count === 'number' && Number.isFinite(body.count)
        ? Math.min(8, Math.max(3, Math.round(body.count)))
        : 5;

    const locale: 'fr' | 'ar' = body?.locale === 'ar' ? 'ar' : 'fr';

    const languageInstruction =
      locale === 'ar'
        ? 'Rédige TOUTES les questions, options, explications et repères chronologiques en arabe moderne clair et soigné (العربية الفصحى).'
        : 'Rédige TOUTES les questions, options, explications et repères chronologiques en français soutenu, clair et accessible.';

    const topicInstruction =
      topic === 'romaine'
        ? `Toutes les ${count} questions doivent porter exclusivement sur la période romaine de Béjaïa (Saldae) avec period = "romaine".`
        : topic === 'hammadite'
          ? `Toutes les ${count} questions doivent porter exclusivement sur la période hammadide de Béjaïa (En-Naciria) avec period = "hammadite".`
          : `Répartis les ${count} questions de façon équilibrée entre la période romaine de Béjaïa (period = "romaine") et la période hammadide (period = "hammadite").`;

    const difficultyInstruction =
      difficulty === 'decouverte'
        ? 'Niveau découverte : questions accessibles au grand public curieux, portant sur les noms majeurs, monuments emblématiques et grands repères.'
        : difficulty === 'expert'
          ? 'Niveau érudit : questions précises sur l’ingénierie hydraulique, l’épigraphie, l’urbanisme fortifié, les dynasties, les échanges méditerranéens et la chronologie fine.'
          : 'Niveau intermédiaire : équilibre entre grands faits culturels et précisions historiques intéressantes.';

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Génère un quiz historique inédit de ${count} questions à choix multiples sur l'histoire de Béjaïa.
${topicInstruction}
${difficultyInstruction}
${languageInstruction}
Varie les angles (urbanisme, hydraulique, commerce, personnalités, monuments, toponymie) et évite toute question répétitive.
Chaque question doit comporter exactement 4 choix distincts, plausibles, sans indice évident, un seul correctIndex (de 0 à 3), une explication historique pédagogique concise (2 phrases max) et un court repère chronologique (historicalAnchor, ex. "IIe siècle · Aqueduc de Toudja" ou "1067 · Fondation d'En-Naciria").`,
      config: {
        systemInstruction: `Tu es un historien spécialiste de l'Algérie antique et médiévale, en particulier de Béjaïa (Saldae romaine et En-Naciria hammadide). Tu produis des questions historiques rigoureuses, exactes et vérifiables, sans jamais inventer de faux monuments ni de fausses dates.\n${HISTORICAL_GROUNDING}`,
        responseMimeType: 'application/json',
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: {
                    type: Type.STRING,
                    description: 'Either "romaine" or "hammadite"',
                  },
                  question: {
                    type: Type.STRING,
                    description: 'The multiple-choice historical question.',
                  },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 4 distinct answer choices.',
                  },
                  correctIndex: {
                    type: Type.INTEGER,
                    description: 'Zero-based index (0 to 3) of the single correct option.',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Concise, accurate historical explanation (1-2 sentences).',
                  },
                  historicalAnchor: {
                    type: Type.STRING,
                    description: 'Short date and topic anchor label.',
                  },
                },
                required: [
                  'period',
                  'question',
                  'options',
                  'correctIndex',
                  'explanation',
                  'historicalAnchor',
                ],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      return NextResponse.json(
        { error: 'La réponse du modèle IA est vide. Veuillez réessayer.' },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(rawText) as RawQuizPayload;
    const rawList = Array.isArray(parsed.questions) ? parsed.questions : [];

    const validQuestions: HistoryQuizQuestion[] = rawList
      .filter((item) => {
        if (!item || typeof item.question !== 'string' || !item.question.trim()) return false;
        if (!Array.isArray(item.options) || item.options.length !== 4) return false;
        if (typeof item.correctIndex !== 'number' || item.correctIndex < 0 || item.correctIndex > 3) {
          return false;
        }
        return item.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0);
      })
      .map((item, idx) => ({
        id: `q-${Date.now()}-${idx}`,
        period: item.period === 'romaine' ? 'romaine' : 'hammadite',
        question: item.question!.trim(),
        options: item.options!.map((o) => o.trim()),
        correctIndex: Math.trunc(item.correctIndex!),
        explanation: (item.explanation ?? '').trim(),
        historicalAnchor: (item.historicalAnchor ?? '').trim(),
      }));

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Le format du quiz généré est invalide. Veuillez relancer la génération.' },
        { status: 502 }
      );
    }

    const payload: HistoryQuizResponse = {
      topic,
      difficulty,
      generatedAt: new Date().toISOString(),
      questions: validQuestions,
    };

    return NextResponse.json(payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('GEMINI_API_KEY') || message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED')) {
      return NextResponse.json(
        {
          error:
            'La clé API Gemini n’est pas configurée ou autorisée dans Settings > Secrets. Vérifiez votre configuration puis réessayez.',
        },
        { status: 503 }
      );
    }
    if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
      return NextResponse.json(
        { error: 'Quota API temporairement atteint. Veuillez patienter quelques instants avant de réessayer.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Impossible de générer le quiz historique IA pour le moment. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

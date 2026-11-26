import {
  HISTORICAL_ERAS,
  HISTORICAL_FIGURES,
  MEDINA_STRATA,
  NATURALIST_DOSSIERS,
} from '@/data/history';
import type { HistorySectionKind, OfflineHistoryArticlePayload } from '@/types';

const CACHE_PAYLOAD_VERSION = 'v5';

export function buildAllHistoryArticlePayloads(): OfflineHistoryArticlePayload[] {
  const eras: OfflineHistoryArticlePayload[] = HISTORICAL_ERAS.map((era) => ({
    id: era.id,
    slug: era.slug,
    kind: 'era',
    order: era.order,
    kicker: era.dateRange,
    title: era.title,
    subtitle: era.subtitle,
    summary: era.summary,
    paragraphs: era.paragraphs,
    pullQuote: era.pullQuote,
    keyPoints: era.keyMilestones,
    coverImage: era.coverImage,
    relatedDestinations: era.relatedDestinations,
    sources: era.sources,
    cachedVersion: CACHE_PAYLOAD_VERSION,
  }));

  const figures: OfflineHistoryArticlePayload[] = HISTORICAL_FIGURES.map((fig, idx) => ({
    id: fig.id,
    slug: fig.slug,
    kind: 'figure',
    order: `0${idx + 1}`,
    kicker: fig.dates,
    title: fig.name,
    subtitle: fig.domain,
    summary: fig.bejaiaConnection,
    paragraphs: fig.biography,
    relatedDestinations: fig.relatedDestinations,
    sources: fig.sources,
    cachedVersion: CACHE_PAYLOAD_VERSION,
  }));

  const medina: OfflineHistoryArticlePayload[] = MEDINA_STRATA.map((layer) => ({
    id: layer.id,
    slug: layer.id,
    kind: 'medina',
    order: layer.order,
    kicker: layer.period,
    title: layer.title,
    summary: layer.description,
    paragraphs: [layer.attestationNote],
    relatedDestinations: layer.relatedDestinations,
    cachedVersion: CACHE_PAYLOAD_VERSION,
  }));

  const nature: OfflineHistoryArticlePayload[] = NATURALIST_DOSSIERS.map((dossier, idx) => ({
    id: dossier.id,
    slug: dossier.slug,
    kind: 'nature',
    order: `0${idx + 1}`,
    kicker: dossier.ecosystemType,
    title: dossier.title,
    subtitle: dossier.subtitle,
    summary: dossier.summary,
    paragraphs: dossier.sections.map((s) => ({
      fr: `${s.heading.fr} — ${s.body.fr}`,
      ar: `${s.heading.ar} — ${s.body.ar}`,
      kab: s.heading.kab && s.body.kab ? `${s.heading.kab} — ${s.body.kab}` : undefined,
    })),
    keyPoints: dossier.speciesOrFormations,
    coverImage: dossier.coverImage,
    relatedDestinations: dossier.relatedDestinations,
    sources: dossier.sources,
    cachedVersion: CACHE_PAYLOAD_VERSION,
  }));

  return [...eras, ...figures, ...medina, ...nature];
}

export function getHistoryArticlePayloadById(id: string): OfflineHistoryArticlePayload | null {
  return buildAllHistoryArticlePayloads().find((item) => item.id === id) ?? null;
}

export function getHistoryTabForKind(
  kind: HistorySectionKind
): 'timeline' | 'figures' | 'medina' | 'nature' {
  if (kind === 'era') return 'timeline';
  if (kind === 'figure') return 'figures';
  if (kind === 'medina') return 'medina';
  return 'nature';
}

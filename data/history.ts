import type {
  DestinationHistoryMeta,
  EraSlug,
  GlossaryTerm,
  HistoricalEra,
  HistoricalFigure,
  LocalizedText,
  MedinaLayer,
  NaturalistDossier,
  SourceCitation,
} from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain certifiée DTA Béjaïa / Wikimedia Commons)';

export const COMMON_CITATIONS: Record<string, SourceCitation> = {
  dta: {
    id: 'dta-bejaia',
    code: '[1]',
    label: 'Direction du Tourisme et de l’Artisanat de Béjaïa (DTA Béjaïa)',
    url: 'https://www.dta-bejaia.com/',
    verificationStatus: 'verified_institutional',
  },
  guide: {
    id: 'guide-visitalgeria',
    code: '[2]',
    label: 'Guide touristique officiel de Béjaïa — VisitAlgeria (édition institutionnelle)',
    url: 'https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf',
    verificationStatus: 'verified_institutional',
  },
  unesco: {
    id: 'unesco-gouraya',
    code: '[3]',
    label: 'Réserve de biosphère du Parc national de Gouraya — Programme MAB UNESCO',
    verificationStatus: 'verified_institutional',
    note: {
      fr: 'Statut institutionnel reconnu pour le massif de Gouraya.',
      ar: 'تصنيف مؤسساتي معترف به لحضيرة قوراية.',
    },
  },
  archives: {
    id: 'archives-historiques',
    code: '[4]',
    label: 'Sources historiques méditerranéennes documentées (Saldae, chroniques hammadides, Ibn Khaldoun, Liber Abaci)',
    verificationStatus: 'historical_archive',
    note: {
      fr: 'Repères consensuels de l’historiographie ; les tracés disparus ou dates approximatives restent signalés.',
      ar: 'معطيات تاريخية متفق عليها، مع التنبيه إلى التواريخ التقريبية أو الآثار غير الباقية.',
    },
  },
  terrain: {
    id: 'terrain-check',
    code: '[5]',
    label: 'Vérification terrain complémentaire recommandée (accès, horaires ou aménagements locaux)',
    verificationStatus: 'to_verify_field',
    note: {
      fr: 'Consulter les autorités locales ou la DTA Béjaïa avant déplacement.',
      ar: 'يُنصح بمراجعة المصالح المحلية أو مديرية السياحة ببجاية قبل التنقل.',
    },
  },
};

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era-antiquite',
    slug: 'antiquite',
    order: '01',
    dateRange: {
      fr: 'Préhistoire & Antiquité (jusqu’au Ve siècle)',
      ar: 'ما قبل التاريخ والعصور القديمة (حتى القرن 5م)',
    },
    title: {
      fr: 'Des abris préhistoriques à la cité romaine de Saldae',
      ar: 'من مستوطنات ما قبل التاريخ إلى مدينة صالدا الرومانية',
    },
    subtitle: {
      fr: 'Comptoir côtier numide puis colonie maritime romaine alimentée par l’aqueduc de Toudja',
      ar: 'محطة ساحلية نوميدية ثم مستوطنة بحرية رومانية زُوّدت بقناة المياه من توجة',
    },
    summary: {
      fr: 'Bien avant la fondation médiévale d’En-Naciria, la rade protégée par le massif de Gouraya abrita des populations préhistoriques et un établissement antique connu sous le nom de Saldae.',
      ar: 'قبل التأسيس الحمادي في العصور الوسطى، احتضن الخليج المحمي بجبل قوراية تجمعات قديمة وميناءً أثرياً عُرف باسم صالدا.',
    },
    paragraphs: [
      {
        fr: 'Protégée des vents du nord-ouest par le promontoire du Gouraya et ouverte sur la vallée de la Soummam, la baie de Béjaïa offrait un mouillage naturel stratégique dès l’Antiquité [4]. À l’époque numide puis sous l’Empire romain, la cité portuaire de Saldae devint un nœud d’échanges maritimes et terrestres le long de la côte méditerranéenne [2][4].',
        ar: 'بفضل حمايتها الطبيعية من الرياح الشمالية الغربية عبر كتلة قوراية وانفتاحها على وادي الصومام، شكّل خليج بجاية مرسى استراتيجياً منذ العصور القديمة [4]. وفي العهدين النوميدي والروماني، غدت مدينة صالدا الساحلية نقطة وصل بحرية وبرية هامة [2][4].',
      },
      {
        fr: 'L’un des témoignages les plus célèbres de cette maîtrise hydraulique antique concerne l’adduction d’eau reliant les sources de Toudja à la ville côtière de Saldae, documentée par l’épigraphie romaine relative à l’ingénieur Nonius Datus au IIe siècle [4]. Aujourd’hui encore, les sources de Toudja rappellent ce lien historique durable entre l’arrière-pays montagneux et le port [1][2].',
        ar: 'ومن أبرز الشواهد الموثقة لهذه الحقبة شبكة جلب المياه التي ربطت منابع توجة بمدينة صالدا عبر نفق مائي ذكره النقش الأثري الشهير للمهندس نونيوس داتوس في القرن الثاني الميلادي [4]. ولا تزال منطقة توجة تستحضر هذه الصلة التاريخية بين الجبل والميناء [1][2].',
      },
    ],
    pullQuote: {
      fr: 'Entre les sources montagneuses de Toudja et la rade de Saldae, l’ingénierie hydraulique antique a inscrit Béjaïa dans la géographie savante de la Méditerranée.',
      ar: 'بين ينابيع توجة الجبلية وميناء صالدا، خطّت الهندسة المائية القديمة حضور بجاية في الجغرافيا المتوسطية.',
    },
    keyMilestones: [
      { fr: 'Mouillage antique et cité portuaire de Saldae', ar: 'المرسى القديم ومدينة صالدا المينائية' },
      { fr: 'Adduction d’eau et aqueduc reliant les sources de Toudja à Saldae', ar: 'شبكة وقناة جلب المياه من توجة نحو صالدا' },
      { fr: 'Vestiges conservés et présentés au patrimoine muséal local', ar: 'شواهد أثرية محفوظة ضمن التراث المتحفي المحلي' },
    ],
    relatedDestinations: ['toudja', 'musee-bordj-moussa', 'cap-carbon'],
    relatedFigures: [],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
    verificationNotice: {
      fr: 'De nombreux vestiges antiques sont enfouis sous le tissu urbain moderne ; seuls les éléments attestés par l’archéologie et les collections muséales sont présentés.',
      ar: 'توجد عدة آثار قديمة تحت النسيج العمراني الحديث؛ وتقتصر المعطيات هنا على الشواهد المؤكدة أثرياً.',
    },
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: {
        fr: 'Illustration des montagnes et sources de l’arrière-pays de Béjaïa vers Toudja',
        ar: 'رسم توضيحي لمرتفعات وينابيع الظهير الجبلي ببجاية نحو توجة',
      },
      caption: {
        fr: 'Paysage montagneux vers Toudja, origine antique de l’eau acheminée vers Saldae',
        ar: 'المشهد الجبلي نحو توجة، مصدر المياه التاريخي نحو صالدا',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'era-hammadide',
    slug: 'hammadide',
    order: '02',
    dateRange: {
      fr: 'XIe – XIIe siècles · Âge d’or hammadide',
      ar: 'القرنان 11 – 12م · العصر الذهبي الحمادي',
    },
    title: {
      fr: 'En-Naciria, capitale hammadide rayonnante en Méditerranée',
      ar: 'الناصرية، العاصمة الحمادية المشعة في البحر المتوسط',
    },
    subtitle: {
      fr: 'Fondation princière par En-Nacer ben Alennas, édification des remparts, des palais et de Bab El Bhar',
      ar: 'التأسيس الأميري على يد الناصر بن علناس وبناء الأسوار والقصور وباب البحر',
    },
    summary: {
      fr: 'Au XIe siècle, le souverain hammadide En-Nacer transfère sa capitale vers Béjaïa, baptisée En-Naciria. La ville devient en quelques décennies l’une des métropoles politiques, portuaires et artistiques majeures du Maghreb médiéval.',
      ar: 'في القرن الحادي عشر الميلادي، نقل الأمير الحمادي الناصر عاصمته إلى بجاية وسماها الناصرية، لتتحول في عقود قليلة إلى إحدى أبرز الحواضر السياسية والمينائية في المغرب الإسلامي.',
    },
    paragraphs: [
      {
        fr: 'Vers la fin du XIe siècle (à partir de 1067 selon les sources historiques médiévales), En-Nacer ben Alennas choisit le site défensif de Béjaïa pour fonder sa nouvelle capitale maritime, En-Naciria [2][4]. La cité s’entoure d’une vaste enceinte fortifiée dont subsistent des tronçons de remparts et l’emblématique porte maritime de Bab El Bhar [1][2].',
        ar: 'في النصف الثاني من القرن الحادي عشر (انطلاقاً من سنة 1067م وفق المصادر التاريخية)، اختار الأمير الناصر بن علناس موقع بجاية الحصين لبناء عاصمته البحرية الجديدة «الناصرية» [2][4]. وأُحيطت المدينة بسور دفاعي ضخم لا تزال بقاياه وأبرز أبوابه «باب البحر» شاهدة عليه [1][2].',
      },
      {
        fr: 'Le port hammadide accueille marchands italiens, catalans, andalous et orientaux, exportant cire d’abeille, laine, peaux et produits agricoles de la Soummam [4]. C’est la qualité exceptionnelle de la cire exportée depuis le port de « Bougie » qui donnera plus tard son nom au mot français « bougie » [2][4].',
        ar: 'استقبل ميناء الناصرية التجار من حوض المتوسط وأصدر الشمع والصوف والمنتجات الفلاحية لوادي الصومام [4]. وقد عُرفت المدينة بجودة شمعها إلى درجة أن الكلمة الفرنسية للشمعة (Bougie) اشتُقّت من اسم بجاية [2][4].',
      },
    ],
    pullQuote: {
      fr: 'Sous les Hammadides, Béjaïa unit la puissance d’un port méditerranéen à l’élan d’une capitale princière ouverte aux savoirs et aux arts.',
      ar: 'في العهد الحمادي، جمعت بجاية بين قوة الميناء المتوسطي وإشعاع العاصمة المنفتحة على العلوم والفنون.',
    },
    keyMilestones: [
      { fr: 'Fondation d’En-Naciria par le prince hammadide En-Nacer', ar: 'تأسيس الناصرية على يد الأمير الحمادي الناصر' },
      { fr: 'Construction de l’enceinte fortifiée et de Bab El Bhar', ar: 'تشييد الأسوار الدفاعية وباب البحر' },
      { fr: 'Rayonnement commercial : la cire de « Bougie » dans toute l’Europe', ar: 'الازدهار التجاري وتصدير الشمع البجاوي نحو أوروبا' },
    ],
    relatedDestinations: ['bab-el-bhar', 'remparts-hammadites', 'casbah-bejaia'],
    relatedFigures: ['en-nacer-ben-alennas'],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: {
        fr: 'Illustration de Bab El Bhar et des remparts hammadites de Béjaïa',
        ar: 'رسم توضيحي لباب البحر والأسوار الحمادية ببجاية',
      },
      caption: {
        fr: 'Évocation architecturale de l’arche de Bab El Bhar et des remparts hammadites',
        ar: 'تمثيل معماري لقوس باب البحر والأسوار الحمادية',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'era-medieval-savant',
    slug: 'medieval-savant',
    order: '03',
    dateRange: {
      fr: 'XIIe – XVe siècles · Foyer intellectuel et mathématique',
      ar: 'القرون 12 – 15م · منارة علمية ورياضية',
    },
    title: {
      fr: 'La cité savante de Fibonacci, d’Ibn Khaldoun et des maîtres de Kabylie',
      ar: 'حاضرة العلماء: فيبوناتشي وابن خلدون وأعلام بجاية',
    },
    subtitle: {
      fr: 'Rencontre des sciences mathématiques, du droit, du soufisme et de l’historiographie méditerranéenne',
      ar: 'ملتقى علوم الرياضيات والفقه والتصوف والتاريخ في حوض المتوسط',
    },
    summary: {
      fr: 'Après les Hammadides et sous les Almohades puis les Hafsides, Béjaïa conserve un prestige intellectuel exceptionnel. Savants locaux et voyageurs venus des deux rives y échangent manuscrits, savoirs mathématiques et pensée philosophique.',
      ar: 'بعد العهد الحمادي، وخلال العصرين الموحدي والحفصي، حافظت بجاية على مكانتها العلمية الرفيعة كجسر لتبادل المعارف بين ضفتي المتوسط.',
    },
    paragraphs: [
      {
        fr: 'À la fin du XIIe siècle, le jeune Pisan Leonardo Bonacci, connu sous le nom de Fibonacci, séjourne à Béjaïa auprès de son père, représentant des marchands de Pise [4]. Il y reçoit un enseignement mathématique qui l’initie aux chiffres indo-arabes et au calcul positionnel, qu’il popularisera ensuite en Europe dans le Liber Abaci (1202) [2][4].',
        ar: 'في أواخر القرن الثاني عشر، أقام العالم الإيطالي ليوناردو فيبوناتشي في بجاية برفقة والده الذي كان يمثل تجار بيزا، فتلقى فيها علوم الحساب والأرقام الهندية-العربية التي نقلها إلى أوروبا في كتابه الشهير «ليبر أباتشي» سنة 1202م [2][4].',
      },
      {
        fr: 'Aux XIIIe et XIVe siècles, Béjaïa brille également par ses savants maghrébins et andalous : le maître spirituel Sidi Boumediene y enseigne avant son départ pour Tlemcen, le juriste béjaoui Abderrahmane El-Waghlissi marque son époque, et le grand historien et sociologue Ibn Khaldoun y séjourne et exerce d’importantes responsabilités politiques et intellectuelles au XIVe siècle [4].',
        ar: 'وخلال القرنين الثالث عشر والرابع عشر، استقطبت بجاية أعلاماً بارزين في الفكر والفقه والتصوف، من بينهم سيدي بومدين، والفقيه البجاوي عبد الرحمن الوغليسي، والمفكر والمؤرخ الكبير عبد الرحمن بن خلدون الذي أقام ودرّس بالمدينة وتولى فيها مهام سامية [4].',
      },
    ],
    pullQuote: {
      fr: 'À Béjaïa, les chiffres indo-arabes transmis à Fibonacci et les leçons d’Ibn Khaldoun témoignent d’une ville-carrefour où circulaient les idées autant que les navires.',
      ar: 'في بجاية، تجسّد تعلّم فيبوناتشي للحساب وإقامة ابن خلدون مدينةً كانت معبراً للأفكار والمعارف بقدر ما كانت ميناءً للسفن.',
    },
    keyMilestones: [
      { fr: 'Séjour de Leonardo Fibonacci et apprentissage du calcul indo-arabe', ar: 'إقامة ليوناردو فيبوناتشي وتعلمه نظام الحساب العربي-الهندي' },
      { fr: 'Rayonnement d’Ibn Toumert et de Sidi Boumediene', ar: 'الإشعاع الروحي والعلمي لابن تومرت وسيدي بومدين' },
      { fr: 'Enseignement d’Abderrahmane El-Waghlissi et séjour d’Ibn Khaldoun', ar: 'تدريس عبد الرحمن الوغليسي وإقامة ابن خلدون في بجاية' },
    ],
    relatedDestinations: ['casbah-bejaia', 'bab-el-bhar', 'musee-bordj-moussa'],
    relatedFigures: ['fibonacci', 'ibn-khaldoun', 'el-waghlissi', 'sidi-boumediene'],
    sources: [COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: {
        fr: 'Illustration architecturale évoquant la cité médiévale savante de Béjaïa',
        ar: 'رسم معماري توضيحي يستحضر حاضرة بجاية العلمية في العصور الوسطى',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'era-ottoman-espagnol',
    slug: 'ottoman-espagnol',
    order: '04',
    dateRange: {
      fr: 'XVIe – XVIIIe siècles · Forts côtiers et époque ottomane',
      ar: 'القرون 16 – 18م · الحصون الساحلية والعهد العثماني',
    },
    title: {
      fr: 'Des conflits maritimes du XVIe siècle aux bastions ottomans',
      ar: 'من الصراعات البحرية في القرن 16م إلى التحصينات العثمانية',
    },
    subtitle: {
      fr: 'Consolidation de la Casbah, édification de Bordj Moussa, de Fort Sidi Abdelkader et de Fort Gouraya',
      ar: 'ترميم القصبة وبناء برج موسى وحصن سيدي عبد القادر وحصن قوراية',
    },
    summary: {
      fr: 'Au XVIe siècle, Béjaïa est au cœur des rivalités navales en Méditerranée occidentale. Après l’occupation espagnole (1510–1555) et la libération par Salah Raïs, la période ottomane renforce le système défensif qui domine encore la ville.',
      ar: 'في القرن السادس عشر، كانت بجاية في قلب التنافس البحري بغرب المتوسط. وبعد مرحلة الاحتلال الإسباني (1510–1555م) وتحريرها، تعزّزت منظومتها الدفاعية في العهد العثماني.',
    },
    paragraphs: [
      {
        fr: 'À partir de 1510, des fortifications sont remaniées ou érigées sur les points hauts de la ville afin de contrôler la rade, avant la reprise de Béjaïa par la Régence d’Alger menée par Salah Raïs en 1555 [1][4]. La Casbah de Béjaïa, Bordj Moussa (Fort Barral) et le Fort Sidi Abdelkader portent l’empreinte de ces couches architecturales superposées [1][2].',
        ar: 'منذ سنة 1510م أُعيد تحصين المرتفعات المطلة على الميناء، قبل أن يسترجعها صالح رايس سنة 1555م ضمن إيالة الجزائر [1][4]. وتحتفظ قصبة بجاية وبرج موسى وحصن سيدي عبد القادر بآثار هذه التحولات المعمارية المتعاقبة [1][2].',
      },
      {
        fr: 'Sur les crêtes dominant le port et la baie, les ouvrages d’observation comme Yemma Gouraya surveillent l’horizon maritime et forment un patrimoine monumental indissociable du relief béjaoui [1][2].',
        ar: 'وعلى القمم المشرفة على الميناء والخليج، انتصبت معالم المراقبة مثل يما قوراية لتشكّل جزءاً لا يتجزأ من الذاكرة المعمارية والجغرافية لبجاية [1][2].',
      },
    ],
    keyMilestones: [
      { fr: 'Consolidation des fortins côtiers et remaniement de la Casbah', ar: 'تدعيم الحصون الساحلية وإعادة تهيئة القصبة' },
      { fr: 'Reprise de la ville par Salah Raïs en 1555', ar: 'استرجاع المدينة بقيادة صالح رايس سنة 1555م' },
      { fr: 'Conservation de Bordj Moussa (aujourd’hui musée) et de Fort Sidi Abdelkader', ar: 'بقاء برج موسى (المتحف حالياً) وحصن سيدي عبد القادر' },
    ],
    relatedDestinations: ['casbah-bejaia', 'musee-bordj-moussa', 'fort-sidi-abdelkader', 'fort-gouraya'],
    relatedFigures: [],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration des hauteurs fortifiées du mont Gouraya dominant la baie de Béjaïa',
        ar: 'رسم توضيحي لمرتفعات قوراية المحصنة المطلة على خليج بجاية',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'era-contemporain',
    slug: 'contemporain',
    order: '05',
    dateRange: {
      fr: 'XIXe – XXIe siècles · Mémoire nationale & Kabylie vivante',
      ar: 'القرون 19 – 21م · الذاكرة الوطنية والقبائل المعاصرة',
    },
    title: {
      fr: 'De la vallée de la Soummam (1956) au patrimoine culturel contemporain',
      ar: 'من وادي الصومام (1956) إلى التراث الثقافي والطبيعي المعاصر',
    },
    subtitle: {
      fr: 'Congrès de la Soummam, villages de montagne, préservation UNESCO de Gouraya et essor culturel',
      ar: 'مؤتمر الصومام، القرى الجبلية، حماية اليونسكو لقوراية والنهضة الثقافية',
    },
    summary: {
      fr: 'À l’époque contemporaine, la Wilaya de Béjaïa est marquée par son rôle majeur dans l’histoire nationale — notamment le Congrès de la Soummam d’août 1956 — et par la vitalité de ses villages, de sa langue et de ses espaces protégés.',
      ar: 'في العصر الحديث، ارتبط اسم ولاية بجاية بمحطات بارزة في التاريخ الوطني، أبرزها مؤتمر الصومام في أوت 1956، إلى جانب حيوية قراها ولغتها ومحمياتها الطبيعية.',
    },
    paragraphs: [
      {
        fr: 'Au cœur des montagnes kabyles dominant la vallée de la Soummam, la région d’Ifri Ouzellaguen accueillit le 20 août 1956 le Congrès de la Soummam, moment fondateur d’organisation de la lutte d’indépendance algérienne [2][4]. La vallée demeure un territoire de mémoire où les paysages d’oliveraies côtoient les hauts lieux historiques.',
        ar: 'في قلب الجبال المطلة على وادي الصومام، احتضنت منطقة إفري أوزلاقن في 20 أوت 1956 مؤتمر الصومام الذي شكّل محطة تأسيسية كبرى في مسار الثورة التحريرية الجزائرية [2][4].',
      },
      {
        fr: 'Aujourd’hui, Béjaïa conjugue préservation écologique (classement du Parc national de Gouraya en réserve de biosphère UNESCO), transmission linguistique et artisanale kabyle, et valorisation d’un littoral s’étendant de Boulimat à Melbou [1][3].',
        ar: 'وتجمع بجاية اليوم بين حماية البيئة (تصنيف حظيرة قوراية كمحمية للمحيط الحيوي لدى اليونسكو)، وصون التراث اللغوي والحرفي القبائلي، وتثمين شريطها الساحلي الممتد من بوليمات إلى ملبو [1][3].',
      },
    ],
    keyMilestones: [
      { fr: '20 août 1956 : Congrès de la Soummam (Ifri Ouzellaguen)', ar: '20 أوت 1956: مؤتمر الصومام (إفري أوزلاقن)' },
      { fr: 'Préservation de la réserve de biosphère du Parc national de Gouraya', ar: 'حماية محمية المحيط الحيوي للحظيرة الوطنية لقوراية' },
      { fr: 'Vitalité de la culture, du tourisme durable et des villages de Kabylie', ar: 'حيوية الثقافة والسياحة المسؤولة والقرى القبائلية' },
    ],
    relatedDestinations: [
      'vallee-de-la-soummam',
      'village-uthrunen',
      'villages-traditionnels-bejaia',
      'parc-national-gouraya',
    ],
    relatedFigures: [],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.unesco, COMMON_CITATIONS.archives],
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: {
        fr: 'Illustration de la vallée de la Soummam et des villages kabyles contemporains',
        ar: 'رسم توضيحي لوادي الصومام والقرى القبائلية المعاصرة',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
];

export const HISTORICAL_FIGURES: HistoricalFigure[] = [
  {
    id: 'fig-en-nacer',
    slug: 'en-nacer-ben-alennas',
    name: {
      fr: 'En-Nacer ben Alennas',
      ar: 'الناصر بن علناس الحمادي',
    },
    dates: {
      fr: 'XIe siècle (règne hammadide documenté v. 1062–1088)',
      ar: 'القرن 11م (فترة حكمه ق. 1062–1088م)',
    },
    domain: {
      fr: 'Souverain bâtisseur · Dynastie hammadide',
      ar: 'أمير ومؤسس · الدولة الحمادية',
    },
    era: 'hammadide',
    bejaiaConnection: {
      fr: 'Fondateur de la cité hammadide d’En-Naciria (Béjaïa) à partir de 1067, dotée de palais, d’un port florissant et d’une enceinte fortifiée.',
      ar: 'مؤسس حاضرة الناصرية (بجاية) انطلاقاً من سنة 1067م، وباني أسوارها وقصورها ومينائها المزدهر.',
    },
    biography: [
      {
        fr: 'Issu de la dynastie berbère sanhadjienne des Hammadides, En-Nacer comprend la vulnérabilité des steppes intérieures et décide de déplacer le centre du pouvoir vers la côte méditerranéenne, sur le site abrité de Béjaïa [4].',
        ar: 'أدرك الأمير الحمادي الناصر بن علناس أهمية الانفتاح على البحر المتوسط، فاختار موقع بجاية المحصن بجبل قوراية لإقامة عاصمته البحرية الجديدة [4].',
      },
      {
        fr: 'Sous son impulsion, En-Naciria se pare de palais renommés dans les chroniques médiévales (tels que le palais de la Perle), de mosquées et de remparts ouvrant sur la mer par Bab El Bhar [2][4].',
        ar: 'في عهده ازدهرت الناصرية بقصورها الشهيرة في كتب التاريخ، ومساجدها، وأسوارها المنفتحة على البحر عبر باب البحر [2][4].',
      },
    ],
    relatedDestinations: ['bab-el-bhar', 'remparts-hammadites', 'casbah-bejaia'],
    sources: [COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  {
    id: 'fig-fibonacci',
    slug: 'fibonacci',
    name: {
      fr: 'Leonardo Pisano, dit Fibonacci',
      ar: 'ليوناردو بيزانو (فيبوناتشي)',
    },
    dates: {
      fr: 'v. 1170 – v. 1240/1250',
      ar: 'حوالي 1170 – حوالي 1240/1250م',
    },
    domain: {
      fr: 'Mathématiques · Transmission méditerranéenne',
      ar: 'الرياضيات · التبادل العلمي المتوسطي',
    },
    era: 'medieval-savant',
    bejaiaConnection: {
      fr: 'Élève à Béjaïa à la fin du XIIe siècle auprès de maîtres locaux alors que son père y dirigeait la représentation commerciale pisane.',
      ar: 'تعلّم في بجاية أواخر القرن الثاني عشر على يد شيوخها حين كان والده يمثل تجار بيزا بالميناء.',
    },
    biography: [
      {
        fr: 'Dans l’introduction de son ouvrage fondateur Liber Abaci (1202), Fibonacci rapporte lui-même avoir été appelé à Béjaïa dans son enfance par son père, notaire auprès des marchands pisans, afin d’y étudier l’art du calcul [4].',
        ar: 'في مقدمة كتابه التأسيسي «ليبر أباتشي» (1202م)، يروي فيبوناتشي أنه قدم في صغره إلى بجاية بدعوة من والده المكلّف بشؤون تجار بيزا ليتعلم بها أصول الحساب [4].',
      },
      {
        fr: 'C’est au contact de l’enseignement mathématique reçu à Béjaïa qu’il assimile les neuf chiffres indo-arabes et le zéro (zephirum), contribuant de manière décisive à leur adoption en Europe [2][4].',
        ar: 'بفضل تعلّمه في بجاية استوعب الأرقام الهندية-العربية والصفر، وأسهم في انتشارها بأوروبا [2][4].',
      },
    ],
    relatedDestinations: ['bab-el-bhar', 'casbah-bejaia', 'musee-bordj-moussa'],
    sources: [COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  {
    id: 'fig-ibn-khaldoun',
    slug: 'ibn-khaldoun',
    name: {
      fr: 'Abderrahmane Ibn Khaldoun',
      ar: 'عبد الرحمن بن خلدون',
    },
    dates: {
      fr: '1332 – 1406',
      ar: '1332 – 1406م',
    },
    domain: {
      fr: 'Historiographie · Sociologie · Philosophie de l’histoire',
      ar: 'علم التاريخ · العمران البشري · الفلسفة',
    },
    era: 'medieval-savant',
    bejaiaConnection: {
      fr: 'Séjourna, enseigna et exerça la charge de hadjib à Béjaïa au XIVe siècle (v. 1365–1366), laissant des pages précieuses sur la cité dans son œuvre.',
      ar: 'أقام ودرّس وتولى منصب الحجابة في بجاية خلال القرن الرابع عشر (حوالي 1365–1366م)، ووثّق أخبارها في مؤلفاته.',
    },
    biography: [
      {
        fr: 'Grand penseur méditerranéen et auteur de la Muqaddima, Ibn Khaldoun est intimement lié à l’histoire politique et savante de Béjaïa, où il fut appelé comme hadjib (chambellan) tout en enseignant à la mosquée de la Casbah [4].',
        ar: 'ارتبط المؤرخ ومؤسس علم العمران البشري ابن خلدون ببجاية في القرن الرابع عشر، حيث تولى فيها الحجابة ودرّس بجامع القصبة [4].',
      },
      {
        fr: 'Son témoignage historique dans le Kitab al-Ibar constitue l’une des sources fondamentales pour comprendre l’évolution des dynasties maghrébines et le rôle de Béjaïa entre mer et montagnes kabyles [4].',
        ar: 'وتُعد كتاباته في «كتاب العبر» من أهم المراجع التاريخية التي تناولت مكانة بجاية وتفاعلها مع جبال القبائل وحوض المتوسط [4].',
      },
    ],
    relatedDestinations: ['casbah-bejaia', 'remparts-hammadites', 'musee-bordj-moussa'],
    sources: [COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  {
    id: 'fig-el-waghlissi',
    slug: 'abderrahmane-el-waghlissi',
    name: {
      fr: 'Abderrahmane El-Waghlissi',
      ar: 'عبد الرحمن الوغليسي البجائي',
    },
    dates: {
      fr: 'XIVe siècle (décédé vers 1384 selon les notices biographiques)',
      ar: 'القرن 14م (توفي نحو 786هـ / 1384م)',
    },
    domain: {
      fr: 'Jurisprudence · Enseignement savant béjaoui',
      ar: 'الفقه · التدريس العلمي في بجاية',
    },
    era: 'medieval-savant',
    bejaiaConnection: {
      fr: 'Originaire de la région d’Aït Waghlis dans l’arrière-pays béjaoui, figure majeure de l’enseignement juridique et spirituel à Béjaïa au XIVe siècle.',
      ar: 'ينحدر من منطقة آيت وغليس بظهير بجاية، ويُعد من أبرز أعلام الفقه والتدريس في المدينة خلال القرن الرابع عشر.',
    },
    biography: [
      {
        fr: 'Savant formé dans les foyers intellectuels de la région de Béjaïa, Abderrahmane El-Waghlissi acquit une autorité reconnue dans tout le Maghreb grâce à ses traités juridiques et à son enseignement [4].',
        ar: 'نشأ عبد الرحمن الوغليسي في البيئة العلمية لبجاية ونال مكانة مرموقة في المغرب الإسلامي بفضل مؤلفاته الفقهية وتلاميذه [4].',
      },
      {
        fr: 'Son parcours illustre l’interaction étroite entre les villages savants de l’arrière-pays montagneux et les chaires d’enseignement de la cité côtière [4].',
        ar: 'ويجسّد مساره الترابط الوثيق بين قرى العلم في الجبال المحيطة ومدارس حاضرة بجاية الساحلية [4].',
      },
    ],
    relatedDestinations: ['vallee-de-la-soummam', 'casbah-bejaia'],
    sources: [COMMON_CITATIONS.archives],
  },
  {
    id: 'fig-sidi-boumediene',
    slug: 'sidi-boumediene-et-ibn-toumert',
    name: {
      fr: 'Sidi Boumediene & Ibn Toumert à Béjaïa',
      ar: 'سيدي بومدين الغوث وابن تومرت في بجاية',
    },
    dates: {
      fr: 'XIIe siècle (séjours documentés à Béjaïa)',
      ar: 'القرن 12م (إقامات موثقة في بجاية)',
    },
    domain: {
      fr: 'Spiritualité · Pensée religieuse et rayonnement maghrébin',
      ar: 'التصوف والفكر الديني · الإشعاع المغاربي',
    },
    era: 'medieval-savant',
    bejaiaConnection: {
      fr: 'Béjaïa accueillit au XIIe siècle les enseignements de Sidi Boumediene (Chouaïb ibn al-Husayn al-Ansari) et le passage d’Ibn Toumert.',
      ar: 'استقبلت بجاية في القرن الثاني عشر حلقات سيدي بومدين الغوث ومرور ابن تومرت بها.',
    },
    biography: [
      {
        fr: 'Né en Andalousie, Sidi Boumediene enseigna de longues années à Béjaïa au XIIe siècle, attirant des disciples venus de tout le Maghreb et d’Al-Andalus avant de mourir près de Tlemcen [4].',
        ar: 'درّس سيدي بومدين الأندلسي لسنوات طويلة في بجاية خلال القرن الثاني عشر، واستقطب طلبته من مختلف أنحاء المغرب والأندلس [4].',
      },
      {
        fr: 'À la même époque, la cité hammadide puis almohade était également fréquentée par des penseurs et réformateurs tels qu’Ibn Toumert (au début du XIIe siècle, près de Mellala dans les environs), confirmant le statut de Béjaïa comme pôle majeur de débats intellectuels [4].',
        ar: 'كما شهدت المدينة وأحوازها في الفترة نفسها محطات فكرية بارزة، من بينها مرور ابن تومرت قرب ملالة، مما يرسخ مكانة بجاية كمركز نقاش علمي وروحي [4].',
      },
    ],
    relatedDestinations: ['casbah-bejaia', 'remparts-hammadites'],
    sources: [COMMON_CITATIONS.archives],
  },
];

export const MEDINA_STRATA: MedinaLayer[] = [
  {
    id: 'strate-hammadide',
    order: '01',
    title: {
      fr: 'Enceinte et porte maritime hammadides (En-Naciria)',
      ar: 'السور والباب البحري الحمادي (الناصرية)',
    },
    period: { fr: 'XIe – XIIe siècles', ar: 'القرنان 11 – 12م' },
    attestationStatus: 'attested_vestiges',
    description: {
      fr: 'L’enceinte urbaine d’En-Naciria ceinturait les pentes du Gouraya jusqu’au port. Bab El Bhar (« Porte de la Mer ») et plusieurs tronçons des remparts hammadites demeurent visibles dans le tissu urbain.',
      ar: 'أحاط السور الحمادي بمنحدرات قوراية وصولاً إلى الميناء، ولا يزال باب البحر ومقاطع من الأسوار شاخصة حتى اليوم.',
    },
    attestationNote: {
      fr: 'Vestiges monumentaux attestés sur site (Bab El Bhar et sections de remparts classées).',
      ar: 'شواهد معمارية قائمة ومصنفة في الموقع (باب البحر ومقاطع الأسوار).',
    },
    relatedDestinations: ['bab-el-bhar', 'remparts-hammadites'],
  },
  {
    id: 'strate-casbah',
    order: '02',
    title: {
      fr: 'La Casbah de Béjaïa : superposition médiévale, espagnole et ottomane',
      ar: 'قصبة بجاية: تداخل العصور الوسطى والإسبانية والعثمانية',
    },
    period: { fr: 'XIIe – XIXe siècles', ar: 'القرون 12 – 19م' },
    attestationStatus: 'attested_vestiges',
    description: {
      fr: 'Édifiée à l’origine sous les souverains médiévaux puis réaménagée au XVIe siècle et à l’époque ottomane, la Casbah constitue une citadelle urbaine majeure dominant l’ancien port.',
      ar: 'أُقيمت القصبة منذ العصر الوسيط وأُعيد تحصينها في القرن السادس عشر والعهد العثماني، وتعد قلعة حضرية كبرى تطل على الميناء القديم.',
    },
    attestationNote: {
      fr: 'Ensemble architectural classé, restauré par tranches et documenté par les sources institutionnelles.',
      ar: 'معلم معماري مصنف وموثق في المصادر الرسمية.',
    },
    relatedDestinations: ['casbah-bejaia'],
  },
  {
    id: 'strate-bordj-moussa',
    order: '03',
    title: {
      fr: 'Bordj Moussa et le fort Sidi Abdelkader : défense portuaire',
      ar: 'برج موسى وحصن سيدي عبد القادر: حماية الميناء',
    },
    period: { fr: 'XVIe – XVIIIe siècles', ar: 'القرون 16 – 18م' },
    attestationStatus: 'attested_vestiges',
    description: {
      fr: 'Positionné sur un promontoire stratégique, Bordj Moussa abrite aujourd’hui le musée municipal et des collections archéologiques, tandis que le Fort Sidi Abdelkader veillait directement sur l’entrée du mouillage.',
      ar: 'يقع برج موسى على ربوة استراتيجية ويحتضن اليوم المتحف البلدي، فيما كان حصن سيدي عبد القادر يراقب مدخل المرسى.',
    },
    attestationNote: {
      fr: 'Monuments préservés ; la vérification des horaires d’ouverture du musée s’effectue sur place ou via la DTA.',
      ar: 'معالم قائمة؛ يُرجى التحقق من مواعيد فتح المتحف محلياً أو عبر مديرية السياحة.',
    },
    relatedDestinations: ['musee-bordj-moussa', 'fort-sidi-abdelkader'],
  },
  {
    id: 'strate-gouraya',
    order: '04',
    title: {
      fr: 'Fort Gouraya (Yemma Gouraya) : vigie sommitale',
      ar: 'حصن قوراية (يما قوراية): برج المراقبة العلوي',
    },
    period: { fr: 'XVIe – XIXe siècles (sommet sacré plus ancien)', ar: 'القرون 16 – 19م (مع ذاكرة روحية أقدم)' },
    attestationStatus: 'attested_vestiges',
    description: {
      fr: 'Dominant le golfe à plus de 600 m d’altitude, le fort couronne le mont Gouraya et permettait de surveiller les approches maritimes et terrestres de toute la baie.',
      ar: 'يتربع الحصن على قمة جبل قوراية المطل على الخليج، وسمح تاريخياً بمراقبة المداخل البحرية والبرية للمدينة.',
    },
    attestationNote: {
      fr: 'Ouvrage sommital accessible par la route panoramique et les sentiers du parc national.',
      ar: 'معلم علوي يُوصل إليه عبر الطريق البانورامي ومسارات الحظيرة الوطنية.',
    },
    relatedDestinations: ['fort-gouraya', 'mont-gouraya', 'parc-national-gouraya'],
  },
  {
    id: 'strate-saldae',
    order: '05',
    title: {
      fr: 'Strate antique de Saldae (traces urbaines enfouies)',
      ar: 'الطبقة الأثرية لصالدا الرومانية (شواهد تحت المدينة الحديثة)',
    },
    period: { fr: 'Antiquité (Ier – Ve siècles)', ar: 'العصر القديم (القرون 1 – 5م)' },
    attestationStatus: 'partial_traces',
    description: {
      fr: 'Contrairement aux remparts médiévaux encore en élévation, la ville romaine de Saldae est essentiellement connue par des découvertes ponctuelles, des mosaïques et des inscriptions conservées au musée.',
      ar: 'بخلاف الأسوار الوسيطة القائمة، تُعرف مدينة صالدا الرومانية أساساً عبر مكتشفات متفرقة وفسيفساء ونقائش محفوظة في المتحف.',
    },
    attestationNote: {
      fr: 'Aucun tracé complet de rue antique n’est reconstitué sans fouille ; seules les pièces conservées sont attestées.',
      ar: 'لا يُرسم أي تخطيط مكتمل للشوارع القديمة دون حفريات مؤكدة.',
    },
    relatedDestinations: ['musee-bordj-moussa', 'toudja'],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'gl-bab',
    term: 'Bab (الباب)',
    arabicScript: 'باب',
    kabyleTerm: 'Tawwurt (à confirmer selon toponymie locale)',
    kabyleStatus: 'pending_official_validation',
    category: 'architecture',
    definition: {
      fr: 'Porte monumentale intégrée à une enceinte fortifiée urbaine, comme Bab El Bhar (« Porte de la Mer ») à Béjaïa.',
      ar: 'بوابة ضخمة ضمن سور المدينة المحصنة، مثل باب البحر التاريخي ببجاية.',
    },
    relatedDestinations: ['bab-el-bhar', 'remparts-hammadites'],
  },
  {
    id: 'gl-bordj',
    term: 'Bordj (البرج)',
    arabicScript: 'برج',
    kabyleTerm: 'Lberǧ',
    kabyleStatus: 'validated_common',
    category: 'architecture',
    definition: {
      fr: 'Tour de garde, bastion ou fortin défensif stratégique dominant un port ou un col, tel que Bordj Moussa.',
      ar: 'حصن أو برج مراقبة ودفاع استراتيجي يشرف على ميناء أو ممر، مثل برج موسى.',
    },
    relatedDestinations: ['musee-bordj-moussa', 'fort-gouraya'],
  },
  {
    id: 'gl-casbah',
    term: 'Casbah (القصبة)',
    arabicScript: 'قصبة',
    kabyleTerm: 'Lqesba',
    kabyleStatus: 'validated_common',
    category: 'architecture',
    definition: {
      fr: 'Citadelle fortifiée abritant le commandement militaire, administratif et parfois des édifices religieux au cœur ou au sommet de la cité.',
      ar: 'قلعة محصنة تضم مرافق القيادة والحكم والدفاع داخل المدينة التاريخية.',
    },
    relatedDestinations: ['casbah-bejaia'],
  },
  {
    id: 'gl-tajmaat',
    term: 'Tajmaât (تجمعت)',
    arabicScript: 'تجمعت',
    kabyleTerm: 'Tajmaɛt',
    kabyleStatus: 'validated_common',
    category: 'tradition',
    definition: {
      fr: 'Assemblée coutumière du village kabyle où se règlent les affaires collectives, la solidarité et les travaux d’intérêt commun.',
      ar: 'مجلس القرية القبائلية التقليدي لتدبير الشؤون الجماعية والصلح والأشغال المشتركة.',
    },
    relatedDestinations: ['village-uthrunen', 'villages-traditionnels-bejaia'],
  },
  {
    id: 'gl-tiwizi',
    term: 'Tiwizi (تويزة)',
    arabicScript: 'تويزة',
    kabyleTerm: 'Tiwizi',
    kabyleStatus: 'validated_common',
    category: 'tradition',
    definition: {
      fr: 'Pratique ancestrale d’entraide collective et bénévole entre habitants (récolte des olives, construction, entretien des chemins).',
      ar: 'تقليد عريق للتضامن والتطوع الجماعي بين أهالي القرية في المواسم الفلاحية والأشغال العامة.',
    },
    relatedDestinations: ['vallee-de-la-soummam', 'villages-traditionnels-bejaia'],
  },
  {
    id: 'gl-ighzer',
    term: 'Ighzer / Chabet',
    arabicScript: 'إغزر / شعبة',
    kabyleTerm: 'Iɣzer',
    kabyleStatus: 'validated_common',
    category: 'geographie',
    definition: {
      fr: 'Ravin, gorge encaissée ou cours d’eau saisonnier sculptant les massifs calcaires kabyles (comme Chabet El Akra à Kherrata).',
      ar: 'وادي ضيق أو مضيق جبلي نحتته المياه في الصخور الكلسية، مثل شعبة الآخرة بخراطة.',
    },
    relatedDestinations: ['gorges-kherrata-chabet-el-akra'],
  },
  {
    id: 'gl-azetta',
    term: 'Azetta (أزطا)',
    arabicScript: 'أزطا',
    kabyleTerm: 'Azeṭṭa',
    kabyleStatus: 'validated_common',
    category: 'tradition',
    definition: {
      fr: 'Métier à tisser vertical traditionnel et, par extension, l’art du tissage domestique des tapis, burnous et couvertures en Kabylie.',
      ar: 'المنسج التقليدي العمودي وفن نسج الزرابي والبرنوس في منطقة القبائل.',
    },
    relatedDestinations: ['villages-traditionnels-bejaia'],
  },
  {
    id: 'gl-tajewwaqt',
    term: 'Tajewwaqt',
    arabicScript: 'تاجواقت / القصبة',
    kabyleTerm: 'Tajewwaqt',
    kabyleStatus: 'pending_official_validation',
    category: 'tradition',
    definition: {
      fr: 'Flûte oblique traditionnelle en roseau accompagnant le chant pastoral, la poésie orale et les musiques kabyles.',
      ar: 'ناي تقليدي من القصب يصاحب الغناء والشعر الشعبي القبائلي.',
    },
    relatedDestinations: ['village-uthrunen'],
  },
  {
    id: 'gl-aghroum',
    term: 'Aghroum',
    arabicScript: 'أغروم',
    kabyleTerm: 'Aɣrum',
    kabyleStatus: 'validated_common',
    category: 'tradition',
    definition: {
      fr: 'Galette de semoule traditionnelle cuite sur un plat de terre cuite (taḍunt / tajine), déclinée avec huile d’olive ou herbes sauvages.',
      ar: 'خبز تقليدي من السميد يُطهى على الطاجين الفخاري، يُقدّم مع زيت الزيتون أو الأعشاب.',
    },
    relatedDestinations: ['vallee-de-la-soummam', 'toudja'],
  },
  {
    id: 'gl-saldae',
    term: 'Saldae (صالدا)',
    arabicScript: 'صالدا',
    kabyleTerm: 'Saldae (toponyme antique)',
    kabyleStatus: 'pending_official_validation',
    category: 'geographie',
    definition: {
      fr: 'Nom antique de Béjaïa, colonie maritime et port romain relié aux sources de Toudja par un aqueduc célèbre.',
      ar: 'الاسم القديم لمدينة بجاية في العهد الروماني وميناؤها المرتبط بقناة توجة.',
    },
    relatedDestinations: ['toudja', 'musee-bordj-moussa'],
  },
  {
    id: 'gl-ennaciria',
    term: 'En-Naciria (الناصرية)',
    arabicScript: 'الناصرية',
    kabyleTerm: 'Bgayet (ⴱⴳⴰⵢⴻⵜ)',
    kabyleStatus: 'validated_common',
    category: 'architecture',
    definition: {
      fr: 'Nom donné au XIe siècle à Béjaïa par le souverain hammadide En-Nacer lorsqu’il en fit sa capitale maritime et savante.',
      ar: 'التسمية التي أطلقها الأمير الحمادي الناصر على بجاية في القرن الحادي عشر حين اتخذها عاصمة له.',
    },
    relatedDestinations: ['bab-el-bhar', 'remparts-hammadites', 'casbah-bejaia'],
  },
  {
    id: 'gl-akfadou',
    term: 'Akfadou (أكفادو)',
    arabicScript: 'أكفادو',
    kabyleTerm: 'Akfadu',
    kabyleStatus: 'validated_common',
    category: 'geographie',
    definition: {
      fr: 'Grand massif forestier humide d’altitude situé entre les wilayas de Béjaïa et Tizi Ouzou, refuge de chênaies caducifoliées.',
      ar: 'غابة جبلية رطبة شاسعة تمتد بين ولايتي بجاية وتيزي وزو وتشتهر بأشجار البلوط.',
    },
    relatedDestinations: ['foret-akfadou'],
  },
];

export const NATURALIST_DOSSIERS: NaturalistDossier[] = [
  {
    id: 'nat-gouraya',
    slug: 'ecosysteme-parc-gouraya',
    title: {
      fr: 'Massif et littoral du Parc national de Gouraya',
      ar: 'النظام البيئي والساحلي للحظيرة الوطنية لقوراية',
    },
    subtitle: {
      fr: 'Réserve de biosphère UNESCO entre falaises calcaires, pinèdes littorales et faune méditerranéenne',
      ar: 'محمية اليونسكو للمحيط الحيوي بين الجروف الكلسية والغابات الساحلية',
    },
    ecosystemType: {
      fr: 'Écosystème marin, falaises littorales et maquis méditerranéen',
      ar: 'نظام بيئي بحري وجروف ساحلية وأحراش متوسطية',
    },
    summary: {
      fr: 'Le Parc national de Gouraya protège une mosaïque rare d’habitats côtiers et montagneux abritant le macaque de Barbarie (Macaca sylvanus) ainsi qu’une flore méditerranéenne endémique.',
      ar: 'تحمي الحظيرة الوطنية لقوراية فسيفساء نادرة من الموائل الساحلية والجبلية، وتؤوي قرد المكاك البربري ونباتات متوسطية أصيلة.',
    },
    sections: [
      {
        heading: { fr: 'Géomorphologie spectaculaire', ar: 'التكوين الجيومورفولوجي' },
        body: {
          fr: 'Les calcaires dolomitiques du Cap Carbon, du Pic des Singes et du Mont Gouraya plongent directement dans les eaux du golfe de Béjaïa, créant grottes marines, arches naturelles et belvédères [1][3].',
          ar: 'تنحدر الصخور الكلسية في رأس كربون وقمة القردة وجبل قوراية مباشرة نحو مياه خليج بجاية، مشكّلة أقواساً بحرية ومطلات شاهقة [1][3].',
        },
      },
      {
        heading: { fr: 'Charte d’observation de la faune', ar: 'ميثاق مراقبة الحياة البرية' },
        body: {
          fr: 'Le macaque de Barbarie (magot) est une espèce protégée. Il est impératif de ne jamais le nourrir ni de s’approcher excessivement afin de préserver son autonomie alimentaire et sa santé [1][2].',
          ar: 'يُعد المكاك البربري نوعاً محمياً؛ لذا يُمنع إطعامه أو الاقتراب المفرط منه حفاظاً على سلوكه الطبيعي وسلامة الزوار [1][2].',
        },
      },
    ],
    speciesOrFormations: [
      { fr: 'Macaque de Barbarie (Macaca sylvanus)', ar: 'قرد المكاك البربري' },
      { fr: 'Pin d’Alep, olivier sauvage et maquis littoral', ar: 'الصنوبر الحلبي والزيتون البري والأحراش الساحلية' },
      { fr: 'Falaises calcaires et arche naturelle du Cap Carbon', ar: 'الجروف الكلسية والقوس البحري لرأس كربون' },
    ],
    relatedDestinations: ['parc-national-gouraya', 'cap-carbon', 'mont-gouraya', 'pic-des-singes', 'baie-des-aiguades'],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.unesco, COMMON_CITATIONS.guide],
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration naturaliste du Parc national de Gouraya et de ses falaises boisées',
        ar: 'رسم توضيحي للطبيعة في الحظيرة الوطنية لقوراية',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'nat-akfadou',
    slug: 'chenaies-foret-akfadou',
    title: {
      fr: 'Chênaies caducifoliées et zones humides d’Akfadou',
      ar: 'غابات البلوط والمناطق الرطبة في أكفادو',
    },
    subtitle: {
      fr: 'Une forêt de montagne tempérée exceptionnelle en Afrique du Nord',
      ar: 'غابة جبلية رطبة متفردة في شمال إفريقيا',
    },
    ecosystemType: {
      fr: 'Forêt caducifoliée d’altitude et mares forestières (agoulmim)',
      ar: 'غابة جبلية نفضية وبحيرات غابية (أقولميم)',
    },
    summary: {
      fr: 'À l’ouest de la Wilaya de Béjaïa (secteur d’Adekar), le massif de l’Akfadou conserve des peuplements remarquables de chêne zeen et de chêne afarès, rares sous ces latitudes.',
      ar: 'في الجهة الغربية من ولاية بجاية (أدكار)، تحتفظ غابة أكفادو بتجمعات نادرة من أشجار البلوط الزان والأفارس.',
    },
    sections: [
      {
        heading: { fr: 'Chêne zeen et chêne afarès', ar: 'بلوط الزان وبلوط الأفارس' },
        body: {
          fr: 'Grâce à une forte pluviométrie hivernale et à l’altitude, l’Akfadou offre en automne des teintes dorées et rousses spectaculaires, contrastant avec les maquis persistants du littoral [1][2].',
          ar: 'بفضل التساقطات المطرية والارتفاع الجبلي، تتلون غابة أكفادو في الخريف بألوان ذهبية دافئة تختلف عن الغطاء النباتي الساحلي [1][2].',
        },
      },
      {
        heading: { fr: 'Prévention et accès responsable', ar: 'الوقاية والولوج المسؤول' },
        body: {
          fr: 'Les feux de forêt en été et la sensibilité des zones humides imposent de rester sur les pistes autorisées et de vérifier l’état d’ouverture auprès des services forestiers locaux [5].',
          ar: 'يستلزم الحفاظ على الغابة تجنب إشعال النار والالتزام بالمسالك المرخصة والتحقق من حالة الطرق الجبلية شتاءً [5].',
        },
      },
    ],
    speciesOrFormations: [
      { fr: 'Chêne zeen (Quercus canariensis) et chêne afarès (Quercus afares)', ar: 'بلوط الزان وبلوط الأفارس' },
      { fr: 'Mares d’altitude et sources forestières', ar: 'المسطحات المائية والينابيع الغابية' },
      { fr: 'Sous-bois de fougères et houblonnières humides', ar: 'نباتات الظل والرطوبة الجبلية' },
    ],
    relatedDestinations: ['foret-akfadou', 'sources-thermales-adekar'],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.terrain],
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration des forêts montagneuses et sentiers ombragés de Béjaïa',
        ar: 'رسم توضيحي للغابات الجبلية في ولاية بجاية',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
  {
    id: 'nat-karst-aokas-kherrata',
    slug: 'karst-aokas-et-gorges-kherrata',
    title: {
      fr: 'Karst littoral d’Aokas et gorges de Chabet El Akra',
      ar: 'التكوينات الكارستية في أوقاس ومضائق خراطة',
    },
    subtitle: {
      fr: 'Sculptures géologiques façonnées par l’eau et les chaînes des Babors',
      ar: 'منحوتات جيولوجية شكلتها المياه في سلسلة البابور',
    },
    ecosystemType: {
      fr: 'Karst calcaire souterrain et canyon fluvial des Babors',
      ar: 'مغارات كلسية جوفية ومضيق نهري في جبال البابور',
    },
    summary: {
      fr: 'À l’est de Béjaïa, les massifs calcaires des Babors livrent deux visages géologiques majeurs : les concrétions souterraines des grottes féeriques d’Aokas et la faille vertigineuse de Chabet El Akra à Kherrata.',
      ar: 'في الجهة الشرقية من بجاية، تكشف جبال البابور عن وجهين جيولوجيين بارزين: المغارات العجيبة في أوقاس ومضائق شعبة الآخرة بخراطة.',
    },
    sections: [
      {
        heading: { fr: 'Les concrétions d’Aokas', ar: 'الترسبات الكلسية بمغارة أوقاس' },
        body: {
          fr: 'Formées par la dissolution lente du calcaire et la précipitation minérale millénaire, les grottes d’Aokas offrent stalactites, stalagmites et draperies fragiles protégées par une visite encadrée [1][2].',
          ar: 'تشكلت مغارات أوقاس عبر ذوبان الصخور الكلسية وترسب المعادن عبر آلاف السنين، لتنتج صواعد ونوازل دقيقة تُزار وفق مسار مؤطر [1][2].',
        },
      },
      {
        heading: { fr: 'Le passage des gorges de Kherrata', ar: 'ممر مضائق خراطة' },
        body: {
          fr: 'Creusées par l’oued Agrioun entre les parois abruptes des Babors, les gorges de Chabet El Akra constituent une percée naturelle spectaculaire reliant le littoral béjaoui aux hauts plateaux sétifiens [1][2].',
          ar: 'نحت واد أقريون مضائق شعبة الآخرة بين جدران صخرية شاهقة في سلسلة البابور، ليشكل ممراً طبيعياً يصل ساحل بجاية بالهضاب العليا [1][2].',
        },
      },
    ],
    speciesOrFormations: [
      { fr: 'Stalactites, stalagmites et concrétions karstiques d’Aokas', ar: 'الصواعد والنوازل الكلسية بأوقاس' },
      { fr: 'Parois calcaires des Babors et oued Agrioun', ar: 'الجروف الصخرية للبابور ووادي أقريون' },
      { fr: 'Littoral rocheux et criques de la côte Est', ar: 'الساحل الصخري وخلجان الساحل الشرقي' },
    ],
    relatedDestinations: ['grottes-aokas', 'gorges-kherrata-chabet-el-akra', 'paysages-cotiers-aokas', 'melbou'],
    sources: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
    coverImage: {
      src: '/images/aokas-coast.jpg',
      alt: {
        fr: 'Illustration du littoral montagneux d’Aokas et des reliefs des Babors',
        ar: 'رسم توضيحي للساحل الجبلي لأوقاس وتضاريس البابور',
      },
      source: 'Béjaïa Explorer — Illustration éditoriale IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
  },
];

export const DESTINATION_HISTORY_META: Record<string, DestinationHistoryMeta> = {
  'parc-national-gouraya': {
    eras: ['patrimoine-naturel', 'ottoman-espagnol', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.unesco],
  },
  'cap-carbon': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'mont-gouraya': {
    eras: ['patrimoine-naturel', 'ottoman-espagnol'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.unesco],
  },
  'pic-des-singes': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.unesco],
  },
  'baie-des-aiguades': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'foret-akfadou': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.terrain],
  },
  'gorges-kherrata-chabet-el-akra': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'grottes-aokas': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.terrain],
  },
  'paysages-cotiers-aokas': {
    eras: ['patrimoine-naturel'],
    citations: [COMMON_CITATIONS.dta],
  },
  tichy: {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'plage-aokas': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta],
  },
  boulimat: {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  saket: {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta],
  },
  'souk-el-tenine': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta],
  },
  melbou: {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'casbah-bejaia': {
    eras: ['hammadide', 'medieval-savant', 'ottoman-espagnol'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  'bab-el-bhar': {
    eras: ['hammadide', 'medieval-savant'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  'remparts-hammadites': {
    eras: ['hammadide', 'medieval-savant'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.archives],
  },
  'fort-gouraya': {
    eras: ['ottoman-espagnol', 'patrimoine-naturel'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'fort-sidi-abdelkader': {
    eras: ['ottoman-espagnol'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.archives],
  },
  'musee-bordj-moussa': {
    eras: ['antiquite', 'hammadide', 'medieval-savant', 'ottoman-espagnol'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.terrain],
  },
  'village-uthrunen': {
    eras: ['contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  toudja: {
    eras: ['antiquite', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  'vallee-de-la-soummam': {
    eras: ['medieval-savant', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide, COMMON_CITATIONS.archives],
  },
  'villages-traditionnels-bejaia': {
    eras: ['contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.guide],
  },
  'sources-thermales-tifra': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.terrain],
  },
  'sources-thermales-adekar': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.terrain],
  },
  'sources-thermales-bouhamza': {
    eras: ['patrimoine-naturel', 'contemporain'],
    citations: [COMMON_CITATIONS.dta, COMMON_CITATIONS.terrain],
  },
};

export const ERA_FILTER_OPTIONS: { slug: EraSlug | 'all'; label: LocalizedText }[] = [
  { slug: 'all', label: { fr: 'Toutes les époques', ar: 'جميع الحقب' } },
  { slug: 'antiquite', label: { fr: 'Antiquité (Saldae)', ar: 'العصور القديمة (صالدا)' } },
  { slug: 'hammadide', label: { fr: 'Âge d’or hammadide', ar: 'العصر الحمادي' } },
  { slug: 'medieval-savant', label: { fr: 'Cité savante médiévale', ar: 'الحاضرة العلمية الوسيطة' } },
  { slug: 'ottoman-espagnol', label: { fr: 'Forts côtiers & ottoman', ar: 'الحصون والعهد العثماني' } },
  { slug: 'contemporain', label: { fr: 'Mémoire & Kabylie vivante', ar: 'الذاكرة والقبائل المعاصرة' } },
  { slug: 'patrimoine-naturel', label: { fr: 'Patrimoine naturel', ar: 'التراث الطبيعي' } },
];

export function getDestinationEras(slug: string): EraSlug[] {
  return DESTINATION_HISTORY_META[slug]?.eras ?? ['contemporain'];
}

export function getDestinationCitations(slug: string): SourceCitation[] {
  return DESTINATION_HISTORY_META[slug]?.citations ?? [COMMON_CITATIONS.dta];
}

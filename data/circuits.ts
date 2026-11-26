import type { Circuit } from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain certifiée)';

export const CIRCUITS: Circuit[] = [
  {
    id: 'circuit-bejaia-historique',
    slug: 'bejaia-historique',
    title: {
      fr: 'Béjaïa historique — Sur les traces d’En-Naciria',
      ar: 'بجاية التاريخية — على خطى الناصرية',
    },
    subtitle: {
      fr: 'Citadelle, porte marine, remparts hammadites et musée de la vieille ville',
      ar: 'القصبة وباب البحر والأسوار الحمادية ومتحف المدينة القديمة',
    },
    description: {
      fr: 'Un parcours patrimonial au cœur de la vieille ville de Béjaïa reliant les vestiges majeurs de son passé hammadite, méditerranéen et défensif.',
      ar: 'مسار تراثي في قلب المدينة القديمة لبجاية يربط أبرز شواهد تاريخها الحمادي والمتوسطي والدفاعي.',
    },
    theme: 'historique',
    destinationSlugs: [
      'bab-el-bhar',
      'casbah-bejaia',
      'remparts-hammadites',
      'musee-bordj-moussa',
      'fort-sidi-abdelkader',
    ],
    durationNote: {
      fr: 'Durée libre selon le rythme de visite de chaque monument (aucun temps de trajet non vérifié n’est estimé).',
      ar: 'المدة مرنة حسب وتيرة زيارة كل معلم (لا يتم افتراض أوقات تنقل غير موثقة).',
    },
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: {
        fr: 'Illustration du circuit Béjaïa historique',
        ar: 'رسم توضيحي لمسار بجاية التاريخية',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Découverte de l’héritage hammadite et de Saldae', ar: 'اكتشاف الإرث الحمادي وتاريخ صالدا' },
      { fr: 'Parcours adapté à la marche dans le centre ancien', ar: 'مسار مناسب للمشي في الوسط التاريخي' },
    ],
    source: 'Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)',
  },
  {
    id: 'circuit-parc-gouraya',
    slug: 'decouverte-parc-national-gouraya',
    title: {
      fr: 'Découverte du Parc national de Gouraya',
      ar: 'اكتشاف الحظيرة الوطنية لقوراية',
    },
    subtitle: {
      fr: 'Sommets panoramiques, falaises calcaires, faune sauvage et criques turquoise',
      ar: 'قمم بانورامية وجروف كلسية وحياة برية وخلجان صافية',
    },
    description: {
      fr: 'L’itinéraire incontournable pour embrasser toute la magie naturelle de Béjaïa, du fort perché sur le Mont Gouraya au phare du Cap Carbon et aux eaux limpides des Aiguades.',
      ar: 'المسار الأبرز لاكتشاف السحر الطبيعي لبجاية، من حصن قمة قوراية إلى منارة رأس كربون ومياه خليج ليغواد.',
    },
    theme: 'naturel',
    destinationSlugs: [
      'parc-national-gouraya',
      'mont-gouraya',
      'fort-gouraya',
      'pic-des-singes',
      'cap-carbon',
      'baie-des-aiguades',
    ],
    durationNote: {
      fr: 'Itinéraire modulable sur une journée ou deux demi-journées selon les randonnées choisies.',
      ar: 'مسار قابل للتكييف على يوم كامل أو نصفي يوم حسب مسارات المشي المختارة.',
    },
    coverImage: {
      src: '/images/hero-cap-carbon.jpg',
      alt: {
        fr: 'Illustration du circuit Parc national de Gouraya et Cap Carbon',
        ar: 'رسم توضيحي لمسار الحظيرة الوطنية لقوراية ورأس كربون',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Réserve de biosphère UNESCO et panoramas marins', ar: 'محمية اليونسكو للمحيط الحيوي ومطلات بحرية' },
      { fr: 'Observation respectueuse du macaque de Barbarie', ar: 'مراقبة مسؤولة لقرد المكاك البربري' },
    ],
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria)',
  },
  {
    id: 'circuit-plages-cote-est',
    slug: 'plages-cote-est',
    title: {
      fr: 'Circuit des plages de la côte Est',
      ar: 'مسار شواطئ الساحل الشرقي',
    },
    subtitle: {
      fr: 'De Tichy à Melbou en passant par les grottes féeriques d’Aokas',
      ar: 'من تيشي إلى ملبو مروراً بالمغارات العجيبة بأوقاس',
    },
    description: {
      fr: 'Un itinéraire lumineux longeant la corniche orientale de Béjaïa, associant stations balnéaires familiales, merveilles karstiques et criques adossées aux Babors.',
      ar: 'مسار ساحلي مشرق على طول الكورنيش الشرقي لبجاية يجمع بين الشواطئ العائلية والمغارات الكلسية وسفوح البابور.',
    },
    theme: 'balneaire',
    destinationSlugs: [
      'tichy',
      'plage-aokas',
      'grottes-aokas',
      'paysages-cotiers-aokas',
      'souk-el-tenine',
      'melbou',
    ],
    durationNote: {
      fr: 'Parcours routier côtier modulable selon vos haltes balnéaires ; utilisez le calcul d’itinéraire sur la carte ci-dessous.',
      ar: 'مسار ساحلي مرن حسب توقفاتكم الشاطئية؛ يرجى مراجعة حركة المرور عبر خرائط جوجل.',
    },
    coverImage: {
      src: '/images/aokas-coast.jpg',
      alt: {
        fr: 'Illustration du circuit des plages de la côte Est de Béjaïa',
        ar: 'رسم توضيحي لمسار شواطئ الساحل الشرقي لبجاية',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Alternance de plages de sable et de formations calcaires', ar: 'تنوع بين الشواطئ الرملية والتشكيلات الصخرية' },
      { fr: 'Visite des grottes féeriques d’Aokas', ar: 'زيارة المغارات العجيبة بأوقاس' },
    ],
    source: 'Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)',
  },
  {
    id: 'circuit-montagnes-forets',
    slug: 'montagnes-et-forets',
    title: {
      fr: 'Découverte des montagnes et forêts',
      ar: 'اكتشاف الجبال والغابات',
    },
    subtitle: {
      fr: 'Crêtes du Gouraya, chênaies de l’Akfadou, sources d’Adekar et gorges de Kherrata',
      ar: 'قمم قوراية وغابات أكفادو وأدكار ومضيق خراطة',
    },
    description: {
      fr: 'Pour les voyageurs épris de grands espaces, de forêts d’altitude et de reliefs calcaires spectaculaires entre Kabylie maritime et monts des Babors.',
      ar: 'لعشاق الفضاءات الواسعة والغابات الجبلية والتضاريس الصخرية المهيبة بين الساحل وجبال البابور.',
    },
    theme: 'montagne',
    destinationSlugs: [
      'mont-gouraya',
      'foret-akfadou',
      'sources-thermales-adekar',
      'gorges-kherrata-chabet-el-akra',
    ],
    durationNote: {
      fr: 'Les étapes couvrant l’ouest et le sud-est de la Wilaya se prêtent idéalement à plusieurs journées séparées.',
      ar: 'تغطي المحطات غرب وجنوب شرق الولاية، مما يجعلها مثالية لتوزيعها على عدة أيام.',
    },
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration du circuit des montagnes et forêts de Béjaïa',
        ar: 'رسم توضيحي لمسار الجبال والغابات في بجاية',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Immersion dans les chênaies de l’Akfadou', ar: 'جولة وسط غابات البلوط بأكفادو' },
      { fr: 'Défilé vertigineux de Chabet El Akra', ar: 'مضيق شعبة الآخرة الصخري' },
    ],
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria)',
  },
  {
    id: 'circuit-villages-traditionnels',
    slug: 'villages-traditionnels',
    title: {
      fr: 'Circuit des villages traditionnels et sources',
      ar: 'مسار القرى التقليدية والينابيع',
    },
    subtitle: {
      fr: 'Toudja, côte Ouest, villages perchés de Kabylie et patrimoine artisanal',
      ar: 'توجة والساحل الغربي والقرى القبائلية المعلقة والتراث الحرفي',
    },
    description: {
      fr: 'Une échappée culturelle entre sources anciennes, villages de pierre nichés dans les oliveraies et haltes balnéaires sur la côte Ouest.',
      ar: 'رحلة ثقافية بين الينابيع القديمة والقرى الحجرية وسط بساتين الزيتون ومحطات الساحل الغربي.',
    },
    theme: 'culturel',
    destinationSlugs: [
      'toudja',
      'boulimat',
      'saket',
      'village-uthrunen',
      'villages-traditionnels-bejaia',
    ],
    durationNote: {
      fr: 'Parcours libre alliant culture rurale et littoral ouest.',
      ar: 'مسار مرن يجمع بين الثقافة الريفية والساحل الغربي.',
    },
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: {
        fr: 'Illustration du circuit des villages traditionnels kabyles',
        ar: 'رسم توضيحي لمسار القرى القبائلية التقليدية',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Patrimoine hydraulique et vergers de Toudja', ar: 'التراث المائي وبساتين توجة' },
      { fr: 'Architecture traditionnelle en pierre et tuiles', ar: 'العمارة التقليدية بالحجر والقرميد' },
    ],
    source: 'Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)',
  },
  {
    id: 'circuit-vallee-soummam',
    slug: 'vallee-de-la-soummam',
    title: {
      fr: 'Découverte de la vallée de la Soummam et du thermalisme',
      ar: 'اكتشاف وادي الصومام والسياحة الحموية',
    },
    subtitle: {
      fr: 'Oliveraies, mémoire historique et haltes thermales à Tifra et Bouhamza',
      ar: 'بساتين الزيتون والذاكرة التاريخية والمحطات الحموية بتيفرة وبوحمزة',
    },
    description: {
      fr: 'Remontez la vallée de la Soummam à la rencontre de son terroir oléicole, de ses villages perchés, de sa mémoire nationale et de ses stations thermales.',
      ar: 'جولة عبر وادي الصومام للتعرف على تراثه الفلاحي وقراه الجبلية وذاكرته التاريخية ومحطاته الحموية.',
    },
    theme: 'thermal',
    destinationSlugs: [
      'vallee-de-la-soummam',
      'sources-thermales-tifra',
      'sources-thermales-bouhamza',
      'villages-traditionnels-bejaia',
    ],
    durationNote: {
      fr: 'Idéal sur un week-end de découverte culturelle et de détente thermale.',
      ar: 'مثالي لعطلة نهاية أسبوع تجمع بين الثقافة والاستجمام الحموي.',
    },
    coverImage: {
      src: '/images/kabyle-craft.jpg',
      alt: {
        fr: 'Illustration du terroir et de la vallée de la Soummam',
        ar: 'رسم توضيحي لمنتجات وتراث وادي الصومام',
      },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Terroir d’huile d’olive et villages de la Soummam', ar: 'تراث زيت الزيتون وقرى الصومام' },
      { fr: 'Haltes bien-être à Tifra et Bouhamza', ar: 'محطات استجمام حموي بتيفرة وبوحمزة' },
    ],
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria)',
  },
];

import type { CategoryDefinition, CategorySlug } from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain vérifiée DTA Béjaïa / Wikimedia Commons)';

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'balneaire',
    title: {
      fr: 'Tourisme balnéaire — Plages et littoral',
      ar: 'السياحة الشاطئية — الشواطئ والساحل',
    },
    shortTitle: {
      fr: 'Plages et littoral',
      ar: 'الشواطئ والساحل',
    },
    description: {
      fr: 'Plages de sable fin, criques rocheuses et stations balnéaires de la côte Est et de la côte Ouest de Béjaïa.',
      ar: 'شواطئ رملية ناعمة وخلجان صخرية ومنتجعات ساحلية على الساحلين الشرقي والغربي لبجاية.',
    },
    editorialIntro: {
      fr: 'La Wilaya de Béjaïa déploie un littoral méditerranéen contrasté où les contreforts boisés de la Kabylie rejoignent directement la mer. De la côte Ouest sauvage (Boulimat, Saket) aux grandes plages familiales de la côte Est (Tichy, Aokas, Souk El Tenine, Melbou), chaque baie offre une atmosphère singulière.',
      ar: 'تمتد ولاية بجاية على شريط ساحلي متوسطي متنوع تلتقي فيه سفوح جبال القبائل الخضراء مباشرة بالبحر، من الساحل الغربي البكر (بوليمات، ساكت) إلى الشواطئ الواسعة للساحل الشرقي (تيشي، أوقاس، سوق الإثنين، ملبو).',
    },
    accentColor: '#087E9B',
    coverImage: {
      src: '/images/aokas-coast.jpg',
      alt: {
        fr: 'Illustration du littoral méditerranéen de la côte Est de Béjaïa',
        ar: 'رسم توضيحي للساحل المتوسطي الشرقي لولاية بجاية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Côte Est : Tichy, Aokas, Souk El Tenine et Melbou', ar: 'الساحل الشرقي: تيشي، أوقاس، سوق الإثنين وملبو' },
      { fr: 'Côte Ouest : Boulimat, Saket et criques calcaires', ar: 'الساحل الغربي: بوليمات، ساكت والخلجان الصخرية' },
      { fr: 'Panoramas marins accessibles le long des routes côtières', ar: 'إطلالات بحرية بانورامية على طول الطرق الساحلية' },
    ],
  },
  {
    slug: 'montagne',
    title: {
      fr: 'Tourisme de montagne',
      ar: 'السياحة الجبلية',
    },
    shortTitle: {
      fr: 'Montagnes',
      ar: 'الجبال',
    },
    description: {
      fr: 'Sommets panoramiques, crêtes calcaires, belvédères sur le golfe et reliefs kabyles majeurs.',
      ar: 'قمم بانورامية ومرتفعات كلسية ومطلات طبيعية على الخليج وتضاريس قبائلية شاهقة.',
    },
    editorialIntro: {
      fr: 'Dominée par le Mont Gouraya et bordée par les massifs du Djurdjura, de l’Akfadou et des Babors, Béjaïa est une terre de reliefs spectaculaires. Les panoramas maritimes se dévoilent dès les premiers lacets montagneux.',
      ar: 'تتميز ولاية بجاية بتضاريس جبلية مهيبة يشرف عليها جبل قوراية وتحفها سلاسل جرجرة وأكفادو والبابور، مما يمنح الزوار إطلالات تجمع بين الجبل والبحر.',
    },
    accentColor: '#103B50',
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration des sommets et sentiers du massif du Gouraya surplombant la baie de Béjaïa',
        ar: 'رسم توضيحي لقمم ومسارات جبل قوراية المطل على خليج بجاية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Mont Gouraya et son fort historique au sommet', ar: 'جبل قوراية وحصنه التاريخي في القمة' },
      { fr: 'Pic des Singes et belvédères sur le golfe', ar: 'قمة القردة والمطلات المطلة على الخليج' },
      { fr: 'Gorges de Kherrata et défilé de Chabet El Akra', ar: 'مضيق خراطة وشعبة الآخرة' },
    ],
  },
  {
    slug: 'naturel',
    title: {
      fr: 'Tourisme naturel — Nature et forêts',
      ar: 'السياحة الطبيعية — الطبيعة والغابات',
    },
    shortTitle: {
      fr: 'Nature et forêts',
      ar: 'الطبيعة والغابات',
    },
    description: {
      fr: 'Parc national de Gouraya, forêts de chênes de l’Akfadou, baies préservées et biodiversité méditerranéenne.',
      ar: 'الحظيرة الوطنية لقوراية وغابات البلوط بأكفادو والخلجان المحمية والتنوع البيولوجي المتوسطي.',
    },
    editorialIntro: {
      fr: 'Classé réserve de biosphère par l’UNESCO, le Parc national de Gouraya incarne la richesse écologique de Béjaïa, prolongée vers l’intérieur par la forêt de l’Akfadou, sanctuaire de chênes zéens et de faune montagnarde.',
      ar: 'تجسّد الحظيرة الوطنية لقوراية المصنفة كمحمية للمحيط الحيوي من طرف اليونسكو الثراء البيئي لبجاية، وتمتد الطبيعة الغابية نحو غابة أكفادو الشهيرة بأشجار البلوط.',
    },
    accentColor: '#356B50',
    coverImage: {
      src: '/images/gouraya-nature.jpg',
      alt: {
        fr: 'Illustration des forêts méditerranéennes et falaises du Parc national de Gouraya',
        ar: 'رسم توضيحي للغابات المتوسطية ومنحدرات الحظيرة الوطنية لقوراية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Parc national de Gouraya (réserve de biosphère UNESCO)', ar: 'الحظيرة الوطنية لقوراية (محمية اليونسكو للمحيط الحيوي)' },
      { fr: 'Forêt d’Akfadou et ses chênaies d’altitude', ar: 'غابة أكفادو وأشجار البلوط العريقة' },
      { fr: 'Baie des Aiguades et falaises du Cap Carbon', ar: 'خليج ليغواد ومنحدرات رأس كربون' },
    ],
  },
  {
    slug: 'grottes',
    title: {
      fr: 'Grottes et paysages',
      ar: 'المغارات والمناظر الطبيعية',
    },
    shortTitle: {
      fr: 'Grottes et paysages',
      ar: 'المغارات والمناظر',
    },
    description: {
      fr: 'Cavités karstiques remarquables, formations calcaires d’Aokas et corniches littorales sculptées.',
      ar: 'مغارات كلسية مدهشة وتشكيلات صخرية بأوقاس وكورنيشات ساحلية منحوتة.',
    },
    editorialIntro: {
      fr: 'Les massifs calcaires qui bordent le golfe de Béjaïa abritent un patrimoine géologique singulier, illustré par les célèbres grottes féeriques d’Aokas et les reliefs côtiers ciselés entre mer et falaise.',
      ar: 'تحتضن الكتل الكلسية المحيطة بخليج بجاية تراثاً جيولوجياً فريداً تتقدمه المغارات العجيبة لأوقاس والمناظر الساحلية والجبلية الخلابة.',
    },
    accentColor: '#087E9B',
    coverImage: {
      src: '/images/aokas-coast.jpg',
      alt: {
        fr: 'Illustration des formations calcaires côtières de la région d’Aokas',
        ar: 'رسم توضيحي للتشكيلات الكلسية الساحلية في منطقة أوقاس',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Grottes féeriques d’Aokas et leurs concrétions', ar: 'المغارات العجيبة بأوقاس وتكويناتها الكلسية' },
      { fr: 'Paysages côtiers et corniches de la côte Est', ar: 'المناظر الساحلية وكورنيش الساحل الشرقي' },
      { fr: 'Reliefs escarpés de Chabet El Akra', ar: 'التضاريس الشاهقة لمضيق شعبة الآخرة' },
    ],
  },
  {
    slug: 'historique',
    title: {
      fr: 'Tourisme historique — Patrimoine',
      ar: 'السياحة التاريخية — التراث',
    },
    shortTitle: {
      fr: 'Patrimoine historique',
      ar: 'التراث التاريخي',
    },
    description: {
      fr: 'Casbah de Béjaïa, Bab El Bhar, remparts hammadites, forts côtiers et musée Bordj Moussa.',
      ar: 'قصبة بجاية وباب البحر والأسوار الحمادية والحصون الساحلية ومتحف برج موسى.',
    },
    editorialIntro: {
      fr: 'Ancienne Saldae romaine puis En-Naciria, capitale des Hammadites et grand foyer intellectuel méditerranéen au Moyen Âge, Béjaïa conserve un ensemble monumental exceptionnel dominant le port et la vieille ville.',
      ar: 'بجاية، صالدا الرومانية ثم الناصرية عاصمة الحماديين ومنارة العلم في المتوسط خلال العصور الوسطى، تحتفظ بمجموعة تاريخية ومعمارية فريدة تطل على الميناء والمدينة القديمة.',
    },
    accentColor: '#C47B55',
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: {
        fr: 'Illustration architecturale des remparts historiques et de la porte marine de Béjaïa',
        ar: 'رسم معماري توضيحي للأسوار التاريخية وباب البحر ببجاية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Casbah de Béjaïa et remparts hammadites', ar: 'قصبة بجاية والأسوار الحمادية' },
      { fr: 'Porte monumentale de Bab El Bhar', ar: 'بوابة باب البحر التاريخية' },
      { fr: 'Forts Gouraya, Sidi Abdelkader et Musée Bordj Moussa', ar: 'حصن قوراية وحصن سيدي عبد القادر ومتحف برج موسى' },
    ],
  },
  {
    slug: 'culturel',
    title: {
      fr: 'Tourisme culturel — Villages traditionnels',
      ar: 'السياحة الثقافية — القرى التقليدية',
    },
    shortTitle: {
      fr: 'Villages traditionnels',
      ar: 'القرى التقليدية',
    },
    description: {
      fr: 'Villages kabyles perchés, architecture de pierre et de tuiles, artisanat amazigh et vallée de la Soummam.',
      ar: 'قرى قبائلية معلقة وعمارة تقليدية بالحجر والقرميد وحرف أمازيغية ووادي الصومام.',
    },
    editorialIntro: {
      fr: 'Sur les crêtes dominant la vallée de la Soummam et les collines d’oliviers, les villages kabyles de la Wilaya perpétuent l’organisation communautaire, les savoir-faire artisanaux et l’hospitalité ancestrale.',
      ar: 'على القمم المطلة على وادي الصومام وتلال الزيتون، تحافظ القرى القبائلية في ولاية بجاية على العمارة الأصيلة والحرف التقليدية وكرم الضيافة المتوارث.',
    },
    accentColor: '#C47B55',
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: {
        fr: 'Illustration d’un village traditionnel kabyle perché au milieu des oliveraies',
        ar: 'رسم توضيحي لقرية قبائلية تقليدية وسط بساتين الزيتون',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Village d’Uthrunen et patrimoine rural kabyle', ar: 'قرية أوثرونن والتراث القروي القبائلي' },
      { fr: 'Toudja, réputée pour ses sources et son patrimoine', ar: 'توجة المعروفة بينابيعها وتراثها العريق' },
      { fr: 'Vallée de la Soummam, mémoire et oliveraies', ar: 'وادي الصومام بذاكرته التاريخية وبساتين الزيتون' },
    ],
  },
  {
    slug: 'thermal',
    title: {
      fr: 'Tourisme thermal',
      ar: 'السياحة الحموية',
    },
    shortTitle: {
      fr: 'Thermalisme',
      ar: 'السياحة الحموية',
    },
    description: {
      fr: 'Sources thermales naturelles de Tifra, d’Adekar et de Bouhamza au cœur des montagnes béjaouies.',
      ar: 'الينابيع الحموية الطبيعية في تيفرة وأدكار وبوحمزة في قلب جبال بجاية.',
    },
    editorialIntro: {
      fr: 'La richesse hydrogéologique de la Wilaya de Béjaïa se manifeste à travers plusieurs sources thermales fréquentées pour le repos et le bien-être en milieu montagnard et forestier.',
      ar: 'يتجلى الثراء الجيولوجي لولاية بجاية من خلال عدة ينابيع حموية طبيعية يقصدها الزوار للراحة والاستجمام في أجواء جبلية وهادئة.',
    },
    accentColor: '#356B50',
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: {
        fr: 'Illustration des vallées montagneuses abritant les sources thermales de Béjaïa',
        ar: 'رسم توضيحي للوديان الجبلية التي تحتضن الينابيع الحموية ببجاية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Sources thermales de Tifra (Sidi Yahia El Aidli)', ar: 'الحمامات المعدنية بتيفرة (سيدي يحيى العيدلي)' },
      { fr: 'Sources thermales d’Adekar', ar: 'الينابيع الحموية بأدكار' },
      { fr: 'Sources thermales de Bouhamza (Hammam Sillal)', ar: 'الينابيع الحموية ببوحمزة (حمام سلال)' },
    ],
  },
  {
    slug: 'aventure',
    title: {
      fr: 'Tourisme d’aventure et randonnée',
      ar: 'سياحة المغامرة والمشي الجبلي',
    },
    shortTitle: {
      fr: 'Aventure et randonnée',
      ar: 'المغامرة والمشي الجبلي',
    },
    description: {
      fr: 'Sentiers côtiers escarpés, randonnées forestières en Akfadou, belvédères et exploration de plein air.',
      ar: 'مسارات ساحلية وعرة ومشي في غابات أكفادو ومطلات طبيعية وأنشطة في الهواء الطلق.',
    },
    editorialIntro: {
      fr: 'Entre crêtes surplombant la Méditerranée et itinéraires forestiers d’altitude, Béjaïa offre un terrain d’exploration privilégié pour la randonnée pédestre, l’observation naturaliste et les activités de plein air encadrées.',
      ar: 'بين المسارات المطلة على المتوسط والدروب الغابية الجبلية، تمنح بجاية فضاءً مثالياً لعشاق المشي الجبلي ومراقبة الطبيعة والأنشطة الخارجية.',
    },
    accentColor: '#103B50',
    coverImage: {
      src: '/images/hero-cap-carbon.jpg',
      alt: {
        fr: 'Illustration de sentiers panoramiques sur les falaises côtières de Béjaïa',
        ar: 'رسم توضيحي لمسارات المشي البانورامية على منحدرات بجاية الساحلية',
      },
      source: 'Béjaïa Explorer (Illustration IA identifiée)',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    highlights: [
      { fr: 'Sentiers du Parc national de Gouraya vers Cap Carbon', ar: 'مسارات الحظيرة الوطنية لقوراية نحو رأس كربون' },
      { fr: 'Traversées forestières dans le massif de l’Akfadou', ar: 'مسارات المشي الغابي في مرتفعات أكفادو' },
      { fr: 'Observation de la faune et de la flore méditerranéenne', ar: 'مراقبة الحيوانات والنباتات المتوسطية' },
    ],
  },
];

export const CATEGORY_MAP: Record<CategorySlug, CategoryDefinition> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.slug] = cat;
    return acc;
  },
  {} as Record<CategorySlug, CategoryDefinition>
);

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

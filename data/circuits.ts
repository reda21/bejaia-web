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
      kab: 'Bgayet tamezruyant — Ɣef later n En-Naciria',
    },
    subtitle: {
      fr: 'Citadelle, porte marine, remparts hammadites et musée de la vieille ville',
      ar: 'القصبة وباب البحر والأسوار الحمادية ومتحف المدينة القديمة',
      kab: 'Lqeṣba, tawwurt n yilel, iɣerban iḥemmadiyen d usalay n temdint taqburt',
    },
    description: {
      fr: 'Un parcours patrimonial au cœur de la vieille ville de Béjaïa reliant les vestiges majeurs de son passé hammadite, méditerranéen et défensif.',
      ar: 'مسار تراثي في قلب المدينة القديمة لبجاية يربط أبرز شواهد تاريخها الحمادي والمتوسطي والدفاعي.',
      kab: 'Abrid n tgemmi di tlemmast n temdint taqburt n Bgayet i yesdukklen ixerrajen imeqqranen n umezruy-is aḥemmadi d ugrakal.',
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
      kab: 'Akud d ilelli almend n tirza n yal axerraj.',
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
      kab: 'Asnirem n Umraḥ aɣelnaw n Guraya',
    },
    subtitle: {
      fr: 'Sommets panoramiques, falaises calcaires, faune sauvage et criques turquoise',
      ar: 'قمم بانورامية وجروف كلسية وحياة برية وخلجان صافية',
      kab: 'Tiqucac, ifriwen, iɣersiwen igamanen d yiɣezran ṣṣafin',
    },
    description: {
      fr: 'L’itinéraire incontournable pour embrasser toute la magie naturelle de Béjaïa, du fort perché sur le Mont Gouraya au phare du Cap Carbon et aux eaux limpides des Aiguades.',
      ar: 'المسار الأبرز لاكتشاف السحر الطبيعي لبجاية، من حصن قمة قوراية إلى منارة رأس كربون ومياه خليج ليغواد.',
      kab: 'Abrid agejdan akken ad tsnirmeḍ ccbaḥa tagamant n Bgayet, seg lberǧ n Guraya ɣer teftilt n Yixef Karbun d waman n Ligwad.',
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
      kab: 'Abrid i tzemreḍ ad t-tebḍuḍ ɣef yiwen n wass neɣ sin almend n tikli-inek.',
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
      kab: 'Abrid n tiftisin n uftis usamar',
    },
    subtitle: {
      fr: 'De Tichy à Melbou en passant par les grottes féeriques d’Aokas',
      ar: 'من تيشي إلى ملبو مروراً بالمغارات العجيبة بأوقاس',
      kab: 'Seg Tici ɣer Melbu s yifran n Aweqqas',
    },
    description: {
      fr: 'Un itinéraire lumineux longeant la corniche orientale de Béjaïa, associant stations balnéaires familiales, merveilles karstiques et criques adossées aux Babors.',
      ar: 'مسار ساحلي مشرق على طول الكورنيش الشرقي لبجاية يجمع بين الشواطئ العائلية والمغارات الكلسية وسفوح البابور.',
      kab: 'Abrid yezzin i uftis usamar n Bgayet, yesdukklen tiftisin n twacult, ifran n Aweqqas d yidurar n Babur.',
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
      kab: 'Abrid n uftis almend n tmerjiwin-ik; seqdec asiḍen n ubrid ɣef tkarḍa.',
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
      kab: 'Asnirem n yidurar d tẓegwa',
    },
    subtitle: {
      fr: 'Crêtes du Gouraya, chênaies de l’Akfadou, sources d’Adekar et gorges de Kherrata',
      ar: 'قمم قوراية وغابات أكفادو وأدكار ومضيق خراطة',
      kab: 'Tiqucac n Guraya, tiẓegwa n Akfadu, tiliwa n Adekar d yiɣzer n Xerraṭa',
    },
    description: {
      fr: 'Pour les voyageurs épris de grands espaces, de forêts d’altitude et de reliefs calcaires spectaculaires entre Kabylie maritime et monts des Babors.',
      ar: 'لعشاق الفضاءات الواسعة والغابات الجبلية والتضاريس الصخرية المهيبة بين الساحل وجبال البابور.',
      kab: 'I wid iḥemmlen tisura timeqqranin, tiẓegwa n udrar d yidɣaɣen gar uftis d yidurar n Babur.',
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
      kab: 'Timerjiwin-a deg umalu d unẓul-usamar n twilayt iwatan i waṭas n wussan.',
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
      kab: 'Abrid n tudrin tinsayanin d tliwa',
    },
    subtitle: {
      fr: 'Toudja, côte Ouest, villages perchés de Kabylie et patrimoine artisanal',
      ar: 'توجة والساحل الغربي والقرى القبائلية المعلقة والتراث الحرفي',
      kab: 'Tuǧa, aftis umalu, tudrin n Leqbayel d tẓuri n ufus',
    },
    description: {
      fr: 'Une échappée culturelle entre sources anciennes, villages de pierre nichés dans les oliveraies et haltes balnéaires sur la côte Ouest.',
      ar: 'رحلة ثقافية بين الينابيع القديمة والقرى الحجرية وسط بساتين الزيتون ومحطات الساحل الغربي.',
      kab: 'Tirza tadelsant gar tliwa tiqburin, tudrin n uẓru gar tzemrin d tiftisin n uftis umalu.',
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
      kab: 'Abrid ilelli yesdukklen idles n taddart d uftis umalu.',
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
      kab: 'Asnirem n wasif n Summam d lḥemmamat',
    },
    subtitle: {
      fr: 'Oliveraies, mémoire historique et haltes thermales à Tifra et Bouhamza',
      ar: 'بساتين الزيتون والذاكرة التاريخية والمحطات الحموية بتيفرة وبوحمزة',
      kab: 'Tizemrin, takatut tamezruyant d lḥemmamat n Tifra d Buḥemza',
    },
    description: {
      fr: 'Remontez la vallée de la Soummam à la rencontre de son terroir oléicole, de ses villages perchés, de sa mémoire nationale et de ses stations thermales.',
      ar: 'جولة عبر وادي الصومام للتعرف على تراثه الفلاحي وقراه الجبلية وذاكرته التاريخية ومحطاته الحموية.',
      kab: 'Rzu ɣef wasif n Summam akken ad tissineḍ tizemrin-is, tudrin-is, takatut-is d tliwa-s n waman iḥmayanen.',
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
      kab: 'Iwata i taggar n ddurt n usnirem adelsan d usteɛfu di lḥemmamat.',
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

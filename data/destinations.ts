import type { Destination, MediaAsset } from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain certifiée DTA Béjaïa / Wikimedia Commons)';

const DTA_SOURCE = {
  label: 'Direction du Tourisme et de l’Artisanat de Béjaïa (DTA Béjaïa)',
  url: 'https://www.dta-bejaia.com/',
  verificationStatus: 'verified_institutional' as const,
};

const GUIDE_SOURCE = {
  label: 'Guide touristique officiel de Béjaïa (VisitAlgeria)',
  url: 'https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf',
  verificationStatus: 'verified_institutional' as const,
};

function makeMedia(src: string, frAlt: string, arAlt: string, frCaption?: string, arCaption?: string): MediaAsset {
  return {
    src,
    alt: { fr: frAlt, ar: arAlt },
    caption: frCaption && arCaption ? { fr: frCaption, ar: arCaption } : undefined,
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: AI_ATTR,
    isAiIllustration: true,
  };
}

export const DESTINATIONS: Destination[] = [
  // === NATURE ET MONTAGNES ===
  {
    id: 'parc-national-gouraya',
    slug: 'parc-national-gouraya',
    name: { fr: 'Parc national de Gouraya', ar: 'الحظيرة الوطنية لقوراية', kab: 'Amraḥ aɣelnaw n Guraya' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Massif de Gouraya · Littoral centre', ar: 'جبل قوراية · الساحل الأوسط', kab: 'Adrar n Guraya · Aftis alemmas' },
    category: 'naturel',
    secondaryCategories: ['montagne', 'aventure'],
    featured: true,
    shortDescription: {
      fr: 'Réserve de biosphère UNESCO mêlant falaises plongeant dans la Méditerranée, forêts littorales et patrimoine historique.',
      ar: 'محمية للمحيط الحيوي مصنفة من اليونسكو تجمع بين المنحدرات البحرية والغابات الساحلية والتراث التاريخي.',
      kab: 'Aḥraz n tudert n UNESCO i yesdukklen ifriwen i d-yeɣlin deg Yilel Agrakal, tiẓegwa n uftis d tgemmi tamezruyant.',
    },
    overview: {
      fr: 'Situé au nord-est de la ville de Béjaïa, le Parc national de Gouraya protège un écosystème littoral et montagnard exceptionnel classé réserve de biosphère par l’UNESCO. Il englobe des sites emblématiques tels que le Mont Gouraya, le Cap Carbon, le Pic des Singes et la Baie des Aiguades.',
      ar: 'تقع الحظيرة الوطنية لقوراية شمال شرق مدينة بجاية، وتحمي نظاماً بيئياً ساحلياً وجبلياً فريداً مصنفاً كمحمية للمحيط الحيوي لدى اليونسكو، وتضم معالم بارزة مثل جبل قوراية ورأس كربون وقمة القردة وخليج ليغواد.',
    },
    tourismDescription: {
      fr: 'Les visiteurs y découvrent une biodiversité méditerranéenne remarquable — incluant le macaque de Barbarie (magot) — le long de routes panoramiques et de sentiers pédestres offrant des vues saisissantes sur le golfe de Béjaïa.',
      ar: 'يكتشف الزوار فيها تنوعاً بيولوجياً متوسطياً لافتاً، بما في ذلك قرد المكاك البربري، على امتداد طرق بانورامية ومسارات مشي تمنح مشاهد مذهلة لخليج بجاية.',
    },
    historyAndHeritage: {
      fr: 'Le périmètre du parc réunit des vestiges historiques majeurs liés à la défense maritime de Béjaïa, notamment le Fort Gouraya sur les hauteurs et des tours d’observation côtières.',
      ar: 'يضم نطاق الحظيرة معالم تاريخية هامة ارتبطت بحماية ساحل بجاية، أبرزها حصن قوراية في المرتفعات وأبراج المراقبة الساحلية.',
    },
    characteristics: [
      { fr: 'Réserve de biosphère UNESCO', ar: 'محمية اليونسكو للمحيط الحيوي' },
      { fr: 'Faune emblématique : macaque de Barbarie', ar: 'الحياة البرية: قرد المكاك البربري' },
      { fr: 'Sentiers pédestres et belvédères marins', ar: 'مسارات مشي ومطلات بحرية' },
    ],
    visitTips: [
      { fr: 'Ne jamais nourrir les macaques de Barbarie afin de préserver leur comportement naturel et la sécurité des visiteurs.', ar: 'يُمنع إطعام قردة المكاك البربري للحفاظ على سلوكها الطبيعي وسلامة الزوار.' },
      { fr: 'Privilégier la matinée pour profiter d’une lumière douce sur le golfe et d’une fréquentation plus calme.', ar: 'يُفضل الزيارة صباحاً للاستمتاع بالإضاءة الهادئة على الخليج وتفادي الازدحام.' },
      { fr: 'Emporter de l’eau et des chaussures adaptées si vous empruntez les sentiers escarpés.', ar: 'احرص على اصطحاب الماء وارتداء أحذية مناسبة عند سلوك المسارات الجبلية.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Accessible depuis le centre-ville de Béjaïa par la route panoramique montant vers Yemma Gouraya ou vers les Aiguades.',
        ar: 'يمكن الوصول إليها من وسط مدينة بجاية عبر الطريق البانورامي الصاعد نحو يما قوراية أو نحو ليغواد.',
      },
      seasonNote: {
        fr: 'Visitable toute l’année ; le printemps et l’automne sont particulièrement agréables pour la randonnée.',
        ar: 'تُزار على مدار السنة، ويكون الربيع والخريف مثاليين للمشي الجبلي.',
      },
      verificationNotice: {
        fr: 'Les éventuels horaires d’accès aux maisons du parc ou sentiers réglementés doivent être vérifiés auprès de l’administration du Parc national de Gouraya.',
        ar: 'يرجى التحقق من أي مواعيد أو تنظيمات خاصة بالمسارات لدى إدارة الحظيرة الوطنية لقوراية.',
      },
    },
    mapsSearchQuery: 'Parc National de Gouraya, Béjaïa, Algérie',
    osmSearchQuery: 'Parc national de Gouraya, Béjaïa',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration du Parc national de Gouraya surplombant la baie de Béjaïa', 'رسم توضيحي للحظيرة الوطنية لقوراية المطلة على خليج بجاية', 'Massif côtier et végétation méditerranéenne du Parc national de Gouraya', 'المرتفعات الساحلية والنباتات المتوسطية في الحظيرة الوطنية لقوراية'),
    gallery: [
      makeMedia('/images/gouraya-nature.jpg', 'Sentiers du Parc national de Gouraya', 'مسارات الحظيرة الوطنية لقوراية'),
      makeMedia('/images/hero-cap-carbon.jpg', 'Falaises côtières du périmètre de Gouraya', 'منحدرات ساحلية ضمن نطاق قوراية'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'cap-carbon',
    slug: 'cap-carbon',
    name: { fr: 'Cap Carbon', ar: 'رأس كربون', kab: 'Ixef Karbun (Cap Carbon)' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Parc national de Gouraya', ar: 'الحظيرة الوطنية لقوراية', kab: 'Amraḥ aɣelnaw n Guraya' },
    category: 'naturel',
    secondaryCategories: ['montagne', 'aventure'],
    featured: true,
    shortDescription: {
      fr: 'Promontoire rocheux vertigineux célèbre pour son phare perché au-dessus des flots et son arche marine naturelle.',
      ar: 'نتوء صخري شاهق يشتهر بمنارته المطلة على الأمواج وقوسه البحري الطبيعي.',
      kab: 'Ixf n uẓru aɛlayan yettwassnen s teftilt-is ɣef yilel d uqenṭar-is agaman n yidɣaɣen.',
    },
    overview: {
      fr: 'Site emblématique de la Wilaya de Béjaïa au sein du Parc national de Gouraya, le Cap Carbon s’avance audacieusement dans la mer Méditerranée. Sa falaise calcaire abrite un phare maritime historique dominant le large.',
      ar: 'يُعد رأس كربون من أبرز معالم ولاية بجاية داخل الحظيرة الوطنية لقوراية، حيث يمتد بجرف كلسي شاهق داخل البحر المتوسط تتوجه منارة بحرية تاريخية.',
    },
    tourismDescription: {
      fr: 'La promenade menant au promontoire dévoile un panorama grandiose à 360 degrés sur la mer, les falaises abruptes et les criques turquoise. C’est l’un des points d’observation les plus photographiés d’Algérie.',
      ar: 'يكشف المسار المؤدي إلى الرأس عن بانوراما بحرية خلابة وجروف صخرية شاهقة ومياه فيروزية، مما يجعله من أكثر المواقع إقبالاً للتصوير في الجزائر.',
    },
    historyAndHeritage: {
      fr: 'Le phare du Cap Carbon sert de repère maritime essentiel pour la navigation le long de la côte kabyle et l’entrée du golfe de Béjaïa.',
      ar: 'تؤدي منارة رأس كربون دوراً أساسياً في الملاحة البحرية على طول الساحل ومدخل خليج بجاية.',
    },
    characteristics: [
      { fr: 'Phare maritime sur falaise calcaire', ar: 'منارة بحرية فوق جرف كلسي' },
      { fr: 'Arche naturelle marine visible depuis le large', ar: 'قوس بحري طبيعي يظهر من جهة البحر' },
      { fr: 'Panorama ouvert sur la Méditerranée', ar: 'إطلالة مفتوحة على البحر الأبيض المتوسط' },
    ],
    visitTips: [
      { fr: 'Rester impérativement sur les passages aménagés et respecter les garde-corps le long des falaises.', ar: 'الالتزام الصارم بالممرات المهيأة والحواجز الوقائية على حافة المنحدرات.' },
      { fr: 'Éviter les jours de vent très fort sur la crête exposée.', ar: 'تجنب الزيارة في أيام الرياح القوية نظراً لانكشاف القمة.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Accessible par la route du Pic des Singes dans le Parc national de Gouraya, suivie d’un cheminement piéton.',
        ar: 'يمكن الوصول إليه عبر طريق قمة القردة داخل الحظيرة الوطنية لقوراية ثم السير على الأقدام.',
      },
      seasonNote: {
        fr: 'Superbe en fin d’après-midi lorsque la lumière dorée éclaire la falaise.',
        ar: 'يتميز بجمال استثنائي في أواخر بعد الظهر عند انعكاس أشعة الشمس على الجرف.',
      },
      verificationNotice: {
        fr: 'L’accès intérieur au phare lui-même peut être restreint pour des raisons de service maritime ; vérifier sur place.',
        ar: 'قد يكون الدخول إلى داخل مبنى المنارة مقيداً لاعتبارات الملاحة البحرية؛ يرجى التحقق في عين المكان.',
      },
    },
    mapsSearchQuery: 'Cap Carbon, Béjaïa, Algérie',
    osmSearchQuery: 'Cap Carbon, Béjaïa',
    coverImage: makeMedia('/images/hero-cap-carbon.jpg', 'Illustration panoramique du Cap Carbon et de son phare à Béjaïa', 'رسم بانورامي توضيحي لرأس كربون ومنارته في بجاية', 'Le promontoire du Cap Carbon face à la Méditerranée', 'جرف رأس كربون قبالة البحر الأبيض المتوسط'),
    gallery: [
      makeMedia('/images/hero-cap-carbon.jpg', 'Vue panoramique du Cap Carbon', 'منظر بانورامي لرأس كربون'),
      makeMedia('/images/gouraya-nature.jpg', 'Crêtes voisines du Parc national de Gouraya', 'المرتفعات المجاورة في الحظيرة الوطنية لقوراية'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'mont-gouraya',
    slug: 'mont-gouraya',
    name: { fr: 'Mont Gouraya (Yemma Gouraya)', ar: 'جبل قوراية (يما قوراية)', kab: 'Adrar n Guraya (Yemma Guraya)' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Parc national de Gouraya', ar: 'الحظيرة الوطنية لقوراية', kab: 'Amraḥ aɣelnaw n Guraya' },
    category: 'montagne',
    secondaryCategories: ['historique', 'naturel'],
    featured: true,
    shortDescription: {
      fr: 'Sommet tutélaire dominant la ville de Béjaïa, couronné par son fort historique et des vues spectaculaires sur le golfe.',
      ar: 'القمة الشامخة المشرفة على مدينة بجاية والمتوّجة بحصنها التاريخي وبإطلالات بانورامية على الخليج.',
      kab: 'Taqacuct taɛlayant i d-yettmuqulen ɣer temdint n Bgayet, s lberǧ-is amezruyan d tmuɣliwin ɣef usagen.',
    },
    overview: {
      fr: 'Véritable silhouette protectrice de la ville, le Mont Gouraya s’élève directement au-dessus du port et de la médina de Béjaïa. Son sommet offre l’un des plus beaux belvédères de la rive sud de la Méditerranée.',
      ar: 'يشكل جبل قوراية رمزاً بارزاً لمدينة بجاية إذ يرتفع مباشرة فوق الميناء والمدينة القديمة، مانحاً من قمته واحدة من أروع الإطلالات على الضفة الجنوبية للمتوسط.',
    },
    tourismDescription: {
      fr: 'On y accède par une route sinueuse bordée de pins ou par sentier pédestre. Au sommet, le regard embrasse toute la baie de Béjaïa, la vallée de la Soummam et, par temps clair, les sommets des Babors et du Djurdjura.',
      ar: 'يُصعد إليه عبر طريق جبلي محاط بأشجار الصنوبر أو عبر مسارات المشي، لتنكشف في القمة إطلالة شاملة على خليج بجاية ووادي الصومام وجبال البابور وجرجرة.',
    },
    historyAndHeritage: {
      fr: 'Le sommet porte le nom affectueux de « Yemma Gouraya » dans la mémoire locale et abrite un fort historique témoignant du rôle stratégique séculaire de la montagne.',
      ar: 'تحظى القمة بمكانة خاصة في الذاكرة المحلية باسم «يما قوراية»، وتضم حصناً تاريخياً يعكس الدور الاستراتيجي العريق للجبل.',
    },
    characteristics: [
      { fr: 'Belvédère panoramique sur le golfe et la vallée', ar: 'مطل بانورامي على الخليج والوادي' },
      { fr: 'Site naturel et patrimonial majeur', ar: 'موقع طبيعي وتراثي رئيسي' },
      { fr: 'Accès routier et pédestre depuis Béjaïa', ar: 'إمكانية الوصول بالسيارة أو سيراً من بجاية' },
    ],
    visitTips: [
      { fr: 'Prévoir un coupe-vent même en été, le sommet étant souvent ventilé.', ar: 'يُنصح باصطحاب سترة خفيفة ضد الرياح حتى صيفاً لبرودة القمة.' },
      { fr: 'Combiner la montée avec la visite du Fort Gouraya et du Pic des Singes.', ar: 'يمكن الجمع بين الصعود وزيارة حصن قوراية وقمة القردة.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Route montagneuse asphaltée depuis la haute ville de Béjaïa ; conduite prudente recommandée dans les lacets.',
        ar: 'طريق جبلي معبد انطلاقاً من أعالي مدينة بجاية مع ضرورة القيادة بحذر في المنعرجات.',
      },
      seasonNote: {
        fr: 'Accessible toute l’année, avec une visibilité optimale par temps clair au printemps et en automne.',
        ar: 'متاح طوال السنة، وتكون الرؤية أوضح ما يكون في الربيع والخريف.',
      },
    },
    mapsSearchQuery: 'Yemma Gouraya, Béjaïa, Algérie',
    osmSearchQuery: 'Mont Gouraya, Béjaïa',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration du Mont Gouraya dominant le port et la baie de Béjaïa', 'رسم توضيحي لجبل قوراية المطل على ميناء وخليج بجاية', 'Le Mont Gouraya et son fort dominant le golfe', 'جبل قوراية وحصنه المشرفان على الخليج'),
    gallery: [
      makeMedia('/images/gouraya-nature.jpg', 'Vue du Mont Gouraya', 'منظر جبل قوراية'),
      makeMedia('/images/casbah-heritage.jpg', 'Patrimoine historique de Béjaïa en contrebas', 'التراث التاريخي لبجاية أسفل الجبل'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'pic-des-singes',
    slug: 'pic-des-singes',
    name: { fr: 'Pic des Singes', ar: 'قمة القردة', kab: 'Taqacuct n Yibkan' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Parc national de Gouraya', ar: 'الحظيرة الوطنية لقوراية', kab: 'Amraḥ aɣelnaw n Guraya' },
    category: 'naturel',
    secondaryCategories: ['montagne', 'aventure'],
    featured: true,
    shortDescription: {
      fr: 'Belvédère naturel spectaculaire au-dessus de la mer, célèbre pour sa colonie de macaques de Barbarie en liberté.',
      ar: 'مطل طبيعي خلاب فوق البحر، يشتهر بوجود قردة المكاك البربري في بيئتها الطبيعية.',
      kab: 'Tamazirt tagamant ɣef yilel, tettwassen s yibkan n Tmazɣa i yettidiren deg tlelli.',
    },
    overview: {
      fr: 'Situé sur la route côtière du Parc national de Gouraya en direction du Cap Carbon, le Pic des Singes est l’un des sites les plus prisés de Béjaïa pour son panorama vertigineux et sa faune sauvage.',
      ar: 'تقع قمة القردة على الطريق الساحلي للحظيرة الوطنية لقوراية باتجاه رأس كربون، وهي من أبرز الوجهات في بجاية بفضل إطلالتها البانورامية وحياتها البرية.',
    },
    tourismDescription: {
      fr: 'L’esplanade aménagée domine la Méditerranée et permet d’observer à distance respectueuse les macaques de Barbarie évoluant sur les rochers et dans les pins.',
      ar: 'تشرف الساحة المهيأة على البحر المتوسط وتتيح مراقبة قردة المكاك البربري عن مسافة آمنة بين الصخور وأشجار الصنوبر.',
    },
    characteristics: [
      { fr: 'Observation du macaque de Barbarie', ar: 'مراقبة قرد المكاك البربري' },
      { fr: 'Point de départ vers le Cap Carbon', ar: 'نقطة انطلاق نحو رأس كربون' },
      { fr: 'Vue plongeante sur le littoral', ar: 'إطلالة مباشرة على الساحل' },
    ],
    visitTips: [
      { fr: 'Garder ses effets personnels fermés et éviter de donner de la nourriture aux singes.', ar: 'حافظ على أغراضك الشخصية مغلقة وتجنب تقديم الطعام للقردة.' },
      { fr: 'Poursuivre à pied jusqu’au belvédère du Cap Carbon tout proche.', ar: 'واصل المشي نحو مطل رأس كربون القريب.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Situé sur l’axe du Parc national de Gouraya reliant Béjaïa au Cap Carbon.',
        ar: 'تقع على محور الحظيرة الوطنية لقوراية الرابط بين بجاية ورأس كربون.',
      },
      seasonNote: {
        fr: 'Fréquenté toute l’année ; préférer les heures matinales en période estivale.',
        ar: 'مفتوحة على مدار السنة ويفضل زيارتها صباحاً خلال الصيف.',
      },
    },
    mapsSearchQuery: 'Pic des Singes, Béjaïa, Algérie',
    osmSearchQuery: 'Pic des Singes, Béjaïa',
    coverImage: makeMedia('/images/hero-cap-carbon.jpg', 'Illustration des falaises et belvédères du Pic des Singes à Béjaïa', 'رسم توضيحي لمنحدرات ومطل قمة القردة ببجاية'),
    gallery: [
      makeMedia('/images/hero-cap-carbon.jpg', 'Falaises autour du Pic des Singes', 'المنحدرات المحيطة بقمة القردة'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'baie-des-aiguades',
    slug: 'baie-des-aiguades',
    name: { fr: 'Baie des Aiguades', ar: 'خليج ليغواد', kab: 'Aɣezraw n Ligwad' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Parc national de Gouraya', ar: 'الحظيرة الوطنية لقوراية', kab: 'Amraḥ aɣelnaw n Guraya' },
    category: 'naturel',
    secondaryCategories: ['balneaire'],
    shortDescription: {
      fr: 'Anse abritée aux eaux limpides blottie au pied des falaises verdoyantes du massif de Gouraya.',
      ar: 'خليج هادئ بمياه صافية يحتضنه سفح المنحدرات الخضراء لجبل قوراية.',
      kab: 'Aɣezraw iɛezlen s waman ṣṣafin seddaw yifriwen izegzawen n udrar n Guraya.',
    },
    overview: {
      fr: 'Nichée sur le flanc ouest du Parc national de Gouraya, la Baie des Aiguades offre un cadre naturel préservé où la forêt descend jusqu’aux galets et aux eaux transparentes.',
      ar: 'يقع خليج ليغواد على الجانب الغربي للحظيرة الوطنية لقوراية، ويوفر مشهداً طبيعياً محفوظاً حيث تلتقي الغابة مباشرة بالمياه الصافية.',
    },
    tourismDescription: {
      fr: 'Appréciée pour sa sérénité hors saison estivale et son eau claire, la baie constitue une halte incontournable lors d’une journée d’exploration autour de Gouraya.',
      ar: 'يشتهر الخليج بهدوئه وصفاء مياهه، ويُعد محطة مميزة ضمن جولة استكشاف محيط قوراية.',
    },
    characteristics: [
      { fr: 'Eaux limpides et cadre forestier protégé', ar: 'مياه صافية ومحيط غابي محمي' },
      { fr: 'Site inclus dans le Parc national de Gouraya', ar: 'موقع ضمن الحظيرة الوطنية لقوراية' },
    ],
    visitTips: [
      { fr: 'Respecter strictement la propreté du site naturel protégé.', ar: 'الحفاظ التام على نظافة هذا الموقع الطبيعي المحمي.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Accessible par la route des Aiguades depuis Béjaïa.',
        ar: 'يمكن الوصول إليه عبر طريق ليغواد انطلاقاً من مدينة بجاية.',
      },
      seasonNote: {
        fr: 'Idéal du printemps au début de l’automne.',
        ar: 'مثالي من فصل الربيع حتى بداية الخريف.',
      },
    },
    mapsSearchQuery: 'Les Aiguades, Béjaïa, Algérie',
    osmSearchQuery: 'Les Aiguades, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration d’une baie méditerranéenne abritée au pied des montagnes de Béjaïa', 'رسم توضيحي لخليج متوسطي هادئ أسفل جبال بجاية'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Anse méditerranéenne de Béjaïa', 'خليج متوسطي في بجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'foret-akfadou',
    slug: 'foret-akfadou',
    name: { fr: 'Forêt d’Akfadou', ar: 'غابة أكفادو', kab: 'Tiẓegi n Akfadu' },
    commune: { fr: 'Adekar / Akfadou', ar: 'أدكار / أكفادو', kab: 'Adekar / Akfadu' },
    region: { fr: 'Massif de l’Akfadou · Kabylie', ar: 'مرتفعات أكفادو · القبائل', kab: 'Adrar n Akfadu · Tamurt n Leqbayel' },
    category: 'naturel',
    secondaryCategories: ['montagne', 'aventure'],
    featured: true,
    shortDescription: {
      fr: 'Vaste massif forestier d’altitude réputé pour ses chênes zéens et afarès, ses lacs temporaires et son air pur.',
      ar: 'كتلة غابية جبلية شاسعة تشتهر بأشجار البلوط العريقة وبحيراتها الموسمية وهوائها النقي.',
      kab: 'Tiẓegi tameqqrant n udrar yettwassnen s yisekla n ubelluḍ d uzan, igelmimen-is d uzwu-is aṣfi.',
    },
    overview: {
      fr: 'À cheval entre les wilayas de Béjaïa et de Tizi Ouzou, la forêt de l’Akfadou est l’un des plus grands ensembles forestiers caducifoliés d’Algérie. Elle abrite une flore riche et une faune montagnarde préservée.',
      ar: 'تمتد غابة أكفادو بين ولايتي بجاية وتيزي وزو، وتعد من أكبر الغابات الجبلية في الجزائر، وتتميز بتنوع نباتي وحيواني فريد.',
    },
    tourismDescription: {
      fr: 'Refuge de fraîcheur en été et théâtre de couleurs flamboyantes en automne, l’Akfadou séduit les amateurs de randonnée pédestre, de photographie naturaliste et de découverte des villages forestiers.',
      ar: 'تمنح الغابة برودة لطيفة صيفاً وألواناً خريفية ساحرة، مما يجعلها وجهة مفضلة للمشي الجبلي وتصوير الطبيعة.',
    },
    characteristics: [
      { fr: 'Chênaies d’altitude (chêne zéen et afarès)', ar: 'غابات البلوط الجبلية العريقة' },
      { fr: 'Itinéraires de randonnée et d’écotourisme', ar: 'مسارات المشي والسياحة الإيكولوجية' },
      { fr: 'Couleurs remarquables en automne', ar: 'ألوان طبيعية ساحرة في الخريف' },
    ],
    visitTips: [
      { fr: 'Préférer un accompagnement par un guide local ou une association de randonnée pour les itinéraires en profondeur.', ar: 'يُفضل الاستعانة بمرشد محلي أو نادي مشي جبلي في المسارات العميقة.' },
      { fr: 'Ne faire aucun feu en forêt afin de prévenir tout risque d’incendie.', ar: 'يُمنع إشعال النار داخل الغابة للوقاية من الحرائق.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Accessible via la route nationale traversant Adekar et les hauteurs d’Akfadou.',
        ar: 'يمكن الوصول إليها عبر الطريق الوطني المار بأدكار ومرتفعات أكفادو.',
      },
      seasonNote: {
        fr: 'Particulièrement remarquable au printemps et en automne ; hiver parfois enneigé sur les crêtes.',
        ar: 'رائعة خاصة في الربيع والخريف وقد تكتسي بالثلوج شتاءً.',
      },
    },
    mapsSearchQuery: 'Forêt Akfadou, Béjaïa, Algérie',
    osmSearchQuery: 'Forêt d Akfadou, Béjaïa',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration des forêts montagneuses de la Wilaya de Béjaïa', 'رسم توضيحي للغابات الجبلية بولاية بجاية'),
    gallery: [makeMedia('/images/gouraya-nature.jpg', 'Massif forestier montagnard', 'كتلة غابية جبلية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'gorges-kherrata-chabet-el-akra',
    slug: 'gorges-kherrata-chabet-el-akra',
    name: { fr: 'Gorges de Kherrata et Chabet El Akra', ar: 'مضيق خراطة وشعبة الآخرة', kab: 'Iɣzer n Xerraṭa d Caɛbet Laxra' },
    commune: { fr: 'Kherrata', ar: 'خراطة', kab: 'Xerraṭa' },
    region: { fr: 'Sud-Est de la Wilaya · Babors', ar: 'جنوب شرق الولاية · جبال البابور', kab: 'Anẓul-Usamar n twilayt · Babur' },
    category: 'montagne',
    secondaryCategories: ['grottes', 'aventure'],
    shortDescription: {
      fr: 'Défilé rocheux vertigineux taillé dans les parois calcaires des Babors, étape mythique reliant Béjaïa aux Hauts-Plateaux.',
      ar: 'مضيق صخري مهيب محفور وسط الجدران الكلسية لجبال البابور، يربط بجاية بالهضاب العليا.',
      kab: 'Abrid aɛlayan yettwanɣen deg yidɣaɣen n Babur, yettaqqnen Bgayet ɣer Yizaɣaren Iɛlayen.',
    },
    overview: {
      fr: 'Creusées par l’oued Agrioun au cœur des montagnes des Babors, les gorges de Kherrata (Chabet El Akra) offrent un spectacle géologique impressionnant fait de parois verticales, de tunnels et d’ouvrages d’art spectaculaires.',
      ar: 'تشكّل مضيق خراطة (شعبة الآخرة) بفعل وادي أغريون وسط جبال البابور، ليقدم مشهداً جيولوجياً مهيباً من الجروف العمودية والأنفاق والجسور.',
    },
    tourismDescription: {
      fr: 'Le franchissement des gorges est une expérience paysagère marquante, ponctuée de cascades saisonnières et de parois abruptes où vivent également des groupes de macaques de Barbarie.',
      ar: 'يمنح عبور المضيق تجربة بصرية مدهشة تتخللها الشلالات الموسمية والمنحدرات الصخرية الشاهقة.',
    },
    historyAndHeritage: {
      fr: 'Kherrata occupe par ailleurs une place importante dans la mémoire historique nationale algérienne.',
      ar: 'تحتل منطقة خراطة أيضاً مكانة بارزة في الذاكرة التاريخية الوطنية للجزائر.',
    },
    characteristics: [
      { fr: 'Parois calcaires monumentales des Babors', ar: 'جروف كلسية شاهقة في جبال البابور' },
      { fr: 'Tunnels et route panoramique historique', ar: 'أنفاق وطريق بانورامي تاريخي' },
    ],
    visitTips: [
      { fr: 'Ne s’arrêter que sur les aires sécurisées prévues à cet effet et rester vigilant face à la circulation.', ar: 'التوقف فقط في المساحات الآمنة المخصصة وتوخي الحذر أثناء القيادة.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Situé sur la RN9 reliant Béjaïa à Sétif via Souk El Tenine et Kherrata.',
        ar: 'يقع على الطريق الوطني رقم 9 الرابط بين بجاية وسطيف عبر سوق الإثنين وخراطة.',
      },
      seasonNote: {
        fr: 'Spectaculaire après les pluies printanières ; prudence accrue en cas de brume ou de pluie.',
        ar: 'يزداد روعة بعد أمطار الربيع مع ضرورة الحذر في الأجواء الممطرة.',
      },
    },
    mapsSearchQuery: 'Gorges de Kherrata, Béjaïa, Algérie',
    osmSearchQuery: 'Gorges de Kherrata',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration des parois montagneuses et gorges escarpées de Béjaïa', 'رسم توضيحي للجروف الجبلية والمضائق بولاية بجاية'),
    gallery: [makeMedia('/images/gouraya-nature.jpg', 'Reliefs des Babors et de Kherrata', 'تضاريس البابور وخراطة')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },

  // === GROTTES ET PAYSAGES ===
  {
    id: 'grottes-aokas',
    slug: 'grottes-aokas',
    name: { fr: 'Grottes féeriques d’Aokas', ar: 'المغارات العجيبة بأوقاس', kab: 'Ifran n Aweqqas' },
    commune: { fr: 'Aokas', ar: 'أوقاس', kab: 'Aweqqas' },
    region: { fr: 'Côte Est de Béjaïa', ar: 'الساحل الشرقي لبجاية', kab: 'Aftis usamar n Bgayet' },
    category: 'grottes',
    secondaryCategories: ['naturel'],
    featured: true,
    shortDescription: {
      fr: 'Cavité karstique remarquable ornée de stalactites et stalagmites sculptées par le temps au bord du littoral d’Aokas.',
      ar: 'مغارة كلسية مدهشة تزينها الصواعد والنوازل التي نحتها الزمن على مقربة من ساحل أوقاس.',
      kab: 'Ifran igamanen icebḥen s yisekkilen n yidɣaɣen i d-yexdem wakud ɣef yidis n uftis n Aweqqas.',
    },
    overview: {
      fr: 'Creusées dans le massif calcaire dominant la côte Est, les grottes féeriques d’Aokas figurent parmi les curiosités géologiques les plus célèbres de la Wilaya de Béjaïa.',
      ar: 'تقع المغارات العجيبة لأوقاس داخل الكتلة الصخرية المطلة على الساحل الشرقي، وتعد من أشهر المعالم الجيولوجية في ولاية بجاية.',
    },
    tourismDescription: {
      fr: 'Le parcours souterrain révèle des salles naturelles aux concrétions minérales variées — colonnes, draperies, stalactites et stalagmites — dans une atmosphère fraîche et silencieuse.',
      ar: 'يكشف المسار الداخلي عن قاعات طبيعية مليئة بالتكوينات المعدنية المتنوعة من صواعد ونوازل وأعمدة كلسية في أجواء باردة وهادئة.',
    },
    characteristics: [
      { fr: 'Concrétions karstiques : stalactites et stalagmites', ar: 'تكوينات كلسية: صواعد ونوازل' },
      { fr: 'Fraîcheur naturelle en toute saison', ar: 'برودة طبيعية طوال السنة' },
    ],
    visitTips: [
      { fr: 'Ne jamais toucher les concrétions calcaires, extrêmement fragiles.', ar: 'يُمنع لمس التكوينات الكلسية لحمايتها من التلف.' },
      { fr: 'Porter des chaussures antidérapantes, le sol souterrain pouvant être humide.', ar: 'ارتداء أحذية غير قابلة للانزلاق لاحتمال رطوبة الأرضية.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Situées dans la commune d’Aokas sur la côte Est, à proximité de la route nationale côtière.',
        ar: 'تقع ببلدية أوقاس على الساحل الشرقي بالقرب من الطريق الساحلي.',
      },
      seasonNote: {
        fr: 'Visite agréable tout au long de l’année, notamment par forte chaleur estivale.',
        ar: 'مناسبة للزيارة طوال السنة، خاصة خلال حرارة الصيف.',
      },
      verificationNotice: {
        fr: 'Les horaires d’ouverture, conditions de visite guidée et tarifs d’entrée n’étant pas figés, vérifiez impérativement les informations actuelles auprès de la DTA Béjaïa ou sur place.',
        ar: 'يرجى التحقق من مواعيد الفتح وشروط الزيارة الموجهة والتذاكر في عين المكان أو لدى مديرية السياحة ببجاية.',
      },
    },
    mapsSearchQuery: 'Grotte féerique d Aokas, Béjaïa, Algérie',
    osmSearchQuery: 'Grotte d Aokas, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration des falaises calcaires et du littoral d’Aokas', 'رسم توضيحي للمنحدرات الكلسية وساحل أوقاس'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Littoral calcaire d’Aokas', 'الساحل الكلسي لأوقاس')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'paysages-cotiers-aokas',
    slug: 'paysages-cotiers-aokas',
    name: { fr: 'Paysages côtiers et Cap d’Aokas', ar: 'المناظر الساحلية ورأس أوقاس', kab: 'Imeẓriyen n uftis d Yixef n Aweqqas' },
    commune: { fr: 'Aokas', ar: 'أوقاس', kab: 'Aweqqas' },
    region: { fr: 'Côte Est de Béjaïa', ar: 'الساحل الشرقي لبجاية', kab: 'Aftis usamar n Bgayet' },
    category: 'grottes',
    secondaryCategories: ['balneaire', 'naturel'],
    shortDescription: {
      fr: 'Corniches spectaculaires où les falaises rocheuses et les versants boisés plongent dans les eaux claires du golfe.',
      ar: 'كورنيشات خلابة تلتقي فيها المنحدرات الصخرية والغابات مباشرة بمياه الخليج الصافية.',
      kab: 'Iberdan n uftis anda idɣaɣen d tẓegwa ttemlilin d waman ṣṣafin n yilel.',
    },
    overview: {
      fr: 'Entre Tichy et Souk El Tenine, le littoral d’Aokas conjugue plages ouvertes, promontoires calcaires et points de vue remarquables sur le golfe de Béjaïa.',
      ar: 'بين تيشي وسوق الإثنين، يجمع ساحل أوقاس بين الشواطئ المفتوحة والرؤوس الكلسية والمطلات الساحرة على خليج بجاية.',
    },
    tourismDescription: {
      fr: 'La route côtière offre des haltes photographiques saisissantes au lever et au coucher du soleil, entre bleu méditerranéen et silhouettes montagneuses.',
      ar: 'يمنح الطريق الساحلي محطات رائعة للتأمل والتصوير عند الشروق والغروب بين زرقة البحر وتضاريس الجبال.',
    },
    characteristics: [
      { fr: 'Belvédères naturels sur le golfe', ar: 'مطلات طبيعية على الخليج' },
      { fr: 'Proximité immédiate des plages et des grottes', ar: 'قرب مباشر من الشواطئ والمغارات' },
    ],
    visitTips: [
      { fr: 'Halte idéale lors d’un circuit côtier reliant Tichy à Melbou.', ar: 'محطة مثالية ضمن مسار ساحلي يربط تيشي بملبو.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Le long de la RN9 sur la côte Est de Béjaïa.',
        ar: 'على طول الطريق الوطني رقم 9 بالساحل الشرقي لبجاية.',
      },
      seasonNote: { fr: 'Agréable toute l’année.', ar: 'ممتع طوال السنة.' },
    },
    mapsSearchQuery: 'Aokas, Béjaïa, Algérie',
    osmSearchQuery: 'Aokas, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration des paysages côtiers d’Aokas', 'رسم توضيحي للمناظر الساحلية لأوقاس'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Côte d’Aokas', 'ساحل أوقاس')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },

  // === PLAGES ET LITTORAL ===
  {
    id: 'tichy',
    slug: 'tichy',
    name: { fr: 'Plages de Tichy', ar: 'شواطئ تيشي', kab: 'Tiftisin n Tici' },
    commune: { fr: 'Tichy', ar: 'تيشي', kab: 'Tici' },
    region: { fr: 'Côte Est de Béjaïa', ar: 'الساحل الشرقي لبجاية', kab: 'Aftis usamar n Bgayet' },
    category: 'balneaire',
    featured: true,
    shortDescription: {
      fr: 'Station balnéaire majeure de la côte Est, appréciée pour ses longues plages de sable fin et son ambiance conviviale.',
      ar: 'محطة سياحية شاطئية رئيسية على الساحل الشرقي، معروفة بشواطئها الرملية الواسعة وأجوائها العائلية.',
      kab: 'Tamnaḍt tameqqrant n uftis usamar, tettwassen s tiftisin-is n rrmel aleqqaq d umager igerrzen.',
    },
    overview: {
      fr: 'Située à l’est de Béjaïa, Tichy est l’une des stations balnéaires les plus connues de la Wilaya. Elle dispose d’un vaste front de mer adossé aux reliefs verdoyants de la côte.',
      ar: 'تقع تيشي شرق مدينة بجاية، وهي من أشهر المحطات الشاطئية في الولاية، وتتميز بواجهة بحرية واسعة تحفها التلال الخضراء.',
    },
    tourismDescription: {
      fr: 'Idéale pour les séjours estivaux en famille, Tichy propose de grandes étendues de sable, des promenades en bord de mer et un accès aisé vers les autres stations de la côte Est.',
      ar: 'تُعد مثالية للعطلات العائلية الصيفية بفضل شواطئها الرملية الممتدة وكورنيشها البحري وسهولة الوصول منها إلى باقي شواطئ الساحل الشرقي.',
    },
    characteristics: [
      { fr: 'Station balnéaire animée en saison estivale', ar: 'محطة شاطئية حيوية خلال موسم الاصطياف' },
      { fr: 'Longues plages de sable fin', ar: 'شواطئ رملية ناعمة وممتدة' },
    ],
    visitTips: [
      { fr: 'En été, privilégier le début de matinée pour profiter du calme et faciliter le stationnement.', ar: 'في الصيف، يُفضل الوصول مبكراً للاستمتاع بالهدوء وسهولة ركن السيارات.' },
    ],
    practicalInfo: {
      accessNote: {
        fr: 'Desservie par la RN9 à l’est de Béjaïa.',
        ar: 'تقع على الطريق الوطني رقم 9 شرق بجاية.',
      },
      seasonNote: {
        fr: 'Baignade principalement de juin à septembre ; promenade agréable toute l’année.',
        ar: 'موسم السباحة أساساً من يونيو إلى سبتمبر مع إمكانية التنزه طوال السنة.',
      },
    },
    mapsSearchQuery: 'Plage de Tichy, Béjaïa, Algérie',
    osmSearchQuery: 'Tichy, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration du littoral et des plages de Tichy à Béjaïa', 'رسم توضيحي لشواطئ تيشي ببجاية'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Plages de la côte Est de Béjaïa', 'شواطئ الساحل الشرقي لبجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'plage-aokas',
    slug: 'plage-aokas',
    name: { fr: 'Plages d’Aokas', ar: 'شواطئ أوقاس', kab: 'Tiftisin n Aweqqas' },
    commune: { fr: 'Aokas', ar: 'أوقاس', kab: 'Aweqqas' },
    region: { fr: 'Côte Est de Béjaïa', ar: 'الساحل الشرقي لبجاية', kab: 'Aftis usamar n Bgayet' },
    category: 'balneaire',
    shortDescription: {
      fr: 'Station balnéaire côtière entourée de montagnes boisées, réputée pour son sable fin et sa proximité avec les grottes.',
      ar: 'محطة شاطئية محاطة بالجبال الخضراء، تشتهر برمالها الناعمة وقربها من المغارات العجيبة.',
      kab: 'Taftist i d-yezzin s yidurar d tẓegwa, tettwassen s rrmel-is aleqqaq d teqreb-is ɣer yifran.',
    },
    overview: {
      fr: 'Commune littorale emblématique de la côte Est de Béjaïa, Aokas combine plaisirs balnéaires, patrimoine géologique et paysages montagneux immédiatement visibles depuis le rivage.',
      ar: 'بلدية ساحلية بارزة شرق بجاية تجمع بين السياحة الشاطئية والمواقع الجيولوجية والمناظر الجبلية المطلة مباشرة على البحر.',
    },
    tourismDescription: {
      fr: 'Les visiteurs apprécient le contraste entre la plage ouverte et les reliefs verdoyants en arrière-plan, ainsi que la possibilité d’associer baignade et découverte des grottes féeriques.',
      ar: 'يستمتع الزوار بالتباين الجميل بين الشاطئ المفتوح والجبال الخضراء، مع إمكانية الجمع بين السباحة وزيارة المغارات العجيبة.',
    },
    characteristics: [
      { fr: 'Plages familiales de la côte Est', ar: 'شواطئ عائلية على الساحل الشرقي' },
      { fr: 'À proximité immédiate des grottes d’Aokas', ar: 'قريبة جداً من المغارات العجيبة بأوقاس' },
    ],
    visitTips: [
      { fr: 'Respecter les zones de baignade surveillées durant la saison estivale.', ar: 'الالتزام بمناطق السباحة المحروسة خلال موسم الصيف.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible via la RN9 entre Tichy et Souk El Tenine.', ar: 'يمكن الوصول إليها عبر الطريق الوطني رقم 9 بين تيشي وسوق الإثنين.' },
      seasonNote: { fr: 'Saison balnéaire estivale et promenades côtières hors saison.', ar: 'موسم اصطياف صيفي ونزهات ساحلية في بقية الفصول.' },
    },
    mapsSearchQuery: 'Plage d Aokas, Béjaïa, Algérie',
    osmSearchQuery: 'Plage d Aokas, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration des plages d’Aokas encadrées de montagnes', 'رسم توضيحي لشواطئ أوقاس المحاطة بالجبال'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Baie d’Aokas', 'خليج أوقاس')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'boulimat',
    slug: 'boulimat',
    name: { fr: 'Plage de Boulimat', ar: 'شاطئ بوليمات', kab: 'Taftist n Bulimaṭ' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Côte Ouest de Béjaïa', ar: 'الساحل الغربي لبجاية', kab: 'Aftis umalu n Bgayet' },
    category: 'balneaire',
    featured: true,
    shortDescription: {
      fr: 'Grande plage naturelle de la côte Ouest bordée de pinèdes et dominée par les collines verdoyantes.',
      ar: 'شاطئ طبيعي واسع على الساحل الغربي تحفه غابات الصنوبر والتلال الخضراء.',
      kab: 'Taftist tagamant tameqqrant n uftis umalu, zzin-as-d tẓegwa n tayda d yidurar izegzawen.',
    },
    overview: {
      fr: 'À l’ouest du chef-lieu de Béjaïa, Boulimat est réputée pour son environnement naturel remarquable où collines boisées, îlots rocheux et eaux limpides composent un tableau méditerranéen préservé.',
      ar: 'غرب مدينة بجاية، يشتهر شاطئ بوليمات ببيئته الطبيعية الساحرة حيث تلتقي التلال المشجرة والجزر الصخرية الصغيرة بالمياه الصافية.',
    },
    tourismDescription: {
      fr: 'Très appréciée des familles et des amoureux de nature, la côte de Boulimat offre une ambiance plus sauvage que la côte Est, idéale pour les journées au bord de l’eau.',
      ar: 'يُقبل عليه محبو الطبيعة والعائلات بفضل طابعه الطبيعي الهادئ وإطلالاته الخلابة على الساحل الغربي.',
    },
    characteristics: [
      { fr: 'Littoral naturel de la côte Ouest', ar: 'ساحل طبيعي غربي محفوظ' },
      { fr: 'Environnement boisé et eaux claires', ar: 'محيط غابي ومياه صافية' },
    ],
    visitTips: [
      { fr: 'Vérifier les conditions de mer avant toute baignade et privilégier les plages autorisées et surveillées.', ar: 'التأكد من حالة البحر قبل السباحة واختيار الشواطئ المسموحة والمحروسة.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible par la RN24 sur la côte Ouest au départ de Béjaïa.', ar: 'عبر الطريق الوطني رقم 24 على الساحل الغربي انطلاقاً من بجاية.' },
      seasonNote: { fr: 'Saison estivale pour la baignade ; superbes panoramas toute l’année.', ar: 'السباحة في الصيف ومناظر طبيعية خلابة طوال السنة.' },
    },
    mapsSearchQuery: 'Plage de Boulimat, Béjaïa, Algérie',
    osmSearchQuery: 'Boulimat, Béjaïa',
    coverImage: makeMedia('/images/hero-cap-carbon.jpg', 'Illustration de la côte Ouest méditerranéenne près de Boulimat', 'رسم توضيحي للساحل الغربي المتوسطي قرب بوليمات'),
    gallery: [makeMedia('/images/hero-cap-carbon.jpg', 'Littoral ouest de Béjaïa', 'الساحل الغربي لبجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'saket',
    slug: 'saket',
    name: { fr: 'Plage de Saket', ar: 'شاطئ ساكت', kab: 'Taftist n Saket' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Côte Ouest de Béjaïa', ar: 'الساحل الغربي لبجاية', kab: 'Aftis umalu n Bgayet' },
    category: 'balneaire',
    shortDescription: {
      fr: 'Anse tranquille et lumineuse de la côte Ouest, entourée de reliefs boisés descendant vers la mer.',
      ar: 'خليج هادئ ومشرق على الساحل الغربي تحيط به المرتفعات الخضراء المنحدرة نحو البحر.',
      kab: 'Aɣezraw iɛezlen u yecbeḥ deg uftis umalu, zzin-as-d yidurar i d-yeɣlin ɣer yilel.',
    },
    overview: {
      fr: 'Prolongeant la côte Ouest après Boulimat, Saket séduit par sa baie dégagée, ses eaux claires et son atmosphère paisible face à la Méditerranée.',
      ar: 'يقع ساكت بعد بوليمات على الساحل الغربي، ويمتاز بخليجه المفتوح ومياهه النقية وأجوائه الهادئة.',
    },
    tourismDescription: {
      fr: 'Destination prisée pour des sorties balnéaires calmes et des haltes sur la corniche ouest menant vers Beni Ksila.',
      ar: 'وجهة محببة للرحلات الشاطئية الهادئة والتوقف على طول الكورنيش الغربي نحو بني كسيلة.',
    },
    characteristics: [
      { fr: 'Baie ouverte de la côte Ouest', ar: 'خليج مفتوح على الساحل الغربي' },
      { fr: 'Cadre naturel verdoyant', ar: 'محيط طبيعي أخضر' },
    ],
    visitTips: [
      { fr: 'Profiter de la route panoramique côtière ouest en combinant Boulimat et Saket.', ar: 'الاستمتاع بالطريق الساحلي الغربي عبر الجمع بين بوليمات وساكت.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Sur la RN24 à l’ouest de Béjaïa, au-delà de Boulimat.', ar: 'على الطريق الوطني رقم 24 غرب بجاية بعد بوليمات.' },
      seasonNote: { fr: 'Été pour la baignade ; printemps et automne pour la détente.', ar: 'الصيف للسباحة والربيع والخريف للاستجمام.' },
    },
    mapsSearchQuery: 'Plage de Saket, Béjaïa, Algérie',
    osmSearchQuery: 'Saket, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration de la baie naturelle de Saket à Béjaïa', 'رسم توضيحي لخليج ساكت الطبيعي ببجاية'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Rivage de Saket', 'ساحل ساكت')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'souk-el-tenine',
    slug: 'souk-el-tenine',
    name: { fr: 'Souk El Tenine', ar: 'سوق الإثنين', kab: 'Suq Letnin' },
    commune: { fr: 'Souk El Tenine', ar: 'سوق الإثنين', kab: 'Suq Letnin' },
    region: { fr: 'Côte Est de Béjaïa', ar: 'الساحل الشرقي لبجاية', kab: 'Aftis usamar n Bgayet' },
    category: 'balneaire',
    shortDescription: {
      fr: 'Commune littorale connue pour ses grandes plages de sable doré et sa situation carrefour entre mer et montagne.',
      ar: 'بلدية ساحلية معروفة بشواطئها الرملية الواسعة وموقعها الرابط بين البحر والجبل.',
      kab: 'Taɣiwant n uftis yettwassnen s tiftisin-is timeqqranin n rrmel awraɣ gar yilel d udrar.',
    },
    overview: {
      fr: 'Située sur la côte Est entre Aokas et Melbou, Souk El Tenine offre de larges plages ouvertes et constitue un point de passage stratégique vers les gorges de Kherrata.',
      ar: 'تقع سوق الإثنين على الساحل الشرقي بين أوقاس وملبو، وتوفر شواطئ واسعة وتعد نقطة عبور هامة نحو مضيق خراطة.',
    },
    tourismDescription: {
      fr: 'Appréciée des familles pendant la saison estivale, la commune marie front de mer spacieux et ouverture immédiate sur l’arrière-pays montagneux.',
      ar: 'تحظى بإقبال عائلي كبير صيفاً وتجمع بين الواجهة البحرية الواسعة والانفتاح على المناطق الجبلية.',
    },
    characteristics: [
      { fr: 'Vastes plages familiales de la côte Est', ar: 'شواطئ عائلية واسعة شرق بجاية' },
      { fr: 'Carrefour vers les gorges de Kherrata', ar: 'نقطة انطلاق نحو مضيق خراطة' },
    ],
    visitTips: [
      { fr: 'Combinez une matinée à la plage avec une excursion vers les gorges de Kherrata ou Melbou.', ar: 'يمكن الجمع بين صباح على الشاطئ وجولة نحو مضيق خراطة أو ملبو.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible par la RN9 et la RN43 sur la côte Est.', ar: 'عبر الطريقين الوطنيين رقم 9 و43 على الساحل الشرقي.' },
      seasonNote: { fr: 'Animée en période estivale.', ar: 'حيوية خاصة خلال فصل الصيف.' },
    },
    mapsSearchQuery: 'Souk El Tenine, Béjaïa, Algérie',
    osmSearchQuery: 'Souk El Tenine, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration du littoral sablonneux de Souk El Tenine', 'رسم توضيحي لشواطئ سوق الإثنين الرملية'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Plages de Souk El Tenine', 'شواطئ سوق الإثنين')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'melbou',
    slug: 'melbou',
    name: { fr: 'Plages et corniche de Melbou', ar: 'شواطئ وكورنيش ملبو', kab: 'Tiftisin d uftis n Melbu' },
    commune: { fr: 'Melbou', ar: 'ملبو', kab: 'Melbu' },
    region: { fr: 'Extrême Est de la Wilaya', ar: 'أقصى شرق ولاية بجاية', kab: 'Tagara tusammart n twilayt' },
    category: 'balneaire',
    secondaryCategories: ['naturel'],
    shortDescription: {
      fr: 'Commune côtière pittoresque aux confins orientaux de la Wilaya, mêlant plages claires, criques et reliefs des Babors.',
      ar: 'بلدية ساحلية جميلة في أقصى شرق الولاية، تجمع بين الشواطئ الصافية والخلجان وسفوح البابور.',
      kab: 'Taɣiwant n uftis di tagara tusammart n twilayt, gar tiftisin ṣṣafin d yidurar n Babur.',
    },
    overview: {
      fr: 'À l’extrémité est du littoral de Béjaïa, Melbou offre une succession de plages, de criques et de falaises spectaculaires au pied des contreforts des Babors.',
      ar: 'في أقصى شرق ساحل بجاية، تمتد ملبو بسلسلة من الشواطئ والخلجان والمنحدرات الساحرة عند سفوح جبال البابور.',
    },
    tourismDescription: {
      fr: 'Sa corniche et ses plages lumineuses en font l’étape finale idéale du circuit balnéaire de la côte Est.',
      ar: 'يجعلها كورنيشها وشواطئها الصافية المحطة الختامية المثالية لمسار شواطئ الساحل الشرقي.',
    },
    characteristics: [
      { fr: 'Plages et criques de l’extrême Est', ar: 'شواطئ وخلجان أقصى الشرق' },
      { fr: 'Proximité immédiate des reliefs des Babors', ar: 'إطلالة مباشرة على مرتفعات البابور' },
    ],
    visitTips: [
      { fr: 'Prendre le temps de longer la corniche pour admirer les contrastes entre roche, forêt et mer.', ar: 'التمهل على طول الكورنيش للاستمتاع بتباين الصخور والغابة والبحر.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Sur la RN43 à l’est de Souk El Tenine.', ar: 'على الطريق الوطني رقم 43 شرق سوق الإثنين.' },
      seasonNote: { fr: 'Très prisée en été, paisible au printemps et à l’automne.', ar: 'مقصودة صيفاً وهادئة في الربيع والخريف.' },
    },
    mapsSearchQuery: 'Melbou, Béjaïa, Algérie',
    osmSearchQuery: 'Melbou, Béjaïa',
    coverImage: makeMedia('/images/aokas-coast.jpg', 'Illustration des criques et plages de Melbou à Béjaïa', 'رسم توضيحي لخلجان وشواطئ ملبو ببجاية'),
    gallery: [makeMedia('/images/aokas-coast.jpg', 'Littoral de Melbou', 'ساحل ملبو')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },

  // === PATRIMOINE HISTORIQUE ===
  {
    id: 'casbah-bejaia',
    slug: 'casbah-bejaia',
    name: { fr: 'Casbah de Béjaïa', ar: 'قصبة بجاية', kab: 'Lqeṣba n Bgayet' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Vieille ville · Centre historique', ar: 'المدينة القديمة · المركز التاريخي', kab: 'Tamdint taqburt · Talemmast tamezruyant' },
    category: 'historique',
    secondaryCategories: ['culturel'],
    featured: true,
    shortDescription: {
      fr: 'Citadelle historique majeure dominant le port, témoin des époques hammadite, almohade, espagnole et ottomane.',
      ar: 'قلعة تاريخية عريقة تشرف على الميناء، شاهدة على العصور الحمادية والموحدية والإسبانية والعثمانية.',
      kab: 'Tiɣremt tamezruyant tameqqrant ɣef usagen, d inigi n talliyin taḥemmadiyt, talmuḥadiyt, taspenyulit d tɛutmanit.',
    },
    overview: {
      fr: 'Érigée sur un promontoire dominant la baie et le port de Béjaïa, la Casbah constitue l’un des ensembles monumentaux les plus importants du patrimoine historique algérien.',
      ar: 'شُيّدت قصبة بجاية على مرتفع يطل على الخليج والميناء، وتُعد من أهم المعالم الأثرية والتاريخية في الجزائر.',
    },
    tourismDescription: {
      fr: 'Classée monument historique national, elle invite à plonger dans les strates architecturales successives d’une grande cité méditerranéenne qui fut capitale des Hammadites et haut lieu d’échanges savants.',
      ar: 'مصنفة كمعلم تاريخي وطني، وتتيح للزائر استكشاف الطبقات المعمارية المتعاقبة لمدينة متوسطية عريقة كانت عاصمة للحماديين ومركزاً علمياً بارزاً.',
    },
    historyAndHeritage: {
      fr: 'Son histoire reflète le destin stratégique de Béjaïa en Méditerranée, depuis son essor médiéval hammadite (XIe–XIIe siècles) jusqu’aux remaniements militaires ultérieurs. Les travaux de restauration et les conditions de visite intérieure sont à vérifier sur place.',
      ar: 'يعكس تاريخها المكانة الاستراتيجية لبجاية في المتوسط منذ العهد الحمادي (القرنين 11 و12م) مروراً بالمراحل العسكرية اللاحقة. يُرجى التحقق محلياً من شروط الزيارة الداخلية.',
    },
    characteristics: [
      { fr: 'Monument historique national classé', ar: 'معلم تاريخي وطني مصنف' },
      { fr: 'Architecture défensive méditerranéenne', ar: 'عمارة دفاعية متوسطية' },
      { fr: 'Vue remarquable sur le port historique', ar: 'إطلالة مميزة على الميناء التاريخي' },
    ],
    visitTips: [
      { fr: 'Intégrer la Casbah dans une promenade pédestre à travers la vieille ville avec Bab El Bhar et Bordj Moussa.', ar: 'إدراج القصبة ضمن جولة مشي في المدينة القديمة تشمل باب البحر وبرج موسى.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Située dans la vieille ville de Béjaïa, à proximité du port.', ar: 'تقع في المدينة القديمة ببجاية بالقرب من الميناء.' },
      seasonNote: { fr: 'Agréable toute l’année.', ar: 'مناسبة للزيارة طوال السنة.' },
      verificationNotice: {
        fr: 'Vérifier les jours et horaires d’ouverture au public auprès des services de la culture ou de la DTA Béjaïa avant la visite.',
        ar: 'يرجى التحقق من أيام ومواعيد الفتح للجمهور لدى مصالح الثقافة أو مديرية السياحة ببجاية.',
      },
    },
    mapsSearchQuery: 'Casbah de Béjaïa, Algérie',
    osmSearchQuery: 'Casbah de Béjaïa',
    coverImage: makeMedia('/images/casbah-heritage.jpg', 'Illustration architecturale de la Casbah et des fortifications de Béjaïa', 'رسم معماري توضيحي لقصبة بجاية وحصونها التاريخية'),
    gallery: [makeMedia('/images/casbah-heritage.jpg', 'Fortifications de la vieille ville de Béjaïa', 'تحصينات المدينة القديمة لبجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'bab-el-bhar',
    slug: 'bab-el-bhar',
    name: { fr: 'Bab El Bhar (Porte Sarrasine)', ar: 'باب البحر', kab: 'Bab Lbaḥer (Tawwurt n Yilel)' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Vieille ville · Front de mer', ar: 'المدينة القديمة · الواجهة البحرية', kab: 'Tamdint taqburt · Aftis' },
    category: 'historique',
    featured: true,
    shortDescription: {
      fr: 'Porte maritime médiévale monumentale datant de l’époque hammadite, symbole architectural de l’ancienne En-Naciria.',
      ar: 'بوابة بحرية تاريخية تعود للعهد الحمادي، وتُعد رمزاً معمارياً لمدينة الناصرية العريقة.',
      kab: 'Tawwurt tamezruyant n yilel seg tallit taḥemmadiyt, d azamul n tsegda n En-Naciria taqburt.',
    },
    overview: {
      fr: 'Également connue sous le nom de Porte Sarrasine, Bab El Bhar est l’un des vestiges les plus emblématiques de l’architecture hammadite à Béjaïa. Elle marquait autrefois l’accès maritime vers le port et l’arsenal médiéval.',
      ar: 'يُعد باب البحر من أبرز شواهد العمارة الحمادية في بجاية، إذ كان يشكّل المدخل البحري الرئيسي نحو الميناء والترسانة البحرية في العصور الوسطى.',
    },
    tourismDescription: {
      fr: 'Son arc monumental en pierre ocre, situé près du port et de la place Gueydon, témoigne du rayonnement maritime et commercial de Béjaïa au Moyen Âge.',
      ar: 'يشهد قوسه الحجري المهيب بالقرب من الميناء وساحة غيدون على الإشعاع البحري والتجاري العريق لبجاية في العصر الوسيط.',
    },
    historyAndHeritage: {
      fr: 'Datée de la période hammadite (XIe siècle), Bab El Bhar est classée monument historique national.',
      ar: 'يعود باب البحر إلى العهد الحمادي (القرن الحادي عشر الميلادي) وهو مصنف كمعلم تاريخي وطني.',
    },
    characteristics: [
      { fr: 'Vestige architectural hammadite (XIe siècle)', ar: 'معلم معماري حمادي من القرن 11م' },
      { fr: 'Monument historique classé', ar: 'معلم تاريخي مصنف' },
    ],
    visitTips: [
      { fr: 'Très accessible à pied lors d’une balade dans le centre historique et vers la Brise de Mer.', ar: 'يسهل الوصول إليه سيراً خلال جولة في الوسط التاريخي ونحو نسمة البحر.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Au bas de la vieille ville de Béjaïa, près de l’entrée du port.', ar: 'في أسفل المدينة القديمة لبجاية قرب مدخل الميناء.' },
      seasonNote: { fr: 'Visible librement de l’extérieur toute l’année.', ar: 'يمكن مشاهدته من الخارج على مدار السنة.' },
    },
    mapsSearchQuery: 'Bab El Bhar, Béjaïa, Algérie',
    osmSearchQuery: 'Bab El Bhar, Béjaïa',
    coverImage: makeMedia('/images/casbah-heritage.jpg', 'Illustration de la porte maritime historique Bab El Bhar à Béjaïa', 'رسم توضيحي لبوابة باب البحر التاريخية ببجاية'),
    gallery: [makeMedia('/images/casbah-heritage.jpg', 'Bab El Bhar et remparts historiques', 'باب البحر والأسوار التاريخية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'remparts-hammadites',
    slug: 'remparts-hammadites',
    name: { fr: 'Remparts hammadites', ar: 'الأسوار الحمادية', kab: 'Iɣerban Iḥemmadiyen' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Vieille ville de Béjaïa', ar: 'المدينة القديمة لبجاية', kab: 'Tamdint taqburt n Bgayet' },
    category: 'historique',
    shortDescription: {
      fr: 'Vestiges de l’enceinte fortifiée médiévale qui protégeait la capitale hammadite En-Naciria entre mer et montagne.',
      ar: 'بقايا السور الدفاعي العريق الذي كان يحمي العاصمة الحمادية الناصرية بين البحر والجبل.',
      kab: 'Later n yiɣerban imezruyanen i yettḥaraben tamanaɣt taḥemmadiyt En-Naciria gar yilel d udrar.',
    },
    overview: {
      fr: 'Fondée comme capitale par le prince hammadite En-Nacer au XIe siècle, Béjaïa fut ceinturée d’un imposant système de remparts et de portes monumentales dont subsistent plusieurs tronçons remarquables, dont Bab El Fouka.',
      ar: 'أُحيطت بجاية منذ اتخاذها عاصمة في عهد الأمير الحمادي الناصر خلال القرن الحادي عشر الميلادي بسور دفاعي ضخم وبوابات تاريخية لا تزال عدة أجزاء منها قائمة.',
    },
    tourismDescription: {
      fr: 'Suivre le tracé des anciens remparts permet de comprendre l’urbanisme historique de la cité et son intégration remarquable sur les pentes du Gouraya.',
      ar: 'يتيح تتبّع امتداد الأسوار القديمة فهم العمران التاريخي للمدينة واندماجها الفريد على سفوح جبل قوراية.',
    },
    characteristics: [
      { fr: 'Patrimoine défensif médiéval hammadite', ar: 'تراث دفاعي حمادي من العصر الوسيط' },
      { fr: 'Tronçons visibles dans le centre ancien', ar: 'أجزاء قائمة في قلب المدينة القديمة' },
    ],
    visitTips: [
      { fr: 'Découvrir les remparts dans le cadre du circuit « Béjaïa historique ».', ar: 'يُنصح باستكشاف الأسوار ضمن مسار «بجاية التاريخية».' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Plusieurs segments accessibles à pied dans la haute et basse ville de Béjaïa.', ar: 'توجد عدة أجزاء يمكن زيارتها سيراً في المدينة القديمة ببجاية.' },
      seasonNote: { fr: 'Accessible toute l’année.', ar: 'متاحة طوال السنة.' },
    },
    mapsSearchQuery: 'Bab El Fouka, Béjaïa, Algérie',
    osmSearchQuery: 'Remparts hammadites, Béjaïa',
    coverImage: makeMedia('/images/casbah-heritage.jpg', 'Illustration des remparts médiévaux hammadites de Béjaïa', 'رسم توضيحي للأسوار الحمادية ببجاية'),
    gallery: [makeMedia('/images/casbah-heritage.jpg', 'Enceinte historique de Béjaïa', 'السور التاريخي لبجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'fort-gouraya',
    slug: 'fort-gouraya',
    name: { fr: 'Fort Gouraya', ar: 'حصن قوراية', kab: 'Lberǧ n Guraya' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Sommet du Mont Gouraya', ar: 'قمة جبل قوراية', kab: 'Taqacuct n udrar n Guraya' },
    category: 'historique',
    secondaryCategories: ['montagne'],
    shortDescription: {
      fr: 'Fortification perchée au sommet du Mont Gouraya, poste de vigie historique offrant un panorama incomparable sur toute la région.',
      ar: 'تحصين تاريخي متربع على قمة جبل قوراية، يوفر إطلالة استثنائية على كامل الخليج والمنطقة.',
      kab: 'Lberǧ amezruyan di tqacuct n udrar n Guraya, yettak-d tamuɣli ur nesɛi tamtilt ɣef temnaḍt merra.',
    },
    overview: {
      fr: 'Couronnant le sommet du Mont Gouraya, le fort veille sur le golfe de Béjaïa depuis des siècles. Son emplacement stratégique permettait de surveiller les approches maritimes et terrestres.',
      ar: 'يتوّج حصن قوراية قمة الجبل مشرفاً على خليج بجاية منذ قرون بفضل موقعه الاستراتيجي الفريد لمراقبة البحر والبر.',
    },
    tourismDescription: {
      fr: 'Outre son intérêt architectural et historique, le Fort Gouraya constitue l’un des points de vue les plus spectaculaires de toute la Wilaya.',
      ar: 'إلى جانب قيمته التاريخية والمعمارية، يُعد الحصن من أروع نقاط المشاهدة البانورامية في الولاية بأكملها.',
    },
    characteristics: [
      { fr: 'Fortification sommitale historique', ar: 'حصن تاريخي في القمة' },
      { fr: 'Panorama à 360° sur mer et montagnes', ar: 'بانوراما شاملة على البحر والجبال' },
    ],
    visitTips: [
      { fr: 'Prévoir des vêtements adaptés au vent sur les hauteurs.', ar: 'ارتداء ملابس مناسبة للرياح في المرتفعات.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible par la route du Mont Gouraya puis un court sentier piéton.', ar: 'عبر طريق جبل قوراية ثم مسار قصير سيراً على الأقدام.' },
      seasonNote: { fr: 'Accessible toute l’année ; privilégier les journées dégagées.', ar: 'متاح طوال السنة ويفضل اختيار أيام صافية.' },
    },
    mapsSearchQuery: 'Fort Gouraya, Béjaïa, Algérie',
    osmSearchQuery: 'Fort Gouraya, Béjaïa',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration du Fort Gouraya au sommet de la montagne', 'رسم توضيحي لحصن قوراية على قمة الجبل'),
    gallery: [makeMedia('/images/gouraya-nature.jpg', 'Sommet du Fort Gouraya', 'قمة حصن قوراية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'fort-sidi-abdelkader',
    slug: 'fort-sidi-abdelkader',
    name: { fr: 'Fort Sidi Abdelkader', ar: 'حصن سيدي عبد القادر', kab: 'Lberǧ n Sidi Ɛebdelqader' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Front de mer · Béjaïa', ar: 'الواجهة البحرية · بجاية', kab: 'Aftis · Bgayet' },
    category: 'historique',
    shortDescription: {
      fr: 'Ouvrage fortifié côtier gardant l’entrée du port de Béjaïa, maillon historique du système défensif maritime de la cité.',
      ar: 'حصن ساحلي تاريخي يحرس مدخل ميناء بجاية ويشكل حلقة هامة في المنظومة الدفاعية البحرية للمدينة.',
      kab: 'Lberǧ n uftis iɛussen anekcum n usagen n Bgayet, d aḥric seg unagraw n uḥuddu n temdint.',
    },
    overview: {
      fr: 'Situé en bordure de mer à l’est du port, le Fort Sidi Abdelkader appartient au réseau de fortifications côtières qui assuraient autrefois la protection de la rade de Béjaïa.',
      ar: 'يقع حصن سيدي عبد القادر على حافة البحر شرق الميناء، وينتمي إلى شبكة التحصينات الساحلية التي كانت تحمي مرسى بجاية قديماً.',
    },
    tourismDescription: {
      fr: 'Visible depuis la promenade maritime et les hauteurs du Gouraya, le fort enrichit la lecture patrimoniale du front de mer béjaoui.',
      ar: 'يظهر الحصن بوضوح من الواجهة البحرية ومن مرتفعات قوراية، ليضيف بعداً تاريخياً مميزاً لساحل المدينة.',
    },
    characteristics: [
      { fr: 'Fortification côtière du port de Béjaïa', ar: 'تحصين ساحلي عند ميناء بجاية' },
      { fr: 'Site patrimonial du front de mer', ar: 'معلم تراثي على الواجهة البحرية' },
    ],
    visitTips: [
      { fr: 'Vérifier sur place les possibilités d’accès immédiat, certaines zones portuaires étant réglementées.', ar: 'يرجى التحقق محلياً من إمكانية الاقتراب نظراً لتنظيم بعض المناطق المينائية.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Secteur du port et de la Brise de Mer à Béjaïa.', ar: 'قطاع الميناء ونسمة البحر بمدينة بجاية.' },
      seasonNote: { fr: 'Observation extérieure possible toute l’année.', ar: 'يمكن مشاهدته من الخارج طوال السنة.' },
      verificationNotice: {
        fr: 'Conditions d’accès intérieur à vérifier localement.',
        ar: 'شروط الدخول الداخلي خاضعة للتحقق المحلي.',
      },
    },
    mapsSearchQuery: 'Fort Sidi Abdelkader, Béjaïa, Algérie',
    osmSearchQuery: 'Fort Sidi Abdelkader, Béjaïa',
    coverImage: makeMedia('/images/casbah-heritage.jpg', 'Illustration des fortifications maritimes de Béjaïa', 'رسم توضيحي للتحصينات البحرية لمدينة بجاية'),
    gallery: [makeMedia('/images/casbah-heritage.jpg', 'Fortifications côtières de Béjaïa', 'التحصينات الساحلية لبجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'musee-bordj-moussa',
    slug: 'musee-bordj-moussa',
    name: { fr: 'Musée Bordj Moussa', ar: 'متحف برج موسى', kab: 'Asalay n Berǧ Musa' },
    commune: { fr: 'Béjaïa', ar: 'بجاية', kab: 'Bgayet' },
    region: { fr: 'Vieille ville de Béjaïa', ar: 'المدينة القديمة لبجاية', kab: 'Tamdint taqburt n Bgayet' },
    category: 'historique',
    secondaryCategories: ['culturel'],
    featured: true,
    shortDescription: {
      fr: 'Ancien fort historique reconverti en musée présentant des collections archéologiques, historiques et naturalistes de Béjaïa.',
      ar: 'حصن تاريخي قديم تحول إلى متحف يضم مجموعات أثرية وتاريخية وطبيعية من ولاية بجاية.',
      kab: 'Lberǧ amezruyan yuɣalen d asalay yeskanayen tigemmi tarxiwluǧit, tamezruyant d tagamant n Bgayet.',
    },
    overview: {
      fr: 'Installé dans l’enceinte de l’ancien fort Bordj Moussa (connu historiquement aussi sous le nom de Fort Barral), le musée de Béjaïa met en lumière l’histoire millénaire de la région, de l’Antiquité romaine de Saldae aux périodes médiévales et contemporaines.',
      ar: 'يقع المتحف داخل الحصن التاريخي برج موسى، ويسلط الضوء على التاريخ العريق لمنطقة بجاية من حقبة صالدا الرومانية إلى العصور الإسلامية والحديثة.',
    },
    tourismDescription: {
      fr: 'Étape culturelle essentielle pour tout visiteur souhaitant comprendre l’évolution de Béjaïa à travers ses mosaïques, inscriptions, objets d’art et collections d’histoire naturelle.',
      ar: 'محطة ثقافية أساسية لكل زائر يرغب في التعرف على تطور بجاية عبر الفسيفساء والنقائش والتحف ومجموعات التاريخ الطبيعي.',
    },
    characteristics: [
      { fr: 'Collections archéologiques et historiques', ar: 'مجموعات أثرية وتاريخية' },
      { fr: 'Installé dans une fortification historique', ar: 'يقع داخل حصن تاريخي عريق' },
    ],
    visitTips: [
      { fr: 'Vérifier les jours d’ouverture (souvent fermés un jour hebdomadaire dans les musées publics) avant de vous déplacer.', ar: 'يُنصح بالتحقق من أيام ومواعيد فتح المتحف قبل الزيارة.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Centre historique de Béjaïa, proche de la place du 1er Novembre et de la Casbah.', ar: 'المركز التاريخي لبجاية بالقرب من ساحة أول نوفمبر والقصبة.' },
      seasonNote: { fr: 'Visitable toute l’année selon le calendrier muséal.', ar: 'مفتوح طوال السنة وفق برنامج المتحف.' },
      verificationNotice: {
        fr: 'Horaires d’ouverture et tarifs d’entrée non affichés sans vérification en temps réel ; consulter le musée ou la DTA Béjaïa.',
        ar: 'لم تُدرج المواعيد والرسوم دون تحقق آني؛ يرجى مراجعة المتحف أو خرائط جوجل.',
      },
    },
    mapsSearchQuery: 'Musée Bordj Moussa, Béjaïa, Algérie',
    osmSearchQuery: 'Bordj Moussa, Béjaïa',
    coverImage: makeMedia('/images/casbah-heritage.jpg', 'Illustration patrimoniale évoquant le Fort et Musée Bordj Moussa à Béjaïa', 'رسم تراثي توضيحي لحصن ومتحف برج موسى ببجاية'),
    gallery: [makeMedia('/images/casbah-heritage.jpg', 'Patrimoine fortifié de Béjaïa', 'التراث المحصّن ببجاية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },

  // === VILLAGES ET PATRIMOINE RÉGIONAL ===
  {
    id: 'village-uthrunen',
    slug: 'village-uthrunen',
    name: { fr: 'Village d’Uthrunen', ar: 'قرية أوثرونن', kab: 'Taddart n Utrunen' },
    commune: { fr: 'Région de Béjaïa (commune à vérifier terrain)', ar: 'منطقة بجاية (تحديد إداري قيد التحقق)', kab: 'Tamnaḍt n Bgayet' },
    region: { fr: 'Villages traditionnels de Kabylie', ar: 'القرى التقليدية بالقبائل', kab: 'Tudrin tinsayanin n Leqbayel' },
    category: 'culturel',
    shortDescription: {
      fr: 'Village kabyle traditionnel illustrant l’architecture rurale montagnarde, la solidarité villageoise et la préservation des savoir-faire.',
      ar: 'قرية قبائلية تقليدية تجسّد العمارة الريفية الجبلية والتضامن القروي والحفاظ على التقاليد.',
      kab: 'Taddart taqvaylit tansayant i d-yesskanayen tasegda n udrar, tiwizi d uḥraz n tẓuri n lejdud.',
    },
    overview: {
      fr: 'Inscrit dans la richesse des villages traditionnels de la Wilaya de Béjaïa, le village d’Uthrunen incarne l’authenticité de l’habitat kabyle en pierre et tuiles ainsi que la vie communautaire au cœur des oliveraies.',
      ar: 'تمثل قرية أوثرونن نموذجاً لأصالة القرى القبائلية في ولاية بجاية بعمارتها التقليدية وبيئتها الريفية وسط بساتين الزيتون.',
    },
    tourismDescription: {
      fr: 'La découverte des ruelles calmes, des points de vue sur les collines et de l’hospitalité locale offre une immersion respectueuse dans la culture rurale kabyle.',
      ar: 'تمنح زيارة الأزقة الهادئة والمطلات الريفية تجربة ثقافية أصيلة للتعرف على نمط الحياة القبائلية.',
    },
    characteristics: [
      { fr: 'Habitat rural traditionnel kabyle', ar: 'عمارة ريفية قبائلية تقليدية' },
      { fr: 'Paysages d’oliveraies et de collines', ar: 'مناظر بساتين الزيتون والتلال' },
    ],
    visitTips: [
      { fr: 'Adopter une démarche de tourisme respectueux envers les habitants et demander l’autorisation avant de photographier des personnes.', ar: 'التحلي بآداب السياحة المسؤولة واحترام خصوصية السكان قبل التصوير.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accès routier local dans l’arrière-pays kabyle de la Wilaya de Béjaïa.', ar: 'طريق محلي في الريف القبائلي لولاية بجاية.' },
      seasonNote: { fr: 'Printemps et automne particulièrement agréables.', ar: 'الربيع والخريف مناسبان جداً للزيارة.' },
      verificationNotice: {
        fr: 'Fiche en cours d’enrichissement documentaire : localisation précise et rattachement communal détaillé à confirmer auprès de la DTA Béjaïa.',
        ar: 'بطاقة قيد الاستكمال التوثيقي: يُرجى تأكيد الموقع الدقيق والتبعية البلدية لدى مديرية السياحة لبجاية.',
      },
    },
    mapsSearchQuery: 'Village traditionnel Kabyle, Béjaïa, Algérie',
    osmSearchQuery: 'Béjaïa, Algérie',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration d’un village traditionnel kabyle de la Wilaya de Béjaïa', 'رسم توضيحي لقرية قبائلية تقليدية بولاية بجاية'),
    gallery: [makeMedia('/images/kabyle-village.jpg', 'Village kabyle traditionnel', 'قرية قبائلية تقليدية')],
    sources: [
      {
        label: 'Inventaire initial Béjaïa Explorer — À compléter avec la DTA Béjaïa',
        url: 'https://www.dta-bejaia.com/',
        verificationStatus: 'to_verify_field',
        verificationNote: {
          fr: 'Données topographiques et historiques détaillées à valider sur le terrain.',
          ar: 'البيانات الميدانية والتاريخية المفصلة بحاجة إلى تدقيق محلي.',
        },
      },
    ],
  },
  {
    id: 'toudja',
    slug: 'toudja',
    name: { fr: 'Toudja', ar: 'توجة', kab: 'Tuǧa' },
    commune: { fr: 'Toudja', ar: 'توجة', kab: 'Tuǧa' },
    region: { fr: 'Ouest de Béjaïa · Massif côtier', ar: 'غرب بجاية · المرتفعات الساحلية', kab: 'Amalu n Bgayet · Adrar n uftis' },
    category: 'culturel',
    secondaryCategories: ['naturel', 'historique'],
    featured: true,
    shortDescription: {
      fr: 'Commune montagnarde célèbre depuis l’Antiquité pour ses sources d’eau pure, ses vergers et son aqueduc romain.',
      ar: 'بلدية جبلية شهيرة منذ العصور القديمة بينابيعها العذبة وبساتينها والقناة الرومانية التاريخية.',
      kab: 'Taɣiwant n udrar yettwassnen seg zik s tliwa-s n waman ṣṣafin, tibḥirin-is d usaka arumani.',
    },
    overview: {
      fr: 'Blottie dans un écrin de verdure à l’ouest de Béjaïa, Toudja est renommée pour l’abondance et la qualité de ses sources naturelles ainsi que pour ses villages traditionnels entourés d’orangers et d’oliviers.',
      ar: 'تتربع توجة وسط طبيعة خضراء غرب بجاية، وتشتهر بوفرة وجودة ينابيعها الطبيعية وقراها التقليدية المحاطة ببساتين البرتقال والزيتون.',
    },
    tourismDescription: {
      fr: 'Destination de fraîcheur et de patrimoine, Toudja associe promenades au milieu des sources, architecture kabyle et découverte de vestiges hydrauliques antiques.',
      ar: 'تجمع توجة بين نزهات الطبيعة الباردة والعمارة القبائلية واكتشاف آثار القنوات المائية القديمة.',
    },
    historyAndHeritage: {
      fr: 'Les sources de Toudja alimentaient dès l’époque romaine l’antique cité de Saldae (Béjaïa) grâce à un remarquable aqueduc et au célèbre tunnel hydraulique d’El Hanaia.',
      ar: 'كانت ينابيع توجة تزوّد مدينة صالدا الرومانية (بجاية) بالماء عبر قناة رومانية تاريخية ونفق مائي هندسي بارز.',
    },
    characteristics: [
      { fr: 'Sources naturelles réputées', ar: 'ينابيع مائية طبيعية شهيرة' },
      { fr: 'Patrimoine hydraulique antique (aqueduc romain)', ar: 'تراث مائي قديم (القناة الرومانية)' },
      { fr: 'Vergers, agrumes et oliveraies', ar: 'بساتين الحمضيات والزيتون' },
    ],
    visitTips: [
      { fr: 'Combiner la découverte de Toudja avec une descente vers la côte Ouest (Boulimat ou Saket).', ar: 'يمكن الجمع بين زيارة توجة والنزول نحو الساحل الغربي (بوليمات أو ساكت).' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible par route montagneuse depuis Béjaïa ou El Kseur.', ar: 'عبر الطريق الجبلي انطلاقاً من بجاية أو القصر.' },
      seasonNote: { fr: 'Particulièrement rafraîchissante au printemps et en été.', ar: 'منعشة للغاية في فصلي الربيع والصيف.' },
    },
    mapsSearchQuery: 'Toudja, Béjaïa, Algérie',
    osmSearchQuery: 'Toudja, Béjaïa',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration des villages et vergers verdoyants de Toudja à Béjaïa', 'رسم توضيحي لقرى وبساتين توجة الخضراء ببجاية'),
    gallery: [makeMedia('/images/kabyle-village.jpg', 'Villages perchés de Toudja', 'قرى توجة الجبلية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'vallee-de-la-soummam',
    slug: 'vallee-de-la-soummam',
    name: { fr: 'Vallée de la Soummam', ar: 'وادي الصومام', kab: 'Asif n Summam' },
    commune: { fr: 'Akbou / Sidi Aïch / El Kseur / Ouzellaguen', ar: 'أقبو / سيدي عيش / القصر / أوزلاقن', kab: 'Aqbu / Sidi Ɛic / Leqṣer / Uzellagen' },
    region: { fr: 'Axe central de la Wilaya de Béjaïa', ar: 'المحور الأوسط لولاية بجاية', kab: 'Abrid alemmas n twilayt n Bgayet' },
    category: 'culturel',
    secondaryCategories: ['historique', 'naturel'],
    featured: true,
    shortDescription: {
      fr: 'Artère géographique, agricole et historique majeure de la Wilaya, jalonnée d’oliveraies, de villages perchés et de hauts lieux de mémoire.',
      ar: 'شريان جغرافي وزراعي وتاريخي رئيسي في الولاية تحيط به بساتين الزيتون والقرى المعلقة ومعالم الذاكرة الوطنية.',
      kab: 'Taneqqiṭ tagejdant n tfellaḥt d umezruy n twilayt, s tzemrin-is, tudrin-is d tkatut-is.',
    },
    overview: {
      fr: 'Traversée par l’oued Soummam jusqu’à son embouchure près de Béjaïa, cette grande vallée sépare le massif du Djurdjura et de l’Akfadou au nord des monts des Bibans et des Babor au sud.',
      ar: 'يمتد وادي الصومام حتى مصبه قرب مدينة بجاية، ويفصل بين مرتفعات جرجرة وأكفادو شمالاً وجبال البيبان والبابور جنوباً.',
    },
    tourismDescription: {
      fr: 'Cœur oléicole et artisanal de la région, la vallée invite à découvrir les villages perchés sur ses deux versants, les marchés traditionnels, les huileries locales et le patrimoine historique d’Ifri Ouzellaguen.',
      ar: 'يشكل الوادي قلب إنتاج زيت الزيتون والحرف المحلية، ويدعو لاكتشاف القرى المعلقة على ضفتيه والأسواق التقليدية والمعلم التاريخي لإفري أوزلاقن.',
    },
    historyAndHeritage: {
      fr: 'La vallée abrite le village d’Ifri (commune d’Ouzellaguen), où se tint le Congrès de la Soummam le 20 août 1956, étape fondatrice de l’histoire contemporaine de l’Algérie.',
      ar: 'يحتضن الوادي قرية إفري (بلدية أوزلاقن) التي انعقد فيها مؤتمر الصومام التاريخي في 20 أوت 1956.',
    },
    characteristics: [
      { fr: 'Terroir d’huile d’olive et de figues de Kabylie', ar: 'موطن زيت الزيتون والتين القبائلي' },
      { fr: 'Mémoire du Congrès de la Soummam (Ifri Ouzellaguen)', ar: 'ذاكرة مؤتمر الصومام (إفري أوزلاقن)' },
      { fr: 'Villages perchés sur les deux versants', ar: 'قرى تقليدية معلقة على الضفتين' },
    ],
    visitTips: [
      { fr: 'Prévoir une journée complète pour parcourir les villages de hauteur et visiter le musée d’Ifri Ouzellaguen.', ar: 'تخصيص يوم كامل للتجول بين القرى الجبلية وزيارة متحف إفري أوزلاقن.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Desservie par la RN26, l’autoroute pénétrante de Béjaïa et la voie ferrée Béjaïa–Beni Mansour.', ar: 'يربطها الطريق الوطني رقم 26 ومنفذ الطريق السيار والخط السككي بجاية–بني منصور.' },
      seasonNote: { fr: 'Superbe au printemps et durant la saison de la récolte des olives en automne-hiver.', ar: 'جميلة جداً في الربيع وخلال موسم جني الزيتون في الخريف والشتاء.' },
    },
    mapsSearchQuery: 'Ifri Ouzellaguen, Vallée de la Soummam, Béjaïa, Algérie',
    osmSearchQuery: 'Vallée de la Soummam, Béjaïa',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration des villages et oliveraies de la vallée de la Soummam', 'رسم توضيحي لقرى وبساتين زيتون وادي الصومام'),
    gallery: [
      makeMedia('/images/kabyle-village.jpg', 'Versants de la Soummam', 'سفوح وادي الصومام'),
      makeMedia('/images/kabyle-craft.jpg', 'Huile d’olive, figues et artisanat de la région', 'زيت الزيتون والتين والحرف المحلية'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'villages-traditionnels-bejaia',
    slug: 'villages-traditionnels-bejaia',
    name: { fr: 'Villages traditionnels de Kabylie (Béjaïa)', ar: 'القرى التقليدية لولاية بجاية', kab: 'Tudrin tinsayanin n Leqbayel (Bgayet)' },
    commune: { fr: 'Beni Maouche / Seddouk / Chemini / Barbacha', ar: 'بني معوش / صدوق / شمينى / برباشة', kab: 'At Maɛuc / Sedduq / Cemini / Berbaca' },
    region: { fr: 'Arrière-pays montagneux de Béjaïa', ar: 'المرتفعات الداخلية لبجاية', kab: 'Idurar n twilayt n Bgayet' },
    category: 'culturel',
    secondaryCategories: ['aventure'],
    shortDescription: {
      fr: 'Ensemble de villages perchés aux toits de tuiles rouges, gardiens de la langue amazighe, de la poterie et de l’oléiculture.',
      ar: 'مجموعة من القرى المعلقة ذات أسقف القرميد الأحمر، الحافظة للغة الأمازيغية والفخار وزراعة الزيتون.',
      kab: 'Tudrin s ssqef n uqermud azeggaɣ, iḥerzen tutlayt tamaziɣt, afexxar d tzemrin.',
    },
    overview: {
      fr: 'Des crêtes des Ath Abbas aux collines de Chemini et de Beni Maouche (réputée pour ses figues), les villages traditionnels de Béjaïa offrent un patrimoine vivant d’architecture vernaculaire et de savoir-faire.',
      ar: 'من مرتفعات آث عباس إلى تلال شميني وبني معوش المعروفة بالتين، تشكل القرى التقليدية ببجاية تراثاً حياً للعمارة المحلية والحرف اليدوية.',
    },
    tourismDescription: {
      fr: 'Chaque village révèle ses fontaines anciennes, ses placettes (tajmaât), ses ateliers de poterie ou de tissage et des panoramas étendus sur les vallées.',
      ar: 'تتميز كل قرية بينابيعها القديمة وساحاتها التقليدية (تجمعت) وورشات الفخار والنسيج وإطلالاتها الممتدة على الوديان.',
    },
    characteristics: [
      { fr: 'Architecture vernaculaire en pierre et tuiles', ar: 'عمارة محلية بالحجر والقرميد' },
      { fr: 'Traditions communautaires et terroir agricole', ar: 'تقاليد اجتماعية ومنتجات فلاحية أصيلة' },
    ],
    visitTips: [
      { fr: 'Privilégier les visites accompagnées de guides locaux ou d’associations culturelles.', ar: 'يُفضل القيام بالزيارات رفقة مرشدين محليين أو جمعيات ثقافية.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Réseau de routes de wilaya desservant les communes de l’arrière-pays.', ar: 'شبكة طرق ولائية تربط بلديات المرتفعات الداخلية.' },
      seasonNote: { fr: 'Printemps et automne recommandés.', ar: 'الربيع والخريف هما الأنسب.' },
    },
    mapsSearchQuery: 'Beni Maouche, Béjaïa, Algérie',
    osmSearchQuery: 'Beni Maouche, Béjaïa',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration des villages traditionnels kabyles sur les crêtes de Béjaïa', 'رسم توضيحي للقرى القبائلية التقليدية على قمم بجاية'),
    gallery: [
      makeMedia('/images/kabyle-village.jpg', 'Villages de crête', 'قرى القمم الجبلية'),
      makeMedia('/images/kabyle-craft.jpg', 'Artisanat et gastronomie des villages', 'الحرف والمطبخ القروي'),
    ],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },

  // === TOURISME THERMAL ===
  {
    id: 'sources-thermales-tifra',
    slug: 'sources-thermales-tifra',
    name: { fr: 'Sources thermales de Tifra (Sidi Yahia El Aidli)', ar: 'الحمامات المعدنية لتيفرة (سيدي يحيى العيدلي)', kab: 'Lḥemmam n Tifra (Sidi Yeḥya Lɛidli)' },
    commune: { fr: 'Tifra / Sidi Aïch', ar: 'تيفرة / سيدي عيش', kab: 'Tifra / Sidi Ɛic' },
    region: { fr: 'Vallée de la Soummam · Versant nord', ar: 'وادي الصومام · السفح الشمالي', kab: 'Asif n Summam · Agafa' },
    category: 'thermal',
    featured: true,
    shortDescription: {
      fr: 'Station thermale réputée de la Wilaya de Béjaïa, nichée dans un vallon boisé propice au repos et au bien-être.',
      ar: 'محطة حموية معروفة في ولاية بجاية تقع وسط وادٍ مشجر مثالي للراحة والاستجمام.',
      kab: 'Amkan n lḥemmam yettwassnen deg twilayt n Bgayet, gar tẓegwa i usteɛfu d tezmert.',
    },
    overview: {
      fr: 'Situées dans la région de Tifra près de Sidi Aïch, les sources thermales de Sidi Yahia El Aidli comptent parmi les destinations de tourisme thermal les plus fréquentées de la Wilaya de Béjaïa.',
      ar: 'تقع الينابيع الحموية لسيدي يحيى العيدلي في منطقة تيفرة قرب سيدي عيش، وتُعد من أبرز وجهات السياحة الحموية في ولاية بجاية.',
    },
    tourismDescription: {
      fr: 'Les curistes et visiteurs y recherchent les bienfaits des eaux thermales dans un environnement rural paisible entouré de collines.',
      ar: 'يقصدها الزوار للاستفادة من المياه المعدنية الدافئة في بيئة ريفية هادئة محاطة بالتلال.',
    },
    characteristics: [
      { fr: 'Eaux thermales naturelles réputées', ar: 'مياه معدنية طبيعية معروفة' },
      { fr: 'Environnement montagnard et calme', ar: 'بيئة جبلية هادئة' },
    ],
    visitTips: [
      { fr: 'Se renseigner directement sur place ou auprès des services du tourisme sur les modalités d’accueil et d’hébergement disponibles.', ar: 'الاستعلام محلياً أو لدى مصالح السياحة حول شروط الاستقبال والإقامة المتوفرة.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible depuis Sidi Aïch dans la vallée de la Soummam.', ar: 'يمكن الوصول إليها انطلاقاً من سيدي عيش في وادي الصومام.' },
      seasonNote: { fr: 'Fréquentée tout au long de l’année, particulièrement hors été.', ar: 'مقصودة طوال السنة وخاصة خارج فصل الصيف.' },
      verificationNotice: {
        fr: 'Tarifs, horaires et services médicaux ou hôteliers non mentionnés sans vérification officielle directe.',
        ar: 'لم تُذكر الأسعار والمواعيد والخدمات دون تحقق رسمي مباشر.',
      },
    },
    mapsSearchQuery: 'Hammam Sidi Yahia El Aidli, Tifra, Béjaïa, Algérie',
    osmSearchQuery: 'Tifra, Béjaïa',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration des collines et vallons abritant les sources thermales de Tifra', 'رسم توضيحي لتلال ووديان منطقة تيفرة الحموية'),
    gallery: [makeMedia('/images/kabyle-village.jpg', 'Région thermale de Tifra', 'منطقة تيفرة الحموية')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
  {
    id: 'sources-thermales-adekar',
    slug: 'sources-thermales-adekar',
    name: { fr: 'Sources thermales d’Adekar', ar: 'الينابيع الحموية لأدكار', kab: 'Tiliwa n waman iḥmayanen n Adekar' },
    commune: { fr: 'Adekar', ar: 'أدكار', kab: 'Adekar' },
    region: { fr: 'Massif de l’Akfadou · Ouest de Béjaïa', ar: 'مرتفعات أكفادو · غرب بجاية', kab: 'Adrar n Akfadu · Amalu n Bgayet' },
    category: 'thermal',
    secondaryCategories: ['naturel'],
    shortDescription: {
      fr: 'Sources thermales nichées en lisière des forêts d’Adekar et de l’Akfadou, au cœur d’un paysage montagnard préservé.',
      ar: 'ينابيع حموية تقع على مشارف غابات أدكار وأكفادو وسط طبيعة جبلية نقية.',
      kab: 'Tiliwa n waman iḥmayanen ɣef yidis n tẓegwa n Adekar d Akfadu, deg ugama iḥerzen.',
    },
    overview: {
      fr: 'La commune forestière d’Adekar associe le charme des hauteurs de l’Akfadou à un potentiel thermal naturel reconnu dans l’inventaire touristique de la Wilaya.',
      ar: 'تجمع بلدية أدكار الغابية بين سحر مرتفعات أكفادو وإمكانات سياحية حموية طبيعية مدرجة ضمن جرد الولاية.',
    },
    tourismDescription: {
      fr: 'Une étape paisible pour associer promenade forestière et découverte des ressources thermales locales.',
      ar: 'محطة هادئة للجمع بين التنزه في الغابة واستكشاف الموارد الحموية المحلية.',
    },
    characteristics: [
      { fr: 'Proximité immédiate de la forêt d’Akfadou', ar: 'قرب مباشر من غابة أكفادو' },
      { fr: 'Air pur d’altitude et calme rural', ar: 'هواء جبلي نقي وهدوء ريفي' },
    ],
    visitTips: [
      { fr: 'Vérifier l’état d’ouverture et les aménagements thermaux actifs avant le déplacement.', ar: 'التحقق من حالة الفتح والتجهيزات الحموية المتوفرة قبل التنقل.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Via la route traversant Adekar en direction du col de l’Akfadou.', ar: 'عبر الطريق المار بأدكار نحو مرتفعات أكفادو.' },
      seasonNote: { fr: 'Agréable du printemps à l’automne.', ar: 'مناسبة من الربيع إلى الخريف.' },
      verificationNotice: {
        fr: 'Infrastructures d’accueil et horaires à vérifier auprès de la DTA Béjaïa.',
        ar: 'يرجى التحقق من مرافق الاستقبال والمواعيد لدى مديرية السياحة ببجاية.',
      },
    },
    mapsSearchQuery: 'Adekar, Béjaïa, Algérie',
    osmSearchQuery: 'Adekar, Béjaïa',
    coverImage: makeMedia('/images/gouraya-nature.jpg', 'Illustration des forêts montagneuses d’Adekar à Béjaïa', 'رسم توضيحي لغابات وجبال أدكار ببجاية'),
    gallery: [makeMedia('/images/gouraya-nature.jpg', 'Montagnes d’Adekar', 'جبال أدكار')],
    sources: [
      DTA_SOURCE,
      {
        label: 'Vérification terrain recommandée (services thermaux actifs)',
        verificationStatus: 'to_verify_field',
      },
    ],
  },
  {
    id: 'sources-thermales-bouhamza',
    slug: 'sources-thermales-bouhamza',
    name: { fr: 'Sources thermales de Bouhamza (Hammam Sillal)', ar: 'الينابيع الحموية لبوحمزة (حمام سلال)', kab: 'Tiliwa n waman iḥmayanen n Buḥemza (Ḥemmam Sillal)' },
    commune: { fr: 'Bouhamza', ar: 'بوحمزة', kab: 'Buḥemza' },
    region: { fr: 'Sud de la vallée de la Soummam', ar: 'جنوب وادي الصومام', kab: 'Anẓul n wasif n Summam' },
    category: 'thermal',
    shortDescription: {
      fr: 'Site thermal traditionnel connu dans la région de Seddouk et Bouhamza, fréquenté pour ses eaux chaudes naturelles.',
      ar: 'موقع حموي تقليدي معروف في منطقة صدوق وبوحمزة بمياهه الساخنة الطبيعية.',
      kab: 'Amkan n lḥemmam ansayan yettwassnen di temnaḍt n Sedduq d Buḥemza s waman-is iḥmayanen.',
    },
    overview: {
      fr: 'Sur le versant sud de la vallée de la Soummam, la commune de Bouhamza abrite des sources thermales naturelles (notamment Hammam Sillal) inscrites parmi les sites thermaux de la Wilaya de Béjaïa.',
      ar: 'على الضفة الجنوبية لوادي الصومام، تحتضن بلدية بوحمزة ينابيع حموية طبيعية (لا سيما حمام سلال) ضمن المواقع الحموية بولاية بجاية.',
    },
    tourismDescription: {
      fr: 'Entouré de collines et de villages traditionnels, le site offre une halte authentique dédiée au repos et à la découverte du sud-ouest béjaoui.',
      ar: 'تحيط به التلال والقرى التقليدية، مما يمنح الزائر محطة هادئة للراحة واستكشاف جنوب غرب الولاية.',
    },
    characteristics: [
      { fr: 'Patrimoine thermal de la rive sud de la Soummam', ar: 'تراث حموي بالضفة الجنوبية للصومام' },
      { fr: 'Cadre rural authentique', ar: 'بيئة ريفية أصيلة' },
    ],
    visitTips: [
      { fr: 'Confirmer localement les horaires et conditions d’accès aux bassins thermaux.', ar: 'التأكد محلياً من مواعيد وشروط الدخول إلى المرافق الحموية.' },
    ],
    practicalInfo: {
      accessNote: { fr: 'Accessible depuis Seddouk ou Akbou dans la vallée de la Soummam.', ar: 'يمكن الوصول إليها من صدوق أو أقبو في وادي الصومام.' },
      seasonNote: { fr: 'Fréquentée toute l’année, notamment en automne et au printemps.', ar: 'تُزار طوال السنة وخاصة في الخريف والربيع.' },
      verificationNotice: {
        fr: 'Tarifs et horaires exacts non affichés sans source vérifiée en temps réel.',
        ar: 'لم تُدرج الأسعار والمواعيد دون مصدر موثق آنياً.',
      },
    },
    mapsSearchQuery: 'Hammam Sillal, Bouhamza, Béjaïa, Algérie',
    osmSearchQuery: 'Bouhamza, Béjaïa',
    coverImage: makeMedia('/images/kabyle-village.jpg', 'Illustration des paysages montagneux de Bouhamza dans la Wilaya de Béjaïa', 'رسم توضيحي للمناظر الجبلية ببوحمزة في ولاية بجاية'),
    gallery: [makeMedia('/images/kabyle-village.jpg', 'Collines de Bouhamza', 'تلال بوحمزة')],
    sources: [DTA_SOURCE, GUIDE_SOURCE],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function getDestinationsByCategory(categorySlug: string): Destination[] {
  return DESTINATIONS.filter(
    (d) =>
      d.category === categorySlug ||
      (d.secondaryCategories && d.secondaryCategories.includes(categorySlug as Destination['category']))
  );
}

export function getFeaturedDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => d.featured);
}

export function getUniqueCommunes(): { fr: string; ar: string }[] {
  const seen = new Set<string>();
  const list: { fr: string; ar: string }[] = [];
  for (const dest of DESTINATIONS) {
    if (!seen.has(dest.commune.fr)) {
      seen.add(dest.commune.fr);
      list.push({ fr: dest.commune.fr, ar: dest.commune.ar });
    }
  }
  return list.sort((a, b) => a.fr.localeCompare(b.fr, 'fr'));
}

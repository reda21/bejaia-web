import type { CultureArticle } from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain certifiée)';

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: 'culture-kabyle',
    slug: 'culture-kabyle',
    theme: { fr: 'Identité et société', ar: 'الهوية والمجتمع' },
    title: { fr: 'Culture kabyle et esprit communautaire', ar: 'الثقافة القبائلية وروح التضامن' },
    excerpt: {
      fr: 'L’hospitalité, l’entraide villageoise (tiwizi) et la transmission orale façonnent la vie sociale dans toute la Wilaya de Béjaïa.',
      ar: 'تشكّل قيم الضيافة والتعاون الجماعي (تويزة) والتراث الشفهي ركائز الحياة الاجتماعية عبر ولاية بجاية.',
    },
    content: [
      {
        fr: 'Au cœur de la Petite Kabylie, la Wilaya de Béjaïa porte une culture profondément enracinée dans la solidarité communautaire. Des pratiques ancestrales telles que la tiwizi — entraide collective lors des récoltes d’olives ou des travaux du village — témoignent de la force du lien social.',
        ar: 'في قلب القبائل الصغرى، تحمل ولاية بجاية ثقافة متجذرة في التضامن الاجتماعي، حيث تجسد تقاليد مثل «تويزة» — العمل التطوعي الجماعي في مواسم جني الزيتون وخدمة القرية — عمق الترابط المحلي.',
      },
      {
        fr: 'Les saisons agricoles, les fêtes familiales et les rassemblements culturels rythment l’année, reliant les villages perchés de la Soummam au dynamisme urbain du littoral béjaoui.',
        ar: 'تتواصل المواسم الفلاحية والمناسبات الثقافية على مدار العام، لتصل بين القرى الجبلية في وادي الصومام والحيوية الحضرية لمدينة بجاية الساحلية.',
      },
    ],
    keyElements: [
      { fr: 'Tiwizi : tradition d’entraide collective', ar: 'تويزة: تقليد التعاون الجماعي' },
      { fr: 'Tajmaât : assemblée traditionnelle du village', ar: 'تجمعت: مجلس القرية التقليدي' },
      { fr: 'Hospitalité et transmission intergénérationnelle', ar: 'كرم الضيافة ونقل التراث عبر الأجيال' },
    ],
    coverImage: {
      src: '/images/kabyle-village.jpg',
      alt: { fr: 'Illustration d’un village kabyle et de ses oliveraies', ar: 'رسم توضيحي لقرية قبائلية وبساتين الزيتون' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria) & DTA Béjaïa',
  },
  {
    id: 'langue-amazighe',
    slug: 'langue-traditions-amazighes',
    theme: { fr: 'Langue et patrimoine vivant', ar: 'اللغة والتراث الحي' },
    title: { fr: 'Langue et traditions amazighes (Taqvaylit · ⵜⴰⵎⴰⵣⵉⵖⵜ)', ar: 'اللغة والتقاليد الأمازيغية' },
    excerpt: {
      fr: 'Langue officielle aux côtés de l’arabe, le tamazight — dans sa variante kabyle (taqvaylit) — irrigue la poésie, les contes et la toponymie de Béjaïa (Bgayet).',
      ar: 'تُعد الأمازيغية لغة وطنية ورسمية إلى جانب العربية، وتغني بتفرعها القبائلي الشعر الشعبي والحكايات وأسماء الأماكن في بجاية (بقايث).',
    },
    content: [
      {
        fr: 'Dans la Wilaya de Béjaïa, la langue kabyle (taqvaylit) est au cœur de l’expression quotidienne, littéraire et artistique. Les proverbes (inzan), contes traditionnels (timucuha) et poèmes chantés (isefra) perpétuent une sagesse millénaire.',
        ar: 'تحتل اللغة القبائلية مكانة مركزية في التعبير اليومي والأدبي والفني بولاية بجاية، حيث تحفظ الأمثال والحكايات والأشعار المغناة ذاكرة ثقافية ضاربة في القدم.',
      },
      {
        fr: 'Les célébrations saisonnières, notamment Yennayer (le Nouvel An amazigh) et les fêtes printanières, sont autant d’occasions de partager des plats traditionnels et des moments festifs.',
        ar: 'وتشكّل المناسبات الموسمية، وعلى رأسها الاحتفال برأس السنة الأمازيغية (يناير) ومواسم الربيع، فرصاً للاحتفاء بالأطباق التقليدية والتلاقي الاجتماعي.',
      },
    ],
    keyElements: [
      { fr: 'Bgayet (ⴱⴳⴰⵢⴻⵜ) : nom amazigh historique de Béjaïa', ar: 'بقايث (ⴱⴳⴰⵢⴻⵜ): التسمية الأمازيغية التاريخية لبجاية' },
      { fr: 'Yennayer : célébration du Nouvel An amazigh', ar: 'يناير: الاحتفال برأس السنة الأمازيغية' },
      { fr: 'Isefra et timucuha : poésie et contes oraux', ar: 'الشعر الشعبي والحكايات الشفهية' },
    ],
    coverImage: {
      src: '/images/kabyle-craft.jpg',
      alt: { fr: 'Illustration d’éléments symboliques du patrimoine amazigh de Béjaïa', ar: 'رسم توضيحي لعناصر من التراث الأمازيغي ببجاية' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)',
  },
  {
    id: 'artisanat-bijouterie-poterie',
    slug: 'artisanat-bijouterie-poterie-tissage',
    theme: { fr: 'Savoir-faire artisanaux', ar: 'الصناعات التقليدية' },
    title: { fr: 'Artisanat traditionnel : bijouterie kabyle, poterie et tissage', ar: 'الحرف التقليدية: الحلي القبائلية والفخار والنسيج' },
    excerpt: {
      fr: 'Des motifs géométriques millénaires perpétués dans l’argile modelée à la main, l’argent émaillé serti de corail et la laine tissée.',
      ar: 'زخارف هندسية عريقة تتوارثها الأيدي في الفخار المصنوع يدوياً والفضة المطعمة بالمرجان والصوف المنسوج.',
    },
    content: [
      {
        fr: 'L’artisanat de la Wilaya de Béjaïa reflète la maîtrise technique et symbolique des artisans et artisanes kabyles. La poterie traditionnelle, façonnée sans tour puis cuite à feu ouvert et décorée de pigments naturels, demeure un art vivant dans plusieurs villages.',
        ar: 'تعكس الصناعات التقليدية بولاية بجاية مهارة الحرفيين والحرفيات، حيث يُصنع الفخار التقليدي يدوياً ويُزخرف بأصباغ طبيعية ورموز هندسية عريقة.',
      },
      {
        fr: 'La bijouterie kabyle en argent ciselé, souvent rehaussée d’émaux colorés et de corail méditerranéen, ainsi que le tissage de tapis, de burnous et de robes kabyles brodées, sont mis à l’honneur à la Maison de l’Artisanat de Béjaïa et lors des salons régionaux.',
        ar: 'كما تبرز الحلي القبائلية المصنوعة من الفضة والمطعمّة بالمينا والمرجان المتوسطي، إلى جانب نسج الزرابي والبرنوس والأزياء التقليدية المطرزة.',
      },
    ],
    keyElements: [
      { fr: 'Poterie modelée et peinte aux motifs géométriques amazighs', ar: 'فخار يدوي مزخرف برموز هندسية أمازيغية' },
      { fr: 'Bijouterie traditionnelle en argent, émaux et corail', ar: 'حلي تقليدية من الفضة والمينا والمرجان' },
      { fr: 'Tissage traditionnel, broderie et vannerie', ar: 'النسيج التقليدي والتطريز والسلالة' },
    ],
    coverImage: {
      src: '/images/kabyle-craft.jpg',
      alt: { fr: 'Illustration de poterie kabyle, bijouterie en argent et corail, et tissage traditionnel', ar: 'رسم توضيحي للفخار القبائلي والحلي الفضية والمرجان والنسيج التقليدي' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Chambre de l’Artisanat et des Métiers / DTA Béjaïa',
  },
  {
    id: 'gastronomie-locale',
    slug: 'gastronomie-locale',
    theme: { fr: 'Arts de la table et terroir', ar: 'فنون الطبخ والمنتجات المحلية' },
    title: { fr: 'Gastronomie locale et terroir béjaoui', ar: 'المطبخ المحلي ومنتجات بجاية' },
    excerpt: {
      fr: 'Huile d’olive vierge de Kabylie, figues sèches de Beni Maouche, couscous roulé à la main, aghroum, tikourbabine et poissons de la côte.',
      ar: 'زيت الزيتون القبائلي والتين المجفف لبني معوش والكسكس المفتول يدوياً وأغروم وتيكوربابين وأسماك الساحل.',
    },
    content: [
      {
        fr: 'La cuisine de Béjaïa unit la générosité des montagnes kabyles aux produits frais de la Méditerranée. L’huile d’olive de la vallée de la Soummam et des collines environnantes constitue la signature gustative incontournable de la table locale.',
        ar: 'يجمع مطبخ بجاية بين خيرات الجبال القبائلية ومنتجات البحر المتوسط الطازجة، ويشكل زيت الزيتون المنتج في وادي الصومام والمرتفعات المحيطة العنصر الأساسي في المائدة المحلية.',
      },
      {
        fr: 'Parmi les spécialités emblématiques figurent le couscous kabyle (seksu) aux légumes de saison ou aux fèves, les galettes traditionnelles (aghroum aquran, aghroum leḥwal), les boulettes de semoule en sauce (tikourbabine), les figues de Beni Maouche ainsi que les poissons grillés des ports de la Wilaya.',
        ar: 'ومن أشهر الأطباق المحلية الكسكس القبائلي، والخبز التقليدي (أغروم)، وتيكوربابين، وتين بني معوش، إضافة إلى الأسماك الطازجة من موانئ الولاية.',
      },
    ],
    keyElements: [
      { fr: 'Huile d’olive de Kabylie et figues de Beni Maouche', ar: 'زيت الزيتون القبائلي وتين بني معوش' },
      { fr: 'Couscous (seksu), aghroum et tikourbabine', ar: 'الكسكس (سكسو) وأغروم وتيكوربابين' },
      { fr: 'Poissons et cuisine maritime du littoral', ar: 'الأسماك والمطبخ البحري الساحلي' },
    ],
    coverImage: {
      src: '/images/kabyle-craft.jpg',
      alt: { fr: 'Illustration d’huile d’olive, figues fraîches, galette et poterie kabyle', ar: 'رسم توضيحي لزيت الزيتون والتين والخبز التقليدي والفخار القبائلي' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria)',
  },
  {
    id: 'musique-patrimoine-immateriel',
    slug: 'musique-patrimoine-immateriel',
    theme: { fr: 'Musique et arts vivants', ar: 'الموسيقى والتراث اللامادي' },
    title: { fr: 'Musique, poésie chantée et patrimoine immatériel', ar: 'الموسيقى والشعر المغنى والتراث اللامادي' },
    excerpt: {
      fr: 'De la musique andalouse et du chaâbi aux chants kabyles et aux grandes voix originaires de la Wilaya de Béjaïa.',
      ar: 'من الموسيقى الأندلسية والشعبي إلى الأغنية القبائلية والأصوات الفنية العريقة المنحدرة من ولاية بجاية.',
    },
    content: [
      {
        fr: 'Terre de poètes et de musiciens, Béjaïa cultive un double héritage musical : la tradition citadine méditerranéenne (andalou, hawzi et chaâbi) et la richesse polyphonique de la chanson kabyle, accompagnée du mandole, du bendir et de la flûte (tajewwaqt).',
        ar: 'تتمتع بجاية بإرث موسيقي مزدوج يجمع بين التقاليد الحضرية المتوسطية (الأندلسي والحوزي والشعبي) وثراء الأغنية القبائلية المصحوبة بآلة الموندول والبندير والقصبة.',
      },
      {
        fr: 'Les festivals culturels, les associations musicales et les spectacles vivants contribuent à transmettre ce patrimoine immatériel aux jeunes générations.',
        ar: 'تساهم المهرجانات الثقافية والجمعيات الموسيقية في صون هذا التراث اللامادي ونقله إلى الأجيال الصاعدة.',
      },
    ],
    keyElements: [
      { fr: 'Chanson kabyle, achewiq et poésie chantée', ar: 'الأغنية القبائلية وأشويق والشعر المغنى' },
      { fr: 'Patrimoine musical citadin : andalou et chaâbi', ar: 'التراث الموسيقي الحضري: الأندلسي والشعبي' },
      { fr: 'Instruments emblématiques : mandole, bendir, tajewwaqt', ar: 'الآلات التقليدية: الموندول، البندير والقصبة' },
    ],
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: { fr: 'Illustration évoquant la vie culturelle de la cité historique de Béjaïa', ar: 'رسم توضيحي يعبر عن الحياة الثقافية في مدينة بجاية العريقة' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)',
  },
  {
    id: 'histoire-bejaia',
    slug: 'histoire-de-bejaia',
    theme: { fr: 'Mémoire méditerranéenne', ar: 'الذاكرة المتوسطية' },
    title: { fr: 'Histoire de Béjaïa : de Saldae à la capitale savante En-Naciria', ar: 'تاريخ بجاية: من صالدا إلى العاصمة العلمية الناصرية' },
    excerpt: {
      fr: 'Port antique, capitale hammadite rayonnante au XIe–XIIe siècle, foyer mathématique où étudia Fibonacci et cité historique majeure d’Algérie.',
      ar: 'ميناء عتيق وعاصمة حمادية مزدهرة في القرنين 11 و12م ومركز علمي درس فيه فيبوناتشي وحاضرة تاريخية بارزة في الجزائر.',
    },
    content: [
      {
        fr: 'Habitée depuis la Préhistoire puis fondée comme colonie romaine sous le nom de Saldae, Béjaïa connaît un âge d’or exceptionnel au XIe siècle lorsque le prince hammadite En-Nacer en fait sa capitale (En-Naciria). Dotée de palais, de mosquées, d’un port actif et de remparts, la cité devient l’un des grands centres intellectuels de la Méditerranée.',
        ar: 'عرفت بجاية الاستيطان منذ عصور ما قبل التاريخ ثم أُقيمت بها صالدا الرومانية، لتبلغ أوج ازدهارها في القرن الحادي عشر الميلادي حين اتخذها الأمير الحمادي الناصر عاصمة باسم الناصرية، فأصبحت مركزاً علمياً وتجارياً مشعاً في حوض المتوسط.',
      },
      {
        fr: 'C’est à Béjaïa que le mathématicien pisan Leonardo Fibonacci s’initia, vers la fin du XIIe siècle, au système de numération indo-arabe avant de le diffuser en Europe dans son Liber Abaci. La ville accueillit également de grands savants et penseurs tels qu’Ibn Khaldoun, qui y séjourna et enseigna au XIVe siècle. Le nom français de la « bougie » provient d’ailleurs de la cire réputée exportée depuis le port de Béjaïa (Bougie).',
        ar: 'في بجاية تعلّم عالم الرياضيات الإيطالي ليوناردو فيبوناتشي أواخر القرن الثاني عشر نظام الأرقام الهندية-العربية قبل نقله إلى أوروبا، كما احتضنت المدينة علماء كباراً من بينهم ابن خلدون الذي أقام ودرّس بها في القرن الرابع عشر. واشتق اسم الشمعة في الفرنسية (Bougie) من جودة الشمع الذي كان يُصدَّر من مينائها.',
      },
    ],
    keyElements: [
      { fr: 'Saldae : cité portuaire antique et aqueduc de Toudja', ar: 'صالدا: المدينة المينائية القديمة وقناة توجة' },
      { fr: 'En-Naciria : capitale hammadite au XIe–XIIe siècle', ar: 'الناصرية: العاصمة الحمادية في القرنين 11 و12م' },
      { fr: 'Rayonnement savant : Fibonacci et Ibn Khaldoun', ar: 'الإشعاع العلمي: فيبوناتشي وابن خلدون' },
    ],
    coverImage: {
      src: '/images/casbah-heritage.jpg',
      alt: { fr: 'Illustration historique des remparts et du port de Béjaïa', ar: 'رسم تاريخي توضيحي لأسوار وميناء بجاية' },
      source: 'Béjaïa Explorer — Illustration IA',
      attribution: AI_ATTR,
      isAiIllustration: true,
    },
    source: 'Guide touristique officiel de Béjaïa (VisitAlgeria) & archives historiques documentées',
  },
];

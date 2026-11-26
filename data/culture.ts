import type { CultureArticle } from '@/types';

const AI_ATTR =
  'Illustration éditoriale générée par IA — Béjaïa Explorer (à remplacer par photographie terrain certifiée)';

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: 'culture-kabyle',
    slug: 'culture-kabyle',
    theme: { fr: 'Identité et société', ar: 'الهوية والمجتمع', kab: 'Tamagit d tmetti' },
    title: { fr: 'Culture kabyle et esprit communautaire', ar: 'الثقافة القبائلية وروح التضامن', kab: 'Idles aqbayli d rruḥ n twizi' },
    excerpt: {
      fr: 'L’hospitalité, l’entraide villageoise (tiwizi) et la transmission orale façonnent la vie sociale dans toute la Wilaya de Béjaïa.',
      ar: 'تشكّل قيم الضيافة والتعاون الجماعي (تويزة) والتراث الشفهي ركائز الحياة الاجتماعية عبر ولاية بجاية.',
      kab: 'Inigi, tiwizi n taddart d tkatut s wawal ttekkan deg tudert n tmetti di twilayt n Bgayet.',
    },
    content: [
      {
        fr: 'Au cœur de la Petite Kabylie, la Wilaya de Béjaïa porte une culture profondément enracinée dans la solidarité communautaire. Des pratiques ancestrales telles que la tiwizi — entraide collective lors des récoltes d’olives ou des travaux du village — témoignent de la force du lien social.',
        ar: 'في قلب القبائل الصغرى، تحمل ولاية بجاية ثقافة متجذرة في التضامن الاجتماعي، حيث تجسد تقاليد مثل «تويزة» — العمل التطوعي الجماعي في مواسم جني الزيتون وخدمة القرية — عمق الترابط المحلي.',
        kab: 'Di tlemmast n Leqbayel, tawilayt n Bgayet teḥrez idles yebnan ɣef tdukli n tmetti. Tidyanin tiqburin am twizi — lemɛawna n taddart di lḥemla n uzemmur neɣ leqdic n taddart — sskanayent-d lǧehd n wassaɣen n tmetti.',
      },
      {
        fr: 'Les saisons agricoles, les fêtes familiales et les rassemblements culturels rythment l’année, reliant les villages perchés de la Soummam au dynamisme urbain du littoral béjaoui.',
        ar: 'تتواصل المواسم الفلاحية والمناسبات الثقافية على مدار العام، لتصل بين القرى الجبلية في وادي الصومام والحيوية الحضرية لمدينة بجاية الساحلية.',
        kab: 'Tisemhuyin n tfellaḥt, timeɣriwin n twacult d yimennɣan idelsanen ttaqqnen tudrin n Summam ɣer temdint n Bgayet.',
      },
    ],
    keyElements: [
      { fr: 'Tiwizi : tradition d’entraide collective', ar: 'تويزة: تقليد التعاون الجماعي', kab: 'Tiwizi: ansay n lemɛawna n taddart' },
      { fr: 'Tajmaât : assemblée traditionnelle du village', ar: 'تجمعت: مجلس القرية التقليدي', kab: 'Tajmaɛt: agraw ansayan n taddart' },
      { fr: 'Hospitalité et transmission intergénérationnelle', ar: 'كرم الضيافة ونقل التراث عبر الأجيال', kab: 'Inigi d tuzzna n tgemmi gar tsuta' },
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
    theme: { fr: 'Langue et patrimoine vivant', ar: 'اللغة والتراث الحي', kab: 'Tutlayt d tgemmi yedren' },
    title: { fr: 'Langue et traditions amazighes (Taqvaylit · ⵜⴰⵎⴰⵣⵉⵖⵜ)', ar: 'اللغة والتقاليد الأمازيغية', kab: 'Tutlayt d yinsayen imaziɣen (Taqvaylit · ⵜⴰⵎⴰⵣⵉⵖⵜ)' },
    excerpt: {
      fr: 'Langue officielle aux côtés de l’arabe, le tamazight — dans sa variante kabyle (taqvaylit) — irrigue la poésie, les contes et la toponymie de Béjaïa (Bgayet).',
      ar: 'تُعد الأمازيغية لغة وطنية ورسمية إلى جانب العربية، وتغني بتفرعها القبائلي الشعر الشعبي والحكايات وأسماء الأماكن في بجاية (بقايث).',
      kab: 'Tamaziɣt d tutlayt tunṣibt ɣer yidis n taɛrabt; s teqvaylit-is tesseččay tamedyazt, timucuha d yismawen n yimukan di Bgayet.',
    },
    content: [
      {
        fr: 'Dans la Wilaya de Béjaïa, la langue kabyle (taqvaylit) est au cœur de l’expression quotidienne, littéraire et artistique. Les proverbes (inzan), contes traditionnels (timucuha) et poèmes chantés (isefra) perpétuent une sagesse millénaire.',
        ar: 'تحتل اللغة القبائلية مكانة مركزية في التعبير اليومي والأدبي والفني بولاية بجاية، حيث تحفظ الأمثال والحكايات والأشعار المغناة ذاكرة ثقافية ضاربة في القدم.',
        kab: 'Di twilayt n Bgayet, taqvaylit tella di tlemmast n tudert n yal ass, tasekla d tẓuri. Inzan, timucuha d yisefra ḥerzen-d tamussni n wagimen n yiseggasen.',
      },
      {
        fr: 'Les célébrations saisonnières, notamment Yennayer (le Nouvel An amazigh) et les fêtes printanières, sont autant d’occasions de partager des plats traditionnels et des moments festifs.',
        ar: 'وتشكّل المناسبات الموسمية، وعلى رأسها الاحتفال برأس السنة الأمازيغية (يناير) ومواسم الربيع، فرصاً للاحتفاء بالأطباق التقليدية والتلاقي الاجتماعي.',
        kab: 'Timeɣriwin n tsemhuyin, ladɣa Yennayer (ixef n useggas amaziɣ) d tmeɣriwin n tefsut, d tagnit n beṭṭu n wučči ansayan d tumert.',
      },
    ],
    keyElements: [
      { fr: 'Bgayet (ⴱⴳⴰⵢⴻⵜ) : nom amazigh historique de Béjaïa', ar: 'بقايث (ⴱⴳⴰⵢⴻⵜ): التسمية الأمازيغية التاريخية لبجاية', kab: 'Bgayet (ⴱⴳⴰⵢⴻⵜ): isem amaziɣ amezruyan' },
      { fr: 'Yennayer : célébration du Nouvel An amazigh', ar: 'يناير: الاحتفال برأس السنة الأمازيغية', kab: 'Yennayer: asmekti n yixef n useggas amaziɣ' },
      { fr: 'Isefra et timucuha : poésie et contes oraux', ar: 'الشعر الشعبي والحكايات الشفهية', kab: 'Isefra d tmucuha: tamedyazt d tmacahut' },
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
    theme: { fr: 'Savoir-faire artisanaux', ar: 'الصناعات التقليدية', kab: 'Taẓuri n ufus' },
    title: { fr: 'Artisanat traditionnel : bijouterie kabyle, poterie et tissage', ar: 'الحرف التقليدية: الحلي القبائلية والفخار والنسيج', kab: 'Taẓuri n ufus: iẓɣen n Leqbayel, afexxar d uẓeṭṭa' },
    excerpt: {
      fr: 'Des motifs géométriques millénaires perpétués dans l’argile modelée à la main, l’argent émaillé serti de corail et la laine tissée.',
      ar: 'زخارف هندسية عريقة تتوارثها الأيدي في الفخار المصنوع يدوياً والفضة المطعمة بالمرجان والصوف المنسوج.',
      kab: 'Isekkilen n zik i d-yettwaḥerzen deg ufexxar n ufus, lfeṭṭa s lmerǧan d uẓeṭṭa n taḍuṭ.',
    },
    content: [
      {
        fr: 'L’artisanat de la Wilaya de Béjaïa reflète la maîtrise technique et symbolique des artisans et artisanes kabyles. La poterie traditionnelle, façonnée sans tour puis cuite à feu ouvert et décorée de pigments naturels, demeure un art vivant dans plusieurs villages.',
        ar: 'تعكس الصناعات التقليدية بولاية بجاية مهارة الحرفيين والحرفيات، حيث يُصنع الفخار التقليدي يدوياً ويُزخرف بأصباغ طبيعية ورموز هندسية عريقة.',
        kab: 'Taẓuri n ufus di Bgayet tesskanay-d tiḥerci n yimsenza d tsednan n Leqbayel. Afexxar ansayan yettwaxdem s ufus u yettwačča s yisekkilen igamanen di waṭas n tudrin.',
      },
      {
        fr: 'La bijouterie kabyle en argent ciselé, souvent rehaussée d’émaux colorés et de corail méditerranéen, ainsi que le tissage de tapis, de burnous et de robes kabyles brodées, sont mis à l’honneur à la Maison de l’Artisanat de Béjaïa et lors des salons régionaux.',
        ar: 'كما تبرز الحلي القبائلية المصنوعة من الفضة والمطعمّة بالمينا والمرجان المتوسطي، إلى جانب نسج الزرابي والبرنوس والأزياء التقليدية المطرزة.',
        kab: 'Iẓɣen n lfeṭṭa s lmerǧan agrakal, aẓeṭṭa n tzerbiyin, abernus d tqendurt taqvaylit ttwaskenen deg Uxxam n tẓuri n Bgayet.',
      },
    ],
    keyElements: [
      { fr: 'Poterie modelée et peinte aux motifs géométriques amazighs', ar: 'فخار يدوي مزخرف برموز هندسية أمازيغية', kab: 'Afexxar n ufus s yisekkilen imaziɣen' },
      { fr: 'Bijouterie traditionnelle en argent, émaux et corail', ar: 'حلي تقليدية من الفضة والمينا والمرجان', kab: 'Iẓɣen insayanen n lfeṭṭa d lmerǧan' },
      { fr: 'Tissage traditionnel, broderie et vannerie', ar: 'النسيج التقليدي والتطريز والسلالة', kab: 'Aẓeṭṭa ansayan d tqendurt' },
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
    theme: { fr: 'Arts de la table et terroir', ar: 'فنون الطبخ والمنتجات المحلية', kab: 'Učči ansayan d lɣella' },
    title: { fr: 'Gastronomie locale et terroir béjaoui', ar: 'المطبخ المحلي ومنتجات بجاية', kab: 'Učči ansayan d lɣella n Bgayet' },
    excerpt: {
      fr: 'Huile d’olive vierge de Kabylie, figues sèches de Beni Maouche, couscous roulé à la main, aghroum, tikourbabine et poissons de la côte.',
      ar: 'زيت الزيتون القبائلي والتين المجفف لبني معوش والكسكس المفتول يدوياً وأغروم وتيكوربابين وأسماك الساحل.',
      kab: 'Zit uzemmur n Leqbayel, iniɣman n At Maɛuc, seksu n ufus, aɣrum, tikurbabin d yiselman n uftis.',
    },
    content: [
      {
        fr: 'La cuisine de Béjaïa unit la générosité des montagnes kabyles aux produits frais de la Méditerranée. L’huile d’olive de la vallée de la Soummam et des collines environnantes constitue la signature gustative incontournable de la table locale.',
        ar: 'يجمع مطبخ بجاية بين خيرات الجبال القبائلية ومنتجات البحر المتوسط الطازجة، ويشكل زيت الزيتون المنتج في وادي الصومام والمرتفعات المحيطة العنصر الأساسي في المائدة المحلية.',
        kab: 'Učči n Bgayet yesdukkel lɣella n yidurar n Leqbayel d yifarisen n Yilel Agrakal. Zit uzemmur n wasif n Summam d tzemrin d azamul agejdan n tnarit tadigant.',
      },
      {
        fr: 'Parmi les spécialités emblématiques figurent le couscous kabyle (seksu) aux légumes de saison ou aux fèves, les galettes traditionnelles (aghroum aquran, aghroum leḥwal), les boulettes de semoule en sauce (tikourbabine), les figues de Beni Maouche ainsi que les poissons grillés des ports de la Wilaya.',
        ar: 'ومن أشهر الأطباق المحلية الكسكس القبائلي، والخبز التقليدي (أغروم)، وتيكوربابين، وتين بني معوش، إضافة إلى الأسماك الطازجة من موانئ الولاية.',
        kab: 'Gar wučči yettwassnen: seksu s yizegza neɣ s yibawen, aɣrum aquran d uɣrum leḥwal, tikurbabin, iniɣman n At Maɛuc d yiselman n yisugan n twilayt.',
      },
    ],
    keyElements: [
      { fr: 'Huile d’olive de Kabylie et figues de Beni Maouche', ar: 'زيت الزيتون القبائلي وتين بني معوش', kab: 'Zit uzemmur n Leqbayel d yiniɣman n At Maɛuc' },
      { fr: 'Couscous (seksu), aghroum et tikourbabine', ar: 'الكسكس (سكسو) وأغروم وتيكوربابين', kab: 'Seksu, aɣrum d tkurbabin' },
      { fr: 'Poissons et cuisine maritime du littoral', ar: 'الأسماك والمطبخ البحري الساحلي', kab: 'Iselman d wučči n uftis' },
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
    theme: { fr: 'Musique et arts vivants', ar: 'الموسيقى والتراث اللامادي', kab: 'Aẓawan d tgemmi' },
    title: { fr: 'Musique, poésie chantée et patrimoine immatériel', ar: 'الموسيقى والشعر المغنى والتراث اللامادي', kab: 'Aẓawan, tamedyazt d tgemmi tarangant' },
    excerpt: {
      fr: 'De la musique andalouse et du chaâbi aux chants kabyles et aux grandes voix originaires de la Wilaya de Béjaïa.',
      ar: 'من الموسيقى الأندلسية والشعبي إلى الأغنية القبائلية والأصوات الفنية العريقة المنحدرة من ولاية بجاية.',
      kab: 'Seg uẓawan andalusi d ccaɛbi alamma d tizlit taqvaylit d tuɣac timeqqranin n twilayt n Bgayet.',
    },
    content: [
      {
        fr: 'Terre de poètes et de musiciens, Béjaïa cultive un double héritage musical : la tradition citadine méditerranéenne (andalou, hawzi et chaâbi) et la richesse polyphonique de la chanson kabyle, accompagnée du mandole, du bendir et de la flûte (tajewwaqt).',
        ar: 'تتمتع بجاية بإرث موسيقي مزدوج يجمع بين التقاليد الحضرية المتوسطية (الأندلسي والحوزي والشعبي) وثراء الأغنية القبائلية المصحوبة بآلة الموندول والبندير والقصبة.',
        kab: 'Tamurt n yimedyazen d yinaẓuren, Bgayet tesɛa sin n yigensasen n uẓawan: andalusi, lḥawzi d ccaɛbi akked tizlit taqvaylit s umundul, abendir d tjewwaqt.',
      },
      {
        fr: 'Les festivals culturels, les associations musicales et les spectacles vivants contribuent à transmettre ce patrimoine immatériel aux jeunes générations.',
        ar: 'تساهم المهرجانات الثقافية والجمعيات الموسيقية في صون هذا التراث اللامادي ونقله إلى الأجيال الصاعدة.',
        kab: 'Tifaskiwin tidelsanin d tiddukliwin n uẓawan ttekkant deg uḥraz d tuzzna n tgemmi-a i tsuta i d-itteddun.',
      },
    ],
    keyElements: [
      { fr: 'Chanson kabyle, achewiq et poésie chantée', ar: 'الأغنية القبائلية وأشويق والشعر المغنى', kab: 'Tizlit taqvaylit, acewiq d tmedyazt' },
      { fr: 'Patrimoine musical citadin : andalou et chaâbi', ar: 'التراث الموسيقي الحضري: الأندلسي والشعبي', kab: 'Aẓawan n temdint: andalusi d ccaɛbi' },
      { fr: 'Instruments emblématiques : mandole, bendir, tajewwaqt', ar: 'الآلات التقليدية: الموندول، البندير والقصبة', kab: 'Allalen insayanen: amundul, abendir, tajewwaqt' },
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
    theme: { fr: 'Mémoire méditerranéenne', ar: 'الذاكرة المتوسطية', kab: 'Takatut tagrakalt' },
    title: { fr: 'Histoire de Béjaïa : de Saldae à la capitale savante En-Naciria', ar: 'تاريخ بجاية: من صالدا إلى العاصمة العلمية الناصرية', kab: 'Amezruy n Bgayet: seg Saldae ɣer tmanaɣt En-Naciria' },
    excerpt: {
      fr: 'Port antique, capitale hammadite rayonnante au XIe–XIIe siècle, foyer mathématique où étudia Fibonacci et cité historique majeure d’Algérie.',
      ar: 'ميناء عتيق وعاصمة حمادية مزدهرة في القرنين 11 و12م ومركز علمي درس فيه فيبوناتشي وحاضرة تاريخية بارزة في الجزائر.',
      kab: 'Asagen aqbur, tamanaɣt taḥemmadiyt di lqern XI–XII, axxam n tusnakt anda yeɣra Fibonacci d temdint tamezruyant di Lezzayer.',
    },
    content: [
      {
        fr: 'Habitée depuis la Préhistoire puis fondée comme colonie romaine sous le nom de Saldae, Béjaïa connaît un âge d’or exceptionnel au XIe siècle lorsque le prince hammadite En-Nacer en fait sa capitale (En-Naciria). Dotée de palais, de mosquées, d’un port actif et de remparts, la cité devient l’un des grands centres intellectuels de la Méditerranée.',
        ar: 'عرفت بجاية الاستيطان منذ عصور ما قبل التاريخ ثم أُقيمت بها صالدا الرومانية، لتبلغ أوج ازدهارها في القرن الحادي عشر الميلادي حين اتخذها الأمير الحمادي الناصر عاصمة باسم الناصرية، فأصبحت مركزاً علمياً وتجارياً مشعاً في حوض المتوسط.',
        kab: 'Tettwaɛmer seg zik u tuɣal d Saldae tarumanit, Bgayet tewweḍ ɣer tqacuct n tneflit di lqern XI mi tt-yerra ugeldun En-Nacer d tamanaɣt (En-Naciria), s yiɣerman, lemǧameɛ, asagen d yiɣerban.',
      },
      {
        fr: 'C’est à Béjaïa que le mathématicien pisan Leonardo Fibonacci s’initia, vers la fin du XIIe siècle, au système de numération indo-arabe avant de le diffuser en Europe dans son Liber Abaci. La ville accueillit également de grands savants et penseurs tels qu’Ibn Khaldoun, qui y séjourna et enseigna au XIVe siècle. Le nom français de la « bougie » provient d’ailleurs de la cire réputée exportée depuis le port de Béjaïa (Bougie).',
        ar: 'في بجاية تعلّم عالم الرياضيات الإيطالي ليوناردو فيبوناتشي أواخر القرن الثاني عشر نظام الأرقام الهندية-العربية قبل نقله إلى أوروبا، كما احتضنت المدينة علماء كباراً من بينهم ابن خلدون الذي أقام ودرّس بها في القرن الرابع عشر. واشتق اسم الشمعة في الفرنسية (Bougie) من جودة الشمع الذي كان يُصدَّر من مينائها.',
        kab: 'Di Bgayet i yelmed umussnaw n tusnakt Fibonacci anagraw n yimḍanen uqbel ad t-yawi ɣer Turuft. Tamdint temmuger daɣen imussnawen imeqqranen am Ibn Xeldun. Awal « bougie » s tefransist yekka-d seg tcemaɛt n Bgayet.',
      },
    ],
    keyElements: [
      { fr: 'Saldae : cité portuaire antique et aqueduc de Toudja', ar: 'صالدا: المدينة المينائية القديمة وقناة توجة', kab: 'Saldae: tamdint n usagen aqbur d usaka n Tuǧa' },
      { fr: 'En-Naciria : capitale hammadite au XIe–XIIe siècle', ar: 'الناصرية: العاصمة الحمادية في القرنين 11 و12م', kab: 'En-Naciria: tamanaɣt taḥemmadiyt (XI–XII)' },
      { fr: 'Rayonnement savant : Fibonacci et Ibn Khaldoun', ar: 'الإشعاع العلمي: فيبوناتشي وابن خلدون', kab: 'Tafawt n tmussni: Fibonacci d Ibn Xeldun' },
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

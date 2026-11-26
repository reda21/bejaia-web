import type { Destination, PhotoPointOfInterest } from '@/types';

const IMAGE_POIS: Record<string, PhotoPointOfInterest[]> = {
  '/images/hero-cap-carbon.jpg': [
    {
      id: 'cap-lighthouse',
      x: 52,
      y: 34,
      category: 'landmark',
      label: {
        fr: 'Phare du promontoire',
        ar: 'منارة الجرف البحري',
      },
      description: {
        fr: 'Repère maritime emblématique perché sur la crête calcaire, guidant les navires à l’entrée du golfe de Béjaïa.',
        ar: 'معلم ملاحي بارز يعتلي القمة الكلسية ويرشد السفن عند مدخل خليج بجاية.',
      },
    },
    {
      id: 'cap-cliffs',
      x: 34,
      y: 62,
      category: 'nature',
      label: {
        fr: 'Falaises calcaires & arche marine',
        ar: 'المنحدرات الكلسية والقوس البحري',
      },
      description: {
        fr: 'Parois verticales sculptées par l’érosion méditerranéenne, offrant des contrastes spectaculaires avec les eaux turquoise.',
        ar: 'جروف صخرية شاهقة نحتتها عوامل التعرية المتوسطية وتقابل مياه البحر الفيروزية.',
      },
    },
    {
      id: 'cap-horizon',
      x: 78,
      y: 48,
      category: 'viewpoint',
      label: {
        fr: 'Panorama ouvert sur la Méditerranée',
        ar: 'إطلالة مفتوحة على المتوسط',
      },
      description: {
        fr: 'Point d’observation privilégié au lever et au coucher du soleil, avec une vue dégagée sur le large et la côte kabyle.',
        ar: 'نقطة مشاهدة مثالية عند الشروق والغروب بإطلالة واسعة على عرض البحر والساحل القبائلي.',
      },
    },
  ],
  '/images/gouraya-nature.jpg': [
    {
      id: 'gouraya-ridge',
      x: 46,
      y: 28,
      category: 'viewpoint',
      label: {
        fr: 'Crêtes et belvédères du massif',
        ar: 'القمم والمطلات الجبلية',
      },
      description: {
        fr: 'Reliefs dominant la baie, ponctués de belvédères naturels accessibles par la route panoramique et les sentiers de crête.',
        ar: 'مرتفعات تشرف على الخليج وتضم مطلات طبيعية يمكن بلوغها عبر الطريق البانورامي ومسارات المشي.',
      },
    },
    {
      id: 'gouraya-maquis',
      x: 26,
      y: 64,
      category: 'nature',
      label: {
        fr: 'Forêt littorale et maquis',
        ar: 'الغابة الساحلية والأحراش المتوسطية',
      },
      description: {
        fr: 'Habitat préservé de pins d’Alep, de chênes verts et du macaque de Barbarie au cœur de la réserve de biosphère.',
        ar: 'موطن طبيعي محمي للصنوبر الحلبي والبلوط الأخضر وقرد المكاك البربري في قلب المحمية.',
      },
    },
    {
      id: 'gouraya-cove',
      x: 74,
      y: 66,
      category: 'nature',
      label: {
        fr: 'Criques et eaux cristallines',
        ar: 'الخلجان الصغيرة والمياه الصافية',
      },
      description: {
        fr: 'Anse abritée au pied des pentes boisées, où la montagne plonge directement dans le bleu de la mer.',
        ar: 'خليج هادئ عند سفح المنحدرات الغابية حيث يعانق الجبل مياه البحر الصافية.',
      },
    },
  ],
  '/images/aokas-coast.jpg': [
    {
      id: 'aokas-shore',
      x: 42,
      y: 72,
      category: 'nature',
      label: {
        fr: 'Rivage et bande sableuse',
        ar: 'الشريط الرملي والشاطئ',
      },
      description: {
        fr: 'Plage ouverte bordant la côte est de la Wilaya, appréciée pour la baignade estivale et les promenades au bord de l’eau.',
        ar: 'شاطئ ممتد على الساحل الشرقي للولاية، مثالي للسباحة الصيفية والنزهات الساحلية.',
      },
    },
    {
      id: 'aokas-corniche',
      x: 68,
      y: 36,
      category: 'viewpoint',
      label: {
        fr: 'Reliefs de la côte est',
        ar: 'مرتفعات الساحل الشرقي',
      },
      description: {
        fr: 'Contreforts montagneux des Babors plongeant vers la corniche et créant un cadre panoramique entre mer et reliefs.',
        ar: 'امتدادات جبال البابور المشرفة على الكورنيش في لوحة تجمع بين البحر والمرتفعات.',
      },
    },
    {
      id: 'aokas-bay',
      x: 24,
      y: 44,
      category: 'landmark',
      label: {
        fr: 'Courbe du golfe de Béjaïa',
        ar: 'منحنى خليج بجاية',
      },
      description: {
        fr: 'Lumière douce sur la baie, idéale en fin d’après-midi pour photographier le contraste entre la mer et les sommets.',
        ar: 'إضاءة هادئة على الخليج تجعل أواخر بعد الظهر وقتاً مثالياً لتصوير تباين البحر والقمم.',
      },
    },
  ],
  '/images/casbah-heritage.jpg': [
    {
      id: 'casbah-ramparts',
      x: 48,
      y: 34,
      category: 'heritage',
      label: {
        fr: 'Murailles et fortifications',
        ar: 'الأسوار والتحصينات التاريخية',
      },
      description: {
        fr: 'Architecture défensive stratifiée témoignant des époques hammadide, hafside, espagnole et ottomane à Béjaïa.',
        ar: 'عمارة دفاعية متعاقبة تشهد على الحقب الحمادية والحفصية والإسبانية والعثمانية في بجاية.',
      },
    },
    {
      id: 'casbah-arches',
      x: 30,
      y: 64,
      category: 'heritage',
      label: {
        fr: 'Arcades et maçonnerie ancienne',
        ar: 'الأقواس والبناء الحجري العريق',
      },
      description: {
        fr: 'Détails d’appareillage en pierre et voûtes traditionnelles qui structurent les passages et cours intérieures.',
        ar: 'تفاصيل البناء الحجري والأقبية التقليدية التي تميز الممرات والأفنية الداخلية.',
      },
    },
    {
      id: 'casbah-overlook',
      x: 75,
      y: 42,
      category: 'viewpoint',
      label: {
        fr: 'Perspective sur la médina et le port',
        ar: 'إطلالة على المدينة العتيقة والميناء',
      },
      description: {
        fr: 'Position stratégique surplombant l’ancienne cité maritime et les accès portuaires historiques.',
        ar: 'موقع استراتيجي يشرف على المدينة البحرية العتيقة ومداخل الميناء التاريخي.',
      },
    },
  ],
  '/images/kabyle-village.jpg': [
    {
      id: 'village-roofs',
      x: 50,
      y: 46,
      category: 'heritage',
      label: {
        fr: 'Maisons de pierre et tuiles romaines',
        ar: 'المنازل الحجرية والقرميد التقليدي',
      },
      description: {
        fr: 'Habitat traditionnel perché sur les crêtes, organisé autour de ruelles étroites et de la tajmaât communautaire.',
        ar: 'معمار تقليدي يعتلي القمم الجبلية وينتظم حول الأزقة الضيقة وساحة تاجماعت.',
      },
    },
    {
      id: 'village-terraces',
      x: 26,
      y: 70,
      category: 'nature',
      label: {
        fr: 'Oliveraies et vergers en terrasses',
        ar: 'بساتين الزيتون والمدرجات الجبلية',
      },
      description: {
        fr: 'Paysage agricole façonnant les versants de la Soummam, source de l’huile d’olive et des figues réputées de la région.',
        ar: 'مدرجات زراعية تزين سفوح الصومام وتشتهر بإنتاج زيت الزيتون والتين الجبلي.',
      },
    },
    {
      id: 'village-peaks',
      x: 74,
      y: 26,
      category: 'viewpoint',
      label: {
        fr: 'Ligne de crêtes montagneuses',
        ar: 'سلسلة القمم الجبلية',
      },
      description: {
        fr: 'Arrière-plan de sommets kabyles offrant une profondeur remarquable aux photographies de paysage.',
        ar: 'خلفية من القمم الجبلية تمنح الصور الطبيعية عمقاً بانورامياً مميزاً.',
      },
    },
  ],
  '/images/kabyle-craft.jpg': [
    {
      id: 'craft-motifs',
      x: 50,
      y: 46,
      category: 'craft',
      label: {
        fr: 'Motifs géométriques amazighs',
        ar: 'الزخارف الهندسية الأمازيغية',
      },
      description: {
        fr: 'Symboles ancestraux transmis de génération en génération sur la poterie modelée, le tissage et les bijoux d’argent.',
        ar: 'رموز عريقة تتوارثها الأجيال في الفخار التقليدي والنسيج والحلي الفضية.',
      },
    },
    {
      id: 'craft-clay',
      x: 28,
      y: 66,
      category: 'craft',
      label: {
        fr: 'Argile modelée et pigments naturels',
        ar: 'الطين المشكّل والأصباغ الطبيعية',
      },
      description: {
        fr: 'Travail entièrement manuel à partir d’argile locale et d’oxydes minéraux cuits selon les savoir-faire villageois.',
        ar: 'عمل يدوي خالص يعتمد على الطين المحلي والأصباغ المعدنية الطبيعية.',
      },
    },
    {
      id: 'craft-texture',
      x: 74,
      y: 38,
      category: 'heritage',
      label: {
        fr: 'Détails d’atelier et patrimoine vivant',
        ar: 'تفاصيل الورشة والتراث الحي',
      },
      description: {
        fr: 'Éclairage rasant révélant la finesse des émaux, des gravures et des textures artisanales béjaouies.',
        ar: 'إضاءة جانبية تبرز دقة النقوش والمينا وملمس الصناعة التقليدية البجاوية.',
      },
    },
  ],
};

export function getPhotoPointsOfInterest(
  imageSrc: string,
  destination?: Destination
): PhotoPointOfInterest[] {
  const basePois = IMAGE_POIS[imageSrc] ?? IMAGE_POIS['/images/gouraya-nature.jpg'];

  if (!destination) {
    return basePois;
  }

  const firstCharacteristic = destination.characteristics[0];
  const contextualPoi: PhotoPointOfInterest = {
    id: `${destination.slug}-context`,
    x: 62,
    y: 74,
    category: 'landmark',
    label: {
      fr: `Repère : ${destination.name.fr}`,
      ar: `معلم: ${destination.name.ar}`,
    },
    description: {
      fr: firstCharacteristic
        ? `${destination.commune.fr} (${destination.region.fr}) — ${firstCharacteristic.fr}. ${destination.practicalInfo.seasonNote.fr}`
        : `${destination.commune.fr} — ${destination.shortDescription.fr}`,
      ar: firstCharacteristic
        ? `${destination.commune.ar} (${destination.region.ar}) — ${firstCharacteristic.ar}. ${destination.practicalInfo.seasonNote.ar}`
        : `${destination.commune.ar} — ${destination.shortDescription.ar}`,
    },
  };

  return [...basePois, contextualPoi];
}

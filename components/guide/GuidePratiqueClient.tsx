'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plane,
  Train,
  Car,
  Ship,
  ShieldCheck,
  Mountain,
  Waves,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { OsmPlacesPanel } from '@/components/map/OsmPlacesPanel';
import { CurrencyConverter } from '@/components/guide/CurrencyConverter';

export function GuidePratiqueClient() {
  const { locale, t, lt } = useApp();

  const accessModes = [
    {
      icon: Plane,
      title: lt({ fr: 'Par voie aérienne', ar: 'عن طريق الجو', kab: 'S ubrid n yigenni' }),
      body: lt({
        fr: 'La Wilaya est desservie par l’aéroport international Soummam – Abane Ramdane, situé à proximité du chef-lieu de Béjaïa, avec des liaisons nationales et internationales selon les saisons.',
        ar: 'يخدم ولاية بجاية مطار الصومام — عبان رمضان الدولي الواقع على بُعد كيلومترات قليلة من وسط المدينة، مع رحلات داخلية ودولية تختلف حسب الموسم.',
        kab: 'Tawilayt tesɛa anafag agraɣlan n Summam – Ɛebban Remḍan, i iqerben ɣer tlemmast n Bgayet, s yisafagen iɣelnawen d yigraɣlanen almend n tsemhuyin.',
      }),
    },
    {
      icon: Car,
      title: lt({ fr: 'Par la route', ar: 'عن طريق البر', kab: 'S ubrid n tkeṛṛust' }),
      body: lt({
        fr: 'Béjaïa est reliée au réseau routier national par la pénétrante autoroutière vers l’Autoroute Est-Ouest ainsi que par les routes nationales RN26 (vallée de la Soummam), RN9 (vers Sétif via Kherrata), RN24 (côte Ouest) et RN43 (vers Jijel).',
        ar: 'ترتبط بجاية بالشبكة الوطنية للطرق عبر منفذ الطريق السيار شرق-غرب والطرق الوطنية (RN9 نحو سطيف، RN26 عبر وادي الصومام، RN24 عبر الساحل الغربي وRN43 نحو جيجل).',
        kab: 'Bgayet teqqen ɣer uẓeṭṭa aɣelnaw n yiberdan s ubrid ameqqran (Pénétrante) ɣer Ubrid Asamar-Amalu d yiberdan iɣelnawen RN26 (Asif n Summam), RN9 (ɣer Sṭif s Xerraṭa), RN24 (Aftis umalu) d RN43 (ɣer Ǧiǧel).',
      }),
    },
    {
      icon: Train,
      title: lt({ fr: 'Par train', ar: 'عن طريق السكة الحديدية', kab: 'S tmacint (ubrid n wuzzal)' }),
      body: lt({
        fr: 'La ligne ferroviaire relie la gare de Béjaïa à la vallée de la Soummam et à Beni Mansour avec correspondances nationales. Consultez les horaires officiels actualisés auprès de la SNTF.',
        ar: 'تتوفر محطة القطار ببجاية على خط يربط المدينة بوادي الصومام وبني منصور، مع إمكانية المواصلة نحو الجزائر العاصمة. يُرجى مراجعة المواعيد المحدثة لدى SNTF.',
        kab: 'Abrid n tmacint yeqqen taɣsert n Bgayet ɣer wasif n Summam d At Menṣur s tuqqniwin tiɣelnawin. Wali akud unṣib sɣur SNTF.',
      }),
    },
    {
      icon: Ship,
      title: lt({ fr: 'Par voie maritime', ar: 'عن طريق البحر', kab: 'S ubrid n yilel' }),
      body: lt({
        fr: 'Le port de Béjaïa accueille des liaisons maritimes de voyageurs selon les programmes saisonniers officiels des compagnies maritimes.',
        ar: 'يستقبل ميناء بجاية رحلات بحرية موسمية للركاب حسب البرمجة الرسمية للشركات البحرية المعتمدة.',
        kab: 'Asagen n Bgayet yettmagar iɣerruba n yiminigen almend n wahil unṣib n tkebbaniyin n yilel.',
      }),
    },
  ];

  const regions = [
    {
      name: lt({
        fr: 'Chef-lieu & Parc national de Gouraya',
        ar: 'وسط المدينة والحظيرة الوطنية لقوراية',
        kab: 'Talemmast n temdint & Amraḥ aɣelnaw n Guraya',
      }),
      desc: lt({
        fr: 'Casbah, Bab El Bhar, Musée Bordj Moussa, Mont Gouraya, Cap Carbon, Pic des Singes et Baie des Aiguades.',
        ar: 'القصبة، باب البحر، متحف برج موسى، جبل قوراية، رأس كربون، قمة القردة وخليج ليغواد.',
        kab: 'Lqeṣba, Bab Lbaḥer, Asalay n Berǧ Musa, Adrar n Guraya, Ixef Karbun, Taqacuct n Yibkan d Uɣezraw n Ligwad.',
      }),
      href: '/categories/historique',
    },
    {
      name: lt({
        fr: 'Côte Est (Tichy · Aokas · Souk El Tenine · Melbou)',
        ar: 'الساحل الشرقي',
        kab: 'Aftis usamar (Tici · Aweqqas · Suq Letnin · Melbu)',
      }),
      desc: lt({
        fr: 'Stations balnéaires familiales, grottes féeriques d’Aokas, corniches littorales et accès aux gorges de Kherrata.',
        ar: 'محطات شاطئية واسعة، المغارات العجيبة لأوقاس، الكورنيش الشرقي ومدخل مضيق خراطة.',
        kab: 'Tiftisin n twacult, ifran n Aweqqas, iberdan n uftis d unekcum ɣer yiɣzer n Xerraṭa.',
      }),
      href: '/categories/balneaire',
    },
    {
      name: lt({
        fr: 'Côte Ouest & Toudja (Boulimat · Saket · Toudja)',
        ar: 'الساحل الغربي وتوجة',
        kab: 'Aftis umalu & Tuǧa (Bulimaṭ · Saket · Tuǧa)',
      }),
      desc: lt({
        fr: 'Plages boisées préservées de Boulimat et Saket, sources naturelles et patrimoine hydraulique de Toudja.',
        ar: 'شواطئ طبيعية وسط الغابات، ينابيع توجة التاريخية وبساتينها.',
        kab: 'Tiftisin n Bulimaṭ d Saket, tiliwa tigamanin d umezruy n waman n Tuǧa.',
      }),
      href: '/destinations/toudja',
    },
    {
      name: lt({
        fr: 'Vallée de la Soummam, Akfadou & Thermalisme',
        ar: 'وادي الصومام والمرتفعات الداخلية',
        kab: 'Asif n Summam, Akfadu & Lḥemmamat',
      }),
      desc: lt({
        fr: 'Villages kabyles perchés, forêt de l’Akfadou, sources thermales de Tifra, Adekar et Bouhamza, mémoire d’Ifri Ouzellaguen.',
        ar: 'القرى القبائلية المعلقة، غابة أكفادو، الينابيع الحموية لتيفرة وأدكار وبوحمزة وذاكرة مؤتمر الصومام.',
        kab: 'Tudrin n Leqbayel, tiẓegi n Akfadu, tiliwa n waman iḥmayanen n Tifra, Adekar d Buḥemza, takatut n Yifri Uzellagen.',
      }),
      href: '/categories/culturel',
    },
  ];

  const groundingSuggestions =
    locale === 'ar'
      ? ['فندق بجاية', 'محطة القطار بجاية', 'مطعم تيشي']
      : locale === 'kab'
      ? ['Asensu Bgayet', 'Taɣsert n Bgayet', 'Asečču Tici']
      : ['Hôtel Béjaïa', 'Gare de Béjaïa', 'Restaurant Tichy'];

  return (
    <div className="bg-white">
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.guide') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('guide.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">{t('guide.pageSubtitle')}</p>
            <div className="mt-4 p-4 bg-white border border-[#C47B55]/35 rounded-md flex items-start gap-3 text-xs text-[#103B50] leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
              <span>{t('guide.disclaimer')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* 1. Comment rejoindre Béjaïa */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-semibold text-[#103B50]">
            {lt({
              fr: 'Comment rejoindre Béjaïa',
              ar: 'كيف تصل إلى بجاية',
              kab: 'Amek ara tawḍeḍ ɣer Bgayet',
            })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.title}
                  className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-3"
                >
                  <div className="w-10 h-10 rounded-md bg-[#103B50] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#103B50]">{mode.title}</h3>
                  <p className="text-sm text-[#51636D] leading-relaxed">{mode.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Convertisseur de devises en temps réel */}
        <section id="convertisseur" className="scroll-mt-24 pt-10 border-t border-[#103B50]/10">
          <CurrencyConverter />
        </section>

        {/* 3. Régions et communes touristiques */}
        <section className="space-y-6 pt-10 border-t border-[#103B50]/10">
          <h2 className="font-serif text-3xl font-semibold text-[#103B50]">
            {lt({
              fr: 'Régions et communes touristiques',
              ar: 'المناطق والبلديات السياحية',
              kab: 'Timnaḍin d tɣiwanin n tmerrit',
            })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {regions.map((reg) => (
              <Link
                key={reg.name}
                href={reg.href}
                className="group block bg-white border border-[#103B50]/12 hover:border-[#087E9B] rounded-lg p-6 transition-colors"
              >
                <h3 className="font-serif text-xl font-semibold text-[#103B50] group-hover:text-[#087E9B] transition-colors">
                  {reg.name}
                </h3>
                <p className="text-sm text-[#51636D] mt-2 leading-relaxed">{reg.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Sécurité, Randonnée & Littoral */}
        <section className="space-y-6 pt-10 border-t border-[#103B50]/10">
          <h2 className="font-serif text-3xl font-semibold text-[#103B50]">
            {lt({
              fr: 'Préparer une randonnée et conseils de sécurité',
              ar: 'إرشادات السلامة والمشي الجبلي والشواطئ',
              kab: 'Aheggi n tikli d yiwellihen n tɣellist',
            })}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <Mountain className="w-6 h-6 text-[#356B50]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {lt({
                  fr: 'En montagne et en forêt',
                  ar: 'في الجبل والغابة',
                  kab: 'Deg udrar d tẓegi',
                })}
              </h3>
              <ul className="space-y-2 text-sm text-[#51636D] leading-relaxed">
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Prévoir des chaussures de marche adaptées, suffisamment d’eau et vérifier la météo avant le départ.',
                    ar: 'ارتداء أحذية مشي مناسبة وحمل كمية كافية من الماء ومراجعة الطقس.',
                    kab: 'Sels isebbaḍen n tikli iwatan, awi-d aman s waṭas u senqed tagnawt uqbel ad truḥeḍ.',
                  })}
                </li>
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Interdiction stricte de tout feu en zone forestière (Gouraya, Akfadou) et ne pas nourrir la faune sauvage.',
                    ar: 'عدم إشعال أي نار في الغابات وعدم إطعام قردة المكاك البربري.',
                    kab: 'Yegdel s lǧehd ad tessaɣeḍ times deg tẓegwa (Guraya, Akfadu) u ur sxeččay ara ibkan.',
                  })}
                </li>
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Pour les itinéraires d’altitude, privilégier un guide local ou une association de randonnée reconnue.',
                    ar: 'الاستعانة بمرشدين محليين في المسارات الجبلية العميقة.',
                    kab: 'Deg yiberdan n yidurar iɛlayen, fren amnir adigan neɣ tiddukla n tikli yettwassnen.',
                  })}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <Waves className="w-6 h-6 text-[#087E9B]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {lt({
                  fr: 'Sur le littoral et les plages',
                  ar: 'على الساحل والشواطئ',
                  kab: 'Ɣef uftis d tiftisin',
                })}
              </h3>
              <ul className="space-y-2 text-sm text-[#51636D] leading-relaxed">
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Se baigner exclusivement sur les plages autorisées et surveillées en respectant les drapeaux de baignade.',
                    ar: 'السباحة حصراً في الشواطئ المسموحة والمحروسة واحترام رايات السلامة.',
                    kab: 'Ɛum kan deg tiftisin yettwasirgen d yettwaɛussen u qader isenfalen n tɣellist.',
                  })}
                </li>
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Faire preuve de vigilance aux abords des falaises calcaires (Cap Carbon, corniches).',
                    ar: 'الحذر قرب المنحدرات الصخرية والخلجان غير المهيأة.',
                    kab: 'Ḥader iman-ik sdat yifriwen n yidɣaɣen (Ixef Karbun, iberdan n uftis).',
                  })}
                </li>
                <li>
                  ·{' '}
                  {lt({
                    fr: 'Emporter tous ses déchets afin de préserver la qualité du littoral méditerranéen.',
                    ar: 'الحفاظ على نظافة الشواطئ وعدم ترك النفايات.',
                    kab: 'Awi yid-k akk iḍumman-ik akken ad tḥerzeḍ tezdeg n uftis agrakal.',
                  })}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#C47B55]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {lt({
                  fr: 'Hébergements et sources officielles',
                  ar: 'الإقامة والمصادر الرسمية',
                  kab: 'Tanezduɣt d yiɣbula unṣiben',
                })}
              </h3>
              <p className="text-sm text-[#51636D] leading-relaxed">
                {lt({
                  fr: 'Pour consulter la liste officielle des établissements hôteliers classés, agences de voyages agréées et manifestations touristiques, référez-vous directement aux sources institutionnelles :',
                  ar: 'للاطلاع على القائمة الرسمية للمؤسسات الفندقية ووكالات السياحة المعتمدة بولاية بجاية، يُرجى الرجوع إلى مديرية السياحة والصناعة التقليدية.',
                  kab: 'Akken ad twaliḍ umuɣ unṣib n yisensa, tineggiwin n usikel yettwaqeblen d tedyanin n tmerrit di Bgayet, wali srid iɣbula unṣiben:',
                })}
              </p>
              <div className="pt-2 space-y-2 text-sm font-medium">
                <a
                  href="https://www.dta-bejaia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#087E9B] hover:text-[#103B50]"
                >
                  <span>DTA Béjaïa (dta-bejaia.com)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#087E9B] hover:text-[#103B50]"
                >
                  <span>Guide officiel VisitAlgeria (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live OpenStreetMap Search for Services & Accommodations */}
        <section className="pt-4">
          <OsmPlacesPanel
            title={lt({
              fr: 'Rechercher des hébergements et services via OpenStreetMap',
              ar: 'ابحث عن الفنادق والمطاعم والخدمات عبر OpenStreetMap',
              kab: 'Nadi isensa, iseččuten d yimeẓla s OpenStreetMap',
            })}
            subtitle={lt({
              fr: 'Interrogez directement la base ouverte OpenStreetMap pour localiser hôtels, restaurants, gares et services dans la Wilaya de Béjaïa sans données inventées.',
              ar: 'استعلم مباشرة من قاعدة بيانات OpenStreetMap المفتوحة للوصول إلى الفنادق والمطاعم والمحطات في ولاية بجاية.',
              kab: 'Nadi srid deg OpenStreetMap akken ad tafeḍ isensa, iseččuten, tiɣsar d yimeẓla deg twilayt n Bgayet.',
            })}
            suggestedQueries={groundingSuggestions}
          />
        </section>
      </div>
    </div>
  );
}

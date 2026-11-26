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
  const { locale, t } = useApp();

  const isAr = locale === 'ar';

  const accessModes = [
    {
      icon: Plane,
      title: isAr ? 'عن طريق الجو' : 'Par voie aérienne',
      body: isAr
        ? 'يخدم ولاية بجاية مطار الصومام — عبان رمضان الدولي الواقع على بُعد كيلومترات قليلة من وسط المدينة، مع رحلات داخلية ودولية تختلف حسب الموسم.'
        : 'La Wilaya est desservie par l’aéroport international Soummam – Abane Ramdane, situé à proximité du chef-lieu de Béjaïa, avec des liaisons nationales et internationales selon les saisons.',
    },
    {
      icon: Car,
      title: isAr ? 'عن طريق البر' : 'Par la route',
      body: isAr
        ? 'ترتبط بجاية بالشبكة الوطنية للطرق عبر منفذ الطريق السيار شرق-غرب والطرق الوطنية (RN9 نحو سطيف، RN26 عبر وادي الصومام، RN24 عبر الساحل الغربي وRN43 نحو جيجل).'
        : 'Béjaïa est reliée au réseau routier national par la pénétrante autoroutière vers l’Autoroute Est-Ouest ainsi que par les routes nationales RN26 (vallée de la Soummam), RN9 (vers Sétif via Kherrata), RN24 (côte Ouest) et RN43 (vers Jijel).',
    },
    {
      icon: Train,
      title: isAr ? 'عن طريق السكة الحديدية' : 'Par train',
      body: isAr
        ? 'تتوفر محطة القطار ببجاية على خط يربط المدينة بوادي الصومام وبني منصور، مع إمكانية المواصلة نحو الجزائر العاصمة. يُرجى مراجعة المواعيد المحدثة لدى SNTF.'
        : 'La ligne ferroviaire relie la gare de Béjaïa à la vallée de la Soummam et à Beni Mansour avec correspondances nationales. Consultez les horaires officiels actualisés auprès de la SNTF.',
    },
    {
      icon: Ship,
      title: isAr ? 'عن طريق البحر' : 'Par voie maritime',
      body: isAr
        ? 'يستقبل ميناء بجاية رحلات بحرية موسمية للركاب حسب البرمجة الرسمية للشركات البحرية المعتمدة.'
        : 'Le port de Béjaïa accueille des liaisons maritimes de voyageurs selon les programmes saisonniers officiels des compagnies maritimes.',
    },
  ];

  const regions = [
    {
      name: isAr ? 'وسط المدينة والحظيرة الوطنية لقوراية' : 'Chef-lieu & Parc national de Gouraya',
      desc: isAr
        ? 'القصبة، باب البحر، متحف برج موسى، جبل قوراية، رأس كربون، قمة القردة وخليج ليغواد.'
        : 'Casbah, Bab El Bhar, Musée Bordj Moussa, Mont Gouraya, Cap Carbon, Pic des Singes et Baie des Aiguades.',
      href: '/categories/historique',
    },
    {
      name: isAr ? 'الساحل الشرقي' : 'Côte Est (Tichy · Aokas · Souk El Tenine · Melbou)',
      desc: isAr
        ? 'محطات شاطئية واسعة، المغارات العجيبة لأوقاس، الكورنيش الشرقي ومدخل مضيق خراطة.'
        : 'Stations balnéaires familiales, grottes féeriques d’Aokas, corniches littorales et accès aux gorges de Kherrata.',
      href: '/categories/balneaire',
    },
    {
      name: isAr ? 'الساحل الغربي وتوجة' : 'Côte Ouest & Toudja (Boulimat · Saket · Toudja)',
      desc: isAr
        ? 'شواطئ طبيعية وسط الغابات، ينابيع توجة التاريخية وبساتينها.'
        : 'Plages boisées préservées de Boulimat et Saket, sources naturelles et patrimoine hydraulique de Toudja.',
      href: '/destinations/toudja',
    },
    {
      name: isAr ? 'وادي الصومام والمرتفعات الداخلية' : 'Vallée de la Soummam, Akfadou & Thermalisme',
      desc: isAr
        ? 'القرى القبائلية المعلقة، غابة أكفادو، الينابيع الحموية لتيفرة وأدكار وبوحمزة وذاكرة مؤتمر الصومام.'
        : 'Villages kabyles perchés, forêt de l’Akfadou, sources thermales de Tifra, Adekar et Bouhamza, mémoire d’Ifri Ouzellaguen.',
      href: '/categories/culturel',
    },
  ];

  const groundingSuggestions = isAr
    ? ['فندق بجاية', 'محطة القطار بجاية', 'مطعم تيشي']
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
            {isAr ? 'كيف تصل إلى بجاية' : 'Comment rejoindre Béjaïa'}
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
            {isAr ? 'المناطق والبلديات السياحية' : 'Régions et communes touristiques'}
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
            {isAr
              ? 'إرشادات السلامة والمشي الجبلي والشواطئ'
              : 'Préparer une randonnée et conseils de sécurité'}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <Mountain className="w-6 h-6 text-[#356B50]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {isAr ? 'في الجبل والغابة' : 'En montagne et en forêt'}
              </h3>
              <ul className="space-y-2 text-sm text-[#51636D] leading-relaxed">
                <li>
                  ·{' '}
                  {isAr
                    ? 'ارتداء أحذية مشي مناسبة وحمل كمية كافية من الماء ومراجعة الطقس.'
                    : 'Prévoir des chaussures de marche adaptées, suffisamment d’eau et vérifier la météo avant le départ.'}
                </li>
                <li>
                  ·{' '}
                  {isAr
                    ? 'عدم إشعال أي نار في الغابات وعدم إطعام قردة المكاك البربري.'
                    : 'Interdiction stricte de tout feu en zone forestière (Gouraya, Akfadou) et ne pas nourrir la faune sauvage.'}
                </li>
                <li>
                  ·{' '}
                  {isAr
                    ? 'الاستعانة بمرشدين محليين في المسارات الجبلية العميقة.'
                    : 'Pour les itinéraires d’altitude, privilégier un guide local ou une association de randonnée reconnue.'}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <Waves className="w-6 h-6 text-[#087E9B]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {isAr ? 'على الساحل والشواطئ' : 'Sur le littoral et les plages'}
              </h3>
              <ul className="space-y-2 text-sm text-[#51636D] leading-relaxed">
                <li>
                  ·{' '}
                  {isAr
                    ? 'السباحة حصراً في الشواطئ المسموحة والمحروسة واحترام رايات السلامة.'
                    : 'Se baigner exclusivement sur les plages autorisées et surveillées en respectant les drapeaux de baignade.'}
                </li>
                <li>
                  ·{' '}
                  {isAr
                    ? 'الحذر قرب المنحدرات الصخرية والخلجان غير المهيأة.'
                    : 'Faire preuve de vigilance aux abords des falaises calcaires (Cap Carbon, corniches).'}
                </li>
                <li>
                  ·{' '}
                  {isAr
                    ? 'الحفاظ على نظافة الشواطئ وعدم ترك النفايات.'
                    : 'Emporter tous ses déchets afin de préserver la qualité du littoral méditerranéen.'}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#C47B55]" />
              <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                {isAr ? 'الإقامة والمصادر الرسمية' : 'Hébergements et sources officielles'}
              </h3>
              <p className="text-sm text-[#51636D] leading-relaxed">
                {isAr
                  ? 'للاطلاع على القائمة الرسمية للمؤسسات الفندقية ووكالات السياحة المعتمدة بولاية بجاية، يُرجى الرجوع إلى مديرية السياحة والصناعة التقليدية.'
                  : 'Pour consulter la liste officielle des établissements hôteliers classés, agences de voyages agréées et manifestations touristiques, référez-vous directement aux sources institutionnelles :'}
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
            title={
              isAr
                ? 'ابحث عن الفنادق والمطاعم والخدمات عبر OpenStreetMap'
                : 'Rechercher des hébergements et services via OpenStreetMap'
            }
            subtitle={
              isAr
                ? 'استعلم مباشرة من قاعدة بيانات OpenStreetMap المفتوحة للوصول إلى الفنادق والمطاعم والمحطات في ولاية بجاية.'
                : 'Interrogez directement la base ouverte OpenStreetMap pour localiser hôtels, restaurants, gares et services dans la Wilaya de Béjaïa sans données inventées.'
            }
            suggestedQueries={groundingSuggestions}
          />
        </section>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Layers, Globe2, ArrowRight } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function AboutClient() {
  const { locale, t } = useApp();
  const isAr = locale === 'ar';

  return (
    <div className="bg-white">
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.about') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('about.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">{t('about.pageSubtitle')}</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
            {isAr ? 'رسالتنا في التعريف بولاية بجاية' : 'Notre mission : promouvoir la Wilaya de Béjaïa'}
          </h2>
          <p className="text-base text-[#51636D] leading-relaxed">
            {isAr
              ? 'يهدف مشروع «اكتشف بجاية — Béjaïa Explorer» إلى تقديم بوابة رقمية عصرية وموثوقة تُبرز الغنى الطبيعي والتاريخي والثقافي لولاية بجاية في الجزائر، من شواطئ المتوسط والحظيرة الوطنية لقوراية إلى القرى القبائلية العريقة والتراث الحمادي.'
              : 'Béjaïa Explorer – اكتشف بجاية a pour vocation d’offrir une vitrine numérique exigeante, claire et accessible dédiée au rayonnement touristique, naturel, historique et culturel de l’ensemble de la Wilaya de Béjaïa.'}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#103B50]/10">
          <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-[#356B50]" />
            <h3 className="font-serif text-xl font-semibold text-[#103B50]">
              {isAr ? 'المصداقية والتوثيق' : 'Exigence de fiabilité'}
            </h3>
            <p className="text-sm text-[#51636D] leading-relaxed">
              {isAr
                ? 'لا نختلق أسعاراً أو مواعيد أو إحداثيات غير مؤكدة؛ ونشير بوضوح إلى المصادر الرسمية والبيانات التي تستوجب تحققاً ميدانياً، مع تمييز واضح للرسوم التوضيحية المولّدة بالذكاء الاصطناعي.'
                : 'Aucun tarif, horaire ou coordonnée approximative n’est inventé. Chaque fiche cite ses sources, signale les éléments à vérifier sur le terrain et identifie clairement les illustrations éditoriales IA.'}
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-2.5">
            <Globe2 className="w-6 h-6 text-[#087E9B]" />
            <h3 className="font-serif text-xl font-semibold text-[#103B50]">
              {isAr ? 'التعدد اللغوي والولوجية' : 'Multilinguisme responsable'}
            </h3>
            <p className="text-sm text-[#51636D] leading-relaxed">
              {isAr
                ? 'واجهة كاملة بالفرنسية والعربية (RTL)، وبنية جاهزة لاحتضان الترجمة القبائلية (الأمازيغية) فور تدقيقها اللغوي الرسمي.'
                : 'Interface complète en français et en arabe (RTL), et architecture prête pour accueillir la version kabyle (Taqvaylit / Tamazight) dès validation linguistique officielle.'}
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-2.5">
            <Layers className="w-6 h-6 text-[#C47B55]" />
            <h3 className="font-serif text-xl font-semibold text-[#103B50]">
              {isAr ? 'بنية تقنية قابلة للتوسع' : 'Architecture évolutive'}
            </h3>
            <p className="text-sm text-[#51636D] leading-relaxed">
              {isAr
                ? 'صُممت نماذج البيانات والمكونات لتسهيل الربط المستقبلي بقاعدة بيانات أو نظام إدارة محتوى (CMS) أو لوحة تحكم لإدارة الوجهات والصور والأخبار.'
                : 'Les schémas TypeScript et données structurées locales sont conçus pour permettre une évolution fluide vers une base de données, un CMS, une gestion photographique et des actualités touristiques.'}
            </p>
          </div>
        </section>

        <section className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 md:p-8 space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-[#103B50]">
            {isAr ? 'المصادر المؤسسية المرجعية' : 'Sources institutionnelles prioritaires'}
          </h2>
          <ul className="space-y-3 text-sm text-[#103B50]">
            <li>
              <a
                href="https://www.dta-bejaia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#087E9B] hover:text-[#103B50] font-medium"
              >
                <span>Direction du Tourisme et de l’Artisanat de Béjaïa (dta-bejaia.com)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </li>
            <li>
              <a
                href="https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#087E9B] hover:text-[#103B50] font-medium"
              >
                <span>Guide touristique officiel de Béjaïa — VisitAlgeria (PDF)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </li>
          </ul>
          <div className="pt-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#103B50] hover:text-[#087E9B]"
            >
              <span>{t('nav.contact')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

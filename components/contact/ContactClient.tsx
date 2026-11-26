'use client';

import React, { useState } from 'react';
import { AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactClient() {
  const { locale, t } = useApp();
  const isAr = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [validatedSummary, setValidatedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = isAr ? 'الرجاء إدخال الاسم الكامل.' : 'Veuillez saisir votre nom complet (2 caractères minimum).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Veuillez saisir une adresse e-mail valide.';
    }
    if (subject.trim().length < 3) {
      next.subject = isAr ? 'يرجى تحديد موضوع الرسالة.' : 'Veuillez préciser l’objet de votre message.';
    }
    if (message.trim().length < 15) {
      next.message = isAr
        ? 'يرجى كتابة رسالة مفصلة (15 حرفاً على الأقل).'
        : 'Veuillez rédiger un message d’au moins 15 caractères.';
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setValidatedSummary(null);
      return;
    }

    // Strict transparency: never simulate a backend send when no mail server is configured
    const formatted = [
      `Nom : ${name.trim()}`,
      `Email : ${email.trim()}`,
      `Objet : ${subject.trim()}`,
      `---`,
      message.trim(),
    ].join('\n');
    setValidatedSummary(formatted);
  };

  const handleCopy = async () => {
    if (!validatedSummary) return;
    try {
      await navigator.clipboard.writeText(validatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.contact') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('contact.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">{t('contact.pageSubtitle')}</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-[#103B50] mb-1.5">
                {t('contact.nameLabel')}
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              />
              {errors.name && <p className="text-xs text-[#C47B55] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-[#103B50] mb-1.5">
                {t('contact.emailLabel')}
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              />
              {errors.email && <p className="text-xs text-[#C47B55] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-[#103B50] mb-1.5">
                {t('contact.subjectLabel')}
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-invalid={Boolean(errors.subject)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              />
              {errors.subject && <p className="text-xs text-[#C47B55] mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-[#103B50] mb-1.5">
                {t('contact.messageLabel')}
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={Boolean(errors.message)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              />
              {errors.message && <p className="text-xs text-[#C47B55] mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded-md transition-colors"
            >
              {t('contact.submitButton')}
            </button>
          </form>

          {validatedSummary && (
            <div
              role="status"
              className="bg-[#FAF8F3] border border-[#C47B55]/50 rounded-lg p-5 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#C47B55] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="font-serif text-lg font-semibold text-[#103B50]">
                    {t('contact.noBackendTitle')}
                  </h2>
                  <p className="text-sm text-[#51636D] leading-relaxed">
                    {t('contact.noBackendBody')}
                  </p>
                </div>
              </div>
              <pre className="p-3.5 bg-white border border-[#103B50]/10 rounded text-xs text-[#102530] whitespace-pre-wrap font-sans">
                {validatedSummary}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#087E9B] hover:bg-[#103B50] text-white text-xs font-medium rounded-md transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('contact.copied') : t('contact.copyMessage')}</span>
              </button>
            </div>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#103B50]">
              {isAr ? 'القنوات الرسمية للمعلومات السياحية' : 'Canaux touristiques officiels'}
            </h2>
            <p className="text-sm text-[#51636D] leading-relaxed">
              {isAr
                ? 'للاستفسارات الإدارية أو المعلومات السياحية الرسمية في ولاية بجاية، يُرجى التواصل مباشرة عبر المواقع الرسمية التالية:'
                : 'Pour toute demande administrative, actualité touristique officielle ou accréditation, veuillez consulter directement les portails institutionnels :'}
            </p>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a
                  href="https://www.dta-bejaia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#087E9B] hover:text-[#103B50]"
                >
                  <span>Direction du Tourisme et de l’Artisanat de Béjaïa</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a
                  href="https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#087E9B] hover:text-[#103B50]"
                >
                  <span>Guide touristique officiel de Béjaïa (VisitAlgeria)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

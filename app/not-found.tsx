import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[65vh] flex items-center justify-center px-4 py-20 bg-[#FAF8F3]">
      <div className="max-w-lg text-center space-y-5">
        <Compass className="w-10 h-10 text-[#087E9B] mx-auto" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
          Erreur 404 · Page introuvable
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
          Ce chemin ne figure pas encore sur notre carte de Béjaïa
        </h1>
        <p className="text-sm text-[#51636D] leading-relaxed">
          La destination ou la page recherchée a peut-être été déplacée. Revenez à l’accueil ou explorez l’annuaire complet de la Wilaya de Béjaïa.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded-md transition-colors"
          >
            Retour à l’accueil
          </Link>
          <Link
            href="/destinations"
            className="px-5 py-2.5 bg-white hover:bg-[#F4EFE5] text-[#103B50] border border-[#103B50]/15 text-sm font-medium rounded-md transition-colors"
          >
            Explorer les destinations
          </Link>
        </div>
      </div>
    </section>
  );
}

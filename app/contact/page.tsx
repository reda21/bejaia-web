import type { Metadata } from 'next';
import { ContactClient } from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact et contributions — Béjaïa Explorer',
  description:
    'Contactez l’équipe éditoriale de Béjaïa Explorer pour proposer une destination, signaler une correction ou partager des photographies certifiées de la Wilaya de Béjaïa.',
};

export default function ContactPage() {
  return <ContactClient />;
}

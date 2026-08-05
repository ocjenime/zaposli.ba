import type { Metadata } from 'next';
import NewPasswordForm from './NewPasswordForm';

export const metadata: Metadata = {
  title: 'Nova lozinka | Zaposli.ba',
  description: 'Postavite novu lozinku za vaš Zaposli.ba nalog.',
  robots: 'noindex, nofollow',
};

export default function NewPasswordPage() {
  return <NewPasswordForm />;
}

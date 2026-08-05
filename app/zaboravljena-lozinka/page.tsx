import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Zaboravljena lozinka | Zaposli.ba',
  description: 'Resetujte lozinku za vaš Zaposli.ba nalog. Unesite email adresu i poslaćemo vam link za postavljanje nove lozinke.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

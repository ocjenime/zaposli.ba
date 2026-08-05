import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Registracija | Zaposli.ba',
  description: 'Kreirajte besplatan nalog na Zaposli.ba kao klijent, firma ili majstor.',
  robots: 'noindex, nofollow',
};

export default function RegisterPage() {
  return <RegisterForm />;
}

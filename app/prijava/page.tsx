import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Prijava | Zaposli.ba',
  description: 'Prijavite se na svoj Zaposli.ba nalog i upravljajte poslovima, ponudama i porukama.',
  robots: 'noindex, nofollow',
};

export default function LoginPage() {
  return <LoginForm />;
}

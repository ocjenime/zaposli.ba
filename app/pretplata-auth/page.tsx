import type { Metadata } from 'next';
import SubscriptionAuthContent from './SubscriptionAuthContent';

export const metadata: Metadata = {
  title: 'Pretplata | Zaposli.ba',
  description: 'Prijavite se ili registrujte kao firma ili majstor da biste aktivirali pretplatu na Zaposli.ba.',
  robots: 'noindex, nofollow',
};

export default function SubscriptionAuthPage() {
  return <SubscriptionAuthContent />;
}

import type { Metadata } from 'next';
import PremiumContent from '@/components/PremiumContent';

export const metadata: Metadata = {
  title: 'Premium Plans | OmniLoad',
  description: 'Upgrade to OmniLoad Premium for faster processing, no ads, saved history, bulk link processing, and more.',
  openGraph: {
    title: 'OmniLoad Premium',
    description: 'Unlock the full power of OmniLoad with Premium features.',
    url: 'https://omniload.onrender.com/premium',
  },
};

export default function PremiumPage() {
  return <PremiumContent />;
}

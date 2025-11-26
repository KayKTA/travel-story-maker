import { Suspense } from 'react';
import TripsPageClient from '@/components/trips/TripsPageClient';

export default function TripsPage() {
  return (
    <Suspense fallback={null}>
      <TripsPageClient />
    </Suspense>
  );
}

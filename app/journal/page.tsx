import { Suspense } from 'react';
import JournalPageClient from '@/components/journal/JournalPageClient';

export default function JournalPage() {
    return (
        <Suspense fallback={null}>
            <JournalPageClient />
        </Suspense>
    );
}

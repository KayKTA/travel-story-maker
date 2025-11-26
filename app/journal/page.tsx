import { Suspense } from 'react';
import { Box, Container, Skeleton, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import JournalList from '@/components/journal/JournalList';
import { createClient } from '@/lib/supabase/server';
import type { JournalEntryWithMedia } from '@/types';

async function getJournalEntries(): Promise<JournalEntryWithMedia[]> {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from('journal_entries')
        .select(`
      *,
      trips:trip_id (
        id,
        country,
        city
      )
    `)
        .order('entry_date', { ascending: false });

    if (error) {
        console.error('Error fetching journal entries:', error);
        return [];
    }

    // Get media for each entry
    const entriesWithMedia = await Promise.all(
        (entries || []).map(async (entry) => {
            const { data: media } = await supabase
                .from('media_assets')
                .select('*')
                .eq('journal_entry_id', entry.id)
                .order('taken_at', { ascending: true });

            return {
                ...entry,
                trip: entry.trips,
                media_assets: media || [],
            } as JournalEntryWithMedia;
        })
    );

    return entriesWithMedia;
}

function JournalLoading() {
    return (
        <Grid container spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12 }}>
                    <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                </Grid>
            ))}
        </Grid>
    );
}

async function JournalContent() {
    const entries = await getJournalEntries();
    return <JournalList entries={entries} />;
}

export default function JournalPage() {
    return (
        <Box>
            <PageHeader
                title="Journal de voyage"
                subtitle="Toutes vos entrées de journal"
                action={{
                    label: 'Nouvelle entrée',
                    icon: <AddIcon />,
                    href: '/journal?new=true',
                }}
            />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Suspense fallback={<JournalLoading />}>
                    <JournalContent />
                </Suspense>
            </Container>
        </Box>
    );
}

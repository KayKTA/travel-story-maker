'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Skeleton, Typography, Paper, Button } from '@mui/material';
import { Flight as FlightIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { JournalEntryWithMedia } from '@/types';

export default function JournalPageClient() {
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntryWithMedia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        setLoading(true);
        const supabase = getSupabaseClient();

        const { data: entriesData, error } = await supabase
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
            setLoading(false);
            return;
        }

        // Get media for each entry
        const entriesWithMedia = await Promise.all(
            (entriesData || []).map(async (entry) => {
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

        setEntries(entriesWithMedia);
        setLoading(false);
    };

    return (
        <Box>
            <PageHeader
                title="Journal de voyage"
                subtitle="Toutes vos entrées de journal"
            />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Grid key={i} size={{ xs: 12 }}>
                                <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : entries.length === 0 ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 3,
                        }}
                    >
                        <FlightIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucune entrée de journal
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Pour créer une entrée, sélectionnez d'abord un voyage.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => router.push('/trips')}
                        >
                            Voir mes voyages
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {entries.map((entry) => (
                            <Grid key={entry.id} size={{ xs: 12 }}>
                                <JournalEntryCard entry={entry} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Skeleton, Typography, Paper, Button } from '@mui/material';
import { Flight as FlightIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import { useJournalEntries } from '@/lib/hooks';
import type { JournalEntryWithMedia } from '@/types';

export default function JournalPageClient() {
    const router = useRouter();
    const { data: entriesData = [], isLoading: loading } = useJournalEntries();

    // Transform API data to match JournalEntryWithMedia type
    const entries: JournalEntryWithMedia[] = entriesData.map((entry: any) => ({
        ...entry,
        trip: entry.trips,
        media_assets: entry.media_assets || [],
    }));

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

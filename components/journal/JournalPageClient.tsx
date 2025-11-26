'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Grid, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import JournalList from '@/components/journal/JournalList';
import JournalForm from '@/components/journal/JournalForm';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { JournalEntryWithMedia, JournalEntryFormData } from '@/types';

export default function JournalPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [entries, setEntries] = useState<JournalEntryWithMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);

    // Ouvrir le formulaire si ?new=true dans l'URL
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setFormOpen(true);
        }
    }, [searchParams]);

    // Charger les entrées
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

    const handleOpenForm = () => {
        setFormOpen(true);
        router.push('/journal?new=true', { scroll: false });
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        router.push('/journal', { scroll: false });
    };

    const handleSubmit = async (data: JournalEntryFormData) => {
        const supabase = getSupabaseClient();

        const { error } = await supabase
            .from('journal_entries')
            .insert({
                trip_id: data.trip_id,
                entry_date: data.entry_date,
                location: data.location || null,
                lat: data.lat || null,
                lng: data.lng || null,
                mood: data.mood || null,
                content: data.content,
                content_source: data.content_source || 'typed',
                tags: data.tags || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }

        // Recharger la liste
        await loadEntries();
    };

    return (
        <Box>
            <PageHeader
                title="Journal de voyage"
                subtitle="Toutes vos entrées de journal"
                action={{
                    label: 'Nouvelle entrée',
                    icon: <AddIcon />,
                    onClick: handleOpenForm,
                }}
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
                ) : (
                    <JournalList entries={entries} onRefresh={loadEntries} />
                )}
            </Container>

            {/* Formulaire de création */}
            <JournalForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
            />
        </Box>
    );
}

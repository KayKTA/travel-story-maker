'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Skeleton,
    Stack,
    Fab,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    PhotoCamera as PhotoIcon,
    Videocam as VideoIcon,
    ChevronLeft as BackIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatDateRange } from '@/lib/utils/formatters';
import TripTabs from './TripTabs';
import JournalForm from '@/components/journal/JournalForm';
import type { Trip, JournalEntry, MediaAsset, Expense, Story, JournalEntryFormData } from '@/types';

interface JournalEntryWithMedia extends JournalEntry {
    media_assets: MediaAsset[];
}

interface TripDetailClientProps {
    tripId: string;
}

export default function TripDetailClient({ tripId }: TripDetailClientProps) {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [entries, setEntries] = useState<JournalEntryWithMedia[]>([]);
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [journalFormOpen, setJournalFormOpen] = useState(false);

    const loadData = async () => {
        const supabase = getSupabaseClient();

        // Load trip
        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single();

        setTrip(tripData);

        // Load journal entries
        const { data: entriesData } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('trip_id', tripId)
            .order('entry_date', { ascending: false });

        // Load all media for this trip
        const { data: mediaData } = await supabase
            .from('media_assets')
            .select('*')
            .eq('trip_id', tripId)
            .order('taken_at', { ascending: false });

        setMedia(mediaData || []);

        // Load media for each entry
        const entriesWithMedia: JournalEntryWithMedia[] = (entriesData || []).map((entry) => ({
            ...entry,
            media_assets: (mediaData || []).filter((m) => m.journal_entry_id === entry.id),
        }));

        setEntries(entriesWithMedia);

        // Load expenses
        const { data: expensesData } = await supabase
            .from('expenses')
            .select('*')
            .eq('trip_id', tripId)
            .order('expense_date', { ascending: false });

        setExpenses(expensesData || []);

        // Load stories
        const { data: storiesData } = await supabase
            .from('stories')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false });

        setStories(storiesData || []);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [tripId]);

    const handleJournalSubmit = async (data: JournalEntryFormData, mediaAssetIds?: string[]) => {
        await loadData();
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={50} sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={200} />
                    ))}
                </Stack>
            </Box>
        );
    }

    if (!trip) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Voyage non trouvé</Typography>
                <Button component={Link} href="/trips" sx={{ mt: 2 }}>
                    Retour aux voyages
                </Button>
            </Box>
        );
    }

    // Calculate stats
    const photoCount = media.filter((m) => m.media_type === 'photo').length;
    const videoCount = media.filter((m) => m.media_type === 'video').length;
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const stats = {
        journalCount: entries.length,
        photosCount: photoCount,
        videosCount: videoCount,
        totalExpenses,
        storiesCount: stories.length,
    };

    const tripName = `${trip.country}${trip.city ? ` - ${trip.city}` : ''}`;

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 3,
                    pb: 4,
                    borderRadius: { xs: 0, sm: '0 0 24px 24px' },
                    position: 'relative',
                }}
            >
                <Button
                    component={Link}
                    href="/trips"
                    startIcon={<BackIcon />}
                    sx={{ color: 'white', mb: 2, ml: -1 }}
                >
                    Voyages
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {trip.country}
                        </Typography>
                        {trip.city && (
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                                {trip.city}
                            </Typography>
                        )}
                    </Box>

                    {/* New Entry Button in Header */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setJournalFormOpen(true)}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'grey.100',
                            },
                        }}
                    >
                        Nouvelle entrée
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<CalendarIcon />}
                        label={formatDateRange(trip.start_date, trip.end_date)}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    {photoCount > 0 && (
                        <Chip
                            icon={<PhotoIcon />}
                            label={photoCount}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                    )}
                    {videoCount > 0 && (
                        <Chip
                            icon={<VideoIcon />}
                            label={videoCount}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                    )}
                </Box>
            </Box>

            {/* Tabs Content */}
            <TripTabs
                trip={trip}
                journalEntries={entries}
                media={media}
                expenses={expenses}
                stories={stories}
                stats={stats}
                onRefresh={loadData}
            />

            {/* Journal Form Dialog */}
            <JournalForm
                open={journalFormOpen}
                onClose={() => setJournalFormOpen(false)}
                onSubmit={handleJournalSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            {/* Floating Action Button for mobile */}
            <Fab
                color="primary"
                onClick={() => setJournalFormOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'flex', sm: 'none' },
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

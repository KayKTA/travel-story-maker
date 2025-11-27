'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Skeleton,
    Stack,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useTheme,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import {
    Book as JournalIcon,
    Receipt as ExpenseIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import TripTabs from './TripTabs';
import JournalForm from '@/components/journal/JournalForm';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import TripHeaderBar from './TripHeaderBar';
import type {
    Trip,
    JournalEntry,
    MediaAsset,
    Expense,
    Story,
    JournalEntryFormData,
} from '@/types';

interface JournalEntryWithMedia extends JournalEntry {
    media_assets: MediaAsset[];
}

interface TripDetailClientProps {
    tripId: string;
}

export default function TripDetailClient({ tripId }: TripDetailClientProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [trip, setTrip] = useState<Trip | null>(null);
    const [entries, setEntries] = useState<JournalEntryWithMedia[]>([]);
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [journalFormOpen, setJournalFormOpen] = useState(false);
    const [expenseFormOpen, setExpenseFormOpen] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const loadData = async () => {
        const supabase = getSupabaseClient();

        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single();

        setTrip(tripData);

        const { data: entriesData } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('trip_id', tripId)
            .order('entry_date', { ascending: false });

        const { data: mediaData } = await supabase
            .from('media_assets')
            .select('*')
            .eq('trip_id', tripId)
            .order('taken_at', { ascending: false });

        setMedia(mediaData || []);

        const entriesWithMedia: JournalEntryWithMedia[] = (entriesData || []).map(
            (entry) => ({
                ...entry,
                media_assets: (mediaData || []).filter(
                    (m) => m.journal_entry_id === entry.id,
                ),
            }),
        );

        setEntries(entriesWithMedia);

        const { data: expensesData } = await supabase
            .from('expenses')
            .select('*')
            .eq('trip_id', tripId)
            .order('expense_date', { ascending: false });

        setExpenses(expensesData || []);

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

    const handleJournalSubmit = async (data: JournalEntryFormData) => {
        await loadData();
    };

    const handleExpenseSubmit = async () => {
        await loadData();
    };

    if (loading) {
        return (
            <Box>
                <Box sx={{ bgcolor: 'background.paper', p: 2, pb: 3 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton
                        variant="text"
                        width={150}
                        height={36}
                        sx={{ mt: 2 }}
                    />
                    <Skeleton variant="text" width={100} height={24} />
                </Box>
                <Box sx={{ p: 2 }}>
                    <Skeleton variant="rounded" height={48} sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" height={120} />
                        ))}
                    </Stack>
                </Box>
            </Box>
        );
    }

    if (!trip) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Voyage non trouvé</Typography>
                <IconButton component={Link} href="/trips" sx={{ mt: 2 }}>
                    {/* Back simple */}
                </IconButton>
            </Box>
        );
    }

    const photoCount = media.filter((m) => m.media_type === 'photo').length;
    const videoCount = media.filter((m) => m.media_type === 'video').length;
    const totalExpenses = expenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0,
    );

    const stats = {
        journalCount: entries.length,
        photosCount: photoCount,
        videosCount: videoCount,
        totalExpenses,
        storiesCount: stories.length,
    };

    const tripName = `${trip.country}${trip.city ? ` - ${trip.city}` : ''}`;

    const speedDialActions = [
        {
            icon: <JournalIcon />,
            name: 'Journal',
            onClick: () => setJournalFormOpen(true),
        },
        {
            icon: <ExpenseIcon />,
            name: 'Dépense',
            onClick: () => setExpenseFormOpen(true),
        },
    ];

    return (
        <Box
            sx={{
                pb: { xs: 10, sm: 4 },
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <TripHeaderBar
                trip={trip}
                stats={{ photosCount: photoCount, videosCount: videoCount }}
                onOpenJournal={() => setJournalFormOpen(true)}
                onOpenExpense={() => setExpenseFormOpen(true)}
            />

            <TripTabs
                trip={trip}
                journalEntries={entries}
                media={media}
                expenses={expenses}
                stories={stories}
                stats={stats}
                onRefresh={loadData}
            />

            <JournalForm
                open={journalFormOpen}
                onClose={() => setJournalFormOpen(false)}
                onSubmit={handleJournalSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            <ExpenseForm
                open={expenseFormOpen}
                onClose={() => setExpenseFormOpen(false)}
                onSubmit={handleExpenseSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            {/* Speed Dial mobile */}
            <SpeedDial
                ariaLabel="Actions"
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    display: { xs: 'flex', sm: 'none' },
                }}
                icon={<SpeedDialIcon />}
                open={speedDialOpen}
                onOpen={() => setSpeedDialOpen(true)}
                onClose={() => setSpeedDialOpen(false)}
            >
                {speedDialActions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => {
                            setSpeedDialOpen(false);
                            action.onClick();
                        }}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}

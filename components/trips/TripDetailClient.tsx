'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Skeleton,
    Stack,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    PhotoCamera as PhotoIcon,
    Videocam as VideoIcon,
    ArrowBack as BackIcon,
    Book as JournalIcon,
    Receipt as ExpenseIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatDateRange } from '@/lib/utils/formatters';
import TripTabs from './TripTabs';
import JournalForm from '@/components/journal/JournalForm';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import type { Trip, JournalEntry, MediaAsset, Expense, Story, JournalEntryFormData } from '@/types';

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

        const entriesWithMedia: JournalEntryWithMedia[] = (entriesData || []).map((entry) => ({
            ...entry,
            media_assets: (mediaData || []).filter((m) => m.journal_entry_id === entry.id),
        }));

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

    const handleJournalSubmit = async (data: JournalEntryFormData, mediaAssetIds?: string[]) => {
        await loadData();
    };

    const handleExpenseSubmit = async () => {
        await loadData();
    };

    if (loading) {
        return (
            <Box>
                <Box sx={{ bgcolor: 'primary.main', p: 2, pb: 3 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={150} height={36} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={100} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
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
                    <BackIcon />
                </IconButton>
            </Box>
        );
    }

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

    const speedDialActions = [
        { icon: <JournalIcon />, name: 'Journal', onClick: () => setJournalFormOpen(true) },
        { icon: <ExpenseIcon />, name: 'Dépense', onClick: () => setExpenseFormOpen(true) },
    ];

    return (
        <Box sx={{ pb: { xs: 10, sm: 4 }, minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Compact Mobile Header */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    pt: { xs: 1, sm: 2 },
                    pb: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                {/* Top row: Back + Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <IconButton
                        component={Link}
                        href="/trips"
                        sx={{
                            color: 'white',
                            ml: -1,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        }}
                        size="small"
                    >
                        <BackIcon />
                    </IconButton>

                    {/* Desktop action buttons */}
                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <Chip
                            icon={<JournalIcon sx={{ color: 'primary.main !important' }} />}
                            label="Journal"
                            onClick={() => setJournalFormOpen(true)}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'grey.100' },
                            }}
                        />
                        <Chip
                            icon={<ExpenseIcon sx={{ color: 'white !important' }} />}
                            label="Dépense"
                            onClick={() => setExpenseFormOpen(true)}
                            variant="outlined"
                            sx={{
                                borderColor: 'rgba(255,255,255,0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                            }}
                        />
                    </Stack>
                </Box>

                {/* Title */}
                <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                    {trip.country}
                </Typography>
                {trip.city && (
                    <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{ opacity: 0.9, fontWeight: 400 }}
                    >
                        {trip.city}
                    </Typography>
                )}

                {/* Stats chips */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        mt: 1.5,
                        flexWrap: 'wrap',
                        '& .MuiChip-root': {
                            height: 28,
                            '& .MuiChip-label': { px: 1, fontSize: '0.8rem' },
                            '& .MuiChip-icon': { fontSize: 16 },
                        },
                    }}
                >
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

            {/* Expense Form Dialog */}
            <ExpenseForm
                open={expenseFormOpen}
                onClose={() => setExpenseFormOpen(false)}
                onSubmit={handleExpenseSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            {/* Speed Dial for mobile */}
            <SpeedDial
                ariaLabel="Actions"
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    display: { xs: 'flex', sm: 'none' },
                    '& .MuiSpeedDial-fab': {
                        width: 56,
                        height: 56,
                    },
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

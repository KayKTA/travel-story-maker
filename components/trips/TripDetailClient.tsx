'use client';

import { Box, Container, Typography, Skeleton, Stack, IconButton } from '@mui/material';
import { Book as JournalIcon, Receipt as ExpenseIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useTripData, useMultiDisclosure } from '@/lib/hooks';
import { ActionSpeedDial, type SpeedDialActionItem } from '@/components/common';
import TripTabs from './TripTabs';
import JournalForm from '@/components/journal/JournalForm';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import TripHeaderBar from './TripHeaderBar';

interface TripDetailClientProps {
    tripId: string;
}

// Loading skeleton component
function TripDetailSkeleton() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ bgcolor: 'primary.main', p: 3, pb: 4 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />
                <Skeleton variant="text" width={200} height={40} sx={{ mt: 2, bgcolor: 'rgba(0,0,0,0.1)' }} />
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />
            </Box>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Skeleton variant="rounded" height={48} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={500} />
            </Container>
        </Box>
    );
}

// Error state component
function TripNotFound() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Voyage non trouvé</Typography>
            <IconButton component={Link} href="/trips" sx={{ mt: 2 }}>
                {/* Back */}
            </IconButton>
        </Box>
    );
}

export default function TripDetailClient({ tripId }: TripDetailClientProps) {
    // Data fetching
    const { trip, entries, media, expenses, stories, stats, loading, error, refresh, tripName } =
        useTripData(tripId);

    // Modals/forms state
    const modals = useMultiDisclosure(['journal', 'expense']);

    // Speed dial actions
    const speedDialActions: SpeedDialActionItem[] = [
        {
            icon: <JournalIcon />,
            name: 'Nouvelle étape',
            onClick: () => modals.open('journal'),
        },
        {
            icon: <ExpenseIcon />,
            name: 'Dépense',
            onClick: () => modals.open('expense'),
        },
    ];

    // Handlers
    const handleJournalSubmit = async () => {
        await refresh();
    };

    const handleExpenseSubmit = async () => {
        await refresh();
    };

    // Loading state
    if (loading) {
        return <TripDetailSkeleton />;
    }

    // Error state
    if (error || !trip) {
        return <TripNotFound />;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, sm: 4 } }}>
            {/* Header - Full width */}
            <TripHeaderBar
                trip={trip}
                stats={{ photosCount: stats.photosCount, videosCount: stats.videosCount }}
                onOpenJournal={() => modals.open('journal')}
                onOpenExpense={() => modals.open('expense')}
            />

            {/* Content Contained */}
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                <TripTabs
                    trip={trip}
                    journalEntries={entries}
                    media={media}
                    expenses={expenses}
                    stories={stories}
                    stats={stats}
                    onRefresh={refresh}
                />
            </Container>

            {/* Forms */}
            <JournalForm
                open={modals.isOpen('journal')}
                onClose={() => modals.close('journal')}
                onSubmit={handleJournalSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            <ExpenseForm
                open={modals.isOpen('expense')}
                onClose={() => modals.close('expense')}
                onSubmit={handleExpenseSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            {/* Mobile Speed Dial */}
            <ActionSpeedDial actions={speedDialActions} />
        </Box>
    );
}

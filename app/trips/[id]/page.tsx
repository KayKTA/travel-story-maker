import { notFound } from 'next/navigation';
import { Box } from '@mui/material';
import PageHeader from '@/components/layout/PageHeader';
import TripTabs from '@/components/trips/TripTabs';
import { createClient } from '@/lib/supabase/server';
import { formatDateRange } from '@/lib/utils/formatters';
import type { Trip, JournalEntryWithMedia, Expense, Story, MediaAsset } from '@/types';

interface TripPageProps {
    params: Promise<{ id: string }>;
}

async function getTripData(tripId: string) {
    const supabase = await createClient();

    // Get trip
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

    if (tripError || !trip) {
        return null;
    }

    // Get journal entries with media
    const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('trip_id', tripId)
        .order('entry_date', { ascending: true });

    // Get media for each journal entry
    const journalWithMedia: JournalEntryWithMedia[] = await Promise.all(
        (journalEntries || []).map(async (entry) => {
            const { data: media } = await supabase
                .from('media_assets')
                .select('*')
                .eq('journal_entry_id', entry.id)
                .order('taken_at', { ascending: true });

            return {
                ...entry,
                media_assets: media || [],
            };
        })
    );

    // Get all media for this trip
    const { data: allMedia } = await supabase
        .from('media_assets')
        .select('*')
        .eq('trip_id', tripId)
        .order('taken_at', { ascending: true });

    // Get expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: false });

    // Get stories
    const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

    return {
        trip: trip as Trip,
        journalEntries: journalWithMedia,
        media: (allMedia || []) as MediaAsset[],
        expenses: (expenses || []) as Expense[],
        stories: (stories || []) as Story[],
    };
}

export default async function TripDetailPage({ params }: TripPageProps) {
    const { id } = await params;
    const data = await getTripData(id);

    if (!data) {
        notFound();
    }

    const { trip, journalEntries, media, expenses, stories } = data;

    const stats = {
        journalCount: journalEntries.length,
        photosCount: media.filter((m) => m.media_type === 'photo').length,
        videosCount: media.filter((m) => m.media_type === 'video').length,
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
        storiesCount: stories.length,
    };

    return (
        <Box>
            <PageHeader
                title={`${trip.country}${trip.city ? ` • ${trip.city}` : ''}`}
                subtitle={formatDateRange(trip.start_date, trip.end_date)}
                breadcrumbs={[
                    { label: 'Voyages', href: '/trips' },
                    { label: trip.country },
                ]}
            />

            <TripTabs
                trip={trip}
                journalEntries={journalEntries}
                media={media}
                expenses={expenses}
                stories={stories}
                stats={stats}
            />
        </Box>
    );
}

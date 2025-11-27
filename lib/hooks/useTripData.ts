'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Trip, JournalEntry, MediaAsset, Expense, Story, JournalEntryWithMedia } from '@/types';

interface TripData {
    trip: Trip | null;
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stories: Story[];
}

interface TripStats {
    journalCount: number;
    photosCount: number;
    videosCount: number;
    totalExpenses: number;
    storiesCount: number;
    entriesWithGps: number;
}

interface UseTripDataReturn extends TripData {
    loading: boolean;
    error: string | null;
    stats: TripStats;
    refresh: () => Promise<void>;
    tripName: string;
}

/**
 * Hook for fetching and managing trip data
 * Centralizes all trip-related data fetching logic
 */
export function useTripData(tripId: string): UseTripDataReturn {
    const [data, setData] = useState<TripData>({
        trip: null,
        entries: [],
        media: [],
        expenses: [],
        stories: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const supabase = getSupabaseClient();

            // Fetch trip
            const { data: tripData, error: tripError } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single();

            if (tripError) throw new Error('Voyage non trouvé');

            // Fetch journal entries
            const { data: entriesData } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('trip_id', tripId)
                .order('entry_date', { ascending: false });

            // Fetch media
            const { data: mediaData } = await supabase
                .from('media_assets')
                .select('*')
                .eq('trip_id', tripId)
                .order('taken_at', { ascending: false });

            // Map media to entries
            const entriesWithMedia: JournalEntryWithMedia[] = (entriesData || []).map(
                (entry) => ({
                    ...entry,
                    media_assets: (mediaData || []).filter(
                        (m) => m.journal_entry_id === entry.id
                    ),
                })
            );

            // Fetch expenses
            const { data: expensesData } = await supabase
                .from('expenses')
                .select('*')
                .eq('trip_id', tripId)
                .order('expense_date', { ascending: false });

            // Fetch stories
            const { data: storiesData } = await supabase
                .from('stories')
                .select('*')
                .eq('trip_id', tripId)
                .order('created_at', { ascending: false });

            setData({
                trip: tripData,
                entries: entriesWithMedia,
                media: mediaData || [],
                expenses: expensesData || [],
                stories: storiesData || [],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Computed stats
    const stats = useMemo<TripStats>(() => {
        const photos = data.media.filter((m) => m.media_type === 'photo');
        const videos = data.media.filter((m) => m.media_type === 'video');
        const entriesWithGps = data.entries.filter((e) => e.lat && e.lng);

        return {
            journalCount: data.entries.length,
            photosCount: photos.length,
            videosCount: videos.length,
            totalExpenses: data.expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
            storiesCount: data.stories.length,
            entriesWithGps: entriesWithGps.length,
        };
    }, [data]);

    // Trip name helper
    const tripName = useMemo(() => {
        if (!data.trip) return '';
        return `${data.trip.country}${data.trip.city ? ` - ${data.trip.city}` : ''}`;
    }, [data.trip]);

    return {
        ...data,
        loading,
        error,
        stats,
        refresh: fetchData,
        tripName,
    };
}

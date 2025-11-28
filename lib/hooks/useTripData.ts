'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type {
    Trip,
    JournalEntryWithMedia,
    MediaAsset,
    Expense,
    Story,
} from '@/types';

interface TripStats {
    journalCount: number;
    photosCount: number;
    videosCount: number;
    totalExpenses: number;
    storiesCount: number;
    entriesWithGps: number;
}

interface UseTripDataReturn {
    trip: Trip | null;
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stories: Story[];
    loading: boolean;
    error: string | null;
    stats: TripStats;
    refresh: () => Promise<void>;
    tripName: string;
}

/**
 * Hook for fetching all trip-related data
 */
export function useTripData(tripId: string): UseTripDataReturn {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [entries, setEntries] = useState<JournalEntryWithMedia[]>([]);
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!tripId) return;

        setLoading(true);
        setError(null);

        try {
            const supabase = getSupabaseClient();

            // Fetch all data in parallel
            const [tripResult, entriesResult, mediaResult, expensesResult, storiesResult] =
                await Promise.all([
                    supabase.from('trips').select('*').eq('id', tripId).single(),
                    supabase
                        .from('journal_entries')
                        .select('*, media_assets(*)')
                        .eq('trip_id', tripId)
                        .order('entry_date', { ascending: true }),
                    supabase
                        .from('media_assets')
                        .select('*')
                        .eq('trip_id', tripId)
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('expenses')
                        .select('*')
                        .eq('trip_id', tripId)
                        .order('expense_date', { ascending: false }),
                    supabase
                        .from('stories')
                        .select('*')
                        .eq('trip_id', tripId)
                        .order('created_at', { ascending: false }),
                ]);

            if (tripResult.error) throw tripResult.error;

            setTrip(tripResult.data);
            setEntries(entriesResult.data || []);
            setMedia(mediaResult.data || []);
            setExpenses(
                (expensesResult.data || []).map((e) => ({
                    ...e,
                    date: e.expense_date,
                }))
            );
            setStories(storiesResult.data || []);
        } catch (err) {
            console.error('Error fetching trip data:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Computed stats
    const stats = useMemo<TripStats>(() => {
        const photosCount = media.filter((m) => m.media_type === 'photo').length;
        const videosCount = media.filter((m) => m.media_type === 'video').length;
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const entriesWithGps = entries.filter((e) => e.lat && e.lng).length;

        return {
            journalCount: entries.length,
            photosCount,
            videosCount,
            totalExpenses,
            storiesCount: stories.length,
            entriesWithGps,
        };
    }, [entries, media, expenses, stories]);

    // Formatted trip name
    const tripName = useMemo(() => {
        if (!trip) return '';
        return trip.city ? `${trip.country} - ${trip.city}` : trip.country;
    }, [trip]);

    return {
        trip,
        entries,
        media,
        expenses,
        stories,
        loading,
        error,
        stats,
        refresh: fetchData,
        tripName,
    };
}

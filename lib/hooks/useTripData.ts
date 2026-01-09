'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '@/lib/api/client';
import type {
    Trip,
    JournalEntryWithMedia,
    MediaAsset,
    Expense,
    Story,
    TripStats,
} from '@/types';

interface TripDataResponse {
    trip: Trip;
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stories?: Story[];
}

// API function
async function fetchTripData(tripId: string): Promise<TripDataResponse> {
    return apiClient<TripDataResponse>(
        `/api/trips/${tripId}?include=entries,media,expenses,stories`
    );
}

/**
 * Hook for fetching all trip-related data
 */
export function useTripData(tripId: string) {
    const query = useQuery({
        queryKey: ['trip-data', tripId],
        queryFn: () => fetchTripData(tripId),
        enabled: !!tripId,
    });

    // Compute stats from the data
    const stats: TripStats = useMemo(() => {
        if (!query.data) {
            return {
                journalCount: 0,
                photosCount: 0,
                videosCount: 0,
                totalExpenses: 0,
                storiesCount: 0,
                entriesWithGps: 0,
            };
        }

        const { entries, media, expenses, stories } = query.data;

        const photosCount = media.filter((m) => m.media_type === 'photo').length;
        const videosCount = media.filter((m) => m.media_type === 'video').length;
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const entriesWithGps = entries.filter((e) => e.lat && e.lng).length;

        return {
            journalCount: entries.length,
            photosCount,
            videosCount,
            totalExpenses,
            storiesCount: stories?.length || 0,
            entriesWithGps,
        };
    }, [query.data]);

    // Compute trip name
    const tripName = useMemo(() => {
        if (!query.data?.trip) return '';
        const trip = query.data.trip;
        return trip.city ? `${trip.country} - ${trip.city}` : trip.country;
    }, [query.data]);

    return {
        trip: query.data?.trip || null,
        entries: query.data?.entries || [],
        media: query.data?.media || [],
        expenses: query.data?.expenses || [],
        stories: query.data?.stories || [],
        loading: query.isLoading,
        error: query.error ? 'Erreur lors du chargement des données' : null,
        stats,
        refresh: query.refetch,
        tripName,
    };
}

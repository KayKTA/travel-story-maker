'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TripWithStats, TripFormData } from '@/types';

interface UseTripsReturn {
    trips: TripWithStats[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createTrip: (data: TripFormData) => Promise<void>;
}

/**
 * Hook for fetching and managing trips list with stats
 */
export function useTrips(): UseTripsReturn {
    const [trips, setTrips] = useState<TripWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const supabase = getSupabaseClient();

            const { data: tripsData, error: tripsError } = await supabase
                .from('trips')
                .select('*')
                .order('start_date', { ascending: false });

            if (tripsError) throw tripsError;

            // Fetch stats for each trip in parallel
            const tripsWithStats = await Promise.all(
                (tripsData || []).map(async (trip) => {
                    const [journalResult, mediaResult, expensesResult, storiesResult] =
                        await Promise.all([
                            supabase
                                .from('journal_entries')
                                .select('*', { count: 'exact', head: true })
                                .eq('trip_id', trip.id),
                            supabase
                                .from('media_assets')
                                .select('media_type')
                                .eq('trip_id', trip.id),
                            supabase.from('expenses').select('amount').eq('trip_id', trip.id),
                            supabase
                                .from('stories')
                                .select('*', { count: 'exact', head: true })
                                .eq('trip_id', trip.id),
                        ]);

                    const mediaData = mediaResult.data || [];
                    const expensesData = expensesResult.data || [];

                    const photosCount = mediaData.filter(
                        (m) => m.media_type === 'photo'
                    ).length;
                    const videosCount = mediaData.filter(
                        (m) => m.media_type === 'video'
                    ).length;
                    const totalExpenses = expensesData.reduce(
                        (sum, e) => sum + (e.amount || 0),
                        0
                    );

                    // Calculate duration
                    const startDate = new Date(trip.start_date);
                    const endDate = trip.end_date ? new Date(trip.end_date) : new Date();
                    const durationDays =
                        Math.ceil(
                            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                        ) + 1;

                    return {
                        ...trip,
                        journal_entries_count: journalResult.count || 0,
                        media_count: mediaData.length,
                        photos_count: photosCount,
                        videos_count: videosCount,
                        total_expenses: totalExpenses,
                        expenses_count: expensesData.length,
                        stories_count: storiesResult.count || 0,
                        duration_days: durationDays,
                    } as TripWithStats;
                })
            );

            setTrips(tripsWithStats);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError('Erreur lors du chargement des voyages');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrip = useCallback(
        async (data: TripFormData) => {
            const supabase = getSupabaseClient();

            const { error } = await supabase.from('trips').insert({
                country: data.country,
                city: data.city || null,
                start_date: data.start_date,
                end_date: data.end_date || null,
                mood: data.mood || null,
                lat: data.lat || null,
                lng: data.lng || null,
                cover_image_url: data.cover_image_url || null,
                description: data.description || null,
            });

            if (error) throw error;

            await fetchTrips();
        },
        [fetchTrips]
    );

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    return {
        trips,
        loading,
        error,
        refresh: fetchTrips,
        createTrip,
    };
}

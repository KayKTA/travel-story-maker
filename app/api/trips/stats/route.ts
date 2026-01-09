import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/trips/stats - Récupère les statistiques pour un ou tous les trips
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const tripId = searchParams.get('trip_id');

        if (tripId) {
            // Stats pour un seul trip
            const stats = await fetchTripStats(supabase, tripId);
            if (!stats) {
                return NextResponse.json(
                    {
                        success: false,
                        error: { code: 'NOT_FOUND', message: 'Trip not found' },
                    },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: stats });
        } else {
            // Stats pour tous les trips
            const { data: trips, error: tripsError } = await supabase
                .from('trips')
                .select('id, start_date, end_date')
                .order('start_date', { ascending: false });

            if (tripsError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: { code: 'DB_ERROR', message: tripsError.message },
                    },
                    { status: 500 }
                );
            }

            const statsPromises = (trips || []).map((trip) =>
                fetchTripStats(supabase, trip.id)
            );
            const allStats = await Promise.all(statsPromises);

            return NextResponse.json({ success: true, data: allStats.filter(Boolean) });
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'SERVER_ERROR', message: 'Internal server error' },
            },
            { status: 500 }
        );
    }
}

async function fetchTripStats(supabase: any, tripId: string) {
    try {
        const [tripResult, journalResult, mediaResult, expensesResult, storiesResult] =
            await Promise.all([
                supabase.from('trips').select('*').eq('id', tripId).single(),
                supabase
                    .from('journal_entries')
                    .select('*', { count: 'exact', head: true })
                    .eq('trip_id', tripId),
                supabase.from('media_assets').select('media_type').eq('trip_id', tripId),
                supabase.from('expenses').select('amount').eq('trip_id', tripId),
                supabase
                    .from('stories')
                    .select('*', { count: 'exact', head: true })
                    .eq('trip_id', tripId),
            ]);

        if (tripResult.error) {
            console.error('Error fetching trip:', tripResult.error);
            return null;
        }

        const trip = tripResult.data;
        const mediaData = mediaResult.data || [];
        const expensesData = expensesResult.data || [];

        const photosCount = mediaData.filter((m: any) => m.media_type === 'photo').length;
        const videosCount = mediaData.filter((m: any) => m.media_type === 'video').length;
        const totalExpenses = expensesData.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

        // Calculate duration
        const startDate = new Date(trip.start_date);
        const endDate = trip.end_date ? new Date(trip.end_date) : new Date();
        const durationDays =
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

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
        };
    } catch (error) {
        console.error('Error fetching trip stats:', error);
        return null;
    }
}

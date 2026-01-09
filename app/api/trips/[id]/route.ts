import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/trips/[id] - Récupère un trip avec toutes ses données relationnelles
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Parse include parameter (comma-separated list)
        const includeParam = searchParams.get('include') || '';
        const include = includeParam.split(',').filter(Boolean);

        // Always fetch the trip
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .select('*')
            .eq('id', id)
            .single();

        if (tripError || !trip) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Trip not found' },
                },
                { status: 404 }
            );
        }

        const result: any = { trip };

        // Fetch related data based on include parameter
        const promises: PromiseLike<any>[] = [];
        const keys: string[] = [];

        if (include.includes('entries') || include.length === 0) {
            keys.push('entries');
            promises.push(
                supabase
                    .from('journal_entries')
                    .select('*, media_assets(*)')
                    .eq('trip_id', id)
                    .order('entry_date', { ascending: true })
                    .then((res) => res.data || [])
            );
        }

        if (include.includes('media') || include.length === 0) {
            keys.push('media');
            promises.push(
                supabase
                    .from('media_assets')
                    .select('*')
                    .eq('trip_id', id)
                    .order('created_at', { ascending: false })
                    .then((res) => res.data || [])
            );
        }

        if (include.includes('expenses') || include.length === 0) {
            keys.push('expenses');
            promises.push(
                supabase
                    .from('expenses')
                    .select('*')
                    .eq('trip_id', id)
                    .order('expense_date', { ascending: false })
                    .then((res) => res.data || [])
            );
        }

        if (include.includes('stories')) {
            keys.push('stories');
            promises.push(
                supabase
                    .from('stories')
                    .select('*')
                    .eq('trip_id', id)
                    .order('created_at', { ascending: false })
                    .then((res) => res.data || [])
            );
        }

        // Execute all queries in parallel
        const results = await Promise.all(promises);

        // Map results to keys
        keys.forEach((key, index) => {
            result[key] = results[index];
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching trip data:', error);
        return NextResponse.json(
            {
                success: false,
                error: { code: 'SERVER_ERROR', message: 'Internal server error' },
            },
            { status: 500 }
        );
    }
}

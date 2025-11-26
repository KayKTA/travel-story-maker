import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TripFormData } from '@/types';

// GET /api/trips - Liste tous les voyages
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        const country = searchParams.get('country');
        const year = searchParams.get('year');

        let query = supabase
            .from('trips')
            .select('*')
            .order('start_date', { ascending: false });

        if (country) {
            query = query.eq('country', country);
        }

        if (year) {
            query = query
                .gte('start_date', `${year}-01-01`)
                .lte('start_date', `${year}-12-31`);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json(
                { success: false, error: { code: 'DB_ERROR', message: error.message } },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

// POST /api/trips - Crée un nouveau voyage
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body: TripFormData = await request.json();

        const { data, error } = await supabase
            .from('trips')
            .insert({
                country: body.country,
                city: body.city || null,
                start_date: body.start_date,
                end_date: body.end_date || null,
                mood: body.mood || null,
                lat: body.lat || null,
                lng: body.lng || null,
                cover_image_url: body.cover_image_url || null,
                description: body.description || null,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, error: { code: 'DB_ERROR', message: error.message } },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

// PUT /api/trips - Met à jour un voyage (avec id dans le body)
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'ID is required' } },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('trips')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, error: { code: 'DB_ERROR', message: error.message } },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

// DELETE /api/trips - Supprime un voyage (avec id en query param)
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'ID is required' } },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('trips')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json(
                { success: false, error: { code: 'DB_ERROR', message: error.message } },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

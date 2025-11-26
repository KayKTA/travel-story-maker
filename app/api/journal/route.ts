import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { JournalEntryFormData } from '@/types';

// GET /api/journal - Liste les entrées de journal
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        const tripId = searchParams.get('trip_id');
        const mood = searchParams.get('mood');
        const dateFrom = searchParams.get('date_from');
        const dateTo = searchParams.get('date_to');

        let query = supabase
            .from('journal_entries')
            .select('*, trips:trip_id(id, country, city)')
            .order('entry_date', { ascending: false });

        if (tripId) {
            query = query.eq('trip_id', tripId);
        }

        if (mood) {
            query = query.eq('mood', mood);
        }

        if (dateFrom) {
            query = query.gte('entry_date', dateFrom);
        }

        if (dateTo) {
            query = query.lte('entry_date', dateTo);
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

// POST /api/journal - Crée une nouvelle entrée
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body: JournalEntryFormData = await request.json();

        const { data, error } = await supabase
            .from('journal_entries')
            .insert({
                trip_id: body.trip_id,
                entry_date: body.entry_date,
                location: body.location || null,
                lat: body.lat || null,
                lng: body.lng || null,
                mood: body.mood || null,
                content: body.content,
                content_source: body.content_source || 'typed',
                tags: body.tags || null,
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

// PUT /api/journal - Met à jour une entrée
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
            .from('journal_entries')
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

// DELETE /api/journal - Supprime une entrée
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
            .from('journal_entries')
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

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/media - Liste les médias
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        const tripId = searchParams.get('trip_id');
        const journalEntryId = searchParams.get('journal_entry_id');
        const mediaType = searchParams.get('media_type');
        const hasLocation = searchParams.get('has_location');

        let query = supabase
            .from('media_assets')
            .select('*')
            .order('taken_at', { ascending: false });

        if (tripId) {
            query = query.eq('trip_id', tripId);
        }

        if (journalEntryId) {
            query = query.eq('journal_entry_id', journalEntryId);
        }

        if (mediaType) {
            query = query.eq('media_type', mediaType);
        }

        if (hasLocation === 'true') {
            query = query.not('lat', 'is', null).not('lng', 'is', null);
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

// POST /api/media - Crée un nouveau média
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('media_assets')
            .insert({
                trip_id: body.trip_id,
                journal_entry_id: body.journal_entry_id || null,
                media_type: body.media_type,
                url: body.url,
                thumbnail_url: body.thumbnail_url || null,
                caption: body.caption || null,
                taken_at: body.taken_at || null,
                lat: body.lat || null,
                lng: body.lng || null,
                exif: body.exif || null,
                duration_seconds: body.duration_seconds || null,
                file_size_bytes: body.file_size_bytes || null,
                width: body.width || null,
                height: body.height || null,
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

// PUT /api/media - Met à jour un média
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
            .from('media_assets')
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

// DELETE /api/media - Supprime un média
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

        // TODO: Also delete file from Supabase Storage

        const { error } = await supabase
            .from('media_assets')
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

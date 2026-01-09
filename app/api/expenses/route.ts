import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ExpenseFormData } from '@/types/expense';

// GET /api/expenses - Liste toutes les dépenses
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        const tripId = searchParams.get('trip_id');
        const category = searchParams.get('category');
        const dateFrom = searchParams.get('date_from');
        const dateTo = searchParams.get('date_to');

        let query = supabase
            .from('expenses')
            .select('*')
            .order('expense_date', { ascending: false });

        if (tripId) {
            query = query.eq('trip_id', tripId);
        }

        if (category) {
            query = query.eq('category', category);
        }

        if (dateFrom) {
            query = query.gte('expense_date', dateFrom);
        }

        if (dateTo) {
            query = query.lte('expense_date', dateTo);
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

// POST /api/expenses - Crée une nouvelle dépense
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body: ExpenseFormData = await request.json();

        const { data, error } = await supabase
            .from('expenses')
            .insert({
                trip_id: body.trip_id,
                expense_date: body.date,
                amount: body.amount,
                currency: body.currency || 'EUR',
                category: body.category,
                label: body.label || null,
                receipt_image_url: body.receipt_image_url || null,
                notes: body.notes || null,
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

// PUT /api/expenses - Met à jour une dépense
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
            .from('expenses')
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

// DELETE /api/expenses - Supprime une dépense
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
            .from('expenses')
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

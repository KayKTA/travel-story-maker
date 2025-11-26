'use client';

import { useState } from 'react';
import { Stack } from '@mui/material';
import JournalEntryCard from './JournalEntryCard';
import JournalForm from './JournalForm';
import EmptyState from '@/components/common/EmptyState';
import { Book as BookIcon } from '@mui/icons-material';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { JournalEntryWithMedia, JournalEntryFormData } from '@/types';

interface JournalListProps {
    entries: JournalEntryWithMedia[];
    tripId?: string;
    onRefresh?: () => void;
}

export default function JournalList({ entries, tripId, onRefresh }: JournalListProps) {
    const [formOpen, setFormOpen] = useState(false);

    const handleSubmit = async (data: JournalEntryFormData) => {
        const supabase = getSupabaseClient();

        const { error } = await supabase
            .from('journal_entries')
            .insert({
                trip_id: data.trip_id,
                entry_date: data.entry_date,
                location: data.location || null,
                lat: data.lat || null,
                lng: data.lng || null,
                mood: data.mood || null,
                content: data.content,
                content_source: data.content_source || 'typed',
                tags: data.tags || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }

        // Recharger la liste
        onRefresh?.();
    };

    if (entries.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<BookIcon sx={{ fontSize: 64 }} />}
                    title="Aucune entrée de journal"
                    description="Commencez à documenter votre voyage en créant votre première entrée."
                    actionLabel="Créer une entrée"
                    onAction={() => setFormOpen(true)}
                />

                <JournalForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={handleSubmit}
                    tripId={tripId}
                />
            </>
        );
    }

    return (
        <Stack spacing={2}>
            {entries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
        </Stack>
    );
}

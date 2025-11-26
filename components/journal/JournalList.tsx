'use client';

import { useState } from 'react';
import { Stack, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import JournalEntryCard from './JournalEntryCard';
import JournalForm from './JournalForm';
import EmptyState from '@/components/common/EmptyState';
import { Book as BookIcon } from '@mui/icons-material';
import type { JournalEntryWithMedia, JournalEntryFormData } from '@/types';

interface JournalListProps {
    entries: JournalEntryWithMedia[];
    tripId?: string;
}

export default function JournalList({ entries, tripId }: JournalListProps) {
    const [formOpen, setFormOpen] = useState(false);

    const handleSubmit = async (data: JournalEntryFormData) => {
        // TODO: Implement with server action
        console.log('Submit journal entry:', data);
        // await createJournalEntry(data);
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
        <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setFormOpen(true)}
                >
                    Nouvelle entrée
                </Button>
            </Box>

            <Stack spacing={2}>
                {entries.map((entry) => (
                    <JournalEntryCard key={entry.id} entry={entry} />
                ))}
            </Stack>

            <JournalForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleSubmit}
                tripId={tripId}
            />
        </>
    );
}

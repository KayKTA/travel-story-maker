'use client';

import { Stack, Typography, Box, Paper } from '@mui/material';
import JournalEntryCard from './JournalEntryCard';
import { Book as BookIcon } from '@mui/icons-material';
import type { JournalEntryWithMedia } from '@/types';

interface JournalListProps {
    entries: JournalEntryWithMedia[];
    tripId?: string;
    onRefresh?: () => void;
}

export default function JournalList({ entries, tripId, onRefresh }: JournalListProps) {
    if (entries.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <BookIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Aucune entrée de journal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Utilisez le bouton "Nouvelle entrée" pour commencer à documenter votre voyage.
                </Typography>
            </Paper>
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

'use client';

import { Box, Typography } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { tokens, scrollable } from '@/styles';
import TimelineEntryCard from './TimelineEntryCard';
import type { JournalEntryWithMedia } from '@/types';

interface TimelineProps {
    entries: JournalEntryWithMedia[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    setRef?: (id: string) => (el: HTMLDivElement | null) => void;
}

export default function Timeline({
    entries,
    selectedId,
    onSelect,
    setRef,
}: TimelineProps) {
    if (entries.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
                <LocationIcon
                    sx={{ fontSize: 56, color: 'action.disabled', mb: 2 }}
                />
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: tokens.fontWeights.semibold, mb: 1 }}
                >
                    Aucune étape avec coordonnées
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ajoutez des photos avec GPS ou renseignez manuellement les lieux.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100%',
                ...scrollable,
            }}
        >
            {entries.map((entry, index) => {
                const isSelected = selectedId === entry.id;
                const isFirst = index === 0;
                const isLast = index === entries.length - 1;

                return (
                    <Box
                        key={entry.id}
                        ref={setRef?.(entry.id)}
                    >
                        <TimelineEntryCard
                            entry={entry}
                            index={index + 1}
                            isSelected={isSelected}
                            isFirst={isFirst}
                            isLast={isLast}
                            onClick={() => onSelect(entry.id)}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}

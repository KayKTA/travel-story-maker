'use client';

import { Box, Typography } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { JOURNAL_MOODS } from '@/types/journal';
import { tokens, scrollable } from '@/styles';
import { TimelineDot } from '@/components/common';
import TimelineEntryCard from './TimelineEntryCard';
import type { JournalEntryWithMedia } from '@/types';

interface TimelineProps {
    entries: JournalEntryWithMedia[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    setRef?: (id: string) => (el: HTMLDivElement | null) => void;
}

// Timeline dot size constants
const DOT_SIZE = 24;
const DOT_OFFSET = (DOT_SIZE / 2);

export default function Timeline({
    entries,
    selectedId,
    onSelect,
    setRef,
}: TimelineProps) {
    if (entries.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <LocationIcon
                    sx={{ fontSize: tokens.iconSizes.xl, opacity: 0.3, mb: 2 }}
                />
                <Typography
                    color="text.secondary"
                    sx={{ fontWeight: tokens.fontWeights.semibold }}
                >
                    Aucune entrée avec coordonnées
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
                px: 2,
                py: 2,
                ...scrollable,
            }}
        >
            <Box sx={{ position: 'relative', pl: 4 }}>
                {/* Timeline vertical line */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: DOT_OFFSET - 1,
                        top: DOT_OFFSET,
                        bottom: DOT_OFFSET,
                        width: 2,
                        bgcolor: 'divider',
                    }}
                />

                {/* Entries */}
                {entries.map((entry, index) => {
                    const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
                    const isSelected = selectedId === entry.id;
                    const isLast = index === entries.length - 1;

                    return (
                        <Box
                            key={entry.id}
                            ref={setRef?.(entry.id)}
                            sx={{
                                position: 'relative',
                                pb: isLast ? 0 : 2,
                            }}
                        >
                            {/* Timeline dot - positioned to align with card top */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: -4 - DOT_OFFSET,
                                    top: 55, // Align with card content
                                    zIndex: 2,
                                }}
                            >
                                <TimelineDot
                                    index={index + 1}
                                    color={moodData?.color}
                                    isSelected={isSelected}
                                    size="md"
                                />
                            </Box>

                            {/* Entry card */}
                            <TimelineEntryCard
                                entry={entry}
                                isSelected={isSelected}
                                onClick={() => onSelect(entry.id)}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

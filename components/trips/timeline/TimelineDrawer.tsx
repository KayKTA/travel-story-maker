'use client';

import { Box, Drawer, IconButton, Typography, Chip } from '@mui/material';
import { ExpandMore as ExpandIcon } from '@mui/icons-material';
import { tokens, flexBetween } from '@/styles';
import { DrawerHandle } from '@/components/common';
import Timeline from './Timeline';
import type { JournalEntryWithMedia } from '@/types';

interface TimelineDrawerProps {
    open: boolean;
    onClose: () => void;
    entries: JournalEntryWithMedia[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    setRef?: (id: string) => (el: HTMLDivElement | null) => void;
}

export default function TimelineDrawer({
    open,
    onClose,
    entries,
    selectedId,
    onSelect,
    setRef,
}: TimelineDrawerProps) {
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    height: '75vh',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    bgcolor: 'background.paper',
                },
            }}
        >
            <DrawerHandle />

            {/* Header */}
            <Box
                sx={{
                    px: 2.5,
                    pb: 2,
                    ...flexBetween,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: tokens.fontWeights.bold }}>
                        Étapes
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {entries.length} lieu{entries.length > 1 ? 'x' : ''} visité{entries.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ bgcolor: 'action.hover' }}>
                    <ExpandIcon />
                </IconButton>
            </Box>

            <Timeline
                entries={entries}
                selectedId={selectedId}
                onSelect={onSelect}
                setRef={setRef}
            />
        </Drawer>
    );
}

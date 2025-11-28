'use client';

import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { ExpandMore as ExpandIcon } from '@mui/icons-material';
import { tokens } from '@/styles';
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
                    height: '70vh',
                    borderTopLeftRadius: tokens.components.drawer.borderRadius,
                    borderTopRightRadius: tokens.components.drawer.borderRadius,
                    bgcolor: 'background.default',
                },
            }}
        >
            <DrawerHandle />

            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: tokens.fontWeights.bold }}>
                    Itinéraire
                </Typography>
                <IconButton onClick={onClose}>
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

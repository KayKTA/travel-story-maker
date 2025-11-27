'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import type { JournalEntry, MediaAsset } from '@/types';

// Dynamic import to avoid SSR issues with Leaflet
const TripMap = dynamic(() => import('./TripMap'), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 2,
            }}
        >
            <CircularProgress />
        </Box>
    ),
});

interface TripMapWrapperProps {
    journalEntries: JournalEntry[];
    media?: MediaAsset[];
    tripLat?: number | null;
    tripLng?: number | null;
}

export default function TripMapWrapper(props: TripMapWrapperProps) {
    return <TripMap {...props} />;
}

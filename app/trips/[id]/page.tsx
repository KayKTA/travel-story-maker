import { Suspense } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import TripDetailClient from '@/components/trips/TripDetailClient';

interface TripPageProps {
    params: Promise<{ id: string }>;
}

function TripDetailLoading() {
    return (
        <Box>
            <Box sx={{ bgcolor: 'primary.main', p: 3, pb: 4, mb: -2 }}>
                <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)', mt: 2 }} />
                <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            </Box>
            <Box sx={{ p: 3, pt: 5 }}>
                <Skeleton variant="rounded" height={50} sx={{ mb: 3 }} />
                <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={180} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default async function TripDetailPage({ params }: TripPageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<TripDetailLoading />}>
            <TripDetailClient tripId={id} />
        </Suspense>
    );
}

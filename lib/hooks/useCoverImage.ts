'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

interface CoverImageUploadParams {
    file: File;
    tripId: string;
}

async function uploadCoverImage({
    file,
    tripId,
}: CoverImageUploadParams): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tripId', tripId);

    const response = await fetch('/api/trips/cover-image', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Cover image upload failed');
    }

    const result = await response.json();
    if (result.error) {
        throw new Error(result.error);
    }

    return result.imageUrl;
}

async function deleteCoverImage(tripId: string): Promise<void> {
    const response = await fetch(`/api/trips/cover-image?tripId=${tripId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Cover image deletion failed');
    }

    const result = await response.json();
    if (result.error) {
        throw new Error(result.error);
    }
}

export function useUploadCoverImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadCoverImage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.trips.detail(variables.tripId),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.lists() });
            queryClient.invalidateQueries({
                queryKey: ['trip-data', variables.tripId],
            });
        },
    });
}

export function useDeleteCoverImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCoverImage,
        onSuccess: (_, tripId) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.trips.detail(tripId),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.lists() });
            queryClient.invalidateQueries({
                queryKey: ['trip-data', tripId],
            });
        },
    });
}

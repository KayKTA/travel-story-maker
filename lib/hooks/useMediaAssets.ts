'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from './queryKeys';
import type { MediaAsset } from '@/types/media';

interface MediaAssetCreateData {
    trip_id: string;
    journal_entry_id?: string;
    media_type: 'photo' | 'video';
    file_url: string;
    filename: string;
    lat?: number;
    lng?: number;
    taken_at?: string;
}

// API functions
async function fetchMediaAssets(filters?: Record<string, string>): Promise<MediaAsset[]> {
    const params = new URLSearchParams(filters);
    return apiClient<MediaAsset[]>(`/api/media?${params}`);
}

async function createMediaAssetAPI(data: MediaAssetCreateData): Promise<MediaAsset> {
    return apiClient<MediaAsset>('/api/media', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateMediaAssetAPI(
    id: string,
    data: Partial<MediaAssetCreateData>
): Promise<MediaAsset> {
    return apiClient<MediaAsset>('/api/media', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
    });
}

async function deleteMediaAssetAPI(id: string): Promise<void> {
    return apiClient<void>(`/api/media?id=${id}`, {
        method: 'DELETE',
    });
}

// Query hooks
export function useMediaAssets(filters?: Record<string, string>) {
    return useQuery({
        queryKey: queryKeys.media.list(filters || {}),
        queryFn: () => fetchMediaAssets(filters),
    });
}

// Mutation hooks
export function useCreateMediaAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMediaAssetAPI,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
            if (variables.trip_id) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.trips.detail(variables.trip_id),
                });
                queryClient.invalidateQueries({
                    queryKey: ['trip-data', variables.trip_id],
                });
            }
            if (variables.journal_entry_id) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.journal.detail(variables.journal_entry_id),
                });
            }
        },
    });
}

export function useUpdateMediaAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<MediaAssetCreateData> }) =>
            updateMediaAssetAPI(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
        },
    });
}

export function useDeleteMediaAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMediaAssetAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
        },
    });
}

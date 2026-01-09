'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase/client';
import { queryKeys } from './queryKeys';
import type { MediaAsset } from '@/types/media';

interface MediaUploadParams {
    file: File;
    tripId: string;
    journalEntryId?: string;
}

async function uploadMediaFile({
    file,
    tripId,
    journalEntryId,
}: MediaUploadParams): Promise<MediaAsset> {
    // Step 1: Upload to Supabase Storage
    const supabase = getSupabaseClient();
    const mediaType = file.type.startsWith('image/') ? 'photo' : 'video';
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${tripId}/${mediaType}s/${Date.now()}_${crypto.randomUUID()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file);

    if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(uploadData.path);

    // Step 2: Extract metadata and create DB record via API
    const response = await fetch('/api/media/extract-metada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fileUrl: urlData.publicUrl,
            mediaType,
            tripId,
            journalEntryId,
            filename: uploadData.path,
        }),
    });

    if (!response.ok) {
        throw new Error('Metadata extraction failed');
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Metadata extraction failed');
    }

    return result.data;
}

export function useMediaUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadMediaFile,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.trips.detail(variables.tripId),
            });
            queryClient.invalidateQueries({
                queryKey: ['trip-data', variables.tripId],
            });
            if (variables.journalEntryId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.journal.detail(variables.journalEntryId),
                });
            }
        },
    });
}

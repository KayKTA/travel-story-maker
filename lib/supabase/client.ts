import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Singleton instance for client-side use
let clientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!clientInstance) {
        clientInstance = createClient();
    }
    return clientInstance;
}

// Storage helpers
export const STORAGE_BUCKETS = {
    MEDIA: 'media',
    RECEIPTS: 'receipts',
    REELS: 'reels',
} as const;

export function getPublicUrl(bucket: string, path: string): string {
    const supabase = getSupabaseClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean }
): Promise<{ path: string; error: Error | null }> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            upsert: options?.upsert ?? false,
            contentType: file.type,
        });

    if (error) {
        return { path: '', error: new Error(error.message) };
    }

    return { path: data.path, error: null };
}

export async function deleteFile(
    bucket: string,
    paths: string[]
): Promise<{ error: Error | null }> {
    const supabase = getSupabaseClient();

    const { error } = await supabase.storage
        .from(bucket)
        .remove(paths);

    if (error) {
        return { error: new Error(error.message) };
    }

    return { error: null };
}

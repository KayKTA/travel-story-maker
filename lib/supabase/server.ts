import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Called from a Server Component - can be ignored
                    }
                },
            },
        }
    );
}

// Service role client for admin operations
export async function createServiceClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
        cookies: {
            getAll() {
            return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
                );
            } catch {
                // Called from a Server Component - can be ignored
            }
            },
        },
        }
    );
}

// Storage bucket names
export const STORAGE_BUCKETS = {
    MEDIA: 'media',
    RECEIPTS: 'receipts',
    REELS: 'reels',
} as const;

// Server-side storage helpers
export async function getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
): Promise<string | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) {
        console.error('Error creating signed URL:', error);
        return null;
    }

    return data.signedUrl;
}

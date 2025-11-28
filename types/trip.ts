// ============================================
// Types Trip
// ============================================

export interface Trip {
    id: string;
    country: string;
    city: string | null;
    start_date: string; // ISO date string
    end_date: string | null;
    mood: TripMood | null;
    lat: number | null;
    lng: number | null;
    cover_image_url: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}
export interface TripStats {
    journalCount: number;
    photosCount: number;
    videosCount: number;
    totalExpenses: number;
    storiesCount: number;
    entriesWithGps: number;
}

export interface TripWithStats extends Trip {
    journal_entries_count: number;
    media_count: number;
    photos_count: number;
    videos_count: number;
    total_expenses: number;
    expenses_count: number;
    stories_count: number;
    duration_days: number;
}

export interface TripFormData {
    country: string;
    city?: string;
    start_date: string;
    end_date?: string;
    mood?: TripMood;
    lat?: number;
    lng?: number;
    cover_image_url?: string;
    description?: string;
}

export type TripMood =
    | 'amazing'
    | 'great'
    | 'good'
    | 'mixed'
    | 'challenging'
    | 'difficult';

export const TRIP_MOODS: { value: TripMood; label: string; emoji: string }[] = [
    { value: 'amazing', label: 'Incroyable', emoji: '🤩' },
    { value: 'great', label: 'Super', emoji: '😄' },
    { value: 'good', label: 'Bien', emoji: '🙂' },
    { value: 'mixed', label: 'Mitigé', emoji: '😐' },
    { value: 'challenging', label: 'Difficile', emoji: '😓' },
    { value: 'difficult', label: 'Éprouvant', emoji: '😔' },
];

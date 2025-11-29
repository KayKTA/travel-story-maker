// ============================================
// Types Story (Travel Story)
// ============================================

export interface Story {
    id: string;
    trip_id: string | null;
    type: StoryType;
    prompt: string;
    content: string;
    status: StoryStatus;
    metadata: StoryMetadata | null;
    created_at: string;
    updated_at: string;
}

export interface StoryWithTrip extends Story {
    trip?: {
        id: string;
        country: string;
        city: string | null;
        start_date: string;
        end_date: string | null;
    };
}

export interface StoryFormData {
    trip_id?: string;
    type: StoryType;
    prompt: string;
    options?: StoryGenerationOptions;
}

export type StoryType =
    | 'summary'
    | 'reel_script'
    | 'carousel'
    | 'budget_review'
    | 'highlights'
    | 'tips';

export type StoryStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';

export const STORY_TYPES: {
    value: StoryType;
    label: string;
    description: string;
    emoji: string;
}[] = [
        {
            value: 'summary',
            label: 'Résumé de voyage',
            description: 'Un récit condensé de ton aventure',
            emoji: '📝'
        },
        {
            value: 'reel_script',
            label: 'Script de Reel',
            description: 'Texte et timing pour une vidéo courte',
            emoji: '🎬'
        },
        {
            value: 'carousel',
            label: 'Carrousel Instagram',
            description: 'Textes pour chaque slide d\'un carrousel',
            emoji: '📱'
        },
        {
            value: 'budget_review',
            label: 'Bilan Budget',
            description: 'Analyse détaillée de tes dépenses',
            emoji: '💰'
        },
        {
            value: 'highlights',
            label: 'Moments forts',
            description: 'Les meilleurs moments du voyage',
            emoji: '⭐'
        },
        {
            value: 'tips',
            label: 'Conseils voyageur',
            description: 'Tips et recommandations basés sur ton expérience',
            emoji: '💡'
        },
    ];

export interface StoryMetadata {
    tone?: 'casual' | 'professional' | 'poetic' | 'humorous';
    length?: 'short' | 'medium' | 'long';
    language?: string;
    include_budget?: boolean;
    include_photos?: boolean;
    custom_instructions?: string;
}

export interface StoryGenerationOptions {
    tone?: StoryMetadata['tone'];
    length?: StoryMetadata['length'];
    language?: string;
    include_budget?: boolean;
    include_photos?: boolean;
    custom_instructions?: string;
}

// Contexte envoyé au LLM pour génération
export interface StoryGenerationContext {
    trip: {
        country: string;
        city: string | null;
        start_date: string;
        end_date: string | null;
        mood: string | null;
        duration_days: number;
    };
    journal_entries: {
        date: string;
        location: string | null;
        mood: string | null;
        content: string;
        photos_count: number;
    }[];
    expenses?: {
        total: number;
        currency: string;
        by_category: {
            category: string;
            amount: number;
        }[];
    };
    media_count: {
        photos: number;
        videos: number;
    };
}

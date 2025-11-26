// ============================================
// Types JournalEntry
// ============================================

import { MediaAsset } from './media';

export interface JournalEntry {
    id: string;
    trip_id: string;
    entry_date: string; // ISO date string
    location: string | null;
    lat: number | null;
    lng: number | null;
    mood: JournalMood | null;
    content: string;
    content_source: ContentSource;
    tags: string | null;
    created_at: string;
    updated_at: string;
}

export interface JournalEntryWithMedia extends JournalEntry {
    media_assets?: MediaAsset[];
    trip?: {
        id: string;
        country: string;
        city: string | null;
    };
}

export interface JournalEntryFormData {
    trip_id: string;
    entry_date: string;
    location?: string;
    lat?: number;
    lng?: number;
    mood?: JournalMood;
    content: string;
    content_source?: ContentSource;
    tags?: string;
}

export type ContentSource = 'typed' | 'audio_transcription';

export type JournalMood =
    | 'excited'
    | 'happy'
    | 'tired'
    | 'frustrated'
    | 'sad'
    | 'adventurous'
    | 'inspired'
    | 'chill'
    | 'mixed'
    | 'neutral'
    | 'in_love'
    | 'underwhelmed';

export const JOURNAL_MOODS: { value: JournalMood; label: string; emoji: string }[] = [
    // moods d’origine
    { value: 'excited', label: 'Excité(e)', emoji: '🎉' },
    { value: 'happy', label: 'Heureux(se)', emoji: '😊' },
    { value: 'tired', label: 'Fatigué(e)', emoji: '😴' },
    { value: 'frustrated', label: 'Frustré(e)', emoji: '😤' },
    { value: 'sad', label: 'Triste', emoji: '😢' },
    { value: 'adventurous', label: 'Aventurier(ère)', emoji: '🏔️' },
    { value: 'inspired', label: 'Inspiré(e)', emoji: '✨' },
    { value: 'chill', label: 'Chill', emoji: '🏖️' },
    { value: 'mixed', label: 'Mitigé(e)', emoji: '😐' },
    { value: 'neutral', label: 'Neutre', emoji: '😶' },
    { value: 'in_love', label: 'Amoureux(se) du lieu', emoji: '❤️' },
    { value: 'underwhelmed', label: 'Déçu(e)', emoji: '😕' },
];

export interface TranscriptionRequest {
    audioFile: File;
}

export interface TranscriptionResponse {
    success: boolean;
    text?: string;
    error?: string;
}

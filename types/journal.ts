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

export interface JournalMoodConfig {
    value: JournalMood;
    label: string;
    emoji: string;
    color: string;
}

export const JOURNAL_MOODS: JournalMoodConfig[] = [
    { value: 'excited', label: 'Excité(e)', emoji: '🎉', color: '#D64545' },
    { value: 'happy', label: 'Heureux(se)', emoji: '😊', color: '#F5B82E' },
    { value: 'tired', label: 'Fatigué(e)', emoji: '😴', color: '#6B5A32' },
    { value: 'frustrated', label: 'Frustré(e)', emoji: '😤', color: '#D97B3D' },
    { value: 'sad', label: 'Triste', emoji: '😢', color: '#4A3E23' },
    { value: 'adventurous', label: 'Aventurier(ère)', emoji: '🏔️', color: '#1A1A1A' },
    { value: 'inspired', label: 'Inspiré(e)', emoji: '✨', color: '#8B4570' },
    { value: 'chill', label: 'Chill', emoji: '🏖️', color: '#2D5A3D' },
    { value: 'mixed', label: 'Mitigé(e)', emoji: '😐', color: '#B89F5C' },
    { value: 'neutral', label: 'Neutre', emoji: '😶', color: '#6B5A32' },
    { value: 'in_love', label: 'Amoureux(se) du lieu', emoji: '❤️', color: '#D64545' },
    { value: 'underwhelmed', label: 'Déçu(e)', emoji: '😕', color: '#8C7642' },
];

export interface TranscriptionRequest {
    audioFile: File;
}

export interface TranscriptionResponse {
    success: boolean;
    text?: string;
    error?: string;
}

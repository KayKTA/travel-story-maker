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
  { value: 'excited', label: 'Excité(e)', emoji: '🎉', color: '#FF6B6B' },
  { value: 'happy', label: 'Heureux(se)', emoji: '😊', color: '#4CAF50' },
  { value: 'tired', label: 'Fatigué(e)', emoji: '😴', color: '#9E9E9E' },
  { value: 'frustrated', label: 'Frustré(e)', emoji: '😤', color: '#FF5722' },
  { value: 'sad', label: 'Triste', emoji: '😢', color: '#5C6BC0' },
  { value: 'adventurous', label: 'Aventurier(ère)', emoji: '🏔️', color: '#FF9800' },
  { value: 'inspired', label: 'Inspiré(e)', emoji: '✨', color: '#9C27B0' },
  { value: 'chill', label: 'Chill', emoji: '🏖️', color: '#00BCD4' },
  { value: 'mixed', label: 'Mitigé(e)', emoji: '😐', color: '#795548' },
  { value: 'neutral', label: 'Neutre', emoji: '😶', color: '#607D8B' },
  { value: 'in_love', label: 'Amoureux(se) du lieu', emoji: '❤️', color: '#E91E63' },
  { value: 'underwhelmed', label: 'Déçu(e)', emoji: '😕', color: '#78909C' },
];

export interface TranscriptionRequest {
  audioFile: File;
}

export interface TranscriptionResponse {
  success: boolean;
  text?: string;
  error?: string;
}

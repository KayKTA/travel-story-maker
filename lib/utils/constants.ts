// ============================================
// Application Constants
// ============================================

// Re-export from types for convenience
export { TRIP_MOODS } from '@/types/trip';
export { JOURNAL_MOODS } from '@/types/journal';
export { EXPENSE_CATEGORIES, CURRENCIES } from '@/types/expense';
export { STORY_TYPES } from '@/types/story';

// ============================================
// Navigation
// ============================================

export const NAV_ITEMS = [
    {
        label: 'Accueil',
        href: '/',
        icon: 'Home',
    },
    {
        label: 'Voyages',
        href: '/trips',
        icon: 'Luggage',
    },
    {
        label: 'Journal',
        href: '/journal',
        icon: 'Book',
    },
    {
        label: 'Dépenses',
        href: '/expenses',
        icon: 'Receipt',
    },
    {
        label: 'Stories',
        href: '/stories',
        icon: 'AutoAwesome',
    },
    {
        label: 'Carte',
        href: '/map',
        icon: 'Map',
    },
] as const;

// ============================================
// File Upload
// ============================================

export const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
];

export const ACCEPTED_VIDEO_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/avi',
    'video/mov',
];

export const ACCEPTED_AUDIO_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
];

export const MAX_FILE_SIZE = {
    IMAGE: 20 * 1024 * 1024, // 20 MB
    VIDEO: 500 * 1024 * 1024, // 500 MB
    AUDIO: 50 * 1024 * 1024, // 50 MB
    RECEIPT: 10 * 1024 * 1024, // 10 MB
};

// ============================================
// Map Configuration
// ============================================

export const MAP_CONFIG = {
    DEFAULT_CENTER: { lat: 48.8566, lng: 2.3522 }, // Paris
    DEFAULT_ZOOM: 4,
    MIN_ZOOM: 2,
    MAX_ZOOM: 18,
    TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export const MARKER_COLORS = {
    trip: '#3B82F6', // Blue
    journal: '#10B981', // Green
    photo: '#F59E0B', // Amber
    video: '#EC4899', // Pink
};

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================
// Date Ranges
// ============================================

export const DATE_RANGE_OPTIONS = [
    { label: 'Tout', value: 'all' },
    { label: '7 derniers jours', value: '7d' },
    { label: '30 derniers jours', value: '30d' },
    { label: '3 derniers mois', value: '3m' },
    { label: 'Cette année', value: 'year' },
    { label: 'Personnalisé', value: 'custom' },
] as const;

// ============================================
// Story Generation
// ============================================

export const STORY_TONES = [
    { value: 'casual', label: 'Décontracté' },
    { value: 'professional', label: 'Professionnel' },
    { value: 'poetic', label: 'Poétique' },
    { value: 'humorous', label: 'Humoristique' },
] as const;

export const STORY_LENGTHS = [
    { value: 'short', label: 'Court (~100 mots)' },
    { value: 'medium', label: 'Moyen (~250 mots)' },
    { value: 'long', label: 'Long (~500 mots)' },
] as const;

// ============================================
// Reel Options (V2)
// ============================================

export const REEL_TEMPOS = [
    { value: 'slow', label: 'Lent', description: 'Ambiance contemplative' },
    { value: 'medium', label: 'Modéré', description: 'Rythme équilibré' },
    { value: 'fast', label: 'Rapide', description: 'Dynamique et énergique' },
] as const;

export const REEL_STYLES = [
    { value: 'cinematic', label: 'Cinématique' },
    { value: 'dynamic', label: 'Dynamique' },
    { value: 'minimal', label: 'Minimaliste' },
] as const;

export const REEL_DURATIONS = [
    { value: 15, label: '15 secondes' },
    { value: 30, label: '30 secondes' },
    { value: 60, label: '60 secondes' },
    { value: 90, label: '90 secondes' },
] as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
    GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
    NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
    NOT_FOUND: 'Ressource introuvable.',
    UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette ressource.',
    VALIDATION: 'Données invalides. Veuillez vérifier le formulaire.',
    FILE_TOO_LARGE: 'Le fichier est trop volumineux.',
    INVALID_FILE_TYPE: 'Type de fichier non supporté.',
    UPLOAD_FAILED: 'Échec de l\'upload. Veuillez réessayer.',
} as const;

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
    TRIP_CREATED: 'Voyage créé avec succès !',
    TRIP_UPDATED: 'Voyage mis à jour.',
    TRIP_DELETED: 'Voyage supprimé.',
    JOURNAL_SAVED: 'Entrée de journal enregistrée.',
    EXPENSE_ADDED: 'Dépense ajoutée.',
    MEDIA_UPLOADED: 'Média(s) uploadé(s) avec succès.',
    STORY_GENERATED: 'Story générée !',
} as const;

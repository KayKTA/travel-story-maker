import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_VIDEO_TYPES,
    ACCEPTED_AUDIO_TYPES,
    MAX_FILE_SIZE
} from './constants';

// ============================================
// Form Validators
// ============================================

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// Trip validation
export function validateTrip(data: {
    country?: string;
    start_date?: string;
    end_date?: string;
}): ValidationResult {
    const errors: string[] = [];

    if (!data.country?.trim()) {
        errors.push('Le pays est requis');
    }

    if (!data.start_date) {
        errors.push('La date de début est requise');
    }

    if (data.end_date && data.start_date && new Date(data.end_date) < new Date(data.start_date)) {
        errors.push('La date de fin doit être après la date de début');
    }

    return { valid: errors.length === 0, errors };
}

// Journal entry validation
export function validateJournalEntry(data: {
    trip_id?: string;
    entry_date?: string;
    content?: string;
}): ValidationResult {
    const errors: string[] = [];

    if (!data.trip_id) {
        errors.push('Le voyage est requis');
    }

    if (!data.entry_date) {
        errors.push('La date est requise');
    }

    if (!data.content?.trim()) {
        errors.push('Le contenu est requis');
    }

    return { valid: errors.length === 0, errors };
}

// Expense validation
export function validateExpense(data: {
    trip_id?: string;
    date?: string;
    amount?: number;
    category?: string;
}): ValidationResult {
    const errors: string[] = [];

    if (!data.trip_id) {
        errors.push('Le voyage est requis');
    }

    if (!data.date) {
        errors.push('La date est requise');
    }

    if (data.amount === undefined || data.amount <= 0) {
        errors.push('Le montant doit être supérieur à 0');
    }

    if (!data.category) {
        errors.push('La catégorie est requise');
    }

    return { valid: errors.length === 0, errors };
}

// Story validation
export function validateStory(data: {
    type?: string;
    prompt?: string;
}): ValidationResult {
    const errors: string[] = [];

    if (!data.type) {
        errors.push('Le type de story est requis');
    }

    if (!data.prompt?.trim()) {
        errors.push('Le prompt est requis');
    }

    return { valid: errors.length === 0, errors };
}

// ============================================
// File Validators
// ============================================

export function validateImageFile(file: File): ValidationResult {
    const errors: string[] = [];

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`Type de fichier non supporté: ${file.type}`);
    }

    if (file.size > MAX_FILE_SIZE.IMAGE) {
        errors.push(`Le fichier est trop volumineux (max ${MAX_FILE_SIZE.IMAGE / 1024 / 1024} MB)`);
    }

    return { valid: errors.length === 0, errors };
}

export function validateVideoFile(file: File): ValidationResult {
    const errors: string[] = [];

    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        errors.push(`Type de fichier non supporté: ${file.type}`);
    }

    if (file.size > MAX_FILE_SIZE.VIDEO) {
        errors.push(`Le fichier est trop volumineux (max ${MAX_FILE_SIZE.VIDEO / 1024 / 1024} MB)`);
    }

    return { valid: errors.length === 0, errors };
}

export function validateAudioFile(file: File): ValidationResult {
    const errors: string[] = [];

    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        errors.push(`Type de fichier non supporté: ${file.type}`);
    }

    if (file.size > MAX_FILE_SIZE.AUDIO) {
        errors.push(`Le fichier est trop volumineux (max ${MAX_FILE_SIZE.AUDIO / 1024 / 1024} MB)`);
    }

    return { valid: errors.length === 0, errors };
}

export function validateReceiptFile(file: File): ValidationResult {
    const errors: string[] = [];

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`Type de fichier non supporté: ${file.type}`);
    }

    if (file.size > MAX_FILE_SIZE.RECEIPT) {
        errors.push(`Le fichier est trop volumineux (max ${MAX_FILE_SIZE.RECEIPT / 1024 / 1024} MB)`);
    }

    return { valid: errors.length === 0, errors };
}

export function isImageFile(file: File): boolean {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export function isVideoFile(file: File): boolean {
    return ACCEPTED_VIDEO_TYPES.includes(file.type);
}

export function isAudioFile(file: File): boolean {
    return ACCEPTED_AUDIO_TYPES.includes(file.type);
}

// ============================================
// Data Validators
// ============================================

export function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

export function isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

export function isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
}

export function isValidCoordinates(lat: number, lng: number): boolean {
    return isValidLatitude(lat) && isValidLongitude(lng);
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// Sanitizers
// ============================================

export function sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
}

export function sanitizeNumber(value: unknown): number | null {
    if (typeof value === 'number' && !isNaN(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(',', '.'));
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

export function sanitizeDate(value: unknown): string | null {
    if (!value) return null;

    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }

    if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }

    return null;
}

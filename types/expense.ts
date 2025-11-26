// ============================================
// Types Expense
// ============================================

export interface Expense {
    id: string;
    trip_id: string;
    date: string; // ISO date string
    amount: number;
    currency: string;
    category: ExpenseCategory;
    label: string | null;
    receipt_image_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExpenseWithTrip extends Expense {
    trip?: {
        id: string;
        country: string;
        city: string | null;
    };
}

export interface ExpenseFormData {
    trip_id: string;
    date: string;
    amount: number;
    currency?: string;
    category: ExpenseCategory;
    label?: string;
    receipt_image_url?: string;
    notes?: string;
}

export type ExpenseCategory =
    | 'transport'
    | 'logement'
    | 'food'
    | 'activite'
    | 'shopping'
    | 'autre';

export const EXPENSE_CATEGORIES: {
    value: ExpenseCategory;
    label: string;
    emoji: string;
    color: string;
}[] = [
        { value: 'transport', label: 'Transport', emoji: '✈️', color: '#3B82F6' },
        { value: 'logement', label: 'Logement', emoji: '🏨', color: '#8B5CF6' },
        { value: 'food', label: 'Nourriture', emoji: '🍽️', color: '#F59E0B' },
        { value: 'activite', label: 'Activité', emoji: '🎭', color: '#10B981' },
        { value: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
        { value: 'autre', label: 'Autre', emoji: '📦', color: '#6B7280' },
    ];

export const CURRENCIES = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
    { code: 'ARS', symbol: '$', name: 'Peso Argentin' },
    { code: 'CLP', symbol: '$', name: 'Peso Chilien' },
    { code: 'JPY', symbol: '¥', name: 'Yen' },
    { code: 'THB', symbol: '฿', name: 'Baht' },
    { code: 'AUD', symbol: '$', name: 'Dollar Australien' },
    { code: 'NZD', symbol: '$', name: 'Dollar Néo-Zélandais' },
    { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' },
];

export interface ExpensesByCategory {
    category: ExpenseCategory;
    total_amount: number;
    count: number;
    currency: string;
}

export interface ExpenseStats {
    total: number;
    currency: string;
    by_category: ExpensesByCategory[];
    count: number;
    average_per_day?: number;
}

// OCR Receipt extraction types
export interface ReceiptExtractionRequest {
    imageUrl: string;
}

export interface ReceiptExtractionResponse {
    success: boolean;
    data?: {
        amount: number;
        currency: string;
        date: string;
        label: string;
        category?: ExpenseCategory;
        confidence: number;
    };
    error?: string;
}

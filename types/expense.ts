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

// types/expenses.ts (ou où tu les as)

export type ExpenseCategory =
    | 'logement'
    | 'transport'
    | 'food'
    | 'activite'
    | 'sorties'
    | 'shopping'
    | 'blanchisserie'
    | 'internet'
    | 'banque'
    | 'equipement'
    | 'sante'
    | 'general'
    | 'autre';

export const EXPENSE_CATEGORIES: {
    value: ExpenseCategory;
    label: string;
    emoji: string;
    color: string;
}[] = [
    { value: 'logement',      label: 'Hébergement',              emoji: '🏨', color: '#8B5CF6' },
    { value: 'transport',     label: 'Transports',               emoji: '🚌', color: '#3B82F6' },
    { value: 'food',          label: 'Nourriture',               emoji: '🍽️', color: '#F59E0B' },
    { value: 'activite',      label: 'Activités / Visites',      emoji: '🎭', color: '#10B981' },
    { value: 'sorties',       label: 'Boissons / Sorties',       emoji: '🍹', color: '#EC4899' },
    { value: 'shopping',      label: 'Achats / Souvenirs',       emoji: '🛍️', color: '#F97316' },
    { value: 'blanchisserie', label: 'Blanchisserie',            emoji: '🧺', color: '#06B6D4' },
    { value: 'internet',      label: 'Internet / Téléphone',     emoji: '📶', color: '#0EA5E9' },
    { value: 'banque',        label: 'Frais bancaires',          emoji: '🏦', color: '#6366F1' },
    { value: 'equipement',    label: 'Équipements',              emoji: '🎒', color: '#84CC16' },
    { value: 'sante',         label: 'Frais de santé',           emoji: '🩺', color: '#DC2626' },
    { value: 'general',       label: 'Général',                  emoji: '📂', color: '#9CA3AF' },
    { value: 'autre',         label: 'Autre',                    emoji: '📦', color: '#6B7280' },
];

export const CURRENCIES = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'BRL', symbol: 'R$', name: 'Real Brésilien' },
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

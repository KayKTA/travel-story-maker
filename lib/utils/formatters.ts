import { format, formatDistance, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// ============================================
// Date Formatters
// ============================================

export function formatDate(date: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Date invalide';
    return format(d, formatStr, { locale: fr });
}

export function formatDateShort(date: string | Date): string {
    return formatDate(date, 'dd/MM/yyyy');
}

export function formatDateLong(date: string | Date): string {
    return formatDate(date, 'EEEE dd MMMM yyyy');
}

export function formatDateRange(startDate: string | Date, endDate?: string | Date | null): string {
    const start = formatDate(startDate, 'dd MMM');
    if (!endDate) return `${start} - en cours`;
    const end = formatDate(endDate, 'dd MMM yyyy');
    return `${start} - ${end}`;
}

export function formatRelativeDate(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Date invalide';
    return formatDistance(d, new Date(), { addSuffix: true, locale: fr });
}

export function getDurationDays(startDate: string | Date, endDate?: string | Date | null): number {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = endDate
        ? (typeof endDate === 'string' ? parseISO(endDate) : endDate)
        : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// ============================================
// Number Formatters
// ============================================

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

// ============================================
// String Formatters
// ============================================

export function truncate(str: string, maxLength: number = 100): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function parseTags(tagsString: string | null): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
}

export function formatTags(tags: string[]): string {
    return tags.join(', ');
}

// ============================================
// Location Formatters
// ============================================

export function formatCoordinates(lat: number, lng: number, precision: number = 4): string {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

export function formatLocation(location: string | null, country?: string): string {
    if (!location && !country) return 'Lieu inconnu';
    if (!location) return country || 'Lieu inconnu';
    if (!country) return location;
    return `${location}, ${country}`;
}

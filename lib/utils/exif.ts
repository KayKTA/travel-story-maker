import type { ExifData } from '@/types';

// ============================================
// EXIF Extraction Utilities
// ============================================

/**
 * Extract EXIF data from an image file
 * Note: In production, use a library like exif-js or sharp
 * This is a placeholder structure for the extraction logic
 */
export async function extractExifFromImage(file: File): Promise<ExifData | null> {
    try {
        // In production, you would use a library like:
        // - exif-js (client-side)
        // - sharp (server-side)
        // - exiftool (server-side CLI)

        // For now, we'll parse basic metadata from the file
        const exifData: ExifData = {
            width: undefined,
            height: undefined,
        };

        // Try to get image dimensions using createImageBitmap
        if (file.type.startsWith('image/')) {
            try {
                const bitmap = await createImageBitmap(file);
                exifData.width = bitmap.width;
                exifData.height = bitmap.height;
                bitmap.close();
            } catch (e) {
                console.warn('Could not read image dimensions:', e);
            }
        }

        return exifData;
    } catch (error) {
        console.error('Error extracting EXIF:', error);
        return null;
    }
}

/**
 * Convert GPS coordinates from EXIF format (degrees, minutes, seconds)
 * to decimal format
 */
export function convertDMSToDecimal(
    degrees: number,
    minutes: number,
    seconds: number,
    direction: 'N' | 'S' | 'E' | 'W'
): number {
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }
    return decimal;
}

/**
 * Parse GPS coordinates from EXIF GPS data
 */
export function parseGPSCoordinates(exif: {
    GPSLatitude?: number[];
    GPSLatitudeRef?: 'N' | 'S';
    GPSLongitude?: number[];
    GPSLongitudeRef?: 'E' | 'W';
}): { lat: number; lng: number } | null {
    const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } = exif;

    if (!GPSLatitude || !GPSLatitudeRef || !GPSLongitude || !GPSLongitudeRef) {
        return null;
    }

    const lat = convertDMSToDecimal(
        GPSLatitude[0],
        GPSLatitude[1],
        GPSLatitude[2],
        GPSLatitudeRef
    );

    const lng = convertDMSToDecimal(
        GPSLongitude[0],
        GPSLongitude[1],
        GPSLongitude[2],
        GPSLongitudeRef
    );

    return { lat, lng };
}

/**
 * Parse EXIF date string to ISO format
 * EXIF dates are typically in format: "YYYY:MM:DD HH:MM:SS"
 */
export function parseExifDate(exifDate: string | undefined): string | null {
    if (!exifDate) return null;

    // Replace colons in date part with dashes
    const isoDate = exifDate.replace(
        /^(\d{4}):(\d{2}):(\d{2})/,
        '$1-$2-$3'
    );

    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
    } catch {
        return null;
    }
}

/**
 * Clean and normalize EXIF data for storage
 */
export function normalizeExifData(rawExif: Record<string, unknown>): ExifData {
    const normalized: ExifData = {};

    // Date/Time
    if (rawExif.DateTimeOriginal) {
        normalized.date_time_original = parseExifDate(rawExif.DateTimeOriginal as string) || undefined;
    }
    if (rawExif.DateTimeDigitized) {
        normalized.date_time_digitized = parseExifDate(rawExif.DateTimeDigitized as string) || undefined;
    }

    // GPS
    const gps = parseGPSCoordinates(rawExif as {
        GPSLatitude?: number[];
        GPSLatitudeRef?: 'N' | 'S';
        GPSLongitude?: number[];
        GPSLongitudeRef?: 'E' | 'W';
    });
    if (gps) {
        normalized.gps_latitude = gps.lat;
        normalized.gps_longitude = gps.lng;
    }
    if (typeof rawExif.GPSAltitude === 'number') {
        normalized.gps_altitude = rawExif.GPSAltitude;
    }

    // Camera info
    if (rawExif.Make) normalized.make = String(rawExif.Make);
    if (rawExif.Model) normalized.model = String(rawExif.Model);
    if (rawExif.LensModel) normalized.lens_model = String(rawExif.LensModel);

    // Camera settings
    if (typeof rawExif.FocalLength === 'number') normalized.focal_length = rawExif.FocalLength;
    if (typeof rawExif.FNumber === 'number') normalized.aperture = rawExif.FNumber;
    if (rawExif.ExposureTime) normalized.shutter_speed = String(rawExif.ExposureTime);
    if (typeof rawExif.ISOSpeedRatings === 'number') normalized.iso = rawExif.ISOSpeedRatings;
    if (rawExif.Flash !== undefined) normalized.flash = Boolean(rawExif.Flash);

    // Image dimensions
    if (typeof rawExif.ImageWidth === 'number') normalized.width = rawExif.ImageWidth;
    if (typeof rawExif.ImageHeight === 'number') normalized.height = rawExif.ImageHeight;
    if (typeof rawExif.Orientation === 'number') normalized.orientation = rawExif.Orientation;

    // Store raw data for reference
    normalized.raw = rawExif;

    return normalized;
}

/**
 * Extract video metadata
 * Note: Video metadata extraction is more complex and typically requires
 * server-side processing with ffprobe or similar tools
 */
export async function extractVideoMetadata(file: File): Promise<{
    duration_seconds: number | null;
    width: number | null;
    height: number | null;
}> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            resolve({
                duration_seconds: Math.round(video.duration),
                width: video.videoWidth,
                height: video.videoHeight,
            });
            URL.revokeObjectURL(video.src);
        };

        video.onerror = () => {
            resolve({
                duration_seconds: null,
                width: null,
                height: null,
            });
            URL.revokeObjectURL(video.src);
        };

        video.src = URL.createObjectURL(file);
    });
}

/**
 * Generate a unique filename for uploaded media
 */
export function generateMediaFilename(
    originalName: string,
    tripId: string,
    type: 'photo' | 'video'
): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || (type === 'photo' ? 'jpg' : 'mp4');
    return `${tripId}/${type}_${timestamp}_${random}.${extension}`;
}

/**
 * Check if a file has GPS data in EXIF
 */
export function hasGPSData(exif: ExifData | null): boolean {
    if (!exif) return false;
    return (
        exif.gps_latitude !== undefined &&
        exif.gps_longitude !== undefined &&
        !isNaN(exif.gps_latitude) &&
        !isNaN(exif.gps_longitude)
    );
}

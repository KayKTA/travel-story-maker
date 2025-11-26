// ============================================
// Types MediaAsset
// ============================================

export interface MediaAsset {
    id: string;
    trip_id: string;
    journal_entry_id: string | null;
    media_type: MediaType;
    url: string;
    thumbnail_url: string | null;
    caption: string | null;
    taken_at: string | null;
    lat: number | null;
    lng: number | null;
    exif: ExifData | null;
    duration_seconds: number | null;
    file_size_bytes: number | null;
    width: number | null;
    height: number | null;
    created_at: string;
    updated_at: string;
}

export interface MediaAssetWithRelations extends MediaAsset {
    trip?: {
        id: string;
        country: string;
        city: string | null;
    };
    journal_entry?: {
        id: string;
        entry_date: string;
        location: string | null;
    };
}

export interface MediaUploadData {
    trip_id: string;
    journal_entry_id?: string;
    media_type: MediaType;
    caption?: string;
}

export type MediaType = 'photo' | 'video';

export interface ExifData {
    // Date/Time
    date_time_original?: string;
    date_time_digitized?: string;

    // GPS
    gps_latitude?: number;
    gps_longitude?: number;
    gps_altitude?: number;

    // Camera
    make?: string;
    model?: string;
    lens_model?: string;

    // Settings
    focal_length?: number;
    aperture?: number;
    shutter_speed?: string;
    iso?: number;
    flash?: boolean;

    // Image
    orientation?: number;
    width?: number;
    height?: number;

    // Raw data for reference
    raw?: Record<string, unknown>;
}

// Metadata extraction types
export interface MetadataExtractionRequest {
    fileUrl: string;
    mediaType: MediaType;
}

export interface MetadataExtractionResponse {
    success: boolean;
    data?: {
        taken_at: string | null;
        lat: number | null;
        lng: number | null;
        width: number | null;
        height: number | null;
        duration_seconds: number | null;
        exif: ExifData | null;
    };
    error?: string;
}

// Upload progress tracking
export interface UploadProgress {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
    error?: string;
    result?: MediaAsset;
}

// Reel generation types (V2)
export interface ReelGenerationRequest {
    trip_id?: string;
    media_asset_ids: string[];
    narrative_text?: string;
    story_id?: string;
    options?: ReelOptions;
}

export interface ReelOptions {
    duration_target?: number; // seconds
    tempo?: 'slow' | 'medium' | 'fast';
    style?: 'cinematic' | 'dynamic' | 'minimal';
    music_mood?: string;
    include_text_overlays?: boolean;
}

export interface ReelGenerationResponse {
    success: boolean;
    reel_id?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    output_url?: string;
    estimated_duration?: number;
    error?: string;
}

export interface Reel {
    id: string;
    trip_id: string | null;
    story_id: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    source_media_ids: string[];
    output_url: string | null;
    duration_seconds: number | null;
    options: ReelOptions | null;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

// Map display helpers
export interface MediaMarker {
    id: string;
    lat: number;
    lng: number;
    media_type: MediaType;
    url: string;
    thumbnail_url: string | null;
    taken_at: string | null;
    caption: string | null;
}

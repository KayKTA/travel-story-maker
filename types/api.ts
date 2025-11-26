// ============================================
// Types API Responses
// ============================================

// Generic API response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ApiMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiMeta {
    total?: number;
    page?: number;
    per_page?: number;
    has_more?: boolean;
}

// Pagination
export interface PaginationParams {
    page?: number;
    per_page?: number;
    order_by?: string;
    order_dir?: 'asc' | 'desc';
}

// Filter params by entity
export interface TripFilters {
    country?: string;
    year?: number;
    mood?: string;
    search?: string;
}

export interface JournalFilters {
    trip_id?: string;
    mood?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}

export interface ExpenseFilters {
    trip_id?: string;
    category?: string;
    date_from?: string;
    date_to?: string;
    currency?: string;
    min_amount?: number;
    max_amount?: number;
}

export interface MediaFilters {
    trip_id?: string;
    journal_entry_id?: string;
    media_type?: 'photo' | 'video';
    has_location?: boolean;
    date_from?: string;
    date_to?: string;
}

export interface StoryFilters {
    trip_id?: string;
    type?: string;
    status?: string;
}

// Supabase specific
export interface SupabaseStorageUploadResult {
    path: string;
    id: string;
    fullPath: string;
}

export interface SupabaseStorageError {
    message: string;
    statusCode: string;
}

// Route params
export interface TripPageParams {
    params: {
        id: string;
    };
}

export interface JournalPageParams {
    params: {
        id: string;
    };
}

// Action results
export interface ActionResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

// Dashboard stats
export interface DashboardStats {
    trips_count: number;
    total_days_traveled: number;
    countries_visited: string[];
    total_photos: number;
    total_videos: number;
    total_expenses: number;
    expenses_currency: string;
    journal_entries_count: number;
    stories_count: number;
    recent_trips: {
        id: string;
        country: string;
        city: string | null;
        start_date: string;
    }[];
}

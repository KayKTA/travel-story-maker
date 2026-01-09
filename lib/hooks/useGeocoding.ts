'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface GeocodingParams {
    lat: number;
    lng: number;
}

interface GeocodingResponse {
    location: string | null;
}

async function reverseGeocode({ lat, lng }: GeocodingParams): Promise<string | null> {
    const result = await apiClient<GeocodingResponse>(
        `/api/geocoding/reverse?lat=${lat}&lng=${lng}`
    );
    return result.location;
}

export function useReverseGeocode() {
    return useMutation({
        mutationFn: reverseGeocode,
    });
}

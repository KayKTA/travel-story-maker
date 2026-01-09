'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from './queryKeys';
import type { TripWithStats, TripFormData, Trip } from '@/types';

// API functions
async function fetchTripsWithStats(
    filters?: Record<string, string>
): Promise<TripWithStats[]> {
    const params = new URLSearchParams(filters);
    return apiClient<TripWithStats[]>(`/api/trips/stats?${params}`);
}

async function createTripAPI(data: TripFormData): Promise<Trip> {
    return apiClient<Trip>('/api/trips', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateTripAPI(id: string, data: Partial<TripFormData>): Promise<Trip> {
    return apiClient<Trip>('/api/trips', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
    });
}

async function deleteTripAPI(id: string): Promise<void> {
    return apiClient<void>(`/api/trips?id=${id}`, {
        method: 'DELETE',
    });
}

// Query hooks
export function useTrips(filters?: Record<string, string>) {
    return useQuery({
        queryKey: queryKeys.trips.list(filters || {}),
        queryFn: () => fetchTripsWithStats(filters),
    });
}

// Mutation hooks
export function useCreateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTripAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
        },
    });
}

export function useUpdateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TripFormData> }) =>
            updateTripAPI(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.lists() });
        },
    });
}

export function useDeleteTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTripAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
        },
    });
}

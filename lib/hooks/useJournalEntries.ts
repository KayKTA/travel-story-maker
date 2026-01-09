'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from './queryKeys';
import type { JournalEntry, JournalEntryFormData } from '@/types/journal';

// API functions
async function fetchJournalEntries(
    filters?: Record<string, string>
): Promise<JournalEntry[]> {
    const params = new URLSearchParams(filters);
    return apiClient<JournalEntry[]>(`/api/journal?${params}`);
}

async function createJournalEntryAPI(data: JournalEntryFormData): Promise<JournalEntry> {
    return apiClient<JournalEntry>('/api/journal', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateJournalEntryAPI(
    id: string,
    data: Partial<JournalEntryFormData>
): Promise<JournalEntry> {
    return apiClient<JournalEntry>('/api/journal', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
    });
}

async function deleteJournalEntryAPI(id: string): Promise<void> {
    return apiClient<void>(`/api/journal?id=${id}`, {
        method: 'DELETE',
    });
}

// Query hooks
export function useJournalEntries(filters?: Record<string, string>) {
    return useQuery({
        queryKey: queryKeys.journal.list(filters || {}),
        queryFn: () => fetchJournalEntries(filters),
    });
}

// Mutation hooks
export function useCreateJournalEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createJournalEntryAPI,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
            if (variables.trip_id) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.trips.detail(variables.trip_id),
                });
                queryClient.invalidateQueries({
                    queryKey: ['trip-data', variables.trip_id],
                });
            }
        },
    });
}

export function useUpdateJournalEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntryFormData> }) =>
            updateJournalEntryAPI(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.journal.detail(variables.id),
            });
        },
    });
}

export function useDeleteJournalEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteJournalEntryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
        },
    });
}

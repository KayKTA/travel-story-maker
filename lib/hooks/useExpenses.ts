'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from './queryKeys';
import type { Expense, ExpenseFormData } from '@/types/expense';

// API functions
async function fetchExpenses(filters?: Record<string, string>): Promise<Expense[]> {
    const params = new URLSearchParams(filters);
    return apiClient<Expense[]>(`/api/expenses?${params}`);
}

async function createExpenseAPI(data: ExpenseFormData): Promise<Expense> {
    return apiClient<Expense>('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateExpenseAPI(
    id: string,
    data: Partial<ExpenseFormData>
): Promise<Expense> {
    return apiClient<Expense>('/api/expenses', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
    });
}

async function deleteExpenseAPI(id: string): Promise<void> {
    return apiClient<void>(`/api/expenses?id=${id}`, {
        method: 'DELETE',
    });
}

// Query hooks
export function useExpenses(filters?: Record<string, string>) {
    return useQuery({
        queryKey: queryKeys.expenses.list(filters || {}),
        queryFn: () => fetchExpenses(filters),
    });
}

// Mutation hooks
export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExpenseAPI,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
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

export function useUpdateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
            updateExpenseAPI(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteExpenseAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
        },
    });
}

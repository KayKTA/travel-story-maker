export const queryKeys = {
    trips: {
        all: ['trips'] as const,
        lists: () => [...queryKeys.trips.all, 'list'] as const,
        list: (filters: Record<string, unknown>) =>
            [...queryKeys.trips.lists(), filters] as const,
        details: () => [...queryKeys.trips.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.trips.details(), id] as const,
    },
    journal: {
        all: ['journal'] as const,
        lists: () => [...queryKeys.journal.all, 'list'] as const,
        list: (filters: Record<string, unknown>) =>
            [...queryKeys.journal.lists(), filters] as const,
        details: () => [...queryKeys.journal.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.journal.details(), id] as const,
    },
    expenses: {
        all: ['expenses'] as const,
        lists: () => [...queryKeys.expenses.all, 'list'] as const,
        list: (filters: Record<string, unknown>) =>
            [...queryKeys.expenses.lists(), filters] as const,
    },
    media: {
        all: ['media'] as const,
        lists: () => [...queryKeys.media.all, 'list'] as const,
        list: (filters: Record<string, unknown>) =>
            [...queryKeys.media.lists(), filters] as const,
    },
};

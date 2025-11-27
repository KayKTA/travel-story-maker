'use client';

import { useState, useCallback } from 'react';

/**
 * Hook for managing open/close state of modals, drawers, dialogs
 * @param initialState - Initial open state (default: false)
 */
export function useDisclosure(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const onOpen = useCallback(() => setIsOpen(true), []);
    const onClose = useCallback(() => setIsOpen(false), []);
    const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

    return {
        isOpen,
        onOpen,
        onClose,
        onToggle,
    };
}

/**
 * Hook for managing multiple disclosure states
 * Useful for forms with multiple dialogs
 */
export function useMultiDisclosure<T extends string>(keys: T[]) {
    const [openStates, setOpenStates] = useState<Record<T, boolean>>(
        () => keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>)
    );

    const open = useCallback((key: T) => {
        setOpenStates((prev) => ({ ...prev, [key]: true }));
    }, []);

    const close = useCallback((key: T) => {
        setOpenStates((prev) => ({ ...prev, [key]: false }));
    }, []);

    const toggle = useCallback((key: T) => {
        setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const closeAll = useCallback(() => {
        setOpenStates(keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>));
    }, [keys]);

    const isOpen = useCallback((key: T) => openStates[key], [openStates]);

    return {
        openStates,
        open,
        close,
        toggle,
        closeAll,
        isOpen,
    };
}

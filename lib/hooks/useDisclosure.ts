'use client';

import { useState, useCallback } from 'react';

interface UseDisclosureReturn {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
}

/**
 * Hook for managing disclosure state (modals, drawers, dropdowns)
 */
export function useDisclosure(initialState: boolean = false): UseDisclosureReturn {
    const [isOpen, setIsOpen] = useState(initialState);

    const onOpen = useCallback(() => setIsOpen(true), []);
    const onClose = useCallback(() => setIsOpen(false), []);
    const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

    return { isOpen, onOpen, onClose, onToggle };
}

interface UseMultiDisclosureReturn<T extends string> {
    openStates: Record<T, boolean>;
    open: (key: T) => void;
    close: (key: T) => void;
    toggle: (key: T) => void;
    closeAll: () => void;
    isOpen: (key: T) => boolean;
}

/**
 * Hook for managing multiple disclosures
 */
export function useMultiDisclosure<T extends string>(
    keys: T[]
): UseMultiDisclosureReturn<T> {
    const initialState = keys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<T, boolean>
    );

    const [openStates, setOpenStates] = useState(initialState);

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
        setOpenStates(initialState);
    }, [initialState]);

    const isOpen = useCallback((key: T) => openStates[key], [openStates]);

    return { openStates, open, close, toggle, closeAll, isOpen };
}

'use client';

import { useState, useCallback, useRef } from 'react';

interface UseSelectionReturn<T> {
    selected: T | null;
    select: (item: T) => void;
    clear: () => void;
    toggle: (item: T) => void;
    isSelected: (item: T) => boolean;
}

/**
 * Hook for single selection state
 */
export function useSelection<T>(initial: T | null = null): UseSelectionReturn<T> {
    const [selected, setSelected] = useState<T | null>(initial);

    const select = useCallback((item: T) => setSelected(item), []);
    const clear = useCallback(() => setSelected(null), []);
    const toggle = useCallback(
        (item: T) => setSelected((prev) => (prev === item ? null : item)),
        []
    );
    const isSelected = useCallback((item: T) => selected === item, [selected]);

    return { selected, select, clear, toggle, isSelected };
}

interface UseMultiSelectionReturn<T> {
    selected: T[];
    selectedSet: Set<T>;
    add: (item: T) => void;
    remove: (item: T) => void;
    toggle: (item: T) => void;
    clear: () => void;
    selectAll: (items: T[]) => void;
    isSelected: (item: T) => boolean;
    count: number;
}

/**
 * Hook for multiple selection state
 */
export function useMultiSelection<T>(initial: T[] = []): UseMultiSelectionReturn<T> {
    const [selected, setSelected] = useState<T[]>(initial);
    const selectedSet = new Set(selected);

    const add = useCallback((item: T) => {
        setSelected((prev) => (prev.includes(item) ? prev : [...prev, item]));
    }, []);

    const remove = useCallback((item: T) => {
        setSelected((prev) => prev.filter((i) => i !== item));
    }, []);

    const toggle = useCallback((item: T) => {
        setSelected((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    }, []);

    const clear = useCallback(() => setSelected([]), []);
    const selectAll = useCallback((items: T[]) => setSelected(items), []);
    const isSelected = useCallback((item: T) => selectedSet.has(item), [selectedSet]);

    return {
        selected,
        selectedSet,
        add,
        remove,
        toggle,
        clear,
        selectAll,
        isSelected,
        count: selected.length,
    };
}

interface UseElementRefsReturn<T> {
    setRef: (id: string) => (el: T | null) => void;
    getRef: (id: string) => T | null;
    scrollTo: (id: string, options?: ScrollIntoViewOptions) => void;
    refs: Map<string, T>;
}

/**
 * Hook for managing element refs for scroll-to functionality
 */
export function useElementRefs<T extends HTMLElement>(): UseElementRefsReturn<T> {
    const refsMap = useRef<Map<string, T>>(new Map());

    const setRef = useCallback(
        (id: string) => (el: T | null) => {
            if (el) {
                refsMap.current.set(id, el);
            } else {
                refsMap.current.delete(id);
            }
        },
        []
    );

    const getRef = useCallback((id: string) => refsMap.current.get(id) || null, []);

    const scrollTo = useCallback(
        (id: string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }) => {
            const el = refsMap.current.get(id);
            if (el) {
                el.scrollIntoView(options);
            }
        },
        []
    );

    return { setRef, getRef, scrollTo, refs: refsMap.current };
}

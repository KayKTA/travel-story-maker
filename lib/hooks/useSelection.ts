'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing single selection state
 * Useful for timeline, list item selection, etc.
 */
export function useSelection<T = string>(initialValue: T | null = null) {
    const [selected, setSelected] = useState<T | null>(initialValue);

    const select = useCallback((value: T) => {
        setSelected(value);
    }, []);

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    const toggle = useCallback((value: T) => {
        setSelected((prev) => (prev === value ? null : value));
    }, []);

    const isSelected = useCallback(
        (value: T) => selected === value,
        [selected]
    );

    return {
        selected,
        select,
        clear,
        toggle,
        isSelected,
    };
}

/**
 * Hook for managing multiple selections
 */
export function useMultiSelection<T = string>(initialValues: T[] = []) {
    const [selected, setSelected] = useState<Set<T>>(new Set(initialValues));

    const add = useCallback((value: T) => {
        setSelected((prev) => new Set(prev).add(value));
    }, []);

    const remove = useCallback((value: T) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.delete(value);
            return next;
        });
    }, []);

    const toggle = useCallback((value: T) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(value)) {
                next.delete(value);
            } else {
                next.add(value);
            }
            return next;
        });
    }, []);

    const clear = useCallback(() => {
        setSelected(new Set());
    }, []);

    const selectAll = useCallback((values: T[]) => {
        setSelected(new Set(values));
    }, []);

    const isSelected = useCallback(
        (value: T) => selected.has(value),
        [selected]
    );

    return {
        selected: Array.from(selected),
        selectedSet: selected,
        add,
        remove,
        toggle,
        clear,
        selectAll,
        isSelected,
        count: selected.size,
    };
}

/**
 * Hook for element refs mapping (useful for scroll-to-element)
 */
export function useElementRefs<T extends HTMLElement = HTMLDivElement>() {
    const refs = useRef<Record<string, T | null>>({});

    const setRef = useCallback((id: string) => (el: T | null) => {
        refs.current[id] = el;
    }, []);

    const getRef = useCallback((id: string) => refs.current[id], []);

    const scrollTo = useCallback((id: string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }) => {
        const element = refs.current[id];
        if (element) {
            element.scrollIntoView(options);
        }
    }, []);

    return {
        setRef,
        getRef,
        scrollTo,
        refs: refs.current,
    };
}

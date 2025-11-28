'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    onSubmit: (values: T) => Promise<void>;
    validate?: (values: T) => { valid: boolean; errors: string[] };
    resetOnSuccess?: boolean;
}

interface UseFormReturn<T> {
    values: T;
    errors: string[];
    loading: boolean;
    handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
    handleSubmit: () => Promise<void>;
    reset: () => void;
    setValues: (values: T) => void;
}

/**
 * Generic form hook for managing form state
 */
export function useForm<T extends Record<string, unknown>>({
    initialValues,
    onSubmit,
    validate,
    resetOnSuccess = true,
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors([]);
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors([]);
    }, [initialValues]);

    const handleSubmit = useCallback(async () => {
        // Validate if validator provided
        if (validate) {
            const validation = validate(values);
            if (!validation.valid) {
                setErrors(validation.errors);
                return;
            }
        }

        setLoading(true);
        setErrors([]);

        try {
            await onSubmit(values);
            if (resetOnSuccess) {
                reset();
            }
        } catch {
            setErrors(['Une erreur est survenue. Veuillez réessayer.']);
        } finally {
            setLoading(false);
        }
    }, [values, validate, onSubmit, reset, resetOnSuccess]);

    return {
        values,
        errors,
        loading,
        handleChange,
        handleSubmit,
        reset,
        setValues,
    };
}

/**
 * Hook for dialog forms - handles reset on open
 */
export function useDialogForm<T extends Record<string, unknown>>(
    options: UseFormOptions<T> & { open: boolean; initialData?: Partial<T> }
) {
    const form = useForm(options);

    useEffect(() => {
        if (options.open) {
            if (options.initialData) {
                form.setValues({ ...options.initialValues, ...options.initialData });
            } else {
                form.reset();
            }
        }
    }, [options.open, options.initialData, options.initialValues, form]);

    return form;
}

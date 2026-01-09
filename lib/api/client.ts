type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: { code: string; message: string };
};

export async function apiClient<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error?.message || `HTTP error! status: ${response.status}`
        );
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
        throw new Error(result.error?.message || 'API call failed');
    }

    return result.data as T;
}

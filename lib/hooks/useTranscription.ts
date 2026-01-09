'use client';

import { useMutation } from '@tanstack/react-query';

async function transcribeAudio(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch('/api/journal/transcribe', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Transcription failed');
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Transcription failed');
    }

    return result.text;
}

export function useTranscription() {
    return useMutation({
        mutationFn: transcribeAudio,
    });
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/journal/transcribe
 *
 * API mockée pour la transcription audio → texte
 *
 * En production, cette API devrait :
 * 1. Recevoir un fichier audio (FormData)
 * 2. L'envoyer à un service de transcription (Whisper, Google Speech-to-Text, etc.)
 * 3. Retourner le texte transcrit
 *
 * Pour l'instant, on retourne un texte de démonstration.
 */
export async function POST(request: NextRequest) {
    try {
        // Simuler un délai de traitement
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Récupérer le fichier audio (pour vérifier qu'il est bien envoyé)
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File | null;

        if (!audioFile) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Aucun fichier audio fourni',
                },
                { status: 400 }
            );
        }

        // Vérifier le type de fichier
        const validTypes = [
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/m4a',
            'audio/aac',
            'audio/ogg',
            'audio/webm',
        ];

        if (!validTypes.includes(audioFile.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Type de fichier non supporté: ${audioFile.type}`,
                },
                { status: 400 }
            );
        }

        // Log pour debug
        console.log(`[Transcribe API] Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

        // Texte de démonstration (mock)
        const mockTranscription = `Aujourd'hui c'était une journée incroyable !
            On a commencé par un petit déjeuner au marché local, avec des fruits frais et du café. L'ambiance était vraiment authentique, avec les vendeurs qui criaient leurs prix et les locaux qui faisaient leurs courses du matin.
            Ensuite on a pris un bus local pour aller voir les montagnes. Le trajet était un peu long, environ 2 heures, mais les paysages en valaient vraiment la peine. On a vu des lamas sur le bord de la route et des villages traditionnels.
            Une fois arrivés, on a fait une randonnée de 3 heures jusqu'à un point de vue magnifique. La vue sur la vallée était à couper le souffle. On a pique-niqué là-haut avec du pain, du fromage local et des avocats.
            Le retour était un peu fatigant, mais on a eu la chance de voir un coucher de soleil spectaculaire. Les couleurs étaient incroyables, entre le orange, le rose et le violet.
            Ce soir, on s'est reposés à l'hostel et on a rencontré d'autres voyageurs sympas. On a échangé nos bons plans et prévu de peut-être voyager ensemble demain.
            C'est vraiment le genre de journée qui rappelle pourquoi on voyage !`;

        return NextResponse.json({
            success: true,
            text: mockTranscription,
            meta: {
                filename: audioFile.name,
                duration_estimate: '~3 minutes',
                confidence: 0.95,
                language: 'fr',
                note: 'Ceci est une transcription de démonstration. En production, le fichier sera envoyé à un service de transcription réel.',
            },
        });
    } catch (error) {
        console.error('[Transcribe API] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur lors de la transcription',
            },
            { status: 500 }
        );
    }
}

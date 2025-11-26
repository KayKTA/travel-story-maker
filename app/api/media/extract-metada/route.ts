import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { MetadataExtractionResponse, ExifData } from '@/types';

/**
 * POST /api/media/extract-metadata
 *
 * API pour extraire les métadonnées (EXIF) d'un fichier média et créer l'enregistrement en base
 *
 * En production, cette API devrait :
 * 1. Télécharger le fichier depuis l'URL
 * 2. Extraire les métadonnées EXIF (avec sharp, exiftool, ou similaire)
 * 3. Créer l'enregistrement media_asset avec les données extraites
 *
 * Pour l'instant, on simule l'extraction avec des données mock.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { fileUrl, mediaType, tripId, journalEntryId, filename } = body;

        if (!fileUrl || !mediaType || !tripId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'fileUrl, mediaType et tripId sont requis',
                },
                { status: 400 }
            );
        }

        console.log(`[Media Metadata API] Processing: ${filename}, type: ${mediaType}`);

        // Simuler l'extraction des métadonnées
        // En production, utiliser sharp, exiftool, ou ffprobe pour les vidéos
        const mockMetadata = generateMockMetadata(mediaType);

        // Créer l'enregistrement en base
        const { data, error } = await supabase
            .from('media_assets')
            .insert({
                trip_id: tripId,
                journal_entry_id: journalEntryId || null,
                media_type: mediaType,
                url: fileUrl,
                thumbnail_url: null, // TODO: Générer une miniature
                taken_at: mockMetadata.taken_at,
                lat: mockMetadata.lat,
                lng: mockMetadata.lng,
                width: mockMetadata.width,
                height: mockMetadata.height,
                duration_seconds: mockMetadata.duration_seconds,
                exif: mockMetadata.exif,
            })
            .select()
            .single();

        if (error) {
            console.error('[Media Metadata API] DB Error:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            meta: {
                extracted: mockMetadata,
                note: 'Métadonnées simulées. En production, les vraies données EXIF seront extraites.',
            },
        });
    } catch (error) {
        console.error('[Media Metadata API] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur lors de l\'extraction des métadonnées',
            },
            { status: 500 }
        );
    }
}

/**
 * Génère des métadonnées simulées pour la démo
 */
function generateMockMetadata(mediaType: 'photo' | 'video') {
    // Générer une date aléatoire dans les 30 derniers jours
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const takenAt = new Date();
    takenAt.setDate(takenAt.getDate() - randomDaysAgo);

    // Générer des coordonnées aléatoires (quelque part en Amérique du Sud pour l'exemple)
    // ~50% de chance d'avoir des coordonnées GPS
    const hasGPS = Math.random() > 0.5;
    const lat = hasGPS ? -34 + (Math.random() * 20) - 10 : null; // Entre -44 et -24
    const lng = hasGPS ? -65 + (Math.random() * 20) - 10 : null; // Entre -75 et -55

    const baseMetadata = {
        taken_at: takenAt.toISOString(),
        lat,
        lng,
        width: null as number | null,
        height: null as number | null,
        duration_seconds: null as number | null,
        exif: null as ExifData | null,
    };

    if (mediaType === 'photo') {
        // Dimensions photo typiques
        const isPortrait = Math.random() > 0.6;
        baseMetadata.width = isPortrait ? 3024 : 4032;
        baseMetadata.height = isPortrait ? 4032 : 3024;

        // EXIF simulé
        baseMetadata.exif = {
            date_time_original: takenAt.toISOString(),
            gps_latitude: lat || undefined,
            gps_longitude: lng || undefined,
            make: 'Apple',
            model: 'iPhone 14 Pro',
            focal_length: 24,
            aperture: 1.8,
            shutter_speed: '1/125',
            iso: 100,
            orientation: 1,
            width: baseMetadata.width,
            height: baseMetadata.height,
        };
    } else {
        // Vidéo
        baseMetadata.width = Math.random() > 0.3 ? 1920 : 3840;
        baseMetadata.height = Math.random() > 0.3 ? 1080 : 2160;
        baseMetadata.duration_seconds = Math.floor(Math.random() * 120) + 5; // 5 à 125 secondes

        baseMetadata.exif = {
            date_time_original: takenAt.toISOString(),
            gps_latitude: lat || undefined,
            gps_longitude: lng || undefined,
            make: 'Apple',
            model: 'iPhone 14 Pro',
            width: baseMetadata.width,
            height: baseMetadata.height,
        };
    }

    return baseMetadata;
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Récupération du formData
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const rawTripId = formData.get('tripId');

        const tripId =
            typeof rawTripId === 'string' ? rawTripId.trim() : '';

        if (!file || !tripId) {
            console.error('[cover-image] Missing file or tripId', {
                hasFile: !!file,
                rawTripId,
            });
            return NextResponse.json(
                { error: 'Fichier et tripId requis' },
                { status: 400 },
            );
        }

        console.log('[cover-image] tripId from formData =', tripId);

        // Vérifier que le voyage existe
        const {
            data: trip,
            error: tripError,
        } = await supabase
            .from('trips')
            .select('id, cover_image_url')
            .eq('id', tripId)
            .single();

        console.log('[cover-image] trip select result =', {
            trip,
            tripError,
        });

        if (tripError || !trip) {
            // Ici tu peux voir dans les logs si c’est une erreur RLS ou juste "0 rows"
            return NextResponse.json(
                { error: 'Voyage non trouvé' },
                { status: 404 },
            );
        }

        // (si tu veux re-activer plus tard la vérif user, tu remets le check ici)

        // Supprimer l’ancienne cover si elle existe
        if (trip.cover_image_url) {
            const oldPath = extractPathFromUrl(trip.cover_image_url);
            if (oldPath) {
                await supabase.storage.from('media').remove([oldPath]);
            }
        }

        // Générer un nom unique
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `kay/${tripId}/${uuidv4()}.${fileExt}`;

        // Upload dans le bucket
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error('[cover-image] Upload error:', uploadError);
            return NextResponse.json(
                { error: "Erreur lors de l'upload" },
                { status: 500 },
            );
        }

        // URL publique
        const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        // Mise à jour du voyage
        const { error: updateError } = await supabase
            .from('trips')
            .update({ cover_image_url: imageUrl })
            .eq('id', tripId);

        if (updateError) {
            console.error('[cover-image] Update error:', updateError);
            return NextResponse.json(
                { error: "Erreur lors de la mise à jour" },
                { status: 500 },
            );
        }

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Cover image upload error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 },
        );
    }
}

// helper identique à ta version actuelle
function extractPathFromUrl(url: string): string | null {
    try {
        const match = url.match(/\/media\/(.+)$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

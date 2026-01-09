import { NextRequest, NextResponse } from 'next/server';

// GET /api/geocoding/reverse - Reverse geocoding via Nominatim
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'lat and lng are required' },
                },
                { status: 400 }
            );
        }

        // Call Nominatim API
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`;

        const response = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'TravelStoryMaker/1.0',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: true,
                    location: null,
                },
                { status: 200 }
            );
        }

        const data = await response.json();

        // Extract location from response
        let location: string | null = null;
        if (data.address) {
            const { city, town, village, county, state, country } = data.address;
            const parts = [
                city || town || village,
                county,
                state,
                country,
            ].filter(Boolean);
            location = parts.join(', ');
        }

        return NextResponse.json({
            success: true,
            location,
        });
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        return NextResponse.json(
            {
                success: true,
                location: null,
            },
            { status: 200 }
        );
    }
}

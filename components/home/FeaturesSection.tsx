// components/home/FeaturesSection.tsx
'use client';

import { Box, Container, Typography } from '@mui/material';
import {
    CameraAlt as CameraIcon,
    Map as MapIcon,
    AutoAwesome as MagicIcon,
    Book as JournalIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import FeatureCard from '@/components/home/FeatureCard';

const FEATURES = [
    {
        icon: <CameraIcon fontSize="medium" />,
        title: 'Photos & vidéos',
        description: 'Importe tes médias et récupère automatiquement dates et lieux.',
    },
    {
        icon: <JournalIcon fontSize="medium" />,
        title: 'Journal de bord',
        description: 'Écris ou dicte tes journées avec mood, tags et localisation.',
    },
    {
        icon: <MapIcon fontSize="medium" />,
        title: 'Carte interactive',
        description: 'Visualise ton itinéraire et revis ton voyage pays par pays.',
    },
    {
        icon: <ReceiptIcon fontSize="medium" />,
        title: 'Suivi des dépenses',
        description: 'Garde un œil sur ton budget par pays et par catégorie.',
    },
    {
        icon: <MagicIcon fontSize="medium" />,
        title: 'Stories IA',
        description: 'Génère résumés et scripts de reels à partir de tes données.',
    },
];

export default function FeaturesSection() {
    return (
        <Box id="features" component="section" sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.8rem', md: '2.1rem' },
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            mb: 1,
                        }}
                    >
                        Tout ton voyage, au même endroit.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 520,
                            mx: 'auto',
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                        }}
                    >
                        Journal, cartes, médias, budget et stories IA dans une interface pensée
                        pour les longs voyages.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gap: { xs: 3, md: 4 },
                        justifyItems: 'center',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))',
                            lg: 'repeat(5, minmax(0, 1fr))', // 5 sur une ligne en large
                        },
                    }}
                >
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

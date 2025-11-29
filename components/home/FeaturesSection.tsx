"use client";

import { Box, Typography, Grid } from "@mui/material";
import FeatureCard from "./FeatureCard";

const features = [
    // {
    //     image: "feature1.png",
    //     title: "Vue globale par pays",
    //     description:
    //         "Chaque pays possède sa page : dates, humeur, dépenses, médias et résumé.",
    // },
    {
        image: "feature1.png",
        title: "Itinéraire sur carte",
        description:
            "L’itinéraire se génère automatiquement à partir des étapes enregistrées.",
    },
    {
        image: "feature3.png",
        title: "Photos & vidéos reliées",
        description:
            "Tes médias sont attachés aux étapes correspondantes pour revivre ton voyage.",
    },
    {
        image: "feature6.png",
        title: "Journal de bord intelligent",
        description:
            "Écris ou dicte ta journée, l’app structure automatiquement ton récit.",
    },
    {
        image: "feature5.png",
        title: "Analyse des dépenses",
        description:
            "Catégories, graphiques, monnaies locales : tout ton budget clair et visuel.",
    },
    // {
    //     image: "feature4.png",
    //     title: "IA pour raconter ton voyage",
    //     description:
    //         "Génère résumés, scripts, captions et revues basées sur tes vraies données.",
    // },
];

export default function Features() {
    return (
        <Box
            sx={{
                px: 3,
                background: `
                    linear-gradient(
                        180deg,
                        #FFFFFF 0%,
                        rgba(255,226,140,0.15) 35%,
                        #FFFFFF 100%
                    )
                `,
            }}
        >
            <Box
                component="section"
                sx={{
                    py: { xs: 10, md: 14 },
                    maxWidth: "1100px",
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h2"
                    sx={{ textAlign: "center", mb: 2, fontWeight: 700 }}
                >
                    Tout ce qu’il faut pour ton voyage
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        textAlign: "center",
                        mb: { xs: 6, md: 8 },
                        maxWidth: 640,
                        mx: "auto",
                    }}
                >
                    Regroupe destinations, médias, émotions et budget dans une seule
                    app minimaliste pensée pour les voyageurs.
                </Typography>

                <Grid container spacing={{ xs: 4, md: 5 }}>
                    {features.map((f, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                            <FeatureCard
                                imageSrc={f.image}
                                title={f.title}
                                description={f.description}
                                blobVariant={i}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

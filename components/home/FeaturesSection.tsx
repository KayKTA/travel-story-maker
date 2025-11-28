"use client";

import { Box, Typography, Grid } from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import MapIcon from "@mui/icons-material/Map";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ImageIcon from "@mui/icons-material/Image";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const features = [
    {
        icon: <AirplaneTicketIcon fontSize="large" />,
        title: "Organise tes voyages",
        desc: "Ajoute tes pays, dates et lieux facilement.",
    },
    {
        icon: <MapIcon fontSize="large" />,
        title: "Carte interactive",
        desc: "Visualise ton parcours automatiquement.",
    },
    {
        icon: <ImageIcon fontSize="large" />,
        title: "Photos & vidéos",
        desc: "Importe tes médias, extraits automatiquement triés.",
    },
    {
        icon: <AutoStoriesIcon fontSize="large" />,
        title: "Journal immersif",
        desc: "Écris ou dicte chaque journée, mood inclus.",
    },
    {
        icon: <SmartToyIcon fontSize="large" />,
        title: "IA intégrée",
        desc: "Résumé, scripts, carrousels, reels… en un clic.",
    },
];

export default function Features() {
    return (
        <Box
            sx={{
                py: 10,
                px: 3,
                maxWidth:
                "1200px",
                mx: "auto"
            }}>
            <Typography variant="h3" sx={{ textAlign: "center", mb: 6 }}>
                Tout ce qu’il faut pour ton voyage
            </Typography>

            <Grid container spacing={6}>
                {features.map((f, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Box sx={{ mb: 2 }}>{f.icon}</Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {f.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {f.desc}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

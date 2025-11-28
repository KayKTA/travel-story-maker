"use client";

import { Box, Typography, Grid } from "@mui/material";

const steps = [
    { number: "1", title: "Crée ton voyage", desc: "Ajoute un pays, dates, villes." },
    { number: "2", title: "Importe tes médias", desc: "Photos, vidéos, audio & EXIF auto." },
    { number: "3", title: "Laisse l’IA travailler", desc: "Résumé, journal, reels automatiques." },
];

export default function HowItWorks() {
    return (
        <Box sx={{ py: 8, px: 3, maxWidth: "900px", mx: "auto" }}>
            <Typography variant="h3" sx={{ textAlign: "center", mb: 5 }}>
                Comment ça marche ?
            </Typography>

            <Grid container spacing={6}>
                {steps.map((step) => (
                    <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                {step.number}
                            </Box>
                            <Typography variant="h6">{step.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {step.desc}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

"use client";

import { Box, Button, Typography, useMediaQuery, useTheme, alpha } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const steps = [
    {
        number: "01",
        title: "Crée ton voyage",
        desc: "Ajoute un pays, tes dates clés et quelques infos sur le contexte.",
        detail:
            "Tu peux ensuite affiner par étapes (villes, régions) au fur et à mesure, sans pression.",
    },
    {
        number: "02",
        title: "Ajoute médias & journal",
        desc: "Importe tes photos/vidéos et note rapidement ce que tu as vécu.",
        detail:
            "Les coordonnées sont récupérées automatiquement quand c’est possible.",
    },
    {
        number: "03",
        title: "Laisse l’IA raconter",
        desc: "Génère résumés, scripts de reels, carrousels ou récap budget en un clic.",
        detail:
            "L’IA s’appuie sur tes étapes, tes émotions et tes dépenses pour créer un récit fidèle à ta réalité.",
    },
];

export default function HowItWorks() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                backgroundColor: "rgba(255, 230, 160, 0.15)",
                backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
                backgroundSize: "24px 24px",
            }}
        >
            <Box
                // component="section"
                sx={{
                    py: { xs: 10, md: 14 },
                    px: 3,
                    maxWidth: "1100px",
                    mx: "auto",
                }}
            >
                {/* TITLE */}
                <Typography
                    variant="h2"
                    sx={{ textAlign: "center", mb: 3, fontWeight: 700 }}
                >
                    Comment ça marche ?
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        textAlign: "center",
                        maxWidth: 640,
                        mx: "auto",
                        mb: { xs: 6, md: 10 },
                    }}
                >
                    Travel Story t’accompagne de la création du voyage jusqu’au récit final.
                </Typography>

                {/* ------- MOBILE VERSION ------- */}
                {isMobile && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {steps.map((step) => (
                            <Box key={step.number}>
                                {/* Keep the yellow circle */}
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        color: "primary.contrastText",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        mb: 1.5,
                                        boxShadow: theme.shadows[2],
                                    }}
                                >
                                    {step.number}
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, mb: 1 }}
                                >
                                    {step.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                    sx={{ mb: 0.5 }}
                                >
                                    {step.desc}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {step.detail}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* ------- DESKTOP VERSION ------- */}
                {!isMobile && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 4,
                            position: "relative",
                        }}
                    >
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;

                            return (
                                <Box
                                    key={step.number}
                                    sx={{
                                        flex: 1,
                                        textAlign: "left",
                                        position: "relative",
                                        px: 2,
                                    }}
                                >
                                    {/* Header row: yellow circle + title */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            mb: 2,
                                        }}
                                    >
                                        {/* Yellow circle */}
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "50%",
                                                bgcolor: "primary.main",
                                                color: "primary.contrastText",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                boxShadow: theme.shadows[2],
                                            }}
                                        >
                                            {step.number}
                                        </Box>

                                        {/* Title */}
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {step.title}
                                        </Typography>
                                    </Box>

                                    {/* Description */}
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {step.desc}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ maxWidth: 320, mx: "auto" }}
                                    >
                                        {step.detail}
                                    </Typography>

                                    {/* Line + Arrow */}
                                    {!isLast && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 24,
                                                right: "-12%",
                                                width: "15%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* <Box
                                                sx={{
                                                    flex: 1,
                                                    borderBottom:
                                                        "2px dotted rgba(0,0,0,0.28)",
                                                    mr: 1,
                                                }}
                                            /> */}
                                            <ArrowForwardIcon
                                                sx={{ color: "text.disabled", fontSize: 22 }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                )}
                <Box sx={{ textAlign: "center", mt: { xs: 8, md: 12 } }}>
                    <Button
                        href="/trips"
                        variant="outlined"
                        size="large"
                        endIcon={<ArrowForwardIcon className="how-arrow" />}
                        sx={{
                            borderRadius: 999,
                            px: 4,
                            py: 1.4,
                            fontWeight: 600,
                            borderColor: "primary.main",
                            color: "primary.main",
                            transition: "0.25s ease",
                            "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                borderColor: "primary.dark",
                            },
                            "& .how-arrow": {
                                transition: "transform 0.3s ease",
                            },
                            "&:hover .how-arrow": {
                                transform: "translateX(4px)",
                            },
                        }}
                    >
                        Créer mon premier voyage
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

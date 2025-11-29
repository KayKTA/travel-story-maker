"use client";

import { ArrowForward, Flight } from "@mui/icons-material";
import { Box, Typography, Button, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Brand from "../common/Brand";

export default function Hero() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                minHeight: 520,
                width: "100%",
                backgroundImage: "url('/images/hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                color: "common.white",
            }}
        >
            {/* overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(
                        to right,
                        ${alpha(theme.palette.common.black, 0.65)},
                        ${alpha(theme.palette.common.black, 0.25)}
                    )`,
                }}
            />

            {/* content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 560,
                    px: { xs: 3, sm: 6, md: 10 },
                    pb: { xs: 10, md: 20 },
                }}
            >
                <Brand />
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.1,
                        mb: 2,
                    }}
                >
                    Crée ton histoire de voyage,
                    simplement.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        opacity: 0.9,
                        maxWidth: 520,
                    }}
                >
                    Centralise tes destinations, médias, dépenses et journaux de
                    bord. Laisse l’IA transformer ton tour du monde en récit
                    prêt à partager.
                </Typography>

                <Button
                    href="/trips"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward className="hero-arrow" />}
                    sx={{
                        borderRadius: 999,
                        px: 4,
                        py: 1.6,
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        letterSpacing: 0.3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(
                            theme.palette.primary.main,
                            0.75
                        )})`,
                        transition: "0.25s ease",
                        position: "relative",
                        overflow: "hidden",

                        "&:hover": {
                            transform: "translateY(-2px)",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(
                                theme.palette.primary.light,
                                0.85
                            )})`,
                        },

                        // subtle breathing animation
                        animation: "heroButtonPulse 3.2s ease-in-out infinite",

                        "@keyframes heroButtonPulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.02)" },
                        },

                        "& .hero-arrow": {
                            transition: "transform 0.3s ease",
                        },
                        "&:hover .hero-arrow": {
                            transform: "translateX(4px)",
                        },
                    }}
                >
                    Commencer un voyage
                </Button>

            </Box>
        </Box>
    );
}

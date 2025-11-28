"use client";

import { ArrowForward } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";

export default function Hero() {
    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                width: "100%",
                backgroundImage: "url('/images/hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "common.white",
            }}
        >
            {/* overlay
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.45))",
                }}
            /> */}

            {/* content */}
            <Box sx={{ position: "relative", zIndex: 1, px: 3, maxWidth: 600 }}>
                <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
                    Crée ton histoire de voyage
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    Tes photos, tes souvenirs, ta carte, ton journal. Automatisé, simple, magnifique.
                </Typography>

                {/* <Button
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        bgcolor: "primary.main",
                        ":hover": {
                            bgcolor: "primary.dark",
                        },
                    }}
                >
                    Commencer
                </Button> */}
                <Button
                    // component={Link}
                    href="/trips"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                        borderRadius: 999,
                        px: 4,
                        py: 1.5,
                    }}
                >
                    Commencer un voyage
                </Button>
            </Box>
        </Box>
    );
}

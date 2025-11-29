"use client";

import { Box, Container, Typography, Link as MUILink } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                py: 3,
                // mt: 6,
                backgroundColor: theme.palette.primary.dark,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                >
                    Built with 💛 by
                </Typography>

                <MUILink
                    href="https://kay-kta.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.light,
                        transition: "0.2s ease",
                        "&:hover": {
                            color: alpha(theme.palette.primary.light, 0.8),
                        },
                    }}
                >
                    Kay Keita
                </MUILink>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        fontSize: "0.85rem",
                    }}
                >
                    · Travel Story © {new Date().getFullYear()}
                </Typography>
            </Container>
        </Box>
    );
}

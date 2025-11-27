'use client';

import { alpha } from '@mui/material/styles';
import { Box, Stack, Typography, useTheme } from '@mui/material';

export default function HeroPreview() {
    const theme = useTheme();

    return (
        <Stack
            spacing={2}
            alignItems="flex-end"
            sx={{
                width: '100%',
                maxWidth: 360,
                ml: { md: 'auto' },
            }}
        >
            {/* Badge "prochain voyage" */}
            <Box
                sx={{
                    alignSelf: 'stretch',
                    borderRadius: theme.shape.borderRadius,
                    px: 2,
                    py: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                }}
            >
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8 }}
                >
                    Prochain voyage
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Tour du Monde 2024–2025
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    12 pays · 326 jours · 1 seule app pour tout suivre.
                </Typography>
            </Box>

            {/* Ligne de stats */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignSelf: 'stretch',
                }}
            >
                {[
                    { label: 'Journal', value: '148 entrées' },
                    { label: 'Médias', value: '2 430 fichiers' },
                    { label: 'Budget', value: '18 catégories' },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 auto' },
                            borderRadius: theme.shape.borderRadius,
                            px: 1.5,
                            py: 1,
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}
                        >
                            {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Petite “pill” aujourd’hui */}
            <Box
                sx={{
                    borderRadius: 999,
                    px: 1.5,
                    py: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                }}
            >
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                    }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Ajouter une entrée pour aujourd’hui
                </Typography>
            </Box>
        </Stack>
    );
}

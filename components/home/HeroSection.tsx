'use client';

import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import HeroPreview from '@/components/home/HeroPreview';

export default function HeroSection() {
    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            <AppHeader />

            <Container
                maxWidth="lg"
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 10 },
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
                        columnGap: { xs: 4, md: 8 },
                        rowGap: { xs: 6, md: 0 },
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {/* Colonne gauche : texte */}
                    <Box>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.4rem' },
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: '-0.04em',
                                mb: 2,
                            }}
                        >
                            Raconte ton voyage
                            <br />
                            sans te perdre dans les notes.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: 440,
                                mb: 4,
                                fontSize: { xs: '0.95rem', md: '1rem' },
                            }}
                        >
                            Travel Story Maker centralise ton journal, tes photos, ton budget
                            et génère des résumés prêts à partager. Tu profites du voyage,
                            il s’occupe de la narration.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                component={Link}
                                href="/trips"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    borderRadius: 999,
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Commencer un voyage
                            </Button>
                            <Button
                                variant="text"
                                size="large"
                                sx={{ px: 2 }}
                                onClick={() =>
                                    document
                                        .getElementById('features')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                            >
                                Voir les fonctionnalités
                            </Button>
                        </Stack>
                    </Box>

                    {/* Colonne droite : mini preview, pas de “grosse carte” */}
                    <HeroPreview />
                </Box>
            </Container>
        </Box>
    );
}

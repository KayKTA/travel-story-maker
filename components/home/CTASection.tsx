'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

export default function CTASection() {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 8, md: 10 },
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        fontWeight: 700,
                        fontSize: { xs: '1.9rem', md: '2.3rem' },
                        letterSpacing: '-0.03em',
                    }}
                >
                    Prête pour le prochain départ ?
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mb: 4, color: 'text.secondary' }}
                >
                    Crée ton premier voyage, connecte tes médias et laisse Travel Story Maker t’aider à en
                    faire une histoire.
                </Typography>
                <Button
                    component={Link}
                    href="/trips"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 999, px: 5, py: 1.8 }}
                >
                    Créer un voyage
                </Button>
            </Container>
        </Box>
    );
}

'use client';

import { Box, Container, Typography } from '@mui/material';

export default function AppFooter() {
    return (
        <Box
            component="footer"
            sx={{
                borderTop: '1px solid rgba(148,163,184,0.25)',
                py: 3,
                mt: 2,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    fontSize: 12,
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Travel Story Maker
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Fait avec ❤️ pour documenter les grands voyages.
                </Typography>
            </Container>
        </Box>
    );
}

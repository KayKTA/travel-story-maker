'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function AppHeader() {
    return (
        <AppBar
            position="fixed"
            color="transparent"
            elevation={0}
            sx={{
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            }}
        >
            <Toolbar
                sx={{
                    maxWidth: 1200,
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, md: 3 },
                    minHeight: 64,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.03em' }}
                >
                    Travel Story
                </Typography>

                <Button
                    component={Link}
                    href="/trips"
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 999 }}
                >
                    Mes voyages
                </Button>
            </Toolbar>
        </AppBar>
    );
}

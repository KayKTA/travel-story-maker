'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();

    // Full-screen layout without navigation chrome
    // Navigation is handled within each page
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            {children}
        </Box>
    );
}

'use client';

import { Box, BoxProps, Container, Breakpoint } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps extends Omit<BoxProps, 'component' | 'maxWidth'> {
    children: ReactNode;
    withBottomPadding?: boolean;
    maxWidth?: Breakpoint | false;
}

/**
 * Consistent page container with proper padding and min-height
 */
export default function PageContainer({
    children,
    withBottomPadding = true,
    maxWidth,
    sx,
    ...props
}: PageContainerProps) {
    const content = maxWidth ? (
        <Container maxWidth={maxWidth} disableGutters>
            {children}
        </Container>
    ) : (
        children
    );

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                pb: withBottomPadding ? { xs: 10, sm: 4 } : 0,
                ...sx,
            }}
            {...props}
        >
            {content}
        </Box>
    );
}

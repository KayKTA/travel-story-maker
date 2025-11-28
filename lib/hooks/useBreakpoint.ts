'use client';

import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Hook for semantic breakpoint helpers
 * Replaces verbose useMediaQuery(theme.breakpoints.down('sm')) patterns
 */
export function useBreakpoint() {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    // Convenience helpers
    const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumDown = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));
    const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        isSmallDown,
        isMediumDown,
        isSmallUp,
        isMediumUp,
    };
}

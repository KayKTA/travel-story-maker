'use client';

import { useTheme, useMediaQuery as useMuiMediaQuery } from '@mui/material';

/**
 * Custom hook for responsive breakpoints
 * Provides semantic helpers for common breakpoint checks
 */
export function useBreakpoint() {
    const theme = useTheme();

    const isMobile = useMuiMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMuiMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMuiMediaQuery(theme.breakpoints.up('md'));
    const isLargeDesktop = useMuiMediaQuery(theme.breakpoints.up('lg'));

    // For specific checks
    const isSmallDown = useMuiMediaQuery(theme.breakpoints.down('sm'));
    const isMediumDown = useMuiMediaQuery(theme.breakpoints.down('md'));
    const isSmallUp = useMuiMediaQuery(theme.breakpoints.up('sm'));
    const isMediumUp = useMuiMediaQuery(theme.breakpoints.up('md'));

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

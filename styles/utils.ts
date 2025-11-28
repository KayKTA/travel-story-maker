// =============================================================================
// STYLE UTILITIES - Reusable SxProps patterns
// =============================================================================

import type { SxProps, Theme } from '@mui/material';
import { tokens } from './tokens';

// ---------------------------------------------------------------------------
// LAYOUT UTILITIES
// ---------------------------------------------------------------------------

/** Flexbox center alignment */
export const flexCenter: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

/** Flexbox space-between */
export const flexBetween: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

/** Flexbox start alignment */
export const flexStart: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
};

/** Flexbox column */
export const flexColumn: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
};

/** Absolute fill parent */
export const absoluteFill: SxProps<Theme> = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
};

/** Absolute top right corner */
export const absoluteTopRight: SxProps<Theme> = {
    position: 'absolute',
    top: 12,
    right: 12,
};

// ---------------------------------------------------------------------------
// TEXT UTILITIES
// ---------------------------------------------------------------------------

/**
 * Truncate text with ellipsis after N lines
 */
export const textTruncate = (lines: number = 1): SxProps<Theme> => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
});

/** Single line truncate */
export const textEllipsis: SxProps<Theme> = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

// ---------------------------------------------------------------------------
// SCROLLABLE CONTAINER
// ---------------------------------------------------------------------------

export const scrollable: SxProps<Theme> = {
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
        width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'divider',
        borderRadius: 3,
    },
};

export const hideScrollbar: SxProps<Theme> = {
    overflow: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
};

// ---------------------------------------------------------------------------
// HEADER STYLES
// ---------------------------------------------------------------------------

/** Primary header - Yellow background */
export const primaryHeader: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    position: 'relative',
};

/** Dark header - For contrast */
export const darkHeader: SxProps<Theme> = {
    bgcolor: 'text.primary',
    color: 'background.paper',
    position: 'relative',
};

/** Sticky header */
export const stickyHeader = (top: number = 0): SxProps<Theme> => ({
    position: 'sticky',
    top,
    zIndex: tokens.zIndex.header,
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider',
});

// ---------------------------------------------------------------------------
// CARD & INTERACTIVE STYLES
// ---------------------------------------------------------------------------

/** Interactive card with hover effect */
export const interactiveCard = (isSelected: boolean = false): SxProps<Theme> => ({
    cursor: 'pointer',
    transition: tokens.transitions.fast,
    borderColor: isSelected ? 'primary.main' : 'divider',
    bgcolor: isSelected ? 'primary.main' : 'background.paper',
    color: isSelected ? 'primary.contrastText' : 'text.primary',
    '&:hover': {
        borderColor: isSelected ? 'primary.dark' : 'text.disabled',
        transform: 'translateY(-1px)',
    },
});

/** Subtle card - no border, just shadow on hover */
export const subtleCard: SxProps<Theme> = {
    border: 'none',
    bgcolor: 'background.paper',
    transition: tokens.transitions.fast,
    '&:hover': {
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
};

// ---------------------------------------------------------------------------
// BADGE & CHIP STYLES
// ---------------------------------------------------------------------------

/** Status badge */
export const badge = (variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning' = 'primary'): SxProps<Theme> => {
    const colors = {
        primary: { bg: 'primary.main', color: 'primary.contrastText' },
        secondary: { bg: 'secondary.main', color: 'secondary.contrastText' },
        success: { bg: 'success.main', color: 'common.white' },
        error: { bg: 'error.main', color: 'common.white' },
        warning: { bg: 'warning.main', color: 'common.white' },
    };
    return {
        bgcolor: colors[variant].bg,
        color: colors[variant].color,
        px: 2,
        py: 0.5,
        borderRadius: tokens.radius.sm,
        fontWeight: tokens.fontWeights.medium,
        fontSize: '0.75rem',
    };
};

/** Primary chip - Yellow */
export const chipPrimary: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontWeight: tokens.fontWeights.medium,
    '&:hover': {
        bgcolor: 'primary.dark',
    },
};

/** Outlined chip */
export const chipOutlined: SxProps<Theme> = {
    bgcolor: 'transparent',
    border: 1,
    borderColor: 'divider',
    color: 'text.primary',
    fontWeight: tokens.fontWeights.medium,
};

/** Subtle chip - Light background */
export const chipSubtle: SxProps<Theme> = {
    bgcolor: 'action.hover',
    color: 'text.primary',
    fontWeight: tokens.fontWeights.medium,
};

// ---------------------------------------------------------------------------
// BUTTON STYLES
// ---------------------------------------------------------------------------

/** FAB primary style */
export const fabPrimary: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': {
        bgcolor: 'primary.dark',
    },
};

/** Icon button with background */
export const iconButtonFilled = (variant: 'primary' | 'subtle' = 'subtle'): SxProps<Theme> => ({
    bgcolor: variant === 'primary' ? 'primary.main' : 'action.hover',
    color: variant === 'primary' ? 'primary.contrastText' : 'text.primary',
    borderRadius: tokens.radius.sm,
    '&:hover': {
        bgcolor: variant === 'primary' ? 'primary.dark' : 'action.selected',
    },
});

// ---------------------------------------------------------------------------
// OVERLAY & GRADIENT
// ---------------------------------------------------------------------------

/** Gradient overlay for images */
export const overlayGradient = (direction: 'top' | 'bottom' = 'bottom'): SxProps<Theme> => ({
    position: 'absolute',
    left: 0,
    right: 0,
    [direction === 'bottom' ? 'bottom' : 'top']: 0,
    height: '50%',
    background: `linear-gradient(to ${direction}, transparent, rgba(0,0,0,0.6))`,
    pointerEvents: 'none',
});

// ---------------------------------------------------------------------------
// DRAWER & MODAL
// ---------------------------------------------------------------------------

/** Drawer handle bar */
export const drawerHandle: SxProps<Theme> = {
    width: 40,
    height: 4,
    backgroundColor: 'divider',
    borderRadius: 2,
    mx: 'auto',
    my: 1.5,
};

// ---------------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------------

/** Timeline dot style */
export const timelineDot = (color: string, isSelected: boolean = false): SxProps<Theme> => ({
    width: isSelected ? tokens.components.timeline.dotSize.selected : tokens.components.timeline.dotSize.default,
    height: isSelected ? tokens.components.timeline.dotSize.selected : tokens.components.timeline.dotSize.default,
    borderRadius: tokens.radius.circle,
    bgcolor: color,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: tokens.fontWeights.semibold,
    fontSize: isSelected ? '0.875rem' : '0.75rem',
    transition: tokens.transitions.fast,
    border: isSelected ? '3px solid' : '2px solid',
    borderColor: 'background.paper',
    boxShadow: isSelected ? '0 0 0 2px' : 'none',
});

// ---------------------------------------------------------------------------
// RESPONSIVE HELPERS
// ---------------------------------------------------------------------------

/**
 * Create responsive values
 */
export const responsive = (
    xs: string | number,
    sm?: string | number,
    md?: string | number,
    lg?: string | number
) => ({
    xs,
    sm: sm ?? xs,
    md: md ?? sm ?? xs,
    lg: lg ?? md ?? sm ?? xs,
});

// ---------------------------------------------------------------------------
// MERGE UTILITY
// ---------------------------------------------------------------------------

/**
 * Merge multiple sx props
 */
export const mergeSx = (...styles: (SxProps<Theme> | undefined)[]): SxProps<Theme> => {
    return styles.filter(Boolean).reduce((acc, style) => ({ ...acc, ...style }), {}) as SxProps<Theme>;
};

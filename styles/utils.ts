import type { SxProps, Theme } from '@mui/material';
import { tokens } from './tokens';

// ============================================
// Theme-aware style utilities
// Reusable sx prop generators
// ============================================

// Common layout patterns
export const flexCenter: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const flexBetween: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export const flexStart: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
};

export const flexColumn: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
};

// Text truncation
export const textTruncate = (lines: number = 1): SxProps<Theme> => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...(lines === 1
        ? { whiteSpace: 'nowrap' }
        : {
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
        }),
});

// Scrollable container
export const scrollable: SxProps<Theme> = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-thumb': {
        bgcolor: (theme) => theme.palette.action.hover,
        borderRadius: tokens.radius.sm,
    },
};

// Interactive card styles
export const interactiveCard = (isSelected?: boolean): SxProps<Theme> => ({
    transition: tokens.transitions.normal,
    cursor: 'pointer',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isSelected ? 4 : 1,
    border: 2,
    borderColor: isSelected ? 'warning.main' : 'transparent',
    '&:hover': {
        boxShadow: 3,
        transform: 'translateY(-2px)',
    },
});

// Sticky header
export const stickyHeader = (top: number | object = 0): SxProps<Theme> => ({
    position: 'sticky',
    top,
    zIndex: tokens.zIndex.header,
    bgcolor: 'background.paper',
});

// Dark header (for page headers)
export const darkHeader: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
};

// Absolute positioning helpers
export const absoluteFill: SxProps<Theme> = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
};

export const absoluteTopRight: SxProps<Theme> = {
    position: 'absolute',
    top: 12,
    right: 12,
};

export const absoluteBottomLeft: SxProps<Theme> = {
    position: 'absolute',
    bottom: 16,
    left: 16,
};

// Badge styling
export const badge = (variant: 'primary' | 'secondary' | 'warning' = 'primary'): SxProps<Theme> => {
    const colors = {
        primary: { bg: 'primary.main', text: 'primary.contrastText' },
        secondary: { bg: 'secondary.main', text: 'secondary.contrastText' },
        warning: { bg: 'warning.main', text: 'primary.main' },
    };

    return {
        bgcolor: colors[variant].bg,
        color: colors[variant].text,
        fontWeight: tokens.fontWeights.bold,
        borderRadius: tokens.radius.pill,
        px: 1.5,
        py: 0.5,
    };
};

// Chip variants
export const chipPrimary: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontWeight: tokens.fontWeights.bold,
    '&:hover': { bgcolor: 'primary.light' },
};

export const chipSecondary: SxProps<Theme> = {
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
    fontWeight: tokens.fontWeights.bold,
    '&:hover': { bgcolor: 'secondary.light' },
};

export const chipOutlined: SxProps<Theme> = {
    borderWidth: 2,
    borderColor: 'primary.main',
    fontWeight: tokens.fontWeights.bold,
};

// FAB styling
export const fabPrimary: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': { bgcolor: 'primary.light' },
};

// Icon button with background
export const iconButtonFilled = (variant: 'light' | 'dark' = 'light'): SxProps<Theme> => ({
    bgcolor: variant === 'light'
        ? (theme) => theme.palette.action.hover
        : 'primary.main',
    color: variant === 'light' ? 'text.primary' : 'primary.contrastText',
    '&:hover': {
        bgcolor: variant === 'light'
            ? (theme) => theme.palette.action.selected
            : 'primary.light',
    },
});

// Paper overlay gradient
export const overlayGradient = (direction: 'top' | 'bottom' = 'top'): SxProps<Theme> => ({
    position: 'absolute',
    inset: direction === 'top' ? '0 0 auto 0' : 'auto 0 0 0',
    p: 2,
    background: (theme) =>
        `linear-gradient(to ${direction}, ${theme.palette.common.black}00, ${theme.palette.common.black}B3)`,
});

// Drawer handle
export const drawerHandle: SxProps<Theme> = {
    width: tokens.components.drawer.handleWidth,
    height: tokens.components.drawer.handleHeight,
    borderRadius: tokens.radius.sm,
    bgcolor: (theme) => theme.palette.action.disabled,
    mx: 'auto',
};

// Timeline dot
export const timelineDot = (color: string, isSelected: boolean): SxProps<Theme> => ({
    width: isSelected ? tokens.components.timeline.dotSize.selected : tokens.components.timeline.dotSize.default,
    height: isSelected ? tokens.components.timeline.dotSize.selected : tokens.components.timeline.dotSize.default,
    borderRadius: tokens.radius.circle,
    bgcolor: color,
    border: 3,
    borderStyle: 'solid',
    borderColor: isSelected ? 'warning.main' : 'background.paper',
    boxShadow: isSelected ? (theme) => `0 0 0 3px ${theme.palette.warning.light}40` : 'none',
    transition: tokens.transitions.normal,
    ...flexCenter,
    zIndex: 1,
});

// Responsive value helper
export const responsive = <T>(xs: T, sm?: T, md?: T, lg?: T): { xs: T; sm?: T; md?: T; lg?: T } => ({
    xs,
    ...(sm !== undefined && { sm }),
    ...(md !== undefined && { md }),
    ...(lg !== undefined && { lg }),
});

// Merge sx props helper
export const mergeSx = (...styles: (SxProps<Theme> | undefined)[]): SxProps<Theme> => {
    return styles.filter(Boolean).reduce((acc, style) => ({ ...acc, ...style }), {}) as SxProps<Theme>;
};

'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// =============================================================================
// MINIMALIST DESIGN TOKENS
// =============================================================================

// Color palette - Clean & Minimal with Yellow accent
const colors = {
    // Primary - Warm Yellow
    primary: {
        main: '#FACC15',      // Vibrant yellow
        light: '#FDE047',     // Light yellow
        dark: '#EAB308',      // Dark yellow
        contrastText: '#18181B',
    },
    // Secondary - Neutral slate
    secondary: {
        main: '#64748B',      // Slate gray
        light: '#94A3B8',
        dark: '#475569',
        contrastText: '#FFFFFF',
    },
    // Backgrounds - Clean whites and light grays
    background: {
        default: '#FAFAFA',   // Off-white
        paper: '#FFFFFF',     // Pure white
        subtle: '#F4F4F5',    // Light gray
    },
    // Text - High contrast
    text: {
        primary: '#18181B',   // Near black
        secondary: '#71717A', // Medium gray
        disabled: '#A1A1AA',  // Light gray
    },
    // Semantic colors - Muted
    success: {
        main: '#22C55E',
        light: '#4ADE80',
        dark: '#16A34A',
    },
    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
    },
    error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
    },
    info: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
    },
    // Dividers & borders
    divider: '#E4E4E7',
    border: '#E4E4E7',
};

// Typography - Clean sans-serif
const typography = {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
    },
    h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.35,
    },
    h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
    },
    subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
    },
    subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
    },
    body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: colors.text.secondary,
    },
    button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none' as const,
        letterSpacing: '0.01em',
    },
};

// Spacing - 4px base
const spacing = 4;

// Border radius - Subtle rounded corners
const shape = {
    borderRadius: 8,
};

// =============================================================================
// COMPONENT OVERRIDES
// =============================================================================

const components = {
    // Global styles
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: colors.background.default,
                color: colors.text.primary,
            },
            '*': {
                boxSizing: 'border-box',
            },
            '::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
            },
            '::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
                background: colors.divider,
                borderRadius: '3px',
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: colors.text.disabled,
            },
        },
    },

    // Paper - Flat design
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                border: `1px solid ${colors.border}`,
            },
            elevation0: {
                boxShadow: 'none',
            },
            elevation1: {
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            },
            elevation2: {
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            },
        },
    },

    // Card - Clean and minimal
    MuiCard: {
        defaultProps: {
            elevation: 0,
        },
        styleOverrides: {
            root: {
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                    borderColor: colors.text.disabled,
                },
            },
        },
    },

    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 20,
                '&:last-child': {
                    paddingBottom: 20,
                },
            },
        },
    },

    // Buttons - Flat and clean
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
            },
            contained: {
                '&:hover': {
                    transform: 'translateY(-1px)',
                },
            },
            containedPrimary: {
                backgroundColor: colors.primary.main,
                color: colors.primary.contrastText,
                '&:hover': {
                    backgroundColor: colors.primary.dark,
                },
            },
            outlined: {
                borderColor: colors.border,
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                    borderColor: colors.text.disabled,
                },
            },
            text: {
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                },
            },
        },
    },

    // IconButton
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                transition: 'background-color 0.15s ease',
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                },
            },
        },
    },

    // TextField - Minimal borders
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            size: 'medium',
        },
    },

    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                backgroundColor: colors.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                    transition: 'border-color 0.15s ease',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.text.disabled,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.main,
                    borderWidth: 2,
                },
            },
        },
    },

    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: colors.text.secondary,
                '&.Mui-focused': {
                    color: colors.primary.dark,
                },
            },
        },
    },

    // Chip - Subtle and flat
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                fontWeight: 500,
                height: 28,
            },
            filled: {
                backgroundColor: colors.background.subtle,
                '&:hover': {
                    backgroundColor: colors.divider,
                },
            },
            outlined: {
                borderColor: colors.border,
            },
            colorPrimary: {
                backgroundColor: `${colors.primary.main}20`,
                color: colors.primary.dark,
                '&:hover': {
                    backgroundColor: `${colors.primary.main}30`,
                },
            },
        },
    },

    // Tabs - Clean underline style
    MuiTabs: {
        styleOverrides: {
            root: {
                minHeight: 44,
            },
            indicator: {
                height: 2,
                borderRadius: 1,
                backgroundColor: colors.primary.main,
            },
        },
    },

    MuiTab: {
        styleOverrides: {
            root: {
                minHeight: 44,
                padding: '8px 16px',
                fontWeight: 500,
                color: colors.text.secondary,
                transition: 'color 0.15s ease',
                '&:hover': {
                    color: colors.text.primary,
                },
                '&.Mui-selected': {
                    color: colors.text.primary,
                },
            },
        },
    },

    // Dialog - Clean and centered
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            },
        },
    },

    MuiDialogTitle: {
        styleOverrides: {
            root: {
                padding: '20px 24px',
                fontSize: '1.125rem',
                fontWeight: 600,
            },
        },
    },

    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: '20px 24px',
            },
        },
    },

    MuiDialogActions: {
        styleOverrides: {
            root: {
                padding: '16px 24px',
                gap: 8,
            },
        },
    },

    // Drawer - Subtle shadow
    MuiDrawer: {
        styleOverrides: {
            paper: {
                border: 'none',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            },
        },
    },

    // Menu & Select
    MuiMenu: {
        styleOverrides: {
            paper: {
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
        },
    },

    MuiMenuItem: {
        styleOverrides: {
            root: {
                padding: '8px 16px',
                borderRadius: 4,
                margin: '2px 4px',
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                },
                '&.Mui-selected': {
                    backgroundColor: `${colors.primary.main}15`,
                    '&:hover': {
                        backgroundColor: `${colors.primary.main}25`,
                    },
                },
            },
        },
    },

    // Table - Clean lines
    MuiTableHead: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background.subtle,
            },
        },
    },

    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: `1px solid ${colors.border}`,
                padding: '12px 16px',
            },
            head: {
                fontWeight: 600,
                color: colors.text.secondary,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            },
        },
    },

    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                },
                '&:last-child td': {
                    borderBottom: 0,
                },
            },
        },
    },

    // Tooltip - Minimal
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: colors.text.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 6,
            },
            arrow: {
                color: colors.text.primary,
            },
        },
    },

    // Avatar
    MuiAvatar: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background.subtle,
                color: colors.text.secondary,
                fontWeight: 500,
            },
        },
    },

    // Badge
    MuiBadge: {
        styleOverrides: {
            badge: {
                fontWeight: 600,
                fontSize: '0.7rem',
            },
        },
    },

    // Alert - Subtle backgrounds
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                border: '1px solid',
            },
            standardSuccess: {
                backgroundColor: `${colors.success.main}10`,
                borderColor: `${colors.success.main}30`,
                color: colors.success.dark,
            },
            standardError: {
                backgroundColor: `${colors.error.main}10`,
                borderColor: `${colors.error.main}30`,
                color: colors.error.dark,
            },
            standardWarning: {
                backgroundColor: `${colors.warning.main}10`,
                borderColor: `${colors.warning.main}30`,
                color: colors.warning.dark,
            },
            standardInfo: {
                backgroundColor: `${colors.info.main}10`,
                borderColor: `${colors.info.main}30`,
                color: colors.info.dark,
            },
        },
    },

    // Linear Progress
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                backgroundColor: colors.background.subtle,
            },
        },
    },

    // Skeleton
    MuiSkeleton: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background.subtle,
            },
        },
    },

    // Fab - Flat
    MuiFab: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                },
            },
            primary: {
                backgroundColor: colors.primary.main,
                color: colors.primary.contrastText,
                '&:hover': {
                    backgroundColor: colors.primary.dark,
                },
            },
        },
    },

    // Speed Dial
    MuiSpeedDial: {
        styleOverrides: {
            fab: {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
        },
    },

    MuiSpeedDialAction: {
        styleOverrides: {
            fab: {
                backgroundColor: colors.background.paper,
                color: colors.text.primary,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                '&:hover': {
                    backgroundColor: colors.background.subtle,
                },
            },
        },
    },
};

// =============================================================================
// CREATE THEME
// =============================================================================

let theme = createTheme({
    palette: {
        mode: 'light',
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        text: colors.text,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        divider: colors.divider,
        action: {
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
    },
    typography,
    spacing,
    shape,
    components,
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;

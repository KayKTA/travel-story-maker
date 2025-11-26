'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// ============================================
// Travel Story Maker - Theme Configuration
// ============================================

const palette = {
    primary: {
        main: '#0F766E', // Teal - reminiscent of ocean & nature
        light: '#14B8A6',
        dark: '#0D9488',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#F59E0B', // Amber - warmth, sunset
        light: '#FBBF24',
        dark: '#D97706',
        contrastText: '#000000',
    },
    error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
    },
    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
    },
    success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
    },
    info: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
    },
    grey: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    background: {
        default: '#FAFAFA',
        paper: '#FFFFFF',
    },
    text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        disabled: '#9CA3AF',
    },
};

// Mood colors for consistent mood visualization
export const moodColors: Record<string, string> = {
    // Trip moods
    amazing: '#10B981',
    great: '#34D399',
    good: '#60A5FA',
    mixed: '#FBBF24',
    challenging: '#F97316',
    difficult: '#EF4444',
    // Journal moods
    excited: '#EC4899',
    happy: '#10B981',
    peaceful: '#60A5FA',
    tired: '#9CA3AF',
    frustrated: '#F97316',
    sad: '#6366F1',
    adventurous: '#F59E0B',
    inspired: '#8B5CF6',
};

// Category colors for expenses
export const categoryColors: Record<string, string> = {
    transport: '#3B82F6',
    logement: '#8B5CF6',
    food: '#F59E0B',
    activite: '#10B981',
    shopping: '#EC4899',
    autre: '#6B7280',
};

let theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid',
                    borderColor: palette.grey[200],
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
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '4px 0 6px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;

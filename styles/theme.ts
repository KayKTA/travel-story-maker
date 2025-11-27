'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// ============================================
// Travel Story Maker - Theme Configuration
// Mochi Yellow – une seule gamme de jaunes
// ============================================

const palette = {
    primary: {
        main: '#F5B82E',      // jaune principal
        light: '#FFE69A',     // jaune clair
        dark: '#C99A1D',      // jaune plus foncé
        contrastText: '#3F3008', // jaune très foncé pour le texte
    },
    secondary: {
        // jaune un peu plus “orangé” pour varier
        main: '#E39A2E',
        light: '#F4C170',
        dark: '#B87411',
        contrastText: '#3F3008',
    },
    error: {
        main: '#D64545',
        light: '#E86B6B',
        dark: '#B33030',
    },
    warning: {
        main: '#F5B82E',
        light: '#FFE69A',
        dark: '#C99A1D',
    },
    success: {
        main: '#6BAF3D', // vert chaud (ok pour feedback)
        light: '#91C86B',
        dark: '#447927',
    },
    info: {
        main: '#E39A2E',
        light: '#F4C170',
        dark: '#B87411',
    },
    grey: {
        50: '#FFF7DA',
        100: '#FBECC2',
        200: '#F2DCA0',
        300: '#E3C36E',
        400: '#CCA247',
        500: '#A27C32',
        600: '#7F5F23',
        700: '#5F4519',
        800: '#3F3008', // jaune très foncé au lieu de noir
        900: '#2E2105',
    },
    background: {
        default: '#F5B82E', // body
        paper: '#FFFDF5',   // cartes / panneaux
    },
    text: {
        primary: '#3F3008',   // texte principal (jaune très foncé)
        secondary: '#7F5F23', // texte secondaire
        disabled: '#A27C32',
    },
} as const;

// Mood colors (adaptés à la palette)
export const moodColors: Record<string, string> = {
    // Trip moods
    amazing: '#6BAF3D',
    great: '#91C86B',
    good: '#E39A2E',
    mixed: '#F2DCA0',
    challenging: '#E39A2E',
    difficult: '#D64545',

    // Journal moods
    excited: '#D64545',
    happy: '#F5B82E',
    tired: '#A27C32',
    frustrated: '#E39A2E',
    sad: '#5F4519',
    adventurous: '#CCA247',
    inspired: '#C87BAC',
    chill: '#6BAF3D',
    neutral: '#7F5F23',
    in_love: '#D64545',
    underwhelmed: '#A27C32',
};

// Category colors pour les dépenses (toujours cohérents avec la palette)
export const categoryColors: Record<string, string> = {
    transport: '#E39A2E',
    logement: '#C87BAC',
    food: '#F2DCA0',
    activite: '#6BAF3D',
    shopping: '#D64545',
    autre: '#7F5F23',
};

let theme = createTheme({
    palette,
    typography: {
        fontFamily:
            '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: {
            fontSize: '3.0rem',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
        },
        h2: {
            fontSize: '2.2rem',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontSize: '1.6rem',
            fontWeight: 700,
            lineHeight: 1.15,
        },
        h4: {
            fontSize: '1.3rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h5: {
            fontSize: '1.05rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h6: {
            fontSize: '0.95rem',
            fontWeight: 600,
            lineHeight: 1.35,
        },
        body1: {
            fontSize: '0.98rem',
            lineHeight: 1.6,
            fontWeight: 500,
        },
        body2: {
            fontSize: '0.86rem',
            lineHeight: 1.55,
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: 0.4,
        },
        caption: {
            fontSize: '0.74rem',
            lineHeight: 1.4,
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    // Pas d’ombres globales → look très plat
    shadows: Array(25).fill('none') as any,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: palette.background.default,
                    color: palette.text.primary,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: palette.background.paper,
                    borderRadius: 16,
                    border: '1px solid rgba(63, 48, 8, 0.06)',
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid rgba(63, 48, 8, 0.06)',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    padding: '9px 20px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    backgroundColor: palette.primary.main,
                    color: palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: palette.primary.dark,
                    },
                },
                containedSecondary: {
                    backgroundColor: palette.secondary.main,
                    color: palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: palette.secondary.dark,
                    },
                },
                outlined: {
                    borderWidth: 1,
                    borderColor: palette.primary.dark,
                    color: palette.primary.dark,
                    '&:hover': {
                        borderWidth: 1,
                        borderColor: palette.primary.dark,
                        backgroundColor: 'rgba(242, 220, 160, 0.3)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 600,
                },
                filled: {
                    backgroundColor: palette.grey[100],
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    backgroundColor: palette.primary.dark,
                    color: palette.primary.contrastText,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: 999,
                    backgroundColor: palette.primary.dark,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    minHeight: 48,
                },
            },
        },
    },
});

// Applique les tailles de police responsives
theme = responsiveFontSizes(theme);

export default theme;

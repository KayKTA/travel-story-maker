'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { tokens } from './tokens';

// Petites ombres très discrètes
const flatShadows = Array(25).fill('none') as string[];
flatShadows[1] = '0 1px 2px rgba(63, 48, 8, 0.04)';
flatShadows[2] = '0 2px 6px rgba(63, 48, 8, 0.06)';

let theme = createTheme({
    palette: {
        primary: {
            main: tokens.colors.primary.main,
            light: tokens.colors.primary.light,
            dark: tokens.colors.primary.dark,
            contrastText: tokens.colors.primary.contrast,
        },
        secondary: {
            main: tokens.colors.secondary.main,
            light: tokens.colors.secondary.light,
            dark: tokens.colors.secondary.dark,
            contrastText: tokens.colors.secondary.contrast,
        },
        background: {
            default: tokens.colors.background.default,
            paper: tokens.colors.background.paper,
        },
        text: {
            primary: tokens.colors.text.primary,
            secondary: tokens.colors.text.secondary,
            disabled: tokens.colors.text.disabled,
        },
        divider: tokens.colors.border,
        success: { main: tokens.colors.success },
        warning: { main: tokens.colors.warning },
        error: { main: tokens.colors.error },
        info: { main: tokens.colors.info },
    },

    shape: {
        borderRadius: tokens.radius.lg,
    },

    typography: {
        fontFamily:
            '"DM Sans", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
        h1: {
            fontSize: '2.75rem',
            fontWeight: tokens.fontWeights.bold,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
        },
        h2: {
            fontSize: '2.1rem',
            fontWeight: tokens.fontWeights.semibold,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
        },
        h3: {
            fontSize: '1.6rem',
            fontWeight: tokens.fontWeights.semibold,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.35rem',
            fontWeight: tokens.fontWeights.semibold,
        },
        h5: {
            fontSize: '1.1rem',
            fontWeight: tokens.fontWeights.medium,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: tokens.fontWeights.medium,
        },
        body1: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.85rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: tokens.fontWeights.medium,
            letterSpacing: 0,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.4,
        },
    },

    shadows: flatShadows as any,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: tokens.colors.background.default,
                    color: tokens.colors.text.primary,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: tokens.components.button.borderRadius,
                    paddingInline: tokens.components.button.paddingX,
                    paddingBlock: tokens.components.button.paddingY,
                    fontWeight: tokens.fontWeights.medium,
                    boxShadow: 'none',
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                outlined: {
                    borderColor: tokens.colors.border,
                    '&:hover': {
                        borderColor: tokens.colors.primary.main,
                        backgroundColor: tokens.colors.background.subtle,
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: tokens.components.card.borderRadius,
                    border: tokens.components.card.border,
                    boxShadow: 'none',
                    backgroundColor: tokens.colors.background.paper,
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: tokens.radius.lg,
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: tokens.components.input.borderRadius,
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: tokens.components.chip.borderRadius,
                    fontWeight: tokens.fontWeights.medium,
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: tokens.fontWeights.medium,
                    minWidth: 0,
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;

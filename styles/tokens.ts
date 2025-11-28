// =============================================================================
// DESIGN TOKENS - Minimalist Yellow Theme
// =============================================================================

/**
 * Centralized design tokens for consistent styling across the app.
 * Use these instead of hardcoded values.
 */
export const tokens = {
    // ---------------------------------------------------------------------------
    // COLORS
    // ---------------------------------------------------------------------------
    colors: {
        primary: {
            main: '#FACC15',   // jaune principal
            light: '#FDE68A',  // jaune doux
            dark: '#EAB308',   // jaune plus profond
            contrast: '#3F3008', // texte sur fond jaune (brun chaud, pas noir)
        },
        secondary: {
            main: '#A1A1AA',   // gris neutre
            light: '#D4D4D8',
            dark: '#71717A',
            contrast: '#FFFFFF',
        },
        background: {
            default: '#FAFAF5', // fond général (crème très clair)
            paper: '#FFFFFF',   // cartes / surfaces
            subtle: '#F5F1E5',  // bandeaux, sections
        },
        text: {
            primary: '#3F3008',   // brun chaud (remplace le noir)
            secondary: '#7A6A3A', // brun plus léger
            disabled: '#B7A57A',
        },
        success: '#3BAA6C',
        warning: '#EAB308',
        error: '#E25A4F',
        info: '#A1A1AA',
        border: '#E5E5DC',
    },

    // ---------------------------------------------------------------------------
    // SPACING (MUI units - 1 unit = 4px)
    // ---------------------------------------------------------------------------
    spacing: {
        xs: 1,   // 4px
        sm: 2,   // 8px
        md: 4,   // 16px
        lg: 6,   // 24px
        xl: 8,   // 32px
        xxl: 12, // 48px
    },

    // ---------------------------------------------------------------------------
    // BORDER RADIUS (px)
    // ---------------------------------------------------------------------------
    radius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 12,
        pill: 999,
        circle: '50%',
    },

    // ---------------------------------------------------------------------------
    // TRANSITIONS
    // ---------------------------------------------------------------------------
    transitions: {
        fast: '0.15s ease-out',
        normal: '0.2s ease-out',
        slow: '0.3s ease-out',
    },

    // ---------------------------------------------------------------------------
    // Z-INDEX
    // ---------------------------------------------------------------------------
    zIndex: {
        drawer: 1200,
        modal: 1300,
        tooltip: 1500,
        header: 10,
        tabs: 5,
        fab: 1050,
    },

    // ---------------------------------------------------------------------------
    // FONT WEIGHTS
    // ---------------------------------------------------------------------------
    fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // ---------------------------------------------------------------------------
    // ICON SIZES
    // ---------------------------------------------------------------------------
    iconSizes: {
        xs: 14,
        sm: 18,
        md: 24,
        lg: 32,
        xl: 40,
    },

    // ---------------------------------------------------------------------------
    // COMPONENT TOKENS
    // ---------------------------------------------------------------------------
    components: {
        card: {
            borderRadius: 12,
            padding: 20,
            border: '1px solid #E5E5DC',
        },
        button: {
            borderRadius: 999,
            paddingX: 18,
            paddingY: 10,
        },
        input: {
            borderRadius: 10,
            height: 44,
        },
        chip: {
            borderRadius: 999,
            height: 26,
        },
        header: {
            height: 64,
            mobileHeight: 56,
        },
        drawer: {
            borderRadius: 16,
            handleWidth: 40,
        },
        timeline: {
            lineWidth: 2,
            dotSize: {
                default: 24,
                selected: 28,
            },
        },
        thumbnail: {
            sizes: {
                sm: 36,
                md: 44,
                lg: 52,
            },
        },
    },
};

// ---------------------------------------------------------------------------
// MOOD COLORS (trip + journal) - palette jaune & neutres
// ---------------------------------------------------------------------------
export const moodColors: Record<string, string> = {
    // Trip moods
    amazing: '#FACC15',
    great: '#FDE047',
    good: '#FEF3C7',
    mixed: '#FCD34D',
    challenging: '#EAB308',
    difficult: '#B45309',

    // Journal moods
    excited: '#FACC15',
    happy: '#FDE047',
    tired: '#C4B28A',
    frustrated: '#D97706',
    sad: '#8C8A80',
    adventurous: '#EAB308',
    inspired: '#FDE68A',
    chill: '#E5E7EB',
    neutral: '#D4D4D4',
    in_love: '#FACC15',
    underwhelmed: '#A1A1AA',
};

// ---------------------------------------------------------------------------
// CATEGORY COLORS (for expenses) - Pastel harmonious palette
// ---------------------------------------------------------------------------
export const categoryColors: Record<string, string> = {
    logement: '#C4B5FD',      // Soft purple
    transport: '#93C5FD',     // Soft blue
    food: '#FCD34D',          // Soft yellow/gold
    activite: '#6EE7B7',      // Soft mint green
    sorties: '#F9A8D4',       // Soft pink
    shopping: '#FDBA74',      // Soft orange
    blanchisserie: '#67E8F9', // Soft cyan
    internet: '#7DD3FC',      // Soft sky blue
    banque: '#A5B4FC',        // Soft indigo
    equipement: '#BEF264',    // Soft lime
    sante: '#FCA5A5',         // Soft red
    general: '#D1D5DB',       // Soft gray
    autre: '#E5E7EB',         // Light gray
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/** Create a color with alpha transparency */
export function alpha(color: string, opacity: number): string {
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
}

export default tokens;

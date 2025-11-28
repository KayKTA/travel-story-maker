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
            main: '#FACC15',
            light: '#FDE047',
            dark: '#EAB308',
            contrast: '#18181B',
        },
        secondary: {
            main: '#64748B',
            light: '#94A3B8',
            dark: '#475569',
            contrast: '#FFFFFF',
        },
        background: {
            default: '#FAFAFA',
            paper: '#FFFFFF',
            subtle: '#F4F4F5',
        },
        text: {
            primary: '#18181B',
            secondary: '#71717A',
            disabled: '#A1A1AA',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: '#E4E4E7',
    },

    // ---------------------------------------------------------------------------
    // SPACING (in MUI units - 1 unit = 4px)
    // ---------------------------------------------------------------------------
    spacing: {
        xs: 1,      // 4px
        sm: 2,      // 8px
        md: 4,      // 16px
        lg: 6,      // 24px
        xl: 8,      // 32px
        xxl: 12,    // 48px
    },

    // ---------------------------------------------------------------------------
    // BORDER RADIUS (in MUI units - 1 unit = 4px)
    // ---------------------------------------------------------------------------
    radius: {
        xs: 1,      // 4px
        sm: 2,      // 8px
        md: 3,      // 12px
        lg: 4,      // 16px
        xl: 6,      // 24px
        pill: 50,   // Full rounded
        circle: '50%',
    },

    // ---------------------------------------------------------------------------
    // TRANSITIONS
    // ---------------------------------------------------------------------------
    transitions: {
        fast: '0.15s ease',
        normal: '0.2s ease',
        slow: '0.3s ease',
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
        bold: 600,      // Using 600 for cleaner look
    },

    // ---------------------------------------------------------------------------
    // ICON SIZES
    // ---------------------------------------------------------------------------
    iconSizes: {
        xs: 14,
        sm: 18,
        md: 24,
        lg: 32,
        xl: 48,
    },

    // ---------------------------------------------------------------------------
    // COMPONENT TOKENS
    // ---------------------------------------------------------------------------
    components: {
        card: {
            borderRadius: 12,
            padding: 20,
            border: '1px solid #E4E4E7',
        },
        button: {
            borderRadius: 8,
            paddingX: 16,
            paddingY: 8,
        },
        input: {
            borderRadius: 8,
            height: 44,
        },
        chip: {
            borderRadius: 6,
            height: 28,
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
                default: 28,
                selected: 32,
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
// MOOD COLORS (for journal entries)
// ---------------------------------------------------------------------------
export const moodColors: Record<string, string> = {
    amazing: '#22C55E',
    happy: '#4ADE80',
    good: '#86EFAC',
    okay: '#FDE047',
    neutral: '#A1A1AA',
    tired: '#94A3B8',
    sad: '#64748B',
    frustrated: '#F97316',
    stressed: '#EF4444',
    sick: '#F87171',
    adventurous: '#3B82F6',
};

// ---------------------------------------------------------------------------
// CATEGORY COLORS (for expenses)
// ---------------------------------------------------------------------------
export const categoryColors: Record<string, string> = {
    transport: '#3B82F6',
    hebergement: '#8B5CF6',
    nourriture: '#22C55E',
    activite: '#F59E0B',
    shopping: '#EC4899',
    autre: '#64748B',
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Create a color with alpha transparency
 */
export function alpha(color: string, opacity: number): string {
    // For hex colors, convert to rgba
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

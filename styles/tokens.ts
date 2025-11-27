// ============================================
// Theme Tokens - Design System Constants
// Use these tokens instead of hardcoded values
// ============================================

export const tokens = {
    // Colors - Primary palette
    colors: {
        primary: {
            main: '#1A1A1A',
            light: '#2D2620',
            dark: '#000000',
            contrast: '#F5B82E',
        },
        secondary: {
            main: '#D64545',
            light: '#E86B6B',
            dark: '#B33030',
            contrast: '#FFFFFF',
        },
        background: {
            default: '#F5B82E',
            paper: '#FFFDF5',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#4A3E23',
            disabled: '#8C7642',
        },
        success: {
            main: '#2D5A3D',
            light: '#4A7C5A',
        },
        warning: {
            main: '#F5B82E',
            light: '#FFD466',
        },
        error: {
            main: '#D64545',
            light: '#E86B6B',
        },
    },

    // Spacing - in MUI theme units (8px base)
    spacing: {
        xs: 0.5,   // 4px
        sm: 1,     // 8px
        md: 2,     // 16px
        lg: 3,     // 24px
        xl: 4,     // 32px
        xxl: 6,    // 48px
    },

    // Border radius
    radius: {
        sm: 1,     // 8px
        md: 2,     // 16px
        lg: 3,     // 24px
        xl: 4,     // 32px
        pill: 50,  // Pill shape
        circle: '50%',
    },

    // Transitions
    transitions: {
        fast: 'all 0.15s ease',
        normal: 'all 0.2s ease',
        slow: 'all 0.3s ease',
    },

    // Z-indexes
    zIndex: {
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
        speedDial: 1050,
        header: 10,
        tabs: 5,
    },

    // Breakpoint values (for non-MUI usage)
    breakpoints: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    },

    // Typography variants mapping
    fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    // Icon sizes
    iconSizes: {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
    },

    // Component-specific tokens
    components: {
        card: {
            borderRadius: 24,
            padding: 24,
        },
        button: {
            borderRadius: 50,
            paddingX: 28,
            paddingY: 12,
        },
        input: {
            borderRadius: 14,
            borderWidth: 2,
        },
        chip: {
            borderRadius: 50,
            height: 28,
        },
        header: {
            height: { mobile: 64, desktop: 80 },
        },
        drawer: {
            borderRadius: 24,
            handleWidth: 40,
            handleHeight: 4,
        },
        timeline: {
            dotSize: { default: 16, selected: 20 },
            lineWidth: 3,
        },
        thumbnail: {
            size: { sm: 40, md: 48, lg: 56 },
        },
    },
} as const;

// Mood colors mapping
export const moodColors: Record<string, string> = {
    amazing: tokens.colors.success.main,
    great: tokens.colors.success.light,
    good: tokens.colors.primary.main,
    mixed: '#B89F5C',
    challenging: '#D97B3D',
    difficult: tokens.colors.error.main,
    excited: tokens.colors.error.main,
    happy: tokens.colors.warning.main,
    tired: '#6B5A32',
    frustrated: '#D97B3D',
    sad: tokens.colors.text.secondary,
    adventurous: tokens.colors.primary.main,
    inspired: '#8B4570',
    chill: tokens.colors.success.main,
    neutral: '#6B5A32',
    in_love: tokens.colors.error.main,
    underwhelmed: '#8C7642',
};

// Category colors for expenses
export const categoryColors: Record<string, string> = {
    transport: tokens.colors.primary.main,
    logement: '#8B4570',
    food: '#D97B3D',
    activite: tokens.colors.success.main,
    shopping: tokens.colors.error.main,
    autre: '#6B5A32',
};

// Helper to get alpha color
export const alpha = (color: string, opacity: number): string => {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export type Tokens = typeof tokens;

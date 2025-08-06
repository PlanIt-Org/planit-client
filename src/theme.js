import { createTheme, Button, Text, Title, Paper, Card } from "@mantine/core";

// =================================================================
// ENHANCED DARK THEME
// =================================================================
export const myCustomDarkTheme = createTheme({
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  headings: {
    fontFamily: "'Figtree', sans-serif",
  },
  autoContrast: true,
  colorScheme: "dark", // Explicitly set color scheme
  colors: {
    // Palette is REVERSED (lightest to darkest) for dark mode
    "custom-palette": [
      "#ffffff", // 0: Lightest
      "#f0f2f4", // 1
      "#e0e3e5", // 2
      "#a5b1c1", // 3
      "#677d98", // 4
      "#3a506b", // 5: Primary Shade
      "#2b3b56", // 6
      "#1c2541", // 7
      "#141c36", // 8
      "#0b132b", // 9: Darkest
    ],
    // Add semantic color overrides for better theme consistency
    dark: [
      "#ffffff", // 0: white text
      "#f0f2f4", // 1: very light gray
      "#e0e3e5", // 2: light gray text
      "#a5b1c1", // 3: medium gray
      "#677d98", // 4: darker gray
      "#3a506b", // 5: primary blue
      "#2b3b56", // 6: darker blue
      "#1c2541", // 7: very dark blue
      "#141c36", // 8: darker background
      "#0b132b", // 9: darkest background
    ],
  },
  primaryColor: "custom-palette",
  primaryShade: 5,
  // Override default Mantine body background
  other: {
    bodyBg: "#0b132b", // Use our darkest color for body background
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "filled",
      },
    }),
    Text: Text.extend({
      defaultProps: {
        c: "custom-palette.2",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: "custom-palette.0",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        bg: "custom-palette.8", // Card-like backgrounds
        shadow: "sm",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        bg: "custom-palette.6", // Slightly lighter than Paper
        shadow: "md",
      },
    }),
  },
});

// =================================================================
// ENHANCED LIGHT THEME
// =================================================================
export const myCustomLightTheme = createTheme({
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  headings: {
    fontFamily: "'Figtree', sans-serif",
  },
  autoContrast: true,
  colorScheme: "light", // Explicitly set color scheme
  colors: {
    // Palette is now STANDARD (darkest to lightest)
    "custom-palette": [
      "#0b132b", // 0: Darkest
      "#141c36", // 1
      "#1c2541", // 2
      "#2b3b56", // 3
      "#3a506b", // 4: Primary Shade
      "#677d98", // 5
      "#a5b1c1", // 6
      "#e0e3e5", // 7
      "#f0f2f4", // 8
      "#ffffff", // 9: Lightest
    ],
    // Override gray colors for better light theme support
    gray: [
      "#f8f9fa", // 0: lightest
      "#f1f3f4", // 1
      "#e9ecef", // 2
      "#dee2e6", // 3
      "#ced4da", // 4
      "#adb5bd", // 5
      "#6c757d", // 6
      "#495057", // 7
      "#343a40", // 8
      "#212529", // 9: darkest
    ],
  },
  primaryColor: "custom-palette",
  primaryShade: 4,
  // Override default Mantine body background
  other: {
    bodyBg: "#f8f9fa", // Light background
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "filled",
      },
    }),
    Text: Text.extend({
      defaultProps: {
        c: "custom-palette.1",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: "custom-palette.0",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        bg: "custom-palette.9", // White backgrounds
        shadow: "sm",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        bg: "custom-palette.8", // Slightly off-white
        shadow: "md",
      },
    }),
  },
});

// Utility function to get theme-aware colors
export const getThemeColor = (theme, lightColor, darkColor) => {
  return theme.colorScheme === "dark" ? darkColor : lightColor;
};

// Helper function for consistent mobile navbar styling
export const getMobileNavbarStyles = (theme) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
  borderTop: `1px solid ${getThemeColor(
    theme,
    theme.colors.gray[3],
    theme.colors.gray[7]
  )}`,
  borderRadius: 0,
});

// Helper function for consistent page layout styling
export const getPageLayoutStyles = (theme, isMobile = false) => ({
  width: "100%",
  minHeight: "100vh",
  alignItems: "stretch",
  flexDirection: isMobile ? "column" : "row",
  backgroundColor: "var(--mantine-color-body)",
});

// Helper function for consistent content container styling
export const getContentContainerStyles = (theme, isMobile = false) => ({
  flex: 1,
  minWidth: 0,
  padding: isMobile ? "16px" : "20px",
  boxSizing: "border-box",
  paddingBottom: isMobile ? "80px" : "20px",
});

// Helper function for consistent card/paper background
export const getCardBackgroundColor = (theme, elevated = false) => {
  if (theme.colorScheme === "dark") {
    return elevated
      ? theme.colors["custom-palette"][7]
      : theme.colors["custom-palette"][8];
  } else {
    return elevated
      ? theme.colors["custom-palette"][8]
      : theme.colors["custom-palette"][9];
  }
};

// Helper function for responsive title sizing
export const getResponsiveTitleStyles = (
  isMobile = false,
  baseSize = "3rem"
) => ({
  fontSize: isMobile
    ? "clamp(1.8rem, 5vw, 2.5rem)"
    : `clamp(2.2rem, 4vw, ${baseSize})`,
});

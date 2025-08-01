import { createTheme, Button, Text, Title, Paper, Card } from "@mantine/core";

/**
 * My custom theme for the application.
 * @type {MantineTheme}
 */
export const myCustomTheme = createTheme({
  colors: {
    "custom-palette": [
      "#F0F3F5",
      "#D0ECF7",
      "#A0D8EE",
      "#6BCBE5",
      "#40BBE0",
      "#10A8D0",
      "#058CB5",
      "#006F99",
      "#005A7B",
      "#004560",
    ],
  },

  primaryColor: "custom-palette",

  components: {
    Button: Button.extend({
      defaultProps: {},
      styles: (theme) => ({
        root: {
          fontWeight: "bold",
          '&[dataVariant="filled"]': {
            color: theme.colors["custom-palette"][0],
          },
        },
      }),
    }),
    Text: Text.extend({
      defaultProps: {
        c: "custom-palette.8",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: "custom-palette.9",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        bg: "custom-palette.0",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        bg: "custom-palette.0",
      },
    }),
  },
});

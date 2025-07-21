// src/theme.js
import { createTheme, Button, Text, Title, Paper, Card } from '@mantine/core';

export const myCustomTheme = createTheme({
  colors: {
    'custom-palette': [
      '#F0F3F5', // Keep light for backgrounds
      '#D0ECF7', // A slightly more vibrant light blue
      '#A0D8EE', // A noticeable light blue
      '#6BCBE5', // A medium, clear blue
      '#40BBE0', // A strong blue
      '#10A8D0', // A darker, vibrant blue
      '#058CB5', // A deep blue
      '#006F99', // A very deep blue (could be your darkest primary)
      '#005A7B', // Even darker
      '#004560', // Darkest
    ],
  },

  primaryColor: 'custom-palette',

  components: {
    Button: Button.extend({
      defaultProps: {
        // ...
      },
      styles: (theme) => ({
        root: {
          fontWeight: 'bold',
          '&[dataVariant="filled"]': {
            color: theme.colors['custom-palette'][0], // Lightest color for text on dark primary buttons
          },
        },
      }),
    }),
    Text: Text.extend({
      defaultProps: {
        c: 'custom-palette.8', // Use a dark blue for general text on light backgrounds
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: 'custom-palette.9', // Use a very dark blue for titles
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        bg: 'custom-palette.0', // Lightest color for paper background
      },
    }),
    Card: Card.extend({
      defaultProps: {
        bg: 'custom-palette.0', // Lightest color for card background
      },
    }),
  },
});
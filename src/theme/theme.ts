import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    purple: Palette['primary'];
    cyan: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    purple?: PaletteOptions['primary'];
    cyan?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4D7CFF',
      light: '#7D9FFF',
      dark: '#2E5BD9',
    },
    secondary: {
      main: '#FF4D94',
      light: '#FF7DB5',
      dark: '#D92E7A',
    },
    accent: {
      main: '#4DFFA3',
      light: '#7DFFBF',
      dark: '#2ED976',
    },
    purple: {
      main: '#8A4DFF',
      light: '#A87DFF',
      dark: '#6B2ED9',
    },
    cyan: {
      main: '#4DEFFF',
      light: '#7DF2FF',
      dark: '#2ED9E6',
    },
    background: {
      default: '#050A18',
      paper: '#0A1628',
    },
    text: {
      primary: '#F5F7FF',
      secondary: '#A0A8C0',
    },
    success: {
      main: '#4DFFA3',
      dark: '#2ED976',
    },
    info: {
      main: '#4DEFFF',
    },
    warning: {
      main: '#FF8844',
    },
    error: {
      main: '#FF4444',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden',
        },
        '@keyframes glow': {
          from: {
            boxShadow: '0 0 5px var(--mui-palette-primary-main), 0 0 10px var(--mui-palette-primary-main)',
          },
          to: {
            boxShadow: '0 0 10px var(--mui-palette-primary-main), 0 0 20px var(--mui-palette-primary-main), 0 0 30px var(--mui-palette-primary-main)',
          },
        },
        '@keyframes float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes scrollGrid': {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '12px 32px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(77, 124, 255, 0.3)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(10, 22, 40, 0.5)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

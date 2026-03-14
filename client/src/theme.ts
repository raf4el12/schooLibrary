import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d9488',
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569',
      light: '#64748b',
      dark: '#334155',
    },
    background: {
      default: '#f8f7f4',
      paper: '#ffffff',
    },
    error: {
      main: '#e11d48',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#059669',
    },
    info: {
      main: '#0284c7',
    },
    divider: '#e8e5df',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontSize: '13px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #e8e5df',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontSize: '13px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '11px',
          letterSpacing: '0.02em',
        },
        sizeSmall: {
          height: 24,
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
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: '22px',
          fontWeight: 400,
          paddingBottom: 8,
        },
      },
    },
  },
})

export default theme

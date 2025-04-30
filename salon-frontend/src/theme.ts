import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D81B60", // Vibrant pink
      light: "#F06292",
      dark: "#AD1457",
    },
    secondary: {
      main: "#7B1FA2", // Deep purple
      light: "#AB47BC",
      dark: "#4A148C",
    },
    background: {
      default: "#FFF5F7", // Light pink
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D1B3E", // Dark purple
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700, color: "#2D1B3E" },
    h2: { fontSize: "2rem", fontWeight: 600, color: "#2D1B3E" },
    body1: { fontSize: "1rem", color: "#2D1B3E" },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 8, padding: "8px 16px" } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: "#FFF5F7", borderRight: "1px solid #FCE4EC" },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: "#D81B60" } },
    },
  },
});

export default theme;

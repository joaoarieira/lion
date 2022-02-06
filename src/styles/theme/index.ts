import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    grey: {
      '800': '#263238',
    },
    primary: {
      main: '#263238',
      dark: grey[900],
      light: grey[700],
    },
  },
});

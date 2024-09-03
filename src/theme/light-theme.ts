import { createTheme } from '@mui/material';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F0F2F5',
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
});

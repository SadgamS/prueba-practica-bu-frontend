'use client';
import { guardarCookie, leerCookie } from '@/utils/cookies';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { lightTheme } from './light-theme';
import { darkTheme } from './dark-theme';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);
export const useThemeContext = () => useContext(ThemeContext);

const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY);

  const isMountRef = useRef(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isDarkOS ? 'dark' : 'light',
  );

  const debounced = useDebouncedCallback(() => {
    isMountRef.current = true;
  }, 500);

  const guardarModoOscuro = () => {
    setThemeMode('dark');
    guardarCookie('themeMode', 'dark');
  };

  const guardarModoClaro = () => {
    setThemeMode('light');
    guardarCookie('themeMode', 'light');
  };

  const guardarModoAutomatico = () => {
    setThemeMode(isDarkOS ? 'dark' : 'light');
    guardarCookie('themeMode', isDarkOS ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    switch (themeMode) {
      case 'light':
        guardarModoOscuro();
        break;
      case 'dark':
        guardarModoClaro();
        break;
      default:
    }
  };

  useEffect(() => {
    const themeModeSaved = leerCookie('themeMode');

    if (!themeModeSaved) {
      guardarModoAutomatico();
      isMountRef.current = false;
      return;
    }

    switch (themeModeSaved) {
      case 'dark':
        guardarModoOscuro();
        break;
      case 'light':
        guardarModoClaro();
        break;
      default:
        guardarModoClaro();
        break;
    }
    isMountRef.current = false;
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMountRef.current) {
      guardarModoAutomatico();
    }
    debounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ThemeContext.Provider>
  );
};
export default ThemeRegistry;

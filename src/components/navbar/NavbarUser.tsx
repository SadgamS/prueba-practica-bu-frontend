'use client';
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useState } from 'react';
import { AlertDialog } from '../modales/AlertDialog';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/context/AuthProvider';
import { useThemeContext } from '@/theme/ThemeRegistry';
import { Icono } from '../Icono';
import { titleCase } from '@/utils/utilidades';
import { useSession } from '@/hooks/useSession';

export const NavbarUser = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { cerrarSesion } = useSession();

  const { usuario } = useAuth();

  const [mostrarAlertaCerrarSesion, setMostrarAlertaCerrarSesion] =
    useState(false);

  const { themeMode, toggleTheme } = useThemeContext();

  const desplegarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const cerrarMenu = () => {
    setAnchorEl(null);
  };

  const cerrarMenuSesion = async () => {
    cerrarMenu();
    await cerrarSesion();
  };

  const abrirPerfil = () => {
    cerrarMenu();
  };

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  const accionMostrarAlertaCerrarSesion = () => {
    cerrarMenu();
    setMostrarAlertaCerrarSesion(true);
  };

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaCerrarSesion}
        titulo={'Alerta'}
        texto={`¿Está seguro de cerrar sesión?`}
      >
        <Button
          onClick={() => {
            setMostrarAlertaCerrarSesion(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          sx={{ fontWeight: 'medium' }}
          onClick={async () => {
            setMostrarAlertaCerrarSesion(false);
            await cerrarMenuSesion();
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
          <Typography
            color={'text.primary'}
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'medium' }}
          >
            Prueba Práctica - Frontend
          </Typography>
          <Button size="small" onClick={desplegarMenu} color="primary">
            <Icono color={'primary'}>account_circle</Icono>
            {!xs && (
              <Box
                sx={{ pl: 1 }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'start'}
              >
                <Typography variant={'body2'} color="text.primary">
                  {`${titleCase(usuario?.nombreCompleto ?? '')}`}
                </Typography>
              </Box>
            )}
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={cerrarMenu}
            autoFocus={false}
          >
            <MenuItem sx={{ p: 2 }} onClick={abrirPerfil}>
              <Icono>person</Icono>
              <Box width={'20px'} />
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'start'}
              >
                <Typography variant={'body2'} color="text.primary">
                  {usuario?.nombreCompleto}
                </Typography>
                <Typography variant={'caption'} color="text.secondary">
                  {usuario?.rol}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ p: 2 }} onClick={toggleTheme}>
              {themeMode === 'light' ? (
                <Icono>dark_mode</Icono>
              ) : (
                <Icono>light_mode</Icono>
              )}

              <Box width={'20px'} />
              <Typography variant={'body2'}>
                {themeMode === 'light' ? `Modo oscuro` : `Modo claro`}{' '}
              </Typography>
            </MenuItem>
            <MenuItem sx={{ p: 2 }} onClick={accionMostrarAlertaCerrarSesion}>
              <Icono>logout</Icono>
              <Box width={'20px'} />
              <Typography variant={'body2'}>Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

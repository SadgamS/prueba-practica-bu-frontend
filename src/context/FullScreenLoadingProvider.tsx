'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

import { Box, Fade } from '@mui/material';
import { BackdropVista } from '@/components/progeso/Backdrop';

interface FullScreenLoadingType {
  estadoFullScreen: boolean;
  ocultarFullScreen: () => void;
  mostrarFullScreen: (mensaje: string) => void;
}

const FullScreenLoadingContext = createContext<FullScreenLoadingType>(
  {} as FullScreenLoadingType,
);

interface FullScreenProviderContextType {
  children: ReactNode;
}

export const FullScreenLoadingProvider = ({
  children,
}: FullScreenProviderContextType) => {
  const [mensaje, setMensaje] = useState<string>('Cargando...');
  const [mostrar, setMostrar] = useState<boolean>(false);

  const mostrarFullScreen = (mensaje: string) => {
    setMensaje(mensaje);
    setMostrar(true);
  };

  const ocultarFullScreen = () => {
    setMensaje('');
    setMostrar(false);
  };

  return (
    <FullScreenLoadingContext.Provider
      value={{
        estadoFullScreen: mostrar,
        ocultarFullScreen: ocultarFullScreen,
        mostrarFullScreen: mostrarFullScreen,
      }}
    >
      {mostrar && (
        <Box minHeight="100vh">
          <BackdropVista cargando={mostrar} titulo={mensaje} color="primary" />
        </Box>
      )}
      <Fade in={!mostrar} timeout={1000}>
        <Box
          sx={{
            display: mostrar ? 'none' : 'block',
            displayPrint: mostrar ? 'none' : 'block',
          }}
          minHeight="100vh"
        >
          {children}
        </Box>
      </Fade>
    </FullScreenLoadingContext.Provider>
  );
};

export const useFullScreenLoading = () => useContext(FullScreenLoadingContext);

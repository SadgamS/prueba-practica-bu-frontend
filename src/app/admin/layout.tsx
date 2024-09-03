'use client';
import { NavbarUser } from '@/components/navbar/NavbarUser';
import { useAuth } from '@/context/AuthProvider';
import { Box, Toolbar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ReactNode, useEffect } from 'react';
const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { inicializarUsuario, estaAutenticado, loadinglogin } = useAuth();

  useEffect(() => {
    if (loadinglogin) return;

    if (!estaAutenticado) {
      inicializarUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadinglogin]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      justifyItems="center"
    >
      <Box sx={{ display: 'flex' }}>
        <NavbarUser />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="initial"
          justifyItems={'center'}
          style={{ minHeight: '80vh' }}
        >
          <Box
            sx={{
              width: '90%',
              height: '75vh',
            }}
          >
            <Box height={'30px'} />
            {children}
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};
export default AdminLayout;

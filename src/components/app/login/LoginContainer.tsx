'use client';
import { FormInputText } from '@/components/form/FormInputText';
import ProgresoLineal from '@/components/progeso/ProgresoLineal';
import { useAuth } from '@/context/AuthProvider';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const LoginContainer = () => {
  const { control, handleSubmit } = useForm<{
    usuario: string;
    contrasena: string;
  }>();

  const { ingresar, loadinglogin } = useAuth();

  const iniciarSesion = async (data: {
    usuario: string;
    contrasena: string;
  }) => {
    const { usuario, contrasena } = data;
    await ingresar(usuario, contrasena);
  };

  return (
    <Box component={'form'} onSubmit={handleSubmit(iniciarSesion)}>
      <Typography sx={{ fontWeight: 'medium' }} variant={'subtitle2'}>
        Iniciar sesión
      </Typography>
      <Box height={'15px'} />
      <Grid container direction="row" spacing={2}>
        <Grid size={12}>
          <FormInputText
            id={'usuario'}
            control={control}
            name="usuario"
            label="Usuario"
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={12}>
          <FormInputText
            id="contrasena"
            name="contrasena"
            label="Contraseña"
            control={control}
            type="password"
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres',
              },
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 1, mb: 1 }}>
        <ProgresoLineal mostrar={loadinglogin} />
      </Box>
      <Box sx={{ height: '15px' }} />
      <Box height={'10px'} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ borderRadius: '10px' }}
        type="submit"
        disabled={loadinglogin}
      >
        Ingresar
      </Button>
    </Box>
  );
};
export default LoginContainer;

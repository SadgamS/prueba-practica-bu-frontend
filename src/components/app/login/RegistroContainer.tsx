'use client';

import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { FormInputText } from '@/components/form/FormInputText';
import { FormInputDate } from '@/components/form/FormInputDate';
import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import ProgresoLineal from '@/components/progeso/ProgresoLineal';
import { RegistroUsurioType } from './types/registroTypes';
import { useState } from 'react';
import { delay } from '@/utils/utilidades';
import { Servicios } from '@/services/Servicios';
import { Constantes } from '@/config/constantes';
import { formatoFecha } from '@/utils/fechas';
import { useAlerts } from '@/hooks/useAlerts';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';

const RegistroContainer = () => {
  const { control, watch, handleSubmit } = useForm<RegistroUsurioType>();
  const [loading, setLoading] = useState(false);
  const { Alerta } = useAlerts();

  const newPassword1Watch = watch('password');

  const registrarUsuario = async (data: RegistroUsurioType) => {
    await registrarUsuarioPeticion(data);
  };

  const registrarUsuarioPeticion = async (data: RegistroUsurioType) => {
    try {
      setLoading(true);
      await delay(1000);
      const respuest = await Servicios.post({
        url: `${Constantes.baseApiUrl}/auth/registrar`,
        body: {
          ...data,
          fechaNacimiento: formatoFecha(data.fechaNacimiento, 'YYYY-MM-DD'),
          roles: [Constantes.roles.USUARIO],
          username: data.documentoIdentidad,
        },
      });
      console.log(respuest);
      Alerta({
        mensaje: 'Usuario registrado correctamente',
        variant: 'success',
      });
    } catch (error) {
      Alerta({ mensaje: `${InterpreteMensajes(error)}`, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={handleSubmit(registrarUsuario)}>
      <Typography sx={{ fontWeight: 'medium' }} variant={'subtitle2'}>
        Datos personales
      </Typography>
      <Box height={'15px'} />
      <Grid container direction="row" spacing={2}>
        <Grid size={12}>
          <FormInputText
            id="nombres"
            name="nombres"
            label="Nombres"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputText
            id="apellidoPaterno"
            name="apellidoPaterno"
            label="Apellido paterno"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputText
            id="apellidoMaterno"
            name="apellidoMaterno"
            label="Apellido materno"
            control={control}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputDate
            id="fechaNacimiento"
            name="fechaNacimiento"
            label="Fecha de nacimiento"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputDropdown
            id="genero"
            name="genero"
            label="Género"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            options={[
              { key: 'M', value: 'M', label: 'Masculino' },
              { key: 'F', value: 'F', label: 'Femenino' },
            ]}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputDropdown
            id="tipoDocumento"
            name="tipoDocumento"
            label="Tipo de documento"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            options={[
              { key: 'ci', value: 'ci', label: 'CI' },
              { key: 'pasaporte', value: 'pasaporte', label: 'Pasaporte' },
            ]}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FormInputText
            id="documentoIdentidad"
            name="documentoIdentidad"
            label="Documento de identidad"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={12}>
          <FormInputText
            id={'password'}
            control={control}
            name="password"
            label="Contraseña"
            type={'password'}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid size={12}>
          <FormInputText
            id={'password2'}
            control={control}
            name="password2"
            label="Repita su nueva contraseña"
            type={'password'}
            rules={{
              required: 'Este campo es requerido',
              validate: (value: string) => {
                if (value != newPassword1Watch)
                  return 'La contraseña no coincide';
              },
            }}
          />
        </Grid>
      </Grid>
      <Box height={'5px'} />
      <ProgresoLineal mostrar={loading} />
      <Box height={'10px'} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ borderRadius: '10px' }}
        type="submit"
        disabled={loading}
      >
        Registrarse
      </Button>
    </Box>
  );
};
export default RegistroContainer;

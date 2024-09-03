import { useAlerts } from '@/hooks/useAlerts';
import { ClientesListType } from './types/clientesTypes';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CrearEditarClienteType } from './types/crearEditarCliente';
import { Box, Button, DialogActions, DialogContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FormInputText } from '@/components/form/FormInputText';
import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { FormInputDate } from '@/components/form/FormInputDate';
import { delay } from '@/utils/utilidades';
import { useSession } from '@/hooks/useSession';
import { Constantes } from '@/config/constantes';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';
import ProgresoLineal from '@/components/progeso/ProgresoLineal';
import dayjs from 'dayjs';

export interface ModalClienteType {
  cliente: ClientesListType | null;
  accionCorrecta: () => void;
  accionCancelar: () => void;
}

const ModalCliente = ({
  cliente,
  accionCorrecta,
  accionCancelar,
}: ModalClienteType) => {
  const [loading, setLoading] = useState(false);

  const { Alerta } = useAlerts();
  const { sesionPeticion } = useSession();

  const { control, handleSubmit } = useForm<CrearEditarClienteType>({
    defaultValues: {
      id: cliente?.id,
      nombres: cliente?.nombres,
      apellidoPaterno: cliente?.apellidoPaterno,
      apellidoMaterno: cliente?.apellidoMaterno,
      documentoIdentidad: cliente?.documentoIdentidad,
      tipoDocumento: cliente?.tipoDocumento,
      fechaNacimiento: dayjs(cliente?.fechaNacimiento),
      genero: cliente?.genero,
    },
  });

  const guardarActualizarCliente = async (data: CrearEditarClienteType) => {
    await guardarActualizarClientePeticion(data);
  };

  const guardarActualizarClientePeticion = async (
    cliente: CrearEditarClienteType,
  ) => {
    try {
      setLoading(true);
      await delay(500);
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cliente${
          cliente.id ? `/${cliente.id}` : ''
        }`,
        tipo: cliente.id ? 'patch' : 'post',
        body: {
          ...cliente,
          fechaNacimiento: cliente.fechaNacimiento.format('YYYY-MM-DD'),
        },
      });
      accionCorrecta();
      Alerta({
        mensaje: 'Cliente guardado correctamente',
        variant: 'success',
      });
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(guardarActualizarCliente)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
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
          </Grid>
          <Box height={'10px'} />
          <ProgresoLineal mostrar={loading} />
          <Box height={'5px'} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
          gap: 2,
        }}
      >
        <Button variant={'text'} disabled={loading} onClick={accionCancelar}>
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loading} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};
export default ModalCliente;

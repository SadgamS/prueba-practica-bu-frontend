import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { FormInputText } from '@/components/form/FormInputText';
import ProgresoLineal from '@/components/progeso/ProgresoLineal';
import { Box, Button, DialogActions, DialogContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CrearEditarCuentasType } from './types/crearEditarCuentasType';
import { CuentasListType } from './types/cuentasTypes';
import { useAlerts } from '@/hooks/useAlerts';
import { useSession } from '@/hooks/useSession';
import { delay } from '@/utils/utilidades';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';
import { Constantes } from '@/config/constantes';

export interface ModalCuentaType {
  idCliente: string;
  cuenta: CuentasListType | null;
  accionCancelar: () => void;
  accionCorrecta: () => void;
}

const ModalCuenta = ({
  idCliente,
  accionCancelar,
  cuenta,
  accionCorrecta,
}: ModalCuentaType) => {
  const [loading, setLoading] = useState(false);

  const { Alerta } = useAlerts();
  const { sesionPeticion } = useSession();

  const { control, handleSubmit } = useForm<CrearEditarCuentasType>({
    defaultValues: {
      id: cuenta?.id,
      tipoProducto: cuenta?.tipoProducto,
      numeroCuenta: cuenta?.numeroCuenta,
      moneda: cuenta?.moneda,
      monto: cuenta?.monto,
      fechaApertura: cuenta?.fechaApertura,
      sucursal: cuenta?.sucursal,
    },
  });

  const guardarActualizarCuenta = async (data: CrearEditarCuentasType) => {
    await guardarActualizarCuentaPeticion(data);
  };

  const guardarActualizarCuentaPeticion = async (
    cuenta: CrearEditarCuentasType,
  ) => {
    try {
      setLoading(true);
      await delay(500);
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cuenta${
          cuenta.id ? `/${cuenta.id}` : ''
        }`,
        tipo: cuenta.id ? 'PATCH' : 'POST',
        body: {
          ...cuenta,
          idCliente: Number(idCliente),
        },
      });
      accionCorrecta();
      Alerta({ mensaje: 'Cuenta guardada correctamente', variant: 'success' });
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(guardarActualizarCuenta)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid size={{ sm: 12, md: 6 }}>
              <FormInputDropdown
                id="tipoProducto"
                name="tipoProducto"
                label="Tipo de producto"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                options={[
                  {
                    key: 'Cuenta de ahorros',
                    value: 'Cuenta de ahorros',
                    label: 'Cuenta de ahorros',
                  },
                  {
                    key: 'Cuenta corriente',
                    value: 'Cuenta corriente',
                    label: 'Cuenta corriente',
                  },
                ]}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 6 }}>
              <FormInputText
                id="numeroCuenta"
                name="numeroCuenta"
                label="Número de cuenta"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 6 }}>
              <FormInputDropdown
                id="moneda"
                name="moneda"
                label="Moneda"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                options={[
                  { key: 'BS', value: 'BS', label: 'Bolivianos' },
                  { key: 'USD', value: 'USD', label: 'Dólares' },
                ]}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 6 }}>
              <FormInputText
                id="monto"
                name="monto"
                label="Monto"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid size={12}>
              <FormInputDropdown
                id="sucursal"
                name="sucursal"
                label="Sucursal"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                options={[
                  { key: 'La Paz', value: 'La Paz', label: 'La Paz' },
                  {
                    key: 'Cochabamba',
                    value: 'Cochabamba',
                    label: 'Cochabamba',
                  },
                  {
                    key: 'Santa Cruz',
                    value: 'Santa Cruz',
                    label: 'Santa Cruz',
                  },
                ]}
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
export default ModalCuenta;

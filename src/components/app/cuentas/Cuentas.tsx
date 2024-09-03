'use client';

import { IconoBoton } from '@/components/botones/IconoBoton';
import { IconoTooltip } from '@/components/botones/IconoTooltip';
import { CustomDataTable } from '@/components/datatable/CustomDataTable';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { CriterioOrdenType } from '@/types/ordenTypes';
import { delay } from '@/utils/utilidades';
import {
  Alert,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import ModalCuenta from './ModalCuenta';
import { CuentasListType } from './types/cuentasTypes';
import { useSession } from '@/hooks/useSession';
import { Constantes } from '@/config/constantes';
import { ordenFiltrado } from '@/utils/orden';
import { useAlerts } from '@/hooks/useAlerts';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';
import { useRouter } from 'next/navigation';
import { Paginacion } from '@/components/datatable/Paginacion';
import { AlertDialog } from '@/components/modales/AlertDialog';

interface CuentasProps {
  idCliente: string;
}

const Cuentas = ({ idCliente }: CuentasProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] =
    useState<CuentasListType | null>(null);
  const [alertaEliminar, setAlertaEliminar] = useState<boolean>(false);
  const [cuentaIdEliminar, setCuentaIdEliminar] = useState<number | null>(null);

  const [cuentasData, setCuentasData] = useState<Array<CuentasListType>>([]);

  const [limite, setLimite] = useState<number>(10);
  const [pagina, setPagina] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  const { Alerta } = useAlerts();
  const router = useRouter();

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'tipoProducto', nombre: 'Tipo de producto', ordenar: true },
    { campo: 'numeroCuenta', nombre: 'Número de cuenta', ordenar: true },
    { campo: 'moneda', nombre: 'Moneda', ordenar: true },
    { campo: 'monto', nombre: 'Monto', ordenar: true },
    { campo: 'fechaApertura', nombre: 'Fecha de apertura', ordenar: true },
    { campo: 'sucursal', nombre: 'Sucursal', ordenar: true },
    { campo: 'estado', nombre: 'Estado' },
    { campo: 'acciones', nombre: 'Acciones' },
  ]);

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      id={'actualizar'}
      titulo={'Actualizar'}
      key={`accionActualizar`}
      accion={async () => {}}
      icono={'refresh'}
      name={'Actualizar lista de cuentas'}
    />,
    <IconoBoton
      id={'agregar-cuenta'}
      key={'agregar-cuenta'}
      texto={'Agregar cuenta'}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion="Agregar cuenta"
      accion={() => {
        agregarCuentaModal();
      }}
    />,
  ];

  const contenidoTabla: Array<Array<ReactNode>> = cuentasData.map(
    (cuenta, index) => [
      <Typography
        key={`${cuenta.id}-${index}-tipoProducto`}
        variant={'subtitle2'}
      >
        {cuenta.tipoProducto}
      </Typography>,
      <Typography
        key={`${cuenta.id}-${index}-numeroCuenta`}
        variant={'subtitle2'}
      >
        {cuenta.numeroCuenta}
      </Typography>,
      <Typography key={`${cuenta.id}-${index}-moneda`} variant={'subtitle2'}>
        {cuenta.moneda}
      </Typography>,
      <Typography key={`${cuenta.id}-${index}-monto`} variant={'subtitle2'}>
        {cuenta.monto}
      </Typography>,
      <Typography
        key={`${cuenta.id}-${index}-fechaApertura`}
        variant={'subtitle2'}
      >
        {cuenta.fechaApertura}
      </Typography>,
      <Typography key={`${cuenta.id}-${index}-sucursal`} variant={'subtitle2'}>
        {cuenta.sucursal}
      </Typography>,
      <Typography key={`${cuenta.id}-${index}-estado`} variant={'subtitle2'}>
        {cuenta.estado}
      </Typography>,

      <Box key={`${cuenta.id}-${index}-acciones`}>
        <IconoTooltip
          id={`editarClientes-${cuenta.id}`}
          name={'Editar'}
          titulo={'Editar'}
          color={'primary'}
          accion={() => {
            editarCuentaModal(cuenta);
          }}
          icono={'edit'}
        />
        <IconoTooltip
          id={`eliminarCliente-${cuenta.id}`}
          name={'Eliminar'}
          titulo={'Eliminar'}
          color={'error'}
          accion={() => {
            setCuentaIdEliminar(cuenta.id);
            setAlertaEliminar(true);
          }}
          icono={'delete'}
        />
      </Box>,
    ],
  );

  const editarCuentaModal = (cuenta: CuentasListType) => {
    setCuentaSeleccionada(cuenta);
    setModalOpen(true);
  };


  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  );

  const { sesionPeticion } = useSession();

  const obtenerCuentasPeticion = async () => {
    try {
      setLoading(true);

      const response = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cuenta/cliente/${idCliente}`,
        params: {
          page: pagina - 1,
          size: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0 && {
            sort: ordenFiltrado(ordenCriterios).join(','),
          }),
        },
      });

      setCuentasData(response.datos.contenido);
      setTotal(response.datos.totalPaginas);
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' });
      router.push('/admin/home');
    } finally {
      setLoading(false);
    }
  };

  const eliminarCuentaPeticion = async () => {
    try {
      setLoading(true);
      await delay(500);
      await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cuenta/eliminar/${cuentaIdEliminar}`,
        tipo: 'patch',
      });
      await obtenerCuentasPeticion();
      Alerta({ mensaje: 'Cuenta eliminada correctamente', variant: 'success' });
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const agregarCuentaModal = () => {
    setCuentaSeleccionada(null);
    setModalOpen(true);
  };

  const cerrarModal = async () => {
    setModalOpen(false);
    await delay(500);
    setCuentaSeleccionada(null);
  };

  useEffect(() => {
    obtenerCuentasPeticion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, limite, JSON.stringify(ordenCriterios)]);

  return (
    <>
      <AlertDialog
        isOpen={alertaEliminar}
        titulo={'Confirmación'}
        texto="¿Está seguro que desea eliminar la cuenta?"
      >
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Button
            onClick={() => {
              setAlertaEliminar(false);
              setCuentaIdEliminar(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            sx={{ fontWeight: 'medium' }}
            variant={'contained'}
            onClick={async () => {
              await eliminarCuentaPeticion();
              setAlertaEliminar(false);
              setCuentaIdEliminar(null);
            }}
          >
            Aceptar
          </Button>
        </Box>
      </AlertDialog>
      <CustomDialog
        isOpen={modalOpen}
        handleClose={cerrarModal}
        title={cuentaSeleccionada ? 'Editar cuenta' : 'Agregar cuenta'}
      >
        <ModalCuenta
          idCliente={idCliente}
          accionCancelar={cerrarModal}
          cuenta={cuentaSeleccionada}
          accionCorrecta={() => {
            obtenerCuentasPeticion();
            cerrarModal();
          }}
        />
      </CustomDialog>
      <CustomDataTable
        titulo="Cuentas"
        contenidoTabla={contenidoTabla}
        columnas={ordenCriterios}
        acciones={acciones}
        paginacion={paginacion}
        cambioOrdenCriterios={setOrdenCriterios}
        cargando={loading}
      />
    </>
  );
};
export default Cuentas;

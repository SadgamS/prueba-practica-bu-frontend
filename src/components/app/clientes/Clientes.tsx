'use client';
import { CustomDataTable } from '@/components/datatable/CustomDataTable';
import { Constantes } from '@/config/constantes';
import { useSession } from '@/hooks/useSession';
import { CriterioOrdenType } from '@/types/ordenTypes';
import { ReactNode, useEffect, useState } from 'react';
import { ClientesListType } from './types/clientesTypes';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Paginacion } from '@/components/datatable/Paginacion';
import { ordenFiltrado } from '@/utils/orden';
import { IconoBoton } from '@/components/botones/IconoBoton';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { delay } from '@/utils/utilidades';
import ModalCliente from './ModalCliente';
import { IconoTooltip } from '@/components/botones/IconoTooltip';
import { AlertDialog } from '@/components/modales/AlertDialog';
import { useRouter } from 'next/navigation';
import { useAlerts } from '@/hooks/useAlerts';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';

const Clientes = () => {
  const [clientesData, setClientesData] = useState<Array<ClientesListType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [alertaEliminar, setAlertaEliminar] = useState<boolean>(false);
  const [clienteIdEliminar, setClienteIdEliminar] = useState<number | null>(
    null,
  );

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClientesListType | null>(null);

  const [limite, setLimite] = useState<number>(10);
  const [pagina, setPagina] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  const router = useRouter();

  const { Alerta } = useAlerts();

  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombres', nombre: 'Nombres', ordenar: true },
    { campo: 'apellidoPaterno', nombre: 'Apellido paterno', ordenar: true },
    { campo: 'apellidoMaterno', nombre: 'Apellido materno', ordenar: true },
    { campo: 'genero', nombre: 'Género', ordenar: true },
    { campo: 'tipoDocumento', nombre: 'Tipo de documento', ordenar: true },
    {
      campo: 'documentoIdentidad',
      nombre: 'Documento de identidad',
      ordenar: true,
    },
    { campo: 'fecha_nacimiento', nombre: 'Fecha de nacimiento', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ]);

  const { sesionPeticion } = useSession();

  const obtenerClientesPeticion = async () => {
    try {
      setLoading(true);

      const response = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cliente`,
        params: {
          page: pagina - 1,
          size: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0 && {
            sort: ordenFiltrado(ordenCriterios).join(','),
          }),
        },
      });

      setClientesData(response.datos.contenido);
      setTotal(response.datos.totalPaginas);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const eliminarClientePeticion = async () => {
    try {
      setLoading(true);
      await delay(500);
      await sesionPeticion({
        url: `${Constantes.baseApiUrl}/cliente/eliminar/${clienteIdEliminar}`,
        tipo: 'patch',
      });
      await obtenerClientesPeticion();
      Alerta({
        mensaje: 'Cliente eliminado correctamente',
        variant: 'success',
      });
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = async () => {
    setModalOpen(false);
    await delay(500);
    setClienteSeleccionado(null);
  };

  const agregarClienteModal = () => {
    setClienteSeleccionado(null);
    setModalOpen(true);
  };

  const editarClienteModal = (cliente: ClientesListType) => {
    setClienteSeleccionado(cliente);
    setModalOpen(true);
  };

  const contenidoTabla: Array<Array<ReactNode>> = clientesData.map(
    (cliente, index) => [
      <Typography key={`${cliente.id}-${index}-nombres`} variant={'subtitle2'}>
        {cliente.nombres}
      </Typography>,
      <Typography
        key={`${cliente.id}-${index}-apellidoPaterno`}
        variant={'subtitle2'}
      >
        {cliente.apellidoPaterno}
      </Typography>,
      <Typography
        key={`${cliente.id}-${index}-apellidoMaterno`}
        variant={'subtitle2'}
      >
        {cliente.apellidoMaterno}
      </Typography>,
      <Typography key={`${cliente.id}-${index}-genero`} variant={'subtitle2'}>
        {cliente.genero}
      </Typography>,
      <Typography
        key={`${cliente.id}-${index}-tipoDocumento`}
        variant={'subtitle2'}
      >
        {cliente.tipoDocumento}
      </Typography>,
      <Typography
        key={`${cliente.id}-${index}-documentoIdentidad`}
        variant={'subtitle2'}
      >
        {cliente.documentoIdentidad}
      </Typography>,
      <Typography
        key={`${cliente.id}-${index}-fechaNacimiento`}
        variant={'subtitle2'}
      >
        {cliente.fechaNacimiento}
      </Typography>,
      <Typography key={`${cliente.id}-${index}-estado`} variant={'subtitle2'}>
        {cliente.estado}
      </Typography>,
      <Box key={`${cliente.id}-${index}-acciones`}>
        <IconoTooltip
          id={`verCuentasCliente-${cliente.id}`}
          name={'Ver cuentas'}
          titulo={'Ver cuentas'}
          color={'info'}
          accion={() => {
            router.push(`/admin/home/cuentas/${cliente.id}`);
          }}
          icono={'account_balance'}
        />
        <IconoTooltip
          id={`editarClientes-${cliente.id}`}
          name={'Editar'}
          titulo={'Editar'}
          color={'primary'}
          accion={() => {
            editarClienteModal(cliente);
          }}
          icono={'edit'}
        />
        <IconoTooltip
          id={`eliminarCliente-${cliente.id}`}
          name={'Eliminar'}
          titulo={'Eliminar'}
          color={'error'}
          accion={() => {
            setClienteIdEliminar(cliente.id);
            setAlertaEliminar(true);
          }}
          icono={'delete'}
        />
      </Box>,
    ],
  );

  const acciones: Array<ReactNode> = [
    <IconoTooltip
      id={'actualizar'}
      titulo={'Actualizar'}
      key={`accionActualizar`}
      accion={async () => {
        await obtenerClientesPeticion();
      }}
      icono={'refresh'}
      name={'Actualizar lista de clientes'}
    />,
    <IconoBoton
      id={'agregar-cliente'}
      key={'agregar-cliente'}
      texto={'Agregar cliente'}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion="Agregar cliente"
      accion={() => {
        agregarClienteModal();
      }}
    />,
  ];

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  );

  useEffect(() => {
    obtenerClientesPeticion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, limite, JSON.stringify(ordenCriterios)]);
  return (
    <>
      <AlertDialog
        isOpen={alertaEliminar}
        titulo={'Confirmación'}
        texto="¿Está seguro de eliminar el cliente seleccionado?"
      >
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Button
            onClick={() => {
              setAlertaEliminar(false);
              setClienteIdEliminar(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            sx={{ fontWeight: 'medium' }}
            variant={'contained'}
            onClick={async () => {
              await eliminarClientePeticion();
              setAlertaEliminar(false);
              setClienteIdEliminar(null);
            }}
          >
            Aceptar
          </Button>
        </Box>
      </AlertDialog>
      <CustomDialog
        isOpen={modalOpen}
        handleClose={cerrarModal}
        title={clienteSeleccionado ? 'Editar cliente' : 'Agregar cliente'}
      >
        <ModalCliente
          cliente={clienteSeleccionado}
          accionCorrecta={() => {
            obtenerClientesPeticion().finally();
            cerrarModal().finally();
          }}
          accionCancelar={cerrarModal}
        />
      </CustomDialog>
      <CustomDataTable
        titulo="Clientes"
        contenidoTabla={contenidoTabla}
        columnas={ordenCriterios}
        paginacion={paginacion}
        cambioOrdenCriterios={setOrdenCriterios}
        acciones={acciones}
        cargando={loading}
      />
    </>
  );
};
export default Clientes;

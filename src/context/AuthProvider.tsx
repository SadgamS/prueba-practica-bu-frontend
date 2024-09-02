'use client';
import { UsuarioType } from '@/components/app/login/types/loginTypes';
import { Constantes } from '@/config/constantes';
import { useAlerts } from '@/hooks/useAlerts';
import { useSession } from '@/hooks/useSession';
import { Servicios } from '@/services/Servicios';
import { guardarCookie, leerCookie } from '@/utils/cookies';
import { InterpreteMensajes } from '@/utils/interpreteMensajes';
import { delay, encodeBase64 } from '@/utils/utilidades';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useFullScreenLoading } from './FullScreenLoadingProvider';

interface ContextProps {
  ingresar: (usuario: string, password: string) => Promise<void>;
  loadinglogin: boolean;
  usuario: UsuarioType | null;
  inicializarUsuario: () => Promise<void>;
  estaAutenticado: boolean;
}

const AuthContext = createContext<ContextProps>({} as ContextProps);

export const AuhtProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { Alerta } = useAlerts();
  const { borrarCookiesSesion, sesionPeticion } = useSession();
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading();

  const router = useRouter();

  const borrarSesionUsuario = () => {
    setUser(null);
    borrarCookiesSesion();
  };

  const inicializarUsuario = async () => {
    const token = leerCookie('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      mostrarFullScreen('Verificando sesión');
      await obtenerUsuario();

      await delay(1000);
    } catch (error: Error | any) {
      borrarSesionUsuario();
      router.replace('/login');
      throw error;
    } finally {
      setLoading(false);
      ocultarFullScreen();
    }
  };

  const login = async (usuario: string, contrasena: string) => {
    try {
      setLoading(true);

      await delay(1000);
      const respuesta = await Servicios.post({
        url: `${Constantes.baseApiUrl}/auth/login`,
        // TODO: en el backend agregar decodeURI(decodeBase64(contrasena))
        // body: { usuario, contrasena: encodeBase64(encodeURI(contrasena)) },
        body: { usuario, contrasena },
        headers: {},
      });

      guardarCookie('token', respuesta.datos?.token);

      const userResponse: UsuarioType = {
        usuario: respuesta.datos?.usuario,
        nombreCompleto: respuesta.datos?.nombreCompleto,
        rol: respuesta.datos?.rol,
      };

      setUser(userResponse);
      mostrarFullScreen('Iniciando sesión');
      await delay(1000);
      router.replace('/admin/home');
      await delay(1000);
    } catch (e) {
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' });
      borrarSesionUsuario();
    } finally {
      setLoading(false);
      ocultarFullScreen();
    }
  };

  const obtenerUsuario = async () => {
    const usuario = await sesionPeticion({
      url: `${Constantes.baseApiUrl}/usuario/perfil`,
      tipo: 'get',
    });

    const userResponse: UsuarioType = {
      usuario: usuario.datos?.usuario,
      nombreCompleto: usuario.datos?.nombreCompleto,
      rol: usuario.datos?.rol,
    };

    setUser(userResponse);
  };

  return (
    <AuthContext.Provider
      value={{
        ingresar: login,
        loadinglogin: loading,
        usuario: user,
        inicializarUsuario,
        estaAutenticado: !!user && !loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

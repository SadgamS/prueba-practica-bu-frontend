import { peticionFormatoMetodo, Servicios } from '@/services/Servicios';
import { eliminarCookie, leerCookie } from '@/utils/cookies';
import { verificarToken } from '@/utils/token';
import { delay } from '@/utils/utilidades';
import axios, { Method, RawAxiosRequestHeaders } from 'axios';

export const useSession = () => {
  const sesionPeticion = async ({
    tipo = 'get',
    url,
    headers,
    body,
    params,
    responseType,
    withCredentials,
  }: peticionFormatoMetodo) => {
    try {
      if (!verificarToken(leerCookie('token') ?? '')) {
        return { data: null };
      }

      const cabeceras = {
        accept: 'application/json',
        Authorization: `Bearer ${leerCookie('token') ?? ''}`,
        ...headers,
      };

      const response = await Servicios.peticionHTTP({
        url,
        tipo,
        headers: cabeceras,
        body,
        params,
        responseType,
        withCredentials,
      });

      return response.data;
    } catch (e: import('axios').AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado');
      }

      if (Servicios.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎');
      }

      throw e.response?.data || 'Ocurrió un error desconocido';
    }
  };
  const borrarCookiesSesion = () => {
    eliminarCookie('token'); // Eliminando access_token
  };

  return { sesionPeticion, borrarCookiesSesion };
};

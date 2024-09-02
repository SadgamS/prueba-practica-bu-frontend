import { decodeToken } from 'react-jwt'

export const verificarToken = (token: string): boolean => {
  const myDecodedToken: any = decodeToken(token)
  const caducidad = new Date(myDecodedToken.exp * 1000)

  return new Date().getTime() - caducidad.getTime() < 0
}

import Cookies, { CookieAttributes } from 'js-cookie'

export const guardarCookie = (
    key: string,
    value: string,
    options?: CookieAttributes
  ) => {
    Cookies.set(key, value, options)
  }
  
  export const leerCookie = (key: string): string | undefined => {
    return Cookies.get(key)
  }
  
  export const eliminarCookie = (key: string) => {
    return Cookies.remove(key)
  }
  
  export const eliminarCookies = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName)
    })
  }
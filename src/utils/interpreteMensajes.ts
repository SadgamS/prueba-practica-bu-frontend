const isHTML = RegExp.prototype.test.bind(/^(<([^>]+)>)$/i);

export const serializeError = (err: unknown) =>
  JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

export const InterpreteMensajes = (mensaje: any): string => {
  try {
    const errorMessage = serializeError(mensaje);

    if (errorMessage.errores && errorMessage.errores.length > 0) {
      return errorMessage.errores[0];
    }
    return errorMessage.notificacion ?? 'Solicitud errónea 🚨';
  } catch (e) {
    return isHTML(mensaje) ? 'Solicitud errónea 🚨' : `${mensaje}`;
  }
};

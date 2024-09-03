import { Dayjs } from "dayjs";

export interface CrearEditarClienteType {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  fechaNacimiento: Dayjs;
  genero: string;
}

export interface UsuarioDto {
  idUsuario: number;
  nombreUsuario: string;
  rol: string;
}

export interface UsuarioCreateDto {
  nombreUsuario: string | null;
  contrasenaUsuario: string | null;
  idRol: number | null;
}

export type UsuarioUpdateDto = UsuarioCreateDto;

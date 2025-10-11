export interface UsuarioDto {
  idUsuario: number;
  nombreUsuario: string;
  nombreRol: string;
}

export interface UsuarioCreateDto {
  nombreUsuario: string | null;
  contrasenaUsuario: string | null;
  idRol: number | null;
}

export interface Usuario {
  idUsuario?: number;
  nombreUsuario: string;
  contrasenaUsuario: string;
  idRol: number;
  nombreRol?: string;
}


export type UsuarioUpdateDto = UsuarioCreateDto;

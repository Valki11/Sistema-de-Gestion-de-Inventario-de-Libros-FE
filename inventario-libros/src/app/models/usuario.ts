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

export interface Usuario {
  idUsuario?: number;
  nombreUsuario: string;
  contrasenaUsuario: string;
  idRol: number;
  rolNombre?: string;
}


export type UsuarioUpdateDto = UsuarioCreateDto;

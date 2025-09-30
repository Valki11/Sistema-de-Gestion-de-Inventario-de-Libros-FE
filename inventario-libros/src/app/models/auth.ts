export interface LoginRequest {
  nombreUsuario: string;
  contrasenaUsuario: string;
}
export interface LoginResponse {
  idUsuario: number;
  nombreUsuario: string;
  rol: string;
}

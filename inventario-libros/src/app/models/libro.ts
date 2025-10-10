export interface LibroDto {
  idLibro: number;
  tituloLibro: string;
  autor: string;
  anioDePublicacion?: number | null;
  generoLibro?: string | null;
  numeroCopias?: number | null;
  estadoLibro?: string | null;
}

export interface LibroCreateDto {
  tituloLibro: string | null;
  idAutor: number | null;
  anioDePublicacion?: number | null;
  generoLibro?: string | null;
  numeroCopias?: number | null;
  estadoLibro?: string | null;
}

export interface Libro {
  idLibro?: number;
  tituloLibro: string;
  idAutor: number;
  autor?: string;
  anioDePublicacion: number;
  generoLibro: string;
  numeroCopias: number;
  estadoLibro: string;
}



export type LibroUpdateDto = LibroCreateDto;

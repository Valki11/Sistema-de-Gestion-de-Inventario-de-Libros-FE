export interface AutorDto {
  idAutor: number;
  nombreAutor: string;
}

export interface AutorCreateDto {
  nombreAutor: string | null;
}
export type AutorUpdateDto = AutorCreateDto;
export interface Autor {
  idAutor: number;
  nombreAutor: string;
}

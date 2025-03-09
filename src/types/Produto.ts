export interface Produto {
  id?: number,
  nome: string,
  descricao: string;
  valor: number;
  estoque: number;
  imagemPath: string | File;
  imagem?: string | File | null | undefined;
  userId?: number | null | undefined;
}
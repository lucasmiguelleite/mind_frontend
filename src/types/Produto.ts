export interface Produto {
  id?: number,
  nome: string,
  descricao: string;
  valor: number;
  estoque: number;
  imagem: string | File;
}
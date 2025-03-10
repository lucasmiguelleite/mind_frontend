import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Produto } from "@/types/Produto"
import { useState } from "react"

interface ProdutoEditModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onSubmit: (produto: Produto) => void;
  produto: Produto | null;
}

export default function ProdutoEditModal({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  produto,
}: ProdutoEditModalProps) {

  // Estado para controlar os campos do formulário
  const [produtoEditado, setProdutoEditado] = useState<Produto>({
    nome: produto?.nome ?? '',
    descricao: produto?.descricao ?? '',
    valor: produto?.valor ?? 0,
    estoque: produto?.estoque ?? 1,
    imagemPath: produto?.imagemPath ?? '',
  });


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const image = `/images/${file?.name}`;

    // Atualiza o estado com o arquivo de imagem selecionado
    if (image) {

      setProdutoEditado(prevProduto => ({
        ...prevProduto,
        imagem: file, // armazenar o arquivo no estado
        imagemPath: image, // armazenar a URL da imagem no estado
      }));
    }
  };

  const handSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(produtoEditado); // Chama a função onSubmit passando os dados do produto
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Clique em "Salvar" quando tiver terminado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome" className="text-right">
              Nome
            </Label>
            <Input
              id="nome"
              className="col-span-3"
              onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descricao" className="text-right">
              Descrição
            </Label>
            <Input
              id="descricao"
              className="col-span-3"
              onChange={(e) => setProdutoEditado({ ...produtoEditado, descricao: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              Preço
            </Label>
            <Input
              id="valor"
              type="number"
              step='any'
              className="col-span-3"
              min={0.01}
              onChange={(e) => setProdutoEditado({ ...produtoEditado, valor: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estoque" className="text-right">
              Estoque
            </Label>
            <Input
              id="estoque"
              type="number"
              className="col-span-3"
              min={1}
              onChange={(e) => setProdutoEditado({ ...produtoEditado, estoque: +e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imagem" className="text-right">
              Imagem
            </Label>
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              className="col-span-3"
              onChange={handleImageChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
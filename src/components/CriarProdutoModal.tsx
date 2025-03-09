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

interface CriarProdutoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onSubmit: (produto: Produto) => void;
  title?: string;
  icon?: React.ReactNode;
}

export default function CriarProdutoModal({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  title,
  icon,

}: CriarProdutoModalProps) {

  // Estado para controlar os campos do formulário
  const [produto, setProduto] = useState<Produto>({
    nome: '',
    descricao: '',
    valor: 0.00,
    estoque: 0,
    imagemPath: '',
    imagem: null,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const image = `/images/${file?.name}`;

    console.log(file);
    // Atualiza o estado com o arquivo de imagem selecionado
    if (image) {

      setProduto(prevProduto => ({
        ...prevProduto,
        imagem: file, // armazenar o arquivo no estado
        imagemPath: image, // armazenar a URL da imagem no estado
      }));
    }
  };

  const handSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(produto); // Chama a função onSubmit passando os dados do produto
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-primaryColor hover:bg-gray-600">
          {icon}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
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
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
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
              onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
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
              onChange={(e) => setProduto({ ...produto, valor: parseFloat(e.target.value) || 0 })}
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
              onChange={(e) => setProduto({ ...produto, estoque: +e.target.value })}
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
            <Button type="submit">Salvar Produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
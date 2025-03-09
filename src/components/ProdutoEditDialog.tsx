import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Produto } from "@/types/Produto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";

interface ProdutoEditDialogProps {
  produto: Produto | null; // Produto a ser editado
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

export function ProdutoEditDialog({
  produto,
  isOpen,
  onClose,
  onSave,
}: ProdutoEditDialogProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | File>("");
  const [valor, setValor] = useState(0);
  const [estoque, setEstoque] = useState(0);

  // Preenche os campos quando o produto é passado
  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setDescricao(produto.descricao);
      setImagemPreview(produto.imagem);
      setValor(produto.valor);
      setEstoque(produto.estoque);
    }
  }, [produto]);

  // Função para lidar com o upload da imagem
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  // Função para salvar as alterações
  const handleSave = () => {
    if (produto) {
      const updatedProduto = new FormData();

      produto.id ? updatedProduto.append("id", produto.id.toString()) : null;
      updatedProduto.append("nome", nome);
      updatedProduto.append("descricao", descricao);
      updatedProduto.append("valor", valor.toString());
      updatedProduto.append("estoque", estoque.toString());
      if (imagem) {
        updatedProduto.append("imagem", imagem); // Anexando a imagem
      }

      onSave(updatedProduto);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nome do produto"
          />
          <Input
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Descrição do produto"
          />
          <div>
            <Label className="block mb-2">Imagem do Produto</Label>
            <Input
              type="file"
              onChange={handleImagemChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {imagemPreview && (
              <div className="mt-2">
                <img
                  src={typeof imagemPreview === "string" ? imagemPreview : URL.createObjectURL(imagemPreview)}
                  alt="Imagem Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <Input
            required
            type="number"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Valor"
          />
          <Input
            required
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Estoque"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-primaryColor" >Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
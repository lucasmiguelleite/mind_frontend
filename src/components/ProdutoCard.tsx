import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { Produto } from "@/types/Produto"
import { useWindowWidth } from "@/hooks/useWindowWidth"

interface ProductCardProps {
  produto: Produto
  onEdit: (produto: Produto) => void
  onRemove: (id: number | undefined) => void
}

export function ProdutoCard({ produto, onEdit, onRemove }: ProductCardProps) {
  const screenWidth = useWindowWidth();

  return (
    <Card className="w-full p-0">
      <CardContent className="p-0">
        <div className="aspect-square relative mb-2 p-0">
          <Image
            fill
            src={typeof produto.imagem == "string" ? produto.imagem : 'error'}
            alt={produto.nome}
            className="rounded-t-md object-cover"
          />
        </div>
        <div className="px-6 pb-2">
          <h3 className="font-semibold md:text-xl text-2xl mb-1">{produto.nome}</h3>
          <p className="text-md md:text-sm text-gray-500  mb-2 max-h-14 min-h-14 break-all">{produto.descricao}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-bold md:text-xl text-2xl text-center ">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(produto.valor)}</p>
            <p className="text-lg md:text-sm text-gray-600 text-center">Estoque: {produto.estoque}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Button variant="outline" size={screenWidth < 400 ? 'default' : screenWidth < 768 ? 'lg' : 'sm'} onClick={() => onEdit(produto)}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive" size={screenWidth < 400 ? 'default' : screenWidth < 768 ? 'lg' : 'sm'} onClick={() => onRemove(produto.id)}>
          <Trash2 className="h-4 w-4" />
          Remover
        </Button>
      </CardFooter>
    </Card>
  )
}
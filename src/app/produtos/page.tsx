"use client"

import Header from "@/components/Header";
import { ProdutoCard } from "@/components/ProdutoCard";
import { ProdutoEditDialog } from "@/components/ProdutoEditDialog";
import axios from "@/lib/axios";
import { Produto } from "@/types/Produto";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Produtos = () => {
  const { data: session } = useSession();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [produtoParaEdicao, setProdutoParaEdicao] = useState<Produto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = session?.user.jwt;



  useEffect(() => {
    if (token) {
      axios.get('/produtos', { headers: { "Authorization": `Bearer ${token}` } })
        .then(response => {
          setProdutos(response.data)
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [token]);


  const handleEdit = (produto: Produto) => {
    setProdutoParaEdicao(produto);
    setIsDialogOpen(true);
  };

  const handleRemove = async (id: number | undefined) => {
    try {
      const URL = `produtos/${id}`
      await axios.delete(URL, { headers: { "Authorization": `Bearer ${token}` } })

      // Atualiza o estado removendo o produto deletado
      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));

    } catch (error) {
      console.error("Erro ao remover o produto:", error);
    }
  };

  // Função chamada quando um novo produto for criado
  const handleProdutoCriado = (produto: Produto) => {
    // Atualiza a lista de produtos localmente
    setProdutos((prevProdutos) => [...prevProdutos, produto]);
  };


  const handleSaveProduto = async (formData: FormData) => {
    try {
      const response = await axios.patch("/produtos", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Enviar como multipart/form-data
        },
      });

      // Atualizar o produto na lista local
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === response.data[0].id ? response.data[0] : produto
        )
      );
      setIsDialogOpen(false);
      toast.success("Produto editado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  if (produtos.length === 0) {
    return (
      <>
        <Header home={false} />
        <div className="container min-h-screen min-w-screen">
          <div className="my-48 flex justify-center">
            <div className="text-center text-2xl md:text-lg">
              <h1> Você ainda não possui nenhum produto adicionado.</h1>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header home={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mx-2 md:mx-10 mt-6 lg:grid-cols-4 gap-6">
        {produtos.map((product) => (
          <ProdutoCard
            key={product.id}
            produto={product}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}
      </div>
      {/* Dialog para editar o produto */}
      <ProdutoEditDialog
        produto={produtoParaEdicao}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduto}
      />
    </>
  )

}

export default Produtos;
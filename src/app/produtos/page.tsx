"use client"

import CriarProdutoModal from "@/components/CriarProdutoModal";
import Header from "@/components/Header";
import { ProdutoCard } from "@/components/ProdutoCard";
import { ProdutoEditDialog } from "@/components/ProdutoEditDialog";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { Produto } from "@/types/Produto";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const Produtos = () => {
  const { data: session } = useSession();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoCriado, setProdutoCriado] = useState<Produto | null>(null);
  const [produtoParaEdicao, setProdutoParaEdicao] = useState<Produto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const token = session?.user.jwt;

  useEffect(() => {
    if (token) {
      axios.get('/produtos', { headers: { "Authorization": `Bearer ${token}` } })
        .then(response => {
          setProdutos(response.data)
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
      const data = {
        id: produtoParaEdicao?.id,
        nome: formData.get("nome"),
        preco: parseFloat(formData.get("preco") as string),
        quantidade: parseInt(formData.get("quantidade") as string),
        descricao: formData.get("descricao") as string,
        imagem: formData.get("imagem"),
      }
      const response = await axios.patch("/produtos", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar como multipart/form-data
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

  const handleAddProduto = async (produto: Produto) => {

    try {
      const data = {
        nome: produto.nome,
        descricao: produto.descricao,
        imagem: produto.imagemPath,
        valor: Number(produto.valor),
        estoque: Number(produto.estoque),
        userId: Number(session?.user?.id),
      }
      console.log(data)
      const response = await axios.post('/produtos', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (produto.imagem) {
        const formData = new FormData();
        formData.append('imagem', produto?.imagem);
        const uploadImage = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      }



      console.log(response)
      setProdutoCriado(response.data);
      setIsAddProductOpen(false)
      toast.success('Produto criado!');
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }

  }

  return (
    <>
      <Header home={false} />
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mx-2 md:mx-10 mb-20 mt-6 lg:grid-cols-4 gap-6">
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
      <Button className="fixed bottom-1 right-1 size-20 rounded-full" onClick={() => setIsAddProductOpen(true)}>
        <Plus className="size-15" />
      </Button>
      <CriarProdutoModal
        title={"Adicionar"}
        icon={<Plus className="h-5 w-5 bg-primaryColor hover:bg-gray-600" />}
        isModalOpen={isAddProductOpen}
        setIsModalOpen={setIsAddProductOpen}
        onSubmit={handleAddProduto}
      />
    </>
  )

}

export default Produtos;
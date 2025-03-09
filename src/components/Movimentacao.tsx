"use client"

import axios from "@/lib/axios";
import { getServerAuthSession } from "@/server/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MoveDownLeft, MoveUpRight } from 'lucide-react';

export function Movimentacao() {
  const { data: session } = useSession();
  const [movimentacao, setMovimentacao] = useState<{ id: number; nome: string; quantidade: number; data: string; tipo: string; produtoExcluido: string | null; produtoId: number | null; }[]>([]);
  const [produtoNames, setProdutoNames] = useState<{ [key: number]: string }>({}); // Para armazenar os nomes dos produtos por ID

  useEffect(() => {
    async function getMovimentacao() {
      try {
        const response = await axios.get('/produtos/movimentacao', {
          headers: {
            Authorization: `Bearer ${session?.user.jwt}`
          }
        });
        setMovimentacao(response.data);

        // Para cada movimentação, buscar o nome do produto correspondente
        response.data.forEach((mov: any) => {
          if (mov.produtoId && !produtoNames[mov.produtoId]) {
            fetchProdutoName(mov.produtoId); // Chama a função para buscar o nome do produto
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    if (session) {
      getMovimentacao();
    }
  }, [session]);

  // Função para buscar o nome do produto baseado no seu ID
  async function fetchProdutoName(produtoId: number) {
    try {
      const response = await axios.get(`/produtos/${produtoId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.jwt}`
          }
        }
      );
      setProdutoNames((prevNames) => ({
        ...prevNames,
        [produtoId]: response.data.nome
      }));
    } catch (err) {
      console.error(`Erro ao buscar produto ${produtoId}`, err);
    }
  }

  return (
    <div className="w-full md:p-10 p-2">
      <h1 className="text-center font-bold">Movimentações</h1>
      <Table className="min-w-full table-auto items-center mx-auto">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-center w-5">Tipo</TableHead>
            <TableHead className="text-center w-5">ID</TableHead>
            <TableHead className="text-center w-5 md:w-auto">Produto</TableHead>
            <TableHead className="text-center mt-6 md:block hidden">Quantidade</TableHead>
            <TableHead className="text-center sm:block md:hidden w-5">Quant.</TableHead>
            <TableHead className="text-center w-36">Data e Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimentacao.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell>
                {mov.tipo == "Saída" ? (
                  <MoveDownLeft color="red" />
                ) : (
                  <MoveUpRight color="green" />
                )}
              </TableCell>
              <TableCell>{mov.id}</TableCell>
              <TableCell className="text-center">{mov.produtoExcluido ? mov.produtoExcluido : mov.produtoId ? produtoNames[mov.produtoId] : "Carregando..."}</TableCell>
              <TableCell className="text-center">{mov.quantidade}</TableCell>
              <TableCell className="text-center">
                {mov.data && !isNaN(new Date(mov.data).getTime()) ? (
                  new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(mov.data))
                ) : (
                  "Data inválida"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
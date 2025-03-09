"use client"

import axios from "@/lib/axios";
import { getServerAuthSession } from "@/server/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MoveDownLeft, MoveUpRight } from 'lucide-react';

export function Movimentacao() {
  const { data: session } = useSession();
  const [movimentacao, setMovimentacao] = useState<{ id: number; nome: string; quantidade: number; data: string; tipo: string }[]>([]);

  useEffect(() => {
    async function getMovimentacao() {
      try {
        const response = await axios.get('/produtos/movimentacao', {
          headers: {
            Authorization: `Bearer ${session?.user.jwt}`
          }
        });
        console.log(response.data);
        setMovimentacao(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (session) {
      getMovimentacao();
    }
  }, [session]);


  console.log(movimentacao);

  return (
    <div className="w-full">
      <h1>Movimentações</h1>
      <Table className="min-w-full table-auto items-center mx-auto">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-center w-5">Tipo</TableHead>
            <TableHead className="text-center w-5">ID</TableHead>
            <TableHead className="text-center w-5">Nome Produto</TableHead>
            <TableHead className="text-center mt-6 md:block hidden">Quantidade</TableHead>
            <TableHead className="text-center sm:block md:hidden w-5">Quant.</TableHead>
            <TableHead className="text-center w-36">Data e Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimentacao.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell>
                {mov.tipo === "entrada" ? (
                  <MoveDownLeft color="red" />
                ) : (
                  <MoveUpRight color="green" />
                )}
              </TableCell>
              <TableCell>{mov.id}</TableCell>
              <TableCell className="text-center">{mov.nome}</TableCell>
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
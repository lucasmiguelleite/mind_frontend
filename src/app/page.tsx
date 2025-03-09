import Header from "@/components/Header";
import { Movimentacao } from "@/components/Movimentacao";
import { getServerAuthSession } from "@/server/auth";
import axios from "axios";

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session?.user;

  return (
    <>
      <Header />
      <div className="items-center justify-items-center p-2 my-2 gap-16 sm:p-5 ">
        {user && (
          <p>Seja Bem-vindo, {user?.name}</p>
        )}
      </div>
      <Movimentacao />
    </>
  );
}

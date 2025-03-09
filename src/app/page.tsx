import Header from "@/components/Header";
import { getServerAuthSession } from "@/server/auth";
import axios from "axios";

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session?.user;

  return (
    <>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {user && (
          <p>Bem vindo, {user?.name}</p>
        )}
      </div>
    </>
  );
}

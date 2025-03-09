"use client"

import { Logout } from "./LogOut";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  home: boolean;
}

export default function Header({ home }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header>
      <nav className="my-4 mx-4 flex justify-between ">
        {home ? (
          <>
            <div className="mt-2">{user && (
              <p>Olá, {user?.name}</p>
            )}
            </div>
            <Link href="/produtos" className="mt-2 navLink">Ver Produtos</Link>
          </>
        ) : (
          <Link href="/" className="navLink inline-flex"><ArrowLeft className="me-2" /> Movimentações</Link>
        )}

        <Logout />
      </nav>
    </header>
  );
}
"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Cadastro = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      return router.push("/");
    }

  }, [status, router])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 4 || password.length > 8) {
      setError("A senha deve ter entre 4 e 8 caracteres.");
      return;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)) {
      setError("A senha deve ter no minímo um caractere numérico, uma letra maiúscula e uma letra minúscula.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/user', { email, password, name });

      if (!res.data) {
        throw new Error();
      }

      const resLogin = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (!resLogin) {
        throw new Error("Não foi possível cadastrar o usuário.");
      }

      router.push("/");
    } catch (err) {
      setError("Email fornecido já está sendo utilizado por outro usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-row justify-center items-center h-screen ">
      <Card className="w-[350px]">
        <CardHeader className="text-center text-xl">
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="cadastroForm"
            onSubmit={(e) => onSubmit(e)}
          >
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailCadastro">Email</Label>
                <Input
                  id="emailCadastro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="authInput"
                  required
                />
                <Label htmlFor="nomeCadastro">Nome</Label>
                <Input
                  id="nomeCadastro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="authInput"
                  required
                />
                <Label htmlFor="passwordCadastro">Senha</Label>
                <Input
                  id="passwordCadastro"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="authInput"
                  required
                />
                <Label htmlFor="passwordConfirmCadastro">Confirme a senha</Label>
                <Input
                  id="passwordConfirmCadastro"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  type="password"
                  className="authInput"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={!password || !email || loading || password !== passwordConfirm}>
              {loading ? "Criando..." : "Criar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link className="link" href={'/login'}>Já possui uma conta?</Link>
        </CardFooter>
      </Card>
    </section>
  )
}

export default Cadastro;
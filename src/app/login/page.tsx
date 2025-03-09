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
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      if (res?.error) {
        throw setError("Usuário ou senha estão incorretos");
      }
      router.push("/");
    } catch (err) {
      setError("Usuário ou senha estão incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-row justify-center items-center h-screen ">
      <Card className="w-[350px]">
        <CardHeader className="text-center text-xl">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="loginForm"
            onSubmit={(e) => onSubmit(e)}
          >
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailLogin">Email</Label>
                <Input
                  id="emailLogin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="authInput"
                  required
                />
                <Label htmlFor="passwordLogin">Senha</Label>
                <Input
                  id="passwordLogin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="authInput"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={!password || !email || loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link className="link" href={'/cadastro'}>Criar uma conta</Link>
        </CardFooter>
      </Card>
    </section>
  )
}

export default Login;
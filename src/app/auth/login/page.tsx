"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signIn, SignInResponse, useSession } from "next-auth/react";
import { useState } from "react";

const Login = (props: any) => {
  // Recupera sessão do usuário a partir do custom Hook useSession(), fornecido pelo Next-Auth
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Função que será a responsável por inicializar a autenticação do usuário, a partir da função signIn, fornecida pelo Next-Auth
  const login = async (email: string, password: string) => {
    const retorno: SignInResponse | undefined = await signIn("credentials", {
      username: email,
      password: password,
      redirect: false,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      login(email, password)
        .then((resp) => {
          console.log("Success");
        })
        .catch((error) => {
          console.error("Error");
        })
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <section className="w-full flex flex-row justify-center items-center h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Input />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </section>
  )
}

export default Login;
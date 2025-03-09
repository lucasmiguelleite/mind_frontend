import axios from "@/lib/axios";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      jwt: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    name: string;
    token: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.jwt = token.jwt as string; // Adiciona o token JWT ao user
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        // Armazena os dados do usuário e o token JWT do backend
        token.id = user.id;
        token.name = user.name;
        token.jwt = user.token; // Guarda o token JWT do backend
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email ou senha inválidos");
          }

          const response = await axios.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (!response.data) {
            throw new Error("Credenciais inválidas");
          }

          const token = response.data.access_token;

          const getUser = await axios.get('/auth/profile',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return {
            id: getUser.data.sub,
            name: getUser.data.nome,
            token: token,
          };
        } catch (error) {
          console.error("Erro no Login: ", error);
          return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
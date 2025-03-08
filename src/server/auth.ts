import axios from "@/lib/axios";
import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
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

          const getUser = await axios.get('/auth/profile',
            {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          );

          console.log(getUser)

          return response.data;
        } catch (error) {
          console.error("Erro no Login: ", error);
          return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
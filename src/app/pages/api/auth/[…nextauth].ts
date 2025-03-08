import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";

// Editar a configuração padrão do Next-Auth
export default NextAuth({
  providers: [
    // Seleciona o modo de autenticação, nesse caso utilizaremos as Credentials (tokens)
    CredentialsProvider({

      name: "Credentials",

      // Tipo de inputs que serão utilizados para realizar a autenticação
      credentials: {
        username: { label: "Username", type: "text", placeholder: "login" },
        password: { label: "Password", type: "password" },
      },

      // Função que irá realizar o request de autenticação do usuário
      async authorize(credentials, req) {

        // Rota a qual irá receber as credenciais e realizará a autenticação do usuário no Backend
        const res = await axios.post("/login/", {
          // Perceba que o username e o password são os declarados no objeto credentials a cima
          username: credentials?.username,
          password: credentials?.password,
        });

        // Atribui a variável user a resposta contendo o token
        let user = await res.data;

        // O token de acesso está contido no obj access (Ver Figura 1)
        if (user.access) {
          // Caso o retorno cotenha um token de acesso, será armazenado
          return user;
        } else {
          // Se não, o retorno será nulo
          return null;
        }
      },
    }),
  ],

  // As funções de callbacks são as responsáveis por recuperar a sessão do usuário dentro da aplicação
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});
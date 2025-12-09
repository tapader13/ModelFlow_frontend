import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          const res = await fetch("http://127.0.0.1:8000/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          const data = await res.json();
          if (res.ok && data.access_token) {
            token.backendToken = data.access_token as string; // ✅ assert string
          }
        } catch (err) {
          console.error(err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // assert string here to satisfy TS
      session.backendToken = token.backendToken as string | undefined;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

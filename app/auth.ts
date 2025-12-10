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
      // 1️ First time login
      if (user) {
        const res = await fetch("http://127.0.0.1:8000/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await res.json();
        console.log(data,"data")

        if (res.ok) {
          token.access_token = data.access_token;
          token.refresh_token = data.refresh_token;
          token.expires_at = Date.now() + 15 * 60 * 1000; // 15 min
        }
      }

      // 2️ If token NOT expired → return existing token
      if (Date.now() < (token.expires_at as number)) {
        return token;
      }
       console.log(token,"token")
      // 3️ Token expired → refresh it
      try {
        // print(token,"tyyyjjd")
        // const refreshToken = token?.iat
        console.log(token.refresh_token,"reftok")
        const res = await fetch("http://127.0.0.1:8000/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refresh_token: token.refresh_token,
          }),
        });

        const data = await res.json();

        if (res.ok && data.access_token) {
          token.access_token = data.access_token;
          token.expires_at = Date.now() + 15 * 60 * 1000; // extend
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.access_token as string;
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});

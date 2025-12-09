import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google(
    {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  )],
  callbacks: {
      async signIn({ user, account, profile }) {
        console.log(user,"from auth google")

      try {
        const res = await fetch("http://127.0.0.1:8000/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email
          }),
        });

        const data = await res.json();
        console.log(data,"backend resposnse")
        // If backend returns success, allow login
        return res.ok;
      } catch (err) {
        console.error("Backend login error:", err);
        return false; // block login if backend fails
      }
    },
    
    // authorized: async ({ auth }) => {
    //   // Logged in users are authenticated, otherwise redirect to login page
    //   return !!auth
    // },
  },
  secret:process.env.AUTH_SECRET
})
// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string; // now TS knows session has this
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string; // TS knows JWT has this
  }
}

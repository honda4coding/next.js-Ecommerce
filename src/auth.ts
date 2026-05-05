import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/src/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/src/models/User";
import dbConnect from "@/src/lib/dbConnect";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise as any),
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    Credentials({
      credentials: { 
        email: { label: "Email", type: "text" }, 
        password: { label: "Password", type: "password" } 
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        
        if (user && user.password && await bcrypt.compare(credentials.password as string, user.password)) {
          return { 
            id: user._id.toString(), 
            email: user.email, 
            role: user.role 
          };
        }
        return null;
      },
    }),
  ],
});
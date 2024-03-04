import { autOptions } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(autOptions)

export { handler as GET, handler as POST }
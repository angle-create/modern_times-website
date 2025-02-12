import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    role?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
} 
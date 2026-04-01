import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" 
})

// Export the specific hooks we need for the UI
export const { signIn, signOut, useSession } = authClient;
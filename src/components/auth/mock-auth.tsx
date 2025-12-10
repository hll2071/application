
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USER, User } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";

interface Session {
    user?: User;
    expires: string;
}

interface AuthContextType {
    data: Session | null;
    status: "authenticated" | "loading" | "unauthenticated";
    signIn: (provider?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    data: null,
    status: "loading",
    signIn: async () => { },
    signOut: async () => { },
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [status, setStatus] = useState<"authenticated" | "loading" | "unauthenticated">("loading");

    useEffect(() => {
        // Check local storage for simulated session
        const checkSession = async () => {
            // Simulate checking a cookie or token
            const savedSession = localStorage.getItem("mock_session");
            if (savedSession) {
                try {
                    // In a real app we'd validate, here we just trust it or refresh user data
                    const user = await dataService.getCurrentUser();
                    setSession({ user, expires: "9999-12-31" });
                    setStatus("authenticated");
                } catch (e) {
                    setStatus("unauthenticated");
                }
            } else {
                setStatus("unauthenticated");
            }
        };
        checkSession();
    }, []);

    useEffect(() => {
        const handleSignIn = () => signIn();
        const handleSignOut = () => signOut();

        window.addEventListener('MOCK_SIGNIN_REQUEST', handleSignIn);
        window.addEventListener('MOCK_SIGNOUT_REQUEST', handleSignOut);

        return () => {
            window.removeEventListener('MOCK_SIGNIN_REQUEST', handleSignIn);
            window.removeEventListener('MOCK_SIGNOUT_REQUEST', handleSignOut);
        }
    }, []);

    const signIn = async (provider?: string) => {
        setStatus("loading");
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate successful login with Mock User
        const user = await dataService.getCurrentUser();
        const newSession = { user, expires: "9999-12-31" };

        setSession(newSession);
        setStatus("authenticated");
        localStorage.setItem("mock_session", "true");
    };

    const signOut = async () => {
        setStatus("loading");
        await new Promise((resolve) => setTimeout(resolve, 500));

        setSession(null);
        setStatus("unauthenticated");
        localStorage.removeItem("mock_session");
    };

    return (
        <AuthContext.Provider value={{ data: session, status, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useSession = () => {
    return useContext(AuthContext);
};

export const signIn = async (provider?: string) => {
    // This standalone function is a bit tricky because it needs access to context.
    // In NextAuth proper, signIn can be called outside components, redirecting the browser.
    // For our mock, we'll implement a simple redirect logic or simple alert if used outside context,
    // BUT: The components using `import { signIn } from 'next-auth/react'` usuallly call it in event handlers.
    // Ideally they should take it from the context if possible, but the standard export is global.
    // We will export a bridge that accesses the context if possible, or just does a hard reload trick? No.
    // 
    // BETTER APPROACH:
    // We cannot easily export a `signIn` function that affects the Context state from outside the tree without a global store.
    // However, since we are modifying the files anyway, we can change usage to `const { signIn } = useSession()` IF supported?
    // NextAuth `useSession` DOES NOT return signIn/signOut.
    // 
    // Alternative: Make the buttons implementation smarter or use a global event bus.
    // Or, we'll make a specialized "LoginButton" component, but that changes UI.
    //
    // Let's implement a global event emitter for this specific mock case.
    window.dispatchEvent(new CustomEvent('MOCK_SIGNIN_REQUEST'));
};

export const signOut = async () => {
    window.dispatchEvent(new CustomEvent('MOCK_SIGNOUT_REQUEST'));
};

// Global listener in provider
// We will update the Provider to listen to these events.

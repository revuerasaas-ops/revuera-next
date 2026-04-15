"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginWallProps = {
  children: React.ReactNode;
  message?: string;
};

/**
 * Wraps content that requires authentication.
 * Shows a login prompt overlay if not authenticated.
 */
export function LoginWall({ children, message }: LoginWallProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <>{children}</>;

  if (!isAuthenticated) {
    return (
      <div className="relative">
        {/* Blurred preview behind */}
        <div className="blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden>
          {children}
        </div>
        {/* Login overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-cream/60 backdrop-blur-sm rounded-2xl">
          <div className="text-center px-6 py-8 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-5 w-5 text-brand-600" />
            </div>
            <h3 className="text-heading-md text-stone-900 mb-2">Create a free account to continue</h3>
            <p className="text-body-sm text-stone-500 mb-5">
              {message || "Sign up to unlock this tool — it's free and takes 30 seconds."}
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-brand-600 hover:bg-brand-700 h-11 rounded-xl">
                <Link href="/signup">Sign Up Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Link href="/login" className="text-body-sm text-stone-500 hover:text-brand-600 font-medium">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";

type SmartCtaProps = {
  children: React.ReactNode;
  className?: string;
  plan?: string;
  onClick?: () => void;
};

export function SmartCta({ children, className, plan, onClick }: SmartCtaProps) {
  const { isAuthenticated, user } = useAuth();

  let href = "/signup";

  if (isAuthenticated && user) {
    const hasSubscription = user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
    if (hasSubscription) {
      href = user.plan === "Ecommerce" ? "/dashboard/ecommerce" : "/dashboard/starter";
    } else {
      href = plan ? `/pricing?plan=${plan}` : "/pricing";
    }
  } else {
    href = plan ? `/signup?plan=${plan}` : "/signup";
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

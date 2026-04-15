import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 skeleton rounded-3xl" />}>
      <LoginForm />
    </Suspense>
  );
}

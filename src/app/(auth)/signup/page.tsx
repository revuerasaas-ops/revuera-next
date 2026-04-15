import { Suspense } from "react";
import SignupForm from "./signup-form";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-[500px] skeleton rounded-3xl" />}>
      <SignupForm />
    </Suspense>
  );
}

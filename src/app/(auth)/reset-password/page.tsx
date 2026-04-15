import { Suspense } from "react";
import ResetForm from "./reset-form";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-80 skeleton rounded-3xl" />}>
      <ResetForm />
    </Suspense>
  );
}

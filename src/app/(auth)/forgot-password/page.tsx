import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot password | Innovasoft"
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ForgotPasswordForm/>
    </div>
  );
}

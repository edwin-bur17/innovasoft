import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/*  Login Form */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      {/* Image */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen items-center justify-center p-8">
        <div className="relative w-full h-3/4">
          <Image
            src="/innovasoft-logo.jpeg"
            alt="Login background"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
        {/* <div className="absolute bottom-8 left-8 text-black">
          <h2 className="text-3xl font-bold mb-2">Bienvenido de vuelta</h2>
          <p className="text-lg opacity-90">
            Accede a tu cuenta para continuar
          </p>
        </div> */}
      </div>
    </div>
  );
}

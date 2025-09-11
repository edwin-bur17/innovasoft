"use client";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Elementos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full text-blue-600">
            <defs>
              <pattern
                id="subtle-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <path
                  d="M0 20h40M20 0v40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#subtle-pattern)" />
          </svg>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <LoginForm />
      </div>

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative w-full max-w-2xl text-center">
          {/* Robot arriba */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl border border-gray-300 shadow-sm relative">
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-gray-100 rounded border flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                  className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Imagen*/}
          <div className="mb-10">
            <div className="flex justify-center">
              <div className="w-4/5 max-w-2xl rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-200 p-4">
                <Image
                  src="/logo.png"
                  alt="TechFlow Logo"
                  width={700} 
                  height={200}
                  className="w-full h-40 object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Slogan más grande */}
          <div className="space-y-4">
            <p className="text-3xl text-gray-700 font-light leading-relaxed">
              Automatizamos tu presente,
            </p>
            <p className="text-4xl text-blue-600 font-bold leading-relaxed">
              transformamos tu futuro
            </p>
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

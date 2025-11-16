"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Error al iniciar sesión", {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast.success("¡Bienvenido!", {
          description: "Has iniciado sesión correctamente",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error inesperado", {
        description: "Por favor, intenta de nuevo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="w-full max-w-md">
        <Card className="glass shadow-2xl hover-lift border-0">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
              <span className="text-3xl">🧭</span>
            </div>
            <CardTitle className="text-4xl font-bold gradient-text">
              Compás
            </CardTitle>
            <CardDescription className="text-base">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 px-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 text-base border-2 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="h-12 text-base border-2 focus:border-primary-500 transition-all"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold gradient-primary hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">o</span>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full h-12 flex items-center justify-center px-4 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transform hover:scale-105 transition-all duration-300"
              >
                Crear Cuenta Nueva
              </Link>

              <p className="text-sm text-center text-gray-600 pt-2">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

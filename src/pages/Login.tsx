import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { LoginRequest } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { Bounce, toast } from "react-toastify";
import type { AxiosError } from "axios";

const TOAST_OPTS = {
  position: "top-center" as const,
  autoClose: 5000,
  theme: "light" as const,
  transition: Bounce,
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      toast.success("Login realizado com sucesso!", TOAST_OPTS);
      navigate("/ministries", { replace: true });
    },
    onError: (error: AxiosError<Record<string, string>>) => {
      if (!error.response) {
        toast.error("Servidor offline");
        return;
      }

      const data = error.response.data;

      const firstErrorMessage = Object.values(data)[0];

      toast.error(
        (firstErrorMessage as string) || "Erro ao fazer login",
        TOAST_OPTS,
      );
    },
  });

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const credentials: LoginRequest = {
      email: email,
      password: password,
    };

    loginMutation.mutate(credentials);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h2>

        <form className="space-y-4" onSubmit={(e) => onSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="seu@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors ${
              loginMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {loginMutation.isPending ? "Entrando..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm flex justify-center gap-1">
          <span className="text-gray-600">Não tem uma conta?</span>
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

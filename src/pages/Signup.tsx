import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserRequest } from "../types/auth";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import type { AxiosError } from "axios";

const TOAST_OPTS = {
  position: "top-center" as const,
  autoClose: 5000,
  theme: "light" as const,
  transition: Bounce,
};

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useMutation({
    mutationFn: (credentials: UserRequest) => authService.signUp(credentials),
    onSuccess: () => {
      toast.success(
        "Conta criada com sucesso! Faça login para continuar.",
        TOAST_OPTS,
      );
      navigate("/login", { replace: true });
    },
    onError: (error: AxiosError<Record<string, string>>) => {
      if (!error.response) {
        toast.error("Servidor offline");
        return;
      }

      const data = error.response.data;

      // pega a primeira mensagem de erro do objeto
      const firstErrorMessage = Object.values(data)[0];

      toast.error(
        (firstErrorMessage as string) || "Erro ao criar conta",
        TOAST_OPTS,
      );
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const credentials: UserRequest = {
      username: username,
      name: name,
      email: email,
      password: password,
      birth: birth,
    };

    signupMutation.mutate(credentials);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Criar Conta
        </h2>

        <form className="space-y-4" onSubmit={(e) => onSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              value={username}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="seu nome de usuário"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="seu nome completo"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="seu@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="birth"
              value={birth}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setBirth(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={password}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              A senha deve ter pelo menos 8 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors ${
              signupMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {signupMutation.isPending ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm flex justify-center gap-1">
          <span className="text-gray-600">Já tem uma conta?</span>
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

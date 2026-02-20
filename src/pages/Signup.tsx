import { useState } from "react";
import type { UserRequest } from "../types/auth";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";

function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useMutation({
    mutationFn: (credentials: UserRequest) => authService.signUp(credentials),
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      alert("Signup successful! Please log in.");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      alert("Signup failed. Please check your information and try again.");
    },
  });

  function onSubmit(e: React.SubmitEvent) {
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
            className="w-full text-white font-medium py-2.5 rounded-lg transition-colors bg-blue-500 hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm flex justify-center">
          <p>Já tem uma conta?</p>
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-700 font-medium pl-1"
          >
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;

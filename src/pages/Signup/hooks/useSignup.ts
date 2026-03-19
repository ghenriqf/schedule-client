import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "@/features/auth";
import { useApiError } from "@/shared/lib/useApiError";
import type { UserRequest } from "@/features/auth";

export function useSignup() {
  const navigate = useNavigate();
  const { handle } = useApiError({
    messages: {
      CONFLICT: "Email ou nome de usuário já cadastrado.",
      VALIDATION: "Verifique os dados informados e tente novamente.",
      NETWORK_ERROR: "Servidor indisponível. Verifique sua conexão.",
    },
  });

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: UserRequest) => authApi.signUp(credentials),
    onSuccess: () => {
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login", { replace: true });
    },
    onError: handle,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ username, name, email, password, birth });
  }

  return {
    username,
    setUsername,
    name,
    setName,
    email,
    setEmail,
    birth,
    setBirth,
    password,
    setPassword,
    isPending,
    onSubmit,
  };
}

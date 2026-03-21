import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ministryApi } from "@/features/ministry";

interface Props {
  ministryId: number;
  initialCode?: string | null;
}

export function InviteCodeSection({ ministryId, initialCode }: Props) {
  const [code, setCode] = useState<string | null>(initialCode ?? null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await ministryApi.generateInviteCode(ministryId);
      setCode(response);
      queryClient.invalidateQueries({ queryKey: ["ministry", ministryId] });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return (
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full text-xs font-semibold text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
      >
        {loading ? "Gerando..." : "Gerar código de convite"}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full flex justify-between font-mono text-sm bg-slate-50 border rounded-lg px-3 py-2"
    >
      <span>{code}</span>
      <span className="text-xs">{copied ? "✓ copiado" : "copiar"}</span>
    </button>
  );
}

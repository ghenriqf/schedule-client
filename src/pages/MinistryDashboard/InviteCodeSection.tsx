import { useState } from "react";
import { ministriesService } from "../../services/ministries.service";

export function InviteCodeSection({
  ministryId,
  initialCode,
}: {
  ministryId: number;
  initialCode?: string | null;
}) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const newCode = await ministriesService.generateInviteCode(ministryId);
      setCode(newCode);
    } catch {
      setError("Erro ao gerar código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-2">
      <p className="text-[10px] font-bold text-indigo-700 uppercase text-center">
        Código de Convite
      </p>

      {code && (
        <code className="block text-sm font-mono text-slate-800 bg-white border border-indigo-100 rounded-md p-2 text-center select-all">
          {code}
        </code>
      )}

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-indigo-600 text-white p-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Gerando..." : code ? "Gerar novo código" : "Gerar código"}
      </button>
    </div>
  );
}

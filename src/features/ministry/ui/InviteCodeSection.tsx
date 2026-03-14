import { useState } from "react";

interface Props {
  initialCode?: string | null;
}

export function InviteCodeSection({ initialCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!initialCode) return;

    await navigator.clipboard.writeText(initialCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  if (!initialCode) return null;

  return (
    <button
      onClick={handleCopy}
      className="w-full flex justify-between font-mono text-sm bg-slate-50 border rounded-lg px-3 py-2"
    >
      <span>{initialCode}</span>

      <span className="text-xs">{copied ? "✓ copiado" : "copiar"}</span>
    </button>
  );
}

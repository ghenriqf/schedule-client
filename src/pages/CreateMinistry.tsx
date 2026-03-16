import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ministryApi } from "@/features/ministry/api/ministryApi";
import type { MinistryRequest } from "@/entities/ministry/model/types";

const IconCamera = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconArrowLeft = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

type Step = 0 | 1 | 2;

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}

interface CharCountProps {
  value: string;
  max: number;
}

function CharCount({ value, max }: CharCountProps) {
  const pct = value.length / max;
  const color =
    pct > 0.9
      ? "text-red-400"
      : pct > 0.7
        ? "text-amber-400"
        : "text-slate-300";
  return (
    <span className={`text-xs tabular-nums ${color}`}>
      {value.length}/{max}
    </span>
  );
}

interface StepsProps {
  current: Step;
}

function Steps({ current }: StepsProps) {
  const steps = ["Informações", "Foto", "Revisar"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                active
                  ? "text-violet-600"
                  : done
                    ? "text-emerald-500"
                    : "text-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                  active
                    ? "bg-violet-600 border-violet-600 text-white"
                    : done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-200 text-slate-300"
                }`}
              >
                {done ? <IconCheck /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px transition-colors ${done ? "bg-emerald-300" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SuccessScreenProps {
  name: string;
  onNavigate: () => void;
}

function SuccessScreen({ name, onNavigate }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500 text-2xl">
          <IconCheck />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Ministério criado!</h2>
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-700">"{name}"</span> foi
          criado com sucesso. Agora você pode adicionar membros e escalas.
        </p>
        <button
          onClick={onNavigate}
          className="mt-2 w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Ver ministérios
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateMinistry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarImage) return null;
    return URL.createObjectURL(avatarImage);
  }, [avatarImage]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const request: MinistryRequest = {
        name: name.trim(),
        description: description.trim(),
      };
      return ministryApi.create(request, avatarImage);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ministries"] });
      setSubmitted(true);
    },
    onError: () => {
      toast.error("Não foi possível criar o ministério. Tente novamente.");
    },
  });

  const canGoNext0 = name.trim().length >= 2;
  const canSubmit = canGoNext0 && !isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    mutate();
  }

  if (submitted) {
    return (
      <SuccessScreen name={name} onNavigate={() => navigate("/ministries")} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/ministries")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <IconArrowLeft />
            <span className="hidden sm:inline">Ministérios</span>
          </button>

          <Steps current={step} />

          {/* spacer */}
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-800">Novo ministério</h1>
          <p className="text-sm text-slate-400 mt-1">
            {step === 0 && "Dê um nome e descreva o propósito do ministério."}
            {step === 1 && "Adicione uma imagem para identificar o ministério."}
            {step === 2 && "Confira as informações antes de salvar."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Step 0: Informações ── */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <Field label="Nome do ministério *">
                <input
                  type="text"
                  placeholder="Ex: Louvor, Diaconia, Departamento Infantil…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
                />
                <div className="flex justify-between mt-1.5">
                  {name.trim().length > 0 && name.trim().length < 2 ? (
                    <span className="text-xs text-red-400">
                      Mínimo 2 caracteres
                    </span>
                  ) : (
                    <span />
                  )}
                  <CharCount value={name} max={60} />
                </div>
              </Field>

              <Field
                label="Descrição"
                hint="Explique brevemente o propósito e atividades do ministério. (opcional)"
              >
                <textarea
                  rows={4}
                  placeholder="Ex: Ministério responsável por conduzir a igreja em louvor e adoração durante os cultos…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition resize-none"
                />
                <div className="flex justify-end mt-1.5">
                  <CharCount value={description} max={300} />
                </div>
              </Field>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={!canGoNext0}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 1: Foto ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center transition-all group-hover:border-violet-300">
                    {avatarPreviewUrl ? (
                      <img
                        src={avatarPreviewUrl}
                        alt="Preview do ministério"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <IconCamera />
                        <span className="text-xs">Sem foto</span>
                      </div>
                    )}
                  </div>

                  {avatarPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                      title="Remover imagem"
                    >
                      <IconTrash />
                    </button>
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      setAvatarImage(e.target.files?.[0] ?? null)
                    }
                  />
                  <span className="inline-block px-5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-violet-300 transition-colors">
                    {avatarImage ? "Trocar imagem" : "Escolher imagem"}
                  </span>
                </label>

                <p className="text-xs text-slate-400 text-center max-w-xs">
                  Formatos PNG ou JPG. Se não enviar, o ministério será criado
                  sem imagem — você pode adicionar depois.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Revisar ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-linear-to-br from-violet-100 via-indigo-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl opacity-25">🎸</span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                      Nome
                    </p>
                    <p className="text-base font-bold text-slate-800">{name}</p>
                  </div>

                  {description.trim() && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                        Descrição
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                      Foto
                    </p>
                    <p className="text-sm text-slate-600">
                      {avatarImage ? avatarImage.name : "Nenhuma foto enviada"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  ← Voltar
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <>
                      <IconSpinner />
                      Salvando…
                    </>
                  ) : (
                    <>
                      <IconCheck />
                      Salvar ministério
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

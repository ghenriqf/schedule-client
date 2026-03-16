import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { scaleApi } from "@/features/scale/api/scaleApi";
import { membersApi } from "@/features/ministry/api/membersApi";
import type { ScaleRequest } from "@/entities/scale/model/types";
import type { MemberResponse } from "@/entities/member/model/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const IconCalendar = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconUser = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateForApi(dateString: string): string {
  return dateString.replace("T", " ");
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        {required && (
          <span className="text-violet-500 text-sm leading-none">*</span>
        )}
      </div>
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

// ─── Minister selector card ───────────────────────────────────────────────────

interface MinisterSelectorProps {
  members: MemberResponse[];
  selected: number | "";
  onSelect: (id: number | "") => void;
}

function MinisterSelector({
  members,
  selected,
  onSelect,
}: MinisterSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {members.map((member) => {
        const name = member.user?.username ?? `Membro #${member.id}`;
        const email = member.user?.email ?? "";
        const isSelected = selected === member.id;
        const isAdmin = member.role === "ADMIN";

        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(isSelected ? "" : member.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              isSelected
                ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
                : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isSelected
                  ? "bg-linear-to-br from-violet-500 to-indigo-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {initials(name)}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold truncate ${isSelected ? "text-violet-800" : "text-slate-800"}`}
              >
                {name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {member.functions?.map((f) => f.name).join(", ") || email}
              </p>
            </div>

            {/* Role badge */}
            {isAdmin && (
              <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 border border-violet-200">
                Admin
              </span>
            )}

            {isSelected && (
              <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white">
                <IconCheck />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

interface SuccessScreenProps {
  name: string;
  onNavigate: () => void;
}

function SuccessScreen({ name, onNavigate }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
          <IconCheck />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Escala criada!</h2>
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-700">"{name}"</span> foi
          criada com sucesso.
        </p>
        <button
          onClick={onNavigate}
          className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Ver ministério
        </button>
      </div>
    </div>
  );
}

// ─── Invalid ministry screen ──────────────────────────────────────────────────

function InvalidMinistry() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-3">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-base font-bold text-slate-800">
          Ministério inválido
        </h2>
        <p className="text-sm text-slate-400">
          Verifique o link e tente novamente.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateScale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ministryId = id ? Number(id) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [ministerId, setMinisterId] = useState<number | "">("");
  const [submitted, setSubmitted] = useState(false);

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members", ministryId],
    queryFn: () => membersApi.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  });

  const hasMembers = (members?.length ?? 0) > 0;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!ministryId) throw new Error("MinistryId inválido");

      const payload: ScaleRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        date: formatDateForApi(date),
        ministerId: Number(ministerId),
      };

      return scaleApi.create(ministryId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scales", ministryId] });
      setSubmitted(true);
    },
    onError: () => {
      toast.error("Não foi possível criar a escala. Tente novamente.");
    },
  });

  const canSubmit =
    name.trim().length > 0 &&
    date.length > 0 &&
    ministerId !== "" &&
    hasMembers &&
    !isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    mutate();
  }

  if (ministryId === null) return <InvalidMinistry />;

  if (submitted) {
    return (
      <SuccessScreen
        name={name}
        onNavigate={() => navigate(`/ministries/${ministryId}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/ministries/${ministryId}`)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <IconArrowLeft />
            <span className="hidden sm:inline">Voltar ao ministério</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px]">
              1
            </span>
            Nova escala
          </div>

          {/* spacer */}
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-800">Nova escala</h1>
          <p className="text-sm text-slate-400 mt-1">
            Defina as informações e o ministro responsável pela escala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Card: Informações ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-base">📋</span>
              <h2 className="text-sm font-bold text-slate-700">
                Informações da escala
              </h2>
            </div>

            <Field label="Nome" required>
              <input
                type="text"
                placeholder="Ex: Culto Domingo Manhã, Célula Quinta…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
              />
              <div className="flex justify-between mt-1">
                {name.trim().length > 0 && name.trim().length < 2 ? (
                  <span className="text-xs text-red-400">
                    Mínimo 2 caracteres
                  </span>
                ) : (
                  <span />
                )}
                <CharCount value={name} max={80} />
              </div>
            </Field>

            <Field
              label="Descrição"
              hint="Detalhes adicionais sobre a escala. (opcional)"
            >
              <textarea
                rows={3}
                placeholder="Ex: Culto de adoração com ênfase em louvor contemporâneo…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition resize-none"
              />
              <div className="flex justify-end mt-1">
                <CharCount value={description} max={300} />
              </div>
            </Field>
          </div>

          {/* ── Card: Data ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-base">
                <IconCalendar />
              </span>
              <h2 className="text-sm font-bold text-slate-700">
                Data e horário
              </h2>
            </div>

            <Field label="Quando acontece" required>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
              />
            </Field>

            {date && (
              <p className="text-xs text-violet-600 font-medium">
                📅{" "}
                {new Date(date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* ── Card: Ministro ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-base">
                <IconUser />
              </span>
              <h2 className="text-sm font-bold text-slate-700">
                Ministro responsável
              </h2>
              <span className="text-violet-500 text-sm leading-none">*</span>
            </div>

            {membersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : !hasMembers ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="text-3xl opacity-30">👥</span>
                <p className="text-sm text-slate-500 font-medium">
                  Nenhum membro cadastrado
                </p>
                <p className="text-xs text-slate-400">
                  Adicione membros ao ministério antes de criar uma escala.
                </p>
              </div>
            ) : (
              <MinisterSelector
                members={members!}
                selected={ministerId}
                onSelect={setMinisterId}
              />
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <button
              type="button"
              onClick={() => navigate(`/ministries/${ministryId}`)}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <IconSpinner /> Salvando…
                </>
              ) : (
                <>
                  <IconCheck /> Salvar escala
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

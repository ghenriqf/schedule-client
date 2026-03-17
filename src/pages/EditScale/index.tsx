import { useEditScale } from './hooks/useEditScale'
import { MinisterSelector } from './components/MinisterSelector'

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        {required && <span className="text-violet-500 text-sm leading-none">*</span>}
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const pct = value.length / max
  const color = pct > 0.9 ? 'text-red-400' : pct > 0.7 ? 'text-amber-400' : 'text-slate-300'
  return <span className={`text-xs tabular-nums ${color}`}>{value.length}/{max}</span>
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="h-14 bg-white border-b border-slate-100" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="h-8 w-40 bg-slate-200 rounded-lg" />
        <div className="h-48 bg-white rounded-2xl border border-slate-100" />
        <div className="h-32 bg-white rounded-2xl border border-slate-100" />
        <div className="h-48 bg-white rounded-2xl border border-slate-100" />
      </div>
    </div>
  )
}

export function EditScale() {
  const edit = useEditScale()

  if (edit.isLoading) return <PageSkeleton />

  if (edit.submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
            <IconCheck />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Escala atualizada!</h2>
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-700">"{edit.form.name}"</span> foi atualizada com sucesso.
          </p>
          <button onClick={edit.navigateBack} className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
            Ver escala
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button type="button" onClick={edit.navigateBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <IconArrowLeft />
            <span className="hidden sm:inline">Voltar à escala</span>
          </button>
          <p className="text-sm font-semibold text-slate-700">Editar escala</p>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-800">Editar escala</h1>
          <p className="text-sm text-slate-400 mt-1">Atualize as informações da escala.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (edit.canSubmit) edit.mutate() }} className="space-y-4">

          {/* Informações */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span>📋</span>
              <h2 className="text-sm font-bold text-slate-700">Informações da escala</h2>
            </div>
            <Field label="Nome" required>
              <input type="text" placeholder="Ex: Culto Domingo Manhã…"
                value={edit.form.name}
                onChange={(e) => edit.setField('name', e.target.value)}
                maxLength={80}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition" />
              <div className="flex justify-between mt-1">
                {edit.form.name.trim().length > 0 && edit.form.name.trim().length < 2
                  ? <span className="text-xs text-red-400">Mínimo 2 caracteres</span>
                  : <span />}
                <CharCount value={edit.form.name} max={80} />
              </div>
            </Field>
            <Field label="Descrição" hint="Detalhes adicionais sobre a escala. (opcional)">
              <textarea rows={3} placeholder="Ex: Culto de adoração com ênfase em louvor contemporâneo…"
                value={edit.form.description}
                onChange={(e) => edit.setField('description', e.target.value)}
                maxLength={300}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition resize-none" />
              <div className="flex justify-end mt-1">
                <CharCount value={edit.form.description} max={300} />
              </div>
            </Field>
          </div>

          {/* Data */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span>📅</span>
              <h2 className="text-sm font-bold text-slate-700">Data e horário</h2>
            </div>
            <Field label="Quando acontece" required>
              <input type="datetime-local"
                value={edit.form.date}
                onChange={(e) => edit.setField('date', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition" />
            </Field>
            {edit.form.date && (
              <p className="text-xs text-violet-600 font-medium">
                📅 {new Date(edit.form.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Ministro */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span>👤</span>
              <h2 className="text-sm font-bold text-slate-700">Ministro responsável</h2>
              <span className="text-violet-500 text-sm leading-none">*</span>
            </div>
            {edit.membersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : !edit.hasMembers ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="text-3xl opacity-30">👥</span>
                <p className="text-sm text-slate-500 font-medium">Nenhum membro cadastrado</p>
              </div>
            ) : (
              <MinisterSelector
                members={edit.members!}
                selected={edit.form.ministerId}
                onSelect={(id) => edit.setField('ministerId', id)}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <button type="button" onClick={edit.navigateBack} disabled={edit.isPending}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={!edit.canSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {edit.isPending ? <><IconSpinner /> Salvando…</> : <><IconCheck /> Salvar alterações</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
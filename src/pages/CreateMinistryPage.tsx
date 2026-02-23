import { Link } from "react-router-dom";

export function CreateMinistryPage() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Criar novo ministério
            </h1>
            <p className="mt-1 text-slate-500">
              Defina apenas as informações básicas do seu ministério.
            </p>
          </div>

          <Link
            to="/ministries"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            Voltar para lista
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form
            className="space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Informações do ministério
              </h2>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Nome do ministério
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Louvor, Diaconia, Departamento Infantil..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Descrição
                </label>
                <p className="text-xs text-slate-400 mb-1">
                  Explique brevemente o propósito e as principais atividades do
                  ministério.
                </p>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Ex: Ministério responsável por conduzir a igreja em louvor e adoração durante os cultos..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </section>

            <section className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/ministries"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                disabled
              >
                Salvar ministério
              </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

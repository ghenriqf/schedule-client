import { Link } from 'react-router-dom'
import { useLogin } from './hooks/useLogin'

export default function Login() {
  const ctx = useLogin()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={ctx.onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={ctx.email}
              onChange={(e) => ctx.setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={ctx.password}
              onChange={(e) => ctx.setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={ctx.isPending}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors ${
              ctx.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {ctx.isPending ? 'Entrando...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm flex justify-center gap-1">
          <span className="text-gray-600">Não tem uma conta?</span>
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}
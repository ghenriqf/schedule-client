import { Link } from 'react-router-dom'
import { useSignup } from './hooks/useSignup'

export default function Signup() {
  const signup = useSignup()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Criar Conta</h2>

        <form className="space-y-4" onSubmit={signup.onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
            <input type="text" value={signup.username} onChange={(e) => signup.setUsername(e.target.value)}
              placeholder="seu nome de usuário" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" value={signup.name} onChange={(e) => signup.setName(e.target.value)}
              placeholder="seu nome completo" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={signup.email} onChange={(e) => signup.setEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <input type="date" value={signup.birth} onChange={(e) => signup.setBirth(e.target.value)} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={signup.password} onChange={(e) => signup.setPassword(e.target.value)}
              placeholder="••••••••" minLength={8} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            <p className="text-xs text-gray-500 mt-1">A senha deve ter pelo menos 8 caracteres</p>
          </div>

          <button type="submit" disabled={signup.isPending}
            className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors ${signup.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {signup.isPending ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm flex justify-center gap-1">
          <span className="text-gray-600">Já tem uma conta?</span>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
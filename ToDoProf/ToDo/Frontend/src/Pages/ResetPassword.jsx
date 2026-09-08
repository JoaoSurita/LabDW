import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { reset } from "../api/Todo.jsx";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await reset({ token, novaSenha });

      alert("Senha redefinida com sucesso! Faça login com a nova senha.");
      navigate("/login");
    } catch (error) {
      alert("Erro ao redefinir senha: " + (error.response?.data?.message || error.message || error));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Link inválido</h2>
        <p className="text-gray-600 mb-6">
          Este link de redefinição de senha é inválido ou está incompleto.
        </p>
        <Link
          to="/forgot"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Solicitar um novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Redefinir Senha</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            type="password"
            required
            minLength={6}
            disabled={loading}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
          <input
            type="password"
            required
            minLength={6}
            disabled={loading}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </span>
          ) : (
            "Redefinir Senha"
          )}
        </button>
      </form>

      <div className="mt-5 text-center pt-2">
        <Link
          to="/login"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

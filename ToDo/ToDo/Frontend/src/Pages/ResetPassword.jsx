import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { reset } from "../API/Todo.jsx";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    setSaving(true);
    try {
      await reset({ token, novaSenha });
      alert("Senha redefinida com sucesso! Faça login com a nova senha.");
      navigate("/login");
    } catch (error) {
      alert("Erro ao redefinir senha: " + (error.response?.data?.message || error.message || error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Redefinir Senha</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token de recuperação</label>
          <input
            required
            disabled={saving}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Cole aqui o token recebido"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            type="password"
            required
            disabled={saving}
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
            disabled={saving}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {saving ? "Salvando..." : "Redefinir Senha"}
        </button>
      </form>

      <div className="mt-5 text-center pt-2">
        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgot } from "../API/Todo.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    try {
      const resposta = await forgot({ email });
      setMensagem(resposta.data.message);
    } catch (error) {
      alert("Erro ao solicitar recuperação: " + (error.response?.data?.message || error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Esqueci minha Senha</h2>

      {!mensagem ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            {mensagem}
          </p>
        </div>
      )}

      <div className="mt-5 text-center pt-2">
        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

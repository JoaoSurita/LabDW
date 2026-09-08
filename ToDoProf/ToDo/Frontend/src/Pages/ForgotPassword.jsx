import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgot } from "../api/Todo.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgot({ email });
      // O backend sempre responde com a mesma mensagem genérica,
      // exista ou não o e-mail, para não revelar quais e-mails estão cadastrados.
      setEnviado(true);
    } catch (error) {
      alert("Erro ao solicitar redefinição: " + (error.response?.data?.message || error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Esqueci a Senha</h2>

      {enviado ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Se o e-mail informado estiver cadastrado, enviamos um link de redefinição de senha para ele.
          </p>
          <Link
            to="/login"
            className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 text-center mb-6">
            Informe o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
          </p>

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
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar link de redefinição"
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
        </>
      )}
    </div>
  );
}

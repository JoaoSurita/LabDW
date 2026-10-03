import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../API/Todo.jsx";
import { getUsers } from "../API/Todo.jsx"; // ou seu arquivo de API
import {useVoiceRecognition} from "../Hooks/useVoiceRecognition.js";
export default function TodoForm() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [participam, setParticipam] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const{
      textoOuvido,
      setTextoOuvido,
      ouvindo,
      iniciarEscuta,
      processarComandoVoz,
      suportado,
  } = useVoiceRecognition();
  //processar a fala passando lista de usuários 
  // e a função para marcar checkbox
  useEffect(()=>{
    processarComandoVoz(
    textoOuvido,
    setTitulo,
    setDescricao,
    setDataLimite,
    usuarios,
    handleCheckboxChange);
    setTextoOuvido("");
  }, [textoOuvido, setTextoOuvido, usuarios]);
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoadingUsuarios(true);
        const res = await getUsers();
        const lista = res.data.usuarios || []
        console.log(lista);
        // Garante que só seta se for realmente um Array
        setUsuarios(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setUsuarios([]); 
      } finally {
        setLoadingUsuarios(false);
      }
    }
    fetchUsuarios();
  }, []);

  const handleCheckboxChange = (userId) => {
    setParticipam((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTodo({ titulo, descricao, dataLimite, participam });
      navigate("/todos");
    } catch (error) {
      alert("Erro ao criar tarefa: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Nova Tarefa</h2>

        {/* BOTÃO LIGA/DESLIGA O MICROFONE */}
        {suportado && (
          <button
            type="button"
            onClick={iniciarEscuta}
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              ouvindo
                ? "bg-red-500 animate-pulse ring-4 ring-red-200"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {ouvindo ? "Clique para Parar" : "Preencher por Voz"}
          </button>
        )}
      </div>

      {/* PAINEL DE DICAS DE COMANDOS */}
      {suportado && (
        <div className="mb-6 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 space-y-1">
          <p className="font-semibold">Dicas de Comandos por Voz:</p>
          <ul className="list-disc list-inside space-y-0.5 text-indigo-700">
            <li><strong>"Título [seu texto]"</strong> — Preenche o título</li>
            <li><strong>"Descrição [seu texto]"</strong> — Preenche a descrição</li>
            <li><strong>"Data [amanhã / hoje / daqui a 3 dias]"</strong> — Define o prazo</li>
            <li><strong>"Participante [nome]"</strong> ou <strong>"Adicionar [nome]"</strong> — Seleciona o participante</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite ou fale 'Título...'"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite ou fale 'Descrição...'"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* DATA LIMITE */}
        <div>
          <label className="block text-sm font-medium mb-1">Data Limite</label>
          <input
            required
            value={dataLimite}
            onChange={(e) => setDataLimite(e.target.value)}
            type="date"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* PARTICIPANTES */}
        <div>
          <label className="block text-sm font-medium mb-2">Participantes</label>

          {loadingUsuarios ? (
            <p className="text-sm text-gray-500">Carregando usuários...</p>
          ) : (
            <div className="max-h-40 overflow-y-auto border rounded p-3 space-y-2 bg-gray-50">
              {Array.isArray(usuarios) && usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <label
                    key={user._id || user.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      value={user._id || user.id}
                      checked={participam.includes(user._id || user.id)}
                      onChange={() => handleCheckboxChange(user._id || user.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{user.nome}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-1">
                  Nenhum outro usuário disponível para adicionar.
                </p>
              )}
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex items-center gap-3 pt-4">
          <button
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
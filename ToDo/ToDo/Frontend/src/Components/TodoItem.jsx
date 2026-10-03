import React, { useState } from "react";
import TodoChatModal from "./TodoChatModal.jsx";
import { updateSituacao } from "../API/Todo.jsx";

export default function TodoItem({ todo, usuarioLogado, onSituacaoChange }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isPendente = !todo.situacao || todo.situacao === "PENDENTE";

  const handleSituacao = async (novaSituacao) => {
    if (
      novaSituacao === "CANCELADA" &&
      !window.confirm("Deseja realmente cancelar esta tarefa?")
    ) {
      return;
    }
    try {
      setUpdating(true);
      const res = await updateSituacao(todo._id, novaSituacao);
      onSituacaoChange?.(res.data.tarefa);
    } catch (error) {
      alert(
        "Erro ao atualizar situação: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  // Extrai as iniciais do nome (ex: "Carlos Silva" -> "CS")
  const getInitials = (nome) => {
    if (!nome) return "?";
    const parts = nome.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const criador = todo.criadoPor;
  const participantes = todo.participam || [];

  // Limite de participantes visíveis na pilha
  const maxVisible = 3;
  const visibleParticipantes = participantes.slice(0, maxVisible);
  const extraCount = participantes.length - maxVisible;

  // Lista com todos os nomes para tooltip
  const todosNomesParticipantes = participantes.map((p) => p.nome).join(", ");

  return (
    <>
      <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
        {/* Linha Superior: Título + Badge de Situação */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg leading-tight">
              {todo.titulo}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{todo.descricao}</p>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
              todo.situacao === "FINALIZADA"
                ? "bg-green-100 text-green-700"
                : todo.situacao === "CANCELADA"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {todo.situacao === "FINALIZADA"
              ? "Finalizada"
              : todo.situacao === "CANCELADA"
              ? "Cancelada"
              : "Pendente"}
          </span>
        </div>

        {/* Rodapé do Card: Infos + Equipe + Botão de Chat */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium text-gray-700">Prazo:</span>{" "}
              {todo.dataLimite
                ? new Date(todo.dataLimite).toLocaleDateString("pt-BR")
                : "Sem data"}
            </div>
            {criador && (
              <div>
                <span className="font-medium text-gray-700">Criado por:</span>{" "}
                <span className="text-gray-900 font-medium">
                  {criador.nome}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Participantes da tarefa */}
            {participantes.length > 0 && (
              <div
                className="flex items-center gap-2"
                title={`Participantes: ${todosNomesParticipantes}`}
              >
                <span className="font-medium text-gray-700 hidden sm:inline">
                  Equipe:
                </span>

                <div className="flex -space-x-2 overflow-hidden">
                  {visibleParticipantes.map((participante, index) => (
                    <div
                      key={participante._id || index}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white font-semibold border-2 border-white shadow-xs text-[10px]"
                      title={participante.nome}
                    >
                      {getInitials(participante.nome)}
                    </div>
                  ))}

                  {extraCount > 0 && (
                    <div
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold border-2 border-white shadow-xs text-[10px]"
                      title={`Mais ${extraCount} participantes: ${participantes
                        .slice(maxVisible)
                        .map((p) => p.nome)
                        .join(", ")}`}
                    >
                      +{extraCount}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ações de situação: só aparecem enquanto a tarefa está Pendente */}
            {isPendente && (
              <>
                <button
                  onClick={() => handleSituacao("FINALIZADA")}
                  disabled={updating}
                  className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Marcar tarefa como finalizada"
                >
                  Finalizar
                </button>
                <button
                  onClick={() => handleSituacao("CANCELADA")}
                  disabled={updating}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Cancelar tarefa"
                >
                  Cancelar
                </button>
              </>
            )}

            {/*Botão para abrir o modal de Chat */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer ml-auto"
              title="Abrir chat da tarefa"
            >
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal do Chat acionado pelo estado */}
      {isChatOpen && (
        <TodoChatModal
          tarefa={todo}
          usuarioLogado={usuarioLogado}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
    
  );
}
import React, { useMemo } from "react";
import Chart from "react-apexcharts";

// Ordem, rótulos e cores de cada situação (as cores seguem as dos badges do TodoItem)
const SITUACOES = [
  { key: "PENDENTE", label: "Pendente", color: "#EAB308" },
  { key: "FINALIZADA", label: "Finalizada", color: "#22C55E" },
  { key: "CANCELADA", label: "Cancelada", color: "#EF4444" },
];

export default function TodoSituacaoChart({ todos }) {
  // Conta quantas tarefas existem em cada situação
  const series = useMemo(
    () =>
      SITUACOES.map(
        (s) => todos.filter((todo) => todo.situacao === s.key).length
      ),
    [todos]
  );

  const total = series.reduce((acc, n) => acc + n, 0);

  const options = {
    chart: { type: "donut" },
    labels: SITUACOES.map((s) => s.label),
    colors: SITUACOES.map((s) => s.color),
    legend: { position: "bottom" },
    dataLabels: { enabled: true, formatter: (_val, opts) => opts.w.config.series[opts.seriesIndex] },
    tooltip: { y: { formatter: (val) => `${val} tarefa(s)` } },
    plotOptions: {
      pie: {
        donut: {
          size: "62%",
          labels: {
            show: true,
            total: { show: true, showAlways: true, label: "Total" },
          },
        },
      },
    },
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Tarefas por situação
      </h3>
      {total === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">
          Sem dados para exibir o gráfico.
        </p>
      ) : (
        <Chart options={options} series={series} type="donut" height={300} />
      )}
    </div>
  );
}

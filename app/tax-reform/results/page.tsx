"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaxEntry, TaxExit, TaxReformResult } from "../types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatMoney(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value))
    return currencyFormatter.format(0);
  return currencyFormatter.format(value);
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0%";
  return `${percentFormatter.format(value)}%`;
}

function ResultTable({
  title,
  columns,
  rows,
  footerLabel,
  footerValue,
}: {
  title: string;
  columns: string[];
  rows: (string | number)[][];
  footerLabel?: string;
  footerValue?: number | string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d9e6ef] bg-white shadow-[0_10px_35px_rgba(1,76,116,0.08)]">
      <div className="bg-gradient-to-r from-[#e4f1f7] to-[#f7f1e4] px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#014c74]">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e5edf3]">
          <thead className="bg-[#f6f9fb] text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#014c74]">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2f6] text-sm text-slate-800">
            {rows.map((cells, idx) => (
              <tr
                key={`${title}-${idx}`}
                className="transition-colors hover:bg-[#f2f7fa]"
              >
                {cells.map((cell, cellIdx) => (
                  <td key={`${title}-${idx}-${cellIdx}`} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footerValue !== undefined ? (
        <div className="flex items-center justify-end gap-3 bg-[#f2f7fa] px-4 py-3 text-sm font-semibold text-[#014c74]">
          <span>{footerLabel ?? "Total"}</span>
          <span className="rounded-lg bg-white px-3 py-1 shadow-inner shadow-[#d1e2ed]">
            {typeof footerValue === "number"
              ? formatMoney(footerValue)
              : footerValue}
          </span>
        </div>
      ) : null}
    </div>
  );
}

type ClassificationVariant = {
  label: string;
  className: string;
  note: string;
};

const classificationStyles: Record<string, ClassificationVariant> = {
  "redução de carga": {
    label: "Redução de carga",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    note: "Economia gerada com a nova sistemática.",
  },
  "reducao de carga": {
    label: "Redução de carga",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    note: "Economia gerada com a nova sistemática.",
  },
  "aumento de carga": {
    label: "Aumento de carga",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    note: "Revise créditos e bases de cálculo.",
  },
  neutro: {
    label: "Neutro",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    note: "Mantida a carga tributária atual.",
  },
};

function buildEntryRows(entries: TaxEntry[]) {
  return entries.map((item) => [
    item.label,
    formatPercent(item.aliquot),
    formatMoney(item.base),
    formatMoney(item.credit),
  ]);
}

function buildExitRows(exits: TaxExit[]) {
  return exits.map((item) => [
    item.label,
    formatPercent(item.aliquot),
    formatMoney(item.base),
    formatMoney(item.debit),
    formatMoney(item.credit),
    formatMoney(item.due),
  ]);
}

export default function ResultsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const result = queryClient.getQueryData<TaxReformResult>([
    "tax-reform",
    "result",
  ]);

  const classification =
    classificationStyles[result?.comparison.classification ?? "neutro"];

  const stats = result
    ? [
        {
          label: "Total a recolher (antes)",
          value: formatMoney(result.before.total_due),
          helper: "Cenário atual",
        },
        {
          label: "Total a recolher (depois)",
          value: formatMoney(result.after.totals.due),
          helper: "Após LC 214/2025",
        },
        {
          label: "Diferença",
          value: formatMoney(result.comparison.difference),
          helper: classification.label,
        },
        {
          label: "Variação percentual",
          value: formatPercent(result.comparison.difference_percent_points),
          helper: "Comparação direta",
        },
      ]
    : [];

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4fb] px-6">
        <div className="max-w-xl rounded-2xl border border-[#eadff7] bg-white p-8 text-center shadow-[0_10px_35px_rgba(55,23,111,0.08)]">
          <p className="text-lg font-semibold text-[#3b1d64]">
            Ops! Nenhum resultado encontrado.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Envie os dados da empresa para gerar a simulação e visualizar o
            comparativo.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="bg-[#3b1d64] text-white hover:bg-[#321753]"
              onClick={() => router.push("/tax-reform")}
            >
              <ArrowLeft className="size-4" />
              Voltar para o formulário
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const beforeEntries = buildEntryRows(result.before.entries);
  const beforeExits = buildExitRows(result.before.exits);
  const afterEntries = buildEntryRows(result.after.entries);
  const afterExits = buildExitRows(result.after.exits);

  return (
    <div className="min-h-screen bg-[#f6f9fb] text-slate-900">
      <header className="bg-gradient-to-r from-[#014c74] via-[#0f5f90] to-[#bf8900] text-white shadow-md">
        <div className="mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/70">
              Simulador da Reforma Tributária
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Resultado comparativo
            </h1>
            <p className="text-sm text-white/80">
              Resumo do cenário com base nos dados informados.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white shadow-sm backdrop-blur hover:bg-white/20"
              onClick={() => router.push("/tax-reform")}
            >
              <RotateCcw className="size-4" />
              Novo cálculo
            </Button>
            <Button
              className="bg-white text-[#014c74] hover:bg-white/90"
              onClick={() => window.print()}
            >
              <Printer className="size-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full space-y-8 px-4 py-8">
        <section className="rounded-2xl border border-[#d9e6ef] bg-white p-6 shadow-[0_10px_35px_rgba(1,76,116,0.08)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#014c74]">
                Resumo geral
              </p>
              <p className="text-sm text-slate-600">
                Comparativo direto entre o cenário atual e o proposto.
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${classification.className}`}
            >
              {classification.label}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#dfeaf0] bg-gradient-to-br from-white to-[#f3f7fa] px-4 py-3 shadow-inner shadow-[#dbe9f3]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#014c74]">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-[#0d3650]">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#014c74]">
                Antes da reforma
              </p>
              <p className="text-sm text-slate-600">
                Entradas (aquisições) e saídas (receitas) no regime atual.
              </p>
            </div>
            <span className="rounded-full bg-[#eaf4fa] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#014c74]">
              Tributação atual
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ResultTable
              title="Entradas (aquisições)"
              columns={["Imposto", "Alíquota", "Base de cálculo", "Créditos"]}
              rows={beforeEntries}
            />
            <ResultTable
              title="Saídas (receitas)"
              columns={[
                "Imposto",
                "Alíquota",
                "Base de cálculo",
                "Débito",
                "Crédito",
                "Trib. a recolher",
              ]}
              rows={beforeExits}
              footerLabel="Total a recolher"
              footerValue={result.before.total_due}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#014c74]">
                Depois da reforma — LC 214/2025
              </p>
              <p className="text-sm text-slate-600">
                Projeção com CBS, IBS e IS de acordo com o segmento informado.
              </p>
            </div>
            <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#bf8900]">
              Projeção futura
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ResultTable
              title="Entradas (aquisições)"
              columns={["Imposto", "Alíquota", "Base de cálculo", "Créditos"]}
              rows={afterEntries}
            />
            <ResultTable
              title="Saídas (receitas)"
              columns={[
                "Imposto",
                "Alíquota",
                "Base de cálculo",
                "Débito",
                "Crédito",
                "Trib. a recolher",
              ]}
              rows={afterExits}
              footerLabel="Total a recolher"
              footerValue={result.after.totals.due}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[#d9e6ef] bg-white px-5 py-4 shadow-[0_10px_35px_rgba(1,76,116,0.08)]">
          <p className="text-sm font-semibold text-[#014c74]">Notas</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              Projeção de alíquotas: CBS{" "}
              {formatPercent(result.after.projected_rates.cbs_aliquot)}, IBS{" "}
              {formatPercent(result.after.projected_rates.ibs_aliquot)}, IS{" "}
              {formatPercent(result.after.projected_rates.is_aliquot)}.
            </li>
            <li>
              Redução aplicada:{" "}
              {formatPercent(result.after.totals.reduction_percent)} (quando
              aplicável ao segmento informado).
            </li>
            <li>{classification.note}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

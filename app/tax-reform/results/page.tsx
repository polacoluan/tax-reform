"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TaxReformResult } from "../types";

const brandPrimary = "#014c74";
const brandAccent = "#bf8900";

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "--";

const formatPercent = (value?: number) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "--";

const classificationColor: Record<
  TaxReformResult["comparacao"]["classificacao"],
  string
> = {
  "aumento de carga": "bg-red-100 text-red-700",
  "redução de carga": "bg-emerald-100 text-emerald-700",
  "reducao de carga": "bg-emerald-100 text-emerald-700",
  neutro: "bg-amber-100 text-amber-700",
};

const segmentLabels: Record<number, string> = {
  1: "Indústria",
  2: "Comércio",
  3: "Serviços",
  4: "Agropecuária",
  5: "Outros",
};

const costsLabels: Record<number, string> = {
  1: "0–30% (margem alta)",
  2: "30–60% (margem média)",
  3: "60–90% (margem baixa)",
};

const activityLabels: Record<number, string> = {
  1: "Simples Nacional",
  2: "Lucro Presumido",
  3: "Lucro Real",
};

const getLabel = (map: Record<number, string>, key: number | undefined) =>
  typeof key === "number" && map[key] ? map[key] : `#${key ?? "-"}`;

export default function TaxReformResults() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const result = queryClient.getQueryData<TaxReformResult>([
    "tax-reform",
    "result",
  ]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-neutral-900">
        <Card className="w-[900px] p-6">
          <CardHeader>
            <CardTitle>Nenhum resultado encontrado</CardTitle>
            <CardDescription>
              Envie o formulário para ver o resultado da simulação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => router.push("/tax-reform")}>
              Voltar para o formulário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10 dark:bg-neutral-900">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Resultado da simulação
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Comparativo antes x depois da reforma tributária.
            </p>
          </div>
          <Button
            onClick={() => router.push("/tax-reform")}
            className="bg-[#014c74] text-white hover:bg-[#013d5d]"
          >
            Nova simulação
          </Button>
        </div>

        <Card className="border-none shadow-xl shadow-[rgba(1,76,116,0.12)]">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-t-xl">
            <div>
              <CardTitle>Resumo executivo</CardTitle>
              <CardDescription>
                Principais impactos em valores e alíquotas efetivas.
              </CardDescription>
            </div>
            <Badge
              className={classificationColor[result.comparacao.classificacao]}
            >
              {result.comparacao.classificacao.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-[rgba(1,76,116,0.08)] dark:border-neutral-800 dark:bg-neutral-800">
              <p className="text-sm text-slate-500">Imposto atual</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(result.antes.imposto)}
              </p>
              <p className="text-xs text-slate-500">
                Alíquota efetiva: {formatPercent(result.antes.aliquota_efetiva)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-[rgba(191,137,0,0.15)] dark:border-neutral-800 dark:bg-neutral-800">
              <p className="text-sm text-slate-500">Imposto pós-reforma</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(result.depois.imposto_liquido)}
              </p>
              <p className="text-xs text-slate-500">
                Alíquota efetiva:{" "}
                {formatPercent(result.depois.aliquota_efetiva)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-[rgba(1,76,116,0.08)] dark:border-neutral-800 dark:bg-neutral-800">
              <p className="text-sm text-slate-500">Diferença</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(result.comparacao.dif_reais)}
              </p>
              <p className="text-xs text-slate-500">
                {formatPercent(result.comparacao.dif_pp)} p.p. —{" "}
                {result.comparacao.classificacao}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Dados enviados</CardTitle>
              <CardDescription>
                Segmento, faturamento e custos usados no cálculo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex justify-between">
                <span>Segmento</span>
                <span className="font-medium" style={{ color: brandPrimary }}>
                  {getLabel(segmentLabels, result.inputs.segment)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Faturamento</span>
                <span className="font-medium">
                  {formatCurrency(result.inputs.invoicing)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Custos (faixa)</span>
                <span className="font-medium" style={{ color: brandAccent }}>
                  {getLabel(costsLabels, result.inputs.costs)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Regime/atividade</span>
                <span className="font-medium" style={{ color: brandPrimary }}>
                  {getLabel(activityLabels, result.inputs.activity)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Parâmetros aplicados</CardTitle>
              <CardDescription>
                Alíquotas e fatores usados pelo backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Alíquota efetiva atual
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_atual)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Carga média antes da reforma
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alíquota IBS</p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_IBS)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Parcela estadual/municipal
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alíquota CBS</p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_CBS)}
                  </p>
                  <p className="text-[11px] text-slate-500">Parcela federal</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Alíquota total bruta (IBS + CBS)
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_total_bruta)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Antes de reduções setoriais
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Alíquota total efetiva
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_total_efetiva_bruta)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Após redução setorial
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Redução setorial aplicada
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.red_setorial * 100)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Percentual de desconto
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Fator de crédito sobre custos
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.k_creditavel * 100)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Parcela dos custos que gera crédito
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alíquota de crédito</p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.t_credito)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Usada nos créditos de insumos
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Custos sobre faturamento
                  </p>
                  <p className="font-medium">
                    {formatPercent(result.parameters.custos_percent)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Faixa escolhida na simulação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Comparação e status</CardTitle>
              <CardDescription>
                Classificação do impacto e variações.”
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-neutral-800">
                <span>Classificação</span>
                <Badge
                  className={
                    classificationColor[result.comparacao.classificacao]
                  }
                >
                  {result.comparacao.classificacao}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-neutral-800">
                <span>Diferença (R$)</span>
                <span className="font-medium">
                  {formatCurrency(result.comparacao.dif_reais)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-neutral-800">
                <span>Diferença (p.p.)</span>
                <span className="font-medium">
                  {formatPercent(result.comparacao.dif_pp)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento</CardTitle>
            <CardDescription>
              Valores brutos e créditos usados no cálculo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                Antes da reforma
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                <div className="flex justify-between">
                  <span>Base de cálculo</span>
                  <span className="font-medium">
                    {formatCurrency(result.antes.base)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Imposto</span>
                  <span className="font-medium">
                    {formatCurrency(result.antes.imposto)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alíquota efetiva</span>
                  <span className="font-medium">
                    {formatPercent(result.antes.aliquota_efetiva)}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                Depois da reforma
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                <div className="flex justify-between">
                  <span>Base de cálculo</span>
                  <span className="font-medium">
                    {formatCurrency(result.depois.base)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Imposto bruto</span>
                  <span className="font-medium">
                    {formatCurrency(result.depois.imposto_bruto)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Crédito de insumos</span>
                  <span className="font-medium">
                    {formatCurrency(result.depois.credito_insumos)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Imposto líquido</span>
                  <span className="font-medium">
                    {formatCurrency(result.depois.imposto_liquido)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alíquota efetiva</span>
                  <span className="font-medium">
                    {formatPercent(result.depois.aliquota_efetiva)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

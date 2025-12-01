"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaxReformApiResponse, TaxReformPayload } from "./types";
import TaxCard from "./components/tax-card";

const requiredNumber = z
  .number({ error: "Informe um número válido" })
  .min(0, "Obrigatório");

const formSchema = z.object({
  segment: z.string().min(1, "Selecione o segmento"),
  pis_pasep_aliquot_entry: requiredNumber,
  pis_pasep_base_entry: requiredNumber,
  pis_pasep_aliquot_exit: requiredNumber,
  pis_pasep_base_exit: requiredNumber,
  cofins_aliquot_entry: requiredNumber,
  cofins_base_entry: requiredNumber,
  cofins_aliquot_exit: requiredNumber,
  cofins_base_exit: requiredNumber,
  ipi_aliquot_entry: requiredNumber,
  ipi_base_entry: requiredNumber,
  ipi_aliquot_exit: requiredNumber,
  ipi_base_exit: requiredNumber,
  icms_aliquot_entry: requiredNumber,
  icms_base_entry: requiredNumber,
  icms_aliquot_exit: requiredNumber,
  icms_base_exit: requiredNumber,
  cbs_aliquot_entry: requiredNumber,
  cbs_base_entry: requiredNumber,
  cbs_aliquot_exit: requiredNumber,
  cbs_base_exit: requiredNumber,
  ibs_aliquot_entry: requiredNumber,
  ibs_base_entry: requiredNumber,
  ibs_aliquot_exit: requiredNumber,
  ibs_base_exit: requiredNumber,
});

type InitialFormValues = z.infer<typeof formSchema>;

type TaxDefinition = {
  title: string;
  entryAliquot?: keyof InitialFormValues;
  entryBase: keyof InitialFormValues;
  exitAliquot?: keyof InitialFormValues;
  exitBase: keyof InitialFormValues;
  entryFixedAliquot?: number;
  exitFixedAliquot?: number;
};

const beforeReformTaxes: TaxDefinition[] = [
  {
    title: "PIS/PASEP",
    entryAliquot: "pis_pasep_aliquot_entry",
    entryBase: "pis_pasep_base_entry",
    exitAliquot: "pis_pasep_aliquot_exit",
    exitBase: "pis_pasep_base_exit",
  },
  {
    title: "COFINS",
    entryAliquot: "cofins_aliquot_entry",
    entryBase: "cofins_base_entry",
    exitAliquot: "cofins_aliquot_exit",
    exitBase: "cofins_base_exit",
  },
  {
    title: "IPI",
    entryAliquot: "ipi_aliquot_entry",
    entryBase: "ipi_base_entry",
    exitAliquot: "ipi_aliquot_exit",
    exitBase: "ipi_base_exit",
  },
  {
    title: "ICMS",
    entryAliquot: "icms_aliquot_entry",
    entryBase: "icms_base_entry",
    exitAliquot: "icms_aliquot_exit",
    exitBase: "icms_base_exit",
  },
];

const afterReformTaxes: TaxDefinition[] = [
  {
    title: "CBS",
    entryAliquot: "cbs_aliquot_entry",
    entryBase: "cbs_base_entry",
    exitAliquot: "cbs_aliquot_exit",
    exitBase: "cbs_base_exit",
  },
  {
    title: "IBS",
    entryAliquot: "ibs_aliquot_entry",
    entryBase: "ibs_base_entry",
    exitAliquot: "ibs_aliquot_exit",
    exitBase: "ibs_base_exit",
  },
];

export default function InitialData() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<InitialFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      segment: "",
      pis_pasep_aliquot_entry: undefined,
      pis_pasep_base_entry: undefined,
      pis_pasep_aliquot_exit: undefined,
      pis_pasep_base_exit: undefined,
      cofins_aliquot_entry: undefined,
      cofins_base_entry: undefined,
      cofins_aliquot_exit: undefined,
      cofins_base_exit: undefined,
      ipi_aliquot_entry: undefined,
      ipi_base_entry: undefined,
      ipi_aliquot_exit: undefined,
      ipi_base_exit: undefined,
      icms_aliquot_entry: undefined,
      icms_base_entry: undefined,
      icms_aliquot_exit: undefined,
      icms_base_exit: undefined,
      cbs_aliquot_entry: 8.8,
      cbs_base_entry: undefined,
      cbs_aliquot_exit: 8.8,
      cbs_base_exit: undefined,
      ibs_aliquot_entry: 17.7,
      ibs_base_entry: undefined,
      ibs_aliquot_exit: 17.7,
      ibs_base_exit: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: TaxReformPayload) => {
      const { data } = await api.post<TaxReformApiResponse>("", payload);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tax-reform", "result"], data);
      router.push("/tax-reform/results");
    },
    onError: () => {
      setSubmitError("Não foi possível enviar os dados. Tente novamente.");
    },
  });

  function onSubmit(values: InitialFormValues) {
    setSubmitError(null);
    const payload: TaxReformPayload = { ...values };
    mutation.mutate(payload);
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb] text-slate-900">
      <header className="bg-gradient-to-r from-[#014c74] via-[#0f5f90] to-[#bf8900] text-white shadow-md">
        <div className="mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/70">
              Simulador da Reforma Tributária
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Configurar cenário
            </h1>
            <p className="text-sm text-white/80">
              Preencha os dados da empresa para calcular antes e depois da LC
              214/2025.
            </p>
          </div>
          <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
            Formulário inicial
          </span>
        </div>
      </header>
      <main className="mx-auto w-full px-4 py-8">
        <div className="flex justify-center">
          <Card className="w-full border-none shadow-[0_10px_35px_rgba(1,76,116,0.08)]">
            <CardHeader className="rounded-t-xl">
              <CardTitle className="text-2xl text-slate-900">
                Calculadora da reforma tributária
              </CardTitle>
              <CardDescription className="text-slate-600">
                Preencha os dados da sua empresa para simular o impacto da
                reforma.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, () =>
                  setSubmitError("Preencha todos os campos obrigatórios.")
                )}
              >
                <CardContent className="space-y-6 bg-white">
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full bg-amber-500"
                    />
                    Preencha todos os campos para avançar.
                  </div>
                  <section className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                        <span
                          aria-hidden
                          className="h-8 w-1 rounded-full bg-[#014c74]"
                        />
                        Dados iniciais
                      </h2>
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Empresa
                      </span>
                    </div>
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="segment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base text-slate-900">
                              Segmento de atuação
                            </FormLabel>
                            <FormControl>
                              <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione o segmento" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Selecione o segmento</SelectLabel>
                                    <SelectItem value="1">Indústria</SelectItem>
                                    <SelectItem value="2">Comércio</SelectItem>
                                    <SelectItem value="3">Serviços</SelectItem>
                                    <SelectItem value="4">Agropecuária</SelectItem>
                                    <SelectItem value="5">Outros</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-lg font-semibold text-[#014c74]">
                          Antes da reforma
                        </p>
                        <p className="text-sm text-slate-600">
                          Parametrização dos tributos atuais com entradas e
                          saídas.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {beforeReformTaxes.map((section) => (
                          <TaxCard<InitialFormValues>
                            key={section.title}
                            title={section.title}
                            form={form}
                            entryAliquot={section.entryAliquot}
                            entryBase={section.entryBase}
                            exitAliquot={section.exitAliquot}
                            exitBase={section.exitBase}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div>
                        <p className="text-lg font-semibold text-[#bf8900]">
                          Após a reforma
                        </p>
                        <p className="text-sm text-slate-600">
                          CBS e IBS com bases separadas para entradas e saídas.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {afterReformTaxes.map((section) => (
                          <TaxCard<InitialFormValues>
                            key={section.title}
                            title={section.title}
                            form={form}
                            entryAliquot={section.entryAliquot as keyof InitialFormValues}
                            entryBase={section.entryBase}
                            exitAliquot={section.exitAliquot as keyof InitialFormValues}
                            exitBase={section.exitBase}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 border-t border-slate-100 bg-linnear-to-r from-white via-[rgba(1,76,116,0.04)] to-[rgba(191,137,0,0.05)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  {submitError ? (
                    <p className="text-sm text-red-600 flex-1">{submitError}</p>
                  ) : (
                    <p className="text-sm text-slate-500 flex-1">
                      Revise os dados antes de avançar para a simulação.
                    </p>
                  )}
                  <Button
                    className="hover:cursor-pointer border border-[#bf8900] bg-white text-[#bf8900] hover:bg-[#bf8900] hover:text-white"
                    type="button"
                    onClick={() => history.back()}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="hover:cursor-pointer bg-[#014c74] text-white hover:bg-[#013d5d]"
                    type="submit"
                    disabled={mutation.isPending || !form.formState.isValid}
                  >
                    {mutation.isPending ? "Enviando..." : "Avançar"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
}

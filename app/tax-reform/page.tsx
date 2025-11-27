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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MoneyInput from "@/components/resources/money-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaxReformApiResponse, TaxReformPayload } from "./types";

const formSchema = z.object({
  segment: z.string().min(1, "Selecione o segmento"),
  invoicing: z.number().positive("Informe um faturamento válido"),
  costs: z.string().min(1, "Selecione a faixa de custos"),
  activity: z.string().min(1, "Selecione o regime da empresa"),
});

type InitialFormValues = TaxReformPayload;

export default function InitialData() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<InitialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segment: "",
      invoicing: 0,
      costs: "",
      activity: "",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError(null);
    mutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10 dark:bg-neutral-900">
      <Card className="w-full max-w-3xl border-none shadow-xl shadow-[rgba(1,76,116,0.12)]">
        <CardHeader className="rounded-t-xl ">
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
            Calculadora da reforma tributária
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Preencha os dados da sua empresa para simular o impacto da reforma.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8 bg-white dark:bg-neutral-900">
              <FormField
                control={form.control}
                name="segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100">
                      Dados iniciais
                    </FormLabel>
                    <FormDescription className="text-slate-600 dark:text-slate-300">
                      Sua empresa atua em qual setor?
                    </FormDescription>
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
              <MoneyInput<InitialFormValues>
                form={form}
                name="invoicing"
                label="Faturamento"
                placeholder="R$ 0,00"
              />
              <FormField
                control={form.control}
                name="costs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100">
                      Estrutura de custos
                    </FormLabel>
                    <FormDescription className="text-slate-600 dark:text-slate-300">
                      Qual a proporção média entre custos e faturamento da sua
                      empresa?
                    </FormDescription>
                    <FormControl>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a proporção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Selecione a proporção</SelectLabel>
                            <SelectItem value="1">
                              0–30% (margem alta)
                            </SelectItem>
                            <SelectItem value="2">
                              30–60% (margem média)
                            </SelectItem>
                            <SelectItem value="3">
                              60–90% (margem baixa)
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100">
                      Tipo de atividade e regime atual
                    </FormLabel>
                    <FormDescription className="text-slate-600 dark:text-slate-300">
                      Sua empresa presta serviços ou vende produtos?
                    </FormDescription>
                    <FormControl>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o regime da sua empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              Selecione o regime da sua empresa
                            </SelectLabel>
                            <SelectItem value="1">Simples Nacional</SelectItem>
                            <SelectItem value="2">Lucro Presumido</SelectItem>
                            <SelectItem value="3">Lucro Real</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t border-slate-100 bg-gradient-to-r from-white via-[rgba(1,76,116,0.04)] to-[rgba(191,137,0,0.05)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
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
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Enviando..." : "Avançar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

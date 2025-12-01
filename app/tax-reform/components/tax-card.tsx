"use client";

import MoneyInput from "@/components/resources/money-input";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

type TaxCardProps<FormValues extends FieldValues> = {
  title: string;
  form: UseFormReturn<FormValues>;
  entryAliquot?: keyof FormValues;
  entryBase: keyof FormValues;
  exitAliquot?: keyof FormValues;
  exitBase: keyof FormValues;
  entryFixedAliquot?: number;
  exitFixedAliquot?: number;
};

function TaxSubSection<FormValues extends FieldValues>({
  form,
  title,
  aliquotName,
  baseName,
  tone,
  fixedAliquot,
}: {
  form: UseFormReturn<FormValues>;
  title: string;
  aliquotName?: keyof FormValues;
  baseName: keyof FormValues;
  tone: "entry" | "exit";
  fixedAliquot?: number;
}) {
  const badgeStyles =
    tone === "entry"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : "bg-amber-50 text-amber-700 ring-1 ring-amber-200";

  return (
    <div className="rounded-lg border border-slate-100 bg-white/70 p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${badgeStyles}`}
        >
          {title}
        </span>
        <p className="text-xs text-slate-500">
          {tone === "entry" ? "Compras / insumos" : "Vendas / saídas"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {typeof fixedAliquot === "number" ? (
          <div className="flex flex-col gap-1">
            <FormLabel className="text-slate-900">Alíquota (%)</FormLabel>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {fixedAliquot.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
              })}{" "}
              %
            </div>
          </div>
        ) : aliquotName ? (
          <FormField
            control={form.control}
            name={aliquotName as FieldPath<FormValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-900">
                  Alíquota (%)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value
                    }
                    onChange={(ev) =>
                      field.onChange(
                        ev.target.value === ""
                          ? undefined
                          : Number(ev.target.value)
                      )
                    }
                    placeholder="0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div />
        )}
        <MoneyInput<FormValues>
          form={form}
          name={baseName as FieldPath<FormValues>}
          label="Base de cálculo"
          placeholder="R$ 0,00"
        />
      </div>
    </div>
  );
}

export default function TaxCard<FormValues extends FieldValues>({
  title,
  form,
  entryAliquot,
  entryBase,
  exitAliquot,
  exitBase,
  entryFixedAliquot,
  exitFixedAliquot,
}: TaxCardProps<FormValues>) {
  return (
    <section className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span aria-hidden className="h-8 w-1 rounded-full bg-[#bf8900]" />
          {title}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Imposto
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <TaxSubSection<FormValues>
          form={form}
          title="Entradas"
          aliquotName={entryAliquot}
          baseName={entryBase}
          fixedAliquot={entryFixedAliquot}
          tone="entry"
        />
        <TaxSubSection<FormValues>
          form={form}
          title="Saídas"
          aliquotName={exitAliquot}
          baseName={exitBase}
          fixedAliquot={exitFixedAliquot}
          tone="exit"
        />
      </div>
    </section>
  );
}

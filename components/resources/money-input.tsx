"use client";

import { useReducer } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { FieldValues, FieldPath, UseFormReturn } from "react-hook-form";

type MoneyInputProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
};

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function MoneyInput<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: MoneyInputProps<TFieldValues>) {
  const fieldValue = form.getValues(name) as number | undefined;

  const initialValue =
    typeof fieldValue === "number" ? moneyFormatter.format(fieldValue) : "";

  const [value, setValue] = useReducer((_: string, next: string) => {
    const digits = next.replace(/\D/g, "");
    if (!digits) return "";
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(
    formattedValue: string,
    onChange: (value: unknown) => void
  ) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = digits ? Number(digits) / 100 : 0;
    onChange(realValue);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const originalOnChange = field.onChange;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(ev) => {
                  const next = ev.target.value;
                  setValue(next);
                  handleChange(next, originalOnChange);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SegmentSelect() {
  return (
    <Select>
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
  );
}

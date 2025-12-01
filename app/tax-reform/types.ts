export type TaxReformPayload = {
  segment: string;
  // Antes da reforma (entradas/saídas)
  pis_pasep_aliquot_entry: number;
  pis_pasep_base_entry: number;
  pis_pasep_aliquot_exit: number;
  pis_pasep_base_exit: number;
  cofins_aliquot_entry: number;
  cofins_base_entry: number;
  cofins_aliquot_exit: number;
  cofins_base_exit: number;
  ipi_aliquot_entry: number;
  ipi_base_entry: number;
  ipi_aliquot_exit: number;
  ipi_base_exit: number;
  icms_aliquot_entry: number;
  icms_base_entry: number;
  icms_aliquot_exit: number;
  icms_base_exit: number;
  // Após a reforma
  cbs_aliquot_entry: number;
  cbs_base_entry: number;
  cbs_aliquot_exit: number;
  cbs_base_exit: number;
  ibs_aliquot_entry: number;
  ibs_base_entry: number;
  ibs_aliquot_exit: number;
  ibs_base_exit: number;
  // O backend pode aceitar campos adicionais (ex.: ISS); mantemos flexível
  iss_aliquot_exit?: number;
  iss_base_exit?: number;
};

export type TaxEntry = {
  code: string;
  label: string;
  aliquot: number;
  base: number;
  credit: number;
};

export type TaxExit = {
  code: string;
  label: string;
  aliquot: number;
  base: number;
  debit: number;
  credit: number;
  due: number;
};

export type TaxReformResult = {
  inputs: Record<string, number>;
  before: {
    entries: TaxEntry[];
    exits: TaxExit[];
    total_due: number;
  };
  after: {
    entries: TaxEntry[];
    exits: TaxExit[];
    totals: {
      due: number;
      reduction_percent: number;
      due_with_reduction: number;
    };
    projected_rates: {
      cbs_aliquot: number;
      ibs_aliquot: number;
      is_aliquot: number;
      reduction_percent: number;
    };
  };
  comparison: {
    difference: number;
    difference_percent_points: number;
    classification:
      | "aumento de carga"
      | "redução de carga"
      | "reducao de carga"
      | "neutro";
  };
};

export type TaxReformApiResponse = {
  status: "ok";
  data: TaxReformResult;
};

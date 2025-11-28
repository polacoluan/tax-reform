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
};

export type TaxReformResult = {
  inputs: {
    segment: number;
    invoicing: number;
    costs: number;
    activity: number;
  };
  parameters: {
    t_atual: number;
    t_IBS: number;
    t_CBS: number;
    red_setorial: number;
    k_creditavel: number;
    t_credito: number;
    t_total_bruta: number;
    t_total_efetiva_bruta: number;
    custos_percent: number;
  };
  antes: {
    base: number;
    imposto: number;
    aliquota_efetiva: number;
  };
  depois: {
    base: number;
    imposto_bruto: number;
    credito_insumos: number;
    imposto_liquido: number;
    aliquota_efetiva: number;
  };
  comparacao: {
    dif_reais: number;
    dif_pp: number;
    classificacao:
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

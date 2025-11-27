export type TaxReformPayload = {
  segment: string;
  invoicing: number;
  costs: string;
  activity: string;
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
    classificacao: "aumento de carga" | "redução de carga" | "reducao de carga" | "neutro";
  };
};

export type TaxReformApiResponse = {
  status: "ok";
  data: TaxReformResult;
};

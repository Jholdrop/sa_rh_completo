export type CurriculoId = number | string;

export interface Curriculo {
  id?: CurriculoId;
  usuarioId: number;
  titulo: string;
  formacao: string;
  experiencia: string;
  habilidades: string;
  linkedin: string;
  resumo: string;
  vagaId?: CurriculoId;
}

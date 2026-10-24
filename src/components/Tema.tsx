import { createContext, useContext } from 'react';
import { COR } from '../theme';

/**
 * Tema do feed (CLAUDE.md, "Temas por trio"). O preto só troca papéis:
 * fundo #111111, texto solto branco, sombra dura amarela, esteira e placas amarelas.
 * Vermelho, azul e verde mantêm o significado.
 */
export type Tema = {
  fundo: string;
  tinta: string; // texto e traço soltos sobre o fundo
  traco: string; // ilustração dos cenários
  corSombra: string;
  sombra: string; // sombra dura de placas e caixas em destaque
  esteira: string;
  rolete: string;
  placa: string; // placa de área
  placaTexto: string;
  falaFundo?: string; // palavra falada da legenda (faixa)
  falaTexto: string;
};

export const TEMA_AMARELO: Tema = {
  fundo: COR.amarelo,
  tinta: COR.preto,
  traco: COR.preto,
  corSombra: COR.preto,
  sombra: `20px 20px 0 ${COR.preto}`,
  esteira: COR.preto,
  rolete: COR.amarelo,
  placa: COR.preto,
  placaTexto: COR.amarelo,
  falaTexto: COR.vermelho,
};

export const TEMA_PRETO: Tema = {
  fundo: COR.preto,
  tinta: COR.branco,
  traco: COR.amarelo,
  corSombra: COR.amarelo,
  sombra: `20px 20px 0 ${COR.amarelo}`,
  esteira: COR.amarelo,
  rolete: COR.preto,
  placa: COR.amarelo,
  placaTexto: COR.preto,
  falaFundo: COR.amarelo,
  falaTexto: COR.preto,
};

export const TemaCtx = createContext<Tema>(TEMA_AMARELO);
export const useTema = () => useContext(TemaCtx);

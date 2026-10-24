import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CaixaToken, Esteira, FundoAlerta, FundoGalpao, FundoPortaria, FundoPrateleiras, FundoPrensa, FundoSaida, FundoMapa, FundoEscritorio, PlacaDeArea, Progresso } from '../components';
import { COR, ESTEIRA_Y, CENTRO_X } from '../theme';

const FUNDOS = [FundoPortaria, FundoGalpao, FundoPrateleiras, FundoPrensa, FundoAlerta, FundoSaida, FundoMapa, FundoEscritorio];

/** Prévia: um cenário por frame (só para revisão). */
export const PreviaCenarios: React.FC = () => {
  const f = useCurrentFrame();
  const F = FUNDOS[f % FUNDOS.length];
  return (
    <AbsoluteFill style={{ background: COR.amarelo }}>
      <F />
      <Esteira deslocamento={0} />
      {f !== 0 ? <PlacaDeArea nome="SETOR 01 · TOKENIZADOR" inicio={-60} y={300} /> : null}
      <CaixaToken texto="morango" tamanho={84} x={CENTRO_X} base={ESTEIRA_Y} destaque />
      <Progresso total={6} />
    </AbsoluteFill>
  );
};

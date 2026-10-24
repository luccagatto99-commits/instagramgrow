import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Calendario, Carimbo, Esteira, FichaDocumento, Num, PlacaDeArea } from '../components';
import { COR, FONTE, W } from '../theme';

/** Capa: fundo amarelo + placa + frase em Archivo Black (centrada no recorte 3:4 do grid). */
export const Capa05: React.FC = () => (
  <AbsoluteFill style={{ background: COR.amarelo }}>
    <PlacaDeArea nome="ARQUIVO HISTÓRICO" termo="história da IA" x={W / 2} y={360} inicio={-120} />
    <div style={{ position: 'absolute', left: 80, right: 80, top: 580, textAlign: 'center', fontFamily: FONTE.titulo, fontSize: 132, lineHeight: 1.04, color: COR.preto }}>
      A IA levou <Num>70</Num> anos
    </div>
    <Calendario ano={1956} de={-120} top={900} x={W / 2 - 230} />
    <Esteira deslocamento={0} y={1420} />
    <FichaDocumento x={W / 2 + 120} base={1420} rotulo="PLANO" nome="criar a IA" numero="prazo: 1 verão" largura={420} tamanho={44} anulada={1}>
      <Carimbo x={210} y={110} texto="ERRARAM" em={-30} tamanho={50} rot={-12} />
    </FichaDocumento>
  </AbsoluteFill>
);

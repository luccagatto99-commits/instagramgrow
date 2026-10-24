import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CaixaToken, Esteira, PlacaDeArea } from '../components';
import { COR, FONTE, W } from '../theme';
import { MORANGO } from './dados';

/** Capa: fundo amarelo + placa + frase em Archivo Black (centrada no recorte 3:4 do grid). */
export const Capa01: React.FC = () => (
  <AbsoluteFill style={{ background: COR.amarelo }}>
    <PlacaDeArea nome="TOKENIZADOR" termo="tokenização" x={W / 2} y={380} inicio={-120} />
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 600,
        textAlign: 'center',
        fontFamily: FONTE.titulo,
        fontSize: 132,
        lineHeight: 1.04,
        color: COR.preto,
      }}
    >
      A IA não sabe soletrar morango
    </div>
    <Esteira deslocamento={0} y={1420} />
    <CaixaToken texto={MORANGO[0].t} id={MORANGO[0].id} tamanho={84} x={W / 2 - 150} base={1420} destaque />
    <CaixaToken texto={MORANGO[1].t} id={MORANGO[1].id} tamanho={84} x={W / 2 + 150} base={1420} destaque />
  </AbsoluteFill>
);

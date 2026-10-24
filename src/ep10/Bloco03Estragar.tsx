import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ContadorPassos, FECHADO, FundoPrensa, QuadroRuido, Som, type CenaEp } from '../components';
import { COR, CONTORNO, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';
import { CenaPraia, Etiqueta, RotuloHud } from './comum';

const B = 2;
const BASE = ESTEIRA_Y - 10;
const LARG = 380;
const ALT = (LARG * 3) / 4;
const PASSES = 5;

/** Milhar com ponto (1.000.000). */
const milhar = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Estragar a foto: a foto "um cachorro na praia" chega pela esteira; a ESTRAGADORA (lâmina vermelha)
 * passa 5 vezes da esquerda para a direita e deixa pontos aleatórios por onde passa, até a foto sumir.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMilhoes = palavra(B, 'milhões');
  const tCachorro = palavra(B, 'um', 0);
  const tEstragam = palavra(B, 'estragam');
  const tSumir = palavra(B, 'sumir');
  const tFim = palavra(B, 'completamente.', 0, true);

  const xFoto = naEsteira(frame, 0, CENTRO_X);
  const pEtiqueta = frame >= tCachorro ? entra(frame, tCachorro, 190) : 0;

  // 5 passadas entre "estragam" e o fim de "completamente"
  const durPasse = (tFim - tEstragam) / PASSES;
  const k = Math.min(PASSES - 1, Math.max(0, Math.floor((frame - tEstragam) / durPasse)));
  const s = frame < tEstragam ? 0 : Math.min(1.08, (frame - tEstragam - k * durPasse) / (durPasse * 0.8));
  const feitos = frame < tEstragam ? 0 : k;
  const nivelEm = (cx: number) => (feitos + Math.min(1, Math.max(0, (s - cx) / 0.08 + 0.5))) / PASSES;
  const aLamina = frame >= tEstragam - 6 && frame < tFim + 6;
  const xLamina = xFoto - LARG / 2 + s * LARG;

  const fotos = lin(frame, tMilhoes, tCachorro + 10, 0, 2_000_000);
  return (
    <>
      <Som nome="tique" em={4} />
      <Som nome="tique" em={tCachorro} />
      {Array.from({ length: PASSES }).map((_, i) => (
        <Som key={i} nome="chiado" em={Math.round(tEstragam + i * durPasse)} volume={0.4} />
      ))}

      {frame >= tMilhoes && frame < tEstragam - 4 ? (
        <ContadorPassos rotulo="FOTOS" valor={milhar(fotos)} escala={entra(frame, tMilhoes, 200)} />
      ) : null}
      {frame >= tEstragam - 4 && frame < tFim + 4 ? <ContadorPassos rotulo="ESTRAGADORA · PASSO" valor={feitos + (s > 0 ? 1 : 0) || 1} total={PASSES} escala={entra(frame, tEstragam - 4, 200)} /> : null}
      {frame >= tFim + 4 ? <RotuloHud texto="SÓ SOBROU RUÍDO" y={500} escala={entra(frame, tFim + 4, 200)} /> : null}

      <QuadroRuido x={xFoto} base={BASE} largura={LARG} nivel={0} nivelEm={frame >= tEstragam ? nivelEm : undefined}>
        <CenaPraia />
      </QuadroRuido>
      {pEtiqueta > 0 ? <Etiqueta x={xFoto} top={BASE - ALT - 84} texto="um cachorro na praia" escala={pEtiqueta} /> : null}

      {aLamina ? (
        <div
          style={{
            position: 'absolute',
            left: xLamina - 18,
            top: BASE - ALT - 6,
            width: 36,
            height: ALT + 12,
            background: COR.vermelho,
            border: `${CONTORNO * 0.8}px solid ${COR.preto}`,
            borderRadius: 14,
            boxSizing: 'border-box',
            opacity: lin(frame, tEstragam - 6, tEstragam) * (1 - lin(frame, tFim, tFim + 6)),
          }}
        />
      ) : null}
    </>
  );
};

export const Estragar: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrensa />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'estragam'), CENTRO_X, 840, 1.1), ABERTO(palavra(B, 'sumir'))],
};

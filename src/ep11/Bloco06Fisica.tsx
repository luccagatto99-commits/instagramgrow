import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, Caixa3D, Carimbo, FundoPrateleiras, No3D, Som, Visto, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { Copo, Fabrica3D, Mesa3D, cameraPor } from './comum';

const B = 5;
const ALTURA_MESA = 230;

/** Placa com volume e o veredito: ✓/✗ à esquerda e a frase. Apoiada pela base. */
const Placa3D: React.FC<{ texto: string; ok: boolean }> = ({ texto, ok }) => (
  <Caixa3D
    w={720}
    h={112}
    d={46}
    raio={20}
    frente={
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 96 }}>
        <Visto x={50} y={46} r={34} ok={ok} />
        <span style={{ fontFamily: FONTE.titulo, fontSize: 42, color: COR.preto, whiteSpace: 'nowrap' }}>{texto}</span>
      </div>
    }
  />
);

/**
 * O erro de física: um copo cai e atravessa a mesa (em 3D, o tampo corta o copo de verdade);
 * depois uma pessoa de traço ganha um terceiro braço. No fim, duas placas com volume caem:
 * "SABE COMO PARECE" ✓ e "NÃO SABE AS REGRAS" ✗.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tFisica = palavra(B, 'física.');
  const tCopo = palavra(B, 'copo');
  const tMesa = palavra(B, 'mesa,');
  const tPessoa = palavra(B, 'pessoa');
  const tBraco = palavra(B, 'braço');
  const tEla = palavra(B, 'ela');
  const tParece = palavra(B, 'parece,');
  const tSem = palavra(B, 'sem');

  // copo: aparece flutuando em "física", cai em "copo" e atravessa o tampo até o chão
  const pCopo = frame >= tFisica - 2 ? entra(frame, tFisica - 2, 180) : 0;
  const queda = lin(frame, tCopo, tMesa + 8);
  const yCopo = -340 + Math.sin(frame / 9) * (1 - queda) * 10 + 340 * queda * queda;
  const someMesa = lin(frame, tPessoa - 6, tPessoa + 4);

  const pBoneco = frame >= tPessoa - 2 ? entra(frame, tPessoa - 2, 170) : 0;
  const braco = lin(frame, tBraco - 2, tBraco + 8);
  const someBoneco = lin(frame, tParece - 10, tParece - 2);

  const pPlaca1 = frame >= tParece - 4 ? entra(frame, tParece - 4, 170) : 0;
  const pPlaca2 = frame >= tSem - 4 ? entra(frame, tSem - 4, 170) : 0;

  const cam = cameraPor(frame, [
    { em: 0, rx: 18, ry: -30, zoom: 80, foco: [0, -200, 0] },
    { em: tCopo - 4, ry: -12, zoom: 160 },
    { em: tPessoa - 6, rx: 12, ry: 14, zoom: 120, foco: [0, -180, 0] },
    { em: tEla - 4, rx: 20, ry: -8, zoom: 60, foco: [0, -150, 0] },
  ], 2, B);
  return (
    <>
      <Som nome="tique" em={tFisica} volume={0.3} />
      <Som nome="guilhotina" em={tMesa - 4} volume={0.3} />
      <Som nome="carimbo" em={tMesa} volume={0.45} />
      <Som nome="tique" em={tPessoa} volume={0.3} />
      <Som nome="carimbo" em={tBraco + 4} volume={0.35} />
      <Som nome="tique" em={tParece} volume={0.35} />
      <Som nome="carimbo" em={tSem} volume={0.4} />

      <Fabrica3D bloco={B} cam={cam} poeira={0.15}>
        {someMesa < 1 ? (
          <No3D escala={1 - someMesa}>
            <Mesa3D altura={ALTURA_MESA} />
            {pCopo > 0 ? (
              <No3D y={yCopo} escala={pCopo}>
                <Copo w={100} />
              </No3D>
            ) : null}
          </No3D>
        ) : null}

        {pBoneco > 0.01 && someBoneco < 1 ? (
          <No3D escala={1.55 * pBoneco * (1 - someBoneco)}>
            <Bonequinho x={0} base={0} />
            {/* o braço a mais, à direita, com um círculo vermelho de defeito */}
            {braco > 0 ? (
              <svg width={140} height={230} viewBox="0 0 140 230" style={{ position: 'absolute', left: -70, top: -230, overflow: 'visible' }}>
                <line x1={98} y1={104} x2={98 + 46 * braco} y2={104 - 8 * braco} stroke={COR.preto} strokeWidth={9} strokeLinecap="round" />
                <circle cx={122} cy={100} r={34} fill="none" stroke={COR.vermelho} strokeWidth={6} opacity={lin(frame, tBraco + 4, tBraco + 10)} />
              </svg>
            ) : null}
          </No3D>
        ) : null}

        {pPlaca1 > 0 ? (
          <No3D z={-150} escala={pPlaca1}>
            <Caixa3D w={300} h={64} d={60} cor={COR.preto} borda={0} />
            <No3D y={-64}>
              <Placa3D texto="SABE COMO PARECE" ok />
            </No3D>
          </No3D>
        ) : null}
        {pPlaca2 > 0 ? (
          <No3D z={150} escala={pPlaca2}>
            <Placa3D texto="NÃO SABE AS REGRAS" ok={false} />
          </No3D>
        ) : null}
      </Fabrica3D>

      {frame < tPessoa - 6 ? <Carimbo x={540} y={540} texto="ERRO DE FÍSICA" em={tMesa} tamanho={46} /> : null}
      {frame >= tBraco + 4 && frame < tParece - 10 ? <Carimbo x={540} y={540} texto="BRAÇO A MAIS" em={tBraco + 4} tamanho={46} /> : null}
    </>
  );
};

export const Fisica: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

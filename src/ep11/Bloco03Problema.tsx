import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ContadorPassos, FundoPrensa, No3D, Som, Visto, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, mola, pop } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { ALTURA_ESTEIRA, CenaPraiaViva, Fabrica3D, QuadroFilme3D, cameraPor } from './comum';
import { RotuloHud } from '../ep10/comum';

const B = 2;
const W_IMG = 160;
const BARALHO = 14; // quadros visíveis do "baralho" (representam as 300 imagens)
const LADO = [-300, -100, 100, 300]; // os 4 quadros limpos separados
const CORES = [COR.branco, COR.amarelo, COR.preto, COR.branco];

/**
 * O problema: "10 segundos" = 300 imagens, empilhadas como cartas em profundidade (a câmera gira para
 * mostrar o baralho). Em "cada uma separada" quatro quadros saem lado a lado e são limpos um por vez;
 * o cachorro sai de uma cor em cada um e a praia treme. ✗ vermelho.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tDez = palavra(B, '10');
  const t300 = palavra(B, '300');
  const tLimpasse = palavra(B, 'limpasse');
  const tSeparada = palavra(B, 'separada,');
  const tMudaria = palavra(B, 'mudaria');
  const tCor = palavra(B, 'cor');
  const tTremendo = palavra(B, 'tremendo.');

  const pBaralho = frame >= t300 - 6 ? mola(frame, t300 - 6, 0, 1) : 0; // o vídeo abre em cartas
  const abre = frame >= tLimpasse - 4 ? mola(frame, tLimpasse - 4, 0, 1) : 0; // cartas → 4 lado a lado
  const contagem = Math.round(lin(frame, t300, t300 + 30, 1, 300));
  const tLimpa = (i: number) => tSeparada + i * 9;
  const nivel = (i: number) => (frame < tSeparada ? 1 : 1 - lin(frame, tLimpa(i), tLimpa(i) + 8));
  const tremor = frame >= tTremendo - 4 ? 9 * lin(frame, tTremendo - 4, tTremendo + 4) : 0;

  const cam = cameraPor(frame, [
    { em: 0, rx: 14, ry: 10, zoom: 420, foco: [0, -150, 0], centra: 0.4 },
    { em: t300 - 6, rx: 14, ry: -38, zoom: 140, foco: [0, -150, -300], centra: 0 },
    { em: tLimpasse - 4, rx: 14, ry: 0, zoom: -40, foco: [0, -150, 0] },
    { em: tTremendo - 6, zoom: 10 },
  ], 2.5, B);
  return (
    <>
      <Som nome="tique" em={tDez} volume={0.35} />
      {Array.from({ length: 6 }).map((_, i) => <Som key={i} nome="tique" em={t300 + i * 5} volume={0.25} />)}
      {LADO.map((_, i) => <Som key={`l${i}`} nome="chiado" em={tLimpa(i)} volume={0.2} />)}
      {LADO.map((_, i) => <Som key={`c${i}`} nome="tique" em={tMudaria + i * 6} volume={0.3} />)}
      <Som nome="carimbo" em={tTremendo} volume={0.4} />

      <Fabrica3D bloco={B} cam={cam}>
        {/* o baralho: cartas em profundidade, atrás da primeira */}
        {Array.from({ length: BARALHO }).map((_, j) => {
          // as 4 primeiras cartas viram os 4 quadros lado a lado; o resto do baralho afunda
          const vira = j < 4;
          const zBaralho = -j * 70 * pBaralho;
          const xBaralho = j * 16 * pBaralho;
          const x = vira ? xBaralho + (LADO[j] - xBaralho) * abre : xBaralho;
          const z = vira ? zBaralho * (1 - abre) : zBaralho;
          const esc = vira ? 1 : 1 - abre;
          if (j > 0 && pBaralho <= 0.01) return null;
          if (esc <= 0.01) return null;
          const destaque = vira && frame >= tMudaria ? pop(frame, tMudaria + j * 6, 0.12) : 1;
          return (
            <No3D key={j} x={x} z={z} y={-ALTURA_ESTEIRA} escala={esc * destaque}>
              <QuadroFilme3D w={W_IMG} nivel={vira && abre > 0.5 ? nivel(j) : 0} semente={40 + j} cols={20}>
                <CenaPraiaViva t={frame + j * 2} passo={j * 3} cor={vira && frame >= tSeparada ? CORES[j] : COR.branco} tremor={vira ? tremor * (j % 2 ? 1 : -1) : 0} />
              </QuadroFilme3D>
            </No3D>
          );
        })}
      </Fabrica3D>

      {frame >= tDez - 2 && frame < t300 - 6 ? <ContadorPassos rotulo="UM VÍDEO DE" valor="10 s" escala={entra(frame, tDez - 2, 200)} /> : null}
      {frame >= t300 - 6 && frame < tLimpasse - 4 ? <ContadorPassos rotulo="FOTOS EM 10 s" valor={contagem} escala={entra(frame, t300 - 6, 200)} /> : null}
      {frame >= tLimpasse - 4 && frame < tTremendo - 4 ? <RotuloHud texto="UMA DE CADA VEZ" escala={entra(frame, tLimpasse - 4, 200)} /> : null}
      {frame >= tTremendo - 4 ? (
        <>
          <Visto x={300} y={500} r={38} ok={false} escala={entra(frame, tTremendo - 4, 220)} />
          <RotuloHud texto="NÃO COMBINA" x={580} escala={entra(frame, tTremendo - 4, 200)} />
        </>
      ) : null}
    </>
  );
};

export const Problema: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

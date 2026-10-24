import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Caixa3D, ContadorPassos, FundoEscritorio, Mascote, No3D, Som, Visto, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, tranco } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { ALTURA_ESTEIRA, CenaPraiaViva, Fabrica3D, QuadroFilme3D, alturaFilme, cameraPor, milhar } from './comum';

const B = 1;
const W_IMG = 200;
const N = 5;
const K = 3; // o quadro que vai para a máquina
const PASSO_X = 280;
const H_FILME = alturaFilme(W_IMG);
const ALTURA_PORTICO = ALTURA_ESTEIRA + H_FILME + 70;

/** Máquina COBRIDORA: pórtico com uma barra vermelha que joga pontos no quadro de baixo. */
const Cobridora: React.FC<{ dy: number; desce: number; pingos: number }> = ({ dy, desce, pingos }) => (
  <No3D y={dy}>
    {[-190, 190].map((x) => (
      <No3D key={x} x={x}>
        <Caixa3D w={28} h={ALTURA_PORTICO} d={28} cor={COR.preto} borda={0} />
      </No3D>
    ))}
    <No3D y={-ALTURA_PORTICO + 26 * desce}>
      <Caixa3D
        w={400}
        h={100}
        d={150}
        raio={18}
        cor={COR.vermelho}
        frente={
          <div style={{ textAlign: 'center', color: COR.branco, paddingTop: 8 }}>
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2, lineHeight: 1 }}>COBRIDORA</div>
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 4, opacity: 0.9 }}>adiciona ruído</div>
          </div>
        }
      />
    </No3D>
    {/* pontos caindo da barra até o quadro */}
    {pingos > 0
      ? Array.from({ length: 10 }).map((_, i) => {
          const fase = (pingos * 2.2 + i * 0.37) % 1;
          return (
            <No3D key={i} x={-150 + i * 33} y={-ALTURA_PORTICO + 26 * desce + 10 + fase * 70} z={20}>
              <div style={{ position: 'absolute', left: -7, top: -7, width: 14, height: 14, background: COR.preto, opacity: 1 - fase }} />
            </No3D>
          );
        })
      : null}
  </No3D>
);

/**
 * Treino: uma fila de vídeos (quadros de filme) anda na esteira em 3D; em "treino" a câmera gira para
 * a frente e um quadro entra na COBRIDORA, que o cobre de pontos até sumir. O mascote limpa de volta
 * (✗ errou, ✓ acertou) e repete milhões de vezes.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMilhoes = palavra(B, 'milhões');
  const tTreino = palavra(B, 'treino,');
  const tCoberto = palavra(B, 'coberto');
  const tSumir = palavra(B, 'sumir,', 0, true);
  const tIA = palavra(B, 'IA');
  const tDescobrir = palavra(B, 'descobrir');
  const tLimpar = palavra(B, 'limpar');
  const tVolta = palavra(B, 'volta.', 0, true);
  const tDepois = palavra(B, 'depois');
  const tBoa = palavra(B, 'boa');

  const fila = lin(frame, 0, tTreino, -380, 0);
  const somem = lin(frame, tTreino, tTreino + 10);
  const pMaquina = frame >= tTreino + 6 ? entra(frame, tTreino + 6, 140) : 0;
  const sobeMaquina = lin(frame, tIA - 4, tIA + 10);
  const desce = tranco(frame, tCoberto);

  // ruído no quadro K: cobre, limpa de volta e depois pisca rápido (repetições) até ficar limpo
  const cobre = lin(frame, tCoberto, tSumir + 6);
  const limpa = lin(frame, tLimpar, tVolta + 8);
  const rep = lin(frame, tDepois, tBoa - 6);
  const fase = rep * rep * 26; // ciclos cada vez mais rápidos
  const pisca = rep > 0 && rep < 1 ? 0.5 - 0.5 * Math.cos(fase * Math.PI * 2) : 0;
  const nivelK = Math.max(cobre * (1 - limpa), pisca * 0.9);
  const repeticoes = rep < 1 ? Math.round(rep * rep * 1_000_000) : 1_000_000;

  const errou = frame >= tDescobrir && frame < tVolta - 6;
  const acertou = frame >= tVolta - 6;
  const pMascote = frame >= tIA - 4 ? entra(frame, tIA - 4, 180) : 0;

  const cam = cameraPor(frame, [
    { em: 0, rx: 12, ry: -40, zoom: 40, foco: [0, -150, 0] },
    { em: tTreino - 6, rx: 14, ry: 0, zoom: 330, foco: [0, -170, 0], centra: 0.5 },
    { em: tIA - 4, ry: 10, zoom: 420, foco: [-145, -170, 0], centra: 1 },
    { em: tDepois, ry: -6, zoom: 420 },
  ], 2.5, B);
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => <Som key={i} nome="tique" em={8 + i * 14} volume={0.25} />)}
      <Som nome="carimbo" em={tCoberto} volume={0.4} />
      <Som nome="chiado" em={tCoberto} volume={0.35} />
      <Som nome="tique" em={tDescobrir} volume={0.4} />
      <Som nome="ding" em={tVolta - 6} volume={0.4} />
      {Array.from({ length: 8 }).map((_, i) => <Som key={`r${i}`} nome="tique" em={Math.round(tDepois + (tBoa - 6 - tDepois) * Math.sqrt((i + 1) / 9))} volume={0.25} />)}
      <Som nome="ding" em={tBoa} volume={0.45} />

      <Fabrica3D bloco={B} cam={cam} rolando={(inicioBloco(B) + Math.min(frame, tTreino)) * 4} poeira={0.2}>
        {Array.from({ length: N }).map((_, i) => {
          const eu = i === K;
          const esc = eu ? 1 : 1 - somem;
          if (esc <= 0.01) return null;
          return (
            <No3D key={i} x={(i - K) * PASSO_X + fila} y={-ALTURA_ESTEIRA} escala={esc}>
              <QuadroFilme3D w={W_IMG} nivel={eu ? nivelK : 0} semente={20 + i}>
                <CenaPraiaViva t={frame + i * 13} passo={(i % 3) * 22} />
              </QuadroFilme3D>
            </No3D>
          );
        })}
        {pMaquina > 0 && sobeMaquina < 1 ? (
          <Cobridora dy={-520 * (1 - pMaquina) - 700 * sobeMaquina * sobeMaquina} desce={desce} pingos={frame >= tCoberto && frame < tSumir ? (frame - tCoberto) / 30 : 0} />
        ) : null}
        {pMascote > 0 ? (
          <No3D x={-290} y={-ALTURA_ESTEIRA} z={40} escala={pMascote}>
            <Mascote x={0} base={0} largura={170} olhar={1} pensa={lin(frame, tLimpar, tVolta)} pulo={Math.max(0, Math.sin(Math.min(1, (frame - tBoa) / 12) * Math.PI)) * 30} />
          </No3D>
        ) : null}
      </Fabrica3D>

      {frame >= tMilhoes && frame < tTreino - 4 ? (
        <ContadorPassos rotulo="VÍDEOS" valor={milhar(lin(frame, tMilhoes, tTreino - 10, 0, 3_000_000))} escala={entra(frame, tMilhoes, 200)} />
      ) : null}
      {errou ? <Visto x={540} y={500} r={40} ok={false} escala={entra(frame, tDescobrir, 220)} /> : null}
      {acertou && frame < tDepois - 2 ? <Visto x={540} y={500} r={40} escala={entra(frame, tVolta - 6, 220)} /> : null}
      {frame >= tDepois - 2 ? <ContadorPassos rotulo="REPETIÇÕES" valor={milhar(repeticoes)} escala={entra(frame, tDepois - 2, 200)} /> : null}
    </>
  );
};

export const Treino: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

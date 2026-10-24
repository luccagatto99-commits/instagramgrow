import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, Balao, BracoRobotico, FECHADO, FundoEscritorio, Som, Visto, misturaPose, poseParaAlvo, useTema, useVisivelNoHud, type CenaEp, type PoseBraco } from '../components';
import { FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { Mesa, PilhaPaginas, Saco } from './comum';

const B = 4;
const BRACO_X = 790;
const COLUNA = 150;
const L1 = 200;
const L2 = 180;
const OMBRO = { x: BRACO_X, y: ESTEIRA_Y - COLUNA };
const TAMPO = 840;
const MESA_X = 400;
const BORDA = MESA_X + 160; // canto direito do tampo
const REPOUSO: PoseBraco = { ombro: 75, cotovelo: 80, pulso: 60 };

/** Etiqueta do hud (faixa da cor da placa). */
const Etiqueta: React.FC<{ em: number; texto: string }> = ({ em, texto }) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  const tema = useTema();
  if (frame < em) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top: 466,
        transform: `translateX(-50%) rotate(-3deg) scale(${entra(frame, em, 200)})`,
        background: tema.placa,
        color: tema.placaTexto,
        borderRadius: 16,
        padding: '14px 30px 12px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 44,
        letterSpacing: 3,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...vis,
      }}
    >
      {texto}
    </div>
  );
};

/** O "uau": pedido que nunca treinou; o saco tomba da mesa e o braço pega no ar. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNunca = palavra(B, 'nunca');
  const tSaco = palavra(B, 'saco');
  const tCair = palavra(B, 'cair');
  const tMesa = palavra(B, 'mesa.');
  const tInternet = palavra(B, 'internet');

  // o saco balança na borda e cai em "cair"
  const balanca = frame < tCair ? Math.sin(frame / 3) * 10 * lin(frame, tSaco, tSaco + 10) : 0;
  const tomba = interpolate(frame, [tCair, tCair + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  const pego = tCair + 8;
  const sacoX = BORDA - 20 + tomba * 50;
  const sacoBase = TAMPO + tomba * 70;
  const sacoRot = balanca + tomba * 35;
  // o braço vai até o ponto onde o saco estará
  const alvo = { x: BORDA + 30, y: TAMPO + 10 };
  const pegar = poseParaAlvo(OMBRO, alvo, L1, L2, -60);
  const vai = interpolate(frame, [tCair - 6, pego], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const pose = misturaPose(REPOUSO, pegar, vai);
  const garra = lin(frame, pego - 2, pego + 4);
  const pBraco = mola(frame, 8, 0, 1);

  return (
    <>
      <Som nome="carimbo" em={tNunca} volume={0.4} />
      <Som nome="tique" em={tSaco} />
      <Som nome="guilhotina" em={tCair - 4} volume={0.2} />
      <Som nome="carimbo" em={pego} volume={0.5} />
      <Som nome="tique" em={tInternet} />

      {frame >= 0 ? (
        <>
          <Mesa x={MESA_X} tampo={TAMPO} base={ESTEIRA_Y} largura={320} />
          {frame >= pego ? null : <Saco x={sacoX} base={sacoBase} rot={sacoRot} />}
          <BracoRobotico x={BRACO_X} base={ESTEIRA_Y} pose={pose} garra={garra} l1={L1} l2={L2} coluna={COLUNA} escala={pBraco} acesas={vai >= 1 ? [0, 1, 2, 3] : []} />
          {frame >= pego ? <Saco x={alvo.x + 4} base={alvo.y + 70} rot={10} /> : null}
          {frame < tInternet ? (
            <Balao x={350} base={775} largura={420} tamanho={38} escala={entra(frame, tSaco - 8, 170)} opacidade={1 - lin(frame, tInternet - 8, tInternet)}>
              “Pegue o saco que vai cair”
            </Balao>
          ) : null}
        </>
      ) : null}
      {frame >= pego + 4 ? <Visto x={880} y={660} r={48} ok escala={entra(frame, pego + 4, 220)} /> : null}
      {frame >= tInternet - 2 ? <PilhaPaginas x={330} base={800} escala={0.7 * entra(frame, tInternet - 2, 180)} /> : null}
      <Etiqueta em={tNunca} texto="NUNCA TREINOU ISSO" />
    </>
  );
};

export const Uau: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'cair'), 640, 860, 1.1), ABERTO(palavra(B, 'o', 2))],
};

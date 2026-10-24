import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FichaArquivo, FitaAcao, FundoEscritorio, Maquina, Som, type CenaEp, type GrupoAcao } from '../components';
import { COR, CONTORNO, FONTE, RAIO, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, naEsteira, segue, suave } from '../anim';
import { palavra } from './tempo';
import { Cozinha, PilhaPaginas, QuadroCamera } from './comum';

const B = 3;
// exemplo de ação do RT-2 (blog do Google DeepMind, 2023): "1 128 91 241 5 101 127 217"
export const ACAO_RT2: GrupoAcao[] = [
  { numeros: [1], rotulo: 'SEGUE' },
  { numeros: [128, 91, 241], rotulo: 'POSIÇÃO' },
  { numeros: [5, 101, 127], rotulo: 'ROTAÇÃO' },
  { numeros: [217], rotulo: 'GARRA' },
];

/** Contador "17 MESES" numa caixa branca (número em azul). */
const Meses: React.FC<{ x: number; top: number; n: number; escala: number }> = ({ x, top, n, escala }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      transform: `translateX(-50%) scale(${escala})`,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      padding: '8px 22px 6px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 52, color: COR.azul }}>{Math.round(n)}</span>
    <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, marginLeft: 10 }}>MESES</span>
  </div>
);

/** Prova do Google (RT-2): imagem da câmera → rede → números de movimento; treino com internet + cozinha. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tGoogle = palavra(B, 'google') - 4;
  const tModelo = palavra(B, 'modelo');
  const tCamera = palavra(B, 'camera');
  const tNumeros = palavra(B, 'numeros');
  const tFoi = palavra(B, 'foi');
  const tInternet = palavra(B, 'internet');
  const tMeses = palavra(B, 'meses');
  const tCozinha = palavra(B, 'cozinha.');

  const saiFicha = segue(frame, tModelo - 16, 12);
  const saiRede = segue(frame, tInternet - 16, 14);
  // o quadro da câmera chega pela esquerda e entra na máquina
  const xCam = naEsteira(frame, tModelo - 2, 330);
  const entraNaRede = lin(frame, tCamera + 10, tCamera + 26);
  const pFita = lin(frame, tNumeros - 4, tNumeros + 26);
  const destaque = frame > tNumeros + 30 ? Math.floor((frame - tNumeros - 30) / 9) % 4 : undefined;

  return (
    <>
      <Som nome="carimbo" em={tGoogle + 4} volume={0.35} />
      <Som nome="tique" em={tModelo} />
      <Som nome="guilhotina" em={tCamera + 22} volume={0.25} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Som key={k} nome="tique" em={tNumeros - 4 + k * 4} volume={0.35} />)}
      <Som nome="tique" em={tInternet} />
      <Som nome="tique" em={tCozinha} />

      {frame >= tGoogle && saiFicha < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${naEsteira(frame, tGoogle, 0) + saiFicha}px)` }}>
          <FichaArquivo
            x={CENTRO_X}
            top={640}
            largura={720}
            ano="2023"
            tamanhoTitulo={56}
            titulo="RT-2: um robô que lê e se mexe"
            detalhes={['GOOGLE DEEPMIND', 'IMAGEM + TEXTO → AÇÃO']}
          />
        </div>
      ) : null}

      {frame >= tModelo - 4 && saiRede < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiRede}px)` }}>
          {entraNaRede < 1 ? (
            <div style={{ opacity: 1 - entraNaRede }}>
              <QuadroCamera x={xCam + entraNaRede * 210} top={600} escala={1 - entraNaRede * 0.5} />
            </div>
          ) : null}
          <Maquina x={CENTRO_X + 60} y={600} w={300} h={180} nome="REDE NEURAL" termo="modelo de visão e ação">
            <svg width={160} height={110} viewBox="0 0 160 110">
              {[20, 55, 90].flatMap((y1) => [35, 75].map((y2) => <line key={`${y1}${y2}`} x1={20} y1={y1} x2={140} y2={y2} stroke={COR.preto} strokeWidth={6} />))}
              {[20, 55, 90].map((y) => <circle key={y} cx={20} cy={y} r={12} fill={COR.branco} stroke={COR.preto} strokeWidth={6} />)}
              {[35, 75].map((y) => <circle key={y} cx={140} cy={y} r={12} fill={COR.branco} stroke={COR.preto} strokeWidth={6} />)}
            </svg>
          </Maquina>
          {frame >= tNumeros - 6 ? (
            <FitaAcao x={CENTRO_X} top={850} grupos={ACAO_RT2} revela={pFita} destaque={destaque} tamanho={42} escala={suave(frame, tNumeros - 6, 8)} />
          ) : null}
        </div>
      ) : null}

      {frame >= tInternet - 2 ? <PilhaPaginas x={300} base={ESTEIRA_Y} rotulo="INTERNET" escala={entra(frame, tInternet - 2, 180)} /> : null}
      {frame >= tMeses - 2 ? (
        <>
          <Cozinha x={720} base={ESTEIRA_Y} p={suave(frame, tMeses - 2, 12)} frame={frame} />
          <Meses x={720} top={590} n={lin(frame, tMeses, tCozinha + 6, 0, 17)} escala={entra(frame, tMeses, 180)} />
        </>
      ) : null}
    </>
  );
};

export const Google: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'modelo')), ABERTO(palavra(B, 'foi'))],
};

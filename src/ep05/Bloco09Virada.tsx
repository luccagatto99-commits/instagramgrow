import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Calendario, Destaque, FECHADO, FichaArquivo, FundoAlerta, Som, TelaDividida, rolaAno, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, lin, segue } from '../anim';
import { palavra } from './tempo';

const B = 8;
const LARGURA = 760;
const PW = (LARGURA - 24) / 2;

/** Globo de traço (internet). */
const Globo: React.FC = () => (
  <svg width={150} height={150} viewBox="0 0 100 100" fill="none" stroke={COR.preto} strokeWidth={7}>
    <circle cx={50} cy={50} r={42} fill={COR.branco} />
    <ellipse cx={50} cy={50} rx={18} ry={42} />
    <line x1={8} y1={50} x2={92} y2={50} />
    <path d="M16 28 Q50 38 84 28 M16 72 Q50 62 84 72" />
  </svg>
);

/** Placa de vídeo de traço (GPU). */
const PlacaVideo: React.FC = () => (
  <svg width={200} height={130} viewBox="0 0 160 104" fill={COR.branco} stroke={COR.preto} strokeWidth={7} strokeLinejoin="round">
    <rect x={6} y={6} width={148} height={72} rx={10} />
    <circle cx={52} cy={42} r={24} />
    <circle cx={52} cy={42} r={6} fill={COR.preto} />
    <circle cx={112} cy={42} r={24} />
    <circle cx={112} cy={42} r={6} fill={COR.preto} />
    <path d="M24 78 V96 M44 78 V96 M64 78 V96 M84 78 V96" />
  </svg>
);

const Vaga: React.FC<{ x: number; titulo: string; p: number; cheia: boolean; rotulo: string; children: React.ReactNode }> = ({ x, titulo, p, cheia, rotulo, children }) =>
  p > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 600,
        width: 360,
        height: 360,
        transform: `translateX(-50%) scale(${p})`,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        overflow: 'hidden',
      }}
    >
      <div style={{ background: COR.preto, color: COR.amarelo, padding: '12px 0 8px', textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 3 }}>{titulo}</div>
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {cheia ? children : <span style={{ fontFamily: FONTE.titulo, fontSize: 140, color: COR.vermelho, WebkitTextStroke: `6px ${COR.preto}`, lineHeight: 1 }}>?</span>}
      </div>
      <div style={{ textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, opacity: cheia ? 1 : 0 }}>{rotulo}</div>
    </div>
  ) : null;

/** A virada: de regras para exemplos; faltavam texto e força; 2022, o ChatGPT. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRegras = palavra(B, 'regras,');
  const tExemplos = palavra(B, 'exemplos');
  const tAprender = palavra(B, 'aprender');
  const tFaltavam = palavra(B, 'faltavam');
  const tTexto = palavra(B, 'texto', 0);
  const tComputadores = palavra(B, 'computadores');
  const tInternet = palavra(B, 'internet');
  const tPlacas = palavra(B, 'placas');
  const t2022 = palavra(B, '2022,');
  const tChat = palavra(B, 'chatgpt.');

  const saiTela = segue(frame, tFaltavam - 10, 12);
  const nExemplos = Math.floor(lin(frame, tExemplos - 2, tAprender + 6, 0, 30));
  const apagaRegras = lin(frame, tAprender, tAprender + 8);
  const saiVagas = segue(frame, t2022 - 8, 14);
  const ano = rolaAno(frame, t2022 - 4, 1997, 2022, 20);

  return (
    <>
      <Som nome="sirene" em={0} duracao={30} volume={0.2} />
      <Som nome="tique" em={tRegras - 4} />
      <Som nome="tique" em={tExemplos - 2} />
      <Som nome="carimbo" em={tAprender + 2} volume={0.5} />
      <Som nome="tique" em={tTexto - 2} />
      <Som nome="tique" em={tComputadores - 2} />
      <Som nome="carimbo" em={tInternet} volume={0.5} />
      <Som nome="carimbo" em={tPlacas} volume={0.5} />
      <Som nome="tique" em={tChat - 4} />

      <Destaque de={0} ate={tRegras - 20} top={620} tamanho={96}>
        a virada
      </Destaque>

      {saiTela < 1400 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiTela}px)` }}>
          <TelaDividida
            top={560}
            altura={420}
            largura={LARGURA}
            titulos={['REGRAS', 'EXEMPLOS']}
            entrada={[entra(frame, tRegras - 6, 140), entra(frame, tExemplos - 6, 140)]}
            esquerda={
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.65 * apagaRegras }}>
                {['se “estou X”…', 'se “mãe”…', 'se “sim”…'].map((r, i) => (
                  <div key={r} style={{ position: 'absolute', left: 24, top: 80 + i * 76, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, color: COR.preto, whiteSpace: 'nowrap' }}>{r}</div>
                ))}
              </div>
            }
            direita={
              <>
                {Array.from({ length: nExemplos }).map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: 26 + (i % 6) * 54, top: 70 + Math.floor(i / 6) * 54, width: 40, height: 42, background: COR.branco, border: `6px solid ${COR.preto}`, borderRadius: 8, boxSizing: 'border-box' }} />
                ))}
                {frame >= tAprender ? (
                  <div style={{ position: 'absolute', left: PW / 2, top: 180, transform: `translate(-50%, -50%) scale(${entra(frame, tAprender, 170)})`, width: 120, height: 120, borderRadius: '50%', background: COR.verde, border: `${CONTORNO}px solid ${COR.preto}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontSize: 70, color: COR.preto }}>✓</div>
                ) : null}
              </>
            }
          />
        </div>
      ) : null}

      {frame >= tTexto - 6 && saiVagas < 1400 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiVagas}px)` }}>
          <Vaga x={320} titulo="TEXTO" p={entra(frame, tTexto - 6, 150)} cheia={frame >= tInternet} rotulo="INTERNET">
            <Globo />
          </Vaga>
          <Vaga x={760} titulo="FORÇA" p={entra(frame, tComputadores - 6, 150)} cheia={frame >= tPlacas} rotulo="PLACA DE VÍDEO">
            <PlacaVideo />
          </Vaga>
        </div>
      ) : null}

      <Calendario ano={ano} de={t2022 - 4} />
      {frame >= tChat - 6 ? (
        <FichaArquivo x={CENTRO_X} top={640} escala={entra(frame, tChat - 6, 150)} ano="2022" marca="openai" titulo="ChatGPT" detalhes={['OPENAI']} largura={700} tamanhoTitulo={84} />
      ) : null}
    </>
  );
};


export const Virada: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'exemplos') + 6, CENTRO_X, 780, 1.06),
    ABERTO(palavra(B, 'faltavam') - 6),
    FECHADO(palavra(B, 'internet') - 2, CENTRO_X, 780, 1.06),
    ABERTO(palavra(B, '2022,') - 8),
  ],
};

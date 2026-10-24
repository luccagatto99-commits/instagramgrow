import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FichaArquivo, FundoAlerta, SeloMarca, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';

const B = 7;
const PORTA_X = 820;

/** Bonequinho de traço, sem rosto, andando (balanço leve). */
const Pessoa: React.FC<{ x: number; fase: number; opacidade: number }> = ({ x, fase, opacidade }) => (
  <svg
    width={90}
    height={150}
    viewBox="0 0 90 150"
    style={{ position: 'absolute', left: x - 45, top: ESTEIRA_Y - 150 - Math.abs(Math.sin(fase)) * 8, opacity: opacidade }}
    fill={COR.branco}
    stroke={COR.preto}
    strokeWidth={8}
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <circle cx={45} cy={28} r={22} />
    <path d="M22 100 L28 60 Q45 50 62 60 L68 100 Z" />
    <line x1={36} y1={100} x2={30 + Math.sin(fase) * 10} y2={144} />
    <line x1={54} y1={100} x2={60 - Math.sin(fase) * 10} y2={144} />
  </svg>
);

/** A ironia: o Google inventou, a OpenAI lançou; os autores saíram; hoje todos usam. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tGoogle = palavra(B, 'google', 0);
  const t2018 = palavra(B, '2018');
  const tOpen = palavra(B, 'openai.');
  const tTodos = palavra(B, 'todos');
  const tHoje = palavra(B, 'hoje');
  const tChat = palavra(B, 'chatgpt');
  const tPrinc = palavra(B, 'concorrentes');
  const tConc = palavra(B, 'dele');
  const tMesma = palavra(B, 'mesma');

  const fichas = frame < tTodos + 6;
  const sobe = lin(frame, tTodos - 6, tTodos + 4);
  const desce = (t: number) => -700 * (1 - entra(frame, t, 130)) - 900 * sobe * sobe;

  const pessoas = frame >= tTodos - 2 && frame < tHoje + 6;
  const pPorta = entra(frame, tTodos - 4, 150) * (1 - lin(frame, tHoje - 4, tHoje + 4));
  const selos = [
    { marca: 'openai' as const, nome: 'ChatGPT', t: tChat, x: 250 },
    { marca: 'claude' as const, nome: 'Claude', t: tPrinc, x: CENTRO_X },
    { marca: 'gemini' as const, nome: 'Gemini', t: tConc, x: 830 },
  ];
  const pBase = entra(frame, tMesma - 4, 140);

  return (
    <>
      <Som nome="sirene" em={0} duracao={30} volume={0.2} />
      <Som nome="carimbo" em={tGoogle} volume={0.5} />
      <Som nome="carimbo" em={tOpen - 4} volume={0.5} />
      {selos.map((s) => <Som key={s.nome} nome="tique" em={s.t - 2} />)}

      <Destaque de={0} ate={tGoogle - 8} top={620} tamanho={96}>
        a ironia
      </Destaque>

      {fichas ? (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${desce(tGoogle - 4)}px)` }}>
            <FichaArquivo x={315} top={540} ano="2017" marca="google" titulo={<>inventou o<br />Transformer</>} detalhes={['GOOGLE']} largura={400} tamanhoTitulo={42} rot={-2} logoEmCima />
          </div>
          {frame >= t2018 - 6 ? (
            <div style={{ position: 'absolute', inset: 0, transform: `translateY(${desce(t2018 - 6)}px)` }}>
              <FichaArquivo x={745} top={580} ano="2018" marca="openai" titulo={<>lançou o<br />primeiro GPT</>} detalhes={['OPENAI']} largura={400} tamanhoTitulo={42} rot={2} logoEmCima />
            </div>
          ) : null}
        </>
      ) : null}

      {/* os oito autores saem pela porta */}
      {pPorta > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 90, top: 640, opacity: pPorta }}>
            <SeloMarca marca="google" x={70} y={0} tamanho={110} destaque={false} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: PORTA_X - 80,
              top: ESTEIRA_Y - 300,
              width: 160,
              height: 300,
              background: COR.branco,
              border: `${CONTORNO}px solid ${COR.preto}`,
              borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`,
              boxSizing: 'border-box',
              transform: `scale(${pPorta})`,
              transformOrigin: '50% 100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -64,
                transform: 'translateX(-50%)',
                background: COR.vermelho,
                border: `6px solid ${COR.preto}`,
                borderRadius: 12,
                padding: '6px 16px 4px',
                fontFamily: FONTE.rotulo,
                fontWeight: 900,
                fontSize: 28,
                letterSpacing: 2,
                color: COR.preto,
              }}
            >
              SAÍDA
            </div>
          </div>
        </>
      ) : null}
      {pessoas
        ? Array.from({ length: 8 }).map((_, i) => {
            const x = 140 + (frame - (tTodos + i * 7)) * 9;
            if (frame < tTodos + i * 7 - 4) return null;
            const some = 1 - lin(x, PORTA_X - 30, PORTA_X + 20);
            if (some <= 0) return null;
            return <Pessoa key={i} x={Math.min(x, PORTA_X + 20)} fase={frame * 0.5 + i} opacidade={some * pPorta} />;
          })
        : null}

      {/* hoje: todos com a mesma peça por baixo */}
      {selos.map((s) => (frame >= s.t - 4 ? <SeloMarca key={s.nome} marca={s.marca} nome={s.nome} x={s.x} y={640} tamanho={150} escala={entra(frame, s.t - 4, 170)} /> : null))}
      {pBase > 0.01 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(1, pBase * 1.5) }} width={1} height={1}>
            {selos.map((s) => <line key={s.nome} x1={s.x} y1={790} x2={s.x} y2={850} stroke={COR.preto} strokeWidth={10} />)}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: CENTRO_X,
              top: 850,
              width: 760,
              transform: `translateX(${(1 - pBase) * -1100}px) translateX(-50%)`,
              background: COR.preto,
              color: COR.amarelo,
              borderRadius: RAIO.placa,
              boxShadow: SOMBRA,
              padding: '22px 0 18px',
              textAlign: 'center',
              fontFamily: FONTE.rotulo,
              fontWeight: 900,
              fontSize: 52,
              letterSpacing: 4,
            }}
          >
            TRANSFORMER
          </div>
        </>
      ) : null}
    </>
  );
};

export const Ironia: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'todos') - 2, CENTRO_X, 860, 1.08),
    ABERTO(palavra(B, 'hoje') - 2),
    FECHADO(palavra(B, 'mesma') - 2, CENTRO_X, 760, 1.06),
  ],
};

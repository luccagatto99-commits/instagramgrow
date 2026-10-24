import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, MapaSemantico, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { FIM_MAPA, MAPA_GRANDE, fundoMapaContinuo } from './Bloco05Mapa';

const B = 5;
export const MAPA_MEDIO = { top: 470, w: 820, h: 330 };

type XY = [number, number];
/** Posições: no lugar (fim do treino), sorteadas (início) e no meio do caminho. */
const CERTO: Record<string, XY> = { cachorro: [200, 120], gato: [330, 230], geladeira: [650, 150] };
const SORTEADO: Record<string, XY> = { cachorro: [130, 270], gato: [130, 120], geladeira: [560, 270] };
const MEIO: Record<string, XY> = { cachorro: [470, 170], gato: [300, 265] };

const FRASES = ['O gato dormiu.', 'Comprei pão.', 'O cachorro latiu.', 'A geladeira quebrou.', 'Dei banho no gato.', 'O cachorro correu.', 'Fechei a geladeira.'];

/** "Levei o ___ para passear." com a lacuna preenchida pela palavra da vez. */
const Frase: React.FC<{ x: number; palavra: string | null; ok: boolean; tremor: number; pPal: number }> = ({ x, palavra: p, ok, tremor, pPal }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: ESTEIRA_Y,
      transform: 'translate(-50%, -100%)',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      padding: '12px 30px',
      fontFamily: FONTE.titulo,
      fontSize: 56,
      lineHeight: 1.15,
      color: COR.preto,
      whiteSpace: 'nowrap',
      textAlign: 'center',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
      Levei o
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 330,
          height: 72,
          border: `6px dashed ${COR.preto}`,
          borderRadius: 14,
          padding: '0 12px',
          transform: `translateX(${tremor * 18}px)`,
          gap: 10,
        }}
      >
        {p ? (
          <>
            <span style={{ display: 'inline-block', transform: `scale(${pPal})` }}>{p}</span>
            <span
              style={{
                fontSize: 50,
                color: ok ? COR.verde : COR.vermelho,
                WebkitTextStroke: `2px ${COR.preto}`,
                transform: `scale(${pPal})`,
                display: 'inline-block',
              }}
            >
              {ok ? '✓' : '✗'}
            </span>
          </>
        ) : null}
      </span>
    </div>
    <div>para passear.</div>
  </div>
);

/** Ninguém escolheu: começa sorteado e o treino puxa palavras que aparecem nas mesmas frases. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tSort = palavra(B, 'sorteados');
  const tBag = palavra(B, 'bagunça.');
  const tTreino = palavra(B, 'treino');
  const tPux = palavra(B, 'puxadas');
  const tLevei = palavra(B, 'levei', 0);
  const tCach = palavra(B, 'cachorro');
  const tGato = palavra(B, 'gato');
  const tGel = palavra(B, 'geladeira');

  // cada palavra passa por: certo → sorteado → (meio) → certo/longe
  const pos = (w: string): XY => {
    const passo = (de: XY, para: XY, t: number): XY => [mola(frame, t, de[0], para[0]), mola(frame, t, de[1], para[1])];
    const final = w === 'cachorro' ? tCach : w === 'gato' ? tGato : tGel;
    const meio = MEIO[w];
    let p: XY;
    if (frame >= final) p = passo(meio ?? SORTEADO[w], CERTO[w], final);
    else if (meio && frame >= tPux) p = passo(SORTEADO[w], meio, tPux);
    else p = passo(FIM_MAPA[w], SORTEADO[w], tSort - 4);
    // bagunça: tremidinha enquanto está sorteado
    const treme = frame > tSort && frame < tPux ? Math.sin(frame * 0.9 + w.length) * 5 * (1 - lin(frame, tBag + 20, tPux)) : 0;
    return [p[0] + treme, p[1] - treme];
  };

  const vez = frame >= tGel ? 'geladeira' : frame >= tGato ? 'gato' : frame >= tCach ? 'cachorro' : null;
  const tVez = vez === 'geladeira' ? tGel : vez === 'gato' ? tGato : tCach;

  return (
    <>
      <Som nome="tique" em={tLevei - 4} />
      <Som nome="tique" em={tCach} />
      <Som nome="tique" em={tGato} />
      <Som nome="carimbo" em={tGel + 4} />

      <MapaSemantico
        x={CENTRO_X}
        top={MAPA_MEDIO.top}
        w={MAPA_MEDIO.w}
        h={mola(frame, tTreino - 16, MAPA_GRANDE.h, MAPA_MEDIO.h)}
        pontos={[
          { texto: 'cachorro', x: pos('cachorro')[0], y: pos('cachorro')[1], destaque: vez === 'cachorro' },
          { texto: 'gato', x: pos('gato')[0], y: pos('gato')[1], destaque: vez === 'gato' },
          { texto: 'geladeira', x: pos('geladeira')[0], y: pos('geladeira')[1], destaque: vez === 'geladeira' },
        ]}
      />

      {/* bilhões de frases passando na esteira */}
      {frame >= tTreino - 4 && frame < tLevei
        ? FRASES.map((f, i) => {
            const x = -420 + (frame - tTreino + 4) * 18 - i * 720;
            if (x < -500 || x > 1600) return null;
            return <CaixaToken key={i} texto={f} tamanho={44} x={x} base={ESTEIRA_Y} />;
          })
        : null}

      {frame >= tLevei - 6 ? (
        <Frase
          x={naEsteira(frame, tLevei - 6, CENTRO_X)}
          palavra={vez}
          ok={vez !== 'geladeira'}
          tremor={vez === 'geladeira' ? tranco(frame, tGel + 4) * Math.sin(frame * 2.2) : 0}
          pPal={entra(frame, tVez, 220)}
        />
      ) : null}
    </>
  );
};

export const Treino: CenaEp = {
  Conteudo,
  // mesmo quadro e mesma sala do bloco anterior: a câmera continua de onde parou
  Fundo: fundoMapaContinuo(B),
  planos: () => [
    { de: 0, zoom: 1.04, foco: [CENTRO_X, 760] },
    ABERTO(palavra(B, 'treino') - 2),
    FECHADO(palavra(B, 'levei', 0) + 4, CENTRO_X, 900, 1.15),
    ABERTO(palavra(B, 'gato') - 4),
    FECHADO(palavra(B, 'geladeira') - 2, CENTRO_X, 880, 1.12),
    ABERTO(palavra(B, 'geladeira') + 30),
  ],
};

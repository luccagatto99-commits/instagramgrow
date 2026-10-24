import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FundoPortaria, Som, comEspaco, fileira, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y, CONTORNO } from '../theme';
import { entra, lin, mola, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { CACHORRO, GATO } from './dados';

const B = 0;
const T = 64;
export const [X_GATO, X_CACHORRO] = fileira([comEspaco(GATO.t), comEspaco(CACHORRO.t)], CENTRO_X, T, 70);
const REGUA_Y = 700;

/** Gancho: cachorro e gato viram números distantes. Como ela sabe que são parecidos? */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t169 = palavra(B, '169');
  const tGato = palavra(B, 'gato');
  const t100 = palavra(B, '100');
  const tSao = palavra(B, 'são', 0);
  const tEntao = palavra(B, 'então');

  const xCach = frame < tGato - 6 ? naEsteira(frame, -14, CENTRO_X) : mola(frame, tGato - 6, CENTRO_X, X_CACHORRO);
  const xGato = naEsteira(frame, tGato - 8, X_GATO);

  // régua entre os dois IDs: "números bem distantes"
  const pR = entra(frame, tSao - 2, 140) * (1 - lin(frame, tEntao - 6, tEntao + 2));
  const meio = (X_GATO + X_CACHORRO) / 2;
  const meiaL = ((X_CACHORRO - X_GATO) / 2) * Math.min(1, pR);

  const pQ = lin(frame, tEntao + 4, tEntao + 12);
  const baque = tranco(frame, tEntao + 12);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tGato - 8} />
      <Som nome="carimbo" em={t169} volume={0.4} />
      <Som nome="carimbo" em={t100} volume={0.4} />

      <CaixaToken
        texto={comEspaco(CACHORRO.t)}
        id={frame >= t169 ? CACHORRO.id : undefined}
        idEscala={entra(frame, t169, 220)}
        tamanho={T}
        x={xCach}
        base={ESTEIRA_Y}
        escala={1 - baque * 0.05}
        destaque
      />
      {frame >= tGato - 8 ? (
        <CaixaToken
          texto={comEspaco(GATO.t)}
          id={frame >= t100 ? GATO.id : undefined}
          idEscala={entra(frame, t100, 220)}
          tamanho={T}
          x={xGato}
          base={ESTEIRA_Y}
          escala={1 - baque * 0.05}
          destaque
        />
      ) : null}

      {pR > 0.01 ? (
        <div style={{ opacity: Math.min(1, pR * 1.4) }}>
          <div style={{ position: 'absolute', left: meio - meiaL, top: REGUA_Y - 5, width: meiaL * 2, height: 10, background: COR.preto }} />
          {[-1, 1].map((s) => (
            <div key={s} style={{ position: 'absolute', left: meio + s * meiaL - 5, top: REGUA_Y - 30, width: 10, height: 60, background: COR.preto, borderRadius: 5 }} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: meio,
              top: REGUA_Y - 120,
              transform: `translateX(-50%) scale(${pR})`,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, lineHeight: 1 }}>DIFERENÇA</div>
            <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul, lineHeight: 1.2 }}>
              {(CACHORRO.id - GATO.id).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      ) : null}

      {frame >= tEntao + 4 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: -500 + (420 + 500) * pQ * pQ,
            transform: 'translateX(-50%)',
            fontFamily: FONTE.titulo,
            fontSize: 300,
            lineHeight: 1,
            color: COR.vermelho,
            WebkitTextStroke: `${CONTORNO}px ${COR.preto}`,
          }}
        >
          ?
        </div>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  // a placa da portaria sai antes da régua ocupar o topo
  Fundo: () => {
    const f = useCurrentFrame();
    const sai = lin(f, palavra(B, 'são', 0) - 10, palavra(B, 'são', 0) - 2);
    return <FundoPortaria placa={1 - sai} opacidade={1 - 0.75 * sai} />;
  },
  planos: () => [
    FECHADO(0, CENTRO_X, 880, 1.25),
    ABERTO(palavra(B, 'gato') - 6),
    FECHADO(palavra(B, 'são', 0) - 2, CENTRO_X, 760, 1.12),
    ABERTO(palavra(B, 'então') - 2),
  ],
};

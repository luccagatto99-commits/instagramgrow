import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, AnelMapa, CaixaToken, Destaque, FECHADO, FundoPrateleiras, MapaSemantico, Som, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira } from '../anim';
import { palavra } from './tempo';
import { MAPA_MEDIO } from './Bloco06Treino';

const B = 7;
const ESQ = CENTRO_X - MAPA_MEDIO.w / 2;
const SLOT = [750, 330]; // a primeira que entra vai mais longe
// onde cada pergunta cai no mapa (perto de "cachorro")
const ALVO: [number, number][] = [
  [ESQ + 430, MAPA_MEDIO.top + 120],
  [ESQ + 470, MAPA_MEDIO.top + 200],
];

const Pergunta: React.FC<{ texto: string; x: number; base: number; escala: number }> = ({ texto, x, base, escala }) => (
  <CaixaToken texto={texto} tamanho={36} larguraMax={330} x={x} base={base} escala={escala} destaque={escala > 0.9} />
);

const Veredito: React.FC<{ x: number; texto: string; ok: boolean; p: number }> = ({ x, texto, ok, p }) =>
  p <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 880,
        transform: `translateX(-50%) scale(${p})`,
        fontFamily: FONTE.titulo,
        fontSize: 56,
        lineHeight: 1,
        color: COR.preto,
        whiteSpace: 'nowrap',
      }}
    >
      {texto} <span style={{ color: ok ? COR.verde : COR.vermelho, WebkitTextStroke: `2px ${COR.preto}` }}>{ok ? '✓' : '✗'}</span>
    </div>
  );

/** Frases diferentes, mesmo lugar no mapa: ela compara posições, não letras. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tComo = palavra(B, 'como');
  const tDicas = palavra(B, 'dicas');
  const tDif = palavra(B, 'diferentes');
  const tCaem = palavra(B, 'caem');
  const tRegiao = palavra(B, 'região');
  const tLetras = palavra(B, 'letras.');
  const tPos = palavra(B, 'posições.');

  // 1ª pergunta: entra no centro e abre espaço para a 2ª
  const x1 = frame < tDicas - 6 ? naEsteira(frame, tComo - 6, CENTRO_X) : mola(frame, tDicas - 6, CENTRO_X, SLOT[0]);
  const x2 = naEsteira(frame, tDicas - 6, SLOT[1]);
  const voa = (i: number, xEsteira: number) => {
    const t = tCaem + i * 4;
    return {
      x: mola(frame, t, xEsteira, ALVO[i][0]),
      base: mola(frame, t, ESTEIRA_Y, ALVO[i][1]),
      escala: 1 - 0.68 * lin(frame, t, t + 14),
    };
  };
  const q1 = voa(0, x1);
  const q2 = voa(1, x2);

  return (
    <>
      <Som nome="tique" em={tComo - 6} />
      <Som nome="tique" em={tDicas - 6} />
      <Som nome="tique" em={tCaem + 10} />

      <Destaque de={4} ate={tComo - 10} top={600} tamanho={84}>
        outras palavras,<br />mesma pergunta
      </Destaque>

      {/* aqui as perguntas vêm primeiro; o mapa desce do teto só quando elas vão cair nele */}
      {frame >= tDif - 8 ? (
      <MapaSemantico
        x={CENTRO_X}
        top={MAPA_MEDIO.top}
        w={MAPA_MEDIO.w}
        h={MAPA_MEDIO.h}
        dy={-1000 * (1 - entra(frame, tDif - 8, 110))}
        pontos={[
          { texto: 'cachorro', x: 230, y: 150 },
          { texto: 'gato', x: 300, y: 215, rotulo: 'baixo' },
          { texto: 'geladeira', x: 640, y: 95, rotulo: 'baixo', opacidade: 0.5 },
        ]}
      >
        <AnelMapa x={360} y={175} rx={250} ry={140} p={entra(frame, tRegiao, 150)} rotulo="MESMA REGIÃO" rotuloY={2} />
      </MapaSemantico>
      ) : null}

      {frame >= tComo - 6 ? <Pergunta texto="Como cuidar de um filhote?" {...q1} /> : null}
      {frame >= tDicas - 6 ? <Pergunta texto="Dicas para um cachorro novo" {...q2} /> : null}
      {frame >= tDif && frame < tCaem + 4 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 900,
            transform: `translateX(-50%) scale(${entra(frame, tDif, 170) * (1 - lin(frame, tCaem, tCaem + 4))})`,
            fontFamily: FONTE.titulo,
            fontSize: 72,
            lineHeight: 1,
            color: COR.preto,
          }}
        >
          ≠
        </div>
      ) : null}

      <Veredito x={300} texto="letras" ok={false} p={entra(frame, tLetras - 4, 170)} />
      <Veredito x={720} texto="posições" ok p={entra(frame, tPos - 4, 170)} />
    </>
  );
};

export const Importa: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'como') - 2, CENTRO_X, 900, 1.15),
    ABERTO(palavra(B, 'dicas') - 4),
    FECHADO(palavra(B, 'diferentes') - 2, CENTRO_X, 920, 1.1),
    ABERTO(palavra(B, 'caem') - 2),
    FECHADO(palavra(B, 'região'), CENTRO_X, 700, 1.1),
    ABERTO(palavra(B, 'letras.') - 6),
  ],
};

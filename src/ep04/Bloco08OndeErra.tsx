import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FichaDocumento, FundoPrateleiras, Num, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { lin, mola, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { GRADE, GradeProcessos } from './comum';

const B = 7;
const ETIQUETAS = [
  { t: 'NOMES', p: 'nomes' },
  { t: 'DATAS', p: 'datas' },
  { t: 'NÚMEROS', p: 'números' },
  { t: 'CITAÇÕES', p: 'citações' },
  { t: 'LEIS', p: 'leis.' },
];
// pilha: três embaixo, duas em cima
const LUGAR = [
  { x: 260, base: ESTEIRA_Y },
  { x: 520, base: ESTEIRA_Y },
  { x: 800, base: ESTEIRA_Y },
  { x: 390, base: ESTEIRA_Y - 96 },
  { x: 680, base: ESTEIRA_Y - 96 },
];

/** Lápis de traço que escreve a ficha nova. */
const Lapis: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={70} height={180} viewBox="0 0 70 180" style={{ position: 'absolute', left: x - 10, top: y - 170, transform: 'rotate(28deg)', transformOrigin: '10px 170px' }} fill={COR.branco} stroke={COR.preto} strokeWidth={8} strokeLinejoin="round">
    <rect x={14} y={10} width={42} height={120} rx={6} />
    <path d="M14 130 L35 172 L56 130 Z" />
    <path d="M28 158 L35 172 L42 158 Z" fill={COR.preto} />
  </svg>
);

/** Onde mais erra; e o caso de Nova York de novo: ela escreveu os processos, não encontrou. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNova = palavra(B, 'nova');
  const tEscreveu = palavra(B, 'escreveu');
  const tMultados = palavra(B, 'multados.');

  const saiEtiquetas = segue(frame, tNova - 8, 14);
  const saiGrade = segue(frame, tEscreveu - 10, 14);
  const escreve = lin(frame, tEscreveu, tEscreveu + 45);
  const FICHA_W = 560;

  return (
    <>
      {ETIQUETAS.map((e) => <Som key={e.t} nome="tique" em={palavra(B, e.p)} volume={0.6} />)}
      <Som nome="tique" em={tNova - 4} />
      <Som nome="carimbo" em={tMultados} volume={0.5} />

      {saiEtiquetas < 1400
        ? ETIQUETAS.map((e, i) => {
            const t = palavra(B, e.p) - 2;
            if (frame < t) return null;
            const queda = lin(frame, t, t + 8);
            return (
              <div
                key={e.t}
                style={{
                  position: 'absolute',
                  left: LUGAR[i].x + saiEtiquetas,
                  top: -200 + (LUGAR[i].base + 200) * queda * queda,
                  transform: `translate(-50%, -100%) rotate(${(i % 2 ? 3 : -3) * queda}deg)`,
                  background: COR.vermelho,
                  border: `${CONTORNO}px solid ${COR.preto}`,
                  borderRadius: 18,
                  padding: '14px 26px 10px',
                  fontFamily: FONTE.rotulo,
                  fontWeight: 900,
                  fontSize: 40,
                  letterSpacing: 2,
                  color: COR.preto,
                  whiteSpace: 'nowrap',
                }}
              >
                {e.t}
              </div>
            );
          })
        : null}

      {frame >= tNova + 4 && saiGrade < 1400 ? (
        <GradeProcessos
          carimbo={-200}
          pos={(i) => ({ x: naEsteira(frame, tNova + 4 + i * 2, GRADE[i].x) + saiGrade, base: GRADE[i].base })}
        />
      ) : null}

      {/* ela não buscou: escreveu do zero */}
      {frame >= tEscreveu - 4 ? (
        <>
          <FichaDocumento
            x={CENTRO_X}
            base={860}
            largura={FICHA_W}
            tamanho={44}
            nome="Andrade vs. Aérea Sul"
            numero="nº 2019-0473"
            revela={escreve}
            escala={mola(frame, tEscreveu - 4, 0.7, 1)}
          />
          {escreve < 1 ? <Lapis x={CENTRO_X - FICHA_W / 2 + 40 + escreve * (FICHA_W - 80)} y={720 + Math.sin(frame * 1.3) * 10 + (escreve > 0.6 ? 50 : 0)} /> : null}
        </>
      ) : null}

      <Destaque de={tMultados - 4} top={470} tamanho={64}>
        multa de <Num>US$ 5.000</Num>
      </Destaque>
    </>
  );
};

export const OndeErra: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'nova') - 2, CENTRO_X, 740, 1.06), ABERTO(palavra(B, 'escreveu') - 6), FECHADO(palavra(B, 'escreveu') + 20, CENTRO_X, 780, 1.08), ABERTO(palavra(B, 'multados.') - 6)],
};

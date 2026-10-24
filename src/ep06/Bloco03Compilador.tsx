import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FitaDeNumeros, FolhaCodigo, FundoPrensa, Som, Trecho, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { BYTES, Lixeira, Prensa } from './comum';

const B = 2;
const FITA_X = 210;
const FITA_W = 560;

/** O código legível entra no compilador e sai como números; os nomes vão para o lixo. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCodigo = palavra(B, 'código');
  const tVida = palavra(B, 'vida');
  const tFim = palavra(B, 'fim');
  const tMas = palavra(B, 'mas');
  const tComputador = palavra(B, 'computador');
  const tSem = palavra(B, 'sem');
  const tNomes = palavra(B, 'nomes.');

  const golpe = tranco(frame, tComputador);
  const virou = frame >= tComputador + 3;
  const amarelo = (de: number, ate: number) => (frame >= de && frame < ate ? COR.amarelo : undefined);
  // nomes que saem da folha e voam para a lixeira
  const voo = lin(frame, tNomes - 2, tNomes + 12);
  const nome = (texto: string, x0: number, i: number) => {
    const p = entra(frame, tComputador + 4 + i * 3, 170);
    if (!virou || voo >= 1) return null;
    const x = interpolate(voo, [0, 1], [x0, 860]);
    const y = interpolate(voo, [0, 0.4, 1], [830, 780, 900]);
    return (
      <div key={texto} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p * (1 - voo * 0.8)})`, background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 14, padding: '6px 18px 4px', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 38, color: COR.preto, whiteSpace: 'nowrap' }}>
        {texto}
      </div>
    );
  };

  return (
    <>
      <Som nome="tique" em={tCodigo - 4} />
      <Som nome="tique" em={tMas - 4} />
      <Som nome="guilhotina" em={tComputador} volume={0.5} />
      <Som nome="tique" em={tSem - 2} />
      <Som nome="tique" em={tNomes + 10} />

      <Prensa x={540} top={470} golpe={golpe} nome="COMPILADOR" termo="código → números" curso={110} escala={entra(frame, tMas - 6, 140)} />

      {!virou ? (
        <FolhaCodigo
          x={naEsteira(frame, 0, 540)}
          base={ESTEIRA_Y}
          largura={520}
          tamanho={42}
          linhas={[
            <>se <Trecho fundo={amarelo(tVida, tFim)}>vida</Trecho> = 0:</>,
            <>{'  '}<Trecho fundo={amarelo(tFim, tMas)}>fim_de_jogo</Trecho>()</>,
          ]}
        />
      ) : (
        <FitaDeNumeros x={FITA_X} y={ESTEIRA_Y - 84} largura={FITA_W * entra(frame, tComputador + 3, 160)} valores={BYTES} deslocamento={lin(frame, tComputador, tComputador + 200, 0, 300)} tamanho={44} />
      )}

      {nome('vida', 400, 0)}
      {nome('fim_de_jogo', 620, 1)}
      <Lixeira x={860} base={ESTEIRA_Y} escala={entra(frame, tSem - 4, 160)} tranco={tranco(frame, tNomes + 10)} />
    </>
  );
};

export const Compilador: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 2} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'vida') - 4, 540, 860, 1.08),
    ABERTO(palavra(B, 'mas') - 6),
    FECHADO(palavra(B, 'números,') - 2, 540, 860, 1.06),
  ],
};

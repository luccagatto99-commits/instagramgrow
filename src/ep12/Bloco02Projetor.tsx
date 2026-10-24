import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, Som, type CenaEp } from '../components';
import { lin } from '../anim';
import { palavra } from './tempo';
import { CelularRosto, FeixeIR, ROSTO, TelaCadeado, lentes } from './comum';
import { RostoOuFoto, troca } from './Bloco01Gancho';

const B = 1;

/**
 * Projetor: a foto gira de volta e dá lugar ao rosto. A lente do projetor pisca, o feixe sai e o rosto
 * se enche de pontos. "Você não vê esses pontos": pontos e feixe somem. "O celular vê": voltam.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAlguns = palavra(B, 'alguns');
  const tJoga = palavra(B, 'joga');
  const tRosto = palavra(B, 'rosto');
  const tVoce = palavra(B, 'voce');
  const tO = palavra(B, 'o');

  const sw = troca(frame, 0);
  const giro = sw.antes ? sw.giroSai : sw.giroEntra;
  const some = lin(frame, tVoce, tVoce + 8) * (1 - lin(frame, tO, tO + 8));
  const feixe = lin(frame, tJoga, tJoga + 8) * (1 - some);
  const pontos = lin(frame, tJoga + 6, tRosto + 4) * (1 - some);
  const pisca = frame >= tAlguns && frame < tJoga ? Math.floor((frame - tAlguns) / 6) % 2 === 0 : frame >= tJoga;
  const l = lentes();
  return (
    <>
      <Som nome="chiado" em={tJoga} volume={0.25} />
      <Som nome="tique" em={tO} volume={0.35} />

      <RostoOuFoto id="p-alvo" foto={sw.antes} giro={giro} pontos={pontos} />
      <CelularRosto projetor={pisca}>
        <TelaCadeado />
      </CelularRosto>
      <FeixeIR de={l.projetor} alvo={[ROSTO.x + ROSTO.R * 0.6, ROSTO.y]} altura={ROSTO.R * 2} abre={lin(frame, tJoga, tJoga + 10)} opacidade={feixe} />
    </>
  );
};

export const Projetor: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'alguns'), 700, 720, 1.15), ABERTO(palavra(B, 'joga'))],
  transicao: 0,
};

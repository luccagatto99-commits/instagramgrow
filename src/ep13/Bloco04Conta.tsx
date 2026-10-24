import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, Visto, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { entra, suave } from '../anim';
import { palavra } from './tempo';
import { Cota, PLACA, PlacaLimite, RADAR_A, RADAR_B, Radar, Registro } from './comum';
import { HORA_A, HORA_B, REG_TOP } from './Bloco03Relogio';

const B = 3;

/**
 * A conta: os dois radares e os cartões continuam. "10 quilômetros": cota entre os radares.
 * "Limite de 100": placa no meio. "Mínimo 6 minutos" à esquerda, "você fez em 5" à direita.
 * "Média 120": os cartões de cima dão lugar ao cartão da média, com ✗.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t10 = palavra(B, '10');
  const tLimite = palavra(B, 'limite');
  const tMinimo = palavra(B, 'minimo');
  const tFez = palavra(B, 'fez');
  const t120 = palavra(B, '120');

  const somem = suave(frame, t120 - 14, 8);
  const pCota = frame >= t10 - 4 ? suave(frame, t10 - 4, 14) : 0;
  const pLimite = frame >= tLimite ? entra(frame, tLimite, 170) : 0;
  const pMin = frame >= tMinimo ? entra(frame, tMinimo, 170) : 0;
  const pVoce = frame >= tFez ? entra(frame, tFez, 170) : 0;
  const pMedia = frame >= t120 - 4 ? entra(frame, t120 - 4, 160) : 0;
  const xis = frame >= t120 + 6 ? entra(frame, t120 + 6, 180) : 0;
  return (
    <>
      <Som nome="tique" em={t10 - 4} volume={0.3} />
      <Som nome="tique" em={tLimite} volume={0.3} />
      <Som nome="tique" em={tMinimo} volume={0.3} />
      <Som nome="tique" em={tFez} volume={0.3} />
      <Som nome="carimbo" em={t120 + 6} volume={0.35} />

      <Radar x={RADAR_A} />
      <Radar x={RADAR_B} />
      {somem < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - somem }}>
          <Registro x={RADAR_A} top={REG_TOP} linhas={[PLACA, HORA_A]} />
          <Registro x={RADAR_B} top={REG_TOP} linhas={[PLACA, HORA_B]} />
        </div>
      ) : null}
      <Registro x={CENTRO_X} top={REG_TOP} rotulo="MÉDIA" linhas={['120 km/h']} escala={pMedia} largura={360} />
      <Visto x={CENTRO_X + 240} y={REG_TOP + 90} r={36} ok={false} escala={xis} />

      <PlacaLimite x={CENTRO_X} y={660} r={62} valor={100} escala={pLimite} />
      <Cota x1={RADAR_A} x2={RADAR_B} y={790} texto="10 km" p={pCota} />
      <Registro x={RADAR_A} top={850} rotulo="MÍNIMO" linhas={['6 min']} escala={pMin} largura={220} />
      <Registro x={RADAR_B} top={850} rotulo="VOCÊ" linhas={['5 min']} escala={pVoce} largura={220} />
    </>
  );
};

export const Conta: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

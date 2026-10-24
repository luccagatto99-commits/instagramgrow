import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Rosto3D, Som, type CenaEp } from '../components';
import { lin, suave } from '../anim';
import { palavra } from './tempo';
import { Busto, CelularRosto, FeixeIR, Foto3D, ROSTO, Suporte, TelaCadeado, lentes } from './comum';

const B = 0;

/**
 * Troca no mesmo lugar, como um giro de vitrine: o que está na frente gira de lado (0 → 90°) e o
 * outro chega girando (−90° → 0). Devolve o giro de cada um e qual está à mostra.
 */
export const troca = (frame: number, t: number, dur = 9) => {
  const sai = suave(frame, t, dur);
  const entra = suave(frame, t + dur, dur);
  return { antes: frame < t + dur, giroSai: 90 * sai, giroEntra: -90 * (1 - entra) };
};

/** Rosto de pé (busto) ou foto de pé (suporte), na posição padrão. */
export const RostoOuFoto: React.FC<{ foto: boolean; giro: number; pontos?: number; varre?: number; id: string; x?: number; y?: number; R?: number }> = ({
  foto, giro, pontos = 0, varre = 9, id, x = ROSTO.x, y = ROSTO.y, R = ROSTO.R,
}) =>
  foto ? (
    <>
      <Suporte x={x} de={y + R * 1.5} />
      <Foto3D id={id} x={x} y={y} R={R * 0.95} giro={giro} pontos={pontos} varredura={varre} />
    </>
  ) : (
    <>
      <Busto x={x} yRosto={y} R={R} />
      <Rosto3D id={id} x={x} y={y} R={R} giro={giro} pontos={pontos} varredura={varre} />
    </>
  );

/** Varredura contínua de cima para baixo (linha vermelha). */
export const varrer = (frame: number, periodo = 40) => ((frame % periodo) / periodo) * 2.8 - 1.4;

/**
 * Gancho: o celular lê o rosto (pontos + varredura) e abre (✓). "E por que uma foto": o rosto gira
 * e no lugar chega uma foto de pé; o celular lê, o cadeado treme e fica fechado (✗).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRosto = palavra(B, 'rosto');
  const tE = palavra(B, 'e');
  const tConsegue = palavra(B, 'consegue');
  const tDesb = palavra(B, 'desbloquear');
  const tEm = palavra(B, 'em');

  const sw = troca(frame, tE);
  const foto = !sw.antes;
  const giro = sw.antes ? sw.giroSai : sw.giroEntra;
  const lendo = 1 - lin(frame, tEm, tEm + 8);
  const pontos = sw.antes ? lin(frame, 0, tRosto - 6) * (1 - suave(frame, tE, 6)) : 0;
  const abre = suave(frame, tRosto, 8) * (1 - suave(frame, tE, 6));
  const ok = suave(frame, tRosto + 2, 8) * (1 - suave(frame, tE, 6));
  const xis = suave(frame, tDesb, 8);
  const l = lentes();
  return (
    <>
      <Som nome="chiado" em={0} volume={0.2} />
      <Som nome="ding" em={tRosto} volume={0.4} />
      <Som nome="tique" em={tDesb} volume={0.5} />

      <RostoOuFoto id="g-alvo" foto={foto} giro={giro} pontos={pontos} varre={lendo > 0.5 && Math.abs(giro) < 5 ? varrer(frame) : 9} />
      <CelularRosto>
        <TelaCadeado abre={abre} visto={foto ? xis : ok} ok={!foto} treme={frame >= tConsegue && frame < tDesb + 12 ? 1 : 0} />
      </CelularRosto>
      <FeixeIR de={l.projetor} alvo={[ROSTO.x + ROSTO.R * 0.6, ROSTO.y]} altura={ROSTO.R * 2} opacidade={lendo * (Math.abs(giro) < 30 ? 1 : 0)} />
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  transicao: 0,
};

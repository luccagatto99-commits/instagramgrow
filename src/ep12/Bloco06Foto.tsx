import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Rosto3D, Som, Visto, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { entra, naEsteira, suave } from '../anim';
import { palavra } from './tempo';
import { Busto, FONE, Foto3D, ROSTO, Suporte } from './comum';

const B = 5;
const Y = 735;
const R = 118;

/**
 * A foto não engana: a foto de pé chega ao centro (✗). "Ela é plana": gira de lado e vira uma linha.
 * "Não tem nariz mais perto...": a foto vai para a esquerda e, à direita, a cabeça de verdade (malha)
 * aparece no mesmo ângulo, com nariz e queixo para fora.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEngana = palavra(B, 'engana');
  const tPlana = palavra(B, 'plana');
  const tNao = palavra(B, 'nao', 1);

  // a foto chega ao centro; quando vira linha, vai para a esquerda e a cabeça de verdade aparece à direita
  const lado = suave(frame, tNao - 6, 14);
  const x = naEsteira(frame, -8, CENTRO_X) - (CENTRO_X - ROSTO.x) * lado;
  const giro = suave(frame, tPlana - 4, 16) * 80;
  const xis = frame >= tEngana ? entra(frame, tEngana, 180) : 0;
  const pReal = frame >= tNao ? entra(frame, tNao, 150) : 0;
  return (
    <>
      <Som nome="tique" em={tEngana} volume={0.5} />
      <Som nome="tique" em={tNao} volume={0.35} />

      <Suporte x={x} de={Y + R * 1.5} />
      <Foto3D id="f-foto" x={x} y={Y} R={R} giro={giro} malha={suave(frame, tPlana - 4, 10) * 0.9} />
      <Visto x={x} y={Y - R * 1.95} r={44} ok={false} escala={xis} />
      {pReal > 0.01 ? (
        <>
          <Busto x={FONE.x} yRosto={Y} R={ROSTO.R} opacidade={Math.min(1, pReal)} />
          <Rosto3D id="f-real" x={FONE.x} y={Y} R={ROSTO.R * Math.min(1.05, pReal)} giro={giro} contorno={0} pele={1} malha={1} />
        </>
      ) : null}
    </>
  );
};

export const Foto: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

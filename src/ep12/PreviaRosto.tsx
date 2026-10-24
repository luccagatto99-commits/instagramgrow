import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Rosto3D, ROSTO_ESTRANHO } from '../components';
import { COR } from '../theme';

/** Prévia do Rosto3D em vários modos (só para conferir o desenho). */
export const PreviaRosto: React.FC = () => (
  <AbsoluteFill style={{ background: COR.preto, ['--sombra' as string]: COR.amarelo }}>
    <Rosto3D id="a" x={200} y={260} R={110} giro={0} />
    <Rosto3D id="b" x={540} y={260} R={110} giro={35} />
    <Rosto3D id="c" x={880} y={260} R={110} giro={80} />
    <Rosto3D id="d" x={200} y={700} R={110} giro={-25} pontos={1} />
    <Rosto3D id="e" x={540} y={700} R={110} giro={30} contorno={0} malha={1} pontos={0.6} sombra={false} />
    <Rosto3D id="f" x={880} y={700} R={110} giro={150} contorno={0} malha={1} sombra={false} />
    <Rosto3D id="g" x={200} y={1140} R={110} giro={20} oculos={1} barba={1} />
    <Rosto3D id="h" x={540} y={1140} R={110} giro={10} forma={ROSTO_ESTRANHO} />
    <Rosto3D id="i" x={880} y={1140} R={110} giro={75} plano={1} malha={1} contorno={0.4} />
    <Rosto3D id="j" x={200} y={1580} R={110} giro={0} plano={1} varredura={0.2} />
    <Rosto3D id="k" x={540} y={1580} R={110} giro={-60} incl={10} pontos={1} contorno={0} malha={0.4} sombra={false} />
    <Rosto3D id="l" x={880} y={1580} R={110} giro={20} incl={-12} pontos={1} />
  </AbsoluteFill>
);

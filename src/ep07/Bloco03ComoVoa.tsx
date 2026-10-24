import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, FECHADO, FundoPrensa, Num, RODA_CARRO, SetaVetor, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { ESC_IRONIA, IRONIA_Y } from './Bloco02Ironia';

const B = 2;
export const ESC_CORTE = 1.9;
export const CORTE_Y = ESTEIRA_Y - RODA_CARRO * ESC_CORTE;

/** Etiqueta acima do carro (uma de cada vez, no mesmo lugar). Centro x e y. */
export const Etiqueta: React.FC<{ y: number; p: number; children: React.ReactNode }> = ({ y, p, children }) =>
  p > 0.01 ? (
    <div style={{ position: 'absolute', left: CENTRO_X, top: y, transform: `translate(-50%, -50%) scale(${p})`, background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, padding: '12px 28px 8px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: COR.preto, whiteSpace: 'nowrap' }}>
      {children}
    </div>
  ) : null;

/** Sala de máquinas: ventoinhas grudam (2G), tanques de ar, 10 bicos numerados, tecnologia SpaceX, salta e gira. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tVentoinhas = palavra(B, 'ventoinhas');
  const tGrudam = palavra(B, 'grudam');
  const tGravidade = palavra(B, 'gravidade.');
  const tE = palavra(B, 'e');
  const tJatos = palavra(B, 'jatos');
  const tComprimido = palavra(B, 'comprimido,');
  const tSpacex = palavra(B, 'spacex,');
  const tSaltar = palavra(B, 'saltar');
  const tGirar = palavra(B, 'girar.');

  const esc = mola(frame, 0, ESC_IRONIA, ESC_CORTE);
  const yBase = mola(frame, 0, IRONIA_Y, CORTE_Y);
  const pula = Math.sin(Math.PI * lin(frame, tSaltar - 2, tGirar + 22)) * 150;
  const giro = Math.cos(2 * Math.PI * lin(frame, tGirar - 4, tGirar + 18));

  const forca = entra(frame, tGrudam - 2, 150) * (1 - lin(frame, tE - 8, tE - 2));
  const pAr = entra(frame, tComprimido - 6, 160) * (1 - lin(frame, tSpacex - 8, tSpacex - 3));
  const pSpace = entra(frame, tSpacex - 2, 160) * (1 - lin(frame, tSaltar - 8, tSaltar - 2));
  const g = lin(frame, tGravidade - 6, tGravidade + 10, 0, 2);

  // os 10 bicos acendem em sequência; cada um solta um jato curto
  const numeros = Array.from({ length: 10 }, (_, i) => entra(frame, tJatos - 4 + i * 3, 200));
  const jatos = Array.from({ length: 10 }, (_, i) => {
    const t = tJatos - 4 + i * 3;
    const curto = lin(frame, t, t + 3) * (1 - lin(frame, t + 6, t + 14));
    const salto = i >= 3 && i <= 6 ? lin(frame, tSaltar - 4, tSaltar) * (1 - lin(frame, tSaltar + 8, tSaltar + 16)) : 0;
    return Math.max(curto * 0.7, salto);
  });

  return (
    <>
      <Som nome="tique" em={tVentoinhas - 2} />
      <Som nome="carimbo" em={tGrudam} volume={0.35} />
      {numeros.map((_, i) => <Som key={i} nome="tique" em={tJatos - 4 + i * 3} volume={0.35} />)}
      <Som nome="tique" em={tSpacex - 2} />
      <Som nome="guilhotina" em={tSaltar - 2} volume={0.3} />

      {[CENTRO_X - 170, CENTRO_X + 170].map((x) => (
        <SetaVetor key={x} de={[x, 640]} para={[x, CORTE_Y - 50 * ESC_CORTE + 6]} p={forca} espessura={16} recuo={4} opacidade={Math.min(1, forca)} />
      ))}
      <Etiqueta y={655} p={forca}>
        <span style={{ fontFamily: FONTE.numero, fontWeight: 800, color: COR.azul }}>{g.toFixed(1).replace('.', ',')}G</span>
      </Etiqueta>
      <Etiqueta y={655} p={pAr}>
        AR COMPRIMIDO · <Num>600 L</Num>
      </Etiqueta>
      <Etiqueta y={655} p={pSpace}>TECNOLOGIA SPACEX</Etiqueta>

      <CarroEsportivo
        x={CENTRO_X}
        y={yBase - pula}
        escala={esc}
        giro={giro}
        jatos={jatos}
        numeros={numeros.map((n) => n * (1 - lin(frame, tSaltar - 8, tSaltar - 2)))}
        corte={lin(frame, tComprimido - 6, tComprimido + 2) * (1 - lin(frame, tSaltar - 8, tSaltar - 2))}
        ventoinhas={entra(frame, tVentoinhas - 2, 170) * (1 - lin(frame, tSaltar - 8, tSaltar - 2))}
        giroVentoinha={frame * 40}
        frame={frame}
      />
    </>
  );
};

export const ComoVoa: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 2} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'ventoinhas') - 4, 540, 900, 1.08), ABERTO(palavra(B, 'grudam') - 4), ABERTO(palavra(B, 'saltar') - 6)],
  transicao: 0,
};

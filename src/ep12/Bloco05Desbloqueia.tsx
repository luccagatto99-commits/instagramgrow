import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Cofre, Som, Visto, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, naEsteira, segue, suave } from '../anim';
import { palavra } from './tempo';
import { AGORA, CADASTRO, CelularRosto, FitaAssinatura, TelaCadeado } from './comum';
import { FITA_Y } from './Bloco04Chip';

const B = 4;

/**
 * Portaria: o cofre segue pela esteira; as duas assinaturas estão quase iguais (✓). Elas sobem e somem,
 * o celular chega ao centro e abre. "Se não forem": o cadeado fecha (✗).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tParecidas = palavra(B, 'parecidas');
  const tCelular = palavra(B, 'celular');
  const tDesb = palavra(B, 'desbloqueia');
  const tSe = palavra(B, 'se', 1);
  const tTrancado = palavra(B, 'trancado');

  const ok = frame >= tParecidas ? entra(frame, tParecidas, 180) : 0;
  const somem = suave(frame, tCelular - 8, 10);
  const xFone = frame >= tCelular - 14 ? naEsteira(frame, tCelular - 14, CENTRO_X) : -999;
  const abre = suave(frame, tDesb, 8) * (1 - suave(frame, tSe, 8));
  const visto = suave(frame, tDesb + 2, 8) * (1 - suave(frame, tSe, 6)) + suave(frame, tTrancado, 8);
  return (
    <>
      <Som nome="ding" em={tParecidas} volume={0.35} />
      <Som nome="ding" em={tDesb} volume={0.45} />
      <Som nome="tique" em={tTrancado} volume={0.5} />

      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${segue(frame, 0, 16)}px)` }}>
        <Cofre x={CENTRO_X} base={ESTEIRA_Y} rotulo="CADASTRO" abertura={1} tamanho={190} />
      </div>
      {somem < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - somem, transform: `translateY(${-somem * 40}px)` }}>
          <FitaAssinatura x={CENTRO_X} top={FITA_Y.agora} valores={AGORA} rotulo="ASSINATURA DE AGORA" />
          <FitaAssinatura x={CENTRO_X} top={FITA_Y.cadastro} valores={CADASTRO} rotulo="GUARDADA NO CADASTRO" />
          <Visto x={880} y={(FITA_Y.agora + FITA_Y.cadastro + 76) / 2} r={40} escala={ok} />
        </div>
      ) : null}

      {xFone > -900 ? (
        <CelularRosto x={xFone} escala={0.85} projetor={false}>
          <TelaCadeado abre={abre} visto={visto} ok={frame < tTrancado} />
        </CelularRosto>
      ) : null}
    </>
  );
};

export const Desbloqueia: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

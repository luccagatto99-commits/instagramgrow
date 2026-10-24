import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Cofre, Rosto3D, Som, type CenaEp } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, naEsteira, segue, suave, tranco } from '../anim';
import { palavra } from './tempo';
import { AGORA, CADASTRO, ChipIA, FitaAssinatura } from './comum';

const B = 3;
export const FITA_Y = { agora: 490, cadastro: 660 };

/**
 * Chip de IA: o chip chega pela esteira; a cabeça em malha chega atrás dele e entra. O chip pisca e a
 * assinatura (4 números) aparece no alto. O chip segue, o cofre do cadastro chega, abre e mostra a
 * assinatura guardada, logo abaixo, para comparar.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEntra = palavra(B, 'entra');
  const tTransforma = palavra(B, 'transforma');
  const tNumeros = palavra(B, 'numeros');
  const tCompara = palavra(B, 'compara');
  const tGuardada = palavra(B, 'guardada');

  const xChip = naEsteira(frame, -8, CENTRO_X) + segue(frame, tCompara - 6, 16);
  const pulso = tranco(frame, tTransforma + 10) + tranco(frame, tTransforma + 26);
  const xCabeca = frame < tTransforma ? naEsteira(frame, tEntra - 4, 230) : 230 + suave(frame, tTransforma, 14) * (CENTRO_X - 230);
  const encolhe = 1 - suave(frame, tTransforma + 6, 10);
  const xCofre = frame >= tCompara - 4 ? naEsteira(frame, tCompara - 4, CENTRO_X) : -999;
  const abre = suave(frame, tGuardada - 4, 12);
  const pAgora = frame >= tNumeros - 6 ? entra(frame, tNumeros - 6, 160) : 0;
  const pCad = frame >= tGuardada + 4 ? entra(frame, tGuardada + 4, 160) : 0;
  return (
    <>
      <Som nome="carimbo" em={tTransforma + 10} volume={0.3} />
      <Som nome="carimbo" em={tTransforma + 26} volume={0.3} />
      <Som nome="tique" em={tNumeros - 6} volume={0.4} />
      <Som nome="tique" em={tGuardada + 4} volume={0.4} />

      {encolhe > 0.02 && frame >= tEntra - 4 ? (
        <Rosto3D id="c-cabeca" x={xCabeca} y={ESTEIRA_Y - 95 * encolhe} R={70 * encolhe} giro={frame * 4} contorno={0} pele={1} malha={1} pontos={0.3} />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${pulso * 12}px)` }}>
        <ChipIA x={xChip} base={ESTEIRA_Y} tam={280} pisca={frame >= tTransforma + 8 && frame < tNumeros ? (frame - tTransforma) / 3 : 0} />
      </div>

      {xCofre > -900 ? (
        <Cofre x={xCofre} base={ESTEIRA_Y} rotulo="CADASTRO" abertura={abre} tamanho={190}>
          <div style={{ position: 'absolute', inset: 10, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ height: 14, background: COR.azul, borderRadius: 7, width: `${90 - i * 20}%` }} />)}
          </div>
        </Cofre>
      ) : null}

      <FitaAssinatura x={CENTRO_X} top={FITA_Y.agora} valores={AGORA} rotulo="ASSINATURA DE AGORA" escala={pAgora} />
      <FitaAssinatura x={CENTRO_X} top={FITA_Y.cadastro} valores={CADASTRO} rotulo="GUARDADA NO CADASTRO" escala={pCad} />
    </>
  );
};

export const Chip: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  transicao: 0,
};

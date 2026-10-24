import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, Visto, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Bandeira, CAM_ABERTA, CarroTopo, Cartao, Mapa, Numero, Pino, Rotulo, Y_AV, aTela } from './comum';
import { TransitoAoVivo } from './Bloco03Vermelho';

const B = 3;
export const X_VOCE = 70;

/** Cartão "chegada" acima do carro do espectador. */
export const CartaoChegada: React.FC<{ valor: string; cor?: string; escala: number; treme?: number }> = ({ valor, cor = COR.azul, escala, treme = 0 }) => {
  const [x, y] = aTela(CAM_ABERTA, [X_VOCE, Y_AV]);
  return (
    <Cartao x={x + 190 + treme} top={y - 215} largura={250} escala={escala} origem="0 100%">
      <Rotulo tam={22}>CHEGADA</Rotulo>
      <Numero tam={50} cor={cor}>{valor}</Numero>
    </Cartao>
  );
};

/**
 * A parte difícil: "o trânsito de agora" ganha AO VIVO ✓ (fácil). "Prever": o seu carro entra no
 * começo da avenida (pino VOCÊ) com o cartão CHEGADA ?. "Até chegar no fim da avenida": rota
 * tracejada até a bandeira. "Já mudou": o engarrafamento anda para a frente e o ? treme.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAgora = palavra(B, 'agora');
  const tFacil = palavra(B, 'facil.');
  const tDificil = palavra(B, 'dificil');
  const tPrever = palavra(B, 'prever');
  const tChegar = palavra(B, 'chegar');
  const tFim = palavra(B, 'fim');
  const tMudou = palavra(B, 'mudou.');

  const pAoVivo = frame >= tAgora - 4 ? entra(frame, tAgora - 4, 170) * (1 - suave(frame, tDificil - 8, 8)) : 0;
  const pOk = frame >= tFacil ? entra(frame, tFacil, 180) * (1 - suave(frame, tDificil - 8, 8)) : 0;
  const xVoce = -40 + (X_VOCE + 40) * suave(frame, tDificil - 6, 22);
  const [vx, vy] = aTela(CAM_ABERTA, [X_VOCE, Y_AV - 18]);
  const pVoce = frame >= tDificil + 6 ? entra(frame, tDificil + 6, 180) : 0;
  const pChegada = frame >= tPrever ? entra(frame, tPrever, 170) : 0;
  const pRota = lin(frame, tChegar - 4, tFim + 14);
  const pBandeira = frame >= tFim - 4 ? entra(frame, tFim - 4, 180) : 0;
  const treme = frame >= tMudou && frame < tMudou + 24 ? 8 * Math.sin((frame - tMudou) * 1.8) : 0;
  return (
    <>
      <Som nome="tique" em={tAgora - 4} volume={0.3} />
      <Som nome="ding" em={tFacil} volume={0.3} />
      <Som nome="tique" em={tPrever} volume={0.35} />
      <Som nome="tique" em={tFim - 4} volume={0.3} />
      <Som nome="chiado" em={tMudou - 6} volume={0.18} />

      <Mapa cam={CAM_ABERTA}>
        <TransitoAoVivo b={3} frame={frame} corJam={COR.vermelho} xMin={frame >= tDificil ? xVoce + 50 : undefined} />
        {pRota > 0 ? (
          <line x1={X_VOCE + 30} y1={Y_AV} x2={X_VOCE + 30 + (690 - X_VOCE - 30) * pRota} y2={Y_AV} stroke={COR.preto} strokeWidth={5} strokeDasharray="14 12" />
        ) : null}
        <Bandeira x={712} y={Y_AV - 20} escala={pBandeira} />
        <CarroTopo x={xVoce} y={Y_AV} />
      </Mapa>
      <Etiqueta x={330} top={455} texto="AO VIVO" escala={pAoVivo} />
      <Visto x={500} y={485} r={32} escala={pOk} />
      <Pino x={vx} y={vy} escala={pVoce} rotulo="VOCÊ" tam={56} />
      <CartaoChegada valor="?" escala={pChegada} treme={treme} />
    </>
  );
};

export const Dificil: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};

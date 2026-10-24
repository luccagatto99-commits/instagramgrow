import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, suave } from '../anim';
import { palavra } from './tempo';
import { CAM_ABERTA, Cartao, CarrosDaVia, LARANJA, Mapa, Numero, RUAS, Rotulo, Trecho, Y_AV, aTela, simula, trechoLento } from './comum';
import { AO_VIVO, absAoVivo, fatorAoVivoAv, livre } from './trafego';

const B = 2;

/** Mapa ao vivo (blocos 3 e 4): ruas verdes, trecho engarrafado na cor dada e os carros com celular. */
export const TransitoAoVivo: React.FC<{ b: 2 | 3; frame: number; corJam: string | null; largura?: number; xMin?: number }> = ({ b, frame, corJam, largura = 32, xMin }) => {
  const fSim = absAoVivo(b, frame);
  const eAv = simula(AO_VIVO.av, fSim, fatorAoVivoAv);
  const jam = trechoLento(AO_VIVO.av, eAv, corJam === LARANJA ? 0.6 : 0.4);
  return (
    <>
      {Object.values(RUAS).map((pts, i) => (
        <Trecho key={i} pts={pts} cor={COR.verde} largura={largura} />
      ))}
      {corJam && jam ? <Trecho pts={[[jam[0], Y_AV], [jam[1], Y_AV]]} cor={corJam} largura={largura} /> : null}
      {(['r1', 'r2', 'v1', 'v2', 'v3'] as const).map((k) => (
        <CarrosDaVia key={k} via={AO_VIVO[k]} estado={simula(AO_VIVO[k], fSim, livre)} celular={1} />
      ))}
      <CarrosDaVia via={AO_VIVO.av} estado={eAv} celular={1} xMin={xMin} />
    </>
  );
};

/**
 * Vermelho: mapa aberto, todos os carros com o celular (ponto verde = rápido). Em "devagar" a avenida
 * engarrafa e os pontos ficam laranja/vermelhos; "mesmo pedaço": moldura tracejada no trecho; o
 * cartão da velocidade média cai 60 → 25 → 8 km/h. "Laranja" e "vermelha": o trecho muda de cor.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tDevagar = palavra(B, 'devagar');
  const tMesmo = palavra(B, 'mesmo');
  const tParado = palavra(B, 'parado.');
  const tLaranja = palavra(B, 'laranja,');
  const tVermelha = palavra(B, 'vermelha.');

  const corJam = frame < tLaranja ? null : frame < tVermelha ? LARANJA : COR.vermelho;
  const media = interpolate(frame, [tDevagar, tParado, tLaranja, tVermelha], [60, 25, 18, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pMedia = frame >= tDevagar - 6 ? entra(frame, tDevagar - 6, 170) : 0;
  const pMoldura = suave(frame, tMesmo - 4, 16);
  const [mx1, my1] = aTela(CAM_ABERTA, [235, Y_AV - 44]);
  const [mx2, my2] = aTela(CAM_ABERTA, [585, Y_AV + 44]);
  return (
    <>
      <Som nome="tique" em={tDevagar - 6} volume={0.3} />
      <Som nome="tique" em={tMesmo - 4} volume={0.3} />
      <Som nome="tique" em={tLaranja} volume={0.35} />
      <Som nome="carimbo" em={tVermelha} volume={0.3} />

      <Mapa cam={CAM_ABERTA}>
        <TransitoAoVivo b={2} frame={frame} corJam={corJam} largura={corJam ? 32 + 8 * Math.max(0, 1 - Math.abs(frame - (frame < tVermelha ? tLaranja : tVermelha)) / 6) : 32} />
      </Mapa>
      {pMoldura > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: mx1,
            top: my1,
            width: (mx2 - mx1) * pMoldura,
            height: my2 - my1,
            border: `6px dashed ${COR.preto}`,
            borderRadius: 18,
            boxSizing: 'border-box',
          }}
        />
      ) : null}
      <Cartao x={(mx1 + mx2) / 2} top={my1 - 160} largura={310} escala={pMedia}>
        <Rotulo tam={22}>VELOCIDADE MÉDIA</Rotulo>
        <Numero tam={50}>{Math.round(media)} km/h</Numero>
      </Cartao>
    </>
  );
};

export const Vermelho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

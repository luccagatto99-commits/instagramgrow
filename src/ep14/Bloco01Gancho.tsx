import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, Visto, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { CAM_ABERTA, CarrosDaVia, LARANJA, Lupa, Mapa, Pino, RUAS, Trecho, Y_AV, aTela, misturaCam, simula, trechoLento, type Cam } from './comum';
import { GANCHO, fatorGanchoAv, livre, xSeguido } from './trafego';

const B = 0;
export const ZOOM_SENSOR = 2.4;
/** Câmera que acompanha o carro seguido (blocos 1 e 2). */
export const camSeguido = (fAbs: number): Cam => ({ zoom: ZOOM_SENSOR, foco: [xSeguido(fAbs), Y_AV - 50] });

/** Todas as ruas: verde (livre) e a avenida com o trecho engarrafado por cima. */
export const TransitoGancho: React.FC<{ f: number; corJam: string; pJam?: number; celular?: number; pular?: number[] }> = ({ f, corJam, pJam = 1, celular = 0, pular }) => {
  const jam = trechoLento(GANCHO.av, simula(GANCHO.av, f, fatorGanchoAv));
  return (
  <>
    {Object.values(RUAS).map((pts, i) => (
      <Trecho key={i} pts={pts} cor={COR.verde} />
    ))}
    {jam ? <Trecho pts={[[jam[0] - 30, Y_AV], [jam[1] + 30, Y_AV]]} cor={LARANJA} /> : null}
    {jam ? <Trecho pts={[[jam[0], Y_AV], [jam[1], Y_AV]]} cor={corJam} p={pJam} /> : null}
    {(['r1', 'r2', 'v1', 'v2', 'v3'] as const).map((k) => (
      <CarrosDaVia key={k} via={GANCHO[k]} estado={simula(GANCHO[k], f, livre)} celular={celular} />
    ))}
    <CarrosDaVia via={GANCHO.av} estado={simula(GANCHO.av, f, fatorGanchoAv)} celular={celular} pular={pular} />
  </>
  );
};

/**
 * Gancho: o frame 0 já é o mapa com carros andando e a avenida ficando vermelha. "Google Maps": cai o
 * pino no engarrafamento. "Ninguém instalou sensor": a lupa varre a avenida e acha NENHUM SENSOR (✗).
 * "Em 90 segundos": a câmera mergulha num carro do engarrafamento (o bloco 2 continua dali).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMaps = palavra(B, 'maps');
  const tNinguem = palavra(B, 'ninguem');
  const tNenhum = palavra(B, 'nenhum');
  const tEm = palavra(B, 'em');

  const mergulho = suave(frame, tEm + 4, 70);
  const cam = misturaCam({ zoom: 1 + 0.06 * lin(frame, 0, tEm), foco: CAM_ABERTA.foco }, camSeguido(frame), mergulho);

  const pPino = frame >= tMaps - 4 ? entra(frame, tMaps - 4, 180) : 0;
  const somePino = suave(frame, tEm - 4, 8);
  const [px, py] = aTela(cam, [410, Y_AV - 18]);

  // lupa: entra pela esquerda e varre o trecho engarrafado
  const pLupa = frame >= tNinguem - 6 ? entra(frame, tNinguem - 6, 170) * (1 - suave(frame, tEm - 6, 8)) : 0;
  const xLupaMapa = 180 + 360 * suave(frame, tNinguem - 6, tNenhum - tNinguem + 10);
  const [lx, ly] = aTela(cam, [xLupaMapa, Y_AV]);
  const pNenhum = frame >= tNenhum ? entra(frame, tNenhum, 180) * (1 - suave(frame, tEm - 6, 8)) : 0;
  return (
    <>
      <Som nome="tique" em={tMaps - 4} volume={0.4} />
      <Som nome="chiado" em={tNinguem - 6} volume={0.15} />
      <Som nome="carimbo" em={tNenhum} volume={0.35} />

      <Mapa cam={cam}>
        <TransitoGancho f={frame} corJam={COR.vermelho} pJam={lin(frame, 0, 45)} />
      </Mapa>
      <Pino x={px} y={py} escala={pPino * (1 - somePino)} />
      <Lupa x={lx} y={ly} escala={pLupa} />
      <Etiqueta x={500} top={630} texto="NENHUM SENSOR" cor={COR.vermelho} escala={pNenhum} />
      <Visto x={750} y={660} r={34} ok={false} escala={pNenhum} />
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

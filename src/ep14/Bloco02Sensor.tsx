import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Celular, Som, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, suave } from '../anim';
import { palavra } from './tempo';
import { CarroTopo, Cartao, Mapa, Numero, PinoMini, Rotulo, Y_AV, aTela, corVelocidade, pontoEm, simula, RUAS, comprimento } from './comum';
import { GANCHO, absGancho, carroSeguido, fatorGanchoAv } from './trafego';
import { TransitoGancho, camSeguido } from './Bloco01Gancho';

const B = 1;
const P = COR.preto;

/** Bolinhas de dados subindo dos celulares (envio). */
const Envios: React.FC<{ fAbs: number; f: number; desde: number }> = ({ fAbs, f, desde }) => {
  if (f < desde) return null;
  const e = simula(GANCHO.av, fAbs, fatorGanchoAv);
  const L = comprimento(GANCHO.av.pts);
  return (
    <>
      {e.d.map((d, i) => {
        if (d < 10 || d > L - 10 || i === carroSeguido()) return null;
        const [x, y] = pontoEm(RUAS.av, d);
        const fase = ((f - desde + i * 9) % 26) / 26;
        return <circle key={i} cx={x} cy={y - 66 - fase * 70} r={7} fill={COR.branco} stroke={P} strokeWidth={3} opacity={1 - fase} />;
      })}
    </>
  );
};

/**
 * O sensor: a câmera acompanha um carro do engarrafamento. "Celular": o celular do motorista sai do
 * carro e cresce; "celulares": aparece o celular em todos os carros. "Localização ligada": o botão
 * acende. "Enviam": sai um cartão de dados do celular e bolinhas sobem de todos os outros;
 * o cartão ganha "anônimo", o lugar (pino + coordenadas) e a velocidade.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const f = absGancho(1, frame);
  const tCelular = palavra(B, 'celular');
  const tCelulares = palavra(B, 'celulares');
  const tLigada = palavra(B, 'ligada');
  const tEnviam = palavra(B, 'enviam,');
  const tAnonima = palavra(B, 'anonima,');
  const tOnde = palavra(B, 'onde');
  const tVel = palavra(B, 'velocidade');

  const cam = camSeguido(f);
  const k = carroSeguido();
  const e = simula(GANCHO.av, f, fatorGanchoAv);
  const [xk, yk, ang] = pontoEm(RUAS.av, e.d[k]);
  const [cx, cy] = aTela(cam, [xk, yk]);

  const pCel = frame >= tCelular - 4 ? entra(frame, tCelular - 4, 150) : 0;
  const xCel = cx + (410 - cx) * Math.min(1, pCel);
  const baseCel = cy - 30 + (850 - (cy - 30)) * Math.min(1, pCel);
  const pTodos = frame >= tCelulares ? entra(frame, tCelulares, 170) : 0;
  const ligada = frame >= tLigada;
  const pCartao = frame >= tEnviam ? entra(frame, tEnviam, 150) : 0;
  const voo = suave(frame, tEnviam, 14);
  const linha = (t: number) => (frame >= t ? entra(frame, t, 200) : 0);
  return (
    <>
      <Som nome="tique" em={tCelular - 4} volume={0.45} />
      <Som nome="tique" em={tCelulares} volume={0.3} />
      <Som nome="ding" em={tLigada} volume={0.3} />
      <Som nome="chiado" em={tEnviam} volume={0.15} />
      <Som nome="tique" em={tAnonima} volume={0.3} />
      <Som nome="tique" em={tOnde} volume={0.3} />
      <Som nome="tique" em={tVel} volume={0.3} />

      <Mapa cam={cam}>
        <TransitoGancho f={f} corJam={COR.vermelho} celular={pTodos} pular={[k]} />
        <CarroTopo x={xk} y={yk} ang={ang} />
        <Envios fAbs={f} f={frame} desde={tEnviam} />
      </Mapa>

      {pCel > 0.01 ? (
        <Celular x={xCel} base={baseCel} escala={0.74 * pCel}>
          <PinoMini tam={92} />
          <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 22, letterSpacing: 1, color: P, marginTop: 6 }}>LOCALIZAÇÃO</div>
          <div style={{ width: 96, height: 50, borderRadius: 999, border: `6px solid ${P}`, background: ligada ? COR.verde : '#D9D9D9', position: 'relative', boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', top: 3, left: ligada ? 47 : 3, width: 32, height: 32, borderRadius: 999, background: COR.branco, border: `5px solid ${P}`, boxSizing: 'border-box' }} />
          </div>
        </Celular>
      ) : null}

      <Cartao x={420 + (765 - 420) * voo} top={600 + (500 - 600) * voo} largura={290} escala={pCartao}>
        <Rotulo>ENVIA</Rotulo>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, transform: `scale(${linha(tAnonima)})`, transformOrigin: '0 50%', height: 50 }}>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: '#D9D9D9', border: `5px solid ${P}`, boxSizing: 'border-box', textAlign: 'center', fontSize: 24, lineHeight: '34px' }}>?</div>
          <Rotulo tam={28}>anônimo</Rotulo>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, transform: `scale(${linha(tOnde)})`, transformOrigin: '0 50%', height: 52 }}>
          <PinoMini tam={34} />
          <Numero tam={30}>-23,5 -46,6</Numero>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, transform: `scale(${linha(tVel)})`, transformOrigin: '0 50%', height: 56 }}>
          <Numero tam={44}>12 km/h</Numero>
          <svg width={30} height={30}><circle cx={15} cy={15} r={11} fill={corVelocidade(0.1)} stroke={P} strokeWidth={4} /></svg>
        </div>
      </Cartao>
    </>
  );
};

export const Sensor: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};

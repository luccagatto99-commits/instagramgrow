import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { entra, naEsteira, suave, tranco } from '../anim';
import { palavra } from './tempo';
import { CaixaSinal, MaquinaAnuncios, type Sinal } from './comum';

const B = 3;
export const MAQ_X = 640;
const BOCA_X = MAQ_X - 210 - 20; // onde a caixa some dentro da máquina

/** Caixa que chega pela esteira em `t`, para na frente da boca e entra (some) depois de 22 frames. */
const progressoSinal = (frame: number, t: number) => {
  const x = naEsteira(frame, t, BOCA_X - 120);
  const entraNaMaq = suave(frame, t + 18, 10);
  return { x: x + 140 * entraNaMaq, escala: 1 - entraNaMaq, aceso: frame >= t + 26 ? 1 : 0 };
};

/**
 * "Uma IA que prevê": a máquina de anúncios desce. Cada sinal chega pela esteira na palavra
 * correspondente (curte, onde, sites, pessoas), entra na boca e acende no painel.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tIA = palavra(B, 'ia');
  const tempos: Record<Sinal, number> = {
    curte: palavra(B, 'curte') - 14,
    local: palavra(B, 'onde') - 12,
    sites: palavra(B, 'sites') - 12,
    perto: palavra(B, 'quem') - 12,
  };
  const tipos: Sinal[] = ['curte', 'local', 'sites', 'perto'];
  const pMaq = entra(frame, Math.max(0, tIA - 16), 140);
  const sinais = tipos.map((t) => progressoSinal(frame, tempos[t]));
  const trancos = tipos.reduce((acc, t) => Math.max(acc, tranco(frame, tempos[t] + 24)), 0);
  const ativos = sinais.reduce((n, s) => n + s.aceso, 0);
  return (
    <>
      {tipos.map((t) => (
        <Som key={t} nome="tique" em={tempos[t] + 24} volume={0.35} />
      ))}
      {tipos.map((t, i) =>
        frame >= tempos[t] && sinais[i].escala > 0.02 ? <CaixaSinal key={t} tipo={t} x={sinais[i].x} base={1000} escala={sinais[i].escala} /> : null,
      )}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pMaq) * -1100}px)` }}>
        <MaquinaAnuncios x={MAQ_X} base={1000} acesos={sinais.map((s) => s.aceso)} giro={frame * (1 + ativos) * 1.5} tranco={trancos} />
      </div>
    </>
  );
};

export const Maquina: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

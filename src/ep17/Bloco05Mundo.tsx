import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Carimbo, JanelaNavegador, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { MiniSite } from './comum';

const B = 4;

/** Cartão de agência (sem logo, nome em texto). Centro x, topo. */
const Agencia: React.FC<{ x: number; top: number; pais: string; nome: string; escala: number }> = ({ x, top, pais, nome, escala }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute', left: x, top, transform: `translateX(-50%) scale(${escala})`, width: 300,
        background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA,
        padding: '16px 10px', textAlign: 'center', boxSizing: 'border-box',
      }}
    >
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 2 }}>{pais}</div>
      <div style={{ fontFamily: FONTE.titulo, fontSize: 52, lineHeight: 1.1 }}>{nome}</div>
    </div>
  ) : null;

/**
 * "Vazaram": carimbo VAZOU sobre a ficha da falha. "Agências": EUA (NSA) e Reino Unido (NCSC) com o
 * balão "tira do ar". "Holanda": o site da agência de cibersegurança apaga com FORA DO AR.
 * "Finlândia, França e Dinamarca": três sites apagam, um por nome.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tVaz = palavra(B, 'vazaram');
  const tAg = palavra(B, 'agências');
  const tPed = palavra(B, 'pediram:');
  const tHol = palavra(B, 'holanda');
  const tDesl = palavra(B, 'desligou');
  const tFin = palavra(B, 'finlândia,');
  const tFra = palavra(B, 'frança');
  const tDin = palavra(B, 'dinamarca');

  const fase = (a: number, b: number) => (frame >= a - 6 ? entra(frame, a - 6, 160) : 0) * (1 - suave(frame, b - 8, 8));
  const pFicha = fase(0, tAg);
  const pAg = fase(tAg, tHol);
  const pHol = fase(tHol, tFin);
  const paises = [
    { nome: 'FINLÂNDIA', t: tFin },
    { nome: 'FRANÇA', t: tFra },
    { nome: 'DINAMARCA', t: tDin },
  ];
  return (
    <>
      <Som nome="carimbo" em={tVaz} volume={0.35} />
      <Som nome="carimbo" em={tDesl + 6} volume={0.35} />
      {paises.map((p) => (
        <Som key={p.nome} nome="tique" em={p.t} volume={0.3} />
      ))}

      {pFicha > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute', left: 540, top: 640, transform: `translateX(-50%) scale(${pFicha})`, width: 560,
              background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA,
              padding: '22px 30px', boxSizing: 'border-box',
            }}
          >
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2 }}>DETALHES DA FALHA</div>
            {[90, 70, 82].map((w, i) => (
              <div key={i} style={{ marginTop: 18, height: 16, width: `${w}%`, borderRadius: 8, background: COR.preto }} />
            ))}
          </div>
          {frame >= tVaz - 4 ? <div style={{ opacity: pFicha }}><Carimbo x={600} y={800} texto="VAZOU" em={tVaz} tamanho={70} rot={-10} /></div> : null}
        </>
      ) : null}

      {pAg > 0.01 ? (
        <>
          <Agencia x={350} top={760} pais="EUA" nome="NSA" escala={pAg} />
          <Agencia x={730} top={760} pais="REINO UNIDO" nome="NCSC" escala={frame >= tAg + 12 ? entra(frame, tAg + 12, 170) * (1 - suave(frame, tHol - 8, 8)) : 0} />
          <Balao x={540} base={720} largura={640} tamanho={40} escala={frame >= tPed ? entra(frame, tPed, 170) * (1 - suave(frame, tHol - 8, 8)) : 0}>
            Não dá para atualizar? Tira do ar.
          </Balao>
        </>
      ) : null}

      {pHol > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, pHol) }}>
          <JanelaNavegador x={540} top={640} aba="HOLANDA" largura={700} altura={240} escala={pHol} apagada={frame >= tDesl + 6 ? lin(frame, tDesl + 6, tDesl + 14) : 0}>
            <div style={{ padding: '28px 34px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, color: COR.preto }}>
              Agência de cibersegurança
              <div style={{ marginTop: 18, height: 16, width: '70%', borderRadius: 8, background: COR.preto }} />
            </div>
          </JanelaNavegador>
          {frame >= tDesl + 2 ? <Carimbo x={540} y={880} texto="FORA DO AR" em={tDesl + 6} tamanho={60} rot={-8} /> : null}
        </div>
      ) : null}

      {paises.map((p, i) => {
        const pp = frame >= p.t - 4 ? entra(frame, p.t - 4, 170) : 0;
        if (pp < 0.01) return null;
        const x = 290 + i * 250;
        return (
          <React.Fragment key={p.nome}>
            <MiniSite x={x} top={730} w={200} escala={pp} apagado={lin(frame, p.t + 8, p.t + 16)} />
            <Etiqueta x={x} top={910} texto={p.nome} escala={pp} />
            {frame >= p.t + 8 ? <Carimbo x={x} y={790} texto="OFF" em={p.t + 10} tamanho={40} rot={-10} /> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Mundo: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)] };

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FundoAlerta, MapaSemantico, SetaVetor, Som, larguraCaixa, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, naEsteira, lin, pop, segue } from '../anim';
import { palavra } from './tempo';

const B = 6;
const MAPA = { top: 470, w: 820, h: 360 };
const ESQ = CENTRO_X - MAPA.w / 2;

type XY = [number, number];
const HOMEM: XY = [210, 300];
const MULHER: XY = [300, 130];
const REI: XY = [580, 290];
// rei + (mulher − homem): a mesma seta, partindo do rei
const RAINHA: XY = [REI[0] + MULHER[0] - HOMEM[0], REI[1] + MULHER[1] - HOMEM[1]];

const T = 48;
const OP = 78; // largura de um operador
const CONTA = ['rei', '−', 'homem', '+', 'mulher'];
const larg = CONTA.map((c) => (c.length === 1 ? OP : larguraCaixa(c, T)));
const inicioConta = CENTRO_X - larg.reduce((a, b) => a + b, 0) / 2;
const XS = larg.map((w, i) => inicioConta + larg.slice(0, i).reduce((a, b) => a + b, 0) + w / 2);

/** Virada: rei − homem + mulher ≈ rainha (word2vec, Google, 2013). */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEm = palavra(B, 'em');
  const tPeg = palavra(B, 'pegaram');
  const tRei = palavra(B, 'rei');
  const tHom = palavra(B, 'homem');
  const tMul = palavra(B, 'mulher.');
  const tProx = palavra(B, 'próxima');
  const tRai = palavra(B, 'rainha.');
  const tNing = palavra(B, 'ninguém');
  const tSaiu = palavra(B, 'saiu');

  const aparece = [tRei, tHom, tHom, tMul, tMul];
  const saiConta = segue(frame, tRai - 6, 14);
  const pRainha = entra(frame, tRai, 200);
  const pulso = pop(frame, tNing, 0.12) * pop(frame, tNing + 12, 0.12);

  return (
    <>
      <Som nome="sirene" em={0} duracao={30} volume={0.2} />
      <Som nome="tique" em={tRei} />
      <Som nome="tique" em={tHom} />
      <Som nome="tique" em={tMul} />
      <Som nome="carimbo" em={tRai} volume={0.6} />

      <MapaSemantico
        x={CENTRO_X}
        top={MAPA.top}
        w={MAPA.w}
        h={MAPA.h}
        dx={naEsteira(frame, -6, 0, undefined, -1000)}
        pontos={[
          { texto: 'mulher', ...xy(MULHER), escala: entra(frame, 6, 170), destaque: frame >= tMul && frame < tRai },
          { texto: 'homem', ...xy(HOMEM), rotulo: 'esquerda', escala: entra(frame, 10, 170), destaque: frame >= tHom && frame < tRai },
          { texto: 'rei', ...xy(REI), rotulo: 'esquerda', escala: entra(frame, 14, 170), destaque: frame >= tRei && frame < tRai },
          frame >= tRai
            ? { texto: 'rainha', ...xy(RAINHA), verde: true, destaque: true, escala: pRainha }
            : { texto: 'rainha', ...xy(RAINHA), vazio: true, escala: entra(frame, tProx + 8, 170) },
        ]}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `scale(1)` }}>
          <SetaVetor de={HOMEM} para={MULHER} p={lin(frame, tMul, tMul + 12)} espessura={14 * pulso} />
          <SetaVetor de={REI} para={RAINHA} p={lin(frame, tProx, tProx + 14)} espessura={14 * pulso} />
          {/* o paralelogramo: a mesma relação dos dois lados */}
          <SetaVetor de={HOMEM} para={REI} p={lin(frame, tSaiu, tSaiu + 10)} tracejada semPonta espessura={6} />
          <SetaVetor de={MULHER} para={RAINHA} p={lin(frame, tSaiu + 4, tSaiu + 14)} tracejada semPonta espessura={6} />
        </div>
      </MapaSemantico>

      {/* de onde veio */}
      {frame >= tEm - 2 && frame < tPeg + 4 ? (
        <div
          style={{
            position: 'absolute',
            left: naEsteira(frame, tEm - 4, CENTRO_X) + segue(frame, tPeg - 6, 12),
            top: ESTEIRA_Y - 10,
            transform: 'translate(-50%, -100%)',
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.caixa,
            boxShadow: SOMBRA,
            padding: '20px 34px 16px',
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 38,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
            color: COR.preto,
          }}
        >
          WORD2VEC · GOOGLE · 2013
        </div>
      ) : null}

      {/* a conta, montada enquanto é dita */}
      {saiConta < 1400
        ? CONTA.map((c, i) => {
            if (frame < aparece[i]) return null;
            const p = entra(frame, aparece[i], 200);
            return c.length === 1 ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: XS[i] + saiConta,
                  top: ESTEIRA_Y - 66,
                  transform: `translate(-50%, -50%) scale(${p})`,
                  fontFamily: FONTE.titulo,
                  fontSize: 64,
                  lineHeight: 1,
                  color: COR.preto,
                }}
              >
                {c}
              </div>
            ) : (
              <CaixaToken key={i} texto={c} tamanho={T} x={XS[i] + saiConta} base={ESTEIRA_Y} escala={p} />
            );
          })
        : null}
      {frame >= tRai - 4 ? <CaixaToken texto="rainha" tamanho={72} x={naEsteira(frame, tRai - 6, CENTRO_X)} base={ESTEIRA_Y} verde destaque /> : null}
    </>
  );
};

const xy = (p: XY) => ({ x: p[0], y: p[1] });

export const Virada: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'em') - 2, CENTRO_X, 940, 1.1),
    ABERTO(palavra(B, 'pegaram') - 4),
    FECHADO(palavra(B, 'rainha.') - 2, CENTRO_X, 800, 1.06),
    ABERTO(palavra(B, 'saiu')),
  ],
};

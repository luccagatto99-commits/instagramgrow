import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Num, Som } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Catalogo } from './Catalogo';

const B = 3;
const FRASE = 'oseutextoprecisavirarnumero';

const PALAVRAS_CAT = [
  { t: 'casa', em: ['um', 1] },
  { t: 'casas', em: ['plural,', 0] },
  { t: 'cafofo', em: ['gíria,', 0] },
  { t: 'kasa', em: ['erro', 0] },
  { t: 'casinhaaa', em: ['lista', 0] },
] as const;

/** Nem letras, nem palavras. Uma ideia de cada vez. */
export const Bloco4: React.FC = () => {
  const frame = useCurrentFrame();
  const tDar = palavra(B, 'um', 0);
  const tGigante = palavra(B, 'gigante.');
  const tDar2 = palavra(B, 'um', 1);
  const tAcaba = palavra(B, 'acaba.');

  // ---- parte 1: uma caixa por letra, um trem que não acaba
  const INTERVALO = 5;
  const VEL = 22; // 110 px entre caixas
  const comeco = tDar;
  const parar = tDar2 - 14;
  const nLetras = Math.max(0, Math.floor((Math.min(frame, parar) - comeco) / INTERVALO) + 1);
  const contador = frame < tGigante ? nLetras : Math.round(nLetras + Math.pow(lin(frame, tGigante, parar), 2) * 4800);

  // ---- parte 2: uma entrada por palavra, o catálogo não fecha
  const marcos = PALAVRAS_CAT.map((w) => palavra(B, w.em[0], w.em[1]));
  const atual = marcos.filter((t) => frame >= t).length - 1;
  const pCat = entra(frame, tDar2 - 4, 130);
  const contagem = Math.round(Math.pow(10, lin(frame, tDar2, tAcaba, 0, 6.3)));

  return (
    <>

      {/* parte 1 */}
      <Destaque de={2} ate={parar} tamanho={68}>1 número por letra?</Destaque>
      {frame < tDar2 + 10
        ? Array.from({ length: nLetras }).map((_, i) => {
            const x = -60 + (frame - (comeco + i * INTERVALO)) * VEL;
            if (x > 1300) return null;
            return <CaixaToken key={i} texto={FRASE[FRASE.length - 1 - (i % FRASE.length)]} tamanho={72} x={x} base={ESTEIRA_Y} />;
          })
        : null}
      {Array.from({ length: Math.ceil((parar - comeco) / INTERVALO) }).map((_, i) => (
        <Som key={i} nome="tique" em={comeco + i * INTERVALO} volume={0.25} />
      ))}
      {frame < parar + 8 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 640,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: suave(frame, tDar + 6, 8) * (1 - lin(frame, parar, parar + 8)),
          }}
        >
          <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul, lineHeight: 1 }}>
            {contador.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: COR.preto, marginTop: 8, whiteSpace: 'nowrap' }}>
            NÚMEROS PRA UMA FRASE
          </div>
        </div>
      ) : null}

      {/* parte 2 */}
      <Destaque de={tDar2 - 4} top={480} tamanho={68}>1 número por palavra?</Destaque>
      {frame >= tDar2 - 4 ? (
        <Catalogo x={CENTRO_X} top={600} w={640} h={360} escala={pCat} titulo="LISTA DE PALAVRAS" termo="">
          <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center' }}>
            {atual >= 0 ? (
              <div
                key={atual}
                style={{
                  display: 'inline-block',
                  fontFamily: FONTE.titulo,
                  fontSize: 84,
                  color: COR.preto,
                  transform: `translateX(${(1 - entra(frame, marcos[atual], 170)) * -80}px)`,
                  opacity: Math.min(1, entra(frame, marcos[atual], 170) * 2),
                }}
              >
                {PALAVRAS_CAT[atual].t}
              </div>
            ) : null}
            <div style={{ marginTop: 26 }}>
              <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: COR.preto }}>PALAVRAS: </span>
              <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul }}>
                {frame >= tAcaba ? '∞' : contagem.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </Catalogo>
      ) : null}
    </>
  );
};

export const _num = Num;

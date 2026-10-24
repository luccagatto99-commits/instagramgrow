import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Som, comEspaco, fileira } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { Catalogo } from './Catalogo';
import { CAPITAL, CORACAO, MORANGO } from './dados';

const B = 4;
const PALAVRA = 'casa';
const T = 84;
// Fusões (ilustrativo): cada etapa é uma lista de grupos [início, fim] das letras
const ETAPAS: [number, number][][] = [
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [[0, 1], [2, 2], [3, 3]],
  [[0, 2], [3, 3]],
  [[0, 3]],
];
const texto = (g: [number, number]) => PALAVRA.slice(g[0], g[1] + 1);
const XS = ETAPAS.map((e) => fileira(e.map(texto), CENTRO_X, T, 36));
const centroDe = (k: number, letra: number) => XS[k][ETAPAS[k].findIndex((g) => letra >= g[0] && letra <= g[1])];

// Peças reais do o200k_base mostradas no catálogo
const PECAS = [...CAPITAL, ...CORACAO, ...MORANGO];

/** A solução: pedaços. Letras se fundem; o catálogo do GPT-4o tem ≈ 200 mil. */
export const Bloco5: React.FC = () => {
  const frame = useCurrentFrame();
  const tSolucao = palavra(B, 'saída');
  const tAlgoritmo = palavra(B, 'algoritmo');
  const tTexto = palavra(B, 'texto');
  const tPedaco = palavra(B, 'pedaço');
  const tAparecia = palavra(B, 'aparecia');
  const tGpt = palavra(B, 'GPT-4o');
  const tTem = palavra(B, 'tem');
  const tPedacos = palavra(B, 'mil.');
  const tEles = palavra(B, 'esses');

  const marcos = [0, tAlgoritmo, tTexto, tPedaco];
  const k = marcos.filter((t) => frame >= t).length - 1;
  const sai = segue(frame, tAparecia + 6, 16);

  const pCat = entra(frame, tGpt - 8, 120);
  const catFora = lin(frame, tEles - 4, tEles + 4);
  const contador = Math.round(lin(frame, tTem, tPedacos, 0, 200000));
  const nPecas = Math.floor(lin(frame, tTem, tPedacos, 0, PECAS.length));

  return (
    <>

      <Destaque de={tSolucao} ate={tAparecia + 6}>pedaços de palavra</Destaque>

      {/* letras chegam e se fundem em pedaços */}
      {sai < 1400
        ? ETAPAS[k].map((g, i) => {
            const alvo = XS[k][i];
            const x =
              k === 0
                ? naEsteira(frame, 8 + g[0] * 5, alvo)
                : mola(frame, marcos[k], (centroDe(k - 1, g[0]) + centroDe(k - 1, g[1])) / 2, alvo);
            const novo = k > 0 && g[1] > g[0] && i === 0;
            return (
              <CaixaToken
                key={`${k}-${i}`}
                texto={texto(g)}
                tamanho={T}
                x={x + sai}
                base={ESTEIRA_Y}
                escala={novo ? 0.9 + 0.1 * entra(frame, marcos[k], 200) : 1}
                destaque={novo}
              />
            );
          })
        : null}
      {[0, 1, 2, 3].map((i) => <Som key={i} nome="tique" em={8 + i * 5} volume={0.5} />)}
      {[tAlgoritmo, tTexto, tPedaco].map((t) => <Som key={t} nome="tique" em={t} />)}

      {/* o catálogo de verdade */}
      {frame >= tGpt - 8 && catFora < 1 ? (
        <Catalogo x={CENTRO_X} top={500} w={840} h={440} escala={0.85 + 0.15 * pCat} opacidade={Math.min(1, pCat * 2) * (1 - catFora)}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center' }}>
            <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul }}>≈ {contador.toLocaleString('pt-BR')}</span>
            <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: COR.preto }}> PEDAÇOS</span>
          </div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 120, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {PECAS.slice(0, nPecas).map((p, i) => (
              <div
                key={i}
                style={{
                  border: `6px solid ${COR.preto}`,
                  borderRadius: 14,
                  padding: '2px 14px',
                  fontFamily: FONTE.titulo,
                  fontSize: 40,
                  color: COR.preto,
                  background: COR.branco,
                  whiteSpace: 'pre',
                }}
              >
                {comEspaco(p.t)}
              </div>
            ))}
          </div>
        </Catalogo>
      ) : null}

      {/* o nome do pedaço */}
      <Destaque de={tEles} top={580} tamanho={76}>
        token =<br />pedaço de palavra
      </Destaque>
      {frame >= tEles ? <CaixaToken texto="token" tamanho={T} x={naEsteira(frame, tEles + 4, CENTRO_X)} base={ESTEIRA_Y} destaque /> : null}
    </>
  );
};

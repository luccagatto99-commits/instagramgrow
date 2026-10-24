import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Som, comEspaco, fileira, larguraCaixa } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y, CONTORNO } from '../theme';
import { entra, lin, mola, naEsteira, segue, tranco } from '../anim';
import { palavra } from './tempo';
import { Guilhotina } from './Guilhotina';
import { Catalogo } from './Catalogo';
import { CAPITAL, CORACAO } from './dados';

const B = 5;
export const G_TOP = 560; // topo da cabeça da guilhotina
export const T64 = 64;
export const LINHA1 = ESTEIRA_Y - 175;

/** Layout das 6 caixas de "Qual a capital do Brasil?" em duas fileiras. */
export const layoutCapital = () => {
  const x1 = fileira(CAPITAL.slice(0, 3).map((k) => comEspaco(k.t)), CENTRO_X, T64, 22);
  const x2 = fileira(CAPITAL.slice(3).map((k) => comEspaco(k.t)), CENTRO_X, T64, 22);
  return CAPITAL.map((k, i) => ({ ...k, x: i < 3 ? x1[i] : x2[i - 3], base: i < 3 ? LINHA1 : ESTEIRA_Y }));
};

// "coração" posicionada para o corte c|oração cair sob a lâmina (CENTRO_X)
const T_COR = 84;
const L_COR = larguraCaixa('coração', T_COR);
const CORTE = 10 + Math.round(T_COR * 0.36) + T_COR * 0.64;
const COR_X = CENTRO_X + L_COR / 2 - CORTE;

/** Teste real: "Qual a capital do Brasil?" vira 6 tokens; "coração" vira c + oração. */
export const Bloco6: React.FC = () => {
  const frame = useCurrentFrame();
  const tOficial = palavra(B, 'verdade.');
  const tVira = palavra(B, 'vira', 0);
  const tSeis = palavra(B, '6');
  const tMas = palavra(B, 'agora,');
  const tCoracao = palavra(B, 'coração"');
  const tVira2 = palavra(B, 'vira', 1);
  const tMais = palavra(B, 'oração".', 0) - 12; // corte entre "c" e "oração"
  const tEle = palavra(B, 'ele', 0);
  const tSilaba = palavra(B, 'não');
  const tCorta = palavra(B, 'corta');
  const tOracao = palavra(B, 'conhece.');
  const tSobrou = palavra(B, 'sobrou');

  const golpe1 = tVira + 2;
  const golpe2 = tMais;

  // guilhotina: some enquanto o catálogo mostra a peça, volta para cortar, some no fim
  const escondida = Math.max(
    lin(frame, tMas - 4, tMas + 6) * (1 - lin(frame, tVira2 + 8, golpe2 - 4)),
    lin(frame, golpe2 + 14, golpe2 + 24),
  );
  const gDy = -1100 * escondida * escondida;
  const golpe = tranco(frame, golpe1) + tranco(frame, golpe2);

  // parte 1
  const capital = layoutCapital();
  const saiCapital = segue(frame, tMas - 8, 16);

  // parte 2
  const corX = naEsteira(frame, tMas, COR_X);
  const cortado = frame >= golpe2 + 3;
  const abre = entra(frame, golpe2 + 3, 160);
  const pCat = entra(frame, tCoracao - 2, 140);
  const catFora = lin(frame, tVira2 + 10, tVira2 + 18);
  const verde = frame >= tOracao;
  const olhos = frame >= tSobrou && frame < tSobrou + 32;
  const balanca = olhos ? Math.sin((frame - tSobrou) * 0.5) * 6 : 0;
  const xC = COR_X - L_COR / 2 + larguraCaixa('c', T_COR) / 2 - abre * 40;
  const xOr = COR_X + L_COR / 2 - larguraCaixa('oração', T_COR) / 2 + abre * 40;
  const risco = lin(frame, tSilaba, tSilaba + 8);

  return (
    <>
      <Som nome="guilhotina" em={golpe1} />
      <Som nome="guilhotina" em={golpe2} />
      <Som nome="tique" em={tOficial - 10} />
      <Som nome="tique" em={tMas} />

      {/* parte 1: a frase chega e é cortada em 6 */}
      {frame < golpe1 + 3 ? (
        <CaixaToken texto="Qual a capital do Brasil?" larguraMax={720} tamanho={72} x={naEsteira(frame, tOficial - 10, CENTRO_X)} base={ESTEIRA_Y} destaque />
      ) : saiCapital < 1400 ? (
        capital.map((k, i) => (
          <CaixaToken
            key={i}
            texto={comEspaco(k.t)}
            tamanho={T64}
            x={mola(frame, golpe1 + 3, CENTRO_X + (k.x - CENTRO_X) * 0.7, k.x) + saiCapital}
            base={mola(frame, golpe1 + 3, i < 3 ? ESTEIRA_Y - 90 : ESTEIRA_Y, k.base)}
          />
        ))
      ) : null}
      {frame >= tSeis && frame < tMas - 4 ? (
        <div style={{ position: 'absolute', left: 770, top: 600, textAlign: 'center', transform: `scale(${entra(frame, tSeis)})` }}>
          <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul, lineHeight: 1 }}>6</div>
          <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: COR.preto }}>TOKENS</div>
        </div>
      ) : null}

      {/* parte 2: coração */}
      {frame >= tMas && !cortado ? <CaixaToken texto="coração" tamanho={T_COR} x={corX} base={ESTEIRA_Y} destaque /> : null}
      {cortado ? (
        <>
          <CaixaToken texto={olhos ? <div style={{ paddingTop: 30 }}>{CORACAO[0].t}</div> : CORACAO[0].t} tamanho={T_COR} x={xC} base={ESTEIRA_Y} rot={balanca}>
            {olhos ? (
              <div style={{ position: 'absolute', left: 0, right: 0, top: 14, display: 'flex', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: COR.preto }} />
                <div style={{ width: 18, height: 18, borderRadius: 9, background: COR.preto }} />
              </div>
            ) : null}
          </CaixaToken>
          <CaixaToken texto={CORACAO[1].t} tamanho={T_COR} x={xOr} base={ESTEIRA_Y} verde={verde} destaque={verde} />
        </>
      ) : null}

      {/* o catálogo já tem "oração" */}
      {frame >= tCoracao - 2 && catFora < 1 ? (
        <Catalogo x={CENTRO_X} top={540} w={700} h={280} escala={0.85 + 0.15 * pCat} opacidade={Math.min(1, pCat * 2) * (1 - catFora)}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                border: `${CONTORNO}px solid ${COR.preto}`,
                borderRadius: 20,
                padding: '6px 28px',
                fontFamily: FONTE.titulo,
                fontSize: 72,
                background: frame >= tVira2 ? COR.verde : COR.branco,
                color: COR.preto,
              }}
            >
              oração
            </div>
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: COR.preto, lineHeight: 1.1 }}>
              JÁ<br />CONHECIDA
            </div>
          </div>
        </Catalogo>
      ) : null}

      {/* não é por sílaba */}
      <Destaque de={tSilaba - 4} ate={tOracao + 4} top={580} tamanho={84}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          co · ra · ção
          <span
            style={{
              position: 'absolute',
              left: -16,
              top: '48%',
              height: 16,
              width: `calc(${risco * 100}% + ${risco * 32}px)`,
              background: COR.vermelho,
              border: `4px solid ${COR.preto}`,
              borderRadius: 8,
              transform: 'rotate(-5deg)',
            }}
          />
        </span>
      </Destaque>

      <Guilhotina x={CENTRO_X} top={G_TOP} golpe={golpe} dy={gDy} />
    </>
  );
};

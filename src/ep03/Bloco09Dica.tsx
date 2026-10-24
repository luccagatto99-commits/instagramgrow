import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FichaArquivo, FundoEscritorio, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';

const B = 8;
const DOC = { w: 500, top: 450, h: 540 };
const N = 14;
const COMPR = [0.95, 0.8, 0.9, 0.7, 0.92, 0.85, 0.6, 0.9, 0.78, 0.94, 0.66, 0.88, 0.8, 0.55];
const TRECHOS = [
  { rotulo: 'COMEÇO', de: 0, ate: 3 },
  { rotulo: 'MEIO', de: 4, ate: 9 },
  { rotulo: 'FIM', de: 10, ate: 13 },
];
const linhaY = (i: number) => 40 + i * ((DOC.h - 80) / (N - 1));

/** Dica: em textos longos, o começo e o fim são mais aproveitados; o pedido vai nos dois. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tTextos = palavra(B, 'textos');
  const tComeco = palavra(B, 'começo', 0);
  const tMeio = palavra(B, 'meio.');
  const tEstudo = palavra(B, 'estudo');
  const tEntao = palavra(B, 'então');
  const tComeco2 = palavra(B, 'começo', 1);
  const tFinal = palavra(B, 'final.');

  const dx = naEsteira(frame, tTextos - 8, 0, undefined, -1000);
  const foco = lin(frame, tComeco - 2, tComeco + 8);
  const pFicha = entra(frame, tEstudo - 4, 150);
  const saiFicha = segue(frame, tEntao - 6, 12);
  const esq = CENTRO_X - DOC.w / 2;

  return (
    <>
      <Som nome="tique" em={tTextos - 8} />
      <Som nome="carimbo" em={tEstudo - 4} volume={0.5} />
      <Som nome="tique" em={tComeco2 - 4} />
      <Som nome="tique" em={tFinal - 4} />

      <Destaque de={2} ate={tTextos - 10} top={600} tamanho={84}>
        o cuidado
        <br />
        prático
      </Destaque>

      {frame >= tTextos - 8 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
          <div
            style={{
              position: 'absolute',
              left: esq,
              top: DOC.top,
              width: DOC.w,
              height: DOC.h,
              background: COR.branco,
              border: `${CONTORNO}px solid ${COR.preto}`,
              borderRadius: RAIO.caixa,
              boxShadow: SOMBRA,
              boxSizing: 'border-box',
            }}
          >
            {COMPR.map((c, i) => {
              const noMeio = i >= TRECHOS[1].de && i <= TRECHOS[1].ate;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 36,
                    top: linhaY(i) - 8,
                    width: (DOC.w - 92) * c,
                    height: noMeio ? 14 : 14 + 6 * foco,
                    borderRadius: 8,
                    background: COR.preto,
                    opacity: noMeio ? 1 - 0.8 * foco : 1,
                  }}
                />
              );
            })}
          </div>
          {/* rótulos dos trechos, à esquerda do texto */}
          {TRECHOS.map((tr, i) => {
            const y = DOC.top + (linhaY(tr.de) + linhaY(tr.ate)) / 2;
            const t = i === 0 ? tComeco : i === 2 ? palavra(B, 'fim') : tMeio;
            return (
              <div
                key={tr.rotulo}
                style={{
                  position: 'absolute',
                  right: 1080 - esq + 18,
                  top: y - 18,
                  transform: `scale(${entra(frame, t - 2, 170)})`,
                  transformOrigin: '100% 50%',
                  fontFamily: FONTE.rotulo,
                  fontWeight: 900,
                  fontSize: 30,
                  letterSpacing: 2,
                  color: COR.preto,
                  opacity: i === 1 ? 0.45 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {tr.rotulo}
              </div>
            );
          })}
          {/* o pedido no começo e repetido no fim */}
          {frame >= tComeco2 - 4 ? <CaixaToken texto="SEU PEDIDO" tamanho={44} x={CENTRO_X} base={DOC.top + 120} escala={entra(frame, tComeco2 - 4, 200)} destaque /> : null}
          {frame >= tFinal - 6 ? <CaixaToken texto="SEU PEDIDO" tamanho={44} x={CENTRO_X} base={DOC.top + DOC.h - 22} escala={entra(frame, tFinal - 6, 200)} destaque /> : null}
        </div>
      ) : null}

      {frame >= tEstudo - 4 && saiFicha < 1400 ? (
        <FichaArquivo
          x={CENTRO_X + saiFicha}
          top={580}
          ano="2023"
          titulo="Lost in the Middle"
          detalhes={['STANFORD E OUTROS']}
          largura={640}
          escala={pFicha}
          tamanhoTitulo={56}
        />
      ) : null}
    </>
  );
};

export const Dica: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'começo', 0) - 2, CENTRO_X, 760, 1.06),
    ABERTO(palavra(B, 'estudo') - 4),
    FECHADO(palavra(B, 'coloque') - 2, CENTRO_X, 760, 1.08),
    ABERTO(palavra(B, 'final.') + 4),
  ],
};

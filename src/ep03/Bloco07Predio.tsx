import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FiosAtencao, FundoGalpao, Predio, Som, fileira, useVisivelNoHud, type CenaEp, type Fio } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, pop } from '../anim';
import { palavra } from './tempo';
import { FRASE } from './comum';

const B = 6;

// a mesma frase do bloco da atenção, um pouco mais alta para caber a etiqueta embaixo de "ele"
const T = 48;
const ALT = T * 1.1 + Math.round(T * 0.18) * 2 + 20;
const BASE1 = 720;
const BASE2 = 880;
const X1 = fileira(FRASE.slice(0, 4), CENTRO_X, T, 24);
const X2 = fileira(FRASE.slice(4), CENTRO_X, T, 24);
const PONTA: [number, number][] = [...X1.map((x) => [x, BASE1 - ALT] as [number, number]), ...X2.map((x) => [x, BASE2 - ALT] as [number, number])];
const BASES = [...X1.map(() => BASE1), ...X2.map(() => BASE2)];
const ELE = 4;
const GATO = 1;
const PESO_ELE = [3, 18, 5, 4, 0, 5, 2, 5];

const LARG = 440;
const ALT_ANDAR = 230;

/** As duas etapas, no topo: a que está acontecendo fica acesa. */
const Etapa: React.FC<{ x: number; texto: string; p: number; acesa: number }> = ({ x, texto, p, acesa }) => {
  const vis = useVisivelNoHud();
  if (p <= 0.01) return null;
  return (
    <div
      style={{
        ...vis,
        position: 'absolute',
        left: x,
        top: 455,
        transform: `translateX(-50%) scale(${p * (0.92 + 0.08 * acesa)})`,
        background: acesa > 0.5 ? COR.preto : COR.branco,
        color: acesa > 0.5 ? COR.amarelo : COR.preto,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.placa,
        boxShadow: acesa > 0.5 ? SOMBRA : undefined,
        padding: '14px 26px 10px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
        opacity: 0.45 + 0.55 * acesa,
      }}
    >
      {texto}
    </div>
  );
};

/** Livrinho de traço: a palavra consultando o que foi aprendido no treino. */
const Livro: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) =>
  p <= 0.01 ? null : (
    <svg width={56} height={44} viewBox="0 0 56 44" style={{ position: 'absolute', left: x - 28, top: y - 44, transform: `scale(${p})`, transformOrigin: '50% 100%' }}>
      <path d="M4 6 Q16 0 28 8 Q40 0 52 6 L52 40 Q40 34 28 40 Q16 34 4 40 Z" fill={COR.branco} stroke={COR.preto} strokeWidth={6} strokeLinejoin="round" />
      <line x1={28} y1={8} x2={28} y2={40} stroke={COR.preto} strokeWidth={5} />
    </svg>
  );

/** Por dentro: (1) juntar o contexto, (2) consultar o que aprendeu; as duas formam uma camada; 96 camadas. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tDuas = palavra(B, 'duas', 0);
  const tPrimeiro = palavra(B, 'primeiro');
  const tContexto = palavra(B, 'contexto');
  const tEle = palavra(B, 'ele');
  const tGato = palavra(B, 'gato', 0);
  const tDepois = palavra(B, 'depois');
  const tTodas = palavra(B, 'todas');
  const tExemplo = palavra(B, 'exemplo');
  const tGato2 = palavra(B, 'gato', 1);
  const tAnimal = palavra(B, 'animal');
  const tFoge = palavra(B, 'foge');
  const tMedo = palavra(B, 'medo.');
  const tCamada = palavra(B, 'etapas', 1);
  const tEntende = palavra(B, 'entende');
  const tGpt = palavra(B, 'gpt3');
  const t96 = palavra(B, '96');

  // fases
  const fase1 = lin(frame, tPrimeiro - 6, tPrimeiro) * (1 - lin(frame, tDepois - 4, tDepois + 2));
  const fase2 = lin(frame, tDepois - 4, tDepois + 2);
  const someFrase = lin(frame, tCamada - 8, tCamada);
  const fraseVisivel = frame >= tPrimeiro - 8 && someFrase < 1;

  const xFrase = naEsteira(frame, tPrimeiro - 8, 0, undefined, -1100);
  const pTodos = lin(frame, tContexto - 2, tContexto + 14) * (1 - lin(frame, tEle - 4, tEle + 4));
  const pEle = lin(frame, tEle, tEle + 14) * (1 - lin(frame, tDepois - 4, tDepois + 6));
  const todos: Fio[] = [];
  for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) todos.push({ de: PONTA[a], para: PONTA[b], peso: 3, p: pTodos });
  const doEle: Fio[] = PESO_ELE.map((peso, i) => ({ de: PONTA[ELE], para: PONTA[i], peso, p: pEle })).filter((_, i) => i !== ELE);
  const pTag = entra(frame, tGato, 200);
  const foco = lin(frame, tExemplo - 2, tExemplo + 8); // só "gato" fica aceso
  const pFicha = entra(frame, tGato2 - 4, 150);

  // camadas
  const pPredio = entra(frame, tCamada - 2, 130);
  const n = frame < tGpt - 8
    ? interpolate(frame, [tEntende - 2, tEntende + 24], [1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
    : interpolate(frame, [tGpt - 8, t96 + 6], [3, 96], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const salas = 1 - lin(frame, tEntende - 4, tEntende + 4);
  const etapasP = entra(frame, tDuas, 160) * (1 - lin(frame, tGpt - 10, tGpt - 2));

  return (
    <>
      <Som nome="tique" em={tDuas} />
      <Som nome="tique" em={tPrimeiro - 8} />
      <Som nome="carimbo" em={tGato} volume={0.5} />
      <Som nome="tique" em={tTodas} />
      {[tAnimal, tFoge, tMedo].map((t) => <Som key={t} nome="tique" em={t} volume={0.6} />)}
      <Som nome="carimbo" em={tCamada} volume={0.5} />
      {[0, 6, 11, 15, 18, 21, 23].map((d) => <Som key={`a${d}`} nome="tique" em={tGpt - 8 + d} volume={0.5} />)}

      <Destaque de={0} ate={tDuas - 6} top={620} tamanho={84}>
        por dentro do
        <br />
        Transformer
      </Destaque>

      <Etapa x={318} texto="1 · CONTEXTO" p={etapasP} acesa={frame >= tCamada ? 1 : Math.max(fase1, frame < tPrimeiro ? 1 : 0)} />
      <Etapa x={762} texto="2 · CONSULTA" p={entra(frame, tDuas + 8, 160) * (1 - lin(frame, tGpt - 10, tGpt - 2))} acesa={frame >= tCamada ? 1 : Math.max(fase2, frame < tPrimeiro ? 1 : 0)} />

      {fraseVisivel ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${xFrase}px) scale(${1 - 0.15 * someFrase})`, transformOrigin: '50% 80%', opacity: 1 - someFrase }}>
          <FiosAtencao fios={todos} opacidade={0.5} />
          <FiosAtencao fios={doEle} />
          {FRASE.map((w, i) => {
            const ehGato = i === GATO;
            return (
              <React.Fragment key={i}>
                <CaixaToken
                  texto={w}
                  tamanho={T}
                  x={PONTA[i][0]}
                  base={BASES[i]}
                  destaque={(i === ELE && frame >= tEle && frame < tDepois) || (ehGato && frame >= tExemplo)}
                  escala={pop(frame, tTodas, 0.12) * (ehGato ? pop(frame, tGato2, 0.15) : 1)}
                  opacidade={ehGato ? 1 : 1 - 0.7 * foco}
                />
                <Livro x={PONTA[i][0]} y={PONTA[i][1] - 8} p={entra(frame, tTodas, 200) * (1 - lin(frame, tExemplo - 2, tExemplo + 6))} />
              </React.Fragment>
            );
          })}
          {/* depois da etapa 1, "ele" carrega a informação de que é o gato */}
          {pTag > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: PONTA[ELE][0],
                top: BASE2 + 12,
                transform: `translateX(-50%) scale(${pTag})`,
                transformOrigin: '50% 0%',
                background: COR.preto,
                color: COR.amarelo,
                borderRadius: 14,
                padding: '8px 18px 6px',
                fontFamily: FONTE.titulo,
                fontSize: 34,
                whiteSpace: 'nowrap',
                opacity: 1 - 0.7 * foco,
              }}
            >
              = o gato
            </div>
          ) : null}
          {/* a consulta: o que a IA aprendeu no treino sobre "gato" */}
          {pFicha > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 700,
                top: 560,
                width: 400,
                transform: `translateX(-50%) scale(${pFicha})`,
                transformOrigin: '0% 50%',
                background: COR.branco,
                border: `${CONTORNO}px solid ${COR.preto}`,
                borderRadius: RAIO.caixa,
                boxShadow: SOMBRA,
                overflow: 'hidden',
              }}
            >
              <div style={{ background: COR.preto, color: COR.amarelo, padding: '12px 20px 8px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2 }}>
                APRENDEU NO TREINO
              </div>
              <div style={{ padding: '14px 24px 18px' }}>
                {[
                  { t: tAnimal, txt: 'é um animal' },
                  { t: tFoge, txt: 'foge' },
                  { t: tMedo, txt: 'quando tem medo' },
                ].map((l) => (
                  <div key={l.txt} style={{ fontFamily: FONTE.titulo, fontSize: 40, lineHeight: 1.25, color: COR.preto, opacity: entra(frame, l.t - 2, 170), transform: `translateX(${(1 - Math.min(1, entra(frame, l.t - 2, 170))) * -20}px)` }}>
                    {l.txt}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* uma camada = as duas etapas; empilhadas, viram o prédio */}
      {frame >= tCamada - 2 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pPredio) * 500}px)` }}>
            <Predio x={CENTRO_X} base={ESTEIRA_Y} largura={LARG} altura={540} andares={n} alturaMaxAndar={ALT_ANDAR} />
          </div>
          {salas > 0.01
            ? [
                { x: CENTRO_X - LARG / 4, txt: 'CONTEXTO' },
                { x: CENTRO_X + LARG / 4, txt: 'CONSULTA' },
              ].map((s) => (
                <div
                  key={s.txt}
                  style={{
                    position: 'absolute',
                    left: s.x,
                    top: ESTEIRA_Y - ALT_ANDAR / 2 - 20 + (1 - pPredio) * 500,
                    transform: 'translateX(-50%)',
                    fontFamily: FONTE.rotulo,
                    fontWeight: 900,
                    fontSize: 30,
                    letterSpacing: 2,
                    color: COR.preto,
                    opacity: salas,
                  }}
                >
                  {s.txt}
                </div>
              ))
            : null}
          <div
            style={{
              position: 'absolute',
              left: 870,
              top: 770,
              transform: `translateX(-50%) scale(${entra(frame, tCamada, 170)})`,
              fontFamily: FONTE.rotulo,
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: 2,
              color: COR.preto,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            {frame >= tGpt - 8 ? (
              <>
                GPT-3
                <br />
                CAMADAS
              </>
            ) : (
              <>
                <br />
                CAMADAS
              </>
            )}
          </div>
          <CaixaToken texto={String(Math.round(n))} numero tamanho={56} x={870} base={ESTEIRA_Y} escala={entra(frame, tCamada, 170)} destaque />
        </>
      ) : null}
    </>
  );
};

export const PorDentro: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'gato', 0) - 2, CENTRO_X, 820, 1.08),
    ABERTO(palavra(B, 'depois') - 2),
    FECHADO(palavra(B, 'exemplo') - 2, CENTRO_X, 760, 1.05),
    ABERTO(palavra(B, 'etapas', 1) - 4),
  ],
};

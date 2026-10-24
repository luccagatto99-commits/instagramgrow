import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FundoPrensa, Maquina, OndaDeSom, Som, ampFalada, comEspaco, fileira, type CenaEp } from '../components';
import { COR, CONTORNO, FONTE, RAIO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, mola, naEsteira, pop, segue, tranco } from '../anim';
import { palavra } from './tempo';

const B = 3;
const N = 6; // pedaços de áudio
const POR = 6; // barras por pedaço
const LARG = 106;
const GAP = 18;
// códigos de um codec de áudio (cada pedaço vira um número de 0 a 1023): ilustrativos
export const CODIGOS = [412, 87, 903, 1017, 56, 771];
// "Qual a capital" no o200k_base (gpt-tokenizer)
const TEXTO = [
  { t: 'Qual', id: 16752 },
  { t: ' a', id: 261 },
  { t: ' capital', id: 9029 },
];
const T_TEXTO = 56;

const xPedaco = (k: number, aberto: number) => CENTRO_X + (k - (N - 1) / 2) * (LARG + GAP * aberto);

/** Um pedaço de áudio: barras; depois do corte vira caixa branca com o código em azul. */
const Pedaco: React.FC<{ k: number; x: number; base: number; caixa: number; numero: number; amp: (i: number) => number }> = ({ k, x, base, caixa, numero, amp }) => (
  <div
    style={{
      position: 'absolute',
      left: x - LARG / 2,
      top: base - 190,
      width: LARG,
      height: 190,
      boxSizing: 'border-box',
      background: caixa > 0.5 ? COR.branco : 'transparent',
      border: `${CONTORNO}px solid ${caixa > 0.5 ? COR.preto : 'transparent'}`,
      borderRadius: RAIO.caixa,
    }}
  >
    <OndaDeSom x={LARG / 2 - CONTORNO} y={62} largura={LARG - 2 * CONTORNO - 4} altura={96} n={POR} amp={(i) => amp(k * POR + i)} cor={caixa > 0.5 ? COR.preto : COR.branco} minimo={10} />
    {numero > 0 ? (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 34, color: COR.azul, transform: `scale(${numero})` }}>
        {CODIGOS[k]}
      </div>
    ) : null}
  </div>
);

/** Para a IA, voz não é som: o cortador fatia o áudio em pedaços e cada pedaço vira um número. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCorta = palavra(B, 'corta');
  const tTransforma = palavra(B, 'transforma');
  const tNumeros = palavra(B, 'numeros,');
  const tComo = palavra(B, 'como');
  const tChat = palavra(B, 'chatgpt');

  const chega = naEsteira(frame, 0, 0);
  const golpe = tranco(frame, tCorta);
  const cortado = frame >= tCorta + 3;
  const aberto = cortado ? mola(frame, tCorta + 3, 0, 1) : 0;
  const saiCortador = segue(frame, tTransforma, 16);
  // em "como", o áudio sobe e as palavras entram na esteira
  const sobe = frame >= tComo ? mola(frame, tComo, 0, 1) : 0;
  const baseAudio = ESTEIRA_Y - 200 * sobe;
  const escAudio = 1 - 0.2 * sobe;
  const amp = (i: number) => ampFalada(i, cortado ? tCorta : frame);
  const xsTexto = fileira(TEXTO.map((w) => comEspaco(w.t)), CENTRO_X, T_TEXTO);

  return (
    <>
      <Som nome="tique" em={4} />
      <Som nome="guilhotina" em={tCorta - 5} volume={0.5} />
      {CODIGOS.map((_, k) => <Som key={k} nome="tique" em={tNumeros + k * 4} volume={0.45} />)}
      {TEXTO.map((_, i) => <Som key={`t${i}`} nome="tique" em={tChat + i * 6} volume={0.5} />)}

      {/* lâminas atrás do cortador */}
      {saiCortador < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiCortador}px)` }}>
          {[1, 2, 3, 4, 5].map((j) => (
            <div
              key={j}
              style={{
                position: 'absolute',
                left: (xPedaco(j - 1, 0) + xPedaco(j, 0)) / 2 - 12,
                top: 600 + golpe * 220,
                width: 24,
                height: 120,
                background: COR.branco,
                border: `${CONTORNO * 0.7}px solid ${COR.preto}`,
                borderBottomWidth: 14,
                borderRadius: '6px 6px 3px 3px',
              }}
            />
          ))}
          <Maquina x={180} y={560} w={720} h={100} nome="CORTADOR" termo="codec de áudio" />
        </div>
      ) : null}

      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${chega}px) scale(${escAudio})`, transformOrigin: `${CENTRO_X}px ${baseAudio}px` }}>
        {CODIGOS.map((_, k) => (
          <Pedaco
            key={k}
            k={k}
            x={xPedaco(k, aberto)}
            base={baseAudio}
            caixa={cortado ? 1 : 0}
            numero={frame >= tNumeros + k * 4 ? pop(frame, tNumeros + k * 4, 0.3) : 0}
            amp={amp}
          />
        ))}
      </div>

      {frame >= tChat
        ? TEXTO.map((w, i) => {
            const t = tChat + i * 6;
            if (frame < t - 2) return null;
            return <CaixaToken key={w.t} texto={comEspaco(w.t)} id={w.id} tamanho={T_TEXTO} x={naEsteira(frame, t - 2, xsTexto[i])} base={ESTEIRA_Y} escala={entra(frame, t - 2, 200)} />;
          })
        : null}
    </>
  );
};

export const Numeros: CenaEp = {
  Conteudo,
  Fundo: () => {
    const f = useCurrentFrame();
    return <FundoPrensa giro={f * 0.6} />;
  },
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'corta')), ABERTO(palavra(B, 'como'))],
};

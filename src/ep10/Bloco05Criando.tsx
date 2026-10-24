import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, ContadorPassos, FECHADO, FundoGalpao, QuadroRuido, SetaVetor, Som, comEspaco, fileira, type CenaEp } from '../components';
import { COR, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, pop } from '../anim';
import { palavra } from './tempo';
import { CaixaPrompt, CenaPraia, RotuloHud } from './comum';

const B = 4;
const BASE = ESTEIRA_Y - 10;
const LARG = 340;
const ALT = (LARG * 3) / 4;
const PEDIDO = 'um cachorro na praia';
// gpt-tokenizer, o200k_base (GPT-4o): "um cachorro na praia"
const TOKENS = [
  { t: 'um', id: 394 },
  { t: ' cachorro', id: 168983 },
  { t: ' na', id: 898 },
  { t: ' praia', id: 84887 },
];
const T = 38;
const BASE_TOKENS = 706;
const ETAPAS = 8;
const RODADAS = 30;

/**
 * Criando do zero: o pedido é digitado, vira caixas com IDs (números), e as caixas guiam a limpeza
 * de um quadro que começa só com pontos. A cada etapa o quadro limpa um pouco; "cachorro" e "praia"
 * ganham destaque quando são falados. Em "nunca existiu" a foto nova está nítida.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPede = palavra(B, 'pede');
  const tComecando = palavra(B, 'começando');
  const tVira = palavra(B, 'vira');
  const tGuia = palavra(B, 'guia');
  const tRodada = palavra(B, 'rodada,');
  const tCachorro = palavra(B, 'cachorro');
  const tPraia = palavra(B, 'praia.');
  const tExistiu = palavra(B, 'existiu.', 0, true);

  // pedido digitado
  const letras = Math.floor(lin(frame, tPede - 4, tPede + 30, 0, PEDIDO.length));
  const sobe = frame >= tComecando - 6 ? mola(frame, tComecando - 6, 0, 1) : 0;
  const vira = frame >= tVira ? mola(frame, tVira, 0, 1) : 0;

  // quadro novo, só pontos, desce do alto em "começando"
  const pQuadro = frame >= tComecando ? mola(frame, tComecando, 0, 1) : 0;

  // limpeza em 8 etapas visíveis, de "guia" até "existiu"
  const dur = (tExistiu - 8 - tGuia) / ETAPAS;
  const etapaReal = frame < tGuia ? 0 : Math.min(ETAPAS, (frame - tGuia) / dur);
  const etapa = Math.floor(etapaReal);
  const meia = Math.min(1, (etapaReal - etapa) / 0.35); // cada etapa limpa nos primeiros 35% e segura
  const nivel = 1 - Math.min(ETAPAS, etapa + meia) / ETAPAS;
  const rodada = frame < tRodada ? 1 : Math.max(1, Math.round((Math.min(ETAPAS, etapaReal) / ETAPAS) * RODADAS));
  const tNunca = palavra(B, 'nunca');
  const pronto = frame >= tNunca;

  const xs = fileira(TOKENS.map((w) => comEspaco(w.t)), CENTRO_X, T, 16);
  const destaque = (i: number) => (i === 1 && frame >= tCachorro) || (i === 3 && frame >= tPraia);
  const quando = (i: number) => (i === 1 ? tCachorro : i === 3 ? tPraia : -99);
  const setas = frame >= tGuia ? lin(frame, tGuia, tGuia + 12) : 0;
  const topoQuadro = BASE - ALT;
  return (
    <>
      {Array.from({ length: 6 }).map((_, k) => <Som key={k} nome="tique" em={tPede - 4 + k * 6} volume={0.25} />)}
      <Som nome="chiado" em={tComecando} volume={0.35} />
      {TOKENS.map((_, i) => <Som key={i} nome="carimbo" em={tVira + 6 + i * 4} volume={0.3} />)}
      {Array.from({ length: ETAPAS }).map((_, k) => <Som key={`e${k}`} nome="tique" em={Math.round(tGuia + k * dur)} volume={0.35} />)}
      <Som nome="ding" em={tExistiu - 6} volume={0.5} />

      {frame >= tComecando && frame < tRodada - 4 ? <RotuloHud texto="NENHUMA FOTO AQUI" escala={entra(frame, tComecando, 200)} /> : null}
      {frame >= tRodada - 4 && !pronto ? <ContadorPassos rotulo="RODADA" valor={rodada} escala={entra(frame, tRodada - 4, 200)} /> : null}
      {pronto ? <RotuloHud texto="UMA FOTO QUE NUNCA EXISTIU" escala={entra(frame, tNunca, 200)} /> : null}

      {/* pedido: no centro, sobe para o topo e vira caixas */}
      {vira < 0.5 ? (
        <CaixaPrompt
          x={CENTRO_X}
          top={760 - 150 * sobe}
          texto={PEDIDO.slice(0, letras)}
          cursor={frame % 20 < 12 && vira === 0}
          escala={entra(frame, 0, 170) * (1 - 0.12 * sobe)}
          opacidade={1 - vira * 2}
        />
      ) : null}
      {vira > 0
        ? TOKENS.map((w, i) => (
            <CaixaToken
              key={w.t}
              texto={comEspaco(w.t)}
              id={frame >= tVira + 6 + i * 4 ? w.id : undefined}
              idEscala={pop(frame, tVira + 6 + i * 4, 0.3)}
              tamanho={T}
              x={CENTRO_X + (xs[i] - CENTRO_X) * vira}
              base={BASE_TOKENS}
              opacidade={Math.min(1, vira * 2)}
              destaque={destaque(i)}
              escala={pop(frame, quando(i), 0.18)}
            />
          ))
        : null}

      {setas > 0
        ? TOKENS.map((_, i) => (
            <SetaVetor key={i} de={[xs[i], BASE_TOKENS + 4]} para={[CENTRO_X + (xs[i] - CENTRO_X) * 0.35, topoQuadro + 6]} p={setas} espessura={8} recuo={6} />
          ))
        : null}

      {pQuadro > 0 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pQuadro) * -700}px)` }}>
          <QuadroRuido x={CENTRO_X} base={BASE} largura={LARG} nivel={nivel} semente={5} escala={pop(frame, Math.round(tGuia + etapa * dur), 0.03)}>
            <CenaPraia nova />
          </QuadroRuido>
        </div>
      ) : null}
    </>
  );
};

export const Criando: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'cachorro'), CENTRO_X, 850, 1.1),
    ABERTO(palavra(B, 'em', 0)),
    FECHADO(palavra(B, 'aparece'), CENTRO_X, 860, 1.1),
  ],
};

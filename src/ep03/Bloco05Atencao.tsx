import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FichaArquivo, FiosAtencao, FundoPrateleiras, FundoReuniao, Som, fileira, type CenaEp, type Fio } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, pop, segue } from '../anim';
import { palavra } from './tempo';
import { FRASE } from './comum';
import { TituloTarjado } from './Bloco01Gancho';

const B = 4;
const T = 48;
const ALT = T * 1.1 + Math.round(T * 0.18) * 2 + 20;
const LINHA1 = FRASE.slice(0, 4);
const LINHA2 = FRASE.slice(4);
const BASE1 = ESTEIRA_Y - ALT - 60;
const X1 = fileira(LINHA1, CENTRO_X, T, 24);
const X2 = fileira(LINHA2, CENTRO_X, T, 24);
/** Topo de cada caixa (onde os fios se prendem), na ordem da frase. */
const PONTA: [number, number][] = [...X1.map((x) => [x, BASE1 - ALT] as [number, number]), ...X2.map((x) => [x, ESTEIRA_Y - ALT] as [number, number])];
const ELE = 4;
const GATO = 1;
// quanto "ele" presta atenção em cada palavra (ilustrativo: o mais forte é "gato")
const PESO_ELE = [3, 18, 5, 4, 0, 5, 2, 5];

/** 2017: o artigo; depois a frase inteira de uma vez, cada palavra olhando para as outras. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tArtigo = palavra(B, 'artigo');
  const tAtencao = palavra(B, 'atenção');
  const tIdeia = palavra(B, 'ideia');
  const tTodas = palavra(B, 'todas', 0);
  const tEle = palavra(B, 'ele', 1);
  const tGato = palavra(B, 'gato.');

  const saiFicha = segue(frame, tIdeia - 8, 14);
  const juntas = frame >= tIdeia - 4;
  const xJuntas = naEsteira(frame, tIdeia - 4, 0, undefined, -1100); // todas entram juntas
  const pTodas = lin(frame, tTodas - 4, tTodas + 14);
  const apagaTodas = 1 - 0.75 * lin(frame, tEle - 4, tEle + 6);

  const todas: Fio[] = [];
  for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) todas.push({ de: PONTA[a], para: PONTA[b], peso: 3, p: pTodas });
  const doEle: Fio[] = PESO_ELE.map((peso, i) => ({ de: PONTA[ELE], para: PONTA[i], peso, p: lin(frame, tEle, tEle + 14) })).filter((f, i) => i !== ELE);

  return (
    <>
      <Som nome="carimbo" em={tArtigo - 4} />
      <Som nome="carimbo" em={palavra(B, 'título')} volume={0.5} />
      <Som nome="tique" em={tIdeia - 4} />
      <Som nome="carimbo" em={tGato} volume={0.4} />

      {saiFicha < 1400 ? (
        <>
          <FichaArquivo
            x={CENTRO_X + saiFicha}
            top={470}
            ano="2017"
            marca="google"
            titulo={frame >= palavra(B, 'título') ? 'Attention Is All You Need' : <TituloTarjado />}
            detalhes={['8 AUTORES']}
            largura={820}
            escala={entra(frame, tArtigo - 4, 140) * (frame >= palavra(B, 'título') ? 0.96 + 0.04 * entra(frame, palavra(B, 'título'), 220) : 1)}
          />
          {frame >= tAtencao - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: CENTRO_X + saiFicha,
                top: 840,
                textAlign: 'center',
                lineHeight: 1.1,
                transform: `translateX(-50%) scale(${entra(frame, tAtencao - 2, 160)})`,
                fontFamily: FONTE.titulo,
                fontSize: 50,
                color: COR.preto,
                whiteSpace: 'nowrap',
              }}
            >
              “Atenção é tudo de
              <br />
              que você precisa”
            </div>
          ) : null}
        </>
      ) : null}

      <Destaque de={palavra(B, 'frase', 0) - 2} ate={tTodas - 8} top={470} tamanho={72}>
        tudo de uma vez
      </Destaque>
      <Destaque de={palavra(B, 'chama') - 2} top={470} tamanho={72}>
        isso é atenção
      </Destaque>

      {juntas ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${xJuntas}px)` }}>
          <FiosAtencao fios={todas} opacidade={0.5 * apagaTodas} />
          <FiosAtencao fios={doEle} />
          {FRASE.map((w, i) => (
            <CaixaToken
              key={i}
              texto={w}
              tamanho={T}
              x={PONTA[i][0]}
              base={i < 4 ? BASE1 : ESTEIRA_Y}
              destaque={(i === ELE && frame >= tEle) || (i === GATO && frame >= tGato)}
              escala={i === GATO ? pop(frame, tGato, 0.15) : i === ELE ? pop(frame, tEle, 0.15) : 1}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

export const Atencao: CenaEp = {
  Conteudo,
  Fundo: () => {
    const f = useCurrentFrame();
    return f < palavra(B, 'ideia') - 4 ? <FundoPrateleiras /> : <FundoReuniao ponteiro={f * 0.05} />;
  },
  planos: () => [
    ABERTO(0),
    ABERTO(palavra(B, 'ideia') - 4),
    FECHADO(palavra(B, 'ele', 1) - 2, CENTRO_X, 860, 1.1),
    ABERTO(palavra(B, 'gato.') + 10),
  ],
};

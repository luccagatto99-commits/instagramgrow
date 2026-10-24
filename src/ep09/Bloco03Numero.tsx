import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FundoPrensa, Som, comEspaco, fileira, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, mola, naEsteira, pop } from '../anim';
import { palavra } from './tempo';
import { CartaoAcao } from './comum';

const B = 2;
// "mover o braço" no o200k_base (gpt-tokenizer)
const FRASE = [
  { t: 'm', id: 76 },
  { t: 'over', id: 2898 },
  { t: ' o', id: 293 },
  { t: ' braço', id: 179011 },
];
const T = 52;
// ações: cada movimento vira um número de 0 a 255 (como no RT-2); valores ilustrativos
const ACOES = [
  { icone: 'braco' as const, rotulo: 'MOVER', palavra: 'mover', n: 128 },
  { icone: 'pulso' as const, rotulo: 'GIRAR', palavra: 'girar', n: 91 },
  { icone: 'mao' as const, rotulo: 'FECHAR', palavra: 'fechar', n: 217 },
];
const X_ACAO = [CENTRO_X - 230, CENTRO_X, CENTRO_X + 230];

/** Tudo vira número: a frase ganha IDs; depois braço, pulso e mão viram números, igual a uma frase. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tTudo = 4; // a frase já entra em "Para o ChatGPT"
  const tNumero = palavra(B, 'numero,');
  const tNum = palavra(B, 'num');
  const tNumeros = palavra(B, 'numeros,');
  const tIgual = palavra(B, 'igual');
  const sobe = frame >= tNum ? mola(frame, tNum, 0, 1) : 0;
  const baseFrase = ESTEIRA_Y - 215 * sobe;
  const xs = fileira(FRASE.map((w) => comEspaco(w.t)), CENTRO_X, T);
  const pulso = pop(frame, tIgual, 0.08);
  return (
    <>
      {FRASE.map((_, i) => <Som key={i} nome="carimbo" em={tNumero + i * 4} volume={0.3} />)}
      {ACOES.map((a) => <Som key={a.rotulo} nome="tique" em={palavra(B, a.palavra)} />)}
      {ACOES.map((a, i) => <Som key={`n${a.rotulo}`} nome="carimbo" em={tNumeros + i * 5} volume={0.35} />)}

      {frame >= tTudo ? (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${(1 - 0.18 * sobe) * pulso})`, transformOrigin: `${CENTRO_X}px ${baseFrase}px` }}>
          {FRASE.map((w, i) => (
            <CaixaToken
              key={w.t}
              texto={comEspaco(w.t)}
              id={frame >= tNumero + i * 4 ? w.id : undefined}
              idEscala={pop(frame, tNumero + i * 4, 0.3)}
              tamanho={T}
              x={naEsteira(frame, tTudo + i * 3, xs[i])}
              base={baseFrase}
            />
          ))}
        </div>
      ) : null}

      {ACOES.map((a, i) => {
        const t = palavra(B, a.palavra) - 2;
        if (frame < t) return null;
        const tn = tNumeros + i * 5;
        return (
          <CartaoAcao
            key={a.rotulo}
            x={X_ACAO[i]}
            base={ESTEIRA_Y}
            icone={a.icone}
            rotulo={a.rotulo}
            numero={a.n}
            pNumero={frame >= tn ? pop(frame, tn, 0.3) : 0}
            escala={entra(frame, t, 200) * pulso}
          />
        );
      })}
    </>
  );
};

export const Numero: CenaEp = {
  Conteudo,
  Fundo: () => {
    const f = useCurrentFrame();
    return <FundoPrensa giro={f * 0.6} />;
  },
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'num')), ABERTO(palavra(B, 'cada'))],
};

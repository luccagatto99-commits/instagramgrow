import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, Balao, CaixaToken, FECHADO, FichaArquivo, FundoReuniao, Roleta, Som, ampFalada, larguraCaixa, type CenaEp, type Fatia } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, naEsteira, pop, segue } from '../anim';
import { giroPara } from '../ep04/Bloco04Escreve';
import { palavra } from './tempo';
import { CartaoIcone } from './comum';

const B = 5;
const SILABAS = ['Po', 'de', 'trans', 'fe', 'rir'];
const T_SIL = 46;
// probabilidades ilustrativas do próximo pedaço de som; a mais provável vence
const FATIAS: Fatia[] = [{ peso: 46 }, { peso: 22 }, { peso: 15 }, { peso: 10 }, { peso: 7 }];
const GIRO = 14; // frames de cada giro
const PASSO = 16;

/** Mini onda de traço preto (o pedaço de som) acima da sílaba. */
const MiniOnda: React.FC<{ semente: number }> = ({ semente }) => (
  <svg width={70} height={34} viewBox="0 0 70 34" style={{ display: 'block', margin: '0 auto 4px' }}>
    {Array.from({ length: 6 }).map((_, i) => {
      const h = 8 + ampFalada(i + semente * 6) * 24;
      return <rect key={i} x={i * 12 + 2} y={(34 - h) / 2} width={7} height={h} rx={3.5} fill={COR.preto} />;
    })}
  </svg>
);

/** Falar é prever: a roleta escolhe o próximo pedaço de som e a fila forma "Pode transferir." */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPrevendo = palavra(B, 'prevendo');
  const tVoz = palavra(B, 'voz.', 0, true);
  const tEm = palavra(B, 'em');
  const t2023 = palavra(B, '2023,');
  const t3 = palavra(B, '3');
  const tQualquer = palavra(B, 'qualquer');
  const icones = [
    { icone: 'video' as const, rotulo: 'ENTREVISTA', t: palavra(B, 'entrevista') - 2, x: 300 },
    { icone: 'microfone' as const, rotulo: 'PODCAST', t: palavra(B, 'ou') + 2, x: CENTRO_X },
    { icone: 'audio' as const, rotulo: 'ÁUDIO', t: palavra(B, 'whatsapp.') - 2, x: 780 },
  ];

  // giro i termina em tPrevendo + i*PASSO + GIRO, sempre com a fatia 0 no ponteiro
  const fim = (i: number) => tPrevendo + i * PASSO + GIRO;
  const alvo = (i: number) => (i + 1) * giroPara(FATIAS, 0, 2);
  const i = Math.max(0, Math.min(SILABAS.length - 1, Math.floor((frame - tPrevendo) / PASSO)));
  const giro = interpolate(frame, [fim(i) - GIRO, fim(i)], [i === 0 ? 0 : alvo(i - 1), alvo(i)], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const venceu = frame >= fim(i);
  const saiRoleta = segue(frame, tVoz + 2, 14);
  const saiFila = segue(frame, tEm - 2, 14);
  const saiFicha = segue(frame, palavra(B, 'entrevista') - 14, 12);
  const ws = SILABAS.map((s) => Math.max(larguraCaixa(s, T_SIL), 70 + 2 * Math.round(T_SIL * 0.36) + 20));
  const total = ws.reduce((a, b) => a + b, 0) + 18 * (ws.length - 1);
  const xs = ws.map((w, k) => CENTRO_X - total / 2 + ws.slice(0, k).reduce((a, b) => a + b + 18, 0) + w / 2);

  return (
    <>
      {SILABAS.map((_, k) => <Som key={k} nome="tique" em={fim(k)} volume={0.55} />)}
      <Som nome="carimbo" em={t2023} volume={0.4} />
      <Som nome="tique" em={t3} />
      {icones.map((c) => <Som key={c.rotulo} nome="carimbo" em={c.t + 8} volume={0.35} />)}

      {saiRoleta < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiRoleta}px)` }}>
          <Roleta x={CENTRO_X} y={710} raio={120} fatias={FATIAS} giro={giro} vencedora={venceu ? 0 : undefined} rotulos={false} escala={entra(frame, 6, 150)} />
        </div>
      ) : null}

      {saiFila < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiFila}px)` }}>
          {SILABAS.map((s, k) =>
            frame >= fim(k) - 2 ? (
              <CaixaToken
                key={s}
                texto={
                  <div>
                    <MiniOnda semente={k} />
                    {s}
                  </div>
                }
                tamanho={T_SIL}
                x={xs[k]}
                base={ESTEIRA_Y}
                verde={frame < fim(k) + PASSO && k === i}
                escala={entra(frame, fim(k) - 2, 220)}
              />
            ) : null,
          )}
          {frame >= tVoz + 8 ? (
            <Balao x={CENTRO_X} base={835} largura={640} tamanho={60} escala={entra(frame, tVoz + 8, 170)}>
              “Pode transferir.”
            </Balao>
          ) : null}
        </div>
      ) : null}

      {frame >= t2023 - 2 && saiFicha < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${naEsteira(frame, t2023 - 2, 0) + saiFicha}px)` }}>
          <FichaArquivo
            x={CENTRO_X}
            top={630}
            largura={700}
            ano="2023"
            tamanhoTitulo={58}
            escala={pop(frame, t3, 0.06)}
            titulo={
              <>
                <span style={{ fontFamily: FONTE.numero, fontWeight: 800, color: COR.azul }}>3</span> segundos de áudio
              </>
            }
            detalhes={['MICROSOFT · VALL-E', 'BASTAM PARA IMITAR UMA VOZ']}
          />
        </div>
      ) : null}

      {icones.map((c) => {
        if (frame < c.t) return null;
        const p = entra(frame, c.t, 170);
        return <CartaoIcone key={c.rotulo} x={c.x} base={ESTEIRA_Y} icone={c.icone} rotulo={c.rotulo} dy={(1 - p) * -260} opacidade={Math.min(1, p * 2)} />;
      })}
    </>
  );
};

export const Prever: CenaEp = {
  Conteudo,
  Fundo: () => <FundoReuniao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'prevendo'), CENTRO_X, 760, 1.08), ABERTO(palavra(B, 'em')), ABERTO(palavra(B, 'entrevista'))],
};

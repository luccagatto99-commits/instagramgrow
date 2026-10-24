import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FundoGalpao, ImpressaoDigital, Medidor, OndaDeSom, Som, ampFalada, type CenaEp } from '../components';
import { COR, CONTORNO, FONTE, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue, suave } from '../anim';
import { palavra } from './tempo';

const B = 4;
const MEDIDORES = [
  { rotulo: 'TOM', palavra: 'tom,', valor: 0.62 },
  { rotulo: 'RITMO', palavra: 'ritmo,', valor: 0.44 },
  { rotulo: 'SOTAQUE', palavra: 'sotaque', valor: 0.8 },
  { rotulo: 'RESPIRAÇÃO', palavra: 'respiracao.', valor: 0.33 },
];
const LARG_MED = 178;
const GAP_MED = 16;

/** Trecho curto de gravação: caixa branca com onda e o tempo em azul. */
const Gravacao: React.FC<{ x: number; frame: number }> = ({ x, frame }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 190,
      top: ESTEIRA_Y - 200,
      width: 380,
      height: 200,
      boxSizing: 'border-box',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
    }}
  >
    <OndaDeSom x={180} y={70} largura={320} altura={100} n={18} amp={(i) => ampFalada(i, frame)} cor={COR.preto} minimo={10} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 124, textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 44, color: COR.azul, lineHeight: 1 }}>
      0:0{Math.min(3, Math.floor(frame / 12))}
    </div>
  </div>
);

/** Poucos segundos bastam: medidores de tom, ritmo, sotaque e respiração → impressão digital da voz. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAprende = palavra(B, 'aprende');
  const tImpressao = palavra(B, 'impressao');
  const tVoz = palavra(B, 'voz.', 0, true);
  const saiGravacao = segue(frame, tAprende, 16);
  const saiMedidores = segue(frame, tImpressao - 6, 14);
  const pDigital = entra(frame, tImpressao + 2, 140);
  return (
    <>
      <Som nome="tique" em={4} />
      {MEDIDORES.map((m) => <Som key={m.rotulo} nome="tique" em={palavra(B, m.palavra)} />)}
      <Som nome="carimbo" em={tImpressao + 4} volume={0.4} />

      {saiGravacao < 1200 ? <Gravacao x={naEsteira(frame, 0, CENTRO_X) + saiGravacao} frame={frame} /> : null}

      {saiMedidores < 1200
        ? MEDIDORES.map((m, i) => {
            const t = palavra(B, m.palavra) - 4;
            if (frame < t) return null;
            const desce = suave(frame, t, 10);
            const balanca = Math.sin((frame - t) / 4) * 0.08 * Math.max(0, 1 - (frame - t) / 40);
            const x = CENTRO_X + (i - 1.5) * (LARG_MED + GAP_MED);
            return (
              <div key={m.rotulo} style={{ position: 'absolute', inset: 0, transform: `translateX(${saiMedidores}px)` }}>
                <Medidor
                  x={x}
                  top={700 - (1 - desce) * 120}
                  opacidade={desce}
                  rotulo={m.rotulo}
                  largura={LARG_MED}
                  valor={lin(frame, t + 4, t + 18) * m.valor + balanca}
                />
              </div>
            );
          })
        : null}

      {frame >= tImpressao ? (
        <ImpressaoDigital x={CENTRO_X} top={ESTEIRA_Y - 404} revela={lin(frame, tImpressao + 4, tVoz)} escala={pDigital} rotulo="SUA VOZ" />
      ) : null}
    </>
  );
};

export const Digital: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'tom,')), FECHADO(palavra(B, 'digital'), CENTRO_X, 800, 1.1)],
};

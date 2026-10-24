import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FichaDocumento, FundoPrensa, Roleta, Som, fileira, type CenaEp, type Fatia } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, naEsteira, pop, segue } from '../anim';
import { palavra } from './tempo';

const B = 3;
const FRASE = ['O', 'céu', 'é', 'azul'];
const T = 64;
const XS = fileira(FRASE, CENTRO_X, T, 22);
const FATIAS: Fatia[] = [
  { peso: 6, rotulo: 'azul' },
  { peso: 2, rotulo: 'cinza' },
  { peso: 1.5, rotulo: 'claro' },
  { peso: 1.5, rotulo: 'lindo' },
];
/** Giro que deixa o meio da fatia `i` embaixo do ponteiro (topo), depois de `voltas`. */
export const giroPara = (fatias: Fatia[], i: number, voltas = 3) => {
  const total = fatias.reduce((a, f) => a + f.peso, 0);
  const antes = fatias.slice(0, i).reduce((a, f) => a + f.peso, 0);
  const meio = ((antes + fatias[i].peso / 2) / total) * 360;
  return voltas * 360 - meio;
};

/** Lacuna tracejada do molde do processo, acende quando é falada. */
const Lacuna: React.FC<{ texto: string; p: number }> = ({ texto, p }) => (
  <span
    style={{
      display: 'inline-block',
      border: `5px dashed ${COR.preto}`,
      borderRadius: 10,
      padding: '0 12px',
      margin: '4px 4px',
      background: p > 0.5 ? COR.preto : 'transparent',
      color: p > 0.5 ? COR.amarelo : COR.preto,
      transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI)})`,
    }}
  >
    {texto}
  </span>
);

/** Ela escreve a palavra mais provável; não guarda fatos, aprendeu o formato. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEscreve = palavra(B, 'escreve');
  const tEscolhendo = palavra(B, 'escolhendo');
  const tSeguir = palavra(B, 'seguir.');
  const tConsulta = palavra(B, 'consulta');
  const tAprendeu = palavra(B, 'aprendeu');
  const tFormato = palavra(B, 'formato');
  const tPartes = palavra(B, 'partes');
  const tNumero = palavra(B, 'número');
  const tAno = palavra(B, 'ano.');

  const giro = interpolate(frame, [tEscolhendo - 4, tSeguir + 4], [0, giroPara(FATIAS, 0)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const venceu = frame >= tSeguir + 4;
  const saiRoleta = segue(frame, tConsulta - 8, 14);
  const saiFrase = segue(frame, tFormato - 10, 14);
  const pMolde = entra(frame, tFormato - 6, 140);

  return (
    <>
      {FRASE.slice(0, 3).map((_, i) => <Som key={i} nome="tique" em={tEscreve + i * 5} volume={0.5} />)}
      <Som nome="carimbo" em={tSeguir + 4} volume={0.5} />
      <Som nome="tique" em={tFormato - 6} />

      {saiRoleta < 1400 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiRoleta}px)` }}>
          <Roleta x={CENTRO_X} y={650} raio={150} fatias={FATIAS} giro={giro} vencedora={venceu ? 0 : undefined} escala={entra(frame, tEscolhendo - 8, 150)} />
        </div>
      ) : null}

      {saiFrase < 1400
        ? FRASE.map((w, i) => {
            const t = i < 3 ? tEscreve + i * 5 : tSeguir + 4;
            if (frame < t - 2) return null;
            return <CaixaToken key={w} texto={w} tamanho={T} x={naEsteira(frame, t - 2, XS[i]) + saiFrase} base={ESTEIRA_Y} verde={i === 3} destaque={i === 3} escala={i === 3 ? pop(frame, t, 0.15) : 1} />;
          })
        : null}

      <Destaque de={tConsulta + 8} ate={tAprendeu - 8} top={560} tamanho={68}>
        não consulta
        <br />
        uma lista de fatos
      </Destaque>
      <Destaque de={tAprendeu - 4} ate={tFormato - 10} top={560} tamanho={68}>
        aprendeu como um
        <br />
        texto costuma ser
      </Destaque>

      {/* o molde de um processo: ela conhece muito bem o formato */}
      {frame >= tFormato - 6 ? (
        <FichaDocumento
          x={CENTRO_X}
          base={900}
          largura={720}
          tamanho={46}
          escala={pMolde}
          nome={
            <>
              <Lacuna texto="parte" p={entra(frame, tPartes - 2, 200)} /> vs. <Lacuna texto="parte" p={entra(frame, tPartes + 2, 200)} />
            </>
          }
          numero={
            <span style={{ color: COR.preto }}>
              nº <Lacuna texto="número" p={entra(frame, tNumero - 2, 200)} /> · <Lacuna texto="ano" p={entra(frame, tAno - 2, 200)} />
            </span>
          }
        />
      ) : null}
    </>
  );
};

export const Escreve: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 0.6} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'escolhendo') - 2, CENTRO_X, 700, 1.08),
    ABERTO(palavra(B, 'seguir.') + 2),
    FECHADO(palavra(B, 'formato') - 2, CENTRO_X, 780, 1.06),
  ],
};

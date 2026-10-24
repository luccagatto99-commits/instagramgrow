import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FundoAlerta, OndaDeSom, Som, useTema, useVisivelNoHud, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { PortaFabrica, volumeEm } from './comum';

const B = 2;

/** Etiqueta amarela logo acima da legenda (hud). */
const EtiquetaVoz: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  const tema = useTema();
  if (frame < em) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top: 1078,
        transform: `translateX(-50%) scale(${entra(frame, em, 200)})`,
        background: tema.placa,
        color: tema.placaTexto,
        borderRadius: 16,
        padding: '12px 28px 10px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 3,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...vis,
      }}
    >
      VOZ GERADA POR IA
    </div>
  );
};

/** Virada: a narração deste vídeo também é IA. A onda da própria voz entra na fábrica. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = inicioBloco(B) + frame;
  const tOuvindo = palavra(B, 'ouvindo');
  const tEntao = palavra(B, 'vamos');
  const tDentro = palavra(B, 'dentro');
  const tMaquina = palavra(B, 'maquina.');
  // a onda encolhe para a esquerda; depois entra pela porta
  const encolhe = frame >= tEntao ? mola(frame, tEntao, 0, 1) : 0;
  const entraNaPorta = lin(frame, tMaquina + 4, tMaquina + 22);
  const x = CENTRO_X - 180 * encolhe + 430 * entraNaPorta * entraNaPorta;
  const largura = 700 - 360 * encolhe;
  const n = 34 - 16 * Math.round(encolhe);
  const pPorta = entra(frame, tEntao, 150);
  return (
    <>
      <Som nome="tique" em={tOuvindo} />
      <Som nome="tique" em={tEntao} volume={0.5} />
      <Som nome="guilhotina" em={tDentro} volume={0.3} />

      {frame >= tEntao ? <PortaFabrica x={800} base={ESTEIRA_Y} abre={lin(frame, tDentro, tDentro + 14)} escala={pPorta} /> : null}
      {entraNaPorta < 1 ? (
        <div style={{ position: 'absolute', inset: 0, clipPath: frame > tMaquina ? 'inset(0 395px 0 0)' : undefined }}>
          <OndaDeSom x={x} y={820} largura={largura} altura={300 - 120 * encolhe} n={n} amp={(i) => volumeEm(abs - i * 1.5) * 1.1} cor={COR.branco} />
        </div>
      ) : null}
      <EtiquetaVoz em={tOuvindo} />
    </>
  );
};

export const Virada: CenaEp = {
  Conteudo,
  Fundo: () => <FundoAlerta />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'ouvindo'), CENTRO_X, 800, 1.12), ABERTO(palavra(B, 'vamos'))],
};

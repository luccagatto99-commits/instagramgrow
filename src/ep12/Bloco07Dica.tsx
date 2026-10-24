import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { COR, CENTRO_X } from '../theme';
import { entra, lin, mola, naEsteira, suave } from '../anim';
import { palavra } from './tempo';
import { CelularRosto, Etiqueta, FONE, Foto3D, ROSTO, Suporte, TelaCadeado, TelaSenha } from './comum';

const B = 6;

/**
 * Dica: um celular com só a câmera comum (uma lente, sem projetor) chega ao centro. "Enganados por
 * uma foto": ele vai para a direita, a foto chega à esquerda e o cadeado abre com ✗ vermelho (enganado).
 * "Prefira a senha ou a digital": a foto sai, o celular volta ao centro e mostra a senha e a digital (✓).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMuitos = palavra(B, 'muitos');
  const tComum = palavra(B, 'comum');
  const tEnganados = palavra(B, 'enganados');
  const tFoto = palavra(B, 'foto');
  const tNeles = palavra(B, 'neles');
  const tSenha = palavra(B, 'senha');
  const tDigital = palavra(B, 'digital');

  const chega = frame >= tMuitos - 10 ? naEsteira(frame, tMuitos - 10, CENTRO_X) : -999;
  const paraDireita = frame >= tEnganados - 10 ? mola(frame, tEnganados - 10, 0, FONE.x - CENTRO_X) : 0;
  const volta = frame >= tNeles ? mola(frame, tNeles, 0, CENTRO_X - FONE.x) : 0;
  const xFone = chega + paraDireita + volta;
  const xFoto = frame >= tEnganados - 8 ? naEsteira(frame, tEnganados - 8, ROSTO.x) : -999;
  const fotoSai = suave(frame, tNeles - 4, 10);
  const enganado = frame >= tFoto + 2 && frame < tNeles + 4;
  const abre = suave(frame, tFoto + 2, 8) * (1 - suave(frame, tNeles, 6));
  const senha = frame >= tNeles + 6;
  const pTag = frame >= tComum - 6 ? entra(frame, tComum - 6, 160) * (1 - suave(frame, tNeles - 6, 6)) : 0;
  const pTag2 = frame >= tSenha - 6 ? entra(frame, tSenha - 6, 160) : 0;
  return (
    <>
      <Som nome="tique" em={tComum - 6} volume={0.35} />
      <Som nome="tique" em={tFoto + 2} volume={0.55} />
      <Som nome="ding" em={tDigital + 8} volume={0.4} />

      {xFoto > -900 && fotoSai < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - fotoSai, transform: `scale(${1 - fotoSai * 0.2})`, transformOrigin: `${ROSTO.x}px 1000px` }}>
          <Suporte x={xFoto} de={ROSTO.y + ROSTO.R * 1.5} />
          <Foto3D id="d-foto" x={xFoto} y={ROSTO.y} R={ROSTO.R * 0.95} />
        </div>
      ) : null}

      {chega > -900 ? (
        <CelularRosto x={xFone} comum>
          {senha ? (
            <TelaSenha preenche={lin(frame, tSenha - 2, tSenha + 12, 0, 4.2)} />
          ) : (
            <TelaCadeado abre={abre} visto={enganado ? suave(frame, tFoto + 2, 8) : 0} ok={false} />
          )}
        </CelularRosto>
      ) : null}
      {senha ? <TelaOk x={xFone} p={frame >= tDigital + 8 ? entra(frame, tDigital + 8, 180) : 0} /> : null}

      <Etiqueta x={CENTRO_X} top={480} texto="SÓ CÂMERA COMUM" escala={pTag} />
      <Etiqueta x={CENTRO_X} top={480} texto="SENHA OU DIGITAL" cor={COR.verde} escala={pTag2} />
    </>
  );
};

/** ✓ verde ao lado do celular quando a senha/digital confirma. */
const TelaOk: React.FC<{ x: number; p: number }> = ({ x, p }) =>
  p > 0.01 ? (
    <svg width={110} height={110} viewBox="-55 -55 110 110" style={{ position: 'absolute', left: x + 190 - 55, top: 760 - 55, transform: `scale(${p})`, overflow: 'visible' }}>
      <circle r={44} fill={COR.verde} stroke={COR.preto} strokeWidth={8} />
      <path d="M-20 1 L-5 15 L22 -14" fill="none" stroke={COR.branco} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : null;

export const Dica: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

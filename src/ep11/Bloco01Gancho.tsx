import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FundoGalpao, No3D, Som, type CenaEp } from '../components';
import { COR, CENTRO_X } from '../theme';
import { entra, lin } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { ALTURA_ESTEIRA, CenaPraiaViva, Fabrica3D, Tela3D, cameraPor } from './comum';
import { CaixaPrompt } from '../ep10/comum';

const B = 0;
export const LARG_TELA = 460;

/** Barra de reprodução por cima da imagem (viewBox 400 × 300): deixa claro que é um VÍDEO. */
export const BarraPlay: React.FC<{ p: number }> = ({ p }) => (
  <g>
    <rect x={60} y={268} width={318} height={16} rx={8} fill={COR.branco} stroke={COR.preto} strokeWidth={4} />
    <rect x={62} y={270} width={Math.max(0, 314 * p)} height={12} rx={6} fill={COR.preto} />
    <circle cx={34} cy={276} r={18} fill={COR.branco} stroke={COR.preto} strokeWidth={4} />
    <path d="M28 266 L44 276 L28 286 Z" fill={COR.preto} />
  </g>
);

/**
 * Gancho: a tela (com volume, sobre a esteira 3D) já começa cheia de pontos piscando e a câmera gira
 * em volta. Em "vai limpando" os pontos somem em onda, da esquerda para a direita, e aparece a cena
 * já se mexendo; em "cena que você pediu" surge o pedido escrito.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCria = palavra(B, 'cria');
  const tTela = palavra(B, 'tela');
  const tLimpando = palavra(B, 'limpando');
  const tAparecer = palavra(B, 'aparecer');
  const tCena = palavra(B, 'cena');
  const tPediu = palavra(B, 'pediu.', 0, true);

  // onda de limpeza: a frente anda da esquerda para a direita, com borda macia
  const frente = lin(frame, tLimpando, tAparecer + 12, -0.25, 1.25);
  const nivelEm = (cx: number) => Math.min(1, Math.max(0, (cx - frente) / 0.25 + 0.5));
  const limpo = lin(frame, tLimpando, tAparecer + 12);

  const cam = cameraPor(frame, [
    { em: 0, rx: 8, ry: -34, zoom: -120, foco: [0, -240, 0] },
    { em: tCria, ry: -14, zoom: 60 },
    { em: tTela, rx: 14, ry: 0, zoom: 170 },
    { em: tLimpando, ry: 10, zoom: 120 },
    { em: tCena - 8, ry: 16, zoom: -40 },
  ], 2.5, B);
  const pPedido = frame >= tCena - 4 ? entra(frame, tCena - 4, 180) : 0;
  return (
    <>
      <Som nome="chiado" em={0} volume={0.35} />
      <Som nome="tique" em={tTela} volume={0.35} />
      <Som nome="chiado" em={tLimpando} volume={0.25} />
      <Som nome="ding" em={tPediu - 4} volume={0.45} />

      <Fabrica3D bloco={B} cam={cam} poeira={0.35 * (1 - limpo)}>
        <No3D y={-ALTURA_ESTEIRA}>
          <Tela3D w={LARG_TELA} nivelEm={frame >= tLimpando ? nivelEm : () => 1} semente={11} sobre={limpo > 0.6 ? <BarraPlay p={lin(frame, tAparecer, tAparecer + 90)} /> : null}>
            <CenaPraiaViva t={frame} />
          </Tela3D>
        </No3D>
      </Fabrica3D>

      {pPedido > 0 ? <CaixaPrompt x={CENTRO_X} top={330} texto="um cachorro na praia" escala={pPedido * 0.82} /> : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};

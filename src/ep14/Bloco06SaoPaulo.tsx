import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Cartao, Rotulo } from './comum';

const B = 5;
const P = COR.preto;

/**
 * São Paulo: cartão com duas barras de acerto da chegada (ANTES e COM IA). "Previsão de chegada":
 * a barra da IA sobe e o número conta até +50%. "Cidades": etiquetas TÓQUIO, BERLIM, SYDNEY;
 * "São Paulo": a etiqueta preta de SÃO PAULO chega por último, maior.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPrevisao = palavra(B, 'previsao');
  const t50 = palavra(B, '50');
  const tCidades = palavra(B, 'cidades');
  const tSao = palavra(B, 'sao');

  const pCartao = entra(frame, 0, 150);
  const sobe = lin(frame, tPrevisao, t50 + 8);
  const ALT = 150;
  const altIA = ALT * (1 + 0.5 * sobe);
  const cidade = (t: number) => (frame >= t ? entra(frame, t, 190) : 0);
  return (
    <>
      <Som nome="tique" em={0} volume={0.3} />
      <Som nome="chiado" em={tPrevisao} volume={0.12} />
      <Som nome="ding" em={t50 + 8} volume={0.35} />
      <Som nome="tique" em={tCidades} volume={0.3} />
      <Som nome="tique" em={tCidades + 5} volume={0.3} />
      <Som nome="tique" em={tCidades + 10} volume={0.3} />
      <Som nome="carimbo" em={tSao} volume={0.3} />

      <Cartao x={540} top={450} largura={600} escala={pCartao}>
        <Rotulo tam={26}>ACERTO DA CHEGADA</Rotulo>
        <svg width={550} height={330} style={{ display: 'block', marginTop: 6 }}>
          <line x1={20} y1={280} x2={530} y2={280} stroke={P} strokeWidth={6} />
          <rect x={95} y={280 - ALT} width={130} height={ALT} rx={10} fill={COR.branco} stroke={P} strokeWidth={7} />
          <rect x={325} y={280 - altIA} width={130} height={altIA} rx={10} fill={COR.azul} stroke={P} strokeWidth={7} />
          <text x={160} y={318} textAnchor="middle" fontFamily={FONTE.rotulo} fontWeight={900} fontSize={26} letterSpacing={2} fill={P}>
            ANTES
          </text>
          <text x={390} y={318} textAnchor="middle" fontFamily={FONTE.rotulo} fontWeight={900} fontSize={26} letterSpacing={2} fill={P}>
            COM IA
          </text>
          {sobe > 0 ? (
            <text x={390} y={280 - altIA - 18} textAnchor="middle" fontFamily={FONTE.numero} fontWeight={800} fontSize={44} fill={COR.azul}>
              +{Math.round(50 * sobe)}%
            </text>
          ) : null}
        </svg>
      </Cartao>

      <Etiqueta x={360} top={880} texto="SÃO PAULO" cor={P} escala={cidade(tSao - 2) * 1.12} />
      <Etiqueta x={735} top={880} texto="TÓQUIO" escala={cidade(tCidades - 2)} />
      <Etiqueta x={360} top={965} texto="BERLIM" escala={cidade(tCidades + 3)} />
      <Etiqueta x={735} top={965} texto="SYDNEY" escala={cidade(tCidades + 8)} />
    </>
  );
};

export const SaoPaulo: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};

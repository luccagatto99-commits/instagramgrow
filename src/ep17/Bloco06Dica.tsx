import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { entra } from '../anim';
import { palavra } from './tempo';
import { ItemLista } from './comum';

const B = 5;

/** O que fazer: três itens, um por frase (✓ atualizar o PHP, ✗ só o WordPress, ✓ perguntar à hospedagem). */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const itens = [
    { t: palavra(B, 'atualize'), texto: 'ATUALIZE O PHP DO SERVIDOR', ok: true },
    { t: palavra(B, 'wordpress'), texto: 'SÓ ATUALIZAR O WORDPRESS NÃO RESOLVE', ok: false },
    { t: palavra(B, 'hospedagem,'), texto: 'HOSPEDAGEM? PERGUNTE HOJE AO SUPORTE', ok: true },
  ];
  return (
    <>
      {itens.map((it, i) => (
        <React.Fragment key={i}>
          <Som nome={it.ok ? 'ding' : 'carimbo'} em={it.t} volume={0.3} />
          <ItemLista x={540} top={590 + i * 130} texto={it.texto} ok={it.ok} escala={frame >= it.t - 4 ? entra(frame, it.t - 4, 170) : 0} />
        </React.Fragment>
      ))}
    </>
  );
};

export const Dica: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)], esteira: false };

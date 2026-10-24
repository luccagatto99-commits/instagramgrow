import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ComparadorDeBytes, Destaque, FECHADO, FolhaCodigo, FundoGalpao, RotuloVeredito, Som, Trecho, Veredito, type CenaEp, type EstadoByte } from '../components';
import { COR, ESTEIRA_Y } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { BYTES, SetaLoop } from './comum';

const B = 5;
const ORIGINAL = BYTES.slice(0, 8);
const ERRO = 5; // byte que sai diferente na 1ª tentativa
const NOVO_1 = ORIGINAL.map((b, i) => (i === ERRO ? '01' : b));

/** Provável não é certo: recompila, compara byte a byte, erra, tenta de novo, idêntico. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tProvavel = palavra(B, 'provável');
  const tEntao = palavra(B, 'então');
  const tVira = palavra(B, 'vira');
  const tNumeros = palavra(B, 'números');
  const tComparado = palavra(B, 'comparado');
  const tDiferente = palavra(B, 'diferente?');
  const tTenta = palavra(B, 'tenta');

  const segunda = frame >= tTenta + 4;
  const t0 = segunda ? tTenta + 6 : tComparado + 8; // início da comparação
  const passo = segunda ? 2 : 4;
  const estados: EstadoByte[] = ORIGINAL.map((_, i) => {
    if (frame < t0 + i * passo) return '';
    return !segunda && i === ERRO ? 'erro' : 'ok';
  });
  const tIdentico = tTenta + 6 + 8 * 2 + 2;
  const pX = entra(frame, tDiferente - 2, 180) * (1 - lin(frame, tTenta - 4, tTenta + 2));

  return (
    <>
      <Som nome="tique" em={tProvavel} />
      <Som nome="tique" em={tNumeros - 2} />
      {ORIGINAL.map((_, i) => <Som key={i} nome="tique" em={tComparado + 8 + i * 4} volume={0.3} />)}
      <Som nome="carimbo" em={tDiferente} volume={0.6} />
      <Som nome="tique" em={tTenta} />
      <Som nome="carimbo" em={tIdentico} volume={0.45} />

      <Destaque de={tProvavel - 4} ate={tEntao - 6} top={540} tamanho={88}>
        provável <span style={{ color: COR.vermelho }}>≠</span> certo
      </Destaque>

      {frame < tNumeros + 4 ? (
        <FolhaCodigo
          x={540}
          base={ESTEIRA_Y}
          largura={430}
          tamanho={36}
          escala={1 - lin(frame, tVira, tNumeros + 4)}
          linhas={[<>se <Trecho fundo={COR.verde}>vida</Trecho> = 0:</>, <>{'  '}<Trecho fundo={COR.verde}>fim_de_jogo</Trecho>()</>]}
        />
      ) : null}

      <ComparadorDeBytes
        x={540}
        top={575}
        original={ORIGINAL}
        novo={segunda ? ORIGINAL : NOVO_1}
        estados={estados}
        pOriginal={entra(frame, tComparado - 4, 170)}
        pNovo={entra(frame, tNumeros - 2, 170)}
      />

      <Veredito x={540} y={915} marca="✗" escala={pX} tamanho={110} />
      <SetaLoop x={540} y={915} giro={frame * 9} escala={entra(frame, tTenta - 2, 170) * (1 - lin(frame, tIdentico - 6, tIdentico))} />
      <RotuloVeredito x={540} y={915} texto="✓ IDÊNTICO" escala={entra(frame, tIdentico, 180)} />
    </>
  );
};

export const Qualidade: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'diferente?') - 2, 540, 820, 1.05), ABERTO(palavra(B, 'tenta') - 4)],
};

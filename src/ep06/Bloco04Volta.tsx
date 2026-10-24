import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FitaDeNumeros, FolhaCodigo, FundoPrensa, Som, Trecho, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, SOMBRA, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, tranco } from '../anim';
import { palavra } from './tempo';
import { BYTES, Prensa } from './comum';

const B = 3;

/** O caminho de volta: a esteira anda ao contrário e os números viram comandos sem nomes. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCaminho = palavra(B, 'caminho');
  const tTransforma = palavra(B, 'transforma');
  const tSem = palavra(B, 'sem');
  const tVariavel = palavra(B, 'variável');

  const golpe = tranco(frame, tTransforma);
  const virou = frame >= tTransforma + 3;
  // a fita chega pela direita (esteira ao contrário)
  const fitaX = mola(frame, 2, 1200, 270);
  const pisca = frame >= tSem && (frame < tVariavel || Math.floor((frame - tVariavel) / 5) % 2 === 0);
  const nomeSem = (t: string) => <Trecho cor={pisca ? COR.branco : COR.preto} fundo={frame >= tSem ? (pisca ? COR.vermelho : COR.branco) : undefined}>{t}</Trecho>;

  return (
    <>
      <Som nome="tique" em={4} />
      <Som nome="tique" em={tCaminho - 4} />
      <Som nome="guilhotina" em={tTransforma} volume={0.5} />
      <Som nome="tique" em={tSem} />
      <Som nome="tique" em={tVariavel} />

      <Prensa x={540} top={470} golpe={golpe} nome="ENGENHARIA REVERSA" termo="números → comandos" curso={110} escala={entra(frame, tCaminho - 8, 140)} />

      {!virou ? (
        <FitaDeNumeros x={fitaX} y={ESTEIRA_Y - 84} largura={540} valores={BYTES} deslocamento={-frame * 3} tamanho={44} />
      ) : (
        <FolhaCodigo
          x={540}
          base={ESTEIRA_Y}
          largura={520}
          tamanho={42}
          escala={entra(frame, tTransforma + 3, 170)}
          linhas={[<>se {nomeSem('var_8')} = 0:</>, <>{'  '}{nomeSem('func_12')}()</>]}
        >
          {frame >= tSem ? (
            <div style={{ position: 'absolute', right: -34, top: -34, width: 84, height: 84, borderRadius: '50%', background: COR.vermelho, border: `${CONTORNO}px solid ${COR.preto}`, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontSize: 52, color: COR.preto, transform: `scale(${entra(frame, tSem, 180)})` }}>?</div>
          ) : null}
        </FolhaCodigo>
      )}
      {/* um brilho de leitura passa pela fita enquanto a prensa desce */}
      {!virou && frame >= tCaminho ? <div style={{ position: 'absolute', left: 270, top: ESTEIRA_Y - 84, width: 540 * lin(frame, tCaminho, tTransforma), height: 84, background: COR.amarelo, opacity: 0.35, borderRadius: 16 }} /> : null}
    </>
  );
};

export const Volta: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={-f * 2} />; },
  sentido: -1,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'transforma') + 6, 540, 860, 1.06), ABERTO(palavra(B, 'variável') - 6)],
};

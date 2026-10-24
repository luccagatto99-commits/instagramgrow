import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FichaArquivo, FolhaDeProva, FundoReuniao, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, pop, segue } from '../anim';
import { palavra } from './tempo';

const B = 6;

/** Por que ela não diz "não sei": avaliada como prova de múltipla escolha (OpenAI, 2025). */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEstudo = palavra(B, 'estudo');
  const tAvaliadas = palavra(B, 'avaliadas');
  const tChutar = palavra(B, 'chutar', 0);
  const tPonto = palavra(B, 'ponto.');
  const tDeixar = palavra(B, 'deixar');
  const tNunca = palavra(B, 'nunca');
  const tAprendem = palavra(B, 'aprendem');

  const saiFicha = segue(frame, tAvaliadas - 8, 14);
  const pFolha = entra(frame, tAvaliadas + 6, 140); // só depois que a ficha saiu
  const pPlacar = entra(frame, tAprendem - 4, 160);

  return (
    <>
      <Som nome="carimbo" em={tEstudo - 4} volume={0.5} />
      <Som nome="tique" em={tChutar} />
      <Som nome="carimbo" em={tPonto} volume={0.5} />
      <Som nome="tique" em={tDeixar} />
      <Som nome="carimbo" em={tNunca} volume={0.5} />
      <Som nome="tique" em={tAprendem - 4} />

      <Destaque de={2} ate={tEstudo - 8} top={600} tamanho={96}>
        “não sei”?
      </Destaque>

      {frame >= tEstudo - 4 && saiFicha < 1400 ? (
        <FichaArquivo
          x={CENTRO_X + saiFicha}
          top={500}
          ano="2025"
          marca="openai"
          titulo="Why Language Models Hallucinate"
          detalhes={['OPENAI · SETEMBRO DE 2025']}
          largura={820}
          tamanhoTitulo={56}
          escala={entra(frame, tEstudo - 4, 140)}
        />
      ) : null}

      {frame >= tAvaliadas + 6 ? (
        <FolhaDeProva
          top={470}
          escala={pFolha}
          titulo="PROVA DE MÚLTIPLA ESCOLHA"
          questoes={[
            { texto: 'Em que ano saiu o processo?', resposta: 'chutou: 2019', marca: frame >= tPonto ? '✓' : '', pontos: frame >= tPonto ? '+1' : '', p: entra(frame, tChutar - 4, 170), pPontos: pop(frame, tPonto, 0.25) },
            { texto: 'Qual é o número do processo?', resposta: 'deixou em branco', marca: '', pontos: frame >= tNunca ? '0' : '', p: entra(frame, tDeixar - 4, 170), pPontos: pop(frame, tNunca, 0.25) },
          ]}
        />
      ) : null}

      {/* placar: chutar vale mais que admitir */}
      {pPlacar > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 860,
            transform: `translateX(-50%) scale(${pPlacar})`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            padding: '12px 30px',
            whiteSpace: 'nowrap',
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 2,
            color: COR.preto,
          }}
        >
          CHUTAR <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul }}>1</span>
          <span style={{ fontFamily: FONTE.titulo, fontSize: 44 }}>×</span>
          <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul }}>0</span> NÃO SEI
        </div>
      ) : null}
    </>
  );
};

export const NaoSei: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoReuniao ponteiro={f * 0.05} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'estudo') - 2, CENTRO_X, 720, 1.05), ABERTO(palavra(B, 'avaliadas') - 4), FECHADO(palavra(B, 'aprendem') - 2, CENTRO_X, 780, 1.06)],
};

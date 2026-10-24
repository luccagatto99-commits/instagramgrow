import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FichaArquivo, FundoPortaria, Logo, SeloMarca, SetaVetor, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, pop, segue, tranco } from '../anim';
import { palavra } from './tempo';

const B = 0;
export const T_LETRA = 110;
const FICHA_TOP = 470;

/** Título do artigo ainda em segredo: tarjas pretas no lugar das palavras. */
export const TituloTarjado: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6 }}>
    {[[150, 60, 90], [100, 70, 170]].map((linha, i) => (
      <div key={i} style={{ display: 'flex', gap: 16 }}>
        {linha.map((w, j) => <span key={j} style={{ width: w, height: 50, background: COR.preto, borderRadius: 8, display: 'inline-block' }} />)}
      </div>
    ))}
  </div>
);

/** Gancho: um artigo de 2017 mudou a IA; o ChatGPT nasceu dele; e foi inventado no Google. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPesq = palavra(B, 'pesquisadores');
  const tMudou = palavra(B, 'mudou');
  const tChat = palavra(B, 'chatgpt');
  const tNasceu = palavra(B, 'nasceu');
  const tGoogle = palavra(B, 'google');
  const tOpen = palavra(B, 'openai.');

  const saiAno = segue(frame, tChat - 10, 14);
  const pFicha = entra(frame, tPesq - 4, 130);
  const baque = tranco(frame, tMudou);
  const cai = lin(frame, tGoogle - 6, tGoogle + 2);
  const pPill = pop(frame, tOpen, 0.12);
  const fichaBase = FICHA_TOP + 300;

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="carimbo" em={tMudou} volume={0.5} />
      <Som nome="tique" em={tChat - 4} />
      <Som nome="carimbo" em={tGoogle + 2} />

      {/* "2017" já se mexendo no primeiro frame */}
      {saiAno < 1400 ? <CaixaToken texto="2017" numero tamanho={T_LETRA} x={naEsteira(frame, -14, CENTRO_X) + saiAno} base={ESTEIRA_Y} destaque /> : null}

      {frame >= tPesq - 4 ? (
        <FichaArquivo
          x={CENTRO_X}
          top={FICHA_TOP - (1 - pFicha) * 900}
          ano="2017"
          titulo={<TituloTarjado />}
          detalhes={['8 PESQUISADORES']}
          largura={760}
          escala={1 + baque * 0.04}
        />
      ) : null}

      {/* o ChatGPT nasceu dessa ideia */}
      <SetaVetor de={[CENTRO_X, fichaBase]} para={[CENTRO_X, ESTEIRA_Y - 110]} p={lin(frame, tNasceu - 2, tNasceu + 10)} espessura={12} recuo={8} />
      {frame >= tChat - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: naEsteira(frame, tChat - 4, CENTRO_X),
            top: ESTEIRA_Y,
            transform: `translate(-50%, -100%) scale(${pPill})`,
            transformOrigin: '50% 100%',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            padding: '16px 36px',
            whiteSpace: 'nowrap',
          }}
        >
          <Logo marca="openai" tamanho={70} />
          <span style={{ fontFamily: FONTE.titulo, fontSize: 64, color: COR.preto, lineHeight: 1 }}>ChatGPT</span>
        </div>
      ) : null}

      {/* carimbo do Google na ficha */}
      {frame >= tGoogle - 6 ? <SeloMarca marca="google" nome="Google" x={810} y={-300 + (FICHA_TOP + 160 + 300) * cai * cai} tamanho={120} /> : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  // a placa da portaria sai antes da ficha descer
  Fundo: () => {
    const f = useCurrentFrame();
    const sai = lin(f, palavra(B, 'pesquisadores') - 12, palavra(B, 'pesquisadores') - 4);
    return <FundoPortaria placa={1 - sai} opacidade={1 - 0.6 * sai} />;
  },
  planos: () => [
    FECHADO(0, CENTRO_X, 880, 1.15),
    ABERTO(palavra(B, 'pesquisadores') - 4),
    FECHADO(palavra(B, 'nasceu') - 2, CENTRO_X, 800, 1.06),
    ABERTO(palavra(B, 'google') - 6),
  ],
};

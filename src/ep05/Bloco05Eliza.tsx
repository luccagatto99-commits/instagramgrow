import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Bonequinho, Calendario, FECHADO, FundoEscritorio, Som, rolaAno, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, segue } from '../anim';
import { palavra } from './tempo';

const B = 4;
const JANELA_W = 760;

/** Monitor antigo de traço com "ELIZA" na tela. Posicionado pelo centro x e pela base. */
export const Monitor: React.FC<{ x: number; base: number; escala?: number }> = ({ x, base, escala = 1 }) => (
  <div style={{ position: 'absolute', left: x - 130, top: base - 250, width: 260, height: 250, transform: `scale(${escala})`, transformOrigin: '50% 100%' }}>
    <svg width={260} height={250} viewBox="0 0 260 250" fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} strokeLinejoin="round">
      <rect x={10} y={10} width={240} height={170} rx={22} />
      <rect x={34} y={32} width={192} height={124} rx={10} />
      <path d="M100 180 L90 236 L170 236 L160 180" />
    </svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 38, color: COR.preto }}>ELIZA</div>
  </div>
);

/** ELIZA (1966): só regras, e mesmo assim a secretária pede para ficar a sós com ela. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEliza = palavra(B, 'eliza.');
  const tRegras = palavra(B, 'regras');
  const tEstou = palavra(B, 'estou');
  const tRespondia = palavra(B, 'respondia');
  const tSecretaria = palavra(B, 'secretária');
  const tCriador = palavra(B, 'criador');
  const tPediu = palavra(B, 'pediu');
  const tSair = palavra(B, 'sair');

  const ano = rolaAno(frame, 0, 1956, 1966, 22);
  const saiJanela = segue(frame, tSecretaria - 10, 14);
  const pRegra = entra(frame, tRegras - 4, 160);
  const pSala = entra(frame, tSecretaria - 2, 120);
  const andando = frame >= tSair + 4;
  const xCriador = andando ? 820 + (frame - (tSair + 4)) * 14 : mola(frame, tCriador - 6, 1300, 820);

  return (
    <>
      <Som nome="tique" em={tEliza - 4} />
      <Som nome="tique" em={tRegras - 4} volume={0.6} />
      <Som nome="tique" em={tEstou - 2} />
      <Som nome="tique" em={tRespondia} />
      <Som nome="tique" em={tPediu - 2} />

      <Calendario ano={ano} de={0} ate={tEliza - 12} />

      {/* a janela da conversa */}
      {frame >= tEliza - 8 && saiJanela < 1400 ? (
        <div
          style={{
            position: 'absolute',
            left: naEsteira(frame, tEliza - 8, CENTRO_X) + saiJanela,
            top: 540,
            width: JANELA_W,
            height: 450,
            transform: 'translateX(-50%)',
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            overflow: 'hidden',
          }}
        >
          <div style={{ background: COR.preto, color: COR.amarelo, padding: '14px 28px 10px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 3 }}>ELIZA</div>
          {frame < tEstou - 4 ? (
            <div style={{ position: 'absolute', left: 28, bottom: 24, fontFamily: FONTE.numero, fontWeight: 800, fontSize: 44, color: COR.preto, opacity: Math.floor(frame / 12) % 2 ? 1 : 0.15 }}>&gt; _</div>
          ) : null}
          {pRegra > 0.01 ? (
            <div style={{ margin: '18px 24px 0', transform: `scale(${pRegra})`, transformOrigin: '0% 50%', display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
              <span style={{ background: COR.preto, color: COR.amarelo, borderRadius: 12, padding: '6px 14px 4px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 2 }}>REGRA</span>
              <span style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 30, color: COR.preto }}>“estou X” → “por que você está X?”</span>
            </div>
          ) : null}
          {frame >= tEstou - 4 ? (
            <Balao x={JANELA_W - 190} base={290} rabo="dir" largura={280} tamanho={36} escala={entra(frame, tEstou - 4, 170)}>
              estou triste
            </Balao>
          ) : null}
          {frame >= tRespondia - 2 ? (
            <Balao x={250} base={420} rabo="esq" largura={400} tamanho={36} escala={entra(frame, tRespondia - 2, 170)}>
              por que você está triste?
            </Balao>
          ) : null}
        </div>
      ) : null}

      {/* a sala: monitor, secretária e o criador */}
      {frame >= tSecretaria - 4 ? (
        <>
          <Monitor x={260} base={ESTEIRA_Y} escala={pSala} />
          <Bonequinho x={mola(frame, tSecretaria - 4, -200, 520)} base={ESTEIRA_Y} virado passo={frame < tSecretaria + 16 ? frame * 0.5 : 0} />
          {frame >= tCriador - 6 && xCriador < 1300 ? <Bonequinho x={xCriador} base={ESTEIRA_Y} virado={!andando} passo={andando ? frame * 0.6 : 0} /> : null}
          {frame >= tPediu - 4 ? (
            <Balao x={600} base={730} rabo="esq" largura={330} tamanho={36} escala={entra(frame, tPediu - 4, 170) * (1 - lin(frame, tSair + 30, tSair + 36))}>
              pode sair da sala?
            </Balao>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export const Eliza: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'estou') - 4, CENTRO_X, 760, 1.08),
    ABERTO(palavra(B, 'secretária') - 6),
    FECHADO(palavra(B, 'pediu') - 4, 520, 820, 1.1),
    ABERTO(palavra(B, 'queria') - 4),
  ],
};

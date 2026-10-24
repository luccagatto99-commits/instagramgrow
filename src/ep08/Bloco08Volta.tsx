import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Celular, FECHADO, FundoSaida, Som, Visto, type CenaEp } from '../components';
import { COR, FONTE, RAIO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, pop } from '../anim';
import { palavra } from './tempo';
import { CartaoConfirmacao, TextoTela } from './comum';

const B = 7;
const ESC_TEL = 0.85;

/** Botão vermelho de desligar (fone deitado). */
const BotaoDesligar: React.FC<{ escala: number }> = ({ escala }) => (
  <svg width={96} height={96} viewBox="0 0 96 96" style={{ transform: `scale(${escala})` }}>
    <circle cx={48} cy={48} r={42} fill={COR.vermelho} stroke={COR.preto} strokeWidth={6} />
    <path d="M22 54 Q48 30 74 54" fill="none" stroke={COR.branco} strokeWidth={12} strokeLinecap="round" />
  </svg>
);

/** Lugar vazio da terceira confirmação. */
const Vaga: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      position: 'absolute',
      left: CENTRO_X - 105,
      top: ESTEIRA_Y - 390,
      width: 210,
      height: 390,
      border: `8px dashed var(--tinta, ${COR.preto})`,
      borderRadius: 40,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONTE.titulo,
      fontSize: 120,
      color: `var(--tinta, ${COR.preto})`,
      transform: `scale(${p})`,
    }}
  >
    ?
  </div>
);

/** Volta ao gancho: as duas confirmações falsas; a que falta é desligar e ligar de volta. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tDuas = palavra(B, 'duas');
  const tConf = palavra(B, 'confirmacoes.');
  const tFaltou = palavra(B, 'faltou');
  const tDesligar = palavra(B, 'desligar');
  const tLigar = palavra(B, 'ligar');
  const tVolta = palavra(B, 'volta');
  const tConhece = palavra(B, 'conhece.');
  const pMsg = entra(frame, tDuas - 4, 170);
  const pTel = entra(frame, tConf - 4, 170);
  const temTel = frame >= tDesligar - 2;
  return (
    <>
      <Som nome="carimbo" em={tDuas} volume={0.35} />
      <Som nome="carimbo" em={tConf} volume={0.35} />
      <Som nome="tique" em={tFaltou} />
      <Som nome="tique" em={tDesligar + 4} />
      <Som nome="carimbo" em={tConhece + 2} volume={0.6} />

      {frame >= tDuas - 4 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pMsg) * -240}px)`, opacity: Math.min(1, pMsg * 2) }}>
          <CartaoConfirmacao x={270} base={ESTEIRA_Y - 30} tipo="mensagem" ok={false} />
        </div>
      ) : null}
      {frame >= tConf - 4 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pTel) * -240}px)`, opacity: Math.min(1, pTel * 2) }}>
          <CartaoConfirmacao x={810} base={ESTEIRA_Y} tipo="ligacao" ok={false} />
        </div>
      ) : null}

      {frame >= tFaltou && !temTel ? <Vaga p={entra(frame, tFaltou, 170)} /> : null}

      {temTel ? (
        <Celular x={CENTRO_X} base={ESTEIRA_Y} escala={ESC_TEL * entra(frame, tDesligar - 2, 200)}>
          {frame < tLigar ? (
            <>
              <TextoTela tamanho={30}>CHAMADA</TextoTela>
              <BotaoDesligar escala={pop(frame, tDesligar + 4, 0.25)} />
              <TextoTela tamanho={24}>{frame >= tDesligar + 6 ? 'encerrada' : 'desligar'}</TextoTela>
            </>
          ) : (
            <>
              <TextoTela tamanho={28}>AGENDA</TextoTela>
              <div style={{ width: '86%', border: `5px solid ${COR.preto}`, borderRadius: RAIO.caixa - 6, padding: '10px 0 8px', textAlign: 'center', transform: `scale(${pop(frame, tLigar, 0.1)})` }}>
                <TextoTela tamanho={22}>CONTATO</TextoTela>
                <div style={{ marginTop: 6 }}>
                  <TextoTela tamanho={26} cor={COR.azul} mono>
                    ••• 4821
                  </TextoTela>
                </div>
              </div>
              <TextoTela tamanho={24}>{frame >= tConhece + 2 ? 'atendida' : frame >= tVolta ? 'ligando…' : ''}</TextoTela>
            </>
          )}
        </Celular>
      ) : null}
      {frame >= tConhece + 2 ? <Visto x={CENTRO_X + 92} y={ESTEIRA_Y - 400} r={60} ok escala={entra(frame, tConhece + 2, 220)} /> : null}
    </>
  );
};

export const Volta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoSaida />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'desligar'), CENTRO_X, 800, 1.12), ABERTO(palavra(B, 'conhece.'))],
};

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, AvatarTerno, BalaoMensagem, Carimbo, Celular, FundoPrateleiras, Som, Visto, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';

const B = 1;
const X_MSG = 360;
const X_TEL = 770;

/** O golpe: mensagem do "chefe" (✓), ligação do "advogado" (✓); as duas viram ✗ FALSO. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMsg = palavra(B, 'whatsapp,') - 4;
  const tUrgentes = palavra(B, 'urgentes.');
  const tTel = palavra(B, 'advogado') - 4;
  const tConfirmando = palavra(B, 'confirmando.');
  const tFalsas = palavra(B, 'falsas.');
  const vira = lin(frame, tFalsas, tFalsas + 8);
  return (
    <>
      <Som nome="tique" em={tMsg + 6} />
      <Som nome="tique" em={tUrgentes} />
      <Som nome="tique" em={tTel + 6} />
      <Som nome="tique" em={tConfirmando} />
      <Som nome="carimbo" em={tFalsas + 4} volume={0.7} />

      {frame >= tMsg ? (
        <BalaoMensagem x={naEsteira(frame, tMsg, X_MSG)} base={ESTEIRA_Y - 20} remetente="CHEFE DO BANCO" texto="Preciso de uma transferência urgente." largura={380} tamanho={40} />
      ) : null}
      {frame >= tUrgentes ? <Visto x={X_MSG + 195} y={ESTEIRA_Y - 330} ok vira={vira} escala={entra(frame, tUrgentes, 200)} /> : null}

      {frame >= tTel ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - entra(frame, tTel, 170)) * -260}px)`, opacity: Math.min(1, entra(frame, tTel, 170) * 2) }}>
          <Celular x={X_TEL} base={ESTEIRA_Y} escala={0.66}>
            <AvatarTerno tamanho={130} />
          </Celular>
        </div>
      ) : null}
      {frame >= tConfirmando ? <Visto x={X_TEL + 70} y={ESTEIRA_Y - 315} ok vira={vira} escala={entra(frame, tConfirmando, 200)} /> : null}

      <Carimbo x={CENTRO_X} y={530} texto="FALSO" em={tFalsas + 4} tamanho={80} rot={-8} />
    </>
  );
};

export const Golpe: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'logo')), ABERTO(palavra(B, 'falsas.') + 4)],
};

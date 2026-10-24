import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import { entra, lin, naEsteira, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Servidor } from './comum';

const B = 2;

/**
 * "Nota 9,2 de 10": cartão com a nota em azul. "Sem senha / sem login": duas etiquetas riscadas.
 * "Pedido": a caixa PEDIDO entra pela esteira no servidor; "comandos": a tela do servidor enche de
 * comandos em vermelho.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNota = palavra(B, 'nota');
  const tSenha = palavra(B, 'senha');
  const tLogin = palavra(B, 'login,');
  const tPedido = palavra(B, 'pedido,');
  const tComandos = palavra(B, 'comandos');

  const sai1 = suave(frame, tPedido - 14, 10);
  const pNota = entra(frame, Math.max(0, tNota - 6), 170) * (1 - sai1);
  const valor = 9.2 * lin(frame, tNota, tNota + 22);
  const pServ = frame >= tPedido - 14 ? entra(frame, tPedido - 14, 150) : 0;
  const xPedido = naEsteira(frame, tPedido - 4, 470);
  const entrou = suave(frame, tPedido + 26, 10);
  return (
    <>
      <Som nome="ding" em={tNota + 20} volume={0.3} />
      <Som nome="tique" em={tSenha} volume={0.3} />
      <Som nome="tique" em={tLogin} volume={0.3} />
      <Som nome="carimbo" em={tComandos} volume={0.3} />

      {pNota > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute', left: 540, top: 600, transform: `translateX(-50%) scale(${pNota})`,
              background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA,
              padding: '6px 40px 10px', textAlign: 'center', whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2 }}>NOTA DE GRAVIDADE</div>
            <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 110, color: COR.azul, lineHeight: 1.05 }}>
              {valor.toFixed(1).replace('.', ',')}
              <span style={{ fontSize: 48, color: COR.preto }}> /10</span>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, opacity: pNota }}>
            <Etiqueta x={350} top={900} texto="SEM SENHA" escala={frame >= tSenha - 4 ? entra(frame, tSenha - 4, 180) : 0} />
            <Etiqueta x={730} top={900} texto="SEM LOGIN" escala={frame >= tLogin - 4 ? entra(frame, tLogin - 4, 180) : 0} />
          </div>
        </>
      ) : null}

      {pServ > 0.01 ? (
        <>
          <Servidor x={720} base={905} escala={pServ} linhas={lin(frame, tComandos - 4, tComandos + 30)} tranco={frame > tPedido + 26 && frame < tPedido + 40 ? 1 : 0} />
          {entrou < 1 ? (
            <CaixaToken texto="PEDIDO" x={Math.min(xPedido + entrou * 120, 640)} base={1000} tamanho={44} escala={1 - entrou} />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export const Nota: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)] };

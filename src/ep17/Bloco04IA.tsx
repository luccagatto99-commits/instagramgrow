import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Carimbo, FolhaCodigo, SeloMarca, Som, Trecho, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, naEsteira, suave } from '../anim';
import { palavra } from './tempo';
import { Lupa } from '../ep14/comum';
import { Etiqueta } from '../ep12/comum';
import { BarraMemoria, LINHAS_PHP } from './comum';

const B = 3;

/**
 * Um objeto por vez:
 * 1. "GPT-5.6 Sol, da OpenAI": selo da OpenAI com o nome do modelo.
 * 2. "Ler o código": a folha de código com a lupa varrendo; "ponto fraco": a linha do limite fica vermelha.
 * 3. "Memória demais": a barra enche e passa do limite; "para no meio": carimbo PAROU.
 * 4. "Arrumação pela metade": caixas meio arrumadas, meio caídas; "pedido sob medida": a caixa PEDIDO
 *    (vermelha) entra pela esteira e ocupa o buraco.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tGpt = palavra(B, 'gpt-5.6');
  const tLer = palavra(B, 'ler');
  const tFraco = palavra(B, 'fraco:');
  const tMemoria = palavra(B, 'memória');
  const tPara = palavra(B, 'para', 1); // "o PHP para no meio" (a 1ª é "para ler")
  const tArrum = palavra(B, 'arrumação');
  const tSob = palavra(B, 'sob');

  const fase = (a: number, b: number) => (frame >= a - 6 ? entra(frame, a - 6, 160) : 0) * (1 - suave(frame, b - 8, 8));
  const pSelo = fase(tGpt - 4, tLer);
  const pCodigo = fase(tLer, tMemoria - 2);
  const pBarra = fase(tMemoria - 2, tArrum - 2);
  const pPrat = frame >= tArrum - 8 ? entra(frame, tArrum - 8, 150) : 0;

  const linhas = LINHAS_PHP.map((l, i) => (frame >= tFraco && (i === 3 || i === 4) ? <Trecho key={i} cor={COR.branco} fundo={COR.vermelho}>{l}</Trecho> : l));
  const xLupa = 330 + 380 * ((Math.sin((frame - tLer) / 12) + 1) / 2);
  const mem = lin(frame, tMemoria - 2, tPara + 2);

  // prateleira: 5 caixas; as 2 últimas caem (arrumação pela metade) e o pedido entra no buraco
  const caiu = suave(frame, tArrum + 6, 14);
  const xPedido = naEsteira(frame, tSob - 8, 860);
  return (
    <>
      <Som nome="tique" em={tGpt} volume={0.3} />
      <Som nome="carimbo" em={tFraco} volume={0.3} />
      <Som nome="carimbo" em={tPara} volume={0.4} />
      <Som nome="chiado" em={tSob} volume={0.15} />

      {pSelo > 0.01 ? (
        <>
          <SeloMarca marca="openai" x={540} y={760} tamanho={220} escala={pSelo} />
          <Etiqueta x={540} top={900} texto="GPT-5.6 SOL" escala={pSelo} />
        </>
      ) : null}

      {pCodigo > 0.01 ? (
        <>
          <FolhaCodigo x={540} base={990} linhas={linhas} rotulo="PHP" largura={680} tamanho={34} escala={pCodigo} />
          <Lupa x={xLupa} y={720 + 50 * Math.sin(frame / 10)} r={60} escala={pCodigo * (1 - suave(frame, tFraco, 8))} />
          <Etiqueta x={540} top={480} texto="PONTO FRACO" cor={COR.vermelho} escala={frame >= tFraco ? entra(frame, tFraco, 180) * pCodigo : 0} />
        </>
      ) : null}

      {pBarra > 0.01 ? (
        <>
          <BarraMemoria x={540} top={640} v={mem * 1.05} escala={pBarra} />
          {frame >= tPara - 4 ? <div style={{ opacity: pBarra }}><Carimbo x={540} y={890} texto="PAROU NO MEIO" em={tPara} tamanho={56} rot={-6} /></div> : null}
        </>
      ) : null}

      {pPrat > 0.01 ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const cai = i >= 3 ? caiu : 0;
            return (
              <CaixaToken
                key={i}
                texto={['A', 'B', 'C', 'D', 'E'][i]}
                x={220 + i * 160}
                base={1000 - (i === 4 ? 0 : 0)}
                tamanho={76}
                escala={pPrat}
                rot={cai * (i === 3 ? -28 : 34)}
                opacidade={i === 4 ? 1 - suave(frame, tArrum + 16, 10) : 1}
                style={{ transform: `translate(-50%, -100%) scale(${pPrat}) rotate(${cai * (i === 3 ? -28 : 34)}deg) translateY(${cai * 14}px)` }}
              />
            );
          })}
          <Etiqueta x={540} top={720} texto="ARRUMAÇÃO PELA METADE" escala={frame >= tArrum + 4 ? entra(frame, tArrum + 4, 180) : 0} />
          {frame >= tSob - 8 ? (
            <CaixaToken texto="PEDIDO" x={Math.min(xPedido, 860)} base={1000} tamanho={52} destaque style={{ transform: `translate(-50%, -100%)`, background: COR.vermelho }} />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export const IA: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)] };

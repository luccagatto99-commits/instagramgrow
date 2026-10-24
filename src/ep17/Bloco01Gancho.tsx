import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FolhaCodigo, JanelaNavegador, Som, Trecho, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Lupa } from '../ep14/comum';
import { Etiqueta } from '../ep12/comum';
import { LINHAS_PHP } from './comum';

const B = 0;

/**
 * Gancho: o frame 0 já é o código do PHP com a lupa da IA varrendo. "Falhas": duas linhas ficam
 * vermelhas. "Governos": o código sai e entra o site do governo; "ar": carimbo FORA DO AR.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tFalhas = palavra(B, 'falhas');
  const tGov = palavra(B, 'governos');
  const tAr = palavra(B, 'ar.');

  const saiCodigo = suave(frame, tGov - 6, 10);
  const yLupa = 640 + 60 * Math.sin(frame / 9);
  const xLupa = 320 + 420 * ((Math.sin(frame / 14) + 1) / 2);
  const achou = frame >= tFalhas;
  const linhas = LINHAS_PHP.map((l, i) =>
    achou && (i === 3 || i === 4) ? <Trecho key={i} cor={COR.branco} fundo={COR.vermelho}>{l}</Trecho> : l,
  );
  const pSite = frame >= tGov - 2 ? entra(frame, tGov - 2, 150) : 0;
  return (
    <>
      <Som nome="carimbo" em={tFalhas} volume={0.3} />
      <Som nome="carimbo" em={tAr} volume={0.4} />

      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiCodigo * 1200}px)` }}>
        <FolhaCodigo x={540} base={960} linhas={linhas} rotulo="PHP" largura={680} tamanho={34} escala={entra(frame, 0, 160)} />
        <Lupa x={xLupa} y={yLupa} r={62} escala={(1 - suave(frame, tFalhas, 8)) * entra(frame, 2, 160)} />
        <Etiqueta x={540} top={460} texto="2 FALHAS ESCONDIDAS" cor={COR.vermelho} escala={achou ? entra(frame, tFalhas, 180) : 0} />
      </div>
      {pSite > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pSite) * -1200}px)` }}>
          <JanelaNavegador x={540} top={600} aba="SITE DO GOVERNO" largura={700} altura={260} apagada={frame >= tAr ? lin(frame, tAr, tAr + 8) : 0}>
            <div style={{ padding: '30px 36px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 38, color: COR.preto }}>
              Serviços ao cidadão
              <div style={{ marginTop: 18, height: 16, width: '80%', borderRadius: 8, background: COR.preto }} />
              <div style={{ marginTop: 14, height: 16, width: '55%', borderRadius: 8, background: COR.preto }} />
            </div>
          </JanelaNavegador>
          {frame >= tAr - 4 ? <Carimbo x={540} y={870} texto="FORA DO AR" em={tAr} tamanho={64} rot={-8} /> : null}
        </div>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)] };

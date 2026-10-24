import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Bonequinho, Celular, Som, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Anuncio, Mesa, Ouvido, PESSOA, Prato, MESA } from './comum';

const B = 0;

/** O jantar: duas pessoas, mesa e (opcional) o celular deitado em pé no meio. */
export const Jantar: React.FC<{ frame: number; fala?: 'esq' | 'dir' | null }> = ({ frame, fala }) => {
  const bobE = fala === 'esq' ? Math.abs(Math.sin(frame / 4)) * 5 : 0;
  const bobD = fala === 'dir' ? Math.abs(Math.sin(frame / 4)) * 5 : 0;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: -bobE }}>
        <Bonequinho x={PESSOA.esq} base={1000} escala={1.5} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: -bobD }}>
        <Bonequinho x={PESSOA.dir} base={1000} escala={1.5} virado />
      </div>
      <Mesa />
      <Prato x={PESSOA.esq + 40} base={MESA.top + 4} />
      <Prato x={PESSOA.dir - 40} base={MESA.top + 4} />
    </>
  );
};

/**
 * Gancho: o frame 0 já é o jantar com o balão "cafeteira" subindo. "Perto do celular": o celular na
 * mesa acende e um ouvido vermelho aparece na tela. "Anúncio": o anúncio da cafeteira pula do celular.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPerto = palavra(B, 'perto');
  const tAnuncio = palavra(B, 'anuncio');
  const tEm = palavra(B, 'em');

  // balão sobe da pessoa da esquerda desde o frame 0
  const pBalao = entra(frame, 0, 140);
  const sobe = lin(frame, 0, 60, 40, 0);
  const someBalao = suave(frame, tAnuncio - 6, 10);

  const pFone = entra(frame, tPerto - 10, 160);
  const pOuvido = entra(frame, tPerto + 2, 180);
  const pAnuncio = entra(frame, tAnuncio, 170);
  const pulso = 1 + 0.06 * Math.sin(frame / 5);
  const fim = suave(frame, tEm + 30, 14); // abre espaço antes da troca de cena
  return (
    <>
      <Som nome="tique" em={tPerto + 2} volume={0.35} />
      <Som nome="ding" em={tAnuncio} volume={0.3} />

      <Jantar frame={frame} fala={frame < tAnuncio ? 'esq' : null} />
      <Balao x={PESSOA.esq + 120} base={560 + sobe} escala={pBalao * (1 - someBalao)} largura={290} tamanho={40}>
        <div style={{ fontFamily: FONTE.numero, fontWeight: 700, fontSize: 22, color: '#777' }}>…comprar uma</div>
        cafeteira
      </Balao>

      {/* celular em pé no meio da mesa */}
      <Celular x={540} base={MESA.top + 10} escala={0.62 * pFone}>
        <div style={{ transform: `scale(${pOuvido * pulso})` }}>
          <Ouvido tam={120} />
        </div>
      </Celular>

      {/* anúncio sai do celular e sobe para cima dele */}
      <div style={{ opacity: 1 - fim }}>
        <Anuncio x={540} top={440 - 40 * pAnuncio} w={210} escala={pAnuncio} />
      </div>
      {pAnuncio > 0.05 ? (
        <svg width={40} height={60} style={{ position: 'absolute', left: 520, top: 600, opacity: pAnuncio * (1 - fim) }}>
          <path d="M20 56 L20 8 M6 22 L20 6 L34 22" fill="none" stroke={COR.preto} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

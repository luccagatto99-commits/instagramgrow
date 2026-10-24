import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Celular, Som, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, segue, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Anuncio, Busca, MaquinaAnuncios, Wifi } from './comum';

const B = 4;
const P = COR.preto;
const FONE_E = 325;
const FONE_D = 755;

/** Linha tracejada do Wi-Fi até um celular. */
const Ligacao: React.FC<{ de: [number, number]; ate: [number, number]; p: number }> = ({ de, ate, p }) => p <= 0 ? null : (
  <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <line x1={de[0]} y1={de[1]} x2={de[0] + (ate[0] - de[0]) * p} y2={de[1] + (ate[1] - de[1]) * p} stroke={P} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
  </svg>
);

/**
 * Ontem: o celular do amigo busca "cafeteira". Hoje: o seu celular entra e os dois se ligam ao
 * mesmo Wi-Fi. "Para a IA": a máquina recebe ESTAVAM JUNTOS e ELE QUER CAFETEIRA; "você pode querer":
 * VOCÊ TAMBÉM?; "anúncio aparece": o seu celular volta com o anúncio da cafeteira na tela.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPesquisou = palavra(B, 'pesquisou');
  const tCafeteira = palavra(B, 'cafeteira');
  const tHoje = palavra(B, 'hoje');
  const tWifi = palavra(B, 'wifi');
  const tPara = palavra(B, 'ia');
  const tJuntos = palavra(B, 'juntos', 1);
  const tProcurava = palavra(B, 'ele');
  const tChance = palavra(B, 'voce');
  const tAnuncio = palavra(B, 'anuncio');

  // fase 1 e 2: celulares
  const saiFones = segue(frame, tPara - 4, 14);
  const pAmigo = entra(frame, 0, 150);
  const busca = lin(frame, tPesquisou, tCafeteira + 14);
  const pOntem = entra(frame, 6, 170) * (1 - suave(frame, tHoje - 6, 6));
  const pVoce = frame >= tHoje - 8 ? entra(frame, tHoje - 8, 150) : 0;
  const pHoje = frame >= tHoje ? entra(frame, tHoje, 170) : 0;
  const pWifi = frame >= tWifi - 4 ? entra(frame, tWifi - 4, 170) : 0;
  const liga = lin(frame, tWifi, tWifi + 14);

  // fase 3: máquina
  const pMaq = frame >= tPara - 2 ? entra(frame, tPara - 2, 140) : 0;
  const saiMaq = segue(frame, tAnuncio - 10, 14);
  const pJuntos = frame >= tJuntos ? entra(frame, tJuntos, 180) : 0;
  const pBuscou = frame >= tProcurava ? entra(frame, tProcurava, 180) : 0;
  const someEtiq = suave(frame, tAnuncio - 10, 8);
  const pTambem = frame >= tChance - 2 ? entra(frame, tChance - 2, 180) : 0;

  // fase 4: o anúncio no seu celular
  const pFinal = frame >= tAnuncio - 4 ? entra(frame, tAnuncio - 4, 160) : 0;
  return (
    <>
      <Som nome="tique" em={tPesquisou} volume={0.3} />
      <Som nome="tique" em={tWifi} volume={0.35} />
      <Som nome="tique" em={tJuntos} volume={0.3} />
      <Som nome="tique" em={tProcurava} volume={0.3} />
      <Som nome="tique" em={tChance - 2} volume={0.3} />
      <Som nome="ding" em={tAnuncio} volume={0.35} />

      {/* ontem / hoje */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiFones}px)` }}>
        <Ligacao de={[540, 640]} ate={[FONE_E + 60, 700]} p={liga} />
        <Ligacao de={[540, 640]} ate={[FONE_D - 60, 700]} p={liga} />
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pAmigo) * -700}px)` }}>
          <Celular x={FONE_E} base={1000} escala={0.82}>
            <Busca texto="cafeteira" p={busca} />
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 22, letterSpacing: 2, marginTop: 10 }}>AMIGO</div>
          </Celular>
        </div>
        <Etiqueta x={FONE_E} top={560} texto="ONTEM" escala={pOntem} />
        {pVoce > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pVoce) * -900}px)` }}>
            <Celular x={FONE_D} base={1000} escala={0.82}>
              <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 2 }}>VOCÊ</div>
            </Celular>
          </div>
        ) : null}
        <Etiqueta x={540} top={460} texto="HOJE · NO JANTAR" escala={pHoje} />
        <Wifi x={540} y={650} tam={150} escala={pWifi} pulso={Math.sin(frame / 5)} />
      </div>

      {/* máquina calcula */}
      {pMaq > 0.01 && saiMaq < 1400 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${saiMaq + (1 - pMaq) * -1100}px, 0px)` }}>
          <MaquinaAnuncios x={540} base={1000} escala={0.8} acesos={[1, 1, 1, 1]} giro={frame * 6} />
        </div>
      ) : null}
      <Etiqueta x={540} top={480} texto="ESTAVAM JUNTOS" escala={pJuntos * (1 - someEtiq)} />
      <Etiqueta x={540} top={555} texto="ELE QUER CAFETEIRA" escala={pBuscou * (1 - someEtiq)} />
      <Etiqueta x={540} top={630} texto="VOCÊ TAMBÉM?" cor={COR.vermelho} escala={pTambem * (1 - someEtiq)} />

      {/* seu celular com o anúncio */}
      {pFinal > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pFinal) * -900}px)` }}>
          <Celular x={540} base={1000} escala={0.95}>
            <div style={{ position: 'relative', width: 190, height: 170 }}>
              <Anuncio x={95} top={0} w={190} />
            </div>
          </Celular>
        </div>
      ) : null}
    </>
  );
};

export const Exemplo: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};

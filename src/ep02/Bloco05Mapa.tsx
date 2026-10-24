import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, AnelMapa, FECHADO, FundoMapa, MapaSemantico, SetaVetor, Som, type CenaEp, type PontoMapa } from '../components';
import { COR, FONTE, CENTRO_X } from '../theme';
import { entra, lin, mola, naEsteira } from '../anim';
import { durBloco, inicioBloco, palavra } from './tempo';

const B = 4;
export const MAPA_GRANDE = { top: 470, w: 820, h: 480 };
type XY = [number, number];
/** Onde as palavras terminam este bloco (o bloco do treino começa daqui, sem corte). */
export const FIM_MAPA: Record<string, XY> = { cachorro: [230, 240], gato: [370, 340], geladeira: [640, 170] };
const ORIGEM: XY = [50, 430];

/** Pontos sem nome: começam espalhados e, em "perto", se juntam em dois grupos. */
const CINZA: { de: XY; para: XY }[] = [
  { de: [120, 120], para: [190, 360] },
  { de: [300, 430], para: [270, 410] },
  { de: [430, 200], para: [140, 410] },
  { de: [90, 330], para: [100, 300] },
  { de: [560, 400], para: [590, 260] },
  { de: [740, 420], para: [700, 300] },
  { de: [480, 80], para: [640, 330] },
  { de: [770, 250], para: [740, 230] },
];

/** O mapa de verdade tem milhares de direções: leque de setas finas. */
const LEQUE = Array.from({ length: 11 }).map((_, i) => {
  const a = (-8 - i * 7.5) * (Math.PI / 180);
  const r = 250 + ((i * 53) % 120);
  return [ORIGEM[0] + Math.cos(a) * r, ORIGEM[1] + Math.sin(a) * r] as XY;
});

const Rotulo: React.FC<{ texto: string; p: number }> = ({ texto, p }) =>
  p <= 0.01 ? null : (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 24,
        transform: `scale(${p})`,
        transformOrigin: '0% 50%',
        background: COR.preto,
        color: COR.amarelo,
        borderRadius: 14,
        padding: '10px 20px 8px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 30,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </div>
  );

/** Significado parecido mora perto. Montado com calma, uma palavra por vez. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPal = palavra(B, 'palavras');
  const tPerto = palavra(B, 'perto');
  const tCach = palavra(B, 'cachorro');
  const tGato = palavra(B, 'gato.');
  const tGel = palavra(B, 'geladeira');
  const tLonge = palavra(B, 'longe');
  const tTela = palavra(B, 'tela');
  const tMil = palavra(B, 'milhares.');
  const fim = durBloco(B);

  // fase dos eixos, que se desfaz no fim para o treino continuar no mesmo quadro
  const eixos = lin(frame, tTela, tTela + 10) * (1 - lin(frame, fim - 26, fim - 10));
  const apaga = 1 - 0.65 * eixos;
  const cinza = 0.3 * (1 - lin(frame, tTela, tTela + 10));
  const extras = 1 - lin(frame, fim - 26, fim - 10); // anel e linha

  const pontos: PontoMapa[] = [
    ...CINZA.map((c, i) => ({
      texto: '',
      x: mola(frame, tPerto, c.de[0], c.para[0]),
      y: mola(frame, tPerto, c.de[1], c.para[1]),
      rotulo: 'nenhum' as const,
      escala: entra(frame, tPal + i * 3, 170),
      opacidade: cinza,
    })),
    { texto: 'cachorro', x: FIM_MAPA.cachorro[0], y: FIM_MAPA.cachorro[1], escala: entra(frame, tCach - 2, 170), opacidade: apaga },
    { texto: 'gato', x: FIM_MAPA.gato[0], y: FIM_MAPA.gato[1], escala: entra(frame, tGato - 2, 170), opacidade: apaga },
    { texto: 'geladeira', x: FIM_MAPA.geladeira[0], y: FIM_MAPA.geladeira[1], escala: entra(frame, tGel - 2, 170), opacidade: apaga },
  ];

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tCach - 2} />
      <Som nome="tique" em={tGato - 2} />
      <Som nome="tique" em={tGel - 2} />
      <MapaSemantico
        x={CENTRO_X}
        top={MAPA_GRANDE.top}
        w={MAPA_GRANDE.w}
        h={MAPA_GRANDE.h}
        dx={naEsteira(frame, -6, 0, undefined, -1000)}
        pontos={pontos}
      >
        <div style={{ opacity: apaga * extras }}>
          <AnelMapa x={300} y={290} rx={160} ry={110} p={entra(frame, tGato + 8, 120)} />
          <SetaVetor de={FIM_MAPA.gato} para={FIM_MAPA.geladeira} p={lin(frame, tLonge - 4, tLonge + 14)} tracejada semPonta espessura={8} />
        </div>
        {eixos > 0 ? (
          <div style={{ opacity: eixos }}>
            {LEQUE.map((q, i) => (
              <SetaVetor key={i} de={ORIGEM} para={q} p={lin(frame, tMil - 10 + i * 3, tMil + 2 + i * 3)} espessura={6} recuo={0} />
            ))}
            <SetaVetor de={ORIGEM} para={[420, 430]} p={lin(frame, tTela, tTela + 14)} espessura={14} recuo={0} />
            <SetaVetor de={ORIGEM} para={[50, 80]} p={lin(frame, tTela + 8, tTela + 22)} espessura={14} recuo={0} />
            <Rotulo texto={frame >= tMil - 10 ? 'MILHARES DE DIREÇÕES' : '2 DIREÇÕES'} p={entra(frame, frame >= tMil - 10 ? tMil - 10 : tTela + 14, 180)} />
          </div>
        ) : null}
      </MapaSemantico>
    </>
  );
};

/** Fundo da sala de mapas com a rosa dos ventos girando sem salto entre blocos. */
export const fundoMapaContinuo = (b: number): React.FC => () => {
  const f = useCurrentFrame();
  return <FundoMapa giro={(inicioBloco(b) + f) * 0.3} />;
};

export const Mapa: CenaEp = {
  Conteudo,
  Fundo: fundoMapaContinuo(B),
  // uma câmera só, aproximando devagar; nada de cortes laterais no mapa
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'cachorro') - 2, CENTRO_X, 760, 1.08), ABERTO(palavra(B, 'tela') - 2)],
  transicao: 0, // o treino continua no mesmo quadro
};

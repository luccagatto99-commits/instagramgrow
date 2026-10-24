import React from 'react';
import { Caixa3D, No3D, hash01 } from '../components';
import { COR } from '../theme';

// ─── Equipamentos da fábrica ────────────────────────────────────────────────────────
// O que enche o caminho da câmera entre uma sala e outra: máquinas trabalhando, esteiras laterais
// levando caixas, paletes, vigas e luminárias no teto e faixas zebradas de segurança no chão.
// Tudo de traço (branco, preto e amarelo), com volume, e cada peça some antes de chegar perto da
// câmera (`zMax`), como o resto do palco 3D.

const P = COR.preto;
const ZEBRA = 34; // listras da faixa zebrada da marca

/** Faixa zebrada (listras a −45°, preto e amarelo) do tamanho do pai. */
const Zebra: React.FC<{ listra?: number }> = ({ listra = ZEBRA }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `repeating-linear-gradient(-45deg, ${P} 0 ${listra}px, ${COR.amarelo} ${listra}px ${listra * 2}px)`,
    }}
  />
);

const caminhoEngrenagem = (dentes: number, r1: number, r2: number) => {
  const pts: string[] = [];
  for (let i = 0; i < dentes * 4; i++) {
    const a = (i / (dentes * 4)) * Math.PI * 2;
    const r = i % 4 < 2 ? r2 : r1;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
};
const ENGRENAGEM = caminhoEngrenagem(10, 40, 54);

/**
 * Máquina da fábrica: bloco branco com medidor (ponteiro mexendo), engrenagem girando, grade de
 * ventilação e faixa zebrada na base. `variante` par ganha uma prensa no topo que bate com tranco
 * (desce rápido, sobe devagar); ímpar, um cano preto até o teto.
 */
export const Maquina3D: React.FC<{ x: number; z: number; t: number; variante?: number; teto: number }> = ({ x, z, t, variante = 0, teto }) => {
  const w = 320;
  const h = 380;
  const d = 260;
  const ponteiro = -40 + 55 * Math.sin(t / 11 + variante * 1.7);
  const ciclo = ((t + variante * 13) % 48) / 48;
  const desce = ciclo < 0.12 ? ciclo / 0.12 : 1 - (ciclo - 0.12) / 0.88;
  return (
    <No3D x={x} z={z}>
      <Caixa3D
        w={w}
        h={h}
        d={d}
        raio={28}
        borda={8}
        frente={
          <>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0 }}>
              <circle cx={96} cy={104} r={54} fill={COR.branco} stroke={P} strokeWidth={8} />
              {[-120, -60, 0, 60].map((a) => (
                <line key={a} x1={96 + Math.sin((a * Math.PI) / 180) * 40} y1={104 - Math.cos((a * Math.PI) / 180) * 40} x2={96 + Math.sin((a * Math.PI) / 180) * 50} y2={104 - Math.cos((a * Math.PI) / 180) * 50} stroke={P} strokeWidth={5} />
              ))}
              <line x1={96} y1={104} x2={96 + Math.sin((ponteiro * Math.PI) / 180) * 38} y2={104 - Math.cos((ponteiro * Math.PI) / 180) * 38} stroke={COR.vermelho} strokeWidth={7} strokeLinecap="round" />
              <circle cx={96} cy={104} r={8} fill={P} />
              <g transform={`translate(${222} ${104}) rotate(${(t * (variante % 2 ? -3 : 3)) % 360})`}>
                <path d={ENGRENAGEM} fill={COR.amarelo} stroke={P} strokeWidth={7} strokeLinejoin="round" />
                <circle r={14} fill={COR.branco} stroke={P} strokeWidth={7} />
              </g>
              {[0, 1, 2, 3].map((k) => (
                <rect key={k} x={40} y={196 + k * 26} width={w - 80} height={10} rx={5} fill={P} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 44, overflow: 'hidden', borderTop: `8px solid ${P}` }}>
              <Zebra listra={20} />
            </div>
          </>
        }
      />
      {variante % 2 === 0 ? (
        <>
          {[-1, 1].map((l) => (
            <No3D key={l} x={l * 110} y={-h}>
              <Caixa3D w={26} h={260} d={26} cor={P} borda={0} />
            </No3D>
          ))}
          <No3D y={-h - 260}>
            <Caixa3D w={250} h={30} d={60} cor={P} borda={0} />
          </No3D>
          <No3D y={-h - 30 - 150 * (1 - desce)}>
            <Caixa3D w={170} h={80} d={140} raio={10} borda={8} />
          </No3D>
        </>
      ) : (
        <No3D x={90} z={-40} y={-h}>
          <Caixa3D w={46} h={teto - h} d={46} cor={P} borda={0} />
        </No3D>
      )}
    </No3D>
  );
};

/** Palete preto com caixas brancas empilhadas (tokens à espera). */
export const Palete3D: React.FC<{ x: number; z: number; semente: number }> = ({ x, z, semente }) => {
  const altura = 1 + Math.floor(hash01(semente, 1) * 3);
  const caixas: React.ReactNode[] = [];
  for (let n = 0; n < altura; n++) {
    for (let k = 0; k < (n === altura - 1 ? 1 + Math.floor(hash01(semente, n + 5) * 2) : 2); k++) {
      caixas.push(
        <No3D key={`${n}:${k}`} x={-55 + k * 110} y={-30 - n * 104}>
          <Caixa3D w={100} h={100} d={100} raio={14} borda={7} />
        </No3D>,
      );
    }
  }
  return (
    <No3D x={x} z={z}>
      <Caixa3D w={240} h={30} d={160} cor={P} borda={0} />
      {caixas}
    </No3D>
  );
};

/**
 * Esteira lateral ao longo do corredor (eixo z), com caixas brancas indo para dentro da fábrica.
 * Feita em ladrilhos curtos; só desenha o que está longe da câmera.
 */
export const EsteiraCorredor: React.FC<{ x: number; de: number; ate: number; t: number; zMax: number }> = ({ x, de, ate, t, zMax }) => {
  const SEG = 300;
  const LARG = 120;
  const ALT = 120;
  const pecas: React.ReactNode[] = [];
  for (let z = ate; z > de; z -= SEG) {
    const zc = z - SEG / 2;
    if (zc + SEG / 2 > zMax) continue;
    pecas.push(
      <React.Fragment key={z}>
        {/* tampo da esteira, com os roletes passando */}
        <div
          style={{
            position: 'absolute',
            width: LARG,
            height: SEG + 1,
            left: x - LARG / 2,
            top: -ALT - SEG / 2,
            background: `repeating-linear-gradient(0deg, ${P} 0 26px, ${COR.amarelo} 26px 34px)`,
            backgroundPositionY: `${(t * 4) % 34}px`,
            transform: `translateZ(${zc}px) rotateX(90deg)`,
          }}
        />
        {/* lateral virada para o corredor */}
        <div
          style={{
            position: 'absolute',
            width: SEG + 1,
            height: ALT,
            left: x - Math.sign(x) * (LARG / 2) - SEG / 2,
            top: -ALT,
            background: P,
            transform: `translateZ(${zc}px) rotateY(90deg)`,
          }}
        />
      </React.Fragment>,
    );
  }
  // caixas andando para dentro (z diminuindo), uma a cada 420
  const ESP = 420;
  const caixas: React.ReactNode[] = [];
  const desl = (t * 6) % ESP;
  for (let z = ate - desl; z > de + 60; z -= ESP) {
    if (z + 60 > zMax) continue;
    caixas.push(
      <No3D key={`c${Math.round(z + desl)}`} x={x} y={-ALT} z={z}>
        <Caixa3D w={96} h={96} d={96} raio={14} borda={7} />
      </No3D>,
    );
  }
  return (
    <>
      {pecas}
      {caixas}
    </>
  );
};

/** Viga preta atravessando o teto, com duas luminárias penduradas. */
export const VigaTeto: React.FC<{ z: number; largura: number; teto: number }> = ({ z, largura, teto }) => (
  <No3D z={z}>
    <No3D y={-teto + 70}>
      <Caixa3D w={largura} h={70} d={60} cor={P} borda={0} />
    </No3D>
    {[-1, 1].map((l) => (
      <No3D key={l} x={l * 560} y={-teto + 70}>
        <div style={{ position: 'absolute', width: 8, height: 260, left: -4, top: 0, background: P }} />
        <No3D y={330}>
          <Caixa3D w={170} h={70} d={110} cor={P} borda={0} corTopo={P} />
        </No3D>
        <div style={{ position: 'absolute', width: 120, height: 22, left: -60, top: 330, background: COR.branco, border: `6px solid ${P}`, borderRadius: '0 0 60px 60px', boxSizing: 'border-box' }} />
      </No3D>
    ))}
  </No3D>
);

/** Faixa zebrada de segurança no chão, ao longo do corredor (eixo z), em ladrilhos curtos. */
export const FaixaChao: React.FC<{ x: number; de: number; ate: number; zMax: number }> = ({ x, de, ate, zMax }) => {
  const SEG = 340;
  const pecas: React.ReactNode[] = [];
  for (let z = ate; z > de; z -= SEG) {
    const zc = z - SEG / 2;
    if (zc + SEG / 2 > zMax) continue;
    pecas.push(
      <div
        key={z}
        style={{ position: 'absolute', width: 44, height: SEG + 1, left: x - 22, top: -SEG / 2, overflow: 'hidden', transform: `translate3d(0, -1px, ${zc}px) rotateX(90deg)` }}
      >
        <Zebra listra={18} />
      </div>,
    );
  }
  return <>{pecas}</>;
};

/** Batente com faixa zebrada na frente (a passagem entre salas, como portão de galpão). */
export const BatenteZebrado: React.FC<{ x: number; z: number; altura: number }> = ({ x, z, altura }) => (
  <No3D x={x} z={z}>
    <Caixa3D
      w={90}
      h={altura}
      d={120}
      borda={8}
      frente={
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, overflow: 'hidden', borderTop: `8px solid ${P}` }}>
          <Zebra />
        </div>
      }
    />
  </No3D>
);

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, BracoRobotico, Maquina, Som, poseParaAlvo, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { milhar } from '../ep11/comum';
import { Cadeirante, Cerebro, ChipFios, CaixaSaida, Cursor, Ficha, GraficoPicos, Moeda, Monitor, Num, PONTO_CHIP, Rot, Tabuleiro } from './comum';

/** visível de a até b: entra com mola e sai encolhendo */
const useFase = () => {
  const frame = useCurrentFrame();
  return (a: number, b = Infinity) => (frame >= a - 6 ? entra(frame, a - 6, 160) : 0) * (b === Infinity ? 1 : 1 - suave(frame, b - 8, 8));
};
const sem = { Fundo: () => null, planos: () => [ABERTO(0)] };

/** cavalo andando de casa em casa: lista de [frame, col, lin]; entre duas casas ele "pula" */
const casaCavalo = (frame: number, passos: [number, number, number][]): { pos: [number, number]; pulando: boolean } => {
  let pos: [number, number] = [passos[0][1], passos[0][2]];
  let pulando = false;
  for (let i = 1; i < passos.length; i++) {
    const [f, c, l] = passos[i];
    if (frame >= f) {
      const u = suave(frame, f, 14);
      pulando = u < 1;
      pos = [pos[0] + (c - pos[0]) * u, pos[1] + (l - pos[1]) * u];
    }
  }
  return { pos, pulando };
};

// ---------------------------------------------------------------- 1 · gancho
const Gancho: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const tJogou = palavra(0, 'jogou');
    const t90 = palavra(0, '90');
    const { pos, pulando } = casaCavalo(frame, [[0, 1, 5], [4, 2, 3], [tJogou, 4, 2], [t90, 3, 4]]);
    const pensa = (k: number) => 0.5 + 0.5 * Math.sin(frame / 6 - k);
    return (
      <>
        <Som nome="tique" em={4} volume={0.25} />
        <Som nome="tique" em={tJogou} volume={0.3} />
        <Som nome="tique" em={t90} volume={0.3} />
        <Cadeirante x={290} base={1000} escala={1.4} cinza={1} />
        {/* pensamento ligando a cabeça ao tabuleiro */}
        {[0, 1, 2].map((k) => (
          <div key={k} style={{
            position: 'absolute', left: 350 + k * 80, top: 610 - k * 30, width: 22 + k * 8, height: 22 + k * 8, borderRadius: 99,
            background: COR.branco, border: `5px solid ${COR.preto}`, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * pensa(k)})`,
          }} />
        ))}
        <Tabuleiro x={760} top={620} tam={340} cavalo={pos} pegou={pulando} />
      </>
    );
  },
};

// ---------------------------------------------------------------- 2 · Noland
const Noland: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const fase = useFase();
    const t2016 = palavra(1, '2016,');
    const tNoland = palavra(1, 'noland');
    const tOmbros = palavra(1, 'ombros');
    const t2024 = palavra(1, '2024,');
    const tNeura = palavra(1, 'neuralink,');
    const tElon = palavra(1, 'elon');
    const pAno = fase(t2016 - 4, tNoland);
    const pPessoa = fase(tNoland, t2024);
    const pPac = fase(t2024);
    return (
      <>
        <Som nome="tique" em={t2016} volume={0.3} />
        <Som nome="tique" em={tNoland} volume={0.3} />
        <Som nome="chiado" em={tOmbros} volume={0.15} />
        <Som nome="tique" em={t2024} volume={0.3} />
        <Ficha x={540} top={660} escala={pAno} largura={420}>
          <Num tam={110}>2016</Num>
          <Rot tam={36}>ACIDENTE</Rot>
          <Rot tam={26} cor="#777">LESÃO NA MEDULA</Rot>
        </Ficha>
        {pPessoa > 0.01 ? (
          <>
            <Etiqueta x={540} top={540} texto="NOLAND ARBAUGH" escala={pPessoa} />
            <div style={{ position: 'absolute', inset: 0, transform: `scale(${pPessoa})`, transformOrigin: '540px 1000px' }}>
              <Cadeirante x={540} base={1000} escala={1.35} cinza={lin(frame, tOmbros, tOmbros + 8)} />
            </div>
            <Etiqueta x={540} top={1050} texto="PARALISADO DOS OMBROS PARA BAIXO" cor={COR.vermelho} escala={frame >= tOmbros ? entra(frame, tOmbros, 180) * pPessoa : 0} />
          </>
        ) : null}
        <Ficha x={540} top={600} escala={pPac} largura={520}>
          <Num tam={96}>2024</Num>
          <Rot tam={40}>1º PACIENTE</Rot>
        </Ficha>
        <Etiqueta x={540} top={830} texto="NEURALINK" escala={frame >= tNeura ? entra(frame, tNeura, 180) * pPac : 0} />
        <Etiqueta x={540} top={920} texto="EMPRESA DO ELON MUSK" cor={COR.vermelho} escala={frame >= tElon ? entra(frame, tElon, 180) * pPac : 0} />
      </>
    );
  },
};

// ---------------------------------------------------------------- 3 · o chip
const Chip: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const fase = useFase();
    const tMoeda = palavra(2, 'moeda,');
    const tCranio = palavra(2, 'crânio.');
    const t64 = palavra(2, '64');
    const tCabelo = palavra(2, 'cabelo,');
    const tMil = palavra(2, 'mil');
    const tRobo = palavra(2, 'quem');
    const pA = fase(0, tCranio - 4);
    const pB = fase(tCranio - 4, t64);
    const pC = fase(t64, tCabelo - 4);
    const pD = fase(tCabelo - 4, tMil - 4);
    const pE = fase(tMil - 4, tRobo);
    const pF = fase(tRobo);
    // braço: vai do descanso até o chip e costura (sobe e desce)
    const chipX = 400 + PONTO_CHIP[0] * 0.95, chipY = 860 + PONTO_CHIP[1] * 0.95;
    const costura = Math.max(0, Math.sin((frame - tRobo) / 4)) * 26;
    const alvo = { x: chipX + 40, y: chipY - 30 + costura };
    const pose = poseParaAlvo({ x: 820, y: 1000 - 90 }, alvo, 170, 150, 200);
    return (
      <>
        <Som nome="tique" em={tMoeda} volume={0.3} />
        <Som nome="tique" em={tCranio} volume={0.3} />
        <Som nome="chiado" em={t64} volume={0.15} />
        <Som nome="ding" em={tMil + 20} volume={0.25} />
        <Som nome="maquina_loop" em={tRobo} volume={0.12} duracao={60} />
        {/* A: chip ao lado da moeda */}
        <ChipFios x={325} y={790} r={120} escala={pA} />
        <Moeda x={755} y={790} r={128} escala={frame >= tMoeda - 6 ? entra(frame, tMoeda - 6, 160) * pA : 0} />
        <Etiqueta x={325} top={950} texto="CHIP" escala={pA} />
        <Etiqueta x={755} top={950} texto="MOEDA DE R$ 1" escala={frame >= tMoeda - 6 ? entra(frame, tMoeda - 6, 160) * pA : 0} />
        {/* B: encaixado no crânio */}
        {pB > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${pB})`, transformOrigin: '540px 820px' }}>
            <Cerebro x={540} y={850} escala={1.15} cranio={1} chip={lin(frame, tCranio, tCranio + 14)} />
          </div>
        ) : null}
        {/* C: 64 fios */}
        <ChipFios x={540} y={680} r={95} fios={lin(frame, t64, t64 + 30)} escala={pC} />
        <Etiqueta x={540} top={940} texto="64 FIOS" escala={pC} />
        {/* D: fio x cabelo */}
        <Ficha x={540} top={640} escala={pD} largura={680}>
          <Rot tam={28}>FIO DE CABELO</Rot>
          <div style={{ height: 84, margin: '10px 20px 18px', background: '#5A4636', border: `5px solid ${COR.preto}`, borderRadius: 42 }} />
          <Rot tam={28} cor={COR.vermelho}>FIO DO CHIP</Rot>
          <div style={{ height: 6, margin: '18px 20px 8px', background: COR.preto, borderRadius: 3 }} />
          <Rot tam={22} cor="#777">AMPLIADO · MESMA ESCALA</Rot>
        </Ficha>
        {/* E: eletrodos */}
        <Ficha x={540} top={660} escala={pE} largura={520}>
          <Num tam={120}>{milhar(1024 * lin(frame, tMil - 2, tMil + 22))}</Num>
          <Rot tam={36}>ELETRODOS</Rot>
          <Rot tam={24} cor="#777">ESCUTAM OS NEURÔNIOS</Rot>
        </Ficha>
        {/* F: o robô costura */}
        {pF > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${pF})`, transformOrigin: '540px 900px' }}>
            <Cerebro x={400} y={860} escala={0.95} cranio={1} chip={1} fios={lin(frame, tRobo + 6, tRobo + 50)} />
            <BracoRobotico x={820} base={1000} pose={pose} garra={1} />
            <Etiqueta x={540} top={560} texto="ROBÔ CIRURGIÃO" escala={pF} />
          </div>
        ) : null}
      </>
    );
  },
};

// ---------------------------------------------------------------- 4 · os disparos
const Disparos: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const fase = useFase();
    const tPensa = palavra(3, 'pensa');
    const tMovimento = palavra(3, 'movimento');
    const tDisparam = palavra(3, 'disparam');
    const tMesmo = palavra(3, 'mesmo');
    const tLesionada = palavra(3, 'lesionada,');
    const tContinua = palavra(3, 'continua');
    const tEletrodos = palavra(3, 'eletrodos');
    const tEscutam = palavra(3, 'escutam.');
    const pBalao = fase(tPensa - 4, tMovimento + 10);
    const pMedula = lin(frame, tMesmo - 4, tMesmo + 10) * (1 - lin(frame, tEletrodos - 10, tEletrodos));
    const desce = suave(frame, tMesmo - 4, 14) * (1 - suave(frame, tEletrodos - 10, 12));
    // pulsos descendo pela medula e parando no X
    const sinais = [0, 1, 2, 3, 4].map((k) => {
      const t0 = tContinua - 10 + k * 16;
      return frame < t0 || frame > tEletrodos - 6 ? -1 : Math.min(0.999, (frame - t0) / 14);
    });
    const pGraf = fase(tEscutam - 4);
    return (
      <>
        <Som nome="chiado" em={tDisparam} volume={0.18} />
        <Som nome="carimbo" em={tLesionada} volume={0.3} />
        <Som nome="tique" em={tEscutam} volume={0.3} />
        <Cerebro x={540} y={820 - desce * 140 - (frame >= tEletrodos ? 60 * suave(frame, tEletrodos - 6, 12) : 0)} escala={1.2 - desce * 0.4 - (frame >= tEletrodos ? 0.2 * suave(frame, tEletrodos - 6, 12) : 0)}
          frame={frame} motor={lin(frame, tMovimento, tMovimento + 8)} faiscas={lin(frame, tDisparam, tDisparam + 6)}
          medula={pMedula} lesao={frame >= tLesionada ? entra(frame, tLesionada, 200) : 0} sinais={sinais}
          cranio={0} chip={frame >= tEletrodos - 6 ? lin(frame, tEletrodos - 6, tEletrodos + 6) : 0} fios={frame >= tEletrodos ? 1 : 0}
          escuta={lin(frame, tEscutam - 4, tEscutam + 6)} />
        {/* "pensa em mexer a mão" */}
        {pBalao > 0.01 ? (
          <div style={{ position: 'absolute', left: 820, top: 600, transform: `translate(-50%,0) scale(${pBalao})`, background: COR.branco, border: `8px solid ${COR.preto}`, borderRadius: 30, padding: '10px 18px', boxShadow: `12px 12px 0 ${COR.amarelo}` }}>
            <svg width={90} height={90} viewBox="-45 -45 90 90">
              <g transform={`rotate(${Math.sin(frame / 4) * 12})`} fill={COR.branco} stroke={COR.preto} strokeWidth={6} strokeLinejoin="round">
                <rect x={-22} y={-4} width={44} height={40} rx={12} />
                {[-16, -5, 6, 17].map((dx, i) => <rect key={i} x={dx - 5} y={-34 + (i === 0 || i === 3 ? 8 : 0)} width={10} height={34} rx={5} />)}
              </g>
            </svg>
          </div>
        ) : null}
        <Etiqueta x={540} top={560} texto="REGIÃO DO MOVIMENTO" cor={COR.vermelho} escala={fase(tMovimento, tMesmo)} />
        <Etiqueta x={790} top={880} texto="O SINAL PARA AQUI" cor={COR.vermelho} escala={fase(tLesionada + 4, tEletrodos - 8)} />
        <GraficoPicos x={540} top={875} w={600} h={120} canais={3} frame={frame} escala={pGraf} />
      </>
    );
  },
};

// ---------------------------------------------------------------- 5 · a IA
const IA: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const fase = useFase();
    const tCentenas = palavra(4, 'centenas');
    const tAi = palavra(4, 'aí');
    const tPonto = palavra(4, 'ponto');
    const tImagina = palavra(4, 'imaginava');
    const tModelo = palavra(4, 'modelo');
    const tAprendeu = palavra(4, 'aprendeu');
    const tEsq = palavra(4, 'esquerda,');
    const tDir = palavra(4, 'direita');
    const tClique = palavra(4, 'clique.');
    const pBag = fase(0, tAi);
    const pMaq = fase(tAi, tPonto - 4);
    const pTela = fase(tPonto - 4, tModelo - 2);
    const pComp = fase(tModelo - 2, tAprendeu - 2);
    const pSaida = fase(tAprendeu - 2);
    const canais = frame >= tCentenas ? 9 : 5;
    // o ponto anda na tela; o cursor (o que Noland imagina) vai atrás
    const caminho = (f: number): [number, number] => [240 + 170 * Math.sin(f / 22), 130 + 60 * Math.sin(f / 13)];
    const pt = caminho(frame - tPonto);
    const segue = lin(frame, tImagina, tImagina + 20);
    const cur = caminho(frame - tPonto - 8);
    const curPos: [number, number] = [pt[0] + (cur[0] - pt[0]) * segue + (1 - segue) * 120, pt[1] + (cur[1] - pt[1]) * segue + (1 - segue) * 70];
    const vai = Math.cos((frame - tPonto) / 22) > 0; // ponto indo para a direita?
    return (
      <>
        <Som nome="chiado" em={0} volume={0.12} />
        <Som nome="tique" em={tAi} volume={0.3} />
        <Som nome="tique" em={tPonto} volume={0.25} />
        <Som nome="tique" em={tEsq} volume={0.3} />
        <Som nome="tique" em={tDir} volume={0.3} />
        <Som nome="ding" em={tClique} volume={0.3} />
        <GraficoPicos x={540} top={640} w={740} h={canais === 9 ? 340 : 240} canais={canais} frame={frame} escala={pBag} />
        <Etiqueta x={540} top={560} texto="UMA BAGUNÇA" cor={COR.vermelho} escala={pBag} />
        {/* a máquina da IA */}
        {pMaq > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${pMaq})`, transformOrigin: '540px 820px' }}>
            <Maquina x={290} y={690} w={500} h={250} nome="DECODIFICADOR" termo="a IA">
              <GraficoPicos x={250} top={60} w={380} h={130} canais={3} frame={frame} />
            </Maquina>
          </div>
        ) : null}
        {/* o ponto na tela e o cursor */}
        <Monitor x={540} top={610} w={500} h={260} escala={pTela}>
          <circle cx={pt[0]} cy={pt[1]} r={22} fill={COR.azul} stroke={COR.preto} strokeWidth={6} />
          {frame >= tImagina - 4 ? <Cursor x={curPos[0]} y={curPos[1]} /> : null}
        </Monitor>
        {/* compara: disparos ↔ direção do ponto */}
        <GraficoPicos x={330} top={680} w={320} h={210} canais={4} frame={frame} ordem={1} destaque={[0, 1]} escala={pComp} />
        {pComp > 0.01 ? (
          <div style={{ position: 'absolute', left: 540, top: 760, transform: `translateX(-50%) scale(${pComp})`, fontFamily: FONTE.titulo, fontSize: 70, color: 'var(--tinta)' }}>=</div>
        ) : null}
        <Ficha x={760} top={690} escala={pComp} largura={310}>
          <svg width={150} height={90} viewBox="-75 -45 150 90" style={{ display: 'block', margin: '0 auto' }}>
            <path d={vai ? 'M -55 0 L 40 0 M 15 -28 L 45 0 L 15 28' : 'M 55 0 L -40 0 M -15 -28 L -45 0 L -15 28'} fill="none" stroke={COR.preto} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Rot tam={24}>DIREÇÃO DO PONTO</Rot>
        </Ficha>
        <Etiqueta x={540} top={560} texto="COMPARA" escala={pComp} />
        {/* aprendeu: entram os disparos, saem os comandos */}
        {pSaida > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${pSaida})`, transformOrigin: '540px 800px' }}>
            <Maquina x={290} y={610} w={500} h={170} nome="DECODIFICADOR" termo="a IA">
              <GraficoPicos x={250} top={30} w={380} h={110} canais={3} frame={frame} ordem={1} />
            </Maquina>
          </div>
        ) : null}
        <CaixaSaida x={275} base={1000} tipo="esq" escala={frame >= tEsq - 4 ? entra(frame, tEsq - 4, 180) * pSaida : 0} acende={frame >= tEsq ? 1 : 0} />
        <CaixaSaida x={540} base={1000} tipo="dir" escala={frame >= tDir - 4 ? entra(frame, tDir - 4, 180) * pSaida : 0} acende={frame >= tDir ? 1 : 0} />
        <CaixaSaida x={805} base={1000} tipo="clique" escala={frame >= tClique - 4 ? entra(frame, tClique - 4, 180) * pSaida : 0} acende={frame >= tClique ? 1 : 0} />
      </>
    );
  },
};

// ---------------------------------------------------------------- 6 · resultado
const Resultado: CenaEp = {
  ...sem,
  Conteudo: () => {
    const frame = useCurrentFrame();
    const fase = useFase();
    const tJogou = palavra(5, 'jogou');
    const tXadrez = palavra(5, 'xadrez');
    const tHoje = palavra(5, 'hoje,');
    const tDezenas = palavra(5, 'dezenas');
    const tControlando = palavra(5, 'controlando');
    const tCadeira = palavra(5, 'cadeira');
    const tPens = palavra(5, 'pensamento.');
    const pXadrez = fase(0, tHoje);
    const pGente = fase(tHoje - 2, tControlando);
    const pCad = fase(tControlando);
    // cursor vai até o cavalo, pega e leva
    const cursorPos: [number, number] = frame < tJogou ? [5, 0.5] : frame < tXadrez ? [5 - 3 * suave(frame, tJogou, 16), 0.5 + 1.5 * suave(frame, tJogou, 16)] : [2 + 2 * suave(frame, tXadrez, 16), 2 - suave(frame, tXadrez, 16)];
    const cav: [number, number] = frame < tXadrez ? [2, 2] : [2 + 2 * suave(frame, tXadrez, 16), 2 - suave(frame, tXadrez, 16)];
    const anda = lin(frame, tCadeira, tCadeira + 30) - lin(frame, tCadeira + 36, tCadeira + 60);
    return (
      <>
        <Som nome="tique" em={tXadrez} volume={0.3} />
        <Som nome="ding" em={tDezenas} volume={0.25} />
        <Etiqueta x={540} top={560} texto="AO VIVO · MARÇO 2024" cor={COR.vermelho} escala={pXadrez} />
        <Tabuleiro x={540} top={630} tam={370} cavalo={cav} cursor={cursorPos} pegou={frame >= tXadrez && frame < tXadrez + 16} escala={pXadrez} />
        <Ficha x={540} top={590} escala={pGente}>
          <Rot tam={40}>DEZENAS DE PACIENTES</Rot>
        </Ficha>
        {pGente > 0.01 ? [0, 1, 2, 3, 4].map((k) => (
          <Cadeirante key={k} x={220 + k * 160} base={1000} escala={0.72 * pGente} cinza={1} aceso={frame >= tDezenas + k * 5 ? lin(frame, tDezenas + k * 5, tDezenas + k * 5 + 6) : 0} />
        )) : null}
        {pCad > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${pCad})`, transformOrigin: '540px 1000px' }}>
            <Cadeirante x={440 + anda * 180} base={1000} escala={1.4} cinza={1} giro={anda * 300} />
          </div>
        ) : null}
        <Etiqueta x={540} top={580} texto="SÓ COM O PENSAMENTO" escala={frame >= tPens - 20 ? entra(frame, tPens - 20, 180) * pCad : 0} />
      </>
    );
  },
};

export const CENAS = [Gancho, Noland, Chip, Disparos, IA, Resultado];

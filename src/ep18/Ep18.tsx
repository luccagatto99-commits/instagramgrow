import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { CENAS as BLOCOS } from './blocos';
import { Fechamento } from './Fechamento';

const CENAS = [...BLOCOS, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'O PACIENTE', termo: 'paralisado desde 2016', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'O CHIP', termo: 'implante cerebral', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'OS DISPAROS', termo: 'neurônios do movimento', de: inicioBloco(3) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'SALA DE DECODIFICAÇÃO', termo: 'a IA', de: inicioBloco(4) + palavra(4, 'aí'), ate: inicioBloco(5) - 10 },
  { nome: 'AO VIVO', termo: 'o resultado', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(6) + 4 },
];

export const Ep18: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-18.mp3"
    musica="musica-tech-16.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    tema={TEMA_PRETO}
    assinatura={false}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(6)} />}
  />
);

export const EP18_DURACAO = DUR_TOTAL;

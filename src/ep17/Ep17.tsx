import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { Gancho } from './Bloco01Gancho';
import { Php } from './Bloco02Php';
import { Nota } from './Bloco03Nota';
import { IA } from './Bloco04IA';
import { Mundo } from './Bloco05Mundo';
import { Dica } from './Bloco06Dica';
import { Fechamento } from './Bloco07Fechamento';

const CENAS = [Gancho, Php, Nota, IA, Mundo, Dica, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'O PHP', termo: 'por trás dos sites', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'A FALHA', termo: 'php2shell', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'LABORATÓRIO', termo: 'a IA lendo o código', de: inicioBloco(3) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'ALERTA GERAL', termo: 'sites fora do ar', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'O QUE FAZER', termo: 'se você tem site', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(6) + 4 },
];

export const Ep17: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-17.mp3"
    musica="musica-tech-16.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    tema={TEMA_PRETO}
    assinatura={false}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(6)} />}
  />
);

export const EP17_DURACAO = DUR_TOTAL;

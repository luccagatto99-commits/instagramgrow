import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho, saidaManchete } from './Bloco01Gancho';
import { Golpe } from './Bloco02Golpe';
import { Virada } from './Bloco03Virada';
import { Numeros } from './Bloco04Numeros';
import { Digital } from './Bloco05Digital';
import { Prever } from './Bloco06Prever';
import { Prejuizo } from './Bloco07Prejuizo';
import { Volta } from './Bloco08Volta';
import { Fechamento } from './Bloco09Fechamento';

const CENAS = [Gancho, Golpe, Virada, Numeros, Digital, Prever, Prejuizo, Volta, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'BANCO ITALIANO', termo: 'Itália · fev 2026', de: saidaManchete() + 12, ate: inicioBloco(1) - 10 },
  { nome: 'DEPÓSITO DE DEFEITOS', termo: 'golpe', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'TOKENIZADOR DE SOM', termo: 'áudio → números', de: inicioBloco(3) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'LABORATÓRIO DE VOZ', termo: 'o padrão da voz', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'ROLETA', termo: 'prever o próximo som', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'DEPÓSITO DE DEFEITOS', termo: 'o prejuízo', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'a confirmação que vale', de: inicioBloco(7) + 4, ate: inicioBloco(8) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(8) + 4 },
];

export const Ep08: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-08.mp3"
    trilha={TRILHA}
    assinatura={false}
    tema={TEMA_PRETO}
  />
);

export const EP08_DURACAO = DUR_TOTAL;

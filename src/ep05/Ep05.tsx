import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Promessa } from './Bloco02Promessa';
import { Turing } from './Bloco03Turing';
import { Verao } from './Bloco04Verao';
import { Eliza } from './Bloco05Eliza';
import { Efeito } from './Bloco06Efeito';
import { Inverno } from './Bloco07Inverno';
import { Xadrez } from './Bloco08Xadrez';
import { Virada } from './Bloco09Virada';
import { Hoje } from './Bloco10Hoje';
import { Dica } from './Bloco11Dica';
import { Resumo } from './Bloco12Resumo';
import { Fechamento } from './Bloco13Fechamento';

const CENAS = [Gancho, Promessa, Turing, Verao, Eliza, Efeito, Inverno, Xadrez, Virada, Hoje, Dica, Resumo, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'ARQUIVO HISTÓRICO', termo: 'história da IA', de: inicioBloco(2) + 4, ate: inicioBloco(9) - 10 },
  { nome: 'LABORATÓRIO', termo: 'teste de Turing', de: inicioBloco(9) + 4, ate: inicioBloco(10) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(12) + palavra(12, 'turno') },
];

export const Ep05: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-05.mp3"
    trilha={TRILHA}
  />
);

export const EP05_DURACAO = DUR_TOTAL;

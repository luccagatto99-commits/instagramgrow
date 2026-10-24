import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Pergunta } from './Bloco02Pergunta';
import { Numero } from './Bloco03Numero';
import { Google } from './Bloco04Google';
import { Uau } from './Bloco05Uau';
import { Cerebro } from './Bloco06Cerebro';
import { Volta } from './Bloco07Volta';
import { Final } from './Bloco08Final';
import { Fechamento } from './Bloco09Fechamento';

const CENAS = [Gancho, Pergunta, Numero, Google, Uau, Cerebro, Volta, Final, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'OPENAI', termo: 'Sam Altman · set 2026', de: palavra(0, 'sam') - 4, ate: inicioBloco(1) - 6 },
  { nome: 'CARIMBADORA', termo: 'ação → número', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'LABORATÓRIO', termo: 'Google · RT-2 · 2023', de: inicioBloco(3) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'SALA DA DIRETORIA', termo: 'o cérebro do robô', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'ARQUIVO HISTÓRICO', termo: 'OpenAI e robôs', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'EXPEDIÇÃO', termo: 'a próxima resposta', de: inicioBloco(7) + 4, ate: inicioBloco(8) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(8) + 4 },
];

export const Ep09: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-09.mp3"
    trilha={TRILHA}
    assinatura={false}
    tema={TEMA_PRETO}
  />
);

export const EP09_DURACAO = DUR_TOTAL;

import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Promessa } from './Bloco02Promessa';
import { Nome } from './Bloco03Nome';
import { Escreve } from './Bloco04Escreve';
import { Rara } from './Bloco05Rara';
import { Conferencia } from './Bloco06Conferencia';
import { NaoSei } from './Bloco07NaoSei';
import { OndeErra } from './Bloco08OndeErra';
import { Cuidados } from './Bloco09Cuidados';
import { Resumo } from './Bloco10Resumo';
import { Fechamento } from './Bloco11Fechamento';

const CENAS = [Gancho, Promessa, Nome, Escreve, Rara, Conferencia, NaoSei, OndeErra, Cuidados, Resumo, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'DEPÓSITO DE DEFEITOS', termo: 'alucinação', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'ROLETA', termo: 'próxima palavra', de: inicioBloco(3) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'avaliação', de: inicioBloco(6) + palavra(6, 'estudo') - 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(10) + palavra(10, 'turno') },
];

export const Ep04: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-04.mp3"
    trilha={TRILHA}
  />
);

export const EP04_DURACAO = DUR_TOTAL;

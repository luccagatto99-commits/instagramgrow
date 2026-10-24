import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Nome } from './Bloco02Nome';
import { Compilador } from './Bloco03Compilador';
import { Volta } from './Bloco04Volta';
import { Padroes } from './Bloco05Padroes';
import { Qualidade } from './Bloco06Qualidade';
import { Prova } from './Bloco07Prova';
import { Navegador } from './Bloco08Navegador';
import { Limite } from './Bloco09Limite';
import { Fechamento } from './Bloco10Fechamento';

const CENAS = [Gancho, Nome, Compilador, Volta, Padroes, Qualidade, Prova, Navegador, Limite, Fechamento];

// Blocos 3 e 4 não têm placa de setor: a própria máquina (com placa) é o setor.
const TRILHA: PlacaTrilha[] = [
  { nome: 'ENGENHARIA REVERSA', termo: 'reconstruir o código', de: inicioBloco(1) + palavra(1, 'engenharia') - 4, ate: inicioBloco(2) - 10 },
  { nome: 'SALA DE PADRÕES', termo: 'a IA dá os nomes', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'comparação byte a byte', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'ARQUIVO HISTÓRICO', termo: 'caso real', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'EXPEDIÇÃO', termo: 'até o navegador', de: inicioBloco(7) + 4, ate: inicioBloco(8) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(9) + 4 },
];

export const Ep06: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-06.mp3"
    trilha={TRILHA}
  />
);

export const EP06_DURACAO = DUR_TOTAL;

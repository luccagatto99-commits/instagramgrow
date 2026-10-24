import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Promessa } from './Bloco02Promessa';
import { Etiqueta } from './Bloco03Etiqueta';
import { Lista } from './Bloco04Lista';
import { Mapa } from './Bloco05Mapa';
import { Treino } from './Bloco06Treino';
import { Virada } from './Bloco07Virada';
import { Importa } from './Bloco08Importa';
import { Dica } from './Bloco09Dica';
import { Resumo } from './Bloco10Resumo';
import { Fechamento } from './Bloco11Fechamento';
import './dados'; // valida os tokens contra o roteiro

const CENAS = [Gancho, Promessa, Etiqueta, Lista, Mapa, Treino, Virada, Importa, Dica, Resumo, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'TOKENIZADOR', termo: 'tokenização', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  // o almoxarifado vale do bloco 4 à dica: a placa fica parada enquanto o setor não muda
  { nome: 'ALMOXARIFADO', termo: 'embedding', de: inicioBloco(3) + 4, ate: inicioBloco(9) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(10) + palavra(10, 'turno') },
];

export const Ep02: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-02.mp3"
    trilha={TRILHA}
  />
);

export const EP02_DURACAO = DUR_TOTAL;

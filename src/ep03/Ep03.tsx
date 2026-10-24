import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Promessa } from './Bloco02Promessa';
import { Sigla } from './Bloco03Sigla';
import { Fila } from './Bloco04Fila';
import { Atencao } from './Bloco05Atencao';
import { Paralelo } from './Bloco06Paralelo';
import { PorDentro } from './Bloco07Predio';
import { Ironia } from './Bloco08Ironia';
import { Dica } from './Bloco09Dica';
import { Resumo } from './Bloco10Resumo';
import { Fechamento } from './Bloco11Fechamento';

const CENAS = [Gancho, Promessa, Sigla, Fila, Atencao, Paralelo, PorDentro, Ironia, Dica, Resumo, Fechamento];
const IDEIA = inicioBloco(4) + palavra(4, 'ideia');

const TRILHA: PlacaTrilha[] = [
  // o arquivo histórico vale da fila até a ficha do artigo
  { nome: 'ARQUIVO HISTÓRICO', termo: 'antes de 2017', de: inicioBloco(3) + 4, ate: IDEIA - 14 },
  { nome: 'SALA DE REUNIÃO', termo: 'atenção', de: IDEIA - 4, ate: inicioBloco(5) - 10 },
  { nome: 'LINHA DE MONTAGEM', termo: 'camadas', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(10) + palavra(10, 'turno') },
];

export const Ep03: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-03.mp3"
    trilha={TRILHA}
  />
);

export const EP03_DURACAO = DUR_TOTAL;

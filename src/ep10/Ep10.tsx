import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Pergunta } from './Bloco02Pergunta';
import { Estragar } from './Bloco03Estragar';
import { Contrario } from './Bloco04Contrario';
import { Criando } from './Bloco05Criando';
import { Maos } from './Bloco06Maos';
import { Final } from './Bloco07Final';
import { Fechamento } from './Bloco08Fechamento';

const CENAS = [Gancho, Pergunta, Estragar, Contrario, Criando, Maos, Final, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'ESTÚDIO DE IMAGEM', termo: 'difusão', de: palavra(0, 'pontos') - 4, ate: inicioBloco(1) + palavra(1, 'treino.') - 10 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'treino', de: inicioBloco(1) + palavra(1, 'treino.'), ate: inicioBloco(4) - 10 },
  { nome: 'ESTÚDIO DE IMAGEM', termo: 'geração por difusão', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'DEPÓSITO DE DEFEITOS', termo: 'mãos erradas', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'EXPEDIÇÃO', termo: 'a imagem pronta', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(7) + 4 },
];

export const Ep10: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-10.mp3"
    trilha={TRILHA}
    assinatura={false}
  />
);

export const EP10_DURACAO = DUR_TOTAL;

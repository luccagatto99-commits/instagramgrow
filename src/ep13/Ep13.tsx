import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { Gancho } from './Bloco01Gancho';
import { Camera } from './Bloco02Camera';
import { Relogio } from './Bloco03Relogio';
import { Conta } from './Bloco04Conta';
import { Frear } from './Bloco05Frear';
import { Brasil } from './Bloco06Brasil';
import { Dentro } from './Bloco07Dentro';
import { Fechamento } from './Bloco08Fechamento';

const CENAS = [Gancho, Camera, Relogio, Conta, Frear, Brasil, Dentro, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'CÂMERA', termo: 'luz infravermelha', de: inicioBloco(1) + 4, ate: inicioBloco(1) + palavra(1, 'na') - 10 },
  { nome: 'LEITOR DE PLACAS', termo: 'a IA lê letra por letra', de: inicioBloco(1) + palavra(1, 'na') + 4, ate: inicioBloco(2) - 10 },
  { nome: 'RELÓGIO', termo: 'placa + hora exata', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'CALCULADORA', termo: 'velocidade média', de: inicioBloco(3) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'PISTA DE TESTE', termo: 'frear não adianta', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'NO BRASIL', termo: 'em teste, sem multa', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'INSPEÇÃO', termo: 'a IA olha dentro do carro', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(7) + 4 },
];

export const Ep13: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-13.mp3"
    musica="musica-tech.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    assinatura={false}
    tema={TEMA_PRETO}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(7)} />}
  />
);

export const EP13_DURACAO = DUR_TOTAL;

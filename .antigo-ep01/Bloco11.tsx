import React from 'react';
import { PlacaDeAviso, Som } from '../components';
import { palavra } from './tempo';

const B = 10;
export const PERFIL = '@a.fabrica';

/** Fechamento padrão: placa de aviso (a placa "TURNO ENCERRADO" vem da trilha de placas). */
export const Bloco11: React.FC = () => (
  <>
    <Som nome="apito" em={palavra(B, 'turno')} />
    <PlacaDeAviso
      linha1="Cansado de só colar prompt e não aprender nada?"
      faixa="SEGUE. A FÁBRICA ABRE TODA SEMANA."
      perfil={PERFIL}
      inicio={palavra(B, 'cansado') - 4}
      inicioFaixa={palavra(B, 'segue.') - 2}
      inicioPerfil={palavra(B, 'fábrica')}
      top={430}
    />
  </>
);

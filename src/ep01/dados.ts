import { encode, decode } from 'gpt-tokenizer/encoding/o200k_base';

/** Tokens reais do o200k_base (GPT-4o). */
export type Tok = { t: string; id: number };
export const tokenizar = (texto: string): Tok[] => encode(texto).map((id) => ({ t: decode([id]), id }));

export const CAPITAL = tokenizar('Qual a capital do Brasil?');
export const CORACAO = tokenizar('coração');
export const BRASIL = tokenizar(' Brasil');
export const MORANGO = tokenizar('morango');
export const SOLETRADO = tokenizar('m-o-r-a-n-g-o');

// Confere com a tabela "Dados validados" do roteiro. Se não bater, o render falha.
const esperado: [Tok[], string[], number[]][] = [
  [CAPITAL, ['Qual', ' a', ' capital', ' do', ' Brasil', '?'], [16752, 261, 9029, 621, 15278, 30]],
  [CORACAO, ['c', 'oração'], [66, 38482]],
  [BRASIL, [' Brasil'], [15278]],
  [MORANGO, ['mor', 'ango'], [63985, 7518]],
];
for (const [toks, ts, ids] of esperado) {
  const ok = toks.length === ts.length && toks.every((k, i) => k.t === ts[i] && k.id === ids[i]);
  if (!ok) throw new Error(`Tokenizador não bate com o roteiro: ${JSON.stringify(toks)}`);
}
if (SOLETRADO.length !== 7) throw new Error('m-o-r-a-n-g-o deveria ter 7 tokens');

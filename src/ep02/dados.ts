import { encode, decode } from 'gpt-tokenizer/encoding/o200k_base';

/** Tokens reais do o200k_base (GPT-4o). */
export type Tok = { t: string; id: number };
export const tokenizar = (texto: string): Tok[] => encode(texto).map((id) => ({ t: decode([id]), id }));

export const CACHORRO = tokenizar(' cachorro')[0];
export const GATO = tokenizar(' gato')[0];
export const MANGA = tokenizar(' manga')[0];
export const GELADEIRA = tokenizar(' geladeira');

// Confere com a tabela "Dados validados" do roteiro. Se não bater, o render falha.
const esperado: [Tok[], string[], number[]][] = [
  [tokenizar(' cachorro'), [' cachorro'], [168983]],
  [tokenizar(' gato'), [' gato'], [99767]],
  [GELADEIRA, [' gel', 'adeira'], [8063, 83302]],
  [tokenizar(' manga'), [' manga'], [53844]],
];
for (const [toks, ts, ids] of esperado) {
  const ok = toks.length === ts.length && toks.every((k, i) => k.t === ts[i] && k.id === ids[i]);
  if (!ok) throw new Error(`Tokenizador não bate com o roteiro: ${JSON.stringify(toks)}`);
}

/** GPT-3 175B: 12.288 números por token (d_model, "Language Models are Few-Shot Learners", 2020). */
export const DIM_GPT3 = 12288;
/** São Paulo (praça da Sé), arredondado. */
export const SP = { lat: '−23,55', long: '−46,63' };

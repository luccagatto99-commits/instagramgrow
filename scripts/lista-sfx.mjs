// Gera src/sfx-disponiveis.ts com os sons que existem em public/sfx/
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
const dir = 'public/sfx';
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mp3')) : [];
writeFileSync('src/sfx-disponiveis.ts', `// gerado por scripts/lista-sfx.mjs\nexport const SFX_DISPONIVEIS: string[] = ${JSON.stringify(files)};\n`);
const esperados = ['cartao_ponto', 'tique', 'guilhotina', 'carimbo', 'sirene', 'apito', 'maquina_loop'];
const faltam = esperados.filter((n) => !files.includes(n + '.mp3'));
if (faltam.length) console.warn('AVISO: sons faltando em public/sfx/:', faltam.join(', '), '- o vídeo sai sem eles.');

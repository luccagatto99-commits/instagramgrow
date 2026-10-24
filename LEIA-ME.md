# Pasta da página — A Fábrica

Tudo o que você precisa para produzir os vídeos, em ordem de uso.

```
CLAUDE.md                     → regras da identidade para o Claude Code (fica na raiz do projeto)
01-marca/
  manual-da-marca.pdf         → o manual completo: posicionamento, voz, universo, visual, som, fórmula
  identidade-visual.html      → abra no navegador: cores, fontes, componentes e quadros de referência
  tokens.json                 → cores, fontes, tamanhos e sons em formato que o código lê
  logo/                       → foto de perfil, logo horizontal e vertical, selo para os vídeos,
                                fundo da tela final, símbolo em SVG e capas dos destaques
02-roteiros/
  30-roteiros.md              → os 30 roteiros técnicos (formato para colar no Claude Code)
  30-roteiros.pdf             → os mesmos, para ler
03-planejamento/
  plano-de-conteudo.md        → histórico: ideias, bios, nomes e pesquisas (parte do visual ali é antigo)
04-video-01/
  roteiro.md                  → roteiro final do vídeo 01, alinhado à narração
  narracao-elevenlabs.txt     → texto exato para colar no ElevenLabs
  dicas-elevenlabs.md         → como gerar a voz
  prompt-claude-code.md       → o que colar no Claude Code
05-sons/
  sons-necessarios.md         → os 7 sons da marca e onde achar
```

## Montar o perfil

- Foto: `01-marca/logo/foto-perfil.png`
- Destaques: as capas em `01-marca/logo/destaques/`
- Bio e nome: veja a conversa (sugestão: "IA não é mágica. É fábrica.")

## Passo a passo do vídeo 01

1. Crie uma pasta para o projeto dos vídeos e copie para ela o `CLAUDE.md` e as pastas `01-marca`, `02-roteiros` e `04-video-01`. Copie também `01-marca/logo/selo-transparente.png` e `01-marca/logo/fundo-tela-final.png` para `public/marca/`.
2. Gere a voz no ElevenLabs com `04-video-01/narracao-elevenlabs.txt` (veja as dicas) e salve como `public/narracao.mp3` dentro dessa pasta.
3. Baixe os sons da lista em `05-sons` e salve em `public/sfx/`.
4. Abra o Claude Code nessa pasta e cole o conteúdo de `04-video-01/prompt-claude-code.md`.
5. Confira os frames que ele te mandar, peça ajustes e poste.

Para os próximos vídeos: gere a narração a partir da coluna "Narração" do roteiro escolhido (escreva os números por extenso) e peça ao Claude Code: "Monte o vídeo NN seguindo o CLAUDE.md, com o roteiro NN de 02-roteiros/30-roteiros.md".

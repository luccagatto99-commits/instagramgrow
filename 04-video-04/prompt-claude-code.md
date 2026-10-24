# Prompt para colar no Claude Code — Vídeo 04

Antes de colar: copie a pasta `04-video-04` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 04 seguindo o CLAUDE.md deste projeto, no TEMA PRETO (seção "Temas por trio"), reaproveitando os componentes já criados (PlacaDeArea, CaixaToken, Esteira, Maquina, Selo, PlacaDeAviso, Legenda, FichaArquivo, TelaDividida). O roteiro está em `04-video-04/roteiro.md` e o texto exato da narração em `04-video-04/narracao-elevenlabs.txt`. Duração de cerca de 2 min; algo muda na tela a cada 2–3 s.

Componentes novos (reutilizáveis):
- **Bonequinho**: personagem de contorno preto simples (cabeça redonda, corpo em traço grosso), com acessórios trocáveis (maleta, etc.). Sem rosto detalhado.
- **FichaDocumento**: cartão branco com contorno, rótulo no topo (ex.: "PROCESSO"), nome e número.
- **Carimbo**: carimbo vermelho girado que "bate" na tela com tranco (texto configurável, ex.: NÃO EXISTE).
- **Checklist**: placa branca com sombra dura e itens que recebem ✓ verde um por um.
- **FolhaDeProva**: folha com questões, ✓ e pontuação, para o bloco 6.

Regras deste vídeo: nomes e números de processos nas fichas são INVENTADOS e genéricos (nunca os reais do caso); ninguém do caso é citado por nome. Sem logo da OpenAI; o nome aparece só como texto na ficha.

Sincronização com o áudio:
1. Leia a duração de `public/narracao.mp3`. O vídeo deve ter essa duração + 1,5 s parados no final.
2. A narração tem 10 blocos (um por parágrafo do .txt). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 9 pausas mais longas como divisões entre blocos e confira se a ordem bate com o texto. Se não bater, use os tempos estimados do roteiro e me avise.
3. Dentro de cada bloco, distribua as palavras da legenda proporcionalmente ao número de caracteres.
4. Eventos nas palavras: o bonequinho com maleta aparece em "Imagine um advogado"; as seis fichas de processo entram em "seis processos"; a mesa do juiz aparece em "leva tudo ao juiz"; o carimbo NÃO EXISTE bate nelas em "nenhum deles existe"; a ficha "Nova York · 2023 · caso real" aparece em "Isso aconteceu de verdade"; a sirene toca e a porta da sala vazia abre em "E não existe, dentro dela"; o placar "chutar 1 × 0 não sei" aparece em "nunca dá"; as seis fichas do gancho voltam à esteira em "advogados de Nova York" e a caneta desenha uma ficha nova em "escreveu"; cada item do checklist marca na sua frase; o bloco 9 fica com tela limpa; no bloco 10, a placa de aviso diz "Siga a fábrica" e a faixa vermelha "UMA PEÇA NOVA TODO DIA".

A capa já está pronta em `04-video-04/capa.png`. Copie para `out/ep04/`.

Entregue em `out/ep04/`: video.mp4, capa.png, legendas.srt e legenda_post.txt (texto no fim do roteiro). Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, olhe cada um e corrija: texto cortado, algo na zona proibida, cor fora do significado, nome real de livro ou autor, logo de empresa. Depois me mande um resumo de 3 linhas e os frames.

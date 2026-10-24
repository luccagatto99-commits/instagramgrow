# Prompt para colar no Claude Code — Vídeo 02

Antes de colar: copie a pasta `04-video-02` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3` (substituindo a do vídeo 01, ou use `public/narracao-02.mp3` e avise no prompt).

---

Monte o vídeo 02 seguindo o CLAUDE.md deste projeto, reaproveitando os componentes que você criou no vídeo 01. O roteiro está em `04-video-02/roteiro.md` e o texto exato da narração em `04-video-02/narracao-elevenlabs.txt`. Duração de cerca de 1 min 50 s; algo muda na tela a cada 2–3 s.

Componentes novos que este vídeo precisa (crie de forma reutilizável, porque vão voltar em outros vídeos):
- **MapaSemantico**: um mapa 2D simples (fundo branco, contorno preto, sem eixos numerados) onde caixas-token aparecem como pontos com rótulo, e podem deslizar de posição com spring.
- **FitaDeNumeros**: uma fita horizontal saindo de uma gaveta, com números decimais em JetBrains Mono azul, que estica e rola.
- **SetaVetor**: seta preta grossa entre dois pontos do mapa, usada no bloco 6 (homem → mulher, rei → rainha) desenhada em paralelo.

Sincronização com o áudio:
1. Leia a duração de `public/narracao.mp3`. O vídeo deve ter essa duração + 1,5 s parados no final.
2. A narração tem 8 blocos (um por parágrafo do .txt). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 7 pausas mais longas como divisões entre blocos e confira se a ordem bate com o texto. Se não bater, use os tempos estimados do roteiro e me avise.
3. Dentro de cada bloco, distribua as palavras da legenda proporcionalmente ao número de caracteres.
4. Eventos nas palavras: o "?" cai em "parecidos?"; as fichas de CPF aparecem em "CPF"; o contador para em 12.288 em "doze mil"; "geladeira" é rejeitada em "Ninguém leva a geladeira"; a sirene toca em "Em dois mil e treze"; "rainha" acende em verde na palavra "rainha".

Dados: gere os tokens e IDs com `gpt-tokenizer/encoding/o200k_base` e confira com a tabela "Dados validados" do roteiro. Os números da fita do bloco 3 são ilustrativos (marque com o selo ILUSTRATIVO); o 12.288 é real (selo REAL).

A capa já está pronta em `04-video-02/capa.png`. Copie para `out/ep02/`.

Entregue em `out/ep02/`: video.mp4, capa.png, legendas.srt e legenda_post.txt (texto no fim do roteiro). Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, olhe cada um e corrija: texto cortado, algo na zona proibida, cor fora do significado, ID errado. Depois me mande um resumo de 3 linhas e os frames.

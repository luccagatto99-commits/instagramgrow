# Prompt para colar no Claude Code — Vídeo 03

Antes de colar: copie a pasta `04-video-03` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 03 seguindo o CLAUDE.md deste projeto, reaproveitando os componentes já criados (PlacaDeArea, CaixaToken, Esteira, Maquina, Selo, PlacaDeAviso, Legenda, MapaSemantico se precisar). O roteiro está em `04-video-03/roteiro.md` e o texto exato da narração em `04-video-03/narracao-elevenlabs.txt`. Duração de cerca de 2 min; algo muda na tela a cada 2–3 s.

Componentes novos (reutilizáveis):
- **FichaArquivo**: ficha de arquivo histórico (cartão branco com contorno, título, ano), para citar artigos e datas.
- **Predio**: um andar em corte que se replica para cima, com contador de andares.
- **TelaDividida**: duas metades lado a lado para comparações (antes × depois).

Regra deste vídeo: NÃO usar logos de Google, OpenAI, ChatGPT, Claude ou Gemini. Os nomes aparecem só como texto nas placas e caixas.

Sincronização com o áudio:
1. Leia a duração de `public/narracao.mp3`. O vídeo deve ter essa duração + 1,5 s parados no final.
2. A narração tem 9 blocos (um por parágrafo do .txt). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 8 pausas mais longas como divisões entre blocos e confira se a ordem bate com o texto. Se não bater, use os tempos estimados do roteiro e me avise.
3. Dentro de cada bloco, distribua as palavras da legenda proporcionalmente ao número de caracteres.
4. Eventos nas palavras: a caixa T dá o tranco em "Google" (bloco 1); cada caixa G/P/T abre na sua palavra (Generativo, Pré-treinado, Transformer); as primeiras caixas da fila apagam em "esquecido"; a GPU aparece em "placa de vídeo"; o contador do prédio para em 96 em "noventa e seis"; a sirene toca em "Agora a ironia".

A capa já está pronta em `04-video-03/capa.png`. Copie para `out/ep03/`.

Entregue em `out/ep03/`: video.mp4, capa.png, legendas.srt e legenda_post.txt (texto no fim do roteiro). Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, olhe cada um e corrija: texto cortado, algo na zona proibida, cor fora do significado, logo de empresa na tela. Depois me mande um resumo de 3 linhas e os frames.

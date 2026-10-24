# Prompt para colar no Claude Code — Vídeo 01

Antes de colar: a pasta do projeto precisa ter o `CLAUDE.md` na raiz, a narração salva em `public/narracao.mp3` e os sons em `public/sfx/` (lista em `05-sons/sons-necessarios.md`).

---

Monte o vídeo 01 seguindo o CLAUDE.md deste projeto. O roteiro completo está em `04-video-01/roteiro.md` e o texto exato da narração em `04-video-01/narracao-elevenlabs.txt`. É um vídeo de cerca de 2 minutos, então o ritmo visual importa ainda mais: algo muda na tela a cada 2–3 s.

Se o projeto Remotion ainda não existir, crie-o nesta pasta e crie os componentes reutilizáveis descritos no CLAUDE.md (PlacaDeArea, CaixaToken, Esteira, Maquina, Selo, PlacaDeAviso, Legenda). Eles serão usados em todos os próximos vídeos, então capriche neles.

Sincronização com o áudio:
1. Leia a duração de `public/narracao.mp3`. O vídeo deve ter essa duração + 1,5 s parados no final.
2. A narração tem 9 blocos, separados por pausas (um por parágrafo do .txt). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35` para achar as pausas e definir início e fim de cada bloco. Atenção: dentro dos blocos também há pausas curtas (reticências); escolha as 8 pausas mais longas como divisões entre blocos e confira se a ordem bate com o texto. Se não bater, use os tempos estimados do roteiro e me avise.
3. Dentro de cada bloco, distribua as palavras da legenda proporcionalmente ao número de caracteres de cada palavra.
4. Os eventos visuais acontecem nas palavras indicadas no roteiro. Exemplos: o "?" vermelho cai em "não é burrice"; a caixa do morango vai para o canto com cadeado em "enxerga o texto" e só volta em "Agora volta pro morango"; no bloco 5, o catálogo mostra a peça "oração" já existente antes da guilhotina cortar "coração".
5. A caixa do morango com cadeado fica visível no canto superior esquerdo (dentro da zona segura) do bloco 1 até o bloco 7.

Dados: gere TODOS os tokens e IDs com `gpt-tokenizer/encoding/o200k_base` e confira com a tabela "Dados validados" do roteiro. Se algo não bater, pare e me avise.

Entregue em `out/ep01/`: video.mp4, capa.png, legendas.srt e legenda_post.txt (o texto está no fim do roteiro). Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, olhe cada um e corrija: texto cortado, algo na zona proibida, cor fora do significado, ID errado. Depois me mande um resumo de 3 linhas e os frames.

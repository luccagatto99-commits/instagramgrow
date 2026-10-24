# Prompt para colar no Claude Code — Vídeo 11

Antes de colar: copie a pasta `04-video-11` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 11 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 15 do feed), reaproveitando os componentes já criados (inclusive o **QuadroRuido** do vídeo 10, se já existir). O roteiro está em `04-video-11/roteiro.md` e a narração em `04-video-11/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 89 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra a tela de pontos aleatórios piscando (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **RoloDeFilme**: faixa preta com furos amarelos e N quadros; cada quadro aceita um QuadroRuido com `nivel` próprio.
- **CenaCachorroPraia**: cena desenhada de contorno (cachorro, mar, sol) com leve animação (onda, pelo balançando) e parâmetro de cor do cachorro (para a demonstração do erro).
- **LigacaoAtencao**: linhas azuis animadas ligando o mesmo ponto em quadros vizinhos.
- **CopoMesa**: copo de contorno que atravessa a mesa.
- **Cronometro90**: selo vermelho "em 90s" (mesmo estilo da capa) que, em "noventa segundos", vira um cronômetro 1:30 contando para trás; fica pequeno no canto superior (dentro da zona segura) até o fim e marca 0:00 no fechamento.

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 7 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 6 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o selo "em 90s" aparece no frame 0 e vira cronômetro em "noventa segundos"; a caixa "um cachorro na praia" aparece em "cena que você pediu"; os pontos somem em "vai limpando"; a COBRIDORA em "coberto de pontos"; o ✓ em "limpar de volta"; o contador em "milhões de vezes"; o contador 10 s = 300 imagens em "trezentas imagens"; o cachorro troca de cor em "mudaria de cor"; o fundo treme em "tremendo"; todos os quadros limpam juntos em "ao mesmo tempo"; as linhas azuis da orelha em "olha para a orelha no momento seguinte"; o loop da onda em "a onda que quebra"; o pelo em "pelo que balança"; o copo atravessa em "atravessa a mesa"; o braço a mais em "braço a mais"; a frase final em "sem aprender as regras".

Regras: sem logos de geradores de vídeo e sem pessoas reais. Animações levam selo ILUSTRATIVO. Nada encostando nas bordas: respeite as margens da zona segura em todas as cenas.

A capa já está pronta em `04-video-11/capa.png`; copie para `out/ep11/`.

Entregue em `out/ep11/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, elementos encostando nas bordas, cores, logos). Depois me mande um resumo de 3 linhas e os frames.

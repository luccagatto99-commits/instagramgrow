# Prompt para colar no Claude Code — Vídeo 06

Antes de colar: copie a pasta `04-video-06` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 06 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 7 do feed), reaproveitando os componentes já criados. O roteiro está em `04-video-06/roteiro.md` e a narração em `04-video-06/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 90 segundos (máximo 90; se o áudio passar de 92 s, me avise antes de montar). Ele precisa ser o mais forte da página: algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra a janela do navegador com a aba GTA 5 carregando (nada de abertura ou logo).

Componentes novos (reutilizáveis): **JanelaNavegador** (janela genérica com 3 bolinhas, abas e área de conteúdo; aceita carimbo), **FitaDeNumeros** (fita de bytes hexadecimais azuis em JetBrains Mono correndo), **Cofre** (caixa preta com porta que abre), **Contador** (número azul que corre até um valor), **ComparadorDeBytes** (duas fitas de bytes alinhadas; cada byte fica verde ou vermelho), **Palpites** (3 barras azuis com porcentagens, a vencedora fica verde).

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 10 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 9 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: ▶ JOGAR aparece em "navegador"; o instalador é riscado em "Sem instalar nada"; o carimbo SAIU DO AR bate em "sumiu"; a placa ENGENHARIA REVERSA desce em "engenharia reversa"; o mascote pega a lupa em "a IA"; os nomes voam para a lixeira em "sem os nomes"; a esteira anda ao contrário em "caminho de volta"; "var_8" pisca em "variável oito"; os palpites aparecem em "reconhece o padrão" e "vida" vence em "Deve ser a vida"; a folha é reescrita em "código mais provável"; a comparação acontece em "comparado com o original", com ✗ em "Diferente?" e a seta de loop em "tenta de novo"; os contadores sobem em "dezessete", "três meses" e "noventa e nove"; a caixa voa para o navegador em "navegador"; o cofre abre em "vazado"; "copia o que faz" e "não o que tem" aparecem sincronizados; a lista vazia do player aparece em "sem músicas"; o carimbo SAIU DO AR volta em "o GTA sumiu".

Regras: sem imagens, logos ou personagens de GTA, Halo, Call of Duty, Spotify ou Chrome (nomes só em texto); sem rostos reais; não mostrar URLs nem nomes de ferramentas de engenharia reversa. Cenas com fatos levam selo REAL; código e interfaces desenhadas levam ILUSTRATIVO.

A capa já está pronta em `04-video-06/capa.png`; copie para `out/ep06/`.

Entregue em `out/ep06/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.

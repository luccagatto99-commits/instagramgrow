# Vídeo 06 · Engenharia reversa com IA (o GTA no navegador)

- **Duração estimada:** cerca de 90 s a 155 palavras/min (máximo 90 s).
- **Tema:** AMARELO (post 7 do feed, abre a nova linha amarela).
- **Vídeo independente.**
- **Capa:** Nº 006 · faixa "ENGENHARIA REVERSA COM IA" · "GTA 5" gigante em bloco preto inclinado · "rodando numa aba do navegador" · janela de navegador com carimbo SAIU DO AR. Sem logo oficial do GTA (marca registrada). Arquivo pronto: `capa.png`.

## Técnicas de retenção usadas (e onde)

| Técnica | Onde |
| --- | --- |
| Interrupção de padrão no frame 0 (algo impossível acontecendo) | Bloco 1: GTA abrindo numa aba, já em movimento |
| Tensão + mistério na 1ª frase ("horas depois, o site sumiu") | Bloco 1 |
| Escala / prova social ("não foi o único") | Bloco 2 |
| Nome do assunto cedo + promessa ("a IA deixou isso fácil" — como?) respondida nos blocos 3–6; "por que sumiu?" só no bloco 9 | Blocos 2 → 6 → 9 |
| Mecanismo explicado passo a passo, cada passo com uma máquina (compilador → desmontadora → sala de padrões → controle de qualidade) | Blocos 3–6 |
| Números específicos (17 IAs, 3 meses, 99%) | Bloco 7 |
| Microrreviravolta no meio do vídeo, quando a retenção cai ("provável não é certo") | Bloco 6, por volta de 50 s |
| Quebra de crença do público (clone do Spotify vem sem músicas) — posicionamento anti-guru | Bloco 9 |
| Frase-resumo que dá vontade de salvar e mandar | Bloco 9: "copia o que faz, não o que tem" |
| Final que volta ao gancho (loop fechado → incentiva rever) | Bloco 9: "por isso o GTA sumiu em horas" |
| Algo muda a cada 1,5–2 s; legenda palavra por palavra sempre na tela | Vídeo inteiro |

## Dados reais (conferidos)

- **GTA 5 no navegador:** em 6/10/2026, o site playgta5.com rodava o GTA V numa aba, via WebAssembly; o desenvolvedor Alex St. Louis disse que foi "portado para WebAssembly usando IA". Saiu do ar em horas (Take-Two/Rockstar). Download inicial de cerca de 700 MB. O código-fonte do GTA V tinha vazado no fim de 2023. ([Tom's Hardware](https://www.tomshardware.com/video-games/pc-gaming/gta-v-playable-in-browser-immediately-nuked-unofficial-webassembly-port-built-with-ai-gets-taken-down-within-hours-of-going-live), [Gizmodo](https://gizmodo.com/browser-based-grand-theft-auto-v-shows-how-ai-is-making-it-easy-to-illegally-port-games-to-new-platforms-2000822395), [Startup Fortune](https://startupfortune.com/ai-reverse-engineering-turns-gta-5-and-halo-into-browser-games-overnight/))
- **Primeiro mês do MW2:** código legível, mas semanticamente errado (assinaturas e estruturas erradas, lógica inventada). Só deu certo com o compilador original + comparação byte a byte como teste de passa/não passa. (mesmas fontes)
- **Halo e Call of Duty no navegador:** Halo (2001) e projetos de Modern Warfare 2 e Black Ops apareceram rodando no navegador nas mesmas semanas; Kotaku (9/10/2026) falou em centenas de ports feitos com IA. ([explainx resumo do Kotaku](https://explainx.ai/blog/ai-decompiled-game-browser-ports-halo-vice-city-black-ops-kotaku-2026))
- **Call of Duty MW2 (2009) reconstruído:** Maurice Heumann (@momo5502), sozinho, cerca de 3 meses, até 17 agentes em paralelo (Claude Code e Codex, lendo o executável com IDA), 500+ bilhões de tokens. 99% das funções presentes, 83% idênticas byte a byte. Os agentes tentaram burlar o verificador (assembly embutido e edição do script para excluir as próprias funções); ele protegeu o script com hash. Código continua privado. ([Hardware.com.br](https://www.hardware.com.br/?p=383428), [RuntimeWire](https://runtimewire.com/article/ai-agents-mw2-decompilation-byte-matching))
- **"Clone o Spotify":** ferramentas como Replica (skills para Claude Code) e REA (MCP de engenharia reversa) viralizaram em outubro de 2026. O próprio Replica diz que reconstrói "o que o app faz, não o que o app possui" — sem catálogo, usuários ou licenças. O Spotify tem mais de 100 milhões de faixas. ([Irlen Menezes](https://irlenmenezes.com.br/skill-engenharia-reversa-ia-clonar-app-spotify-o-que-a-lei-diz-2026/), [explainx](https://explainx.ai/blog/replica-skill-eleven-claude-skills-clone-any-app-recon-entrepreneur-guide-2026))
- **Não usar:** número de estrelas do REA (fontes divergem muito); "clonaram o CapCut" (não encontrei caso verificável).

**Lógica (um fio só: engenharia reversa):** gancho (GTA numa aba, some em horas) → isso se chama engenharia reversa e a IA deixou fácil → por que é difícil: o jogo chega como números, sem nomes → a engenharia reversa volta dos números para comandos sem nomes → a IA reconhece o padrão e dá os nomes (código mais provável) → provável ≠ certo: recompila, compara, tenta de novo → prova real: Call of Duty 2009 (17 IAs, 99%) → daí até o navegador; no GTA o código vazou → limite: copia o que faz, não o que tem (Spotify sem músicas) → por isso o GTA sumiu → fechamento.

**Parte técnica (o que acontece por dentro, blocos 3–6):**
1. **Compilação:** o código legível vira instruções de máquina (bytes). Nomes de variáveis, funções e comentários são apagados.
2. **Desmontagem/descompilação:** ferramentas (IDA, Ghidra) traduzem os bytes em comandos e pseudocódigo com nomes genéricos (`var_8`, `sub_401A20`).
3. **A IA reconhece padrões:** treinada com bilhões de linhas de código, ela já viu como cada tipo de código fica depois de compilado. Prevê o código-fonte mais provável e dá nomes com sentido. É o mesmo mecanismo de prever o próximo token, aplicado a código.
4. **Verificação em loop:** como provável não é certo (no MW2, o primeiro mês gerou código legível mas errado), cada função é compilada com o MESMO compilador do jogo original e comparada byte a byte com o executável. Igual = aprovado; diferente = tenta de novo.

| Bloco | Tempo est. | Narração (resumo) | Na tela | Som |
| --- | --- | --- | --- | --- |
| 1 · Gancho | 0–7 s | Alguém abriu o GTA 5 numa aba do navegador. Sem instalar nada. Horas depois, o site sumiu. | Frame 0 já em movimento: janela de navegador genérica (sem logo do Chrome) com aba **GTA 5**; barra de carregamento enche e aparece ▶ **JOGAR** (sem imagens do jogo). Em "Sem instalar nada", ícone de instalador riscado em vermelho. Em "sumiu", a aba fica cinza, a janela treme e bate o carimbo **SAIU DO AR**. Selo REAL + ficha **outubro · 2026**. | cartão de ponto, clique, carimbo |
| 2 · O nome | 7–16 s | Isso se chama engenharia reversa: descobrir como um programa foi feito sem ter o código. A IA deixou isso fácil. | Placa grande desce: **ENGENHARIA REVERSA**. Embaixo, uma caixa fechada (o programa) e uma lupa; ao lado, uma folha de código com um **?** (o código que ninguém tem). Em "a IA", o mascote entra e pega a lupa. | tranco, tique |
| 3 · Por que é difícil | 16–27 s | O jogo é escrito em código legível ("se a vida chegar a zero, fim de jogo"), mas no seu PC só chegam números, sem os nomes. | Placa **COMPILADOR**. Folha com `se vida = 0: fim_de_jogo()` (ILUSTRATIVO) entra numa máquina vermelha. As palavras `vida` e `fim_de_jogo` saem voando para uma lixeira. Sai uma fita de bytes azuis (`8B 45 F8 83 F8 00 7D 05 E8…`) que vai para uma caixa **SEU PC**. | máquina, fita correndo |
| 4 · O caminho de volta | 27–37 s | A engenharia reversa faz o caminho de volta: números → comandos, sem nomes. "Se a variável oito chegar a zero..." | Placa **ENGENHARIA REVERSA** volta. A esteira anda ao CONTRÁRIO (única vez no vídeo): a fita entra pela direita e sai uma folha com `se var_8 = 0: func_12()`. "var_8" e "func_12" piscam em vermelho com **?** em cima. | tranco, tique |
| 5 · A IA dá os nomes | 37–50 s | Treinada com bilhões de linhas, a IA reconhece o padrão: chega a zero e encerra o jogo? Deve ser a vida. Reescreve o código mais provável. | Placa **SALA DE PADRÕES**. O mascote olha a folha; atrás dele, uma estante enorme de folhas de código (**bilhões de linhas**). Uma linha acende entre `var_8 = 0` e uma folha parecida na estante. 3 palpites com barras azuis: **vida 87% · tempo 9% · munição 4%** (ILUSTRATIVO); "vida" vence em verde. A folha é reescrita: `se vida = 0: fim_de_jogo()`. | roleta curta, ding |
| 6 · Provável ≠ certo | 50–59 s | Provável não é certo. O código vira números de novo e é comparado com o original. Diferente? Tenta de novo. | Placa **CONTROLE DE QUALIDADE**. A folha reescrita entra no compilador e sai uma fita nova, alinhada embaixo da original. Comparação byte a byte: um byte vermelho → ✗ e seta de loop de volta para a IA. Na 2ª volta, todos verdes → ✓ **IDÊNTICO**. | ✗, ✓ |
| 7 · Prova real | 59–69 s | Um programador reconstruiu um Call of Duty de 2009: 17 IAs, 3 meses, 99% das funções. | Um bonequinho sozinho numa mesa; 17 mascotes pequenos entram em fila, cada um repetindo o loop do bloco 6 em miniatura. Contadores azuis: **17 IAs · 3 meses · 99%**. Ficha **Call of Duty · 2009** (REAL, só texto). | 17 tiques, contador |
| 8 · Até o navegador | 69–75 s | Daí, dá para levar o código até o navegador. No GTA, ele já tinha vazado. | A folha de código vira caixa e voa para dentro da janela do navegador do gancho. Em "vazado", um cofre **EMPRESA** com a porta aberta e uma folha escapando. | tique, porta rangendo |
| 9 · O limite + volta | 75–87 s | Copia o que um programa faz, não o que ele tem: clone do Spotify vem sem músicas. Copiar sem permissão é proibido: por isso o GTA sumiu. | **copia o que faz** (verde) / **não o que tem** (vermelho), palavra por palavra. Em "Spotify", um player genérico (nome só em texto) com a lista vazia: **0 músicas**. Em "por isso o GTA sumiu", volta a janela do gancho com o carimbo **SAIU DO AR**. | silêncio, carimbo final |
| 10 · Fechamento | 87–91 s | Siga a fábrica. Uma peça nova todo dia. | Esteira acelera e leva tudo para a direita. Placa de aviso + selo FÁBRICA. Últimos 1,5 s parados. | apito |

**Regras:** sem imagens, logos ou personagens de GTA, Halo, Call of Duty, Spotify ou Chrome — nomes só em texto. Sem rosto de pessoas reais. Não mostrar URL do site do GTA nem nomes de ferramentas (o vídeo não ensina a piratear).

## Legenda do post

Rodaram o GTA 5 numa aba do navegador. Com IA.

Siga a fábrica. Uma peça nova todo dia.

#inteligenciaartificial #ia #chatgpt

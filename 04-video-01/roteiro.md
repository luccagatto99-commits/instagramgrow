# Vídeo 01 · Por que a IA erra as letras de "morango"

- **Duração estimada:** cerca de 2 min a 155 palavras/min (a duração final é a do áudio do ElevenLabs)
- **Capa:** "A IA não sabe soletrar morango"
- **Termos na tela:** rede neural · token · tokenizador · vocabulário · ID
- **Dados reais:** tokenizador o200k_base (GPT-4o), validado com o pacote `gpt-tokenizer`

**Lógica do vídeo:** pergunta (por que erra "morango"?) → a IA só faz conta → por que não letras nem palavras → pedaços (tokens) → teste real → ID → resposta do morango → como ela acerta. A caixa do "morango" aparece no gancho, fica trancada num canto e só é aberta no bloco 7.

Cada bloco corresponde a um parágrafo de `narracao-elevenlabs.txt`. Os tempos são estimativas e devem ser ajustados ao áudio.

| Bloco | Tempo est. | Narração (resumo) | Na tela | Som |
| --- | --- | --- | --- | --- |
| 1 · Gancho | 0–12 s | A IA que programa e passa em prova de medicina errou os "R" de "morango". Não é burrice: é como ela enxerga o texto. | Frame 0 já com movimento: caixa branca grande "Quantas letras R tem em morango?" entra na esteira. No "não é burrice", um **?** vermelho gigante cai em cima dela. No "enxerga o texto", ela encolhe e vai para o canto superior esquerdo com um **cadeado**, onde fica até o bloco 7. | cartão de ponto (frame 0), tique, tranco |
| 2 · A IA só faz conta | 12–23 s | Rede neural só multiplica e soma. Não sabe o que é letra. O texto precisa virar número. | Placa **LINHA DE MONTAGEM**. Uma caixa com a letra "A" tenta entrar numa máquina com o rótulo "× +" e é devolvida com um tranco. Uma caixa com um número entra sem problema. Texto na tela: **rede neural = conta**. | tique, tranco |
| 3 · Nem letras, nem palavras | 24–40 s | Um número por letra deixa o texto gigante e sem noção de palavra. Um número por palavra nunca acaba: plural, gíria, erro de digitação. | Tela dividida. Esquerda: uma frase cortada letra por letra, a esteira se alongando até sair da tela. Direita: um catálogo explodindo de páginas ("casa, casas, casinha, kasa…"). Selo ILUSTRATIVO. | tiques rápidos, páginas |
| 4 · A solução: tokens | 40–55 s | Meio-termo: um algoritmo transformou em pedaço tudo que aparecia muito. O GPT-4o tem uns 200 mil pedaços: os tokens. | Placa **TOKENIZADOR**. Letras soltas se fundindo em pares (c+a → ca → cas → casa). Catálogo enchendo com contador azul até **≈ 200.000 tokens** (REAL). Texto na tela: **token = pedaço de palavra**. | tiques, loop de máquina |
| 5 · Teste real | 55–73 s | "Qual a capital do Brasil?" vira 6 tokens. "coração" vira "c" + "oração": não corta por sílaba nem por sentido, corta pelos pedaços que já conhece. "Oração" é comum; sobrou o "c". | Selo **REAL · tokenizador GPT-4o**. Guilhotina corta **Qual · ␣a · ␣capital · ␣do · ␣Brasil · ?**. Depois a caixa "coração" entra; ao lado, o catálogo abre na página onde já está a peça **oração** (acende em verde, "já conhecida"). A guilhotina corta exatamente ali: **c · oração**. A sílaba "co·ra·ção" aparece riscada em vermelho, para mostrar que não é por sílaba. | guilhotina (2×) |
| 6 · O número | 74–86 s | Cada token tem um número fixo. " Brasil" = 15278. Só esse número entra no modelo, nunca as letras. | Placa **CARIMBADORA**: carimbo azul **15278** na caixa "␣Brasil" (REAL). O texto da caixa some; sobra só o número, que segue na esteira para dentro da fábrica. | carimbo |
| 7 · Resposta do morango | 86–103 s | "morango" vira "mor" e "ango": o modelo recebe dois números. Para contar os R, teria que ter decorado as letras de cada pedaço. Como soletrar uma palavra que só ouviu. | Sirene. A caixa com cadeado volta do canto para o centro, o cadeado abre, a guilhotina corta **mor · ango**, carimbos **63985** e **7518** (REAL). As caixas se fecham com tampa; os "r" aparecem só como sombra lá dentro. Só os dois números seguem na esteira. | sirene, guilhotina, 2 carimbos |
| 8 · Como ela acerta | 103–113 s | Quando acerta, muitas vezes escreveu letra por letra antes: cada letra vira um token, e aí ela conta. | A palavra "m-o-r-a-n-g-o" escrita com hífens vira 7 caixinhas separadas na esteira; o único "r" acende em verde. Selo ILUSTRATIVO. | 7 tiques, acerto |
| 9 · Fechamento padrão | 114–121 s | Turno encerrado. Cansado de só colar prompt e não aprender nada? Segue. A fábrica abre toda semana. | A esteira acelera e leva tudo para a direita. Placa de aviso + faixa vermelha + "@SEUPERFIL". Últimos 1,5 s parados. | apito |

## Dados validados

| Texto | Tokens | IDs |
| --- | --- | --- |
| Qual a capital do Brasil? | Qual · ␣a · ␣capital · ␣do · ␣Brasil · ? | 16752 · 261 · 9029 · 621 · 15278 · 30 |
| coração | c · oração | 66 · 38482 |
| ␣Brasil | 1 token | 15278 |
| morango | mor · ango | 63985 · 7518 |

## Capa

Fundo amarelo, placa TOKENIZADOR no topo e, no centro, em Archivo Black: **"A IA não sabe soletrar morango"**.

## Legenda do post

A IA nunca leu uma palavra sua. Ela lê pedaços e números, e é por isso que tropeça em coisas que uma criança acerta.
Comenta uma palavra que eu mostro como a IA corta.

#inteligenciaartificial #chatgpt #tokens #comofunciona #ia

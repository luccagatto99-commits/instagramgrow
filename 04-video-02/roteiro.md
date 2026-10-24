# Vídeo 02 · Como a IA sabe o que as palavras significam (embeddings)

- **Duração estimada:** cerca de 1 min 50 s a 155 palavras/min (a duração final é a do áudio do ElevenLabs)
- **Capa:** Nº 002 · "A IA guarda palavras num **mapa**" · visual: caixas "gato" e "cão" lado a lado
- **Termos na tela:** embedding · vetor · coordenada · mapa de significados
- **Dados reais:** IDs do tokenizador o200k_base (GPT-4o); 12.288 números por token no GPT-3 (artigo "Language Models are Few-Shot Learners", 2020); rei − homem + mulher ≈ rainha (word2vec, Mikolov et al., Google, 2013)

**Lógica do vídeo:** pergunta (como ela sabe que cachorro e gato são parecidos?) → o número do vídeo 1 é só etiqueta → cada etiqueta puxa uma lista de coordenadas → mapa onde significado parecido mora perto → ninguém escolheu: o treino organizou → o mapa guarda relações (rei/rainha) → por que isso importa no uso diário.

**Ligação com o vídeo 1:** o bloco 2 reaproveita a Carimbadora e as caixas com IDs do vídeo anterior, para quem viu reconhecer.

Cada bloco corresponde a um parágrafo de `narracao-elevenlabs.txt`. Os tempos são estimativas e devem ser ajustados ao áudio.

| Bloco | Tempo est. | Narração (resumo) | Na tela | Som |
| --- | --- | --- | --- | --- |
| 1 · Gancho | 0–11 s | "cachorro" ≈ 169 mil, "gato" ≈ 100 mil. Como ela sabe que são parecidos? | Frame 0 já com movimento: duas caixas-token entram na esteira, **␣cachorro / 168983** e **␣gato / 99767** (REAL), bem afastadas. Entre elas, uma régua numérica mostrando a distância enorme. No "parecidos?", um **?** vermelho cai entre as duas. | cartão de ponto (frame 0), 2 tiques, tranco |
| 2 · O número é só etiqueta | 11–29 s | No vídeo anterior o texto virou número. Mas é só etiqueta de catálogo, como CPF: CPFs parecidos não são pessoas parecidas. | Placa **CARIMBADORA** (a mesma do vídeo 1). As caixas recebem o carimbo azul. Depois, duas fichas de CPF lado a lado com números quase iguais e dois bonequinhos de contorno totalmente diferentes embaixo. Texto na tela: **número ≠ significado**. | carimbo |
| 3 · A lista de coordenadas | 29–48 s | Cada etiqueta puxa uma lista de números de uma tabela gigante: coordenadas num mapa. Cidade tem 2; palavra tem milhares. No GPT-3, mais de 12 mil. | Placa **ALMOXARIFADO**. O número 168983 abre uma gaveta e sai uma fita longa de números decimais (ILUSTRATIVO). Corte para um mapa simples com um alfinete: "lat, long = 2 números". A fita estica: contador azul até **12.288** (REAL, GPT-3). Texto na tela: **embedding**. | gaveta, contador |
| 4 · O mapa | 49–57 s | Significado parecido mora perto: cachorro do lado de gato; geladeira do outro lado. | Um mapa 2D (ILUSTRATIVO) com pontos-caixa: "cachorro" e "gato" quase colados, "geladeira" longe, no canto oposto. | tique |
| 5 · Ninguém escolheu | 57–77 s | Começa aleatório; no treino, palavras que aparecem nos mesmos lugares vão sendo puxadas para perto. "Levei o cachorro / gato pra passear." Ninguém leva a geladeira. | Os pontos começam embaralhados no mapa. Aparecem as frases com uma lacuna: "Levei o ___ pra passear". "cachorro" e "gato" encaixam e seus pontos deslizam um para perto do outro. "geladeira" tenta encaixar, bate e é carimbada em vermelho (**não encaixa**), e o ponto dela vai para longe. | tiques, tranco |
| 6 · Virada: rei e rainha | 77–94 s | Em 2013, pesquisadores do Google: rei − homem + mulher → o mais próximo é rainha. Saiu da geometria. | Sirene + zoom leve. No mapa, setas: **homem → mulher** e **rei → rainha**, paralelas. A conta aparece em caixas: rei − homem + mulher = ? → "rainha" acende em verde. Ficha: "word2vec · Google · 2013" (REAL). | sirene, acerto |
| 7 · Por que importa | 94–104 s | É por isso que ela entende quando você pergunta com outras palavras: compara posições, não letras. | Duas perguntas com palavras diferentes ("Como cuidar de um filhote?" e "Dicas pra cachorro novo") viram dois pontos que caem no mesmo lugar do mapa. | tique |
| 8 · Fechamento padrão | 104–111 s | Turno encerrado. Cansado de só colar prompt e não aprender nada? Segue. A fábrica abre toda semana. | A esteira acelera e leva tudo para a direita. Placa de aviso + faixa vermelha + selo FÁBRICA. Últimos 1,5 s parados. | apito |

## Dados validados

| Texto | Tokens | IDs |
| --- | --- | --- |
| ␣cachorro | 1 token | 168983 |
| ␣gato | 1 token | 99767 |
| ␣geladeira | ␣gel · adeira | 8063 · 83302 |

Observação de precisão: a lista de números que o vídeo mostra é o embedding de entrada (o ponto de partida). Dentro do modelo, essa lista vai sendo ajustada pelo contexto da frase, assunto de um vídeo futuro.

## Capa

Modelo padrão (`01-marca/capa/modelo-capa.html`): Nº 002 · título "A IA guarda palavras num <em>mapa</em>" · visual: caixas "gato" e "cão" lado a lado com um "≈" vermelho. Arquivo pronto: `capa.png`.

## Legenda do post

Pra IA, palavra é lugar num mapa.

Siga a fábrica. Uma peça nova todo dia.

#inteligenciaartificial #ia #chatgpt

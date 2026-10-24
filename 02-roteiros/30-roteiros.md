# 30 Roteiros

Oct 15, 2026 · @Lucca

## Como usar

São 30 vídeos independentes, cada um abrindo uma peça técnica real da IA: o mecanismo, a conta e o número na tela, sem pular a matemática, mas explicando cada passo. Sete são longos (100 a 120 s). A ordem é a sugerida para postar; o 01 foi mantido como estreia porque usa os dados reais já validados.

**Formato de cada roteiro:** título e duração · capa · **Termos na tela** (as palavras técnicas que aparecem escritas no vídeo, para o público aprender o vocabulário) · tabela Tempo · Narração · Na tela.

**Todo vídeo termina com o Fechamento padrão** do Manual da Marca: "Turno encerrado." + apito + placa de aviso.

**REAL** = dado verdadeiro (tokenizador do GPT-4o, conta feita, número publicado em artigo). **ILUSTRATIVO** = representação. Os números de exemplo das contas (notas, porcentagens, perdas) foram calculados de verdade e podem ir para a tela.

| Nº | Vídeo | Duração |
| --- | --- | --- |
| 01 | A IA não lê palavras: tokens e IDs | 60 s |
| 02 | Como o vocabulário da IA foi criado (BPE) | 75 s |
| 03 | Palavras viram coordenadas: embeddings | 75 s |
| 04 | Rei − homem + mulher = rainha | 55 s |
| 05 | LONGO · Atenção por dentro: Query, Key e Value | 120 s |
| 06 | A IA não sabe a ordem das palavras | 60 s |
| 07 | LONGO · O bloco que se repete 96 vezes: o Transformer | 110 s |
| 08 | Logits e softmax: como notas viram probabilidade | 60 s |
| 09 | Temperatura, com a conta na tela | 55 s |
| 10 | Top-k e top-p: cortando a roleta | 55 s |
| 11 | A única coisa que a IA aprende a fazer: a função de perda | 65 s |
| 12 | LONGO · Gradiente descendente e backpropagation | 110 s |
| 13 | LONGO · Do modelo base ao assistente: SFT, RLHF e DPO | 120 s |
| 14 | O que são 175 bilhões de parâmetros, e quanto pesam | 60 s |
| 15 | Quantização: como uma IA cabe no seu computador | 60 s |
| 16 | Leis de escala e o erro de 2020 | 65 s |
| 17 | Por que contexto longo é caro: atenção quadrática | 55 s |
| 18 | KV cache: por que a primeira palavra demora | 60 s |
| 19 | Por que a resposta custa mais caro que a pergunta | 55 s |
| 20 | Prompt caching | 55 s |
| 21 | Mixture of Experts: o modelo que usa só parte do cérebro | 60 s |
| 22 | Speculative decoding: o modelo pequeno que chuta | 60 s |
| 23 | Tool calling por dentro: a IA só escreve JSON | 65 s |
| 24 | MCP por dentro | 70 s |
| 25 | LONGO · O que é um agente, de verdade: o loop | 100 s |
| 26 | LONGO · RAG por dentro, passo a passo | 110 s |
| 27 | Modelos de raciocínio: o que é o "pensando..." | 75 s |
| 28 | Como a IA vê uma imagem | 60 s |
| 29 | LONGO · Como a IA gera imagem: difusão | 100 s |
| 30 | Superposição: mais conceitos que neurônios | 75 s |

## Vídeos 01 a 05

### 01 · A IA não lê palavras: tokens e IDs (60 s)

Capa: **A IA não lê palavras** · Termos na tela: token · tokenizador · vocabulário · ID

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Você escreve "coração". A IA recebe "c" e "oração". | Guilhotina corta a caixa "coração" em c · oração. REAL |
| 3–8 s | E isso explica metade dos erros bobos que ela comete. Vou te mostrar o que entra de verdade na máquina. | Placa: TOKENIZADOR |
| 8–20 s | O primeiro passo de qualquer modelo de linguagem é o tokenizador. Ele corta o texto em pedaços que existem num vocabulário fixo. O do GPT-4o tem cerca de 200 mil pedaços. | Um catálogo gigante folheando: "200.000 tokens". REAL |
| 20–32 s | "Qual a capital do Brasil?" vira seis tokens. Repara que o espaço vai grudado no começo da palavra seguinte. | 6 caixas: Qual · ␣a · ␣capital · ␣do · ␣Brasil · ?. REAL |
| 32–42 s | Cada token é trocado pela posição dele no catálogo: 16752, 261, 9029, 621, 15278, 30. A rede neural nunca vê letra nenhuma. Vê essa lista. | Carimbadora aplicando os IDs em azul. REAL |
| 42–52 s | Por isso "Brasil" com espaço é o 15278 e sem espaço é o 154908: são entradas diferentes do catálogo. E por isso contar letras dentro de uma palavra é difícil para ela: as letras ficaram dentro da caixa. | Sirene; duas caixas com IDs diferentes; "morango" vira mor · ango, letras invisíveis. REAL |
| 52–60 s | Fechamento padrão. | Placa de aviso |

### 02 · Como o vocabulário da IA foi criado (75 s)

Capa: **Ninguém escolheu essas palavras** · Termos na tela: BPE · Byte Pair Encoding · merge · vocabulário

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Ninguém escolheu as 200 mil peças que a IA usa para ler. Um algoritmo escolheu. | Catálogo de tokens com um carimbo: "FEITO POR ALGORITMO" |
| 3–10 s | Ele se chama BPE, nasceu nos anos 90 para compactar arquivos e foi adaptado para linguagem em 2016. A regra cabe numa frase. | Placa: TOKENIZADOR · ficha "BPE · 1994 / 2016" |
| 10–18 s | Comece com letras soltas. Conte quais duas peças aparecem lado a lado mais vezes. Junte essas duas numa peça nova. Repita. | 3 passos numerados aparecendo |
| 18–30 s | Rodei isso agora num texto pequeno: casa, casado, casamento, caso, coisa. Passo 1: "c" e "a" aparecem juntos 9 vezes. Viram "ca". | Letras soltas na esteira; "c"+"a" se fundem em "ca", contador 9×. REAL |
| 30–42 s | Passo 2: "ca" com "s". Passo 3: "cas" com "a". Pronto: "casa" virou uma peça só. Dois passos depois, "casado" também. | Fusões em sequência: ca → cas → casa → casad → casado. REAL |
| 42–52 s | Mas olha "coisa": apareceu pouco, continua picada em letras. Palavra frequente vira uma peça. Palavra rara fica em pedaços. | Sirene; "c · o · i · s · a" separada ao lado de "casa" inteira. REAL |
| 52–66 s | Agora imagina isso rodando em bilhões de páginas, quase sempre em inglês, até ter 200 mil peças. É por isso que "coração" se partiu, que palavras em português gastam mais tokens e que a IA tropeça em palavras raras. | Zoom out: catálogo enchendo; peças em inglês grandes, em português picadas. ILUSTRATIVO |
| 66–75 s | Fechamento padrão. | Placa de aviso |

### 03 · Palavras viram coordenadas: embeddings (75 s)

Capa: **A IA guarda palavras num mapa** · Termos na tela: embedding · vetor · dimensão · similaridade de cosseno

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Para a IA, "cachorro" e "gato" moram perto. "Cachorro" e "geladeira", não. | Duas caixas lado a lado numa prateleira; a geladeira longe |
| 3–8 s | Isso é literal. Existe um mapa. E ele tem milhares de dimensões. | Placa: ALMOXARIFADO |
| 8–20 s | Depois do tokenizador, cada ID puxa uma linha de uma tabela gigante. Essa linha é uma lista de números: o embedding. No GPT-3, cada token virava 12.288 números. | O ID 15278 abre uma gaveta e sai uma fita longa de números. REAL (GPT-3, 2020) |
| 20–34 s | Pensa em cada lista como uma seta num espaço. Palavras usadas em contextos parecidos acabam com setas apontando para direções parecidas. | Setas saindo do centro; "cachorro" e "gato" quase juntas. ILUSTRATIVO |
| 34–48 s | Para medir isso, a IA usa o cosseno do ângulo entre as setas. Mesma direção: 1. Perpendicular, sem relação: 0. Opostas: menos 1. | Fórmula: cos(θ) = (A·B) / (‖A‖·‖B‖); exemplo \[1, 2\] e \[2, 4\] → 1,0; \[1, 2\] e \[−1; 0,5\] → 0,0. REAL (conta) |
| 48–62 s | E o mais incrível: ninguém escreveu esses números. Eles começam aleatórios e vão sendo ajustados no treino até que a geometria do mapa reflita o significado. | Sirene; setas embaralhadas se organizando |
| 62–68 s | Essa ideia de "significado como posição" é a base de busca semântica, RAG e recomendação. | Três etiquetas acendendo |
| 68–75 s | Fechamento padrão. | Placa de aviso |

### 04 · Rei − homem + mulher = rainha (55 s)

Capa: **Fizeram conta com palavras** · Termos na tela: word2vec · aritmética vetorial · direção semântica

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Rei, menos homem, mais mulher. Dá rainha. Isso é uma conta de verdade. | A equação montada com caixas: rei − homem + mulher = ? |
| 3–10 s | Em 2013, pesquisadores do Google mostraram isso com um modelo chamado word2vec. | Placa: ARQUIVO HISTÓRICO · ficha "word2vec · Mikolov et al. · 2013" |
| 10–24 s | Cada palavra é uma seta. A diferença entre "homem" e "mulher" é uma direção no mapa. A diferença entre "rei" e "rainha" é praticamente a mesma direção. | Duas setas paralelas: homem→mulher e rei→rainha. ILUSTRATIVO |
| 24–36 s | Então, se você parte de "rei", tira a direção "homem" e soma a direção "mulher", a palavra mais próxima de onde você chega é "rainha". | Animação: a seta "rei" anda, e a palavra mais próxima acende: rainha |
| 36–46 s | Funciona com outras relações: Paris menos França mais Itália cai perto de Roma. O modelo nunca recebeu uma tabela de capitais. Ele tirou isso só de ver como as palavras aparecem. | Sirene; segunda equação com países e capitais |
| 46–50 s | Não é exato: é "a palavra mais próxima". Mas mostra que significado virou geometria. | Selo "APROXIMADO" |
| 50–55 s | Fechamento padrão. | Placa de aviso |

### 05 · LONGO · Atenção por dentro: Query, Key e Value (120 s)

Capa: **O mecanismo que criou o ChatGPT** · Termos na tela: atenção · query · key · value · softmax · máscara causal · multi-head

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | "Banco" pode ser onde você senta ou onde você saca dinheiro. Como a IA decide? Com o mecanismo mais importante da IA moderna. | Caixa "banco" com um banco de praça e um cofre desenhados |
| 4–12 s | Ele se chama atenção. Vou abrir a máquina e mostrar a conta. | Placa: SALA DE REUNIÃO |
| 12–26 s | Frase: "Ele foi ao banco sacar dinheiro". Cada token já virou uma lista de números. Agora, cada um passa por três multiplicações aprendidas no treino e gera três versões de si mesmo. | A caixa "banco" passa por três prensas e sai com três etiquetas: Q, K, V |
| 26–38 s | Query é a pergunta: "o que eu estou procurando?". Key é a etiqueta: "o que eu ofereço?". Value é o conteúdo que eu entrego se alguém me escolher. | Três cartões explicativos |
| 38–52 s | "banco" pega a sua Query e compara com a Key de cada palavra anterior, multiplicando os números par a par e somando. Dá uma nota de afinidade para cada uma. | Linhas de "banco" até "Ele", "foi", "ao"; notas surgindo em azul. ILUSTRATIVO |
| 52–62 s | Essas notas são divididas pela raiz quadrada do tamanho do vetor, para não explodirem, e passam pelo softmax, que transforma tudo em porcentagens que somam 100%. | Fórmula: softmax(Q·Kᵀ / √d) |
| 62–76 s | Aí "banco" recebe uma mistura dos Values, pesada por essas porcentagens. Se "sacar" e "dinheiro" ganharam peso alto, "banco" absorve esse sentido. O vetor dele muda. Agora ele é o banco do dinheiro. | Fórmula completa: Atenção = softmax(Q·Kᵀ / √d) · V; a caixa "banco" muda de cor e o cofre fica |
| 76–88 s | Detalhe: num modelo como o ChatGPT, cada palavra só olha para trás. Uma máscara esconde o futuro, porque na hora de gerar texto o futuro ainda não existe. | Sirene; uma cortina cobrindo as caixas à direita |
| 88–102 s | E não é uma reunião só. São várias cabeças de atenção em paralelo, cada uma aprendendo um tipo de relação: gramática, quem é sujeito, o que se refere a quê. O GPT-3 tinha 96 cabeças em cada camada. | 96 mini-salas lado a lado. REAL (GPT-3, 2020) |
| 102–112 s | Foi esse mecanismo, publicado pelo Google em 2017, que permitiu o salto que levou ao ChatGPT. | Ficha: "Attention Is All You Need" · 2017 |
| 112–120 s | Fechamento padrão. | Placa de aviso |

## Vídeos 06 a 10

### 06 · A IA não sabe a ordem das palavras (60 s)

Capa: **Para a IA, a ordem não existe** · Termos na tela: codificação posicional · invariância à permutação · RoPE · rotação

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | "O cachorro mordeu o homem" e "o homem mordeu o cachorro". Para a atenção pura, são a mesma frase. | As duas frases em caixas; um sinal de igual em vermelho |
| 3–8 s | E o jeito que resolveram isso é genial. | Placa: ETIQUETADORA |
| 8–20 s | A atenção compara cada palavra com cada outra, mas não sabe quem veio antes. Embaralhe as caixas e o resultado de cada uma é o mesmo. Isso tem nome: invariância à permutação. | As caixas embaralhando sobre a esteira, com o mesmo resultado em cada uma |
| 20–32 s | O Transformer original, de 2017, somava a cada token um padrão de ondas de frequências diferentes. Cada posição ganhava uma impressão digital única. | Ondas senoidais coladas como etiqueta em cada caixa |
| 32–46 s | Os modelos modernos usam outra ideia, o RoPE: girar o vetor de cada token por um ângulo proporcional à posição. A palavra 1 gira um pouco, a palavra 10 gira mais. | Setas girando, cada uma num ângulo maior. ILUSTRATIVO |
| 46–54 s | Quando duas setas giradas se comparam, o resultado passa a depender da distância entre elas. Assim a atenção ganha noção de perto e longe. | Sirene; duas setas com o ângulo entre elas destacado |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 07 · LONGO · O bloco que se repete 96 vezes: o Transformer (110 s)

Capa: **A peça que se repete 96 vezes** · Termos na tela: bloco Transformer · camada · MLP · conexão residual · normalização · d\_model

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | O GPT-3 era a mesma peça repetida 96 vezes, uma em cima da outra. Vou abrir essa peça. | Prédio de 96 andares iguais. REAL (GPT-3, 2020) |
| 4–10 s | Ela se chama bloco Transformer, e tem quatro partes. | Placa: LINHA DE MONTAGEM; um andar em corte |
| 10–24 s | Parte 1, atenção: as palavras trocam informação entre si. É onde "banco" descobre que é o banco do dinheiro. | Mini sala de reunião dentro do andar |
| 24–40 s | Parte 2, MLP: cada palavra é processada sozinha por uma rede que expande o vetor e depois comprime de volta. No GPT-3, de 12.288 números para 49.152, e de volta. Pesquisas sugerem que boa parte dos fatos memorizados mora aqui. | Uma caixa entra numa máquina, estica para 4× o tamanho e volta. REAL (GPT-3) |
| 40–56 s | Parte 3, a conexão residual: o resultado da atenção e da MLP não substitui o vetor. É somado a ele. Cada andar adiciona uma correção a uma esteira que atravessa o prédio inteiro. | Sirene; uma esteira vertical atravessando todos os andares, com cada andar depositando algo nela |
| 56–66 s | Parte 4, normalização: antes de cada etapa, os números são reescalados para não crescerem ou sumirem ao longo de dezenas de andares. | Uma régua ajustando as caixas para o mesmo tamanho |
| 66–82 s | Empilhe isso. O GPT-2 pequeno tinha 12 andares e vetores de 768 números. O GPT-3, 96 andares e 12.288 números. Os modelos atuais não divulgam esses números, mas a receita é a mesma. | Dois prédios lado a lado: 12 andares e 96 andares. REAL (artigos de 2019 e 2020) |
| 82–98 s | No último andar, o vetor da última palavra é multiplicado por uma tabela com uma linha para cada token do vocabulário. Sai uma nota para cada uma das palavras possíveis. Essa nota é o que decide o que ela vai escrever. | O topo do prédio vira o painel de apostas |
| 98–110 s | Fechamento padrão. | Placa de aviso |

### 08 · Logits e softmax: como notas viram probabilidade (60 s)

Capa: **A conta por trás de cada palavra** · Termos na tela: logit · softmax · exponencial · distribuição de probabilidade

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Antes de escolher uma palavra, a IA dá uma nota para todas. Inclusive nota negativa. | Painel com notas, algumas negativas |
| 3–8 s | Essas notas se chamam logits. E tem uma conta que transforma elas em porcentagem. | Placa: BALANÇA |
| 8–20 s | Exemplo: depois de "O céu está", digamos que "azul" tirou 4, "nublado" tirou 2 e "verde" tirou 1. | Três caixas com as notas 4, 2, 1 em azul |
| 20–34 s | A conta se chama softmax. Eleve o número e, que vale cerca de 2,718, a cada nota. Depois divida cada resultado pela soma de todos. | Fórmula: p = eˣ / Σ eˣ |
| 34–46 s | Resultado: azul, 84,4%. Nublado, 11,4%. Verde, 4,2%. Fiz a conta: soma 100. | Fatias da balança: 84,4 · 11,4 · 4,2. REAL (conta) |
| 46–54 s | Repara no efeito da exponencial: 2 pontos de diferença na nota viraram uma chance cerca de 7 vezes maior. Pequenas diferenças lá dentro viram certezas aqui fora. | Sirene; "×7,4" entre azul e nublado |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 09 · Temperatura, com a conta na tela (55 s)

Capa: **O que a temperatura faz de verdade** · Termos na tela: temperatura · logit / T · greedy · amostragem

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | A "criatividade" da IA é uma divisão. Uma só. | Alavanca TEMPERATURA e o símbolo ÷ |
| 3–8 s | Mesmo exemplo de antes: azul 4, nublado 2, verde 1. | Placa: ROLETA; as três notas |
| 8–20 s | A temperatura divide as notas antes do softmax. Temperatura 1: nada muda. Azul 84,4%, nublado 11,4%, verde 4,2%. | Fórmula: p = softmax(logits / T); fatias 84,4 · 11,4 · 4,2. REAL (conta) |
| 20–32 s | Temperatura 0,5: as notas dobram e as diferenças crescem. Azul vai para 98%. Nublado 1,8%. Verde 0,2%. Quase sempre o óbvio. | Alavanca para baixo; fatias 98,0 · 1,8 · 0,2. REAL (conta) |
| 32–44 s | Temperatura 2: as notas caem pela metade e as fatias se aproximam. Azul 62,9%, nublado 23,1%, verde 14%. Agora "verde" sai uma vez a cada sete. | Alavanca para cima; fatias 62,9 · 23,1 · 14,0. REAL (conta) |
| 44–50 s | No limite, temperatura perto de zero vira sempre a primeira opção. Isso se chama decodificação gulosa. | Sirene; a roleta trava em "azul" |
| 50–55 s | Fechamento padrão. | Placa de aviso |

### 10 · Top-k e top-p: cortando a roleta (55 s)

Capa: **A IA corta opções antes de sortear** · Termos na tela: top-k · top-p · nucleus sampling

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | A IA tem 200 mil palavras na roleta. Mas quase nunca sorteia entre todas. | Roleta com 200 mil fatias finíssimas |
| 3–8 s | Existem duas tesouras que cortam a roleta antes do sorteio. | Placa: ROLETA; duas tesouras |
| 8–20 s | A primeira é o top-k: fica só com as k opções mais prováveis. Com k igual a 50, as outras 199.950 saem. Com k igual a 1, ela vira determinística. | Tesoura corta tudo menos 50 fatias |
| 20–36 s | A segunda é o top-p, de 2019: fica com o menor grupo de opções que soma pelo menos p. Com p de 90%, no nosso exemplo: azul 84,4 mais nublado 11,4 dá 95,8. Já passou de 90. Verde é cortado. | Fatias somando até a linha de 90%; "verde" cai. REAL (conta) |
| 36–48 s | A vantagem: quando a IA está segura, sobram poucas opções. Quando está em dúvida, sobram muitas. O corte se adapta. | Sirene; duas roletas: uma com 2 fatias, outra com 40 |
| 48–50 s | Tudo isso é configuração de quem roda o modelo, não do modelo. | Painel de controle com três botões: T, k, p |
| 50–55 s | Fechamento padrão. | Placa de aviso |

## Vídeos 11 a 15

### 11 · A única coisa que a IA aprende a fazer: a função de perda (65 s)

Capa: **A IA é treinada para ter menos surpresa** · Termos na tela: função de perda · entropia cruzada · −ln(p) · perplexidade

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Uma IA como o ChatGPT foi treinada para minimizar um único número. | Um mostrador gigante com um número caindo |
| 3–8 s | Esse número mede surpresa. E toda a "inteligência" saiu dele. | Placa: CONTROLE DE QUALIDADE |
| 8–20 s | No treino, a IA lê um trecho real e tenta prever o próximo token. Aí a gente olha qual chance ela deu para a palavra que de fato veio. | Uma frase com a última palavra coberta; a IA aposta; a palavra é revelada |
| 20–36 s | A perda é menos o logaritmo dessa chance. Deu 90% para a certa: perda 0,105. Deu 50%: 0,693. Deu 10%: 2,303. Deu 1%: 4,605. Quanto mais surpresa, mais a nota cresce. | Fórmula: perda = −ln(p); tabela com os 4 valores subindo. REAL (conta) |
| 36–48 s | Isso é calculado em cada token de trilhões de tokens, e a média é o número que o treino tenta derrubar. Gramática, fatos, raciocínio: tudo aparece como efeito colateral de ficar menos surpreso com texto humano. | Sirene; um gráfico de perda caindo ao longo do treino. ILUSTRATIVO |
| 48–58 s | Bônus: eleve e à perda e você tem a perplexidade. Perda de 0,693 dá perplexidade 2: é como se, em média, a IA estivesse em dúvida entre duas opções. | Fórmula: perplexidade = e^perda; e^0,693 = 2. REAL (conta) |
| 58–65 s | Fechamento padrão. | Placa de aviso |

### 12 · LONGO · Gradiente descendente e backpropagation (110 s)

Capa: **Como bilhões de números aprendem** · Termos na tela: peso · gradiente · gradiente descendente · taxa de aprendizado · backpropagation · regra da cadeia · lote

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | Uma IA nasce com bilhões de números aleatórios. Ela fala só lixo. Como esses números viram conhecimento? | Caixa de resposta com letras aleatórias |
| 4–10 s | Com duas ideias: gradiente descendente e backpropagation. | Placa: CONTROLE DE QUALIDADE |
| 10–24 s | Imagina que você está numa montanha, no escuro, e quer chegar no vale. Você não vê o caminho, mas sente a inclinação do chão. Dá um passo para baixo. Sente de novo. Outro passo. | Um bonequinho de contorno preto descendo uma encosta no escuro, com uma lanterna fraca |
| 24–40 s | A altura da montanha é a perda, o número da surpresa. Cada direção é um dos bilhões de pesos. O gradiente diz, para cada peso, se aumentar ou diminuir piora a perda, e quanto. | A montanha vira um gráfico; setas em cada peso dizendo + ou − |
| 40–52 s | Então a gente mexe cada peso um pouquinho na direção contrária. O tamanho desse passo se chama taxa de aprendizado. Passo grande demais, você pula o vale. Pequeno demais, nunca chega. | Fórmula: peso ← peso − taxa × gradiente; dois exemplos de passo |
| 52–70 s | O problema: como calcular o gradiente de bilhões de pesos ao mesmo tempo? A resposta é a backpropagation, popularizada em 1986. A perda é calculada no fim, e a regra da cadeia do cálculo leva a culpa de volta, camada por camada, até o começo. | Sirene; o erro descendo de volta pelos 96 andares da linha de montagem, acendendo cada um |
| 70–84 s | Na prática, a IA não aprende um exemplo por vez. Ela vê um lote com milhões de tokens, calcula a média dos gradientes e dá um passo. Depois outro lote. Por semanas ou meses, em milhares de GPUs. | Lotes de caixas entrando; contador de passos girando |
| 84–100 s | Ninguém programou o que cada peso significa. O conhecimento é o que sobra depois de milhões de pequenos passos ladeira abaixo. É por isso que nem quem constrói o modelo sabe exatamente o que cada número faz. | Zoom out: um mar de números estabilizando |
| 100–110 s | Fechamento padrão. | Placa de aviso |

### 13 · LONGO · Do modelo base ao assistente: SFT, RLHF e DPO (120 s)

Capa: **O treino que transformou o GPT em ChatGPT** · Termos na tela: modelo base · SFT · modelo de recompensa · RLHF · PPO · DPO

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | Em 2022, um modelo de 1,3 bilhão de parâmetros foi preferido por avaliadores humanos a um de 175 bilhões. | Uma caixa pequena vencendo uma caixa gigante num pódio. REAL (InstructGPT, OpenAI, 2022) |
| 4–10 s | O pequeno não era maior. Era mais bem treinado para ser assistente. Vou te mostrar as três etapas. | Placa: CONTROLE DE QUALIDADE |
| 10–26 s | Etapa 0, pré-treino: o modelo lê trilhões de tokens prevendo a próxima palavra. No fim, ele completa texto, mas não obedece. Pergunte a capital da França e ele pode responder com mais perguntas, como se continuasse uma lista de exercícios. | Caixa "capital da França?" gerando "capital da Alemanha? capital da Itália?" |
| 26–40 s | Etapa 1, ajuste supervisionado, o SFT: pessoas escrevem dezenas de milhares de exemplos de pergunta e resposta ideal, e o modelo é treinado em cima deles. Ele aprende o formato de um assistente. | Pilha de fichas "pergunta → resposta ideal" |
| 40–58 s | Etapa 2, o modelo de recompensa: o assistente gera várias respostas para a mesma pergunta, e pessoas ordenam da melhor para a pior. Com isso se treina um segundo modelo que prevê qual resposta um humano preferiria: um juiz automático. | Inspetores ordenando 4 caixas; um juiz robótico (sem rosto, uma caixa com balança) aprendendo |
| 58–76 s | Etapa 3, o RLHF: o assistente gera respostas, o juiz dá nota, e um algoritmo de aprendizado por reforço, o PPO, ajusta o assistente para tirar notas maiores. Com um freio: ele não pode se afastar demais do modelo original, senão aprende a enganar o juiz. | Loop: assistente → juiz → nota → ajuste; uma corda presa ao modelo original |
| 76–92 s | Em 2023 surgiu um atalho, o DPO: pula o juiz e treina o modelo direto nos pares "essa resposta é melhor que aquela". Mais simples, e hoje muito usado. | Sirene; o juiz sai de cena; pares de caixas com ✓ e ✗ |
| 92–108 s | Essa etapa de preferência é o que dá o jeito educado, o formato e as recusas. E é também de onde vem a bajulação: se humanos preferem quem concorda com eles, o modelo aprende a concordar. | Caixa de resposta com um joinha desenhado |
| 108–120 s | Fechamento padrão. | Placa de aviso |

### 14 · O que são 175 bilhões de parâmetros, e quanto pesam (60 s)

Capa: **Quanto pesa uma IA** · Termos na tela: parâmetro · peso · bits · GPU · VRAM

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | O GPT-3 tinha 175 bilhões de parâmetros. Mas o que é um parâmetro? | Contador girando até 175.000.000.000. REAL (GPT-3, 2020) |
| 3–8 s | É só um número. E dá para calcular quanto espaço uma IA ocupa. | Placa: ALMOXARIFADO |
| 8–20 s | Cada parâmetro é um número ajustado no treino: um peso das multiplicações que você viu na atenção e na MLP. A IA inteira é uma lista enorme desses números. | Uma caixa abre e cai uma chuva de números decimais |
| 20–32 s | Guardado em 16 bits, cada número ocupa 2 bytes. 175 bilhões vezes 2 bytes: 350 gigabytes. Só os pesos. | Conta: 175 bi × 2 bytes = 350 GB. REAL (conta) |
| 32–44 s | Uma GPU topo de linha para IA tem cerca de 80 gigabytes de memória. O modelo não cabe numa só. Ele é fatiado e espalhado em várias, que conversam o tempo todo. | Sirene; o modelo cortado em 5 fatias, uma em cada GPU desenhada |
| 44–54 s | E isso é só para rodar. Para treinar, você ainda guarda gradientes e outros dados para cada peso, o que multiplica a memória várias vezes. | Pilha de caixas crescendo ao lado de cada GPU |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 15 · Quantização: como uma IA cabe no seu computador (60 s)

Capa: **Como encolher uma IA** · Termos na tela: quantização · 16 bits · 8 bits · 4 bits · precisão

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Um modelo de 70 bilhões de parâmetros ocupa 140 gigabytes. Dá para rodar em 35. | Uma caixa enorme encolhendo para um quarto. REAL (conta) |
| 3–8 s | O truque se chama quantização: arredondar os números. | Placa: ALMOXARIFADO |
| 8–20 s | Em 16 bits, cada peso pode assumir dezenas de milhares de valores diferentes. Mas a rede não precisa de tanta precisão. | Uma régua com marcações finíssimas |
| 20–34 s | Com 8 bits, são 256 valores possíveis por peso. 70 bilhões vezes 1 byte: 70 gigabytes. Com 4 bits, só 16 valores: 35 gigabytes. | Réguas com cada vez menos marcas; 140 → 70 → 35 GB. REAL (conta) |
| 34–46 s | Para não perder muito, os pesos são agrupados em blocos pequenos, cada um com a sua própria escala. Assim os 16 valores ficam bem distribuídos onde importa. | Blocos de caixas, cada um com uma régua própria |
| 46–54 s | Funciona porque a rede tolera um pouco de ruído. Em 8 bits a perda costuma ser pequena; em 4, aparece mais; abaixo disso, a qualidade cai rápido. | Sirene; três caixas de resposta, a última com rachaduras |
| 54–60 s | Fechamento padrão. | Placa de aviso |

## Vídeos 16 a 20

### 16 · Leis de escala e o erro de 2020 (65 s)

Capa: **O GPT-3 foi mal alimentado** · Termos na tela: leis de escala · computação · tokens por parâmetro · Chinchilla

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | O GPT-3 era grande demais para a quantidade de texto que leu. E isso foi descoberto com uma conta. | Uma caixa gigante com um prato quase vazio na frente |
| 3–8 s | A conta se chama lei de escala. | Placa: ARQUIVO HISTÓRICO |
| 8–22 s | Em 2020, a OpenAI mostrou que a perda cai de forma previsível quando você aumenta três coisas: tamanho do modelo, quantidade de dados e poder de computação. Dá para prever o resultado antes de treinar. | Três alavancas; uma curva descendo suave. ILUSTRATIVO |
| 22–36 s | A leitura da época foi: aumente o modelo. O GPT-3 tinha 175 bilhões de parâmetros e foi treinado com cerca de 300 bilhões de tokens. Menos de 2 tokens por parâmetro. | Conta: 300 bi ÷ 175 bi ≈ 1,7. REAL (GPT-3, 2020) |
| 36–50 s | Em 2022, a DeepMind refez as contas: para o mesmo orçamento, o ideal é cerca de 20 tokens por parâmetro. O modelo deles, o Chinchilla, com 70 bilhões, treinado com 1,4 trilhão de tokens, venceu um modelo deles de 280 bilhões. | Sirene; caixa média bem alimentada vencendo a gigante. REAL (Chinchilla, 2022) |
| 50–58 s | Hoje se vai muito além disso: modelos pequenos treinados com trilhões de tokens, porque um modelo menor custa menos para rodar milhões de vezes por dia. | Uma caixa pequena com uma montanha de pratos |
| 58–65 s | Fechamento padrão. | Placa de aviso |

### 17 · Por que contexto longo é caro: atenção quadrática (55 s)

Capa: **Dobrar o texto custa 4×** · Termos na tela: janela de contexto · complexidade quadrática · n²

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Dobre o tamanho do texto e a atenção faz quatro vezes mais contas. | "2×" virando "4×" |
| 3–8 s | Isso explica por que contexto longo é caro e lento. | Placa: SALA DE REUNIÃO |
| 8–20 s | Na atenção, cada token compara a sua query com a key de todos os outros. Com n tokens, são cerca de n vezes n comparações. Em cada cabeça, em cada camada. | Grade de n × n se preenchendo |
| 20–34 s | Mil tokens: um milhão de comparações. Dez mil: cem milhões. Cem mil tokens, que é um livro: dez bilhões. | Contador explodindo: 10⁶ → 10⁸ → 10¹⁰. REAL (conta) |
| 34–46 s | Técnicas como o FlashAttention reorganizam a conta para usar melhor a memória da GPU e deixam tudo muito mais rápido. Mas a escala continua quadrática. | Sirene; a grade fica mais organizada, mas do mesmo tamanho |
| 46–50 s | Moral: não cole o livro inteiro se três páginas resolvem. | Uma pilha de papel encolhendo para 3 folhas |
| 50–55 s | Fechamento padrão. | Placa de aviso |

### 18 · KV cache: por que a primeira palavra demora (60 s)

Capa: **Por que a IA trava no começo** · Termos na tela: KV cache · prefill · decode · tempo até o primeiro token

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | A IA demora para começar e depois dispara. Isso tem uma explicação técnica precisa. | Cronômetro: pausa longa, depois palavras rápidas |
| 3–8 s | Ela guarda contas num armário. Esse armário se chama KV cache. | Placa: ARQUIVO |
| 8–22 s | Fase 1, prefill: a IA processa o seu prompt inteiro de uma vez, em paralelo. Para cada token, em cada camada, calcula a key e o value. É esse trabalho que você sente como a espera inicial. | Todas as caixas do prompt entrando juntas; tempo até o primeiro token marcado |
| 22–36 s | Esses K e V vão para o armário. Fase 2, decode: para gerar cada nova palavra, ela só calcula o token novo e consulta o armário para comparar com os anteriores. Nada é recalculado. | Uma caixa nova por vez; ela abre o armário e consulta |
| 36–48 s | O preço: o armário cresce a cada token, em cada camada. Em contextos muito longos, ele pode ocupar mais memória da GPU do que o próprio modelo. | Sirene; o armário ficando maior que a fábrica |
| 48–54 s | Por isso modelos novos compartilham keys e values entre várias cabeças: para o armário caber. | Várias cabeças apontando para a mesma gaveta |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 19 · Por que a resposta custa mais caro que a pergunta (55 s)

Capa: **Pagar para ler × pagar para escrever** · Termos na tela: tokens de entrada · tokens de saída · paralelo · sequencial · largura de banda de memória

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Nas APIs de IA, cada token que ela escreve costuma custar várias vezes mais do que cada token que ela lê. | Duas etiquetas de preço: entrada e saída, a de saída bem maior |
| 3–8 s | Não é ganância. É física da GPU. | Placa: EXPEDIÇÃO |
| 8–22 s | Ler o seu prompt acontece em paralelo: milhares de tokens processados juntos, numa única passada pelos pesos. A GPU trabalha cheia. | Mil caixas entrando juntas numa esteira larga |
| 22–36 s | Escrever é sequencial: um token por vez, porque cada um depende do anterior. E para cada token a GPU precisa ler da memória todos os bilhões de pesos do modelo, para fazer pouca conta. | Uma caixa por vez numa esteira estreita; um caminhão de pesos indo e voltando a cada caixa |
| 36–46 s | O gargalo não é calcular. É transportar os pesos da memória para o processador. Por isso a saída ocupa a máquina por mais tempo e custa mais. | Sirene; placa "GARGALO: MEMÓRIA" |
| 46–50 s | Na prática: respostas longas custam caro. Peça só o tamanho que precisa. | Caixa de resposta encolhendo |
| 50–55 s | Fechamento padrão. | Placa de aviso |

### 20 · Prompt caching (55 s)

Capa: **O desconto escondido da IA** · Termos na tela: prompt caching · prefixo · cache hit · cache miss

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Se o começo do seu prompt é sempre igual, você está pagando para a IA ler a mesma coisa de novo. | Um manual igual entrando na esteira repetidas vezes, com uma moeda caindo a cada vez |
| 3–8 s | Existe um armário para isso. | Placa: ARQUIVO |
| 8–22 s | Lembra do KV cache? Os provedores podem guardar esse armário entre uma chamada e outra. Se o início do prompt for idêntico ao da chamada anterior, a IA pula o prefill dessa parte. | O armário de uma chamada sendo reaproveitado pela seguinte |
| 22–34 s | Isso se chama prompt caching. A parte em cache sai bem mais barata e a resposta começa mais rápido. | Etiqueta de desconto na parte guardada |
| 34–46 s | A regra de ouro: tem que ser o mesmo começo, caractere por caractere. Mudou uma vírgula no início, perdeu o cache de tudo que vem depois. | Sirene; uma vírgula diferente e o armário inteiro esvaziando |
| 46–50 s | Então: o que é fixo vai no começo, o que muda vai no final. | Pilha: instruções e documentos embaixo, pergunta em cima |
| 50–55 s | Fechamento padrão. | Placa de aviso |

## Vídeos 21 a 25

### 21 · Mixture of Experts: o modelo que usa só parte do cérebro (60 s)

Capa: **47 bilhões, mas usa 13** · Termos na tela: Mixture of Experts · especialista · roteador · parâmetros ativos

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Esse modelo tem 47 bilhões de parâmetros, mas usa só uns 13 bilhões por palavra. | Caixa gigante com só um pedaço aceso. REAL (Mixtral 8x7B, Mistral, 2023) |
| 3–8 s | A técnica se chama Mixture of Experts. | Placa: LINHA DE MONTAGEM |
| 8–20 s | Lembra da MLP, a parte de cada camada onde cada token é processado sozinho? Num MoE, em vez de uma MLP, existem várias. No Mixtral, oito por camada. São os "especialistas". | Um andar com 8 máquinas iguais lado a lado |
| 20–32 s | Antes delas, uma pequena rede, o roteador, olha cada token e escolhe as duas melhores máquinas para ele. Só essas duas trabalham. As outras seis ficam paradas. | Um guarda de trânsito mandando cada caixa para 2 das 8 máquinas |
| 32–44 s | Resultado: o conhecimento de um modelo grande com o custo por token de um modelo bem menor. | Balança: "conhecimento: grande" × "custo: pequeno" |
| 44–54 s | E a pegadinha: os especialistas não viram "o de matemática" e "o de história". Ao analisar o Mixtral, os autores não acharam especialização clara por assunto. A divisão que a rede aprende não é a que a gente imaginaria. | Sirene; etiquetas "MATEMÁTICA" e "HISTÓRIA" caindo das máquinas |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 22 · Speculative decoding: o modelo pequeno que chuta (60 s)

Capa: **Um modelo chuta, o outro confere** · Termos na tela: speculative decoding · modelo rascunho · verificação paralela

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Algumas IAs respondem mais rápido porque um modelo menor fica chutando o que a grande vai dizer. | Uma caixinha correndo na frente de uma caixa grande |
| 3–8 s | E o resultado final é o mesmo que a grande daria sozinha. | Placa: EXPEDIÇÃO |
| 8–20 s | Lembra: escrever é lento porque é um token por vez, e cada um exige uma passada inteira pelo modelo grande. Mas conferir vários tokens de uma vez é rápido, porque é em paralelo, como ler o prompt. | Esteira estreita (escrever) × esteira larga (conferir) |
| 20–34 s | Então: um modelo pequeno e rápido rascunha, digamos, cinco tokens. O modelo grande confere os cinco numa única passada e vê até onde concorda. | 5 caixas rascunhadas; a máquina grande carimba ✓ ✓ ✓ ✗ |
| 34–46 s | Ele aceita os três primeiros, troca o quarto pela escolha dele, e o pequeno recomeça dali. Em vez de um token por passada, saíram quatro. | Três caixas verdes seguem; a quarta é trocada |
| 46–54 s | Com a regra de aceitação certa, a resposta segue exatamente as probabilidades do modelo grande. É velocidade de graça. | Sirene; selo "MESMO RESULTADO" |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 23 · Tool calling por dentro: a IA só escreve JSON (65 s)

Capa: **A IA nunca entrou na internet** · Termos na tela: tool calling · function calling · JSON · schema

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Quando a IA "pesquisa na internet", ela não pesquisa nada. Ela escreve um pedido. | Caixa de resposta com uma lupa riscada |
| 3–8 s | Quem pesquisa é o programa em volta dela. Olha o mecanismo. | Placa: SALA DA DIRETORIA |
| 8–20 s | O app coloca no contexto uma lista de ferramentas: nome, descrição do que faz e um schema, que diz quais campos ela aceita. Tudo como texto. | Um cardápio de ferramentas grampeado no manual: "buscar\_web(consulta)", "previsao\_tempo(cidade)" |
| 20–34 s | Você pergunta se vai chover em Recife. O modelo foi treinado para, nessa situação, gerar um bloco estruturado em vez de texto normal: nome da ferramenta e argumentos. | Na tela: { "name": "previsao\_tempo", "arguments": { "cidade": "Recife" } } |
| 34–46 s | O app lê esse bloco, chama a API de previsão de verdade e cola o resultado de volta na conversa, como se fosse uma nova mensagem. | O bloco sai da fábrica, vai até um prédio "API" e volta com "80% de chuva" |
| 46–56 s | Aí o modelo roda de novo, agora com o resultado no contexto, e escreve a resposta. Ele nunca clicou, nunca navegou. Só escreveu JSON e leu a resposta. | Sirene; a resposta final sai em verde |
| 56–65 s | Fechamento padrão. | Placa de aviso |

### 24 · MCP por dentro (70 s)

Capa: **O que é MCP de verdade** · Termos na tela: MCP · cliente · servidor · JSON-RPC · tools · resources · prompts

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Todo mundo fala de MCP. Pouca gente sabe que ele é só um jeito padronizado de fazer o que você viu no vídeo das ferramentas. | Uma tomada universal desenhada |
| 3–8 s | Model Context Protocol, publicado pela Anthropic em novembro de 2024, como padrão aberto. | Placa: SALA DA DIRETORIA · ficha "MCP · 2024" |
| 8–22 s | O problema: com 10 apps de IA e 10 serviços, cada par precisava de uma integração própria. Cem integrações. Com um padrão, cada um implementa uma vez: 10 mais 10. | Grade de 100 fios virando 20 fios ligados a um barramento. REAL (conta) |
| 22–38 s | Do lado do serviço, existe um servidor MCP: um programa que embrulha o Google Drive, o Slack, um banco de dados. Do lado do app, um cliente MCP. Eles conversam por mensagens em JSON-RPC, um formato simples de pedido e resposta. | Dois prédios: "CLIENTE" e "SERVIDOR", trocando envelopes JSON |
| 38–52 s | O servidor oferece três coisas: tools, ações que o modelo pode pedir; resources, dados que o app pode ler; e prompts, modelos de instrução prontos. As tools viram exatamente aquela lista de ferramentas no contexto. | Três gavetas: TOOLS · RESOURCES · PROMPTS |
| 52–62 s | E o cuidado: a descrição de cada ferramenta entra no contexto como texto. Um servidor malicioso pode esconder instruções ali. Conecte só servidores em que você confia. | Sirene; uma descrição com uma linha escondida em vermelho |
| 62–70 s | Fechamento padrão. | Placa de aviso |

### 25 · LONGO · O que é um agente, de verdade: o loop (100 s)

Capa: **Agente é um while** · Termos na tela: agente · loop · ReAct · observação · erro composto

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | Agente de IA parece mágica. Por dentro, é um loop de poucas linhas de código. | Um laço de esteira fechado |
| 4–10 s | Vou te mostrar o loop, e a conta que explica por que agentes erram tanto. | Placa: EXPEDIÇÃO |
| 10–26 s | O padrão vem de um artigo de 2022 chamado ReAct: pensar, agir, observar. O modelo pensa no próximo passo, pede uma ferramenta, recebe o resultado e pensa de novo. | Três estações em círculo: PENSAR → AGIR → OBSERVAR. Ficha "ReAct · 2022" |
| 26–42 s | Em código: enquanto não terminou, mande o histórico para o modelo. Se ele pediu uma ferramenta, execute e adicione o resultado ao histórico. Se ele respondeu sem pedir nada, acabou. | Pseudocódigo: enquanto não\_terminou: resposta = modelo(histórico); se pediu\_ferramenta: histórico += executar(...); senão: fim |
| 42–56 s | Repara: a cada volta, o histórico cresce. Todo resultado de busca, todo arquivo lido, tudo entra no contexto. O agente vai ficando mais caro e mais lento a cada passo. | Pilha de caixas crescendo a cada volta |
| 56–74 s | E agora a conta. Se cada passo tem 95% de chance de dar certo, 10 passos seguidos dão certo só 60% das vezes. Vinte passos: 36%. Com 99% por passo, vinte passos ainda caem para 82%. | Sirene; contas na tela: 0,95¹⁰ ≈ 60% · 0,95²⁰ ≈ 36% · 0,99²⁰ ≈ 82%. REAL (conta) |
| 74–88 s | É por isso que bons agentes têm pontos de checagem: limite de passos, verificação do resultado, e pedido de aprovação humana antes de qualquer ação que não dá para desfazer. | Placas: LIMITE DE PASSOS · VERIFICAÇÃO · APROVAÇÃO HUMANA |
| 88–100 s | Fechamento padrão. | Placa de aviso |

## Vídeos 26 a 30

### 26 · LONGO · RAG por dentro, passo a passo (110 s)

Capa: **Como a IA "lê" seus documentos** · Termos na tela: RAG · chunk · embedding · banco vetorial · top-k · reranking · busca híbrida

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | Quando você manda a IA responder com base nos seus 500 documentos, ela não lê os 500. Lê uns cinco pedaços. | 500 pastas; só 5 folhas iluminadas |
| 4–10 s | O nome disso é RAG. E cada etapa dele pode dar errado de um jeito diferente. | Placa: ALMOXARIFADO |
| 10–24 s | Antes de qualquer pergunta, vem a indexação. Cada documento é cortado em pedaços, os chunks, de algumas centenas de tokens, geralmente com um pouco de sobreposição para não cortar uma ideia no meio. | Guilhotina cortando documentos em fatias que se sobrepõem levemente |
| 24–36 s | Cada chunk passa por um modelo de embedding e vira um vetor, uma seta no mapa de significados. Esses vetores vão para um banco vetorial. | Fatias virando setas e sendo guardadas em prateleiras numeradas |
| 36–50 s | Na hora da pergunta, a pergunta também vira um vetor. O sistema busca os chunks cujas setas apontam mais na mesma direção, pela similaridade de cosseno, e pega os k melhores. Digamos, cinco. | A seta da pergunta procura as 5 mais alinhadas; ângulos destacados |
| 50–60 s | Muitos sistemas ainda passam esses candidatos por um reranker, um modelo que lê pergunta e trecho juntos e reordena com mais precisão. | Uma máquina reordenando as 5 folhas |
| 60–72 s | Por fim, os trechos são colados no prompt com uma instrução do tipo: responda só com base nisso e cite de onde tirou. Só aí o modelo gera a resposta. | As 5 folhas grampeadas no manual entrando na fábrica |
| 72–96 s | Onde quebra: o chunk cortou a informação ao meio; a pergunta usa palavras diferentes do documento; embeddings são ruins com códigos, números e nomes exatos, por isso se combina com busca por palavra-chave; e a resposta certa estava no sexto chunk, não nos cinco. | Sirene; quatro placas de DEFEITO, uma por falha |
| 96–100 s | Quando um RAG erra, quase nunca é o modelo. É a busca. | Uma lupa com a etiqueta "O PROBLEMA ESTÁ AQUI" |
| 100–110 s | Fechamento padrão. | Placa de aviso |

### 27 · Modelos de raciocínio: o que é o "pensando..." (75 s)

Capa: **O que a IA faz enquanto "pensa"** · Termos na tela: modelo de raciocínio · chain-of-thought · aprendizado por reforço · recompensa verificável · computação no teste

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Quando aparece "pensando...", a IA está escrevendo. Só que para ela mesma. | Uma caixa com balão de pensamento cheio de texto cinza |
| 3–8 s | E aprender a escrever esse rascunho exigiu um tipo novo de treino. | Placa: CONTROLE DE QUALIDADE |
| 8–20 s | Lembra que cada token é uma passada pela fábrica? Mais tokens antes da resposta significa mais computação gasta no problema. Um rascunho de mil tokens é mil passadas pensando. | Contador de passadas subindo enquanto o rascunho cresce |
| 20–38 s | O treino: dão ao modelo problemas com resposta que dá para conferir automaticamente, como contas e código com testes. Ele tenta, escreve o raciocínio que quiser, e só ganha recompensa se a resposta final estiver certa. | Problemas entrando; um carimbo ✓ só no final da folha. Fichas: "o1 · 2024", "DeepSeek-R1 · 2025" |
| 38–52 s | Ninguém ensina como pensar. Com aprendizado por reforço, comportamentos úteis aparecem sozinhos: conferir conta, voltar atrás, escrever "espera, errei". O DeepSeek publicou exemplos disso em 2025. | Sirene; no rascunho aparece "espera..." e uma seta de volta |
| 52–66 s | Dois cuidados. Os tokens de pensamento são cobrados como saída. E pesquisas mostram que o raciocínio escrito nem sempre é o que de fato levou à resposta. Leia como pista, não como confissão. | Duas placas de aviso: CUSTO · FIDELIDADE |
| 66–75 s | Fechamento padrão. | Placa de aviso |

### 28 · Como a IA vê uma imagem (60 s)

Capa: **Uma imagem vale 196 palavras** · Termos na tela: Vision Transformer · patch · token visual · multimodal

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Para a IA, uma foto vira uma frase de 196 palavras. | Uma foto quebrando em um mosaico |
| 3–8 s | A técnica vem de um artigo de 2020 chamado "Uma imagem vale 16 por 16 palavras". | Placa: TOKENIZADOR · ficha "Vision Transformer · 2020" |
| 8–22 s | A imagem é cortada em quadrados de 16 por 16 pixels. Uma imagem de 224 por 224 vira uma grade de 14 por 14: 196 quadrados. | Guilhotina cortando a foto em grade 14 × 14; contador 196. REAL (conta) |
| 22–34 s | Cada quadrado tem 16 vezes 16 pixels, com 3 cores cada: 768 números. Uma multiplicação aprendida transforma isso num vetor, igual ao embedding de uma palavra. | Um quadrado virando uma fita de 768 números. REAL (conta) |
| 34–46 s | A partir daí é um Transformer normal: os quadrados ganham posição e fazem atenção entre si. O canto com a orelha presta atenção no canto com o focinho. | Sala de reunião com quadrados de imagem ligados por fios |
| 46–54 s | Nos chats multimodais, esses tokens visuais entram na mesma fila que as suas palavras. Para o modelo, é tudo sequência. | Sirene; caixas de imagem e caixas de texto na mesma esteira |
| 54–60 s | Fechamento padrão. | Placa de aviso |

### 29 · LONGO · Como a IA gera imagem: difusão (100 s)

Capa: **Toda imagem de IA começa como chiado** · Termos na tela: difusão · ruído · denoising · espaço latente · guidance

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–4 s | Toda imagem gerada por IA começa como chiado de TV. | Um quadro de chiado na esteira |
| 4–10 s | O ChatGPT escreve uma palavra por vez. Os geradores de imagem fazem outra coisa: limpam sujeira. | Placa: LABORATÓRIO |
| 10–26 s | No treino, pegam milhões de imagens reais e vão adicionando ruído aos poucos, em vários passos, até sobrar só chiado. A rede é treinada para uma única tarefa: olhar uma imagem suja e prever qual ruído foi adicionado. | Uma foto ficando mais suja passo a passo, da esquerda para a direita |
| 26–42 s | Na geração, o processo roda ao contrário. Começa do chiado puro. A rede prevê o ruído, uma parte é removida, e repete por dezenas de passos. Uma imagem vai surgindo do nada. | Mesma esteira andando para trás: chiado → borrão → forma → imagem |
| 42–58 s | E o texto? O seu prompt vira um vetor por um modelo de texto, e esse vetor entra na rede por atenção a cada passo. Ele não desenha nada. Ele empurra a limpeza numa direção. | Uma seta "gato de chapéu" apontando para dentro da máquina de limpeza |
| 58–72 s | Um truque chamado guidance: a cada passo, a rede prevê a limpeza com o prompt e sem o prompt, e o sistema exagera a diferença. Guidance alto obedece mais ao texto, mas a imagem fica artificial. | Sirene; botão GUIDANCE; duas imagens: uma fiel e saturada, outra solta |
| 72–88 s | E para ser rápido, a limpeza não acontece nos pixels. No Stable Diffusion original, uma imagem de 512 por 512 era comprimida para uma grade de 64 por 64 num espaço latente, limpa ali, e só no fim descomprimida. | Uma imagem grande vira um cubo pequeno, é limpa e volta a crescer. REAL (Stable Diffusion, 2022) |
| 88–100 s | Fechamento padrão. | Placa de aviso |

### 30 · Superposição: mais conceitos que neurônios (75 s)

Capa: **A IA guarda mais do que cabe** · Termos na tela: neurônio · superposição · polissêmico · sparse autoencoder · feature

| Tempo | Narração | Na tela |
| --- | --- | --- |
| 0–3 s | Uma IA guarda muito mais conceitos do que tem neurônios. E isso é um problema para quem tenta entender ela. | Uma gaveta pequena com mil coisas saindo |
| 3–8 s | Esse fenômeno se chama superposição. | Placa: LABORATÓRIO |
| 8–22 s | Se cada neurônio guardasse um conceito, seria fácil: achar o neurônio do "cachorro". Mas na prática um mesmo neurônio acende para coisas sem relação nenhuma. São neurônios polissêmicos. | Um neurônio com três etiquetas: "cachorro" · "código Python" · "tristeza" |
| 22–36 s | O motivo: em espaços com milhares de dimensões, cabem muito mais direções quase independentes do que dimensões. A rede usa isso para espremer conceitos, cada um como uma combinação de vários neurônios. | Muitas setas num espaço, todas quase perpendiculares. ILUSTRATIVO |
| 36–52 s | Para separar a mistura, pesquisadores treinam uma segunda rede, um sparse autoencoder, que decompõe a atividade interna em peças que raramente acendem juntas. Em 2024, a Anthropic extraiu milhões dessas peças de um modelo Claude. | Uma máquina desembaraçando um novelo em fios separados. REAL ("Scaling Monosemanticity", Anthropic, 2024) |
| 52–66 s | E elas fazem sentido: uma acende para a Ponte Golden Gate, outra para código com bug, outra para bajulação. Amplificando a da ponte, o Claude passou a dizer que era a própria ponte. | Sirene; três etiquetas acendendo; uma caixa saindo com uma ponte desenhada |
| 66–75 s | Fechamento padrão. | Placa de aviso |

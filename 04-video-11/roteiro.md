# Vídeo 11 · Como a IA cria um vídeo

- **Duração estimada:** cerca de 89 s (máximo 90).
- **Tema:** AMARELO (post 15 do feed; fecha a linha amarela 13–15).
- **Vídeo independente:** explica tudo do zero, sem depender do vídeo 10.
- **Capa:** Nº 011 · "COMO A IA CRIA UM" · "VÍDEO" em bloco preto inclinado · selo vermelho "em 90s" · "300 imagens limpas ao mesmo tempo" · rolo de filme com quadros indo de pontos aleatórios à cena pronta. Arquivo pronto: `capa.png`.

## Estratégia

- Mesma fórmula do vídeo 10, que está performando: pergunta direta "Sabe como a IA…?", algo que todo mundo já viu (vídeos de IA no feed) e um processo muito visual.
- Explicação em 4 ideias simples: começa com pontos e limpa → aprendeu no treino → vídeo = 300 imagens que precisam combinar → por isso limpa tudo junto e cada pedaço olha para os outros.
- Fecha explicando algo que o público já notou (física estranha nos vídeos de IA).

## Técnicas de retenção

| Técnica | Onde |
| --- | --- |
| Pergunta direta + promessa de duração ("em noventa segundos"), igual à capa | Bloco 1 |
| Cronômetro 1:30 contando no canto o vídeo inteiro (a pessoa sabe quanto falta) | Vídeo todo |
| Problema concreto e fácil de imaginar (cachorro mudando de cor) | Bloco 3 |
| Solução visual (todas as imagens limpando juntas) | Bloco 4, perto do meio |
| Exemplo bonito do que ela aprendeu (onda, pelo ao vento) | Bloco 5 |
| Explica erro que o público já viu (copo atravessando a mesa) | Bloco 6 |

## Base técnica (conferida)

- Geradores de vídeo como o Sora (OpenAI, relatório técnico de fevereiro de 2024, "Video generation models as world simulators") usam difusão: partem de ruído e removem ruído passo a passo. O vídeo é comprimido e dividido em "pedaços de espaço-tempo" (patches) que funcionam como tokens; um transformer processa todos juntos, então cada pedaço considera os outros (atenção), o que mantém objetos consistentes ao longo do tempo. O próprio relatório cita limitações de física (ex.: vidro quebrando de forma errada). ([OpenAI](https://openai.com/index/video-generation-models-as-world-simulators/))
- "Dez segundos ≈ trezentas imagens": vídeo a 30 quadros por segundo.
- A narração simplifica: "limpa todas as imagens ao mesmo tempo" e "cada pedaço da cena olha para os outros" = difusão sobre o vídeo inteiro + atenção entre patches.

| Bloco | Tempo est. | Narração (resumo) | Na tela | Som |
| --- | --- | --- | --- | --- |
| 1 · Gancho | 0–13 s | Sabe como a IA cria um vídeo? Em noventa segundos, você vai entender. Começa com pontos aleatórios e vai limpando até aparecer a cena pedida. | Frame 0 já em movimento: uma tela cheia de pontos aleatórios piscando, com o selo vermelho **em 90s** (igual ao da capa) no canto superior. Em "noventa segundos", o selo vira um cronômetro **1:30** que começa a contar para trás e fica pequeno no canto durante todo o vídeo, chegando a 0:00 no fechamento. Caixa de texto "um cachorro na praia" aparece em cima. Em "vai limpando", os pontos somem em ondas e surge a cena desenhada (cachorro de contorno, mar, sol), já se mexendo. | cartão de ponto, chiado diminuindo |
| 2 · O treino | 11–27 s | Aprendeu vendo milhões de vídeos: cada vídeo era coberto de pontos até sumir, e a IA descobria como limpar de volta. Repetiu milhões de vezes. | Placa **CONTROLE DE QUALIDADE** (com "treino" menor). Um rolo de filme passa por uma máquina **COBRIDORA** e sai coberto de pontos; a esteira volta e o mascote limpa (✗ errou, ✓ acertou). Contador **milhões de vídeos** em azul. | máquina, ✗, ✓, tiques |
| 3 · O problema | 27–42 s | 10 segundos = cerca de 300 imagens. Se limpasse cada uma separada, o cachorro mudaria de cor e a praia tremeria. | Contador **10 s = 300 imagens** com quadros se empilhando como cartas. Demonstração do erro: os quadros limpos um por um, e ao tocar em sequência o cachorro troca de cor (branco → amarelo → preto) e o fundo treme. Selo ILUSTRATIVO e ✗ vermelho. | tique rápido, buzina curta |
| 4 · A solução | 42–57 s | Limpa todas as imagens ao mesmo tempo, e cada pedaço olha para os outros: a orelha num momento olha para a orelha no momento seguinte. | Os 300 quadros alinhados lado a lado (rolo de filme). Todos perdem pontos JUNTOS. Zoom na orelha do cachorro em 3 quadros seguidos; linhas azuis ligam a orelha de um quadro à do seguinte (rótulo **olha para o próximo**). Ao tocar, o cachorro fica igual em todos. ✓ verde. | chiado diminuindo em sincronia, ding |
| 5 · O movimento | 57–69 s | Assim o movimento sai contínuo: ela aprendeu como as coisas costumam se mexer, a onda que quebra, o pelo ao vento. | A cena final rodando em loop suave: onda quebrando, pelo do cachorro balançando. Etiqueta **aprendeu vendo milhões de vídeos**. | mar, vento leve |
| 6 · O erro de física | 69–84 s | Por isso ainda erra a física: copo atravessando a mesa, braço a mais. Sabe como o movimento parece, sem saber as regras. | Cena de contorno: um copo desce e atravessa a mesa (carimbo **ERRO DE FÍSICA**). Depois, uma silhueta de contorno ganha um terceiro braço por um instante. Frase final em destaque: **sabe como parece · não sabe as regras**. | vidro, buzina, tique final |
| 7 · Fechamento | 84–88 s | Siga a fábrica. Uma peça nova todo dia. | Esteira acelera e leva tudo para a direita. Placa de aviso + selo FÁBRICA. Últimos 1,5 s parados. | apito |

**Regras:** sem logos de geradores de vídeo (Sora, Veo etc.); sem pessoas reais. Pontos aleatórios podem usar tons de cinza; cenas geradas usam só a paleta da marca. Animações levam ILUSTRATIVO.

## Legenda do post

Um vídeo de IA de 10 segundos são 300 imagens criadas ao mesmo tempo.

Siga a fábrica. Uma peça nova todo dia.

#inteligenciaartificial #ia #chatgpt

"""Tempo PROVISÓRIO das palavras, sem áudio: estima a duração de cada palavra pelo tamanho.
Serve só para montar e revisar as cenas antes da narração existir. Depois de gerar
public/narracao.mp3, troque por: transcrever.py + alinhar.py (tempo real).
Uso: python -I scripts/tempo_estimado.py roteiro/legenda.txt src/timing.json
"""
import sys, json, re

POR_LETRA, BASE = 0.058, 0.07          # calibrado no vídeo 07 (~2,7 palavras/s com as pausas)
VIRGULA, PONTO, PARAGRAFO = 0.16, 0.32, 0.45
EXTENSO = {"90": "noventa"}

paras = [p.strip() for p in open(sys.argv[1], encoding="utf-8").read().split("\n\n") if p.strip()]
t, palavras, blocos = 0.0, [], []
for b, p in enumerate(paras):
    s0 = t
    for w in p.split():
        falado = EXTENSO.get(w.strip(",.?!"), w)
        d = BASE + POR_LETRA * len(re.sub(r"[^\w]", "", falado))
        palavras.append({"t": w, "b": b, "s": round(t, 3), "e": round(t + d, 3)})
        t += d
        if re.search(r"[.?!]$", w): t += PONTO
        elif w.endswith(","): t += VIRGULA
    blocos.append({"s": round(s0, 3), "e": palavras[-1]["e"]})
    t = palavras[-1]["e"] + PARAGRAFO
json.dump({"provisorio": True, "palavras": palavras, "blocos": blocos}, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for i, bl in enumerate(blocos):
    print(f"bloco {i}: {bl['s']:.2f} - {bl['e']:.2f}")

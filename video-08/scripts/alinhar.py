"""Alinha o texto da legenda (um parágrafo por bloco) às palavras do Whisper.
Uso: python -I scripts/alinhar.py words.json legenda.txt saida.json
"""
import sys, json, re, unicodedata, difflib

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)

ww = json.load(open(sys.argv[1], encoding="utf-8"))
# junta pedaços que o Whisper separa: "GPT -4 -O", "15 .278", "meio -termo"
merged = []
for w in ww:
    if merged and re.match(r"^[-.]", w["w"]):
        merged[-1] = {"w": merged[-1]["w"] + w["w"], "s": merged[-1]["s"], "e": w["e"]}
    else:
        merged.append(dict(w))

paras = [p.strip() for p in open(sys.argv[2], encoding="utf-8").read().split("\n\n") if p.strip()]
cap = []
for b, p in enumerate(paras):
    for t in p.split():
        cap.append({"t": t, "b": b})

a = [norm(w["w"]) for w in merged]
c = [norm(w["t"]) for w in cap]
sm = difflib.SequenceMatcher(None, c, a, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
        for k in range(i2 - i1):
            cap[i1 + k]["s"] = merged[j1 + k]["s"]; cap[i1 + k]["e"] = merged[j1 + k]["e"]
    elif tag == "replace":
        s0, e0 = merged[j1]["s"], merged[j2 - 1]["e"]
        n = i2 - i1
        for k in range(n):
            cap[i1 + k]["s"] = round(s0 + (e0 - s0) * k / n, 3)
            cap[i1 + k]["e"] = round(s0 + (e0 - s0) * (k + 1) / n, 3)
        print("aviso: span ajustado:", [x["t"] for x in cap[i1:i2]], "<-", [x["w"] for x in merged[j1:j2]])
    elif tag == "insert":
        print("aviso: Whisper ouviu a mais:", [x["w"] for x in merged[j1:j2]])
# palavras sem tempo (delete): interpolar entre vizinhos
for i, w in enumerate(cap):
    if "s" not in w:
        prev = next((cap[k]["e"] for k in range(i - 1, -1, -1) if "e" in cap[k]), 0)
        nxt = next((cap[k]["s"] for k in range(i + 1, len(cap)) if "s" in cap[k]), prev + 0.3)
        w["s"], w["e"] = prev, round((prev + nxt) / 2, 3)
        print("aviso: sem tempo, interpolado:", w["t"])

blocos = []
for b in range(len(paras)):
    ws = [w for w in cap if w["b"] == b]
    blocos.append({"s": ws[0]["s"], "e": ws[-1]["e"]})
json.dump({"palavras": cap, "blocos": blocos}, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for i, bl in enumerate(blocos):
    print(f"bloco {i+1}: {bl['s']:.2f} - {bl['e']:.2f}")

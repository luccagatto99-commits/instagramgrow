"""Gera os efeitos sonoros da marca por síntese (sem direitos de terceiros).
Uso: python -I scripts/sfx.py public/sfx
"""
import sys, os, subprocess, numpy as np

SR = 44100
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)


def t_(d):
    return np.arange(int(d * SR)) / SR


def lp(x, fc):  # passa-baixa de 1 polo (fc pode variar no tempo)
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def hp(x, fc):
    return x - lp(x, fc)


def ruido(d):
    return rng.standard_normal(int(d * SR))


def metal(d, fs, decai):  # ressonâncias inarmônicas de metal
    t = t_(d)
    return sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t * k) for f, k in zip(fs, decai))


def mix(*partes, d):
    y = np.zeros(int(d * SR))
    for at, s in partes:
        i = int(at * SR); j = min(len(y), i + len(s)); y[i:j] += s[: j - i]
    return y


def salva(nome, y, pico=0.9):
    y = y / (np.abs(y).max() + 1e-9) * pico
    fade = min(len(y), int(0.01 * SR))
    y[-fade:] *= np.linspace(1, 0, fade)
    raw = (np.stack([y, y], 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-b:a', '192k',
                    os.path.join(OUT, nome + '.mp3')], input=raw, check=True)
    print(nome, round(len(y) / SR, 2), 's')


def thump(d, f0, f1, k):
    t = t_(d)
    return np.sin(2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 30)) / SR) * np.exp(-t * k)


# tique: clique mecânico curto
t = t_(0.06)
tique = hp(ruido(0.06), 2500) * np.exp(-t * 160) * 0.8 + np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 120) * 0.5
salva('tique', tique, 0.8)

# cartão de ponto: "ka-chunk" + sininho
clique = hp(ruido(0.05), 1800) * np.exp(-t_(0.05) * 120)
chunk = lp(ruido(0.25), 900) * np.exp(-t_(0.25) * 25) * 2.5 + thump(0.25, 160, 70, 18) * 0.9 + metal(0.25, [1250, 2380], [30, 40]) * 0.15
sino = metal(0.9, [2093, 4186 * 1.003, 6280], [6, 9, 14]) * 0.18
salva('cartao_ponto', mix((0, clique), (0.09, chunk), (0.13, sino), d=1.05))

# guilhotina: corrida da lâmina + golpe metálico + baque
d = 0.18; t = t_(d)
corrida = lp(ruido(d), 600 + 5000 * (t / d) ** 2) * np.minimum(1, t / d) ** 2 * 0.6
golpe = mix((0, hp(ruido(0.12), 2500) * np.exp(-t_(0.12) * 60)), (0, metal(0.6, [1480, 2650, 3910, 5230], [9, 12, 16, 22]) * 0.35), d=0.6)
baque = thump(0.35, 180, 55, 14) * 1.1
salva('guilhotina', mix((0, corrida), (d, golpe), (d, baque), d=d + 0.6))

# carimbo: baque pesado e seco
d = 0.35
carimbo = thump(d, 140, 48, 16) * 1.2 + lp(ruido(d), 700) * np.exp(-t_(d) * 35) * 1.8 + hp(ruido(d), 3000) * np.exp(-t_(d) * 200) * 0.25
salva('carimbo', carimbo)

# sirene: sobe e desce em 1 s
d = 1.0; t = t_(d)
f = 620 + 300 * np.sin(np.pi * t / d)
fase = 2 * np.pi * np.cumsum(f) / SR
sir = (np.sin(fase) + 0.35 * np.sin(2 * fase) + 0.15 * np.sin(3 * fase))
sir = lp(sir, 3000) * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.15)
salva('sirene', sir, 0.7)

# apito a vapor: acorde de 3 tubos + sopro
d = 1.4; t = t_(d)
env = np.minimum(1, t / 0.12) * np.minimum(1, (d - t) / 0.35)
vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
tubos = sum(np.sin(2 * np.pi * fr * vib * t) * a for fr, a in [(523, 1), (659, 0.8), (784, 0.6), (1046, 0.2)])
sopro = hp(lp(ruido(d), 4000), 800) * 0.25
salva('apito', (tubos + sopro) * env, 0.7)

# toque: celular tocando (trinado eletrônico em duas rajadas)
d = 1.1; t = t_(d)
trinado = np.where(np.sin(2 * np.pi * 22 * t) > 0, 1320, 1660)
fase = 2 * np.pi * np.cumsum(trinado) / SR
rajada = ((t % 0.5) < 0.36) * np.minimum(1, (t % 0.5) / 0.01) * np.minimum(1, (0.36 - t % 0.5).clip(0) / 0.02)
toque = lp(np.sin(fase) + 0.3 * np.sin(2 * fase), 3500) * rajada
salva('toque', toque, 0.6)

# máquina em loop (4 s, emenda sem estalo): zumbido + batidas de pistão
d = 4.0; t = t_(d)
zumbido = np.sin(2 * np.pi * 55 * t) * 0.5 + np.sin(2 * np.pi * 110 * t) * 0.25 + lp(ruido(d), 250) * 3
batidas = np.zeros_like(t)
for k in range(8):
    at = k * 0.5
    s = thump(0.3, 120, 60, 22) * 0.5 + lp(ruido(0.3), 1500) * np.exp(-t_(0.3) * 40) * (0.8 if k % 2 else 0.4)
    i = int(at * SR); batidas[i:i + len(s)] += s[: len(batidas) - i]
loop = zumbido + batidas
cross = int(0.2 * SR)  # cruza o fim com o começo
loop[:cross] = loop[:cross] * np.linspace(0, 1, cross) + loop[-cross:] * np.linspace(1, 0, cross)
loop = loop[:-cross]
loop = loop / np.abs(loop).max() * 0.6
raw = (np.stack([loop, loop], 1) * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-b:a', '192k',
                os.path.join(OUT, 'maquina_loop.mp3')], input=raw, check=True)
print('maquina_loop', round(len(loop) / SR, 2), 's')

# chiado: ruído de TV curto e macio (estragar / pontos aleatórios)
d = 0.45; t = t_(d)
env = np.minimum(1, t / 0.04) * np.exp(-t * 5)
chiado = hp(lp(ruido(d), 6000), 900) * env
salva('chiado', chiado, 0.5)

# ding: sininho curto (imagem pronta)
d = 0.9; t = t_(d)
ding = metal(d, [1568, 3136 * 1.002, 4700], [5, 8, 12]) * np.minimum(1, t / 0.004)
salva('ding', ding, 0.6)

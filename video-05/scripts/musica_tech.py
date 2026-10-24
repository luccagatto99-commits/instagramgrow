"""Gera uma trilha eletrônica própria (sem direitos de terceiros), no clima dos reels de tecnologia:
arpejo de synth em semicolcheias, pad, baixo com "pump" (sidechain), bumbo 4/4, palmas e chimbal.
Estrutura: intro só com pad e arpejo, entrada da batida, uma respiração no meio e final com fade.
Uso: python -I scripts/musica_tech.py segundos saida.mp3"""
import sys, subprocess, numpy as np
SR = 44100
dur = float(sys.argv[1]); saida = sys.argv[2]
BPM = 112; beat = 60 / BPM; bar = 4 * beat
n = int((dur + 4) * SR)
L = np.zeros(n); R = np.zeros(n)
rng = np.random.default_rng(11)

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def pluck(m, d, amp):  # synth "pluck": harmônicos de serra, os agudos morrem antes (filtro fechando)
    t = np.arange(int(d * SR)) / SR
    f = hz(m); s = np.zeros_like(t)
    for k in range(1, 40):
        if k * f > 9000: break
        s += np.sin(2*np.pi*k*f*t) / k * np.exp(-t * (6 + 2.2*k))
    return amp * s * np.minimum(1, t * 400)

def pad(m, d, amp):  # serras desafinadas, só os primeiros harmônicos (filtro baixo)
    t = np.arange(int(d * SR)) / SR
    env = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)
    s = np.zeros_like(t)
    for dt in (-0.004, 0, 0.004):
        for k in range(1, 6):
            s += np.sin(2*np.pi*k*hz(m)*(1+dt)*t + k) / k
    return amp * env * s / 3

def add(buf_l, buf_r, sig, at, pan=0.0):
    i = int(at * SR); j = min(n, i + len(sig)); s = sig[:j-i]
    buf_l[i:j] += s * (1 - pan); buf_r[i:j] += s * (1 + pan)

# Am - F - C - G (menor, "descobrindo"), uma volta a cada 4 compassos
acordes = [[57,60,64], [53,57,60], [48,52,55], [55,59,62]]
baixos = [33, 29, 36, 31]
arp = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 3, 2, 1, 0, 1]  # 3 = oitava da fundamental
nbar = int(np.ceil((dur + 2) / bar))
respira = range(nbar // 2, nbar // 2 + 1)  # 1 compasso sem batida no meio
fim_batida = nbar - 2                       # os 2 últimos compassos só com pad e arpejo

# camadas que "bombam" com o bumbo (sidechain) ficam separadas
PL = np.zeros(n); PR = np.zeros(n)
for b in range(nbar):
    t0 = b * bar; c = acordes[b % 4]
    for k, m in enumerate(c):
        add(PL, PR, pad(m, bar, 0.05), t0, pan=(k - 1) * 0.35)
    batida = 2 <= b < fim_batida and b not in respira
    for k, idx in enumerate(arp):
        nota = c[0] + 12 if idx == 3 else c[idx]
        acento = 1.0 if k % 4 == 0 else 0.7
        add(L, R, pluck(nota + 12, beat * 0.6, 0.06 * acento), t0 + k * beat / 4, pan=0.25 if k % 2 else -0.25)
    if b >= 1 and b < fim_batida:  # baixo em colcheias no contratempo
        for k in range(8):
            if k % 2 == 1 or b in respira:
                t = np.arange(int(beat * 0.45 * SR)) / SR
                f = hz(baixos[b % 4])
                s = (np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*2*f*t)) * np.exp(-t*5) * np.minimum(1, t*300)
                add(PL, PR, 0.16 * s, t0 + k * beat / 2)
    if batida:
        for k in range(4):
            tb = t0 + k * beat
            t = np.arange(int(0.35*SR))/SR
            kick = np.sin(2*np.pi*(48*t + 110/25*(1-np.exp(-t*25)))) * np.exp(-t*9) * 0.32
            add(L, R, kick, tb)
            if k in (1, 3):  # palmas: 3 rajadas de ruído quase juntas
                for d in (0, 0.011, 0.022):
                    t = np.arange(int(0.12*SR))/SR
                    cl = np.diff(rng.standard_normal(len(t)+1)) * np.exp(-t*(40 if d < 0.02 else 18)) * 0.035
                    add(L, R, cl, tb + d)
            t = np.arange(int(0.09*SR))/SR  # chimbal aberto no contratempo
            hat = np.diff(np.diff(rng.standard_normal(len(t)+2))) * np.exp(-t*35) * 0.012
            add(L, R, hat, tb + beat/2, pan=0.3)
            for q in (0.25, 0.75):  # chimbal fechado
                t = np.arange(int(0.03*SR))/SR
                add(L, R, np.diff(np.diff(rng.standard_normal(len(t)+2))) * np.exp(-t*120) * 0.006, tb + q*beat, pan=-0.3)
    if b + 1 in respira or b + 1 == 2:  # subida de ruído antes da batida (re)entrar
        t = np.arange(int(bar*SR))/SR
        sw = np.convolve(rng.standard_normal(len(t)), np.ones(4)/4, 'same') * (t/bar)**2 * 0.03
        add(L, R, sw, t0)

# sidechain: pad e baixo abaixam a cada bumbo (só onde há batida)
tt = np.arange(n) / SR
fase = (tt % beat) / beat
pump = 1 - 0.6 * np.exp(-fase * 7)
compasso = (tt // bar).astype(int)
tem_batida = (compasso >= 2) & (compasso < fim_batida) & ~np.isin(compasso, list(respira))
pump = np.where(tem_batida, pump, 1.0)
L += PL * pump; R += PR * pump

# reverb curto
ir = rng.standard_normal(int(1.2*SR)) * np.exp(-np.arange(int(1.2*SR))/SR*4.5); ir /= np.abs(ir).sum() / 5
def rev(x):
    N = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
L = L + 0.2 * rev(L); R = R + 0.2 * rev(R)
m = int(dur * SR); L = L[:m]; R = R[:m]
t = np.arange(m) / SR
fade = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 3.0)
st = np.stack([L*fade, R*fade], 1); st = np.tanh(st / np.abs(st).max() * 1.4) * 0.8
raw = (st * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','2','-i','-','-b:a','192k',saida], input=raw, check=True)
print('ok', saida, dur)

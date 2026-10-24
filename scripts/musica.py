"""Gera uma trilha lo-fi própria (sem direitos de terceiros): piano elétrico, baixo,
batida leve. Uso: python -I scripts/musica.py segundos saida.mp3"""
import sys, subprocess, numpy as np
SR = 44100
dur = float(sys.argv[1]); saida = sys.argv[2]
BPM = 84; beat = 60 / BPM; bar = 4 * beat
n = int((dur + 4) * SR)
L = np.zeros(n); R = np.zeros(n)
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def ep(m, d, amp):  # piano elétrico: senoide + harmônicos com decaimento
    t = np.arange(int(d * SR)) / SR
    f = hz(m)
    env = np.exp(-t * 2.2) * np.minimum(1, t * 200)
    s = np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*2*f*t)*np.exp(-t*6) + 0.08*np.sin(2*np.pi*3*f*t)*np.exp(-t*9)
    return amp * env * s * (1 + 0.15*np.sin(2*np.pi*4.5*t))

def pad(m, d, amp):
    t = np.arange(int(d * SR)) / SR
    env = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.8)
    s = sum(np.sin(2*np.pi*hz(m)*(1+dt)*t) for dt in (-0.003, 0, 0.003)) / 3
    return amp * env * s

def add(sig, at, pan=0.0):
    i = int(at * SR); j = min(n, i + len(sig)); s = sig[:j-i]
    L[i:j] += s * (1 - pan) ; R[i:j] += s * (1 + pan)

# Cmaj7 - Am7 - Fmaj7 - G6  (calmo, "estudando")
acordes = [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,64]]
baixos = [36, 33, 41, 43]
arp = [0, 2, 1, 3, 2, 1, 3, 2]
nbar = int(np.ceil((dur + 2) / bar))
for b in range(nbar):
    t0 = b * bar; c = acordes[b % 4]
    for k, m in enumerate(c):
        add(pad(m, bar, 0.035), t0, pan=(k - 1.5) * 0.2)
    add(ep(c[0]-12, bar, 0.09) + 0, t0)
    add(ep(baixos[b % 4], bar*0.9, 0.16), t0)
    if b >= 1:  # arpejo entra depois do primeiro compasso
        for k, idx in enumerate(arp):
            jit = rng.uniform(-0.012, 0.012)
            add(ep(c[idx] + 12, beat * 1.5, 0.045 * rng.uniform(0.75, 1.0)), t0 + k * beat / 2 + jit, pan=0.3 if k % 2 else -0.3)
    if b >= 2:  # batida leve
        for k in range(4):
            tb = t0 + k * beat
            if k in (0, 2):
                t = np.arange(int(0.3*SR))/SR
                kick = np.sin(2*np.pi*(50 + 70*np.exp(-t*30))*t) * np.exp(-t*12) * 0.22
                add(kick, tb)
            if k in (1, 3):
                t = np.arange(int(0.18*SR))/SR
                snare = rng.standard_normal(len(t)) * np.exp(-t*25) * 0.05
                add(np.convolve(snare, np.ones(6)/6, 'same'), tb)
            for h in (0, 0.5):
                t = np.arange(int(0.05*SR))/SR
                hat = np.diff(rng.standard_normal(len(t)+1)) * np.exp(-t*90) * 0.012
                add(hat, tb + h*beat + rng.uniform(0, 0.01), pan=0.4)

# reverb simples (ruído com decaimento) + chiado de vinil
ir = rng.standard_normal(int(1.6*SR)) * np.exp(-np.arange(int(1.6*SR))/SR*3.5); ir /= np.abs(ir).sum() / 6
def rev(x):
    N = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
L = L + 0.25 * rev(L); R = R + 0.25 * rev(R)
chiado = np.convolve(rng.standard_normal(n), np.ones(30)/30, 'same') * 0.004
L += chiado; R += chiado
m = int(dur * SR); L = L[:m]; R = R[:m]
t = np.arange(m) / SR
fade = np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 3.0)
st = np.stack([L*fade, R*fade], 1); st /= np.abs(st).max() / 0.8
raw = (st * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','2','-i','-','-b:a','192k',saida], input=raw, check=True)
print('ok', saida, dur)

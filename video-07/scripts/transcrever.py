import sys, json
from faster_whisper import WhisperModel
m = WhisperModel("medium", device="cpu", compute_type="int8")
import subprocess, numpy as np
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True).stdout
audio = np.frombuffer(raw, np.float32)
segs, _ = m.transcribe(audio, language="pt", word_timestamps=True, beam_size=5)
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start,3), "e": round(w.end,3)})
json.dump(words, open(sys.argv[2],"w",encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(words))

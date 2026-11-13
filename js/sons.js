// Miaous et ronrons synthétisés en direct (aucun fichier audio).
// L'AudioContext n'est créé qu'au premier geste : iOS l'exige.
let ac = null;
let actif = true;
let dernierRonron = 0;

export function activerSons(oui) { actif = !!oui; }

function ctx() {
  if (!actif) return null;
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function miaou(t0, hauteur, duree, volume = 0.28) {
  const o = ac.createOscillator();
  o.type = 'sawtooth';
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 2.5;
  const g = ac.createGain();
  o.frequency.setValueAtTime(360 * hauteur, t0);
  o.frequency.exponentialRampToValueAtTime(780 * hauteur, t0 + duree * 0.35);
  o.frequency.exponentialRampToValueAtTime(400 * hauteur, t0 + duree);
  bp.frequency.setValueAtTime(800, t0);
  bp.frequency.linearRampToValueAtTime(2100, t0 + duree * 0.35);
  bp.frequency.linearRampToValueAtTime(900, t0 + duree);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(volume, t0 + 0.04);
  g.gain.setValueAtTime(volume, t0 + duree * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  o.connect(bp); bp.connect(g); g.connect(ac.destination);
  o.start(t0); o.stop(t0 + duree + 0.05);
}

function ronronner(t0, duree) {
  const len = Math.floor(ac.sampleRate * duree);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 300;
  const amp = ac.createGain();
  amp.gain.value = 0.5;
  const lfo = ac.createOscillator();
  lfo.frequency.value = 25;
  const prof = ac.createGain();
  prof.gain.value = 0.5;
  lfo.connect(prof); prof.connect(amp.gain);
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(0.8, t0 + 0.3);
  env.gain.setValueAtTime(0.8, t0 + duree - 0.5);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  src.connect(lp); lp.connect(amp); amp.connect(env); env.connect(ac.destination);
  src.start(t0); src.stop(t0 + duree); lfo.start(t0); lfo.stop(t0 + duree);
}

export const sons = {
  mrrp() {
    if (!ctx()) return;
    const t = ac.currentTime + 0.03;
    miaou(t, 1.5, 0.18); miaou(t + 0.16, 1.8, 0.16);
  },
  caresse() {
    if (!ctx()) return;
    const now = Date.now();
    if (now - dernierRonron < 2300) return;
    dernierRonron = now;
    const t = ac.currentTime + 0.03;
    miaou(t, 1.5, 0.2, 0.22); ronronner(t + 0.15, 2.4);
  },
  chanson() {
    if (!ctx()) return;
    const t = ac.currentTime + 0.05;
    [1, 1.12, 1.26, 1.5, 1.26, 1.5, 2].forEach((p, i, a) => miaou(t + i * 0.22, p, i === a.length - 1 ? 0.55 : 0.2));
  },
  fete() {
    if (!ctx()) return;
    const t = ac.currentTime + 0.05;
    miaou(t, 1, 0.26); miaou(t + 0.28, 1.26, 0.26); miaou(t + 0.56, 1.5, 0.26); miaou(t + 0.9, 2, 0.6);
    ronronner(t + 1.6, 2.2);
  },
};

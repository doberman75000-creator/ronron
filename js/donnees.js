// Données de Ronron : stockées uniquement sur l'appareil (localStorage).
const CLE = 'ronron:v1';
export const VERSION_DONNEES = 1;

// ---------- Dates (toujours en heure locale) ----------
const p2 = (n) => String(n).padStart(2, '0');
export const cleDate = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const versDate = (k) => { const [y, m, j] = k.split('-').map(Number); return new Date(y, m - 1, j); };
export const ajouterJours = (k, n) => { const d = versDate(k); d.setDate(d.getDate() + n); return cleDate(d); };
export const aujourdhui = () => cleDate(new Date());
export const ecartJours = (a, b) => Math.round((versDate(b) - versDate(a)) / 86400000);
export const heureMaintenant = () => { const d = new Date(); return `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const dateCourte = (k) => { const d = versDate(k); return (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS[d.getMonth()]; };

// ---------- Stades ----------
export const PALIERS = [
  { stade: 1, nom: 'Chaton', baisse: 0 },
  { stade: 2, nom: 'Chaton curieux', baisse: 0.15 },
  { stade: 3, nom: 'Chaton ado', baisse: 0.30 },
  { stade: 4, nom: 'Chat adulte', baisse: 0.50 },
  { stade: 5, nom: 'Chat d’élite', baisse: 0.75 },
  { stade: 6, nom: 'Chat légendaire', baisse: 1 },
];
export const seuilStade = (ref, stade) => stade >= 6 ? 0 : Math.floor(ref * (1 - PALIERS[stade - 1].baisse));

export const BOUTIQUE = [
  { id: 'noeud', nom: 'Nœud papillon', prix: 300 },
  { id: 'bonnet', nom: 'Bonnet en laine', prix: null, defi: true },
  { id: 'couronne', nom: 'Couronne de fleurs', prix: 1200 },
];
// Cadeau surprise : prix fixe, tirage parmi les articles existants.
// Doublon : la moitié du prix est rendue (on ne peut donc jamais y gagner en boucle).
export const CADEAU = { prix: 400, rembourseDoublon: 200, chances: { noeud: 60, bonnet: 30, couronne: 10 } };
export function tirerCadeau(alea = Math.random()) {
  let cumul = 0;
  const total = Object.values(CADEAU.chances).reduce((s, p) => s + p, 0);
  for (const [id, p] of Object.entries(CADEAU.chances)) { cumul += p / total; if (alea < cumul) return id; }
  return Object.keys(CADEAU.chances).pop();
}
export const QUETES = [
  { id: 'reveil', titre: 'Réveil tranquille', desc: 'Première cigarette après 9 h', gain: 10 },
  { id: 'cafe', titre: 'Café solo', desc: 'Un café sans cigarette à côté', gain: 5 },
  { id: 'pause', titre: 'Pause féline', desc: 'Remplacer une cigarette par 3 min de marche', gain: 8 },
];
export const BONUS_QUETES = 10;
export const BONUS_RONRON = 5;
export const BONUS_PALIER = 50;

// ---------- Lecture / écriture ----------
let etat = null;
const abonnes = new Set();
export const surChangement = (fn) => abonnes.add(fn);

export function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    etat = brut ? JSON.parse(brut) : null;
  } catch (e) { etat = null; }
  return etat;
}
export const lire = () => etat;
export function enregistrer() {
  let ok = true;
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { ok = false; console.error('Ronron : enregistrement impossible', e); }
  abonnes.forEach((fn) => fn(etat));
  return ok;
}
// Renvoie true si la modification est bien enregistrée ; sinon l'état précédent est restauré.
export function modifier(fn) {
  const avant = JSON.stringify(etat);
  fn(etat);
  if (enregistrer()) return true;
  etat = JSON.parse(avant);
  return false;
}
export function effacerTout() { localStorage.removeItem(CLE); etat = null; abonnes.forEach((fn) => fn(etat)); }

export function nouvelEtat({ nom = 'Miette', reference = 15, paquet = 20, prix = 12.6, debut = aujourdhui() } = {}) {
  return {
    v: VERSION_DONNEES,
    installe: aujourdhui(),
    reglages: { nom, reference, debut, paquet, prix, sons: true, anims: true, paliersAuto: true },
    objectifs: [{ date: debut, objectif: reference }],
    prevus: [],
    jours: {},
    quetes: {},
    bonus: [],
    depenses: [],
    possede: [],
    porte: null,
    refusPalier: null,
    sauvegarde: null,
    vu: { stade: null, etoiles: null },
  };
}
export function demarrer(e) { etat = e; enregistrer(); }

// ---------- Import / export ----------
export function importer(json) {
  if (!json || typeof json !== 'object') throw new Error('Fichier illisible.');
  if (json.format === 'ronron-sauvegarde/1' && json.etat) {
    return Object.assign(nouvelEtat(), json.etat);
  }
  if (json.format === 'ronron-historique/1') {
    const r = json.reglages || {};
    const e = nouvelEtat({
      reference: r.referenceParJour || 15,
      paquet: r.cigarettesParPaquet || 20,
      prix: r.prixPaquet || 12.6,
      debut: r.debut || aujourdhui(),
    });
    const hist = (json.plan && json.plan.historiqueObjectifs) || [];
    if (hist.length) e.objectifs = hist.map((x) => ({ date: x.date, objectif: x.objectif }));
    e.prevus = ((json.plan && json.plan.prochainesEtapes) || []).map((x) => ({ date: x.date, objectif: x.objectif }));
    (json.jours || []).forEach((j) => { e.jours[j.date] = { n: j.cigarettes, heures: [], estime: !!j.estime, importe: true }; });
    e.source = json.source || 'Import';
    return e;
  }
  throw new Error('Ce fichier n’est pas une sauvegarde Ronron.');
}
export function exporter() {
  return { format: 'ronron-sauvegarde/1', exporteLe: new Date().toISOString(), etat };
}

// ---------- Calculs ----------
export const R = () => etat.reglages;
export const prixCigarette = () => R().prix / Math.max(1, R().paquet);
export const nbDu = (k) => (etat.jours[k] ? etat.jours[k].n : 0);
// Un jour sans saisie compte comme 0 cigarette, sauf s'il précède l'installation (trou après un import).
export const connu = (k) => !!etat.jours[k] || k >= etat.installe;
export function joursManquants() { return listeJours().filter((k) => !connu(k)); }
export function objectifDu(k) {
  let o = R().reference;
  for (const x of [...etat.objectifs].sort((a, b) => a.date.localeCompare(b.date))) { if (x.date <= k) o = x.objectif; }
  return o;
}
export const objectifActuel = () => objectifDu(aujourdhui());
export const numeroJour = () => ecartJours(R().debut, aujourdhui()) + 1;

// Jours depuis le début, du plus ancien à aujourd'hui inclus.
export function listeJours() {
  const out = [];
  const fin = aujourdhui();
  for (let k = R().debut; k <= fin; k = ajouterJours(k, 1)) out.push(k);
  return out;
}
export function evitees() {
  const ref = R().reference;
  return listeJours().reduce((s, k) => s + (connu(k) ? Math.max(0, ref - nbDu(k)) : 0), 0);
}
export const eurosEconomises = () => evitees() * prixCigarette();

export function plusBasObjectif() {
  const t = aujourdhui();
  return Math.min(R().reference, ...etat.objectifs.filter((x) => x.date <= t).map((x) => x.objectif));
}
function serieZeroMax() {
  let best = 0, cur = 0;
  const t = aujourdhui();
  for (const k of listeJours()) { if (k === t) break; if (connu(k) && nbDu(k) === 0) { cur++; best = Math.max(best, cur); } else cur = 0; }
  return best;
}
export function stadeActuel() {
  if (serieZeroMax() >= 7) return 6;
  const ref = R().reference, m = plusBasObjectif();
  let s = 1;
  for (let st = 2; st <= 5; st++) if (m <= seuilStade(ref, st)) s = st;
  return s;
}
export function etoiles() {
  const s = stadeActuel();
  if (s >= 6) return 3;
  const seuil = s === 1 ? R().reference : seuilStade(R().reference, s);
  return Math.max(0, Math.min(3, seuil - plusBasObjectif()));
}
// Date à laquelle chaque stade a été atteint (premier objectif sous le seuil).
export function datesStades() {
  const ref = R().reference;
  const tri = [...etat.objectifs].sort((a, b) => a.date.localeCompare(b.date));
  const out = { 1: R().debut };
  for (let st = 2; st <= 5; st++) {
    const x = tri.find((o) => o.objectif <= seuilStade(ref, st));
    if (x) out[st] = x.date;
  }
  return out;
}

// Série de jours sous l'objectif (aujourd'hui compte s'il est dans les clous).
export function serieRonron() {
  const t = aujourdhui();
  if (nbDu(t) > objectifDu(t)) return 0;
  let n = 1;
  for (let k = ajouterJours(t, -1); k >= R().debut; k = ajouterJours(k, -1)) {
    if (connu(k) && nbDu(k) <= objectifDu(k)) n++; else break;
  }
  return n;
}
export function moyenne3Jours() {
  const t = aujourdhui();
  const ks = [1, 2, 3].map((i) => ajouterJours(t, -i)).filter((k) => k >= R().debut);
  if (ks.length < 3 || ks.some((k) => !connu(k))) return null;
  return ks.reduce((s, k) => s + nbDu(k), 0) / 3;
}
export function propositionPalier() {
  if (!R().paliersAuto) return null;
  const obj = objectifActuel();
  if (obj <= 0) return null;
  const t = aujourdhui();
  const dernierChangement = [...etat.objectifs].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (dernierChangement && ecartJours(dernierChangement.date, t) < 3) return null;
  if (etat.refusPalier && ecartJours(etat.refusPalier, t) < 3) return null;
  const m = moyenne3Jours();
  if (m === null || m >= obj) return null;
  return { de: obj, a: obj - 1, moyenne: m };
}
export function fixerObjectif(n, raison) {
  const t = aujourdhui();
  etat.objectifs = etat.objectifs.filter((x) => x.date !== t);
  etat.objectifs.push({ date: t, objectif: n });
  if (raison === 'palier') etat.bonus.push({ date: t, type: 'palier', n: BONUS_PALIER });
}

// Matin libre : aucune cigarette avant 10 h, jours suivis depuis l'installation.
export function matinLibre(k) {
  if (k < etat.installe) return false;
  const j = etat.jours[k];
  const avant10 = j && j.heures && j.heures.some((h) => h < '10:00');
  if (avant10) return false;
  if (k < aujourdhui()) return true;
  return heureMaintenant() >= '10:00';
}
export function defiSemaine() {
  const t = versDate(aujourdhui());
  const lundi = new Date(t); lundi.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const debut = cleDate(lundi);
  let n = 0;
  for (let k = debut; k <= aujourdhui(); k = ajouterJours(k, 1)) if (matinLibre(k)) n++;
  const dimanche = ajouterJours(debut, 6);
  return { fait: Math.min(3, n), but: 3, joursRestants: ecartJours(aujourdhui(), dimanche) + 1, gagne: n >= 3 };
}

export function quetesDu(k) { return etat.quetes[k] || {}; }
export function croquettesQuetes() {
  let s = 0;
  Object.values(etat.quetes).forEach((q) => {
    let n = 0;
    QUETES.forEach((d) => { if (q[d.id]) { s += d.gain; n++; } });
    if (n === QUETES.length) s += BONUS_QUETES;
  });
  return s;
}
export function croquettesRonron() {
  const t = aujourdhui();
  let s = 0;
  for (const k of listeJours()) { if (k >= t) break; if (k >= etat.installe && nbDu(k) <= objectifDu(k)) s += BONUS_RONRON; }
  return s;
}
export function croquettes() {
  return evitees() + croquettesQuetes() + croquettesRonron()
    + etat.bonus.reduce((s, b) => s + b.n, 0) - etat.depenses.reduce((s, d) => s + d.n, 0);
}

// ---------- Badges ----------
export function badges() {
  const jours = listeJours();
  const t = aujourdhui();
  let serie = 0, maxSerie = 0, serieZero = 0, maxZero = 0, nuits = 0, parfaite = false;
  for (const k of jours) {
    if (k === t) break;
    if (connu(k) && nbDu(k) <= objectifDu(k)) { serie++; maxSerie = Math.max(maxSerie, serie); } else serie = 0;
    if (connu(k) && nbDu(k) === 0) { serieZero++; maxZero = Math.max(maxZero, serieZero); } else serieZero = 0;
    if (k >= etat.installe) {
      const j = etat.jours[k];
      if (!(j && j.heures && j.heures.some((h) => h >= '22:00'))) nuits++;
      const q = quetesDu(k);
      if (QUETES.every((d) => q[d.id]) && nbDu(k) <= objectifDu(k)) parfaite = true;
    }
  }
  const euros = eurosEconomises();
  const paliersEuros = [1000, 500, 400, 200, 100, 50];
  const tirelire = paliersEuros.find((x) => euros >= x);
  const st = stadeActuel();
  return [
    { id: 'patte', nom: 'Première patte', detail: 'Premier jour suivi', ok: jours.length > 0, icone: 'patte' },
    { id: 'stade', nom: PALIERS[st - 1].nom, detail: `Stade ${st} atteint`, ok: st >= 2, icone: 'etoile' },
    { id: 'tirelire', nom: tirelire ? `Tirelire ${tirelire} €` : 'Tirelire 50 €', detail: tirelire ? `${Math.round(euros)} € gardés` : `${Math.round(euros)} € sur 50`, ok: !!tirelire, icone: 'pieces' },
    { id: 'semaine', nom: 'Semaine de ronron', detail: maxSerie >= 7 ? '7 jours sous l’objectif' : `${Math.min(7, serieRonron())} / 7 jours`, ok: maxSerie >= 7, progres: Math.min(1, serieRonron() / 7), icone: 'coeur' },
    { id: 'parfaite', nom: 'Journée parfaite', detail: 'Objectif tenu + 3 quêtes', ok: parfaite, icone: 'soleil' },
    { id: 'nuit', nom: 'Nuit calme', detail: nuits >= 5 ? 'Rien après 22 h, 5 soirs' : `${nuits} / 5 soirs`, ok: nuits >= 5, icone: 'lune' },
    { id: 'vies', nom: 'Neuf vies', detail: maxZero >= 30 ? '30 jours sans fumer' : 'Secret', ok: maxZero >= 30, secret: maxZero < 30, icone: 'cadenas' },
  ];
}

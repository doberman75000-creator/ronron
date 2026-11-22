import { chatSVG } from './chat.js';
import { sons, activerSons } from './sons.js';
import { vibrer } from './haptique.js';
import * as D from './donnees.js';

export const VERSION_APP = '1.5.0';
const $app = document.getElementById('app');
const nb = ' ';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fr = (n, d = 0) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
const euros = (n, d = 0) => fr(n, d) + nb + '€';
const pluriel = (n, un, plusieurs) => `${fr(n)} ${n > 1 ? plusieurs : un}`;
const ui = { vueHisto: 'jours', joursMax: 30, filtre: 'tout', confirmEffacer: false, installVu: sessionStorage.getItem('ronron:installVu') === '1', depart: false };

// ---------- Icônes ----------
const svg = (w, inner, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" aria-hidden="true" ${extra}>${inner}</svg>`;
const trait = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
const I = {
  patte: (w = 24) => svg(w, '<ellipse cx="12" cy="16" rx="5" ry="4.2"/><ellipse cx="5.8" cy="10" rx="2.1" ry="2.7"/><ellipse cx="9.8" cy="6.3" rx="2.1" ry="2.8"/><ellipse cx="14.2" cy="6.3" rx="2.1" ry="2.8"/><ellipse cx="18.2" cy="10" rx="2.1" ry="2.7"/>', 'fill="currentColor"'),
  drapeau: (w = 24) => svg(w, '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4 2.5 4H5"/>', trait),
  cible: (w = 24) => svg(w, '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8"/>', trait),
  reglages: (w = 24) => svg(w, '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>', trait),
  lune: (w = 22) => svg(w, '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', trait),
  son: (w = 22) => svg(w, '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>', trait),
  muet: (w = 22) => svg(w, '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6"/>', trait),
  fleche: (w = 16) => svg(w, '<path d="M5 12h14M13 6l6 6-6 6"/>', trait),
  retour: (w = 18) => svg(w, '<path d="M19 12H5M11 6l-6 6 6 6"/>', trait),
  chevron: (w = 18) => svg(w, '<path d="M9 6l6 6-6 6"/>', trait),
  check: (w = 18) => svg(w, '<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'),
  cadenas: (w = 22) => svg(w, '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', trait),
  coeur: (w = 22) => svg(w, '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', trait),
  pieces: (w = 22) => svg(w, '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>', trait),
  soleil: (w = 22) => svg(w, '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>', trait),
  note: (w = 18) => svg(w, '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.5"/><circle cx="17" cy="16" r="2.5"/>', trait),
  tel: (w = 20) => svg(w, '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>', trait),
  telecharger: (w = 20) => svg(w, '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>', trait),
  graphe: (w = 16) => svg(w, '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>', trait),
  partager: (w = 20) => svg(w, '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>', trait),
  poisson: (w = 20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 12 L22 7 L21 12 L22 17 Z" fill="#C2501A"/><ellipse cx="10" cy="12" rx="8" ry="5" fill="#E07A35"/><circle cx="6.5" cy="11" r="1.3" fill="#FFF4E6"/><path d="M11 9.5 Q13 12 11 14.5" fill="none" stroke="#C2501A" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  etoile: (w = 15, plein = true) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="${plein ? '#F2B12E' : '#E9D8C4'}"/></svg>`,
  cintre: (w = 24) => svg(w, '<path d="M12 7.5a2 2 0 1 0-2-2"/><path d="M12 7.5v1.5L3 16a1.5 1.5 0 0 0 1 2.7h16a1.5 1.5 0 0 0 1-2.7l-9-7"/>', trait),
  cadeau: (w = 24) => svg(w, '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12"/><path d="M12 9C10 5 6 5 6.5 7.5 7 9 12 9 12 9zM12 9c2-4 6-4 5.5-1.5C17 9 12 9 12 9z"/>', trait),
  etoileTrait: (w = 22) => svg(w, '<path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4-3.9-3.8 5.4-.8z"/>', trait),
};
const etoiles = (n, w = 15) => `<span class="etoiles" role="img" aria-label="${n} étoile${n > 1 ? 's' : ''} sur 3">${[0, 1, 2].map((i) => I.etoile(w, i < n)).join('')}</span>`;
const icBadge = { patte: I.patte(26), etoile: I.etoileTrait(24), pieces: I.pieces(24), coeur: I.coeur(22), soleil: I.soleil(22), lune: I.lune(22), cadenas: I.cadenas(22) };

// ---------- Utilitaires d'écran ----------
function onglets(actif) {
  const o = [['accueil', 'Accueil', I.patte()], ['parcours', 'Parcours', I.drapeau()], ['historique', 'Historique', I.graphe(24)], ['quetes', 'Quêtes', I.cible()], ['dressing', 'Dressing', I.cintre()], ['boutique', 'Boutique', I.cadeau()]];
  return `<nav class="onglets" aria-label="Navigation principale">${o.map(([id, lib, ic]) => `<a href="#/${id}" ${id === actif ? 'aria-current="page"' : ''}>${ic}${lib}</a>`).join('')}</nav>`;
}
let minuterieToast = null;
function toast(texte, action) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span>${esc(texte)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  if (action) el.querySelector('button').addEventListener('click', () => { el.remove(); action.fn(); });
  document.body.appendChild(el);
  clearTimeout(minuterieToast);
  if (!action || !action.collant) minuterieToast = setTimeout(() => el.remove(), action ? 8000 : 3600);
}
function ilYa(minutes) {
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes}${nb}min`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h < 24) return `il y a ${h}${nb}h${m ? ' ' + String(m).padStart(2, '0') : ''}`;
  const j = Math.floor(h / 24);
  return `il y a ${pluriel(j, 'jour', 'jours')}`;
}
function derniereCigarette() {
  const e = D.lire();
  const t = D.aujourdhui();
  for (let k = t, i = 0; i < 14 && k >= e.reglages.debut; k = D.ajouterJours(k, -1), i++) {
    const j = e.jours[k];
    if (j && j.heures && j.heures.length) {
      const [h, m] = j.heures[j.heures.length - 1].split(':').map(Number);
      const d = D.versDate(k); d.setHours(h, m, 0, 0);
      return Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
    }
  }
  return null;
}
const chat = (o) => chatSVG({ tenue: D.lire().tenue, ...o });
function progressionStade() {
  const ref = D.R().reference, st = D.stadeActuel(), obj = D.objectifActuel();
  if (st >= 6) return { texte: 'Stade ultime atteint', droite: '', pct: 100 };
  if (st === 5) {
    const seuil = D.seuilStade(ref, 5);
    const prevu = (D.lire().prevus || []).find((p) => p.date > D.aujourdhui() && p.objectif < obj);
    return { texte: obj > 0 ? `Prochain palier${nb}: ${obj - 1}/j` : 'Vers Chat légendaire : 7 jours à 0', droite: prevu ? D.dateCourte(prevu.date) : '', pct: Math.round(((seuil - obj) / Math.max(1, seuil)) * 100) };
  }
  const cur = st === 1 ? ref : D.seuilStade(ref, st), next = D.seuilStade(ref, st + 1);
  return { texte: `Vers ${D.PALIERS[st].nom}`, droite: `${next}/j`, pct: Math.max(4, Math.round(((cur - obj) / Math.max(1, cur - next)) * 100)) };
}

// ---------- Écrans ----------
const ecrans = {};

ecrans.accueil = () => {
  const e = D.lire(), r = e.reglages, t = D.aujourdhui();
  const n = D.nbDu(t), obj = D.objectifActuel(), st = D.stadeActuel(), et = D.etoiles();
  const prop = D.propositionPalier(), manque = D.joursManquants().length;
  const derniere = derniereCigarette();
  const pr = progressionStade();
  const pastilles = Array.from({ length: Math.max(obj, n) }, (_, i) => `<i class="${i < n && i < obj ? 'plein' : i < n ? 'dessus' : 'vide'}"></i>`).join('');
  let message;
  if (n === 0) message = obj === 0 ? 'Zéro aujourd’hui. Miette ronronne fort.' : `Aucune pour l’instant. ${esc(r.nom)} dort sur tes genoux.`;
  else if (n < obj) message = `Encore ${obj - n} avant ton objectif. ${esc(r.nom)} ronronne.`;
  else if (n === obj) message = `Objectif atteint pile. Si tu t’arrêtes là, c’est un jour de ronron${nb}!`;
  else message = `Un peu au-dessus aujourd’hui. Pas grave${nb}: ton palier reste acquis.`;
  const joursSansSauvegarde = e.sauvegarde ? D.ecartJours(e.sauvegarde.slice(0, 10), t) : 999;
  const soir = new Date().getHours() >= 20;
  return `<main class="ecran">
    <header class="entete">
      <div><h1>Ronron</h1><p class="sous">Jour ${D.numeroJour()} · objectif ${obj} par jour</p></div>
      <a class="btn-rond" href="#/bilan" aria-label="Bilan du soir">${I.lune()}${soir ? '<span class="point"></span>' : ''}</a>
    </header>
    ${D.cadeauOffertDispo() ? `<a class="bandeau or" href="#/boutique">${I.cadeau(26)}<span><b>${D.CADEAU_OFFERT.titre}</b><small>Un cadeau surprise t’attend dans la Boutique. C’est offert${nb}!</small></span></a>` : ''}
    ${prop ? `<a class="bandeau or" href="#/palier">${I.etoileTrait(26)}<span><b>${esc(r.nom)} est prête à grandir</b><small>Moyenne sur 3 jours${nb}: ${fr(prop.moyenne, 1)}. On passe à ${prop.a}${nb}?</small></span></a>` : ''}
    ${manque ? `<a class="bandeau peche" href="#/historique#corriger">${I.graphe(22)}<span><b>${pluriel(manque, 'jour', 'jours')} sans données</b><small>Entre l’import et l’installation. Touche pour les renseigner.</small></span></a>` : ''}
    ${!manque && joursSansSauvegarde > 14 && D.numeroJour() > 3 ? `<a class="bandeau peche" href="#/reglages#donnees">${I.telecharger(22)}<span><b>Pense à sauvegarder</b><small>${e.sauvegarde ? `Dernière sauvegarde il y a ${joursSansSauvegarde} jours.` : 'Aucune sauvegarde pour l’instant.'}</small></span></a>` : ''}
    <section class="carte carte-chat">
      ${chat({ stade: st, taille: 128 })}
      <div class="infos">
        <div><span class="nom-chat">${esc(r.nom)}</span> ${st < 6 ? etoiles(et) : ''}</div>
        <span class="puce peche maj" style="align-self:flex-start">${D.PALIERS[st - 1].nom} · stade ${st}</span>
        <div style="display:flex;flex-direction:column;gap:5px">
          <div class="petit" style="display:flex;justify-content:space-between;color:var(--brun)"><span>${pr.texte}</span><span>${pr.droite}</span></div>
          <div class="barre"><span style="width:${Math.min(100, pr.pct)}%"></span></div>
        </div>
        <a class="lien-pilule" href="#/palier">${prop ? 'Prête à grandir' : 'Voir le palier'} ${I.fleche()}</a>
      </div>
    </section>
    <section class="tuiles">
      <div class="tuile"><span style="color:#D9435A">${I.coeur(20)}</span><b>${pluriel(D.serieRonron(), 'jour', 'jours')}</b><span>de ronron</span></div>
      <div class="tuile">${I.poisson()}<b>${fr(D.croquettes())}</b><span>croquettes</span></div>
      <div class="tuile"><span style="color:#1F7A5C">${I.pieces(20)}</span><b>${euros(D.eurosEconomises())}</b><span>économisés</span></div>
    </section>
    <section class="carte jour">
      <div class="ligne"><span class="maj">Aujourd’hui</span><span>${derniere === null ? '' : 'Dernière' + nb + ': ' + ilYa(derniere)}</span></div>
      <div class="compteur"><b id="compte">${n}</b><span>/ ${obj}</span></div>
      <div class="pastilles" aria-hidden="true">${pastilles}</div>
      <p class="message" aria-live="polite">${message}</p>
      <button class="patte" type="button" data-a="fumer">${I.patte(42)}<span>J’en fume une</span></button>
      <div class="pied-jour"><span>Coût du jour${nb}: ${euros(n * D.prixCigarette(), 2)}</span>${n > 0 ? '<button class="lien-texte" type="button" data-a="annuler">Annuler la dernière</button>' : ''}</div>
    </section>
  </main>${onglets('accueil')}`;
};

ecrans.bilan = () => {
  const e = D.lire(), r = e.reglages, t = D.aujourdhui();
  const n = D.nbDu(t), obj = D.objectifActuel(), ok = n <= obj, st = D.stadeActuel();
  const gagnees = Math.max(0, r.reference - n);
  const q = D.quetesDu(t), nq = D.QUETES.filter((x) => q[x.id]).length;
  const parfaite = ok && nq === 3;
  const h = new Date();
  const lib = h.getHours() >= 18 ? 'Bilan du soir' : 'Bilan du jour';
  return `<main class="ecran nuit sans-onglets" style="position:relative;overflow:hidden">
    <svg aria-hidden="true" width="100%" height="260" style="position:absolute;top:0;left:0;pointer-events:none">
      <path d="M40 90 l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="#F2B12E" style="animation:scintille 2.4s ease-in-out infinite"/>
      <path d="M330 70 l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#F2B12E" style="animation:scintille 3s ease-in-out .6s infinite"/>
      <path d="M300 200 l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z" fill="#CFC4EA" style="animation:scintille 2s ease-in-out 1s infinite"/>
      <path d="M70 230 l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z" fill="#CFC4EA" style="animation:scintille 2.6s ease-in-out .3s infinite"/>
    </svg>
    <div class="entete" style="position:relative">
      <a class="retour" href="#/accueil">${I.retour()} Accueil</a>
      <span style="color:#F7E7B4">${I.lune(24)}</span>
      <button class="btn-rond" type="button" data-a="son" aria-label="${r.sons ? 'Couper le son' : 'Activer le son'}">${r.sons ? I.son() : I.muet()}</button>
    </div>
    <div style="position:relative;display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center">
      <span class="maj" style="font-size:12px;font-weight:800;letter-spacing:.08em;color:#CFC4EA">${lib} · ${String(h.getHours()).padStart(2, '0')}${nb}h${nb}${String(h.getMinutes()).padStart(2, '0')}</span>
      <h1 class="pop" style="margin:0;font-family:Fredoka,sans-serif;font-size:30px;font-weight:600;line-height:1.1">${ok ? 'Journée sous l’objectif' + nb + '!' : 'Demain, on remet ça'}</h1>
      <p style="margin:0;font-size:15px;line-height:1.4;color:#E4DCF7">${pluriel(n, 'cigarette', 'cigarettes')} sur ${obj}. ${ok ? esc(r.nom) + ' s’endort contente.' : 'Ton palier reste acquis, rien n’est perdu.'}</p>
    </div>
    <div id="zone-caresse" style="position:relative;align-self:center;width:240px;height:240px">
      <div aria-hidden="true" style="position:absolute;top:30px;left:30px;width:180px;height:180px;border-radius:90px;background:#3E3470"></div>
      <button type="button" data-a="caresse" aria-label="Caresser ${esc(r.nom)}" style="position:relative;width:240px;height:240px;padding:0;border:none;background:none;display:flex;align-items:center;justify-content:center">
        <span id="chat-caresse" class="respire" style="display:block">${chat({ stade: st, taille: 216, humeur: 'joie' })}</span>
      </button>
    </div>
    <p id="aide-caresse" style="position:relative;margin:-6px 0 0;text-align:center;font-size:13px;font-weight:700;color:#CFC4EA">Touche ${esc(r.nom)} pour la caresser</p>
    <div class="grille3" style="position:relative">
      <div class="carte-nuit pop" style="animation-delay:.5s"><div class="titre-font" style="font-size:22px;font-weight:600;color:#FFB27A">+${gagnees}</div><div class="petit" style="color:#E4DCF7">croquettes gagnées</div></div>
      <div class="carte-nuit pop" style="animation-delay:.65s"><div class="titre-font" style="font-size:22px;font-weight:600;color:#FFB27A">${nq}/3</div><div class="petit" style="color:#E4DCF7">quêtes faites</div></div>
      <div class="carte-nuit pop" style="animation-delay:.8s"><div class="titre-font" style="font-size:22px;font-weight:600;color:#8EE0C2">${euros(gagnees * D.prixCigarette(), 2)}</div><div class="petit" style="color:#E4DCF7">gardés aujourd’hui</div></div>
    </div>
    <div class="pop" style="position:relative;background:var(--creme);color:var(--nuit);border-radius:22px;padding:12px 14px;display:flex;align-items:center;gap:12px;animation-delay:1s">
      <span style="width:46px;height:46px;border-radius:23px;background:#FFE0E5;color:#D9435A;display:flex;align-items:center;justify-content:center;flex:none">${parfaite ? I.soleil(24) : I.coeur(24)}</span>
      <div><div class="maj petit" style="color:#6B5442">${parfaite ? 'Badge du jour' : 'Ta série'}</div>
      <div class="titre-font" style="font-size:19px;font-weight:600">${parfaite ? 'Journée parfaite' : pluriel(D.serieRonron(), 'jour', 'jours') + ' de ronron'}</div>
      <div style="font-size:13px;font-weight:700;color:#5C4334">${parfaite ? 'Objectif tenu et 3 quêtes faites' : ok ? `+${D.BONUS_RONRON} croquettes à minuit si tu restes à ${obj} ou moins` : 'Elle repart dès demain'}</div></div>
    </div>
    <a class="btn orange" href="#/accueil" style="margin-top:8px">Bonne nuit, ${esc(r.nom)}</a>
  </main>`;
};

ecrans.palier = () => {
  const e = D.lire(), r = e.reglages, prop = D.propositionPalier();
  const st = D.stadeActuel(), et = D.etoiles(), obj = D.objectifActuel();
  const tete = `<div class="entete"><a class="retour" href="#/accueil">${I.retour()} Accueil</a>${prop ? `<span class="puce menthe">Moyenne 3 jours${nb}: ${fr(prop.moyenne, 1)}</span>` : ''}</div>`;
  if (!prop) {
    const m = D.moyenne3Jours();
    const prevu = (e.prevus || []).filter((p) => p.date > D.aujourdhui());
    return `<main class="ecran">${tete}
      <h1 class="titre-font" style="margin:0 4px;font-size:28px;font-weight:600">Le prochain palier</h1>
      <section class="carte" style="display:flex;align-items:center;gap:10px">
        ${chat({ stade: st, taille: 96 })}
        <div style="display:flex;flex-direction:column;gap:6px"><b class="titre-font" style="font-size:20px;font-weight:600">${D.PALIERS[st - 1].nom}</b>${st < 6 ? etoiles(et, 18) : ''}<span class="petit">Objectif actuel${nb}: ${obj} par jour</span></div>
      </section>
      <section class="carte" style="display:flex;flex-direction:column;gap:8px">
        <b style="font-size:16px">Comment ça marche</b>
        <p class="texte-doux">Quand ta moyenne sur les 3 derniers jours passe sous ton objectif, ${esc(r.nom)} te propose de le baisser d’une seule cigarette. Tu acceptes ou tu attends, c’est toi qui décides. Un palier gagné reste gagné.</p>
        <p class="texte-doux"><b>${m === null ? 'Pas encore assez de jours suivis pour calculer ta moyenne.' : `Ta moyenne sur 3 jours${nb}: ${fr(m, 1)} pour un objectif de ${obj}.`}</b></p>
        ${!r.paliersAuto ? '<p class="texte-doux">Les propositions sont désactivées dans les Réglages.</p>' : ''}
      </section>
      ${prevu.length ? `<section class="carte" style="display:flex;flex-direction:column;gap:6px"><b style="font-size:16px">Étapes prévues dans ton plan Smoless</b>${prevu.map((p) => `<div style="display:flex;justify-content:space-between;font-weight:700"><span>${D.dateCourte(p.date)}</span><span>${p.objectif === 0 ? 'Sans tabac' : p.objectif + ' par jour'}</span></div>`).join('')}<p class="texte-doux">Ronron te proposera ces paliers quand ta moyenne le permettra. Tu peux aussi changer ton objectif à la main dans Réglages.</p></section>` : ''}
    </main>${onglets('')}`;
  }
  const avant = { st, et };
  const seuilSt = st === 1 ? r.reference : D.seuilStade(r.reference, st);
  const etApres = Math.max(0, Math.min(3, seuilSt - Math.min(D.plusBasObjectif(), prop.a)));
  const evolue = st < 5 && prop.a <= D.seuilStade(r.reference, st + 1);
  return `<main class="ecran sans-onglets">${tete}
    <div style="display:flex;flex-direction:column;gap:8px;padding:0 4px">
      <h1 class="titre-font" style="margin:0;font-size:31px;font-weight:600;line-height:1.12">${evolue ? esc(r.nom) + ' est prête à grandir' : esc(r.nom) + ' vise une nouvelle étoile'}</h1>
      <p class="texte-doux" style="font-size:15px">Trois jours de suite sous ton objectif de ${prop.de}. On fixe la barre à ${prop.a}${nb}? C’est toi qui décides.</p>
    </div>
    <section class="carte comparaison">
      <div>${chat({ stade: st, taille: 120 })}${st < 6 ? etoiles(avant.et, 16) : ''}<span class="petit">aujourd’hui</span></div>
      <span style="color:var(--orange)">${I.fleche(32)}</span>
      <div>${evolue ? chat({ stade: st + 1, taille: 120, silhouette: true }) : chat({ stade: st, taille: 120, humeur: 'joie' })}${evolue ? `<b class="titre-font" style="font-size:16px;font-weight:600">${D.PALIERS[st].nom}</b>` : etoiles(etApres, 16)}<span class="petit">si tu passes à ${prop.a}</span></div>
    </section>
    <section class="objectif-carte">
      <div><div class="maj" style="font-size:12px;font-weight:800;color:#E9CDB3">Nouvel objectif</div>
      <div style="display:flex;align-items:baseline;gap:10px"><span class="titre-font" style="font-size:26px;color:#B39A80;text-decoration:line-through">${prop.de}</span><span class="titre-font" style="font-size:48px;font-weight:600;line-height:1">${prop.a}</span><span style="font-size:14px;font-weight:700;color:#E9CDB3">par jour</span></div></div>
      <span class="puce" style="background:var(--orange);color:var(--encre)">−1 seulement</span>
    </section>
    <section class="recompenses">
      <div>${I.poisson()}+${D.BONUS_PALIER} croquettes</div>
      <div><span style="color:#D9435A">${I.etoileTrait(20)}</span>${evolue ? 'Nouveau stade' : 'Une étoile de plus'}</div>
      <div><span style="color:#1F7A5C">${I.note(20)}</span>La chanson de ${esc(r.nom)}</div>
    </section>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
      <button class="btn orange" type="button" data-a="accepter">Je passe à ${prop.a}</button>
      <button class="btn contour" type="button" data-a="refuser">Pas encore, je garde ${prop.de}</button>
    </div>
  </main>`;
};

function fete({ titre, sousTitre, stade, nbEtoiles, prochain }) {
  const r = D.R();
  const pluie = Array.from({ length: 16 }, (_, i) => {
    const forme = i % 3 === 0 ? I.poisson(24) : i % 3 === 1 ? `<span style="color:#F28C38">${I.patte(22)}</span>` : I.etoile(20);
    return `<span style="left:${4 + ((i * 97) % 92)}%;animation-delay:${((i * 37) % 120) / 100}s;animation-duration:${2.2 + ((i * 53) % 100) / 100}s">${forme}</span>`;
  }).join('');
  const el = document.createElement('div');
  el.className = 'fete';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', titre);
  el.innerHTML = `<div class="pluie" aria-hidden="true">${pluie}</div>
    <div class="fete-contenu">
      <span class="puce pop" style="background:#FFE7A8;color:#6B4500;font-size:13px;letter-spacing:.08em">${esc(titre).toUpperCase()}</span>
      <div style="position:relative;width:232px;height:232px"><div class="halo" aria-hidden="true"></div><div class="saute">${chat({ stade, taille: 232, humeur: 'joie' })}</div></div>
      ${stade < 6 ? `<div class="pop" style="animation-delay:.6s">${etoiles(nbEtoiles, 26)}</div>` : ''}
      <h1 class="titre-font pop" style="margin:0;text-align:center;font-size:30px;font-weight:600;line-height:1.12;animation-delay:.35s">${sousTitre}</h1>
      <p class="texte-doux" style="text-align:center;font-size:15px">Nouvel objectif${nb}: ${D.objectifActuel()} par jour · +${D.BONUS_PALIER} croquettes</p>
      ${prochain ? `<div class="carte" style="align-self:stretch;border-style:dashed;display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px">${chat({ stade: prochain.stade, taille: 52, silhouette: true })}<div><div class="maj petit">Prochain stade</div><b>${prochain.texte}</b></div></div>` : ''}
      <div style="align-self:stretch;display:flex;flex-direction:column;gap:4px;margin-top:auto">
        <button class="btn encre" type="button" data-fermer>Retour à l’accueil</button>
        <button class="lien-texte" type="button" data-rejouer style="align-self:center">${I.note()} Rejouer la chanson</button>
      </div>
    </div>`;
  el.querySelector('[data-fermer]').addEventListener('click', () => { el.remove(); location.hash = '#/accueil'; });
  el.querySelector('[data-rejouer]').addEventListener('click', () => sons.fete());
  document.body.appendChild(el);
  el.querySelector('[data-fermer]').focus({ preventScroll: true });
  sons.fete();
}

function revelerCadeau(tirage) {
  const art = tirage.article, rar = D.rarete(tirage.rarete);
  const el = document.createElement('div');
  el.className = tirage.offert ? 'fete offert-fete' : 'fete';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cadeau surprise');
  const pluie = Array.from({ length: 12 }, (_, i) => `<span style="left:${4 + ((i * 97) % 92)}%;animation-delay:${((i * 37) % 120) / 100}s">${i % 2 ? I.etoile(20) : `<span style="color:#F28C38">${I.patte(22)}</span>`}</span>`).join('');
  el.innerHTML = `${tirage.offert ? `<div class="neige" aria-hidden="true">${flocons(26)}</div>` : `<div class="pluie" aria-hidden="true">${pluie}</div>`}
    <div class="fete-contenu" style="justify-content:center">
      ${tirage.offert ? `<span class="titre-font pop" style="font-size:20px;font-weight:600;color:#FFF4E6;text-align:center">${D.CADEAU_OFFERT.titre}</span>` : ''}
      <span class="puce pop" style="background:${rar.fond};color:${rar.texte};font-size:13px;letter-spacing:.08em">${rar.nom.toUpperCase()}</span>
      <div style="position:relative;width:232px;height:232px"><div class="halo" aria-hidden="true" style="background:${rar.fond}"></div><div class="saute">${chatSVG({ stade: Math.min(D.stadeActuel(), 5), taille: 232, humeur: 'joie', tenue: art ? [art.id] : D.tenueListe() })}</div></div>
      <h1 class="titre-font pop" style="margin:0;text-align:center;font-size:30px;font-weight:600;animation-delay:.3s">${art ? art.nom : 'Collection ' + rar.nom.toLowerCase() + ' complète'}</h1>
      <p class="texte-doux" style="text-align:center;font-size:15px">${art ? `Ajouté à ton dressing et porté par ${esc(D.R().nom)}.` : `Tu as déjà tous les articles ${rar.nom.toLowerCase()}s${nb}: ${fr(D.CADEAU.rembourseDoublon)} croquettes rendues.`}</p>
      <button class="btn ${tirage.offert ? 'orange' : 'encre'}" type="button" data-fermer style="margin-top:12px">Super</button>
    </div>`;
  el.querySelector('[data-fermer]').addEventListener('click', () => { el.remove(); afficher(); if (tirage.avantNoel === false) verifierNoel(false); });
  document.body.appendChild(el);
  el.querySelector('[data-fermer]').focus({ preventScroll: true });
  sons.chanson();
}

ecrans.parcours = () => {
  const e = D.lire(), r = e.reglages, ref = r.reference;
  const st = D.stadeActuel(), et = D.etoiles(), dates = D.datesStades();
  const lignes = D.PALIERS.map((p) => {
    const seuil = p.stade === 1 ? ref : D.seuilStade(ref, p.stade);
    const detail = p.stade === 1 ? `${ref} par jour · ta référence` : p.stade === 6 ? '0 pendant 7 jours d’affilée' : `${seuil} par jour · −${Math.round(p.baisse * 100)}${nb}%`;
    if (p.stade < st) return `<li><div class="medaillon">${chat({ stade: p.stade, taille: 60 })}</div><div style="flex:1;min-width:0"><div class="nom">${p.nom}</div><div class="petit">${detail}</div></div><span class="puce menthe">${I.check(14)} ${dates[p.stade] ? D.dateCourte(dates[p.stade]) : 'Atteint'}</span></li>`;
    if (p.stade === st) return `<li class="actuel"><div class="medaillon" style="background:#FFD9B5">${chat({ stade: p.stade, taille: 60 })}</div><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><div><span class="nom">${p.nom}</span> ${st < 6 ? etoiles(et, 13) : ''}</div><div class="petit">${detail}</div></div><span class="puce peche">${dates[p.stade] ? D.dateCourte(dates[p.stade]) : 'En cours'}</span></li>`;
    const prochain = p.stade === st + 1;
    return `<li><div class="medaillon ${prochain ? 'prochain' : 'verrou'}">${chat({ stade: p.stade, taille: 56, silhouette: true })}</div><div style="flex:1;min-width:0"><div class="nom">${p.nom}</div><div class="petit">${detail}</div></div>${prochain ? `<a class="puce encre" href="#/palier" style="min-height:36px;text-decoration:none">Prochain</a>` : `<span class="puce grise">${I.cadenas(13)} Verrouillé</span>`}</li>`;
  }).join('');
  return `<main class="ecran">
    <header style="padding:0 4px;display:flex;flex-direction:column;gap:6px">
      <h1 class="titre-font" style="margin:0;font-size:28px;font-weight:600">Le parcours de ${esc(r.nom)}</h1>
      <p class="texte-doux">Départ le ${D.dateCourte(r.debut)} à ${ref} par jour. Chaque objectif baissé rapporte une étoile${nb}; au bon seuil, ${esc(r.nom)} évolue.</p>
      <a class="puce" href="#/historique" style="align-self:flex-start;min-height:36px;background:#fff;border:1px solid var(--bord-2);text-decoration:none;font-size:13px"><span style="color:var(--rouille)">${I.graphe()}</span> Voir tout l’historique</a>
    </header>
    <ol class="frise">${lignes}
      <li class="secret"><span style="color:#5B3FC4">${I.etoileTrait(28)}</span><div><div class="titre-font" style="font-size:17px;font-weight:600;color:#3E2A8C">Neuf vies · badge secret</div><div class="petit" style="color:#5B4A8A">Indice${nb}: un mois entier.</div></div></li>
    </ol>
  </main>${onglets('parcours')}`;
};

ecrans.historique = () => {
  const e = D.lire(), r = e.reglages, jours = D.listeJours(), t = D.aujourdhui();
  const ech = 7;
  let sousOk = 0, connus = 0, fumees = 0;
  const barres = jours.map((k) => {
    const n = D.nbDu(k), g = D.objectifDu(k), c = D.connu(k), est = e.jours[k] && e.jours[k].estime;
    if (c) { fumees += n; if (!est && k < t) { connus++; if (n <= g) sousOk++; } }
    const couleur = !c ? 'transparent' : n <= g ? '#2F9E7A' : '#E2574C';
    return `<div class="b" style="height:${Math.max(3, Math.min(18, g) * ech)}px" title="${D.dateCourte(k)} : ${c ? n : '?'}"><i style="height:${c ? Math.max(3, Math.min(18, n) * ech) : 0}px;background:${couleur};opacity:${est ? 0.4 : 1}"></i></div>`;
  }).join('');
  const largeur = jours.length * 5.4;
  const reperes = [];
  let dernierX = -60;
  jours.forEach((k, i) => {
    const x = i * 5.4;
    const d = D.versDate(k);
    if ((i === 0 || d.getDate() === 1 || i === jours.length - 1) && x - dernierX > 46) { reperes.push(`<span style="left:${Math.max(0, x - 4)}px">${i === jours.length - 1 ? 'auj.' : D.dateCourte(k)}</span>`); dernierX = x; }
  });
  // Semaines glissantes de 7 jours se terminant aujourd'hui (la plus récente d'abord)
  const blocs = [];
  for (let fin = jours.length - 1; fin >= 0; fin -= 7) blocs.push(jours.slice(Math.max(0, fin - 6), fin + 1));
  const statsBloc = (bloc) => {
    const ks = bloc.filter((k) => D.connu(k));
    if (!ks.length) return null;
    const total = ks.reduce((x, k) => x + D.nbDu(k), 0);
    const complets = ks.filter((k) => k < t);
    return {
      total, moy: total / ks.length, objMoy: ks.reduce((x, k) => x + D.objectifDu(k), 0) / ks.length,
      sous: complets.filter((k) => D.nbDu(k) <= D.objectifDu(k)).length, complets: complets.length,
      est: ks.every((k) => e.jours[k] && e.jours[k].estime), partiel: ks.some((k) => e.jours[k] && e.jours[k].estime),
      encours: bloc.includes(t), nbJours: ks.length,
    };
  };
  const stats = blocs.map(statsBloc);
  const libSemaine = (bloc) => { const a = bloc[0], b = bloc[bloc.length - 1]; return (D.versDate(a).getMonth() === D.versDate(b).getMonth() ? D.versDate(a).getDate() : D.dateCourte(a)) + '–' + D.dateCourte(b); };
  const semaines = blocs.map((bloc, i) => {
    const st = stats[i];
    if (!st) return '';
    const prec = stats[i + 1];
    let evol = '';
    if (prec && prec.moy > 0 && !st.encours) {
      const d = Math.round(((st.moy - prec.moy) / prec.moy) * 100);
      evol = d < 0 ? `<span class="puce menthe">↓ ${-d}${nb}%</span>` : d > 0 ? `<span class="puce peche">↑ ${d}${nb}%</span>` : '<span class="puce grise">=</span>';
    }
    const ok = st.moy <= st.objMoy;
    return `<div class="semaine-carte">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>${libSemaine(bloc)}${st.encours ? ' <span class="petit">(en cours)</span>' : ''}</b>${evol}</div>
      <div class="jauge"><i style="width:${Math.min(100, Math.round((st.moy / Math.max(12, r.reference * 0.7)) * 100))}%;background:${ok ? '#2F9E7A' : '#E2574C'};opacity:${st.est ? 0.4 : st.partiel ? 0.7 : 1}"></i></div>
      <div class="semaine-chiffres"><span><b>${fr(st.moy, 1)}</b> par jour</span><span><b>${fr(st.total)}</b> au total</span><span>objectif <b>${fr(st.objMoy, st.objMoy % 1 ? 1 : 0)}</b></span><span>${st.complets ? `<b>${st.sous}/${st.complets}</b> jours sous l’objectif` : 'jour en cours'}</span></div>
      ${st.est ? '<span class="petit">Reconstituée à partir des moyennes Smoless</span>' : ''}
    </div>`;
  }).join('');
  const JS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const listeJ = [...jours].reverse().slice(0, ui.joursMax).map((k) => {
    const c = D.connu(k), n = D.nbDu(k), g = D.objectifDu(k), j = e.jours[k] || {};
    const etat = !c ? ['grise', 'Non renseigné'] : k === t ? ['peche', 'En cours'] : j.estime ? ['grise', 'Estimé'] : n <= g ? ['menthe', 'Sous l’objectif'] : ['peche', 'Au-dessus'];
    const heures = (j.heures || []).length ? j.heures.join(' · ') : '';
    return `<button type="button" class="jour-ligne" data-a="voirJour" data-date="${k}">
      <span class="jour-date"><b>${JS[D.versDate(k).getDay()]} ${D.dateCourte(k)}</b>${heures ? `<small>${heures}</small>` : ''}</span>
      <span class="puce ${etat[0]}">${etat[1]}</span>
      <span class="jour-n"><b>${c ? (j.estime ? '≈' : '') + n : '?'}</b><small>/ ${g}</small></span>
    </button>`;
  }).join('');
  const manquants = D.joursManquants();
  const dates = D.datesStades();
  const stades = Object.keys(dates).map(Number).sort();
  const nbJoursConnus = jours.filter((k) => D.connu(k)).length;
  const hier = D.ajouterJours(t, -1);
  const dateDefaut = manquants[0] || (hier >= r.debut ? hier : t);
  return `<main class="ecran">
    <div class="entete"><h1>Historique</h1><a class="puce" href="#/reglages" style="min-height:40px;background:#fff;border:1px solid var(--bord-2);text-decoration:none;font-size:13px">${I.reglages(18)} Réglages</a></div>
    <div style="padding:0 4px;margin-top:-8px">
    <p class="texte-doux">Depuis le ${D.dateCourte(r.debut)} · ${pluriel(jours.length, 'jour', 'jours')}.</p></div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">
      <div class="carte"><div class="titre-font" style="font-size:26px;font-weight:600">${r.reference} → ${D.objectifActuel()}</div><div class="petit">par jour · −${Math.round((1 - D.objectifActuel() / r.reference) * 100)}${nb}%</div></div>
      <div class="carte"><div class="titre-font" style="font-size:26px;font-weight:600;color:var(--rouille)">${fr(D.evitees())}</div><div class="petit">cigarettes évitées</div></div>
      <div class="carte"><div class="titre-font" style="font-size:26px;font-weight:600;color:#1F7A5C">${euros(D.eurosEconomises())}</div><div class="petit">économisés</div></div>
      <div class="carte"><div class="titre-font" style="font-size:26px;font-weight:600">${fr(fumees / Math.max(1, nbJoursConnus), 1)}</div><div class="petit">par jour en moyenne</div></div>
    </div>
    <div class="segments-vue" role="tablist" aria-label="Affichage">
      <button type="button" role="tab" aria-selected="${ui.vueHisto === 'jours'}" data-a="vueHisto" data-id="jours">Jour par jour</button>
      <button type="button" role="tab" aria-selected="${ui.vueHisto === 'semaines'}" data-a="vueHisto" data-id="semaines">Semaine par semaine</button>
    </div>
    ${ui.vueHisto === 'jours' ? `
    <section class="carte" style="display:flex;flex-direction:column;gap:10px">
      <div><h2 class="titre-font" style="margin:0;font-size:18px;font-weight:600">Courbe des jours</h2><span class="petit">${connus ? `${sousOk} sur ${connus} jours relevés sous l’objectif` : ''}</span></div>
      <div class="graphe" id="graphe"><div style="width:${Math.max(largeur, 10)}px;min-width:100%"><div class="barres" role="img" aria-label="Cigarettes par jour depuis le début">${barres}</div><div class="reperes" style="width:${largeur}px">${reperes.join('')}</div></div></div>
      <div class="legende"><span><i style="background:#2F9E7A"></i>Sous l’objectif</span><span><i style="background:#E2574C"></i>Au-dessus</span><span><i style="background:#F1E6DA"></i>Objectif</span>${jours.some((k) => e.jours[k] && e.jours[k].estime) ? '<span><i style="background:#2F9E7A;opacity:.4"></i>Estimé</span>' : ''}</div>
    </section>
    <section class="carte serree">
      <div style="padding:14px 14px 6px"><h2 class="titre-font" style="margin:0;font-size:18px;font-weight:600">Détail jour par jour</h2><span class="petit">Touche un jour pour le corriger. Les heures s’affichent pour les jours notés dans Ronron.</span></div>
      <div class="liste">${listeJ}</div>
      ${jours.length > ui.joursMax ? `<button class="lien-texte" type="button" data-a="plusJours" style="width:100%;border-top:1px solid var(--trait)">Voir 30 jours de plus (${jours.length - ui.joursMax} restants)</button>` : ''}
    </section>` : `
    <section class="carte" style="display:flex;flex-direction:column;gap:8px">
      <div><h2 class="titre-font" style="margin:0;font-size:18px;font-weight:600">Semaine par semaine</h2><span class="petit">Blocs de 7 jours qui se terminent aujourd’hui. La flèche compare à la semaine précédente.</span></div>
      ${semaines}
    </section>`}
    <section class="carte" style="display:flex;flex-direction:column;gap:8px">
      <h2 class="titre-font" style="margin:0 0 2px;font-size:18px;font-weight:600">Les stades de ${esc(r.nom)}</h2>
      ${stades.map((s) => `<div style="display:flex;align-items:center;gap:10px">${chat({ stade: s, taille: 44 })}<b style="flex:1">${D.PALIERS[s - 1].nom}</b><span class="petit">${D.dateCourte(dates[s])}</span></div>`).join('')}
    </section>
    <section class="carte" id="corriger" style="display:flex;flex-direction:column;gap:10px">
      <h2 class="titre-font" style="margin:0;font-size:18px;font-weight:600">Corriger un jour</h2>
      ${manquants.length ? `<p class="texte-doux"><b>${pluriel(manquants.length, 'jour manque', 'jours manquent')}</b> (${D.dateCourte(manquants[0])}${manquants.length > 1 ? ' → ' + D.dateCourte(manquants[manquants.length - 1]) : ''}). Renseigne-les pour que les calculs soient justes.</p>` : `<p class="texte-doux">Un oubli, une erreur de tap${nb}? Choisis le jour et le bon nombre.</p>`}
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <label class="sr" for="date-corr">Jour à corriger</label>
        <input class="champ" id="date-corr" type="date" min="${r.debut}" max="${t}" value="${dateDefaut}" data-champ="dateCorr" style="flex:1">
        <div class="pas" role="group" aria-label="Nombre de cigarettes">
          <button type="button" data-a="corrMoins" aria-label="Une de moins">−</button><output id="corr-n" aria-live="polite">0</output><button type="button" data-a="corrPlus" aria-label="Une de plus">+</button>
        </div>
      </div>
      <button class="btn encre" type="button" data-a="corrEnregistrer" style="height:50px;font-size:15px">Enregistrer ce jour</button>
    </section>
  </main>${onglets('historique')}`;
};

ecrans.quetes = () => {
  const e = D.lire(), r = e.reglages, t = D.aujourdhui();
  const q = D.quetesDu(t), nq = D.QUETES.filter((x) => q[x.id]).length;
  const defi = D.defiSemaine();
  const bdg = D.badges();
  const solde = D.croquettes();
  return `<main class="ecran">
    <header class="entete">
      <h1>Quêtes</h1>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="btn-rond" type="button" data-a="son" aria-label="${r.sons ? 'Couper le son' : 'Activer le son'}">${r.sons ? I.son(20) : I.muet(20)}</button>
        <span id="solde" class="puce" style="position:relative;background:#fff;border:1px solid var(--bord-2);font-family:Fredoka,sans-serif;font-size:18px;font-weight:600;padding:7px 12px">${I.poisson()} ${fr(solde)}</span>
      </div>
    </header>
    <div style="display:flex;justify-content:space-between;padding:0 4px"><h2 class="section-titre" style="margin:0">Aujourd’hui</h2><span class="petit">${nq} / 3 terminées</span></div>
    ${D.QUETES.map((d) => `<button class="quete" type="button" data-a="quete" data-id="${d.id}" aria-pressed="${q[d.id] ? 'true' : 'false'}"><span class="coche">${q[d.id] ? I.check() : ''}</span><span style="flex:1;min-width:0"><b>${d.titre}</b><small>${d.desc}</small></span><span class="puce peche">+${d.gain}</span></button>`).join('')}
    ${nq === 3 ? `<div class="chanson pop"><div style="position:relative;width:96px;height:96px;flex:none"><div class="danse">${chat({ stade: D.stadeActuel(), taille: 96, humeur: 'joie' })}</div></div><div style="flex:1;display:flex;flex-direction:column;gap:4px"><b class="titre-font" style="font-size:18px;font-weight:600;color:#4A3000">Les 3 quêtes du jour${nb}!</b><span style="font-size:13px;font-weight:700;color:#5C3D00">${esc(r.nom)} te chante sa chanson. +${D.BONUS_QUETES} croquettes bonus.</span><button class="lien-pilule" type="button" data-a="chanter">${I.note(16)} Réécouter</button></div></div>` : ''}
    <a class="carte chacha" href="#/boutique" style="text-decoration:none">
      <div style="display:flex;align-items:center;gap:10px"><span class="etoile-noel" aria-hidden="true">${I.etoile(30)}</span>
      <div style="flex:1"><span class="maj petit" style="color:var(--rouille)">Quête spéciale</span><br><b class="titre-font" style="font-size:18px;font-weight:600">Super Chacha de Noël</b><br><span class="petit">${e.superChacha ? `Accomplie le ${D.dateCourte(e.superChacha)} : ${esc(r.nom)} est devenue Mère Noël.` : `Réunis la tenue de Noël (${D.PIECES_NOEL.filter((id) => e.possede.includes(id)).length} / 5 pièces) et porte-la en entier.`}</span></div>${e.superChacha ? `<span class="puce menthe">${I.check(14)}</span>` : I.chevron()}</div>
    </a>
    <section class="defi">
      <div style="display:flex;justify-content:space-between"><span class="maj" style="font-size:12px;font-weight:800;color:#E9CDB3">Défi de la semaine</span><span style="font-size:12px;font-weight:700;color:#E9CDB3">${pluriel(defi.joursRestants, 'jour restant', 'jours restants')}</span></div>
      <div><div class="titre-font" style="font-size:22px;font-weight:600">Matins libres</div><div style="font-size:14px;color:#EBD8C6">3 matinées sans cigarette avant 10${nb}h (comptées automatiquement)</div></div>
      <div class="segments" role="img" aria-label="${defi.fait} sur 3">${[0, 1, 2].map((i) => `<i class="${i < defi.fait ? 'ok' : ''}"></i>`).join('')}</div>
      <span style="font-size:13px;font-weight:700;color:#EBD8C6">${defi.gagne ? 'Gagné' + nb + '! Le bonnet t’attend dans la boutique.' : 'Récompense' + nb + ': bonnet en laine pour ' + esc(r.nom)}</span>
    </section>
    <h2 class="section-titre">Badges</h2>
    <div class="grille3">${bdg.map((b) => `<div class="badge ${b.secret ? 'secret' : b.ok ? '' : 'ko'}"><span class="ic">${icBadge[b.icone]}</span><b>${b.nom}</b><small>${b.detail}</small></div>`).join('')}</div>
    <a class="carte" href="#/boutique" style="display:flex;align-items:center;gap:8px;text-decoration:none;padding:10px 14px 10px 6px">
      ${chat({ stade: D.stadeActuel(), taille: 72 })}
      <span style="flex:1"><b class="titre-font" style="font-size:18px;font-weight:600">Boutique d’hiver</b><br><span class="petit">${D.BOUTIQUE.length} articles · cadeau surprise · tenue de Noël</span></span>${I.chevron()}
    </a>
  </main>${onglets('quetes')}`;
};


const puceRarete = (id) => { const r = D.rarete(id); return `<span class="puce" style="background:${r.fond};color:${r.texte}">${r.nom}</span>`; };
ecrans.boutique = () => {
  const e = D.lire(), r = e.reglages;
  const solde = D.croquettes();
  const defi = D.defiSemaine();
  const porte = D.tenueListe();
  const stade = Math.min(D.stadeActuel(), 5);
  const filtres = [['tout', 'Tout'], ...D.EMPLACEMENTS.map((x) => [x.id, x.nom]), ['noel', 'Noël']];
  const liste = D.BOUTIQUE.filter((a) => ui.filtre === 'tout' || (ui.filtre === 'noel' ? a.noel : a.emplacement === ui.filtre));
  const cartes = liste.map((a) => {
    const possede = e.possede.includes(a.id), estPorte = porte.includes(a.id);
    let action;
    if (possede) action = `<button class="puce ${estPorte ? 'menthe' : 'encre'}" type="button" data-a="porter" data-id="${a.id}" style="border:none;min-height:34px">${estPorte ? I.check(13) + ' Porté' : 'Porter'}</button>`;
    else if (a.defi && defi.gagne) action = `<button class="puce encre" type="button" data-a="recuperer" data-id="${a.id}" style="border:none;min-height:34px">Le récupérer</button>`;
    else if (solde >= a.prix) action = `<button class="puce peche" type="button" data-a="acheter" data-id="${a.id}" style="border:none;min-height:34px">${fr(a.prix)} · Acheter</button>`;
    else action = `<span class="puce grise">${I.poisson(14)} ${fr(a.prix)}</span>`;
    return `<div class="article${a.noel ? ' noel' : ''}"><div class="vitrine">${chatSVG({ stade, taille: 76, tenue: [a.id] })}</div>${puceRarete(a.rarete)}<b>${a.nom}</b>${action}</div>`;
  }).join('');
  const nbNoel = D.PIECES_NOEL.filter((id) => e.possede.includes(id)).length;
  const complet = D.noelComplet();
  return `<main class="ecran">
    <header class="entete">
      <h1>Boutique</h1>
      <span id="solde" class="puce" style="position:relative;background:#fff;border:1px solid var(--bord-2);font-family:Fredoka,sans-serif;font-size:18px;font-weight:600;padding:7px 12px">${I.poisson()} ${fr(solde)}</span>
    </header>
    <section class="carte" style="display:flex;align-items:center;gap:6px;padding:10px 14px 10px 4px">
      ${chat({ stade: D.stadeActuel(), taille: 130 })}
      <div style="flex:1;display:flex;flex-direction:column;gap:6px">
        <b class="titre-font" style="font-size:20px;font-weight:600">${complet ? 'Mère Noël' : 'La tenue de ' + esc(r.nom)}</b>
        <span class="petit">${porte.length ? porte.map((id) => D.article(id).nom).join(' · ') : 'Rien pour l’instant. Touche « Porter » sur un article.'}</span>
        ${porte.length ? '<button class="lien-texte" type="button" data-a="toutRetirer" style="align-self:flex-start;padding:0">Tout retirer</button>' : ''}
      </div>
    </section>
    ${D.cadeauOffertDispo() ? `<section class="carte offert"><div class="neige" aria-hidden="true">${flocons(10)}</div><div style="position:relative;display:flex;align-items:center;gap:12px"><span class="etoile-noel" style="background:#C8283C;color:#FFF4E6">${I.cadeau(26)}</span><div style="flex:1"><b class="titre-font" style="font-size:18px;font-weight:600;color:#FFF4E6">${D.CADEAU_OFFERT.titre}</b><br><span class="petit" style="color:#E4DCF7">Offert, une seule fois. Mêmes chances que le cadeau surprise.</span></div></div><button class="btn orange" type="button" data-a="cadeauOffert" style="position:relative;height:50px;font-size:15px">Ouvrir mon cadeau offert</button></section>` : ''}
    <section class="carte chacha">
      <div style="display:flex;align-items:center;gap:10px">
        <span class="etoile-noel" aria-hidden="true">${I.etoile(30)}</span>
        <div style="flex:1"><b class="titre-font" style="font-size:18px;font-weight:600">Super Chacha de Noël</b><br><span class="petit">${e.superChacha ? `Accomplie le ${D.dateCourte(e.superChacha)}. ` : ''}Réunis et porte les 5 pièces légendaires de Noël : ${esc(r.nom)} se transforme en Mère Noël.</span></div>
      </div>
      <div class="pieces-noel">${D.PIECES_NOEL.map((id) => `<span class="${e.possede.includes(id) ? (porte.includes(id) ? 'porte' : 'ok') : ''}" title="${D.article(id).nom}">${chatSVG({ stade, taille: 50, tenue: [id], silhouette: !e.possede.includes(id) })}</span>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="petit">${nbNoel} / 5 pièces dans ton dressing</span>${e.superChacha ? `<button class="puce encre" type="button" data-a="revoirChacha" style="border:none;min-height:34px">${complet ? 'Revoir la transformation' : 'Remettre la tenue'}</button>` : ''}</div>
    </section>
    <section class="carte" style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><b class="titre-font" style="font-size:18px;font-weight:600">Cadeau surprise</b><span class="puce peche">${fr(D.CADEAU.prix)} croquettes</span></div>
      <div class="petit" style="display:flex;flex-direction:column;gap:3px">${D.RARETES.map((x) => `<span style="display:flex;justify-content:space-between;align-items:center"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${x.fond};border:1px solid ${x.texte};margin-right:6px;vertical-align:-1px"></i>${x.nom} (${D.BOUTIQUE.filter((a) => a.rarete === x.id).length} articles)</span><span>${x.chance}${nb}%</span></span>`).join('')}</div>
      <p class="texte-doux" style="font-size:12px">Le cadeau donne un article de la rareté tirée que tu n’as pas encore. Si tu as déjà tous ceux de cette rareté, on te rend ${fr(D.CADEAU.rembourseDoublon)} croquettes.</p>
      ${solde >= D.CADEAU.prix ? `<button class="btn orange" type="button" data-a="cadeau" style="height:50px;font-size:15px">Ouvrir un cadeau · ${fr(D.CADEAU.prix)}</button>` : `<button class="btn contour" type="button" disabled style="height:50px;font-size:15px;opacity:.6">Il manque ${fr(D.CADEAU.prix - solde)} croquettes</button>`}
    </section>
    <div class="filtres" role="group" aria-label="Filtrer par catégorie">${filtres.map(([id, lib]) => `<button type="button" class="filtre" data-a="filtre" data-id="${id}" aria-pressed="${ui.filtre === id}">${lib}</button>`).join('')}</div>
    <div class="grille3">${cartes}</div>
    <p class="texte-doux" style="font-size:12px;text-align:center">Un seul article par emplacement : un nouveau bonnet remplace l’ancien.</p>
  </main>${onglets('boutique')}`;
};

function flocons(n) {
  return Array.from({ length: n }, (_, i) => `<span style="left:${(i * 47) % 100}%;animation-delay:${((i * 29) % 300) / 100}s;animation-duration:${3 + ((i * 17) % 30) / 10}s"><svg width="${10 + (i % 4) * 5}" height="${10 + (i % 4) * 5}" viewBox="0 0 20 20"><path d="M10 1v18M1 10h18M3.6 3.6l12.8 12.8M3.6 16.4L16.4 3.6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg></span>`).join('');
}
ecrans.dressing = () => {
  const e = D.lire(), r = e.reglages;
  const porte = D.tenueListe();
  const stade = Math.min(D.stadeActuel(), 5);
  const possedes = D.BOUTIQUE.filter((a) => e.possede.includes(a.id));
  const toutNoel = D.PIECES_NOEL.every((id) => e.possede.includes(id));
  const zones = D.EMPLACEMENTS.map((z) => {
    const items = possedes.filter((a) => a.emplacement === z.id);
    if (!items.length) return '';
    const actuel = e.tenue[z.id] ? D.article(e.tenue[z.id]) : null;
    return `<section class="carte zone">
      <div class="zone-tete"><div><span class="maj petit" style="color:var(--brun)">${z.zone}</span><br><b>${actuel ? actuel.nom : 'Rien de porté'}</b></div>
      ${actuel ? `<button class="puce encre" type="button" data-a="retirer" data-slot="${z.id}" style="border:none;min-height:36px">Retirer</button>` : ''}</div>
      <div class="grille3">${items.map((a) => {
        const p = porte.includes(a.id);
        return `<button type="button" class="vetement${p ? ' porte' : ''}" data-a="porter" data-id="${a.id}" aria-pressed="${p}" aria-label="${p ? 'Retirer' : 'Mettre'} ${a.nom}">
          <span class="vitrine">${chatSVG({ stade, taille: 70, tenue: [a.id] })}</span>
          <b>${a.nom}</b>
          <span class="puce ${p ? 'menthe' : 'peche'}">${p ? I.check(12) + ' Porté' : 'Mettre'}</span>
        </button>`;
      }).join('')}</div>
    </section>`;
  }).join('');
  return `<main class="ecran">
    <header style="padding:0 4px"><h1 class="titre-font" style="margin:0;font-size:28px;font-weight:600">Dressing de ${esc(r.nom)}</h1>
    <p class="sous">${pluriel(possedes.length, 'vêtement', 'vêtements')} dans le dressing · ${pluriel(porte.length, 'porté', 'portés')}</p></header>
    <section class="carte" style="display:flex;flex-direction:column;align-items:center;gap:6px">
      ${chat({ stade: D.stadeActuel(), taille: 190 })}
      ${D.noelComplet() ? '<span class="puce" style="background:#FFE7A8;color:#7A4E00">Mère Noël</span>' : ''}
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        ${porte.length ? '<button class="puce grise" type="button" data-a="toutRetirer" style="border:none;min-height:36px">Tout retirer</button>' : ''}
        ${toutNoel && !D.noelComplet() ? '<button class="puce encre" type="button" data-a="revoirChacha" style="border:none;min-height:36px">Mettre la tenue de Noël</button>' : ''}
      </div>
    </section>
    ${possedes.length ? zones : `<section class="carte" style="text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center"><b class="titre-font" style="font-size:18px;font-weight:600">Le dressing est vide</b><p class="texte-doux">Les vêtements achetés ou gagnés dans les cadeaux apparaîtront ici.</p><a class="lien-pilule" href="#/boutique">Aller à la boutique ${I.fleche()}</a></section>`}
    ${possedes.length ? `<a class="lien-texte" href="#/boutique" style="align-self:center">Voir la boutique</a>` : ''}
  </main>${onglets('dressing')}`;
};

function transformationNoel() {
  const r = D.R();
  const stade = D.stadeActuel();
  const tenue = D.tenueListe();
  const sansNoel = tenue.filter((id) => id !== 'manteau-noel');
  const flocons = Array.from({ length: 22 }, (_, i) => `<span style="left:${(i * 47) % 100}%;animation-delay:${((i * 29) % 300) / 100}s;animation-duration:${3 + ((i * 17) % 30) / 10}s;"><svg width="${10 + (i % 4) * 5}" height="${10 + (i % 4) * 5}" viewBox="0 0 20 20"><path d="M10 1v18M1 10h18M3.6 3.6l12.8 12.8M3.6 16.4L16.4 3.6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg></span>`).join('');
  const el = document.createElement('div');
  el.className = 'fete transfo';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Super Chacha de Noël');
  el.innerHTML = `<div class="neige" aria-hidden="true">${flocons}</div>
    <div class="fete-contenu" style="justify-content:center">
      <span class="puce pop" style="background:#FFE7A8;color:#6B4500;font-size:13px;letter-spacing:.08em">SUPER CHACHA DE NOËL</span>
      <div class="scene-transfo">
        <div class="orbite" aria-hidden="true"><span class="etoile-orbite">${I.etoile(46)}</span></div>
        <div class="flash" aria-hidden="true"></div>
        <div class="chat-transfo">${chatSVG({ stade, taille: 232, tenue: sansNoel, humeur: 'joie' })}</div>
      </div>
      <h1 class="titre-font apparait" style="margin:0;text-align:center;font-size:30px;font-weight:600;line-height:1.15;color:#FFF4E6">${esc(r.nom)} devient<br>Mère Noël</h1>
      <p class="apparait" style="margin:0;text-align:center;font-size:15px;color:#E4DCF7">La tenue complète de Noël est réunie.</p>
      <button class="btn orange apparait" type="button" data-fermer style="margin-top:12px">Joyeux Noël, ${esc(r.nom)}</button>
    </div>`;
  el.querySelector('[data-fermer]').addEventListener('click', () => { el.remove(); afficher(); });
  document.body.appendChild(el);
  const rapide = !D.R().anims || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveler = () => { const c = el.querySelector('.chat-transfo'); if (c) c.innerHTML = chatSVG({ stade, taille: 232, tenue, humeur: 'joie' }); el.classList.add('fini'); sons.chanson(); };
  if (rapide) reveler(); else { sons.fete(); setTimeout(reveler, 2300); }
  el.querySelector('[data-fermer]').focus({ preventScroll: true });
}
// Appelé après chaque changement de tenue : déclenche la transformation quand la panoplie se complète.
function verifierNoel(avant) {
  if (avant || !D.noelComplet()) return false;
  D.modifier((e) => { if (!e.superChacha) e.superChacha = D.aujourdhui(); });
  transformationNoel();
  return true;
}

ecrans.reglages = () => {
  const e = D.lire(), r = e.reglages;
  const inter = (cle, lib, detail) => `<div class="ligne-reglage"><div class="lib"><b>${lib}</b>${detail ? `<small>${detail}</small>` : ''}</div><button class="interrupteur" type="button" role="switch" aria-checked="${r[cle] ? 'true' : 'false'}" aria-label="${lib}" data-a="bascule" data-cle="${cle}"><span></span></button></div>`;
  const prevus = (e.prevus || []).filter((p) => p.date > D.aujourdhui());
  const save = e.sauvegarde ? D.ecartJours(e.sauvegarde.slice(0, 10), D.aujourdhui()) : null;
  return `<main class="ecran">
    <a class="retour" href="#/historique" style="margin:-8px 0 -4px 4px">${I.retour()} Historique</a>
    <header style="padding:0 4px"><h1 class="titre-font" style="margin:0;font-size:28px;font-weight:600">Réglages</h1><p class="sous">Tout reste sur ton iPhone. Pas de compte, pas de pub.</p></header>
    <section class="carte" style="display:flex;align-items:center;gap:6px;padding:12px 14px 12px 6px">
      ${chat({ stade: D.stadeActuel(), taille: 72 })}
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
        <label for="nom" class="maj petit" style="color:var(--brun)">Nom du chaton</label>
        <input class="champ titre-font" id="nom" type="text" maxlength="16" autocomplete="off" value="${esc(r.nom)}" data-champ="nom">
      </div>
    </section>
    <h2 class="section-titre">Ton plan</h2>
    <section class="carte serree liste">
      <div class="ligne-reglage"><div class="lib"><b id="lbl-obj">Objectif quotidien</b><small>Le baisser compte pour les étoiles. Le remonter ne fait rien perdre.</small></div>
        <div class="pas" role="group" aria-labelledby="lbl-obj"><button type="button" data-a="objMoins" aria-label="Baisser l’objectif">−</button><output aria-live="polite">${D.objectifActuel()}</output><button type="button" data-a="objPlus" aria-label="Monter l’objectif">+</button></div></div>
      ${inter('paliersAuto', 'Proposer les paliers', 'Quand ta moyenne sur 3 jours passe sous l’objectif. Jamais plus de −1, c’est toi qui valides.')}
      <div class="ligne-reglage"><div class="lib"><b>Point de départ</b></div><span class="petit" style="font-size:15px">${r.reference} par jour · ${D.dateCourte(r.debut)}</span></div>
      ${prevus.length ? `<div class="ligne-reglage"><div class="lib"><b>Étapes prévues</b></div><span class="petit" style="font-size:15px;text-align:right">${prevus.map((p) => `${p.objectif === 0 ? 'Sans tabac' : p.objectif + '/j'} · ${D.dateCourte(p.date)}`).join('<br>')}</span></div>` : ''}
    </section>
    <h2 class="section-titre">Ton paquet</h2>
    <section class="carte serree liste">
      <div class="ligne-reglage"><div class="lib"><b id="lbl-paq">Cigarettes par paquet</b></div><div class="pas" role="group" aria-labelledby="lbl-paq"><button type="button" data-a="paqMoins" aria-label="Moins">−</button><output aria-live="polite">${r.paquet}</output><button type="button" data-a="paqPlus" aria-label="Plus">+</button></div></div>
      <div class="ligne-reglage"><div class="lib"><label for="prix" style="font-size:16px;font-weight:800">Prix du paquet</label><small>${euros(D.prixCigarette(), 2)} la cigarette</small></div><div style="display:flex;align-items:center;gap:6px"><input class="champ titre-font" id="prix" type="text" inputmode="decimal" value="${fr(r.prix, 2)}" data-champ="prix" style="width:96px;text-align:right;font-size:18px"><b>€</b></div></div>
    </section>
    <h2 class="section-titre">${esc(r.nom)} et toi</h2>
    <section class="carte serree liste">
      ${inter('sons', 'Sons', 'Miaous et ronrons. Muets si ton iPhone est en silencieux.')}
      ${inter('anims', 'Animations', 'Sauts, pluie de croquettes. Coupées d’office si « Réduire les animations » est activé sur l’iPhone.')}
    </section>
    <h2 class="section-titre">Rappels</h2>
    <section class="carte">
      <details class="aide"><summary>Recevoir un rappel pour le bilan du soir ${I.chevron()}</summary>
        <p class="texte-doux">Une web app ne peut pas programmer de rappel toute seule sur iPhone. L’app Raccourcis le fait très bien, en 1 minute&nbsp;:</p>
        <ol><li>Ouvre <b>Raccourcis</b> → onglet <b>Automatisation</b> → <b>+</b>.</li><li>Choisis <b>Heure de la journée</b>, mets 22:30, <b>Quotidiennement</b>, puis <b>Exécuter immédiatement</b>.</li><li>Ajoute l’action <b>Ouvrir l’app</b> et choisis <b>Ronron</b> (ou l’action <b>Afficher une notification</b> avec «&nbsp;${esc(r.nom)} t’attend pour le bilan&nbsp;»).</li></ol>
        <p class="texte-doux">Jamais de rappel pour te dire de ne pas fumer, ni de reproche.</p>
      </details>
    </section>
    <h2 class="section-titre" id="donnees">Tes données</h2>
    <section class="carte serree liste">
      <div style="padding:14px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:10px"><span style="width:40px;height:40px;border-radius:20px;display:flex;align-items:center;justify-content:center;flex:none;background:${save !== null && save <= 14 ? 'var(--menthe)' : 'var(--peche)'};color:${save !== null && save <= 14 ? '#1F7A5C' : 'var(--rouille)'}">${I.telecharger()}</span>
        <div><b>Dernière sauvegarde</b><div class="petit" style="color:${save !== null && save <= 14 ? 'var(--menthe-texte)' : 'var(--peche-texte)'}">${save === null ? 'Jamais · fais-en une maintenant' : save === 0 ? 'Aujourd’hui' : `Il y a ${pluriel(save, 'jour', 'jours')}`}</div></div></div>
        <button class="btn encre" type="button" data-a="exporter" style="height:50px;font-size:15px">Sauvegarder mes données</button>
        <p class="texte-doux" style="font-size:12px">Un fichier à garder dans Fichiers ou iCloud Drive. Si tu changes d’iPhone ou supprimes l’icône, tu le rouvres ici et ${esc(r.nom)} revient comme avant.</p>
      </div>
      <label class="ligne-reglage" style="cursor:pointer"><div class="lib"><b>Restaurer depuis un fichier</b><small>Sauvegarde Ronron ou historique Smoless (.json)</small></div>${I.chevron()}<input type="file" accept=".json,application/json" data-champ="restaurer" class="sr"></label>
      <a class="ligne-reglage" href="#/historique" style="text-decoration:none"><div class="lib"><b>Historique et corrections</b><small>${pluriel(D.listeJours().length, 'jour', 'jours')} suivis</small></div>${I.chevron()}</a>
      ${ui.confirmEffacer ? `<div style="margin:10px;padding:12px;border-radius:16px;background:#FDECEA;display:flex;flex-direction:column;gap:10px"><b style="font-size:14px;color:#7A1F17">Effacer toutes les données et repartir de zéro${nb}? ${esc(r.nom)} redeviendra un chaton. Sauvegarde d’abord si tu as un doute.</b><div class="grille3" style="grid-template-columns:1fr 1fr"><button class="btn blanc" type="button" data-a="annulerEffacer">Annuler</button><button class="btn danger" type="button" data-a="confirmerEffacer">Effacer</button></div></div>` : `<button class="ligne-reglage" type="button" data-a="demanderEffacer" style="width:100%;border:none;background:none;text-align:left;color:#B3261E;font-weight:800;font-size:16px">Tout effacer</button>`}
    </section>
    <h2 class="section-titre">Besoin d’un coup de patte</h2>
    <a class="carte" href="tel:3989" style="display:flex;align-items:center;gap:12px;text-decoration:none"><span style="width:40px;height:40px;border-radius:20px;background:var(--menthe);color:#1F7A5C;display:flex;align-items:center;justify-content:center;flex:none">${I.tel()}</span><span><b>Tabac Info Service · 39 89</b><br><span class="petit">Des tabacologues au téléphone, gratuitement, si tu veux un vrai coup de main.</span></span></a>
    <footer style="margin:14px 20px 0;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center">
      <span class="titre-font" style="font-size:18px;font-weight:600">Ronron</span>
      <span class="petit" style="color:var(--brun)">Un chaton à la fois · version ${VERSION_APP}</span>
      <span style="margin-top:6px;font-size:11px;line-height:1.45;font-weight:600;color:var(--brun-2)">Ronron n’est pas un dispositif médical. C’est un compagnon pour fumer moins, à ton rythme.</span>
    </footer>
  </main>${onglets('historique')}`;
};

const estIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const estInstallee = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

ecrans.bienvenue = () => {
  if (estIOS() && !estInstallee() && !ui.installVu) {
    return `<main class="bienvenue">
      ${chatSVG({ stade: 1, taille: 150 })}
      <h1>Ronron</h1><p class="sous" style="font-size:16px">Un chaton à la fois</p>
      <ol class="etapes">
        <li><b>1</b><span>Touche le bouton <b>Partager</b> ${I.partager(18)} de Safari.</span></li>
        <li><b>2</b><span>Choisis <b>Sur l’écran d’accueil</b>, puis <b>Ajouter</b>.</span></li>
        <li><b>3</b><span>Ouvre Ronron <b>depuis la nouvelle icône</b> et commence là.</span></li>
      </ol>
      <p class="texte-doux">Important&nbsp;: sur iPhone, les données de l’icône et celles de Safari sont séparées. Commence directement dans l’appli installée.</p>
      <button class="lien-texte" type="button" data-a="ignorerInstall">Continuer dans Safari quand même</button>
    </main>`;
  }
  if (ui.depart) {
    return `<main class="bienvenue" style="justify-content:flex-start">
      ${chatSVG({ stade: 1, taille: 110 })}
      <h1 style="font-size:30px">On démarre</h1>
      <form class="carte" data-form="depart" style="width:100%;text-align:left;display:flex;flex-direction:column;gap:12px">
        <label class="petit" for="d-nom">Nom de ton chaton</label><input class="champ titre-font" id="d-nom" name="nom" value="Miette" maxlength="16" required>
        <label class="petit" for="d-ref">Combien de cigarettes par jour aujourd’hui&nbsp;?</label><input class="champ" id="d-ref" name="reference" type="number" inputmode="numeric" min="1" max="80" value="15" required>
        <label class="petit" for="d-paq">Cigarettes par paquet</label><input class="champ" id="d-paq" name="paquet" type="number" inputmode="numeric" min="1" max="50" value="20" required>
        <label class="petit" for="d-prix">Prix du paquet (€)</label><input class="champ" id="d-prix" name="prix" type="text" inputmode="decimal" value="12,60" required>
        <button class="btn orange" type="submit" style="margin-top:6px">C’est parti</button>
      </form>
      <button class="lien-texte" type="button" data-a="retourBienvenue">Retour</button>
    </main>`;
  }
  return `<main class="bienvenue">
    ${chatSVG({ stade: 1, taille: 150 })}
    <h1>Ronron</h1><p class="sous" style="font-size:16px">Un chaton à la fois</p>
    <p class="texte-doux" style="font-size:15px;max-width:320px">Note chaque cigarette d’un tap. Fume un peu moins, ton chaton grandit.</p>
    <label class="btn orange" style="cursor:pointer;margin-top:10px">Reprendre mon historique<input type="file" accept=".json,application/json" data-champ="restaurer" class="sr"></label>
    <span class="petit">Fichier .json (historique Smoless ou sauvegarde Ronron)</span>
    <button class="btn contour" type="button" data-a="commencer">Commencer de zéro</button>
  </main>`;
};

// ---------- Actions ----------
let dernierTap = 0;
let corrN = null;
const actions = {
  fumer() {
    const now = Date.now();
    if (now - dernierTap < 1200) return;
    dernierTap = now;
    const t = D.aujourdhui();
    const ok = D.modifier((e) => { const j = e.jours[t] || { n: 0, heures: [] }; j.n += 1; j.heures = [...(j.heures || []), D.heureMaintenant()]; e.jours[t] = j; });
    if (!ok) { dernierTap = 0; toast('Enregistrement impossible : la cigarette n’a pas été notée. Réessaie.'); return; }
    vibrer();
    afficher();
    const c = document.getElementById('compte');
    if (c) { c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse'); }
  },
  annuler() {
    const t = D.aujourdhui();
    D.modifier((e) => { const j = e.jours[t]; if (!j || j.n <= 0) return; j.n -= 1; if (j.heures && j.heures.length) j.heures.pop(); });
    afficher();
    toast('Dernière cigarette retirée.');
  },
  son() { D.modifier((e) => { e.reglages.sons = !e.reglages.sons; }); activerSons(D.R().sons); afficher(); if (D.R().sons) sons.mrrp(); },
  caresse() {
    sons.caresse();
    const zone = document.getElementById('zone-caresse');
    const c = document.getElementById('chat-caresse');
    if (c) { c.className = ''; void c.offsetWidth; c.className = 'ronronne'; c.style.display = 'block'; }
    const aide = document.getElementById('aide-caresse');
    if (aide) aide.textContent = 'Elle adore. Encore une' + nb + '?';
    if (!zone) return;
    if (!zone.querySelector('.bulle')) { const b = document.createElement('span'); b.className = 'bulle'; b.setAttribute('aria-hidden', 'true'); b.textContent = 'Rrrrr…'; zone.appendChild(b); }
    const couleurs = ['#F7A8B8', '#FF8FA3', '#FFB27A', '#CFC4EA'];
    for (let i = 0; i < 7; i++) {
      const h = document.createElement('span');
      h.className = 'coeur-vol';
      h.setAttribute('aria-hidden', 'true');
      const w = 16 + ((i * 7) % 14);
      h.style.left = (30 + ((i * 61) % 170)) + 'px';
      h.style.animationDelay = (i * 0.18) + 's';
      h.innerHTML = `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 3.2C20 16 12 21 12 21z" fill="${couleurs[i % 4]}"/></svg>`;
      zone.appendChild(h);
      setTimeout(() => h.remove(), 3200);
    }
  },
  accepter() {
    const prop = D.propositionPalier();
    if (!prop) return;
    const avantSt = D.stadeActuel(), avantEt = D.etoiles();
    D.modifier((e) => { D.fixerObjectif(prop.a, 'palier'); e.refusPalier = null; });
    const st = D.stadeActuel(), et = D.etoiles(), nom = esc(D.R().nom);
    const evolution = st > avantSt;
    const prochain = st < 5 ? { stade: st + 1, texte: `${D.PALIERS[st].nom} à ${D.seuilStade(D.R().reference, st + 1)} par jour` } : st === 5 ? { stade: 6, texte: 'Chat légendaire : 0 pendant 7 jours' } : null;
    fete({ titre: evolution ? 'Évolution !' : 'Nouvelle étoile !', sousTitre: evolution ? `${nom} est devenue<br>${D.PALIERS[st - 1].nom}` : `${nom} gagne<br>${et > avantEt ? 'une nouvelle étoile' : 'un palier'}`, stade: st, nbEtoiles: et, prochain });
  },
  refuser() {
    D.modifier((e) => { e.refusPalier = D.aujourdhui(); });
    toast(`D’accord, on garde ${D.objectifActuel()}. On t’en reparle dans 3 jours.`);
    location.hash = '#/accueil';
  },
  quete(el) {
    const id = el.dataset.id, t = D.aujourdhui();
    const avant = D.quetesDu(t);
    const fait = !avant[id];
    D.modifier((e) => { e.quetes[t] = Object.assign({}, avant, { [id]: fait }); });
    const toutes = D.QUETES.every((d) => D.quetesDu(t)[d.id]);
    afficher();
    if (fait) {
      const gain = D.QUETES.find((d) => d.id === id).gain + (toutes ? D.BONUS_QUETES : 0);
      const solde = document.getElementById('solde');
      if (solde) { const s = document.createElement('span'); s.className = 'envol'; s.textContent = '+' + gain; s.setAttribute('aria-hidden', 'true'); solde.appendChild(s); solde.classList.add('pulse'); setTimeout(() => s.remove(), 1300); }
      toutes ? sons.chanson() : sons.mrrp();
    }
  },
  chanter() { sons.chanson(); },
  acheter(el) {
    const a = D.article(el.dataset.id);
    if (!a || D.lire().possede.includes(a.id)) return;
    if (D.croquettes() < a.prix) { toast('Pas assez de croquettes pour cet article.'); return; }
    const avant = D.noelComplet();
    const ok = D.modifier((e) => { e.depenses.push({ date: D.aujourdhui(), objet: a.id, n: a.prix }); e.possede.push(a.id); e.tenue[a.emplacement] = a.id; });
    if (!ok) { toast('Enregistrement impossible : rien n’a été débité.'); return; }
    afficher();
    if (!verifierNoel(avant)) { sons.mrrp(); toast(`${a.nom} pour ${D.R().nom}${nb}!`); }
  },
  cadeau() {
    if (D.croquettes() < D.CADEAU.prix) { toast('Pas assez de croquettes pour ce cadeau.'); return; }
    const tab = new Uint32Array(2); crypto.getRandomValues(tab);
    const tirage = D.tirerCadeau(D.lire().possede, tab[0] / 4294967296, tab[1] / 4294967296);
    const avant = D.noelComplet();
    const ok = D.modifier((e) => {
      e.depenses.push({ date: D.aujourdhui(), objet: 'cadeau', n: D.CADEAU.prix });
      if (tirage.article) { e.possede.push(tirage.article.id); e.tenue[tirage.article.emplacement] = tirage.article.id; }
      else e.bonus.push({ date: D.aujourdhui(), type: 'cadeau-doublon', n: D.CADEAU.rembourseDoublon });
    });
    if (!ok) { toast('Enregistrement impossible : rien n’a été débité.'); return; }
    afficher();
    revelerCadeau({ ...tirage, avantNoel: avant });
  },
  cadeauOffert() {
    if (!D.cadeauOffertDispo()) return;
    const tab = new Uint32Array(2); crypto.getRandomValues(tab);
    const tirage = D.tirerCadeau(D.lire().possede, tab[0] / 4294967296, tab[1] / 4294967296);
    const avant = D.noelComplet();
    const ok = D.modifier((e) => {
      e.cadeauxOfferts = Object.assign({}, e.cadeauxOfferts, { [D.CADEAU_OFFERT.id]: D.aujourdhui() });
      if (tirage.article) { e.possede.push(tirage.article.id); e.tenue[tirage.article.emplacement] = tirage.article.id; }
      else e.bonus.push({ date: D.aujourdhui(), type: 'cadeau-offert-doublon', n: D.CADEAU.rembourseDoublon });
    });
    if (!ok) { toast('Enregistrement impossible : le cadeau reste disponible.'); return; }
    afficher();
    revelerCadeau({ ...tirage, avantNoel: avant, offert: true });
  },
  recuperer(el) {
    const a = D.article(el.dataset.id);
    if (!a || !D.defiSemaine().gagne) return;
    D.modifier((e) => { if (!e.possede.includes(a.id)) e.possede.push(a.id); e.tenue[a.emplacement] = a.id; });
    sons.chanson(); afficher();
  },
  porter(el) {
    const a = D.article(el.dataset.id);
    if (!a || !D.lire().possede.includes(a.id)) return;
    const avant = D.noelComplet();
    D.modifier((e) => { e.tenue[a.emplacement] = e.tenue[a.emplacement] === a.id ? null : a.id; });
    afficher();
    verifierNoel(avant);
  },
  toutRetirer() { D.modifier((e) => { e.tenue = {}; }); afficher(); },
  retirer(el) { D.modifier((e) => { e.tenue[el.dataset.slot] = null; }); afficher(); },
  filtre(el) { ui.filtre = el.dataset.id; afficher(); },
  vueHisto(el) { ui.vueHisto = el.dataset.id; afficher(); },
  plusJours() { ui.joursMax += 30; afficher(); },
  voirJour(el) {
    const input = document.getElementById('date-corr');
    if (!input) return;
    input.value = el.dataset.date;
    syncCorr();
    document.getElementById('corriger').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  revoirChacha() {
    const e = D.lire();
    if (!D.PIECES_NOEL.every((id) => e.possede.includes(id))) return;
    D.modifier((x) => { D.PIECES_NOEL.forEach((id) => { const a = D.article(id); x.tenue[a.emplacement] = id; }); });
    afficher();
    transformationNoel();
  },
  bascule(el) { const k = el.dataset.cle; D.modifier((e) => { e.reglages[k] = !e.reglages[k]; }); appliquerReglages(); afficher(); },
  objMoins() { const o = D.objectifActuel(); if (o <= 0) return; D.modifier(() => D.fixerObjectif(o - 1, 'manuel')); afficher(); },
  objPlus() { const o = D.objectifActuel(); if (o >= D.R().reference) return; D.modifier(() => D.fixerObjectif(o + 1, 'manuel')); afficher(); },
  paqMoins() { D.modifier((e) => { e.reglages.paquet = Math.max(1, e.reglages.paquet - 1); }); afficher(); },
  paqPlus() { D.modifier((e) => { e.reglages.paquet = Math.min(50, e.reglages.paquet + 1); }); afficher(); },
  async exporter() {
    const contenu = JSON.stringify(D.exporter(), null, 1);
    const nom = `ronron-sauvegarde-${D.aujourdhui()}.json`;
    const fichier = new File([contenu], nom, { type: 'application/json' });
    let ok = false;
    try {
      if (navigator.canShare && navigator.canShare({ files: [fichier] })) { await navigator.share({ files: [fichier], title: 'Sauvegarde Ronron' }); ok = true; }
    } catch (err) { if (err && err.name === 'AbortError') return; }
    if (!ok) {
      const url = URL.createObjectURL(fichier);
      const a = document.createElement('a'); a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    D.modifier((e) => { e.sauvegarde = new Date().toISOString(); });
    afficher();
    toast('Sauvegarde prête. Garde le fichier dans Fichiers ou iCloud Drive.');
  },
  demanderEffacer() { ui.confirmEffacer = true; afficher(); },
  annulerEffacer() { ui.confirmEffacer = false; afficher(); },
  confirmerEffacer() { ui.confirmEffacer = false; D.effacerTout(); location.hash = '#/accueil'; afficher(); },
  ignorerInstall() { ui.installVu = true; sessionStorage.setItem('ronron:installVu', '1'); afficher(); },
  commencer() { ui.depart = true; afficher(); },
  retourBienvenue() { ui.depart = false; afficher(); },
  corrMoins() { corrN = Math.max(0, (corrN ?? 0) - 1); majCorr(); },
  corrPlus() { corrN = Math.min(80, (corrN ?? 0) + 1); majCorr(); },
  corrEnregistrer() {
    const k = document.getElementById('date-corr').value;
    const r = D.R();
    if (!k || k < r.debut || k > D.aujourdhui()) { toast('Choisis un jour entre le début et aujourd’hui.'); return; }
    D.modifier((e) => { const avant = e.jours[k] || { heures: [] }; e.jours[k] = { n: corrN ?? 0, heures: (avant.heures || []).slice(0, corrN ?? 0) }; });
    toast(`${D.dateCourte(k)} : ${pluriel(corrN ?? 0, 'cigarette enregistrée', 'cigarettes enregistrées')}.`);
    afficher();
  },
};
function majCorr() { const o = document.getElementById('corr-n'); if (o) o.textContent = corrN ?? 0; }
function syncCorr() {
  const el = document.getElementById('date-corr');
  if (!el) return;
  const k = el.value, e = D.lire();
  corrN = e.jours[k] ? e.jours[k].n : 0;
  majCorr();
}

async function lireFichier(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  try {
    const json = JSON.parse(await f.text());
    const etat = D.importer(json);
    if (D.lire() && !confirmerRemplacement()) return;
    D.demarrer(etat);
    appliquerReglages();
    location.hash = '#/accueil';
    afficher();
    const manque = D.joursManquants().length;
    toast(`${pluriel(D.listeJours().length - manque, 'jour repris', 'jours repris')}.${manque ? ` ${manque} à renseigner dans l’historique.` : ''}`);
    sons.mrrp();
  } catch (err) {
    toast(err.message || 'Fichier illisible.');
  } finally { input.value = ''; }
}
function confirmerRemplacement() {
  // Écran Réglages : on a déjà des données. On demande confirmation par un toast collant.
  return window.confirm('Remplacer les données actuelles par ce fichier ?');
}

// ---------- Rendu & navigation ----------
function route() { return (location.hash.replace(/^#\/?/, '').split(/[#?]/)[0] || 'accueil'); }
let routePrecedente = null;
function afficher() {
  const e = D.lire();
  let r = route();
  if (!e) r = 'bienvenue';
  else if (r === 'bienvenue' || !ecrans[r]) r = 'accueil';
  const scroll = r === routePrecedente ? window.scrollY : 0;
  $app.innerHTML = ecrans[r]();
  document.title = 'Ronron — Un chaton à la fois';
  if (r !== routePrecedente) {
    window.scrollTo(0, 0);
    const ancre = location.hash.split('#')[2];
    if (ancre) { const cible = document.getElementById(ancre); if (cible) setTimeout(() => cible.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }
  } else window.scrollTo(0, scroll);
  if (r === 'historique') { const g = document.getElementById('graphe'); if (g) g.scrollLeft = g.scrollWidth; syncCorr(); }
  routePrecedente = r;
}
function appliquerReglages() {
  const e = D.lire();
  if (!e) return;
  activerSons(e.reglages.sons);
  document.body.classList.toggle('sans-anim', !e.reglages.anims);
}

$app.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-a]');
  if (!el || !$app.contains(el)) return;
  const fn = actions[el.dataset.a];
  if (fn) { ev.preventDefault(); fn(el); }
});
$app.addEventListener('change', (ev) => {
  const el = ev.target;
  const c = el.dataset && el.dataset.champ;
  if (!c) return;
  if (c === 'restaurer') return lireFichier(el);
  if (c === 'dateCorr') return syncCorr();
  if (c === 'nom') { const v = el.value.trim().slice(0, 16) || 'Miette'; D.modifier((e) => { e.reglages.nom = v; }); afficher(); toast(`Ton chaton s’appelle ${v}.`); }
  if (c === 'prix') {
    const v = parseFloat(el.value.replace(',', '.'));
    if (!isFinite(v) || v <= 0 || v > 100) { toast('Indique un prix, par exemple 12,60.'); afficher(); return; }
    D.modifier((e) => { e.reglages.prix = Math.round(v * 100) / 100; }); afficher();
  }
});
$app.addEventListener('submit', (ev) => {
  const form = ev.target;
  if (form.dataset.form !== 'depart') return;
  ev.preventDefault();
  const fd = new FormData(form);
  const ref = Math.max(1, Math.min(80, parseInt(fd.get('reference'), 10) || 15));
  const prix = parseFloat(String(fd.get('prix')).replace(',', '.')) || 12.6;
  D.demarrer(D.nouvelEtat({ nom: String(fd.get('nom')).trim().slice(0, 16) || 'Miette', reference: ref, paquet: parseInt(fd.get('paquet'), 10) || 20, prix }));
  appliquerReglages();
  ui.depart = false;
  location.hash = '#/accueil';
  afficher();
  sons.mrrp();
});
window.addEventListener('hashchange', afficher);
// Changement de jour pendant que l'appli reste ouverte : on rafraîchit.
let jourAffiche = D.aujourdhui();
function verifierJour() { if (D.aujourdhui() !== jourAffiche) { jourAffiche = D.aujourdhui(); afficher(); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) { verifierJour(); if (route() === 'accueil' && D.lire()) afficher(); } });
setInterval(verifierJour, 60000);

// ---------- Démarrage ----------
D.charger();
appliquerReglages();
afficher();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

// ---------- Mises à jour (service worker) ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const proposer = (w) => toast('Une nouvelle version de Ronron est prête.', { label: 'Mettre à jour', collant: true, fn: () => w.postMessage('activer') });
    if (reg.waiting && navigator.serviceWorker.controller) proposer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      if (!w) return;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) proposer(w); });
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
  let recharge = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (recharge) return; recharge = true; location.reload(); });
}

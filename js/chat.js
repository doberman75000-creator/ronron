// Miette, dessinée en SVG. Six stades, une humeur, une tenue (un objet par emplacement).
const f = (n) => Math.round(n * 10) / 10;
const pt = (x, y) => f(x) + ',' + f(y);
let compteur = 0;

export const NOMS_STADES = ['Chaton', 'Chaton curieux', 'Chaton ado', 'Chat adulte', 'Chat d’élite', 'Chat légendaire'];
const PIECES_NOEL = ['bonnet-noel', 'manteau-noel', 'moufles-noel', 'chaussettes-noel', 'chaussette-queue-noel'];
const ROUGE = '#C8283C', ROUGE_F = '#9E1B2E', BLANC = '#FFFDF8', VERT = '#2E7D4F';

// Point sur la courbe de la queue (Bézier cubique).
function bez(p, u) {
  const v = 1 - u;
  return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]);
}
const flocon = (x, y, k, c = '#FFFFFF') => `<path d="M${x - k} ${y} L${x + k} ${y} M${x} ${y - k} L${x} ${y + k} M${f(x - k * 0.7)} ${f(y - k * 0.7)} L${f(x + k * 0.7)} ${f(y + k * 0.7)} M${f(x - k * 0.7)} ${f(y + k * 0.7)} L${f(x + k * 0.7)} ${f(y - k * 0.7)}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;
const houx = (x, y, k = 1) => `<ellipse cx="${f(x - 3 * k)}" cy="${f(y)}" rx="${f(3.2 * k)}" ry="${f(1.8 * k)}" fill="${VERT}" transform="rotate(-25 ${f(x - 3 * k)} ${f(y)})"/><ellipse cx="${f(x + 3 * k)}" cy="${f(y)}" rx="${f(3.2 * k)}" ry="${f(1.8 * k)}" fill="${VERT}" transform="rotate(25 ${f(x + 3 * k)} ${f(y)})"/><circle cx="${x}" cy="${f(y - 1 * k)}" r="${f(1.6 * k)}" fill="#E0263C"/>`;

export function chatSVG({ stade = 4, taille = 200, humeur = 'normal', silhouette = false, accessoire = null, tenue = null, label } = {}) {
  const s = Math.min(6, Math.max(1, Math.round(stade)));
  const ids = new Set([...(Array.isArray(tenue) ? tenue : tenue ? Object.values(tenue) : []), ...(accessoire ? [accessoire] : [])].filter(Boolean));
  const a = (id) => !silhouette && ids.has(id);
  const mereNoel = !silhouette && PIECES_NOEL.every((id) => ids.has(id));
  const joy = humeur === 'joie';
  const t = (s - 1) / 5;
  const r = 46 - 10 * t;
  const hy = 96 - 26 * t;
  const bRx = 34 + 14 * t;
  const bRy = 30 + 22 * t;
  const bCy = 186 - bRy;
  const fur = silhouette ? '#E3D2BF' : '#F29A4A';
  const belly = silhouette ? '#EDE1D3' : '#FFE3C2';
  const inner = silhouette ? '#E3D2BF' : '#F7A8B8';
  const aria = label || (silhouette ? 'Stade encore verrouillé' : mereNoel ? 'Miette en Mère Noël' : 'Miette, ' + NOMS_STADES[s - 1]);
  const uid = 'c' + (++compteur);

  const has = (slot) => [...ids].some((id) => SLOT[id] === slot);
  const ears = (sg) => [pt(100 + sg * 0.92 * r, hy - 0.3 * r), pt(100 + sg * 0.72 * r, hy - 1.28 * r), pt(100 + sg * 0.18 * r, hy - 0.86 * r)].join(' ');
  const earsIn = (sg) => [pt(100 + sg * 0.74 * r, hy - 0.52 * r), pt(100 + sg * 0.67 * r, hy - 1.04 * r), pt(100 + sg * 0.36 * r, hy - 0.8 * r)].join(' ');
  const ex = 0.36 * r;
  const ey = hy + 0.06 * r;
  const eR = r * (0.2 - 0.06 * t);
  const ny = hy + 0.26 * r;
  const x0 = 100 + bRx * 0.7;
  const queue = [[x0, 184], [x0 + 30, 180], [x0 + 36, 144 - 20 * t], [x0 + 16, 128 - 26 * t]];
  const tail = `M${f(queue[0][0])} 184 C${f(queue[1][0])} 180, ${f(queue[2][0])} ${f(queue[2][1])}, ${f(queue[3][0])} ${f(queue[3][1])}`;
  const neckY = hy + r - 5;
  const pawX = [100 - 0.38 * bRx, 100 + 0.38 * bRx];
  const pawRx = 0.26 * bRx;
  const P = [];

  P.push(`<ellipse cx="100" cy="190" rx="${f(bRx + 16)}" ry="5" fill="#2E1F16" opacity="0.1"/>`);
  if (!silhouette && s >= 5 && !has('corps')) {
    const top = bCy - bRy * 0.7;
    P.push(`<path d="M${f(100 - 0.72 * bRx)} ${f(top)} L${f(100 + 0.72 * bRx)} ${f(top)} L${f(100 + bRx + 14)} 188 Q100 197 ${f(100 - bRx - 14)} 188 Z" fill="${s === 6 ? '#C23B4E' : '#7B5CD6'}"/>`);
  }

  // Pattes arrière : visibles seulement avec des chaussettes.
  if (a('chaussettes-rayees') || a('chaussettes-noel')) {
    const noel = a('chaussettes-noel');
    [-1, 1].forEach((sg) => {
      const cx = 100 + sg * bRx * 0.86, cy = 184;
      const id = `${uid}cs${sg > 0 ? 'd' : 'g'}`;
      P.push(`<clipPath id="${id}"><ellipse cx="${f(cx)}" cy="${cy}" rx="${f(pawRx * 1.15)}" ry="8"/></clipPath>`);
      P.push(`<ellipse cx="${f(cx)}" cy="${cy}" rx="${f(pawRx * 1.15)}" ry="8" fill="${noel ? ROUGE : BLANC}"/>`);
      if (noel) P.push(`<rect x="${f(cx - pawRx * 1.2)}" y="${cy - 9}" width="${f(pawRx * 2.4)}" height="5" fill="${BLANC}" clip-path="url(#${id})"/>${houx(cx + sg * 2, cy + 2, 0.8)}`);
      else P.push(`<g clip-path="url(#${id})">${[-6, -1, 4].map((dy) => `<rect x="${f(cx - pawRx * 1.2)}" y="${cy + dy}" width="${f(pawRx * 2.4)}" height="2.6" fill="${VERT}"/>`).join('')}</g>`);
    });
  }

  P.push(`<path d="${tail}" fill="none" stroke="${fur}" stroke-width="13" stroke-linecap="round"/>`);
  // Accessoires de queue
  if (a('pompon-queue')) {
    const [x, y] = queue[3];
    P.push(`<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="${BLANC}" stroke="#D9CBB8" stroke-width="1.2"/><circle cx="${f(x - 3)}" cy="${f(y - 3)}" r="3" fill="#FFFFFF"/><path d="M${f(x - 6)} ${f(y + 2)} q3 3 6 0 M${f(x)} ${f(y + 4)} q3 2 6 -1" stroke="#E6DDD0" stroke-width="1.2" fill="none"/>`);
  }
  if (a('chaussette-queue-noel')) {
    const b = bez(queue, 0.62), tip = queue[3];
    const ang = Math.atan2(tip[1] - b[1], tip[0] - b[0]) * 180 / Math.PI;
    const L = Math.hypot(tip[0] - b[0], tip[1] - b[1]) + 10;
    P.push(`<g transform="translate(${f(b[0])} ${f(b[1])}) rotate(${f(ang)})"><path d="M0 -8 L${f(L)} -8 Q${f(L + 12)} -8 ${f(L + 12)} 4 Q${f(L + 12)} 14 ${f(L)} 14 L${f(L - 6)} 14 Q${f(L - 8)} 8 ${f(L - 10)} 8 L0 8 Z" fill="${ROUGE}"/><rect x="-4" y="-10" width="11" height="20" rx="4" fill="${BLANC}"/>${houx(f(L - 4), -1, 0.8)}</g>`);
  }

  P.push(`<ellipse cx="100" cy="${f(bCy)}" rx="${f(bRx)}" ry="${f(bRy)}" fill="${fur}"/>`);
  P.push(`<ellipse cx="100" cy="${f(bCy + 0.18 * bRy)}" rx="${f(0.56 * bRx)}" ry="${f(0.62 * bRy)}" fill="${belly}"/>`);

  // Vêtements du corps (découpés à la forme du corps)
  const corps = ['pull-flocons', 'doudoune', 'manteau-laine', 'manteau-fourrure', 'manteau-noel'].find(a);
  if (corps) {
    const id = uid + 'corps';
    const yH = neckY - 2, yB = bCy + bRy * 0.86, W = bRx * 2 + 4, X = 100 - bRx - 2;
    const c = [];
    if (corps === 'pull-flocons') {
      c.push(`<rect x="${f(X)}" y="${f(yH)}" width="${f(W)}" height="${f(yB - yH)}" fill="#3E6FB0"/>`);
      for (let i = 0; i < 6; i++) c.push(flocon(f(100 + ((i % 3) - 1) * bRx * 0.55), f(yH + 14 + Math.floor(i / 3) * (yB - yH - 22) / 1.6), 3.6));
      c.push(`<rect x="${f(X)}" y="${f(yB - 7)}" width="${f(W)}" height="7" fill="#2E5690"/>`);
    } else if (corps === 'doudoune') {
      c.push(`<rect x="${f(X)}" y="${f(yH)}" width="${f(W)}" height="${f(yB - yH)}" fill="#1F8A8A"/>`);
      for (let y = yH + 9; y < yB; y += 9) c.push(`<path d="M${f(X)} ${f(y)} H${f(X + W)}" stroke="#14696A" stroke-width="1.6"/>`);
      c.push(`<path d="M100 ${f(yH)} V${f(yB)}" stroke="#E8E2D6" stroke-width="1.8"/>`);
    } else if (corps === 'manteau-laine') {
      c.push(`<rect x="${f(X)}" y="${f(yH)}" width="${f(W)}" height="${f(yB - yH)}" fill="#C9955B"/><path d="M${f(100 + bRx * 0.18)} ${f(yH)} V${f(yB)}" stroke="#A8743E" stroke-width="2"/>`);
      for (let i = 0; i < 3; i++) { const y = yH + 12 + i * ((yB - yH - 18) / 2.4); c.push(`<rect x="${f(100 + bRx * 0.1)}" y="${f(y)}" width="10" height="3.6" rx="1.8" fill="#F3E3C8"/><path d="M${f(100 - bRx * 0.2)} ${f(y + 1.8)} H${f(100 + bRx * 0.1)}" stroke="#5C3A1E" stroke-width="1"/>`); }
    } else if (corps === 'manteau-fourrure') {
      c.push(`<rect x="${f(X)}" y="${f(yH)}" width="${f(W)}" height="${f(yB - yH)}" fill="#7A1E36"/><path d="M100 ${f(yH + 8)} V${f(yB)}" stroke="#5A1226" stroke-width="2"/>`);
      for (let i = 0; i < 3; i++) c.push(`<circle cx="104" cy="${f(yH + 16 + i * 10)}" r="2.2" fill="#E8C060"/>`);
      c.push(`<rect x="${f(X)}" y="${f(yB - 8)}" width="${f(W)}" height="8" fill="#F4EBDD"/>`);
    } else if (corps === 'manteau-noel') {
      c.push(`<rect x="${f(X)}" y="${f(yH)}" width="${f(W)}" height="${f(yB - yH)}" fill="${ROUGE}"/><rect x="${f(100 - 5)}" y="${f(yH)}" width="10" height="${f(yB - yH)}" fill="${BLANC}"/>`);
      const yC = yH + (yB - yH) * 0.55;
      c.push(`<rect x="${f(X)}" y="${f(yC - 4)}" width="${f(W)}" height="8" fill="#2E1F16"/><rect x="94" y="${f(yC - 6)}" width="12" height="12" rx="2" fill="none" stroke="#E8C060" stroke-width="2.6"/>`);
      c.push(`<rect x="${f(X)}" y="${f(yB - 8)}" width="${f(W)}" height="8" fill="${BLANC}"/>`);
    }
    P.push(`<clipPath id="${id}"><ellipse cx="100" cy="${f(bCy)}" rx="${f(bRx)}" ry="${f(bRy)}"/></clipPath><g clip-path="url(#${id})">${c.join('')}</g>`);
    if (corps === 'manteau-fourrure') {
      for (let i = -3; i <= 3; i++) P.push(`<circle cx="${f(100 + i * r * 0.17)}" cy="${f(neckY + 2 + Math.abs(i) * 0.8)}" r="${f(r * 0.13)}" fill="#F4EBDD"/>`);
    }
  }

  P.push(`<ellipse cx="${f(pawX[0])}" cy="183" rx="${f(pawRx)}" ry="7" fill="${belly}"/><ellipse cx="${f(pawX[1])}" cy="183" rx="${f(pawRx)}" ry="7" fill="${belly}"/>`);
  // Moufles
  const moufles = { 'moufles-laine': ['#B85C38', '#F3E3C8', null], 'moufles-flocons': ['#3E6FB0', '#FFFFFF', 'flocon'], 'moufles-noel': [ROUGE, BLANC, 'houx'] };
  const mf = Object.keys(moufles).find(a);
  if (mf) {
    const [coul, poignet, motif] = moufles[mf];
    pawX.forEach((x) => {
      P.push(`<ellipse cx="${f(x)}" cy="182" rx="${f(pawRx + 2.5)}" ry="9" fill="${coul}"/><rect x="${f(x - pawRx - 2.5)}" y="172" width="${f(pawRx * 2 + 5)}" height="5" rx="2.5" fill="${poignet}"/>`);
      if (motif === 'flocon') P.push(flocon(f(x), 184, 3));
      if (motif === 'houx') P.push(houx(x, 184, 0.7));
    });
  }

  P.push(`<polygon points="${ears(-1)}" fill="${fur}"/><polygon points="${ears(1)}" fill="${fur}"/>`);
  P.push(`<polygon points="${earsIn(-1)}" fill="${inner}"/><polygon points="${earsIn(1)}" fill="${inner}"/>`);
  P.push(`<circle cx="100" cy="${f(hy)}" r="${f(r)}" fill="${fur}"/>`);

  if (!silhouette) {
    P.push(`<path d="M100 ${f(hy - 0.98 * r)} L100 ${f(hy - 0.66 * r)} M${f(100 - 0.27 * r)} ${f(hy - 0.94 * r)} L${f(100 - 0.21 * r)} ${f(hy - 0.68 * r)} M${f(100 + 0.27 * r)} ${f(hy - 0.94 * r)} L${f(100 + 0.21 * r)} ${f(hy - 0.68 * r)}" stroke="#D9772B" stroke-width="4" stroke-linecap="round" fill="none"/>`);
    const joues = mereNoel ? 0.17 : 0.12;
    P.push(`<circle cx="${f(100 - 0.56 * r)}" cy="${f(hy + 0.3 * r)}" r="${f(joues * r)}" fill="#F7A8B8" opacity="0.8"/><circle cx="${f(100 + 0.56 * r)}" cy="${f(hy + 0.3 * r)}" r="${f(joues * r)}" fill="#F7A8B8" opacity="0.8"/>`);
    if (s === 5 && !mereNoel) {
      const gW = 0.5 * r, gH = 0.3 * r, gY = ey - 0.17 * r;
      P.push(`<rect x="${f(100 - 0.12 * r - gW)}" y="${f(gY)}" width="${f(gW)}" height="${f(gH)}" rx="${f(0.1 * r)}" fill="#2E1F16"/><rect x="${f(100 + 0.12 * r)}" y="${f(gY)}" width="${f(gW)}" height="${f(gH)}" rx="${f(0.1 * r)}" fill="#2E1F16"/>`);
      P.push(`<path d="M${f(100 - 0.12 * r)} ${f(gY + 0.08 * r)} L${f(100 + 0.12 * r)} ${f(gY + 0.08 * r)}" stroke="#2E1F16" stroke-width="3"/>`);
      P.push(`<path d="M${f(100 - 0.12 * r - gW + 0.08 * r)} ${f(gY + 0.08 * r)} l${f(0.1 * r)} ${f(-0.05 * r)} M${f(100 + 0.2 * r)} ${f(gY + 0.08 * r)} l${f(0.1 * r)} ${f(-0.05 * r)}" stroke="#FFFFFF" opacity="0.6" stroke-width="2" stroke-linecap="round"/>`);
    } else if (joy || mereNoel) {
      const arc = (cx) => `M${f(cx - eR)} ${f(ey + eR * 0.3)} Q${f(cx)} ${f(ey - eR * 1.3)} ${f(cx + eR)} ${f(ey + eR * 0.3)}`;
      P.push(`<path d="${arc(100 - ex)} ${arc(100 + ex)}" fill="none" stroke="#2E1F16" stroke-width="3.5" stroke-linecap="round"/>`);
    } else {
      P.push(`<circle cx="${f(100 - ex)}" cy="${f(ey)}" r="${f(eR)}" fill="#2E1F16"/><circle cx="${f(100 + ex)}" cy="${f(ey)}" r="${f(eR)}" fill="#2E1F16"/>`);
      P.push(`<circle cx="${f(100 - ex + 0.3 * eR)}" cy="${f(ey - 0.35 * eR)}" r="${f(0.38 * eR)}" fill="#FFF"/><circle cx="${f(100 + ex + 0.3 * eR)}" cy="${f(ey - 0.35 * eR)}" r="${f(0.38 * eR)}" fill="#FFF"/>`);
    }
    if (mereNoel) {
      // Petites lunettes rondes dorées de Mère Noël
      const lr = Math.max(eR * 1.5, 0.17 * r);
      P.push(`<circle cx="${f(100 - ex)}" cy="${f(ey)}" r="${f(lr)}" fill="#FFFFFF" fill-opacity="0.25" stroke="#D4A017" stroke-width="2.2"/><circle cx="${f(100 + ex)}" cy="${f(ey)}" r="${f(lr)}" fill="#FFFFFF" fill-opacity="0.25" stroke="#D4A017" stroke-width="2.2"/><path d="M${f(100 - ex + lr)} ${f(ey)} Q100 ${f(ey - 4)} ${f(100 + ex - lr)} ${f(ey)}" stroke="#D4A017" stroke-width="2" fill="none"/>`);
    }
    P.push(`<polygon points="${[pt(100 - 0.08 * r, ny), pt(100 + 0.08 * r, ny), pt(100, ny + 0.09 * r)].join(' ')}" fill="#E86A85"/>`);
    P.push(`<path d="M${f(100 - 0.13 * r)} ${f(ny + 0.17 * r)} Q${f(100 - 0.06 * r)} ${f(ny + 0.25 * r)} 100 ${f(ny + 0.1 * r)} Q${f(100 + 0.06 * r)} ${f(ny + 0.25 * r)} ${f(100 + 0.13 * r)} ${f(ny + 0.17 * r)}" fill="none" stroke="#2E1F16" stroke-width="2" stroke-linecap="round"/>`);
    const wh = (sg) => `M${f(100 + sg * 0.42 * r)} ${f(hy + 0.28 * r)} L${f(100 + sg * r)} ${f(hy + 0.17 * r)} M${f(100 + sg * 0.42 * r)} ${f(hy + 0.36 * r)} L${f(100 + sg * r)} ${f(hy + 0.46 * r)}`;
    P.push(`<path d="${wh(-1)} ${wh(1)}" stroke="#2E1F16" opacity="0.45" stroke-width="1.5" stroke-linecap="round" fill="none"/>`);

    // Accessoires de stade (cachés si un objet occupe l'emplacement)
    if (s === 2) {
      P.push(`<path d="M153 182 Q138 194 120 189" fill="none" stroke="#9B84E0" stroke-width="2.5" stroke-linecap="round"/><circle cx="166" cy="176" r="14" fill="#9B84E0"/><path d="M155 170 Q166 177 177 170 M154 180 Q166 187 178 180 M160 164 Q171 176 161 189" fill="none" stroke="#6E55C2" stroke-width="1.6"/>`);
    }
    const couLibre = !has('cou') && !(corps === 'manteau-fourrure');
    if (s === 3 && couLibre) {
      P.push(`<rect x="${f(100 - 0.72 * r)}" y="${f(neckY)}" width="${f(1.44 * r)}" height="12" rx="6" fill="#2FA39A"/><rect x="${f(100 + 0.22 * r)}" y="${f(neckY + 7)}" width="11" height="26" rx="4" fill="#2FA39A"/>`);
    }
    if (s >= 4 && couLibre && !corps) {
      P.push(`<rect x="${f(100 - 0.6 * r)}" y="${f(neckY)}" width="${f(1.2 * r)}" height="8" rx="4" fill="${s === 6 ? '#7B5CD6' : '#D9435A'}"/><circle cx="100" cy="${f(neckY + 12)}" r="6.5" fill="#F5C044" stroke="#B9861A" stroke-width="1.5"/>`);
    }

    // Cou (la Mère Noël garde son col de fourrure : on n'y superpose rien)
    const cou = (id) => a(id) && !mereNoel;
    if (cou('noeud')) {
      const y = neckY + 4;
      P.push(`<path d="M100 ${f(y)} L${f(100 - 0.5 * r)} ${f(y - 0.22 * r)} Q${f(100 - 0.56 * r)} ${f(y)} ${f(100 - 0.5 * r)} ${f(y + 0.22 * r)} Z M100 ${f(y)} L${f(100 + 0.5 * r)} ${f(y - 0.22 * r)} Q${f(100 + 0.56 * r)} ${f(y)} ${f(100 + 0.5 * r)} ${f(y + 0.22 * r)} Z" fill="#2FA39A"/><circle cx="100" cy="${f(y)}" r="${f(0.1 * r)}" fill="#1E7A73"/>`);
    }
    const echarpe = (fond, motif, epaisseur, pan) => {
      const id = uid + 'ech';
      const x = 100 - 0.82 * r, w = 1.64 * r, y = neckY - 2;
      let rayures = '';
      if (motif) for (let i = 0; i * 7 < w + 30; i++) rayures += `<rect x="${f(x + i * 7)}" y="${f(y - 4)}" width="3.2" height="${epaisseur + 40}" fill="${motif}"/>`;
      P.push(`<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${epaisseur}" rx="${epaisseur / 2}"/>${pan ? `<rect x="${f(100 + 0.18 * r)}" y="${f(y + epaisseur - 4)}" width="${epaisseur}" height="28" rx="4"/>` : ''}</clipPath><g clip-path="url(#${id})"><rect x="${f(x - 4)}" y="${f(y - 4)}" width="${f(w + 8)}" height="${epaisseur + 40}" fill="${fond}"/>${rayures}</g>`);
      if (pan) P.push(`<path d="M${f(100 + 0.18 * r)} ${f(y + epaisseur + 22)} h${epaisseur}" stroke="${motif || '#00000033'}" stroke-width="3" stroke-dasharray="2 2"/>`);
    };
    if (cou('echarpe-rayee')) echarpe('#3E6FB0', '#FFFDF8', 12, true);
    if (cou('echarpe-tricot')) { echarpe('#D9A42B', null, 16, true); P.push(`<path d="${[0, 1, 2, 3, 4, 5].map((i) => `M${f(100 - 0.7 * r + i * 0.28 * r)} ${f(neckY + 2)} l3 4 l3 -4`).join(' ')}" stroke="#B5841C" stroke-width="1.3" fill="none"/>`); }
    if (cou('cache-cou')) {
      const y = neckY - 4;
      P.push(`<rect x="${f(100 - 0.7 * r)}" y="${f(y)}" width="${f(1.4 * r)}" height="17" rx="7" fill="#2E7D4F"/><path d="${[0, 1, 2, 3].map((i) => `M${f(100 - 0.6 * r)} ${f(y + 3.5 + i * 3.4)} H${f(100 + 0.6 * r)}`).join(' ')}" stroke="#256B42" stroke-width="1"/>`);
    }

    // Tête
    if (a('bonnet') || a('bonnet-pompon')) {
      const coul = a('bonnet') ? ['#D9435A', '#B5304A', '#F7A8B8'] : ['#2B3F6B', '#FFFDF8', '#FFFDF8'];
      const by = hy - 0.45 * r;
      P.push(`<path d="M${f(100 - 0.82 * r)} ${f(by)} Q${f(100 - 0.8 * r)} ${f(hy - 1.25 * r)} 100 ${f(hy - 1.25 * r)} Q${f(100 + 0.8 * r)} ${f(hy - 1.25 * r)} ${f(100 + 0.82 * r)} ${f(by)} Z" fill="${coul[0]}"/><rect x="${f(100 - 0.88 * r)}" y="${f(by - 0.06 * r)}" width="${f(1.76 * r)}" height="${f(0.22 * r)}" rx="${f(0.1 * r)}" fill="${coul[1]}"/><circle cx="100" cy="${f(hy - 1.3 * r)}" r="${f(a('bonnet') ? 0.16 * r : 0.24 * r)}" fill="${coul[2]}"/>`);
    }
    if (a('cache-oreilles')) {
      P.push(`<path d="M${f(100 - 0.66 * r)} ${f(hy - 0.86 * r)} Q100 ${f(hy - 1.5 * r)} ${f(100 + 0.66 * r)} ${f(hy - 0.86 * r)}" stroke="#E86A85" stroke-width="4" fill="none"/>`);
      [-1, 1].forEach((sg) => P.push(`<circle cx="${f(100 + sg * 0.66 * r)}" cy="${f(hy - 0.86 * r)}" r="${f(0.3 * r)}" fill="#F7B6C6"/><circle cx="${f(100 + sg * 0.6 * r)}" cy="${f(hy - 0.94 * r)}" r="${f(0.1 * r)}" fill="#FFFFFF" opacity="0.7"/>`));
    }
    if (a('chapka')) {
      const by = hy - 0.5 * r;
      P.push(`<rect x="${f(100 - 0.98 * r)}" y="${f(by)}" width="${f(0.34 * r)}" height="${f(0.75 * r)}" rx="${f(0.15 * r)}" fill="#D8BC94"/><rect x="${f(100 + 0.64 * r)}" y="${f(by)}" width="${f(0.34 * r)}" height="${f(0.75 * r)}" rx="${f(0.15 * r)}" fill="#D8BC94"/>`);
      P.push(`<path d="M${f(100 - 0.8 * r)} ${f(by)} Q${f(100 - 0.78 * r)} ${f(hy - 1.3 * r)} 100 ${f(hy - 1.3 * r)} Q${f(100 + 0.78 * r)} ${f(hy - 1.3 * r)} ${f(100 + 0.8 * r)} ${f(by)} Z" fill="#6B4226"/><rect x="${f(100 - 0.95 * r)}" y="${f(by - 0.2 * r)}" width="${f(1.9 * r)}" height="${f(0.34 * r)}" rx="${f(0.17 * r)}" fill="#D8BC94"/>`);
    }
    if (a('couronne')) {
      const cy = hy - 0.86 * r;
      const cols = ['#F7A8B8', '#F2B12E', '#D9435A', '#9B84E0', '#F7A8B8'];
      P.push(`<path d="M${f(100 - 0.62 * r)} ${f(cy + 0.12 * r)} Q100 ${f(cy - 0.3 * r)} ${f(100 + 0.62 * r)} ${f(cy + 0.12 * r)}" fill="none" stroke="#5FA35A" stroke-width="3"/>`);
      cols.forEach((c, i) => {
        const ang = Math.PI * (0.85 - i * 0.175);
        P.push(`<circle cx="${f(100 + Math.cos(ang) * 0.62 * r)}" cy="${f(cy + 0.12 * r - Math.sin(ang) * 0.36 * r)}" r="${f(0.13 * r)}" fill="${c}"/>`);
      });
    }
    if (a('bonnet-noel')) {
      const by = hy - 0.5 * r;
      const tipX = 100 + 1.15 * r, tipY = hy - 0.7 * r;
      P.push(`<path d="M${f(100 - 0.84 * r)} ${f(by)} Q${f(100 - 0.5 * r)} ${f(hy - 1.75 * r)} ${f(100 + 0.45 * r)} ${f(hy - 1.5 * r)} Q${f(100 + 1.1 * r)} ${f(hy - 1.35 * r)} ${f(tipX)} ${f(tipY)} L${f(100 + 0.84 * r)} ${f(by)} Z" fill="${ROUGE}"/><path d="M${f(100 + 0.2 * r)} ${f(hy - 1.45 * r)} Q${f(100 + 0.8 * r)} ${f(hy - 1.3 * r)} ${f(tipX - 2)} ${f(tipY + 2)}" stroke="${ROUGE_F}" stroke-width="2" fill="none"/>`);
      P.push(`<rect x="${f(100 - 0.95 * r)}" y="${f(by - 0.14 * r)}" width="${f(1.9 * r)}" height="${f(0.3 * r)}" rx="${f(0.15 * r)}" fill="${BLANC}"/><circle cx="${f(tipX)}" cy="${f(tipY)}" r="${f(0.2 * r)}" fill="${BLANC}"/>`);
    }
    if (s === 6 && !has('tete')) {
      const by = hy - 0.9 * r;
      P.push(`<polygon points="${[pt(100 - 0.42 * r, by), pt(100 - 0.5 * r, by - 0.44 * r), pt(100 - 0.24 * r, by - 0.2 * r), pt(100, by - 0.54 * r), pt(100 + 0.24 * r, by - 0.2 * r), pt(100 + 0.5 * r, by - 0.44 * r), pt(100 + 0.42 * r, by)].join(' ')}" fill="#F5C044" stroke="#B9861A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="100" cy="${f(by - 0.12 * r)}" r="3" fill="#D9435A"/>`);
    }
    if (mereNoel) {
      // Col de fourrure et broche de houx de Mère Noël
      for (let i = -3; i <= 3; i++) P.push(`<circle cx="${f(100 + i * r * 0.16)}" cy="${f(neckY + 1 + Math.abs(i) * 0.7)}" r="${f(r * 0.12)}" fill="${BLANC}"/>`);
      P.push(houx(100 + 0.3 * r, neckY + 8, 1.1));
    }
    if (s === 6) {
      const star = (x, y, k) => `M${x} ${y - k} L${f(x + k * 0.25)} ${f(y - k * 0.25)} L${x + k} ${y} L${f(x + k * 0.25)} ${f(y + k * 0.25)} L${x} ${y + k} L${f(x - k * 0.25)} ${f(y + k * 0.25)} L${x - k} ${y} L${f(x - k * 0.25)} ${f(y - k * 0.25)} Z`;
      P.push(`<path d="${star(32, 58, 9)} ${star(170, 44, 7)} ${star(176, 112, 6)} ${star(26, 132, 6)}" fill="#F5C044"/>`);
    }
  }
  return `<svg class="chat" width="${taille}" height="${taille}" viewBox="0 0 200 200" role="img" aria-label="${aria}">${P.join('')}</svg>`;
}

// Emplacement de chaque objet (pour savoir quoi masquer sur le chat).
const SLOT = {
  bonnet: 'tete', 'bonnet-pompon': 'tete', 'cache-oreilles': 'tete', chapka: 'tete', couronne: 'tete', 'bonnet-noel': 'tete',
  noeud: 'cou', 'echarpe-rayee': 'cou', 'echarpe-tricot': 'cou', 'cache-cou': 'cou',
  'pull-flocons': 'corps', doudoune: 'corps', 'manteau-laine': 'corps', 'manteau-fourrure': 'corps', 'manteau-noel': 'corps',
  'moufles-laine': 'pattesAvant', 'moufles-flocons': 'pattesAvant', 'moufles-noel': 'pattesAvant',
  'chaussettes-rayees': 'pattesArriere', 'chaussettes-noel': 'pattesArriere',
  'pompon-queue': 'queue', 'chaussette-queue-noel': 'queue',
};

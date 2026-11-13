// Miette, dessinée en SVG. Six stades, une humeur, des accessoires.
const f = (n) => Math.round(n * 10) / 10;
const pt = (x, y) => f(x) + ',' + f(y);

export const NOMS_STADES = ['Chaton', 'Chaton curieux', 'Chaton ado', 'Chat adulte', 'Chat d’élite', 'Chat légendaire'];

export function chatSVG({ stade = 4, taille = 200, humeur = 'normal', silhouette = false, accessoire = null, label } = {}) {
  const s = Math.min(6, Math.max(1, Math.round(stade)));
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
  const aria = label || (silhouette ? 'Stade encore verrouillé' : 'Miette, ' + NOMS_STADES[s - 1]);

  const ears = (sg) => [pt(100 + sg * 0.92 * r, hy - 0.3 * r), pt(100 + sg * 0.72 * r, hy - 1.28 * r), pt(100 + sg * 0.18 * r, hy - 0.86 * r)].join(' ');
  const earsIn = (sg) => [pt(100 + sg * 0.74 * r, hy - 0.52 * r), pt(100 + sg * 0.67 * r, hy - 1.04 * r), pt(100 + sg * 0.36 * r, hy - 0.8 * r)].join(' ');
  const ex = 0.36 * r;
  const ey = hy + 0.06 * r;
  const eR = r * (0.2 - 0.06 * t);
  const ny = hy + 0.26 * r;
  const x0 = 100 + bRx * 0.7;
  const tail = `M${f(x0)} 184 C${f(x0 + 30)} 180, ${f(x0 + 36)} ${f(144 - 20 * t)}, ${f(x0 + 16)} ${f(128 - 26 * t)}`;
  const neckY = hy + r - 5;
  const parts = [];

  parts.push(`<ellipse cx="100" cy="190" rx="${f(bRx + 16)}" ry="5" fill="#2E1F16" opacity="0.1"/>`);
  if (!silhouette && s >= 5) {
    const top = bCy - bRy * 0.7;
    parts.push(`<path d="M${f(100 - 0.72 * bRx)} ${f(top)} L${f(100 + 0.72 * bRx)} ${f(top)} L${f(100 + bRx + 14)} 188 Q100 197 ${f(100 - bRx - 14)} 188 Z" fill="${s === 6 ? '#C23B4E' : '#7B5CD6'}"/>`);
  }
  parts.push(`<path d="${tail}" fill="none" stroke="${fur}" stroke-width="13" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="100" cy="${f(bCy)}" rx="${f(bRx)}" ry="${f(bRy)}" fill="${fur}"/>`);
  parts.push(`<ellipse cx="100" cy="${f(bCy + 0.18 * bRy)}" rx="${f(0.56 * bRx)}" ry="${f(0.62 * bRy)}" fill="${belly}"/>`);
  parts.push(`<ellipse cx="${f(100 - 0.38 * bRx)}" cy="183" rx="${f(0.26 * bRx)}" ry="7" fill="${belly}"/>`);
  parts.push(`<ellipse cx="${f(100 + 0.38 * bRx)}" cy="183" rx="${f(0.26 * bRx)}" ry="7" fill="${belly}"/>`);
  parts.push(`<polygon points="${ears(-1)}" fill="${fur}"/><polygon points="${ears(1)}" fill="${fur}"/>`);
  parts.push(`<polygon points="${earsIn(-1)}" fill="${inner}"/><polygon points="${earsIn(1)}" fill="${inner}"/>`);
  parts.push(`<circle cx="100" cy="${f(hy)}" r="${f(r)}" fill="${fur}"/>`);

  if (!silhouette) {
    parts.push(`<path d="M100 ${f(hy - 0.98 * r)} L100 ${f(hy - 0.66 * r)} M${f(100 - 0.27 * r)} ${f(hy - 0.94 * r)} L${f(100 - 0.21 * r)} ${f(hy - 0.68 * r)} M${f(100 + 0.27 * r)} ${f(hy - 0.94 * r)} L${f(100 + 0.21 * r)} ${f(hy - 0.68 * r)}" stroke="#D9772B" stroke-width="4" stroke-linecap="round" fill="none"/>`);
    parts.push(`<circle cx="${f(100 - 0.56 * r)}" cy="${f(hy + 0.3 * r)}" r="${f(0.12 * r)}" fill="#F7A8B8" opacity="0.75"/><circle cx="${f(100 + 0.56 * r)}" cy="${f(hy + 0.3 * r)}" r="${f(0.12 * r)}" fill="#F7A8B8" opacity="0.75"/>`);
    if (s === 5) {
      const gW = 0.5 * r, gH = 0.3 * r, gY = ey - 0.17 * r;
      parts.push(`<rect x="${f(100 - 0.12 * r - gW)}" y="${f(gY)}" width="${f(gW)}" height="${f(gH)}" rx="${f(0.1 * r)}" fill="#2E1F16"/><rect x="${f(100 + 0.12 * r)}" y="${f(gY)}" width="${f(gW)}" height="${f(gH)}" rx="${f(0.1 * r)}" fill="#2E1F16"/>`);
      parts.push(`<path d="M${f(100 - 0.12 * r)} ${f(gY + 0.08 * r)} L${f(100 + 0.12 * r)} ${f(gY + 0.08 * r)}" stroke="#2E1F16" stroke-width="3"/>`);
      parts.push(`<path d="M${f(100 - 0.12 * r - gW + 0.08 * r)} ${f(gY + 0.08 * r)} l${f(0.1 * r)} ${f(-0.05 * r)} M${f(100 + 0.2 * r)} ${f(gY + 0.08 * r)} l${f(0.1 * r)} ${f(-0.05 * r)}" stroke="#FFFFFF" opacity="0.6" stroke-width="2" stroke-linecap="round"/>`);
    } else if (joy) {
      const arc = (cx) => `M${f(cx - eR)} ${f(ey + eR * 0.3)} Q${f(cx)} ${f(ey - eR * 1.3)} ${f(cx + eR)} ${f(ey + eR * 0.3)}`;
      parts.push(`<path d="${arc(100 - ex)} ${arc(100 + ex)}" fill="none" stroke="#2E1F16" stroke-width="3.5" stroke-linecap="round"/>`);
    } else {
      parts.push(`<circle cx="${f(100 - ex)}" cy="${f(ey)}" r="${f(eR)}" fill="#2E1F16"/><circle cx="${f(100 + ex)}" cy="${f(ey)}" r="${f(eR)}" fill="#2E1F16"/>`);
      parts.push(`<circle cx="${f(100 - ex + 0.3 * eR)}" cy="${f(ey - 0.35 * eR)}" r="${f(0.38 * eR)}" fill="#FFF"/><circle cx="${f(100 + ex + 0.3 * eR)}" cy="${f(ey - 0.35 * eR)}" r="${f(0.38 * eR)}" fill="#FFF"/>`);
    }
    parts.push(`<polygon points="${[pt(100 - 0.08 * r, ny), pt(100 + 0.08 * r, ny), pt(100, ny + 0.09 * r)].join(' ')}" fill="#E86A85"/>`);
    parts.push(`<path d="M${f(100 - 0.13 * r)} ${f(ny + 0.17 * r)} Q${f(100 - 0.06 * r)} ${f(ny + 0.25 * r)} 100 ${f(ny + 0.1 * r)} Q${f(100 + 0.06 * r)} ${f(ny + 0.25 * r)} ${f(100 + 0.13 * r)} ${f(ny + 0.17 * r)}" fill="none" stroke="#2E1F16" stroke-width="2" stroke-linecap="round"/>`);
    const wh = (sg) => `M${f(100 + sg * 0.42 * r)} ${f(hy + 0.28 * r)} L${f(100 + sg * r)} ${f(hy + 0.17 * r)} M${f(100 + sg * 0.42 * r)} ${f(hy + 0.36 * r)} L${f(100 + sg * r)} ${f(hy + 0.46 * r)}`;
    parts.push(`<path d="${wh(-1)} ${wh(1)}" stroke="#2E1F16" opacity="0.45" stroke-width="1.5" stroke-linecap="round" fill="none"/>`);

    // Accessoires de stade
    if (s === 2) {
      parts.push(`<path d="M153 182 Q138 194 120 189" fill="none" stroke="#9B84E0" stroke-width="2.5" stroke-linecap="round"/><circle cx="166" cy="176" r="14" fill="#9B84E0"/><path d="M155 170 Q166 177 177 170 M154 180 Q166 187 178 180 M160 164 Q171 176 161 189" fill="none" stroke="#6E55C2" stroke-width="1.6"/>`);
    }
    if (s === 3 && accessoire !== 'noeud') {
      parts.push(`<rect x="${f(100 - 0.72 * r)}" y="${f(neckY)}" width="${f(1.44 * r)}" height="12" rx="6" fill="#2FA39A"/><rect x="${f(100 + 0.22 * r)}" y="${f(neckY + 7)}" width="11" height="26" rx="4" fill="#2FA39A"/>`);
    }
    if (s >= 4 && accessoire !== 'noeud') {
      parts.push(`<rect x="${f(100 - 0.6 * r)}" y="${f(neckY)}" width="${f(1.2 * r)}" height="8" rx="4" fill="${s === 6 ? '#7B5CD6' : '#D9435A'}"/><circle cx="100" cy="${f(neckY + 12)}" r="6.5" fill="#F5C044" stroke="#B9861A" stroke-width="1.5"/>`);
    }
    // Accessoires achetés
    if (accessoire === 'noeud') {
      const y = neckY + 4;
      parts.push(`<path d="M100 ${f(y)} L${f(100 - 0.5 * r)} ${f(y - 0.22 * r)} Q${f(100 - 0.56 * r)} ${f(y)} ${f(100 - 0.5 * r)} ${f(y + 0.22 * r)} Z M100 ${f(y)} L${f(100 + 0.5 * r)} ${f(y - 0.22 * r)} Q${f(100 + 0.56 * r)} ${f(y)} ${f(100 + 0.5 * r)} ${f(y + 0.22 * r)} Z" fill="#2FA39A"/><circle cx="100" cy="${f(y)}" r="${f(0.1 * r)}" fill="#1E7A73"/>`);
    }
    if (accessoire === 'bonnet') {
      const by = hy - 0.45 * r;
      parts.push(`<path d="M${f(100 - 0.82 * r)} ${f(by)} Q${f(100 - 0.8 * r)} ${f(hy - 1.25 * r)} 100 ${f(hy - 1.25 * r)} Q${f(100 + 0.8 * r)} ${f(hy - 1.25 * r)} ${f(100 + 0.82 * r)} ${f(by)} Z" fill="#D9435A"/><rect x="${f(100 - 0.88 * r)}" y="${f(by - 0.06 * r)}" width="${f(1.76 * r)}" height="${f(0.22 * r)}" rx="${f(0.1 * r)}" fill="#B5304A"/><circle cx="100" cy="${f(hy - 1.3 * r)}" r="${f(0.16 * r)}" fill="#F7A8B8"/>`);
    }
    if (accessoire === 'couronne') {
      const cy = hy - 0.86 * r;
      const cols = ['#F7A8B8', '#F2B12E', '#D9435A', '#9B84E0', '#F7A8B8'];
      parts.push(`<path d="M${f(100 - 0.62 * r)} ${f(cy + 0.12 * r)} Q100 ${f(cy - 0.3 * r)} ${f(100 + 0.62 * r)} ${f(cy + 0.12 * r)}" fill="none" stroke="#5FA35A" stroke-width="3"/>`);
      cols.forEach((c, i) => {
        const a = Math.PI * (0.85 - i * 0.175);
        parts.push(`<circle cx="${f(100 + Math.cos(a) * 0.62 * r)}" cy="${f(cy + 0.12 * r - Math.sin(a) * 0.36 * r)}" r="${f(0.13 * r)}" fill="${c}"/>`);
      });
    }
    if (s === 6 && accessoire !== 'bonnet' && accessoire !== 'couronne') {
      const by = hy - 0.9 * r;
      parts.push(`<polygon points="${[pt(100 - 0.42 * r, by), pt(100 - 0.5 * r, by - 0.44 * r), pt(100 - 0.24 * r, by - 0.2 * r), pt(100, by - 0.54 * r), pt(100 + 0.24 * r, by - 0.2 * r), pt(100 + 0.5 * r, by - 0.44 * r), pt(100 + 0.42 * r, by)].join(' ')}" fill="#F5C044" stroke="#B9861A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="100" cy="${f(by - 0.12 * r)}" r="3" fill="#D9435A"/>`);
    }
    if (s === 6) {
      const star = (x, y, k) => `M${x} ${y - k} L${f(x + k * 0.25)} ${f(y - k * 0.25)} L${x + k} ${y} L${f(x + k * 0.25)} ${f(y + k * 0.25)} L${x} ${y + k} L${f(x - k * 0.25)} ${f(y + k * 0.25)} L${x - k} ${y} L${f(x - k * 0.25)} ${f(y - k * 0.25)} Z`;
      parts.push(`<path d="${star(32, 58, 9)} ${star(170, 44, 7)} ${star(176, 112, 6)} ${star(26, 132, 6)}" fill="#F5C044"/>`);
    }
  }
  return `<svg class="chat" width="${taille}" height="${taille}" viewBox="0 0 200 200" role="img" aria-label="${aria}">${parts.join('')}</svg>`;
}

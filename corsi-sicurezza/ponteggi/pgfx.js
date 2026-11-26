/* ============================================================
   GRAFICA PONTEGGI: telai, imbracature, vento, segnali
   coordinate dei pannelli: 400 x 280 visibili (y da -60 a 220 = suolo)
   ============================================================ */
const STEEL = '#8a98a3', STEEL2 = '#5f6d77', PLANK = '#b9c4cc', TOE = '#f2a300';

/* ponteggio visto di fronte.
   o.nb campate, o.nl piani, o.bw larghezza campata, o.lh altezza piano (64 px ≈ 2 m)
   o.miss: elenco di difetti da disegnare ('rail2','mid2','toe2','plank2','diag','base0','tie')  */
function scaf(x, y, o = {}) {
  const bw = o.bw || 80, lh = o.lh || 64, nb = o.nb || 2, nl = o.nl || 2, top = o.top === undefined ? 34 : o.top;
  const miss = new Set(o.miss || []), H = nl * lh + top, W = nb * bw, S = [];
  const sx = o.sway || 0;                                   // inclinazione (vento)
  const X = (i, yy) => x + i * bw + sx * (y - yy) / 100;
  // diagonali di facciata
  if (!miss.has('diag')) for (let j = 1; j <= nl; j++) for (let i = 0; i < nb; i++) if ((i + j) % 2 === 0)
    S.push(`<line x1="${X(i, y - (j - 1) * lh)}" y1="${y - (j - 1) * lh}" x2="${X(i + 1, y - j * lh)}" y2="${y - j * lh}" stroke="${STEEL2}" stroke-width="2.5"/>`);
  // montanti, basette e ripartitori
  for (let i = 0; i <= nb; i++) {
    S.push(`<line x1="${X(i, y - 6)}" y1="${y - 6}" x2="${X(i, y - H)}" y2="${y - H}" stroke="${STEEL}" stroke-width="5" stroke-linecap="round"/>`);
    if (miss.has('base' + i)) S.push(`<rect x="${X(i, y) - 11}" y="${y - 16}" width="22" height="16" fill="#c0603a" stroke="#7a3a20"/><line x1="${X(i, y) - 11}" y1="${y - 8}" x2="${X(i, y) + 11}" y2="${y - 8}" stroke="#7a3a20"/>`);
    else S.push(`<rect x="${X(i, y) - 16}" y="${y - 4}" width="32" height="5" fill="#8d6e63"/><rect x="${X(i, y) - 7}" y="${y - 8}" width="14" height="4" fill="#444"/>`);
  }
  // impalcati, parapetti, fermapiede
  for (let j = 1; j <= nl; j++) {
    const Y = y - j * lh;
    if (!miss.has('plank' + j)) S.push(`<rect x="${X(0, Y) - 2}" y="${Y}" width="${W + 4}" height="6" fill="${PLANK}" stroke="${STEEL2}" stroke-width="1"/>`);
    else S.push(`<rect x="${X(0, Y) - 2}" y="${Y}" width="${bw}" height="6" fill="${PLANK}" stroke="${STEEL2}"/>`);
    if (!miss.has('toe' + j)) S.push(`<rect x="${X(0, Y) - 2}" y="${Y - lh * .12}" width="${W + 4}" height="${lh * .12}" fill="${TOE}" opacity=".9"/>`);
    if (!miss.has('mid' + j)) S.push(`<line x1="${X(0, Y - lh * .25)}" y1="${Y - lh * .25}" x2="${X(nb, Y - lh * .25)}" y2="${Y - lh * .25}" stroke="${STEEL}" stroke-width="3"/>`);
    if (!miss.has('rail' + j)) S.push(`<line x1="${X(0, Y - lh * .48)}" y1="${Y - lh * .48}" x2="${X(nb, Y - lh * .48)}" y2="${Y - lh * .48}" stroke="${STEEL}" stroke-width="3.5"/>`);
  }
  return `<g class="scaf">${S.join('')}</g>`;
}
/* parete dell'edificio con finestre */
const facade = (x, y, w, h, c = '#e9d9c3') => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}" stroke="#c9b79e"/>` +
  Array.from({ length: Math.floor(h / 64) }, (_, j) => Array.from({ length: Math.floor(w / 60) }, (_, i) =>
    `<rect x="${x + 16 + i * 60}" y="${y - 52 - j * 64}" width="26" height="34" fill="#9cc3d9" stroke="#8c7b62"/>`).join('')).join('');
/* imbracatura e cordino disegnati sopra un worker in (x,y) con scala s */
const harness = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-13,-80 L13,-44 M13,-80 L-13,-44" stroke="#1565c0" stroke-width="3.5"/><rect x="-15" y="-48" width="30" height="5" fill="#1565c0"/><circle cx="0" cy="-78" r="3.5" fill="#ffca28" stroke="#333"/></g>`;
const lanyard = (x1, y1, x2, y2, c = '#d32f2f') => `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + 18} ${x2},${y2}" stroke="${c}" stroke-width="3" fill="none"/><circle cx="${x2}" cy="${y2}" r="4" fill="none" stroke="#555" stroke-width="2.5"/>`;
const windLines = (x, y, n = 4) => Array.from({ length: n }, (_, i) => `<path class="wind" d="M${x},${y + i * 22} q20,-10 40,0 t40,0 t40,0" stroke="#78909c" stroke-width="3" fill="none" stroke-linecap="round" style="animation-delay:${i * .25}s"/>`).join('');
const tube = (x, y, len, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-len / 2}" y="-4" width="${len}" height="8" rx="3" fill="${STEEL}" stroke="${STEEL2}"/></g>`;
const medal = (x, y, txt = '1') => `<line x1="${x - 8}" y1="${y - 26}" x2="${x}" y2="${y - 8}" stroke="#1565c0" stroke-width="4"/><line x1="${x + 8}" y1="${y - 26}" x2="${x}" y2="${y - 8}" stroke="#c62828" stroke-width="4"/><circle cx="${x}" cy="${y}" r="10" fill="#ffd54f" stroke="#c49000" stroke-width="2"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#7a5a00">${txt}</text>`;
const podium = (x, y) => `<rect x="${x - 30}" y="${y - 40}" width="60" height="40" fill="#cfd8dc" stroke="#90a4ae"/><text x="${x}" y="${y - 14}" text-anchor="middle" font-family="Bangers,Impact" font-size="22" fill="#546e7a">1</text>`;
const wire = (x, y) => `<g stroke="#9e9e9e" stroke-width="2" fill="none">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${x}" cy="${y + i * 3}" rx="16" ry="6"/>`).join('')}</g>`;
const railing = (x, y, w) => `<rect x="${x}" y="${y - 40}" width="${w}" height="4" fill="#37474f"/>${Array.from({ length: Math.floor(w / 10) + 1 }, (_, i) => `<rect x="${x + i * 10}" y="${y - 40}" width="2" height="40" fill="#37474f"/>`).join('')}`;
const brick = (x, y) => `<rect x="${x - 12}" y="${y - 14}" width="24" height="14" fill="#c0603a" stroke="#7a3a20"/><line x1="${x - 12}" y1="${y - 7}" x2="${x + 12}" y2="${y - 7}" stroke="#7a3a20"/>`;
const bolt = (x, y) => `<polygon points="${x},${y} ${x - 14},${y + 30} ${x - 2},${y + 30} ${x - 10},${y + 58} ${x + 14},${y + 20} ${x + 2},${y + 20} ${x + 10},${y}" fill="#ffeb3b" stroke="#f9a825" stroke-width="2"/>`;
const sun = (x, y, r = 26) => `<g class="spin" style="transform-origin:${x}px ${y}px">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${x + Math.cos(a) * (r + 4)}" y1="${y + Math.sin(a) * (r + 4)}" x2="${x + Math.cos(a) * (r + 16)}" y2="${y + Math.sin(a) * (r + 16)}" stroke="#ff9800" stroke-width="4" stroke-linecap="round"/>`; }).join('')}</g><circle cx="${x}" cy="${y}" r="${r}" fill="#ffc107"/>`;
const thermo = (x, y, t) => `<rect x="${x - 6}" y="${y - 70}" width="12" height="62" rx="6" fill="#fff" stroke="#555" stroke-width="2"/><rect x="${x - 3}" y="${y - 60}" width="6" height="52" fill="#e53935"/><circle cx="${x}" cy="${y}" r="11" fill="#e53935" stroke="#555" stroke-width="2"/><text x="${x + 16}" y="${y - 50}" font-size="18" font-weight="700" fill="#c62828">${t}</text>`;
const doc = (x, y, t, c = '#fffde7') => `<g transform="translate(${x},${y}) rotate(-4)"><rect x="0" y="0" width="64" height="80" fill="${c}" stroke="#8d6e63" stroke-width="2"/><text x="32" y="22" text-anchor="middle" font-size="11" font-weight="700" fill="#4e342e">${t}</text>${[34, 44, 54, 64].map(v => `<line x1="8" y1="${v}" x2="56" y2="${v}" stroke="#bcaaa4" stroke-width="2"/>`).join('')}</g>`;

/* ============================================================
   GRAFICA: personaggi, macchine, vignette e infografiche (SVG)
   ============================================================ */
const SKIN = '#f2c79b', YEL = '#f5b700', YEL2 = '#c98f00', INK = '#22303a';

function worker(x, y, o = {}) {
  const s = o.s || 1, f = o.flip ? -1 : 1, v = o.vest || '#ff8c1a', h = o.helmet || '#ffffff';
  const hy = -100, mood = o.mood || 'happy';
  const mouths = {
    happy: `<path d="M-6,${hy + 7} Q0,${hy + 13} 6,${hy + 7}" stroke="#222" stroke-width="2" fill="none"/>`,
    shock: `<ellipse cx="0" cy="${hy + 9}" rx="4" ry="5" fill="#222"/>`,
    worried: `<path d="M-6,${hy + 11} Q0,${hy + 6} 6,${hy + 11}" stroke="#222" stroke-width="2" fill="none"/>`,
    smug: `<path d="M-5,${hy + 9} L6,${hy + 7}" stroke="#222" stroke-width="2"/>`,
    angry: `<path d="M-6,${hy + 11} L6,${hy + 11}" stroke="#222" stroke-width="2.5"/>`
  };
  const brows = mood === 'angry' ? `<path d="M-10,${hy - 9} L-3,${hy - 6} M10,${hy - 9} L3,${hy - 6}" stroke="#222" stroke-width="2"/>`
    : mood === 'shock' ? `<path d="M-10,${hy - 10} L-3,${hy - 11} M10,${hy - 10} L3,${hy - 11}" stroke="#222" stroke-width="2"/>` : '';
  const arms = {
    down: [[-12, -72, -18, -38], [12, -72, 18, -38]],
    up: [[-12, -72, -18, -38], [12, -72, 30, -112]],
    both: [[-12, -72, -30, -112], [12, -72, 30, -112]],
    point: [[-12, -72, -18, -38], [12, -72, 40, -80]],
    stop: [[-12, -72, -18, -38], [12, -74, 38, -96]],
    phone: [[-12, -72, -4, -86], [12, -72, 6, -86]]
  }[o.arm || 'down'];
  const armSvg = arms.map(a => `<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="${v}" stroke-width="8" stroke-linecap="round"/><circle cx="${a[2]}" cy="${a[3]}" r="4.5" fill="${SKIN}"/>`).join('');
  const extra = o.arm === 'phone' ? `<rect x="-6" y="-96" width="12" height="16" rx="2" fill="#222"/>` : '';
  const stopHand = o.arm === 'stop' ? `<circle cx="40" cy="-100" r="8" fill="${SKIN}" stroke="#c98" />` : '';
  return `<g transform="translate(${x},${y}) scale(${f * s},${s})">
   <rect x="-11" y="-40" width="9" height="38" fill="${o.pants || '#2f4a63'}"/><rect x="2" y="-40" width="9" height="38" fill="${o.pants || '#2f4a63'}"/>
   <rect x="-14" y="-5" width="13" height="6" rx="2" fill="#222"/><rect x="2" y="-5" width="13" height="6" rx="2" fill="#222"/>
   ${armSvg}
   <rect x="-15" y="-82" width="30" height="46" rx="7" fill="${v}"/>
   ${o.stripes === false ? '' : `<rect x="-15" y="-62" width="30" height="4" fill="#e9eef2"/><rect x="-15" y="-51" width="30" height="4" fill="#e9eef2"/>`}
   ${extra}${stopHand}
   ${o.hair === 'long' ? `<path d="M-17,${hy} Q-20,${hy + 26} -10,${hy + 24} L10,${hy + 24} Q20,${hy + 26} 17,${hy} Z" fill="${o.hc || '#5a3b22'}"/>` : ''}
   <circle cx="0" cy="${hy}" r="16" fill="${SKIN}"/>
   ${o.helmet === false ? `<path d="M-16,${hy - 2} Q-14,${hy - 20} 0,${hy - 19} Q14,${hy - 20} 16,${hy - 2} Q8,${hy - 10} -16,${hy - 2} Z" fill="${o.hc || '#5a3b22'}"/>` : `<path d="M-17,${hy - 3} A17,17 0 0 1 17,${hy - 3} Z" fill="${h}" stroke="#9aa" stroke-width="1"/>
   <rect x="-21" y="${hy - 5}" width="42" height="4" rx="2" fill="${h}" stroke="#9aa" stroke-width="1"/>`}
   <circle cx="-6" cy="${hy + 1}" r="2.3" fill="#222"/><circle cx="6" cy="${hy + 1}" r="2.3" fill="#222"/>
   ${brows}${mouths[mood]}
  </g>`;
}

function excavator(x, y, o = {}) {
  const f = o.flip ? -1 : 1, s = o.s || 1, rot = o.tilt || 0;
  const poses = { dig: [30, -52, 85, -118, 128, -28], up: [30, -52, 78, -132, 138, -112], low: [30, -52, 90, -100, 140, -14], swing: [30, -52, 95, -110, 150, -70] };
  const p = poses[o.pose || 'dig'];
  const bx = p[4], by = p[5];
  const face = o.face ? `<circle cx="12" cy="-78" r="8" fill="${SKIN}"/><path d="M3,-80 A9,9 0 0 1 21,-80 Z" fill="#fff"/>
     <circle cx="9" cy="-77" r="1.4" fill="#222"/><circle cx="15" cy="-77" r="1.4" fill="#222"/>` : '';
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${f * s},${s})">
   <rect x="-64" y="-22" width="128" height="22" rx="11" fill="#2d2d2d"/>
   ${[-46, -16, 14, 44].map(c => `<circle cx="${c}" cy="-11" r="7" fill="#666"/>`).join('')}
   <rect x="-60" y="-58" width="96" height="36" rx="5" fill="${YEL}" stroke="${YEL2}" stroke-width="2"/>
   <rect x="-60" y="-58" width="24" height="36" rx="4" fill="#d99c00"/>
   <rect x="-12" y="-104" width="42" height="48" rx="6" fill="${YEL}" stroke="${YEL2}" stroke-width="2"/>
   <rect x="-7" y="-99" width="32" height="28" rx="3" fill="#bfe3f5"/>${face}
   <path d="M${p[0]},${p[1]} L${p[2]},${p[3]} L${bx},${by}" stroke="${YEL2}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M${p[0]},${p[1]} L${p[2]},${p[3]} L${bx},${by}" stroke="${YEL}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M${bx - 12},${by - 8} L${bx + 16},${by - 4} L${bx + 10},${by + 16} L${bx - 12},${by + 12} Z" fill="#555"/>
   <path d="M${bx + 10},${by + 16} l3,5 M${bx + 3},${by + 15} l3,5 M${bx - 4},${by + 14} l3,5" stroke="#555" stroke-width="3"/>
  </g>`;
}

const ground = (y = 220, c = '#c8b08a') => `<rect x="0" y="${y}" width="400" height="${300 - y}" fill="${c}"/><rect x="0" y="${y}" width="400" height="5" fill="#6d6d6d"/>`;
const sky = (c = '#e8f4fb') => `<rect y="-60" width="400" height="380" fill="${c}"/>`;
const cloud = (x, y) => `<g fill="#fff" opacity=".9"><circle cx="${x}" cy="${y}" r="14"/><circle cx="${x + 16}" cy="${y - 6}" r="17"/><circle cx="${x + 34}" cy="${y}" r="13"/></g>`;
const burst = (x, y, r, txt, c = '#ffdd00') => {
  let pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = i % 2 ? r * .6 : r; pts.push((x + Math.cos(a) * rr * 1.35).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1)); }
  return `<polygon points="${pts.join(' ')}" fill="${c}" stroke="#e05a00" stroke-width="3"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-family="Bangers,Impact,sans-serif" font-size="${r * .55}" fill="#c62828">${txt}</text>`;
};
const cone = (x, y) => `<path d="M${x - 9},${y} L${x},${y - 30} L${x + 9},${y} Z" fill="#f05a28"/><rect x="${x - 6}" y="${y - 20}" width="12" height="4" fill="#fff"/><rect x="${x - 12}" y="${y - 3}" width="24" height="4" fill="#333"/>`;
const barrier = (x, y, w) => `<g><rect x="${x}" y="${y - 34}" width="${w}" height="12" fill="#fff" stroke="#c62828"/>${Array.from({ length: Math.floor(w / 14) }, (_, i) => `<rect x="${x + i * 14}" y="${y - 34}" width="7" height="12" fill="#c62828"/>`).join('')}<rect x="${x + 4}" y="${y - 22}" width="4" height="22" fill="#555"/><rect x="${x + w - 8}" y="${y - 22}" width="4" height="22" fill="#555"/></g>`;
const pole = (x, y) => `<rect x="${x - 5}" y="${y - 190}" width="10" height="190" fill="#8b6b4a"/><rect x="${x - 30}" y="${y - 180}" width="60" height="6" fill="#6b4f35"/><path d="M0,${y - 176} Q${x / 2},${y - 160} ${x - 28},${y - 177} M${x + 28},${y - 177} Q${x + 80},${y - 160} 400,${y - 172}" stroke="#333" stroke-width="2" fill="none"/>`;
function pozzetto(x, y, o = {}) {
  const w = o.w || 90, mood = o.mood || 'hungry';
  const mouth = mood === 'sad' ? '' : mood === 'gnam' ? `<path d="M${x - 22},${y + 12} Q${x},${y + 32} ${x + 22},${y + 12} Z" fill="#7a0f0f"/><path d="M${x - 18},${y + 13} l5,6 l5,-6 l5,6 l5,-6 l5,6 l5,-6" stroke="#fff" stroke-width="2" fill="none"/>`
    : `<path d="M${x - 16},${y + 14} Q${x},${y + 24} ${x + 16},${y + 14}" stroke="#fff" stroke-width="2.5" fill="none"/>`;
  const eyes = mood === 'sad' ? '' : `<circle cx="${x - 14}" cy="${y + 6}" r="6" fill="#fff"/><circle cx="${x + 14}" cy="${y + 6}" r="6" fill="#fff"/><circle cx="${x - 12}" cy="${y + 7}" r="2.8" fill="#111"/><circle cx="${x + 16}" cy="${y + 7}" r="2.8" fill="#111"/>`;
  return `<rect x="${x - w / 2 - 6}" y="${y - 4}" width="${w + 12}" height="8" fill="#888"/><rect x="${x - w / 2}" y="${y}" width="${w}" height="34" fill="#1d1d1d"/>${eyes}${mouth}`;
}
const cover = (x, y, w) => `<rect x="${x - w / 2}" y="${y - 8}" width="${w}" height="10" rx="2" fill="#5b6770" stroke="#333"/>${Array.from({ length: 6 }, (_, i) => `<line x1="${x - w / 2 + 8 + i * (w - 16) / 5}" y1="${y - 7}" x2="${x - w / 2 + 8 + i * (w - 16) / 5}" y2="${y + 1}" stroke="#333"/>`).join('')}`;
const ple = (x, y) => `<rect x="${x - 50}" y="${y - 30}" width="100" height="24" rx="5" fill="#2e7dd7"/><circle cx="${x - 30}" cy="${y - 6}" r="9" fill="#333"/><circle cx="${x + 30}" cy="${y - 6}" r="9" fill="#333"/><line x1="${x}" y1="${y - 30}" x2="${x + 40}" y2="${y - 106}" stroke="#888" stroke-width="9"/><rect x="${x + 22}" y="${y - 136}" width="56" height="30" fill="none" stroke="#2e7dd7" stroke-width="4"/><line x1="${x + 22}" y1="${y - 120}" x2="${x + 78}" y2="${y - 120}" stroke="#2e7dd7" stroke-width="3"/>`;
const mapScroll = (x, y) => `<g transform="translate(${x},${y}) rotate(-8)"><rect x="0" y="0" width="74" height="54" fill="#fffbe6" stroke="#b9a35b" stroke-width="2"/><path d="M6,12 H66 M6,22 H50 M6,32 H62" stroke="#c62828" stroke-width="2.5"/><path d="M6,42 H60" stroke="#1565c0" stroke-width="2.5"/><path d="M40,6 V50" stroke="#f5b700" stroke-width="2.5" stroke-dasharray="4 3"/></g>`;
const pipe = (x1, x2, y, c = '#f5c400') => `<rect x="${x1}" y="${y - 7}" width="${x2 - x1}" height="14" rx="7" fill="${c}" stroke="#8a6d00"/>`;

/* ---------- vignetta: pannello SVG + fumetti HTML ---------- */
function panel(svg, bubbles = []) {
  return `<div class="pan"><svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice"><g transform="translate(0,60)">${svg}</g></svg>${bubbles.map(b =>
    `<div class="bub ${b.t || 'bl'}${b.shout ? ' shout' : ''}" style="left:${b.x}%;top:${b.y}%;width:${b.w || 44}%">${b.txt}</div>`).join('')}</div>`;
}
function strip(o) {
  return `<div class="kick">Vignetta formativa</div><h2 class="comic-title">${o.title}</h2>
   <div class="strip">${o.panels.join('')}</div>
   <div class="moral"><span>La regola</span>${o.moral}</div>`;
}


/* ---- oggetti per la scuola ---- */
const P = (x, y, o = {}) => worker(x, y, Object.assign({ helmet: false, stripes: false }, o));
const desk = (x, y, w = 150) => `<rect x="${x}" y="${y - 52}" width="${w}" height="12" rx="3" fill="#8d6e63"/><rect x="${x + 6}" y="${y - 40}" width="${w - 12}" height="40" fill="#a1887f"/><rect x="${x + 14}" y="${y - 32}" width="${w - 28}" height="4" fill="#795548"/>`;
const monitor = (x, y) => `<rect x="${x - 26}" y="${y - 40}" width="52" height="34" rx="3" fill="#263238"/><rect x="${x - 22}" y="${y - 36}" width="44" height="26" fill="#90caf9"/><rect x="${x - 4}" y="${y - 6}" width="8" height="6" fill="#455a64"/><rect x="${x - 14}" y="${y}" width="28" height="3" fill="#455a64"/>`;
const phone = (x, y) => `<rect x="${x - 14}" y="${y - 10}" width="28" height="10" rx="3" fill="#37474f"/><path d="M${x - 16},${y - 12} Q${x},${y - 22} ${x + 16},${y - 12}" stroke="#37474f" stroke-width="5" fill="none"/>`;
const box = (x, y, w = 50, h = 40) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="#c69c6d" stroke="#8d6e3f"/><path d="M${x - w / 2},${y - h + 10} H${x + w / 2} M${x},${y - h} V${y - h + 10}" stroke="#8d6e3f"/><text x="${x}" y="${y - 12}" text-anchor="middle" font-size="9" fill="#5d4037">25 kg</text>`;
const door = (x, y, o = {}) => `<rect x="${x - 34}" y="${y - 150}" width="68" height="150" fill="#e0e0e0" stroke="#9e9e9e"/><rect x="${x - 30}" y="${y - 146}" width="60" height="146" fill="${o.open ? '#fff8e1' : '#b0bec5'}"/><rect x="${x - 24}" y="${y - 72}" width="48" height="6" fill="#c62828"/><rect x="${x - 44}" y="${y - 182}" width="88" height="24" rx="3" fill="#2e7d32"/><text x="${x}" y="${y - 165}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">USCITA</text>`;
const wedge = (x, y) => `<path d="M${x - 12},${y} L${x + 12},${y} L${x + 12},${y - 12} Z" fill="#6d4c41"/>`;
const chairs = (x, y) => `<rect x="${x}" y="${y - 30}" width="30" height="6" fill="#455a64"/><rect x="${x + 2}" y="${y - 24}" width="4" height="24" fill="#455a64"/><rect x="${x + 24}" y="${y - 24}" width="4" height="24" fill="#455a64"/><rect x="${x + 24}" y="${y - 60}" width="6" height="34" fill="#455a64"/>`;
const ladder = (x, y) => `<path d="M${x - 20},${y} L${x - 4},${y - 150} M${x + 20},${y} L${x + 4},${y - 150}" stroke="#8d8d8d" stroke-width="5"/>${[1, 2, 3, 4, 5].map(i => `<line x1="${x - 20 + i * 2.7}" y1="${y - i * 25}" x2="${x + 20 - i * 2.7}" y2="${y - i * 25}" stroke="#8d8d8d" stroke-width="4"/>`).join('')}`;
const kids = (x, y, n = 3) => Array.from({ length: n }, (_, i) => P(x + i * 30, y, { s: .55, vest: ['#e53935', '#43a047', '#1e88e5', '#fdd835'][i % 4], hc: i % 2 ? '#3e2723' : '#a1887f', mood: 'happy' })).join('');
const floor = (y = 220) => `<rect x="0" y="${y}" width="400" height="${300 - y}" fill="#d7ccc8"/><rect x="0" y="${y}" width="400" height="4" fill="#a1887f"/>`;
const wall = (c = '#f3efe6') => `<rect y="-60" width="400" height="380" fill="${c}"/>`;
const STAFF = { vest: '#26a69a', hair: 'long', hc: '#4e342e' };   // l'addetta alla reception (preposta)

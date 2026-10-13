/* ================= Scenery ================= */
function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x | 0, y | 0, Math.max(1, w | 0), Math.max(1, h | 0)); }
function skyStops(alt) {
  const K = [[-18, '#05081a', '#0b1230', '#141c40'], [-10, '#0d1238', '#1c2152', '#3a2d64'], [-4, '#1c2260', '#3e3a7a', '#b4587c'], [0, '#344a8e', '#7a6aa0', '#f08a5a'],
    [5, '#4f86cc', '#8eb4dc', '#f6c896'], [15, '#3d86d8', '#7cb4e8', '#bfe0f4'], [40, '#2f7ad6', '#6aaee8', '#b4dcf6']];
  if (alt <= K[0][0]) return K[0].slice(1); if (alt >= K[K.length - 1][0]) return K[K.length - 1].slice(1);
  for (let i = 0; i < K.length - 1; i++) if (alt <= K[i + 1][0]) { const u = (alt - K[i][0]) / (K[i + 1][0] - K[i][0]); return [1, 2, 3].map(j => mixH(K[i][j], K[i + 1][j], u)); }
}
const SKYC = {};
function skyCanvas(hz, alt) { const key = hz + '|' + Math.round(alt); if (SKYC[key]) return SKYC[key]; const s = skyStops(Math.round(alt)); const P = Painter(W, H);
  vgrad(P, 0, 0, W, Math.round(hz * .55), [s[0], s[1]]); vgrad(P, 0, Math.round(hz * .55), W, hz - Math.round(hz * .55) + 1, [s[1], s[2]]); P.rect(0, hz, W, H - hz, s[2]); return SKYC[key] = P.flush(); }
const STARS = (() => { const r = rng(42), a = []; for (let i = 0; i < 150; i++) a.push([Math.floor(r() * W), Math.floor(r() * 120), r()]); return a; })();
/* clouds: pre-shaded, recoloured per sky bucket */
const CLOUDS = {};
function cloudSprite(seed, w, h, alt) { const key = seed + '|' + Math.round(alt / 2); if (CLOUDS[key]) return CLOUDS[key]; const s = skyStops(alt), r = rng(seed);
  const sunset = clamp(1 - Math.abs(alt - 1) / 7, 0, 1), night = clamp((-alt - 2) / 10, 0, 1);
  let base = mixH(mixH('#f6f6fa', s[1], .25), s[2], sunset * .55); base = mixH(base, mixH(s[0], '#7880a8', .35), night);
  const parts = []; const n = 5 + Math.floor(r() * 4); for (let i = 0; i < n; i++) { const cx = w * (.15 + .7 * r()), rr = h * (.25 + .3 * r()); parts.push(E(cx, h - rr - 1 - r() * h * .2, rr * (1.2 + r() * .6), rr, base, { dither: .22 })); }
  parts.push(E(w / 2, h - 3, w * .45, 2.6, base, { dither: .2 }));
  return CLOUDS[key] = raster(w, h, parts, { noOutline: true }).cv; }

function drawCelestial(g, env, hz, t, opt) {
  const sa = clamp((-env.alt - 2) / 10, 0, 1);
  if (sa > 0) for (const [sx, sy, b] of STARS) { if (sy > hz - 6) continue; const tw = .5 + .5 * Math.sin(t * 2 + b * 40); g.globalAlpha = sa * (.3 + .7 * tw * b); R(g, sx, sy, 1, 1, b > .9 ? '#ffe9c0' : '#ffffff'); if (b > .97) { g.globalAlpha *= .4; R(g, sx - 1, sy, 3, 1, '#ffffff'); R(g, sx, sy - 1, 1, 3, '#ffffff'); } }
  g.globalAlpha = 1;
  const hr = env.lp.hour;
  if (opt && opt.aurora && env.dark > .5) { const a = (env.dark - .5) * 2; for (let i = 0; i < W; i += 1) { const y0 = 10 + Math.sin(i / 29 + t * .25) * 10 + Math.sin(i / 9 + t * .6) * 3; const len = 18 + Math.sin(i / 13 + t * .4) * 10 + Math.sin(i / 5) * 3;
      for (let j = 0; j < len; j += 1) { g.globalAlpha = a * .28 * (1 - j / len) * (.6 + .4 * Math.sin(i / 3 + t)); R(g, i, y0 + j, 1, 1, j < 3 ? '#c8ffd8' : j < len * .6 ? '#4fe39a' : '#8a6ad8'); } } g.globalAlpha = 1; }
  const sx = ((hr - 6) / 12) * W, sy = hz - env.alt * (hz / 70);
  if (env.alt > -4 && sy < hz + 8) { const col = env.alt < 6 ? '#ffb35c' : '#fff3c4';
    for (const [r, a] of [[14, .08], [10, .14], [7, .3]]) { g.globalAlpha = a; for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy) * 2); R(g, sx - w / 2, sy + dy, w, 1, col); } }
    g.globalAlpha = 1; for (let dy = -5; dy <= 5; dy++) { const w = Math.round(Math.sqrt(25 - dy * dy) * 2); R(g, sx - w / 2, sy + dy, w, 1, dy < -2 ? '#fffbe8' : col); } }
  const transit = (12 + env.moon * 24.8) % 24; let dh = hr - transit; dh = ((dh + 12) % 24 + 24) % 24 - 12;
  const malt = 55 * Math.cos(dh / 12 * Math.PI) - 12;
  if (malt > 0 && env.alt < 3 && env.moon > .03 && env.moon < .97) { const mx = W / 2 + dh / 6 * W * .5, my = hz - malt * (hz / 75); const ill = env.moon < .5 ? env.moon * 2 : (1 - env.moon) * 2;
    g.globalAlpha = .12; for (let dy = -9; dy <= 9; dy++) { const w = Math.round(Math.sqrt(81 - dy * dy) * 2); R(g, mx - w / 2, my + dy, w, 1, '#dfe6ff'); } g.globalAlpha = 1;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { if (dx * dx + dy * dy > 17) continue; const nx = (dx + 4.5) / 9; const lit = env.moon < .5 ? nx > 1 - ill : nx < ill; if (lit) R(g, mx + dx, my + dy, 1, 1, (dx + dy) % 3 === 0 && Math.abs(dx) < 3 ? '#d8d2b8' : '#f4f0d8'); } }
}

/* ---------- SAVANNAH ---------- */
const SCN = {};
SCN.savannah = { hz: 112, clouds: [[11, 70, 22, 30, 3], [12, 56, 18, 150, 14], [13, 84, 26, 250, 6], [14, 40, 14, 330, 24]],
  season: m => (m >= 11 || m <= 5) ? 'wet' : 'dry',
  build(se) { const wet = se === 'wet'; const P = Painter(W, H), r = rng(7);
    // far hills
    for (let x = 0; x < W; x++) { const top = Math.round(99 + 5 * Math.sin(x / 41) + 3 * Math.sin(x / 13 + 1) + fbm(x / 9, 0, 2) * 3);
      for (let y = top; y < 113; y++) P.set(x, y, y === top ? '#c3b2c6' : ((y - top) / 10 > bay(x, y) ? '#8f7c9c' : '#a491b0')); }
    // kopje boulders
    for (const [cx, cy, rx, ry] of [[46, 108, 9, 6], [58, 106, 7, 7], [36, 111, 7, 4], [68, 110, 6, 4], [52, 102, 5, 4]]) paint(P, E(cx, cy, rx, ry, '#a99b94', { pat: pat.spots('#8a7c78', .08, 1, 4) }));
    paintLine(P, [[50, 104], [52, 110]], '#6e6264'); paintLine(P, [[60, 103], [61, 108]], '#6e6264');
    paint(P, E(57, 99, 4, 1.6, '#5d6b3a')); paintLine(P, [[57, 100], [57, 102]], '#4a3a2a');
    // plain
    vgrad(P, 0, 112, W, 68, wet ? ['#a9b062', '#98a252', '#829046', '#6c7a3a'] : ['#d6b46a', '#cca45a', '#be924a', '#a97e3a'], (x, y) => !P.has(x, y));
    // distant acacias
    for (const [x, y, s] of [[118, 112, 1], [178, 113, .8], [306, 111, 1.1], [96, 113, .7]]) { paintLine(P, [[x, y], [x, y - 6 * s]], '#4a3a2a'); paint(P, E(x, y - 7 * s, 7 * s, 1.8 * s, '#5d6b3a', { dither: .25 })); }
    // grass texture (perspective)
    for (let i = 0; i < 2600; i++) { const y = 113 + Math.floor(Math.pow(r(), .8) * 67), x = Math.floor(r() * W), k = (y - 112) / 68, len = 1 + Math.round(k * 4 * r()); const R5 = ramp(wet ? '#86a040' : '#c49a48');
      const lean = r() < .5 ? -1 : 1; for (let j = 0; j < len; j++) P.set(x + (j > len / 2 ? lean : 0), y - j, j === len - 1 ? R5[4] : R5[k > .5 ? 1 + (j % 2) : 2]); }
    // rocks
    for (const [x, y, rx] of [[118, 170, 4], [300, 160, 3], [12, 140, 3], [196, 172, 3]]) paint(P, E(x, y, rx, rx * .6, '#9a8e86'));
    // hyena den + termite mound + aardvark burrow
    paint(P, E(24, 165, 15, 6, '#8a6a46', { pat: pat.spots('#a4845a', .1, 1, 2) })); paint(P, E(26, 167, 5.5, 3, '#22160e', { flat: 1 }));
    paint(P, C(52, 161, 52, 140, 9, 3.4, '#a0623a', { pat: pat.spots('#8a5230', .12, 1, 3) })); paint(P, C(45, 160, 46, 147, 3.5, 2, '#a0623a')); paint(P, C(58, 160, 59, 150, 3, 1.6, '#985a34'));
    P.set(51, 146, '#3a2416'); P.set(53, 152, '#3a2416'); P.set(46, 152, '#3a2416'); paint(P, E(60, 171, 4, 2, '#3a2416', { flat: 1 }));
    // waterhole rim
    paint(P, E(150, 147, wet ? 40 : 34, 8, '#7a5a36', { pat: pat.spots('#5e4428', .15, 1, 6) }));
    // big acacia
    paint(P, E(262, 157, 26, 4, '#8f6c34', { flat: 1 }));
    for (const b of [[262, 156, 260, 118, 3.6, 2.4], [260, 121, 243, 97, 2.1, 1.1], [261, 119, 278, 95, 2.1, 1.1], [260, 128, 290, 104, 1.6, .9], [259, 125, 230, 104, 1.5, .9], [270, 106, 266, 94, 1, .7]]) paint(P, C(...b, '#5a3e2a', { pat: pat.stripes('#4a3020', 3, 1, 1.4) }));
    const leaf = (x, y, n) => { const v = fbm(x / 4, y / 3, 3); return v > .62 ? '#8aa84a' : v < .36 ? '#3f5a26' : null; };
    for (const [cx, cy, rx, ry] of [[250, 94, 19, 5.2], [277, 92, 17, 5], [236, 99, 10, 4], [293, 98, 10, 3.6], [263, 89, 13, 4.2], [228, 96, 6, 2.5]]) paint(P, E(cx, cy, rx, ry, '#5f7a32', { pat: leaf, flatness: .7 }));
    return { back: P.flush() }; },
  anim(f, t, env, sky) { // waterhole reflecting the sky
    const wr = this._se === 'wet' ? 36 : 30; for (let dy = -5; dy <= 5; dy++) { const w = Math.round(Math.sqrt(1 - (dy / 5.6) ** 2) * wr) * 2; R(f, 150 - w / 2, 147 + dy, w, 1, mixH(sky[dy < 0 ? 1 : 2], '#2a3a4a', .35 + dy * .02)); }
    for (let i = 0; i < 6; i++) { const x = 130 + ((i * 11 + t * 4) % 40), y = 144 + (i % 4) * 2; R(f, x, y, 3, 1, mixH(sky[2], '#ffffff', .3)); }
    // acacia shade
    if (env.alt > 0) { f.globalAlpha = .22 * clamp(env.alt / 10, 0, 1); for (let dy = -3; dy <= 3; dy++) { const w = Math.round(Math.sqrt(1 - (dy / 3.4) ** 2) * 28) * 2; R(f, 262 - w / 2 - (env.lp.hour - 12) * 2, 156 + dy, w, 1, '#3a2410'); } f.globalAlpha = 1; } },
  front(f, t) { const wet = this._se === 'wet', c1 = wet ? '#b8d070' : '#e8cc84', c2 = wet ? '#7a9a3a' : '#c49a48', c3 = wet ? '#4f6a2a' : '#8f6c2c'; for (let i = 0; i < 70; i++) { const x = (i * 23.7) % W, h = 5 + (i * 7) % 7, sw = Math.sin(t * 1.3 + i * .7) * 1.2; for (let j = 0; j < h; j++) R(f, x + Math.round(sw * j / h), 180 - j, 1, 1, j === h - 1 ? c1 : j > h / 2 ? c2 : c3); } }
};

/* ---------- ARCTIC ---------- */
SCN.arctic = { hz: 104, clouds: [[21, 90, 12, 60, 2], [22, 70, 10, 230, 4]],
  season: m => (m >= 6 && m <= 9) ? 'summer' : 'winter',
  build(se) { const P = Painter(W, H), r = rng(3), summer = se === 'summer';
    const range = (peaks, base, lit, shade, rock, rockLit, snowTop, seed) => { const top = new Array(W);
      for (let x = 0; x < W; x++) { let best = 999, bi = 0; peaks.forEach((p, i) => { const h = p[1] + Math.abs(x - p[0]) * p[2]; if (h < best) { best = h; bi = i; } }); best += fbm(x / 6, seed, 3) * 4 - 2; top[x] = [Math.round(best), bi]; }
      for (let x = 0; x < W; x++) { const [ty, bi] = top[x], pk = peaks[bi];
        for (let y = Math.max(0, ty); y < base; y++) { const litSide = x < pk[0] + (y - pk[1]) * .35 + (fbm(x / 5, y / 5, seed + 1) - .5) * 8;
          const isRock = fbm(x / 7, y / 3, seed + 2) > (summer ? .44 : .6) - (y - ty) * (summer ? .012 : .004) && y - ty > 2; let c = litSide ? lit : shade; if (isRock) c = litSide ? rockLit : rock; if (y === ty) c = snowTop;
          P.set(x, y, c); } } };
    range([[30, 72, .55], [96, 64, .6], [170, 76, .5], [250, 66, .55], [318, 74, .6]], 104, '#c9d2e6', '#a3aecb', '#7a8098', '#8e95ac', '#e6ecf6', 1);
    range([[-10, 70, .7], [58, 82, .7], [140, 86, .8], [206, 74, .65], [300, 86, .7]], 104, '#f2f5fb', '#aab6d2', '#4f5468', '#6e7488', '#ffffff', 5);
    // glacier tongue
    for (let y = 84; y < 106; y++) { const half = 10 + (y - 84) * 1.3; for (let x = Math.round(214 - half); x < 214 + half; x++) { P.set(x, y, (bay(x, y) < .2 && (x + y) % 5 === 0) ? '#b8cce4' : '#e8f0fa'); } }
    for (let i = 0; i < 9; i++) { const x = 200 + i * 3.4, y = 92 + (i % 3) * 3; paintLine(P, [[x, y], [x + 2, y + 2]], '#8fb2d4'); }
    for (let x = 186; x < 243; x++) for (let y = 101; y < 106; y++) P.set(x, y, y === 101 ? '#ffffff' : (hash(x, 0, 4) < .25 && y > 102) ? '#7fb0d8' : '#a8d0ec');
    // ice floes (on the sea)
    for (const [x, y, w] of (summer ? [[188, 111, 30]] : [[188, 111, 30], [96, 109, 16], [262, 108, 12], [30, 114, 20], [140, 118, 10]])) { for (let k = 0; k < w; k++) { P.set(x + k, y, '#ffffff'); P.set(x + k, y + 1, '#e2ecf8'); P.set(x + k, y + 2, k % 4 ? '#8fb6d8' : '#6a96c4'); } }
    // snowfield
    for (let x = 0; x < W; x++) { const ty = 122 + Math.round(2 * Math.sin(x / 17) + Math.sin(x / 5)); P.set(x, ty, '#ffffff'); P.set(x, ty + 1, '#9fbcdc');
      vgrad(P, x, ty + 2, 1, H - ty - 2, summer ? ['#8a8668', '#7a7a58', '#6a6a4a', '#5c5a40'] : ['#f4f7fc', '#e4ebf6', '#d6dff0', '#cbd5ea']); }
    if (summer) { for (let i = 0; i < 900; i++) { const x = r() * W, y = 124 + r() * 56; P.set(x, y, ['#a8a070', '#6a8a4a', '#d8d0b8', '#4a5a3a', '#c8a0c8'][Math.floor(r() * 5)]); } for (const [x, y, rx] of [[60, 150, 16], [240, 166, 22], [180, 134, 10]]) paint(P, E(x, y, rx, 2.4, '#eef2fa', { flat: 1 })); }
    for (let i = 0; i < (summer ? 0 : 9); i++) { const y0 = 132 + i * 5.5; for (let x = 0; x < W; x++) { const y = Math.round(y0 + 3 * Math.sin(x / (18 + i * 3) + i)); if (fbm(x / 20, i, 9) > .48) { P.set(x, y, '#ffffff'); P.set(x, y + 1, '#c4d0e6'); } } }
    for (const [x, y, rx] of [[150, 150, 5], [300, 168, 6], [18, 160, 4]]) { paint(P, E(x, y, rx, rx * .55, '#4f5468')); for (let k = -rx + 1; k < rx; k++) P.set(x + k, Math.round(y - rx * .55 * Math.sqrt(1 - (k / rx) ** 2)), '#ffffff'); }
    for (let i = 0; i < 16; i++) { const x = 40 + i * 9, y = 168 - i * 1.6 + (i % 2) * 2; P.set(x, y, '#b6c4dc'); P.set(x + 1, y, '#b6c4dc'); P.set(x, y + 1, '#c8d4e8'); }
    // trapper's hut
    const hx = 22, hy = 119; for (let y = hy - 9; y < hy; y++) for (let x = hx - 9; x < hx + 9; x++) P.set(x, y, (y - hy) % 3 === 0 ? '#4e3424' : (x < hx - 6 ? '#6a4a32' : '#5a3e2a'));
    for (let k = 0; k < 13; k++) for (let x = hx - 12 + k; x < hx + 12 - k; x++) P.set(x, hy - 10 - k * .6 | 0, summer ? (k < 2 ? '#3a3e4a' : '#4e5262') : (k < 2 ? '#c8d4e8' : '#f6f8fc'));
    P.rect(hx + 2, hy - 6, 3, 6, '#2a1c14'); P.rect(hx - 6, hy - 7, 4, 3, '#1a1c2c'); P.rect(hx + 6, hy - 18, 2, 4, '#3a2a20');
    return { back: P.flush() }; },
  anim(f, t, env, sky) { const a = clamp(env.alt, -20, 30);
    for (let y = 104; y < 122; y++) { const u = (y - 104) / 18; const c = mixH(mixH(sky[2], sky[1], .4), '#14304e', .35 + u * .45); for (let x = 0; x < W; x += 8) R(f, x, y, 8, 1, ((x / 8 + y) % 2 && u > .2) ? mixH(c, '#0c2038', .2) : c); }
    for (let i = 0; i < 22; i++) { const x = (i * 37 + t * 3) % W, y = 106 + (i * 7) % 15; R(f, x, y, 3 + i % 4, 1, mixH(sky[2], '#ffffff', .25)); }
    if (env.alt > -2) { const sx = ((env.lp.hour - 6) / 12) * W; for (let y = 105; y < 122; y += 1) { if ((y + Math.floor(t * 4)) % 2) continue; const w = 2 + (y - 104) / 3; f.globalAlpha = .6; R(f, sx - w / 2 + Math.sin(y + t * 3) * 2, y, w, 1, '#ffe2a8'); } f.globalAlpha = 1; } },
  post(g, t, env) { if (env.dark > .45) { g.globalAlpha = .9; R(g, 16, 112, 4, 3, '#ffcf6a'); g.globalAlpha = .2; R(g, 13, 109, 10, 9, '#ffcf6a'); g.globalAlpha = 1; for (let i = 0; i < 4; i++) { const p = (t * .4 + i * .25) % 1; g.globalAlpha = .3 * (1 - p); R(g, 29 + Math.sin(p * 6 + i) * 2, 99 - p * 18, 2, 2, '#c8ccd8'); } g.globalAlpha = 1; } }
};

/* ---------- RAINFOREST ---------- */
SCN.rainforest = { hz: 70, clouds: [[31, 50, 12, 150, 2]],
  season: m => (m >= 4 && m <= 7) ? 'flood' : 'normal',
  build() { const P = Painter(W, H), r = rng(11);
    // far misty canopy
    for (let i = 0; i < 70; i++) { const x = r() * W, y = 52 + r() * 26, rr = 7 + r() * 9; paint(P, E(x, y, rr, rr * .7, mixH('#6f9a88', '#9ec2b0', r() * .4), { dither: .25, max: 3 })); }
    vgrad(P, 0, 60, W, 120, ['#5f8a76', '#3f6a54', '#24402f', '#1a2e22'], (x, y) => !P.has(x, y));
    // mid trees
    for (const x of [72, 128, 206, 246, 304]) { paint(P, C(x, 52, x + 2, 178, 2.6, 3.4, '#3e4a3a', { dim: 1 })); for (let k = 0; k < 5; k++) paint(P, E(x + (r() - .5) * 26, 46 + r() * 16, 10 + r() * 6, 6 + r() * 3, '#2f5c40', { dim: 1, pat: (xx, yy) => fbm(xx / 3, yy / 3, 4) > .6 ? '#3f7a52' : null })); }
    // vines
    for (const vx of [92, 116, 196, 228, 300]) { let x = vx; for (let y = 0; y < 100 + (vx % 40); y++) { x += Math.sin(y / 11 + vx) * .35; P.set(x, y, y % 9 === 0 ? '#5fae5a' : '#2f6a3a'); if (y % 13 === 0) { P.set(x + 1, y, '#4f9a4a'); P.set(x + 2, y + 1, '#4f9a4a'); } } }
    // big trunks
    const bark = (x, y) => { const v = fbm(x / 1.5, y / 9, 8); return v > .64 ? '#7a5a40' : v < .34 ? '#3a2618' : null; };
    const moss = (x, y) => fbm(x / 3, y / 4, 12) > .66 ? '#5a8a3a' : null;
    for (const [x, w] of [[34, 8], [164, 9], [282, 7]]) { paint(P, C(x, -4, x + 1, 176, w, w + 1.5, '#5a4030', { pat: pat.any(moss, bark) })); paint(P, Pg([[x - w - 12, 178], [x - w + 1, 150], [x, 178]], '#5a4030', { pat: bark })); paint(P, Pg([[x + w + 12, 178], [x + w - 1, 152], [x, 178]], '#4e3628', { pat: bark })); }
    paint(P, E(34, 113, 4.4, 6.6, '#1a100a', { flat: 1 })); paint(P, E(34, 114, 3.6, 5.6, '#0e0806', { flat: 1 }));
    // branches with moss and bromeliads
    const brs = [[42, 58, 142, 56, 3.4, 2.6], [172, 96, 276, 94, 3.6, 2.8], [42, 132, 152, 130, 3.4, 2.6]];
    for (const b of brs) { paint(P, C(...b, '#5e3e28', { pat: bark })); for (let x = b[0]; x < b[2]; x++) { const y = Math.round(b[1] + (b[3] - b[1]) * (x - b[0]) / (b[2] - b[0]) - b[4]); if (fbm(x / 4, b[1], 5) > .48) { P.set(x, y, '#6aaa4a'); P.set(x, y - 1, hash(x, y) > .6 ? '#8ac85a' : null); } } }
    const brom = (x, y, c) => { for (const [dx, dy] of [[-3, -2], [-2, -3], [-1, -4], [0, -5], [1, -4], [2, -3], [3, -2]]) paintLine(P, [[x, y], [x + dx, y + dy]], '#3f8a4a'); paintLine(P, [[x, y], [x, y - 4]], c); P.set(x, y - 5, c); };
    brom(60, 54, '#e04a3a'); brom(250, 91, '#e84a8a'); brom(130, 128, '#f0a030'); brom(196, 92, '#e04a3a');
    // big leaves
    const bigLeaf = (x, y, rx, ry, rot, c) => { paint(P, E(x, y, rx, ry, c, { rot, pat: (xx, yy) => fbm(xx / 2, yy / 2, 6) > .68 ? '#5cbf6a' : null })); const cs = Math.cos(rot), sn = Math.sin(rot); paintLine(P, [[x - cs * rx * .9, y - sn * rx * .9], [x + cs * rx * .9, y + sn * rx * .9]], '#7ad07a'); };
    for (let i = 0; i < 26; i++) { const left = i < 13, x = left ? r() * 110 : 210 + r() * 110, y = r() * 26; bigLeaf(x, y, 9 + r() * 6, 3.4 + r() * 1.5, (r() - .5) * 1.4, r() < .5 ? '#2f7a45' : '#3f9a55'); }
    for (let i = 0; i < 10; i++) bigLeaf(140 + r() * 70, -2 + r() * 8, 8, 3, (r() - .5), '#2f7a45');
    for (let i = 0; i < 14; i++) { const x = r() * W, y = 60 + r() * 90; if (Math.abs(x - 164) < 14) continue; bigLeaf(x, y, 6 + r() * 4, 2.4, (r() - .5) * 1.6, '#2e6e40'); }
    // frog leaf
    paint(P, C(232, 176, 226, 142, 1, .8, '#3b7a3e')); bigLeaf(226, 141, 15, 3.4, -.08, '#4aa85a');
    // heliconia
    for (let k = 0; k < 5; k++) { const x = 300 - k * 3, y = 150 + k * 4; paint(P, Pg([[x, y], [x + 7, y - 2], [x + 1, y + 2]], '#e0402e')); P.set(x + 6, y - 2, '#f2c12e'); } paintLine(P, [[298, 148], [294, 178]], '#3b7a3e');
    // floor
    vgrad(P, 0, 166, W, 14, ['#3a2a1c', '#2a1c12'], (x, y) => !P.has(x, y) || y > 170);
    for (let i = 0; i < 260; i++) { const x = r() * W, y = 166 + r() * 14; P.set(x, y, ['#8a5a2a', '#a8742e', '#5a3a1e', '#6a8a3a'][Math.floor(r() * 4)]); }
    for (const fx of [12, 70, 118, 196, 252, 316]) for (let k = -4; k <= 4; k++) paintLine(P, [[fx, 178], [fx + k * 2.2, 168 + Math.abs(k) * 1.4]], k % 2 ? '#3f8a46' : '#5aaa52');
    paint(P, C(80, 174, 140, 172, 3, 3.4, '#5a3e2a', { pat: moss }));
    return { back: P.flush() }; },
  anim(f, t, env) { if (env.alt > 10) { f.globalAlpha = .07; for (let k = 0; k < 4; k++) { const bx = 120 + k * 26 + Math.sin(t * .2 + k) * 4; for (let y = 0; y < 170; y += 1) R(f, bx + y * .35, y, 7, 1, '#fff6c8'); } f.globalAlpha = 1; }
    f.globalAlpha = .1; for (let k = 0; k < 3; k++) { const y = 74 + k * 9, x = (t * (2 + k) + k * 90) % (W + 120) - 120; R(f, x, y, 140, 5, '#dfeee6'); R(f, x + 20, y - 2, 90, 2, '#dfeee6'); } f.globalAlpha = 1; },
  front(f, t, env, sky) { if (this._se === 'flood') { for (let y = 158; y < H; y++) { const u = (y - 158) / 22; f.globalAlpha = .82; R(f, 0, y, W, 1, mixH('#3a5a4a', '#1e3328', u)); if ((y + Math.floor(t * 2)) % 4 === 0) { f.globalAlpha = .35; for (let x = (y * 7) % 13; x < W; x += 13) R(f, x + Math.sin(t + y) * 2, y, 5, 1, '#8ab0a0'); } } f.globalAlpha = 1; }
    const r = rng(5); for (let i = 0; i < 8; i++) { const left = i < 4, x = left ? -4 + r() * 20 : W - 18 + r() * 20, y = 120 + r() * 60, sw = Math.sin(t * .8 + i) * 1;
      f.fillStyle = i % 2 ? '#1e4a2e' : '#245a36'; for (let k = 0; k < 18; k++) R(f, x + (left ? k : -k) * .9 + sw, y - k * .5, 3, 2, f.fillStyle); } },
  post(g, t, env) { if (env.dark > .55) for (let i = 0; i < 22; i++) { const fx = (i * 53 + Math.sin(t * .7 + i) * 20) % W, fy = 70 + ((i * 37) % 90) + Math.sin(t * 1.3 + i * 2) * 6; if (Math.sin(t * 3 + i * 1.7) > .2) { g.globalAlpha = .9; R(g, fx, fy, 1, 1, '#f8f08a'); g.globalAlpha = .22; R(g, fx - 1, fy - 1, 3, 3, '#f8f08a'); } } g.globalAlpha = 1; }
};

/* ---------- REEF ---------- */
const WATERC = {};
SCN.reef = { hz: 0, water: true,
  build() { const P = Painter(W, H), F = Painter(W, H), r = rng(21);
    for (let i = 0; i < 40; i++) { const x = r() * W, y = 126 + r() * 22, rr = 6 + r() * 12; paint(F, E(x, y, rr, rr * .6, '#56607e', { dither: .25 })); }
    vgrad(P, 0, 150, W, 30, ['#e6d29a', '#d8c088', '#c8ac72']);
    for (let i = 0; i < 9; i++) { const y0 = 154 + i * 3; for (let x = 0; x < W; x++) { const y = Math.round(y0 + Math.sin(x / 7 + i * 1.7) * 1.2); if ((x + i) % 3) { P.set(x, y, '#f2e4b4'); P.set(x, y + 1, '#b89c62'); } } }
    for (let i = 0; i < 30; i++) P.set(r() * W, 152 + r() * 27, ['#f6eee0', '#e8a888', '#9a8a70'][i % 3]);
    const enc = (x, y) => { const v = hash(Math.floor(x / 2), Math.floor(y / 2), 31); return v < .025 ? '#e87a8a' : v < .045 ? '#f0b040' : v < .07 ? '#8ac86a' : v < .2 ? '#56486a' : null; };
    for (const [cx, cy, rx, ry] of [[14, 120, 22, 22], [40, 136, 22, 16], [8, 150, 18, 12], [58, 148, 14, 8], [26, 104, 12, 10]]) paint(P, E(cx, cy, rx, ry, '#6a5a7a', { pat: enc }));
    paint(P, E(26, 130, 8, 3.4, '#1a1426', { flat: 1 })); paint(P, E(14, 155, 6, 3, '#1a1426', { flat: 1 }));
    for (const [cx, cy, rx, ry] of [[300, 128, 28, 26], [276, 146, 24, 12], [316, 158, 14, 12]]) paint(P, E(cx, cy, rx, ry, '#6a5a7a', { pat: enc }));
    paint(P, E(284, 152, 17, 6, '#140f20', { flat: 1 }));
    // brain coral
    paint(P, E(118, 150, 11, 7, '#a8b46a', { pat: pat.stripes('#6a7a44', 2.4, .9, .8, 2.2) }));
    // table coral
    paint(P, C(206, 151, 206, 132, 2.4, 1.8, '#b098c0')); paint(P, E(206, 129, 20, 3.4, '#b8a0c8', { pat: pat.spots('#e2d0ee', .2, 1, 4) }));
    // staghorn
    const stag = (x, y, c, s) => { const rr = rng(x); const grow = (x0, y0, a, len, d) => { const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len; paint(P, C(x0, y0, x1, y1, 1.6 * s, 1.2 * s, c)); P.set(x1, y1, '#fff0e0'); if (d > 0) { grow(x1, y1, a - .5 + rr() * .2, len * .75, d - 1); grow(x1, y1, a + .5 - rr() * .2, len * .75, d - 1); } }; grow(x, y, -Math.PI / 2, 9 * s, 3); };
    stag(160, 152, '#e0743a', 1); stag(240, 152, '#e8c34a', .8); stag(96, 152, '#c86a9a', .7); stag(48, 122, '#e0743a', .6);
    // sea fan
    for (let k = -6; k <= 6; k++) { let x = 140, y = 151; for (let s = 0; s < 18; s++) { x += k * .18 + Math.sin(s + k) * .2; y -= 1; P.set(x, y, '#9a4ab8'); if (s % 4 === 0) P.set(x + 1, y, '#c07ad8'); } }
    // tube sponges
    for (const [x, h, c] of [[184, 14, '#d8a040'], [190, 10, '#c88a30'], [256, 12, '#8a6ad0']]) { paint(P, C(x, 152, x, 152 - h, 2.6, 2.4, c)); paint(P, E(x, 152 - h, 2, 1, '#2a1a10', { flat: 1 })); }
    // anemone base
    paint(P, E(78, 150, 7, 2.6, '#c06a50'));
    return { back: P.flush(), far: F.flush() }; },
  anim(f, t, env, sky) { const L = clamp((env.alt + 6) / 24, 0, 1);
    const far = this._far; if (far) { f.drawImage(far, 0, 0); f.globalCompositeOperation = 'source-atop'; f.globalAlpha = .6; R(f, 0, 0, W, H, mixH('#0e2a50', '#3aa0c8', L)); f.globalAlpha = 1; f.globalCompositeOperation = 'source-over'; }
  },
  anim2(f, t, env) { const L = clamp((env.alt + 6) / 24, 0, 1);
    // caustics on sand
    if (L > .2) { f.fillStyle = '#fff6d0'; f.globalAlpha = (L - .2) * .55; for (let y = 151; y < 180; y++) for (let x = 0; x < W; x++) { const v = Math.sin(x * .21 + t * 1.1 + Math.sin(y * .33 + t * .7) * 1.4) + Math.sin(y * .29 - t * .9 + Math.sin(x * .13 - t * .5) * 1.6); if (Math.abs(v) < .16) f.fillRect(x, y, 1, 1); } f.globalAlpha = 1; }
    // anemone tentacles
    for (let i = 0; i < 16; i++) { const a = -Math.PI + (i / 15) * Math.PI, sw = Math.sin(t * 1.4 + i * .6) * 1.6; let x = 78 + Math.cos(a) * 5, y = 149; for (let s = 0; s < 8; s++) { x += Math.cos(a) * .5 + sw * .12; y -= .9; R(f, x, y, 1, 1, s > 6 ? '#fff0f6' : s > 4 ? '#f2b8d8' : '#d888b0'); } }
    for (const [sx, n] of [[106, 6], [196, 5], [228, 4], [66, 3]]) for (let k = 0; k < n; k++) { const bx = sx + k * 2; for (let y = 0; y < 12 + k % 3 * 3; y++) R(f, bx + Math.round(Math.sin(t + y / 3 + k) * y / 6), 152 - y, 1, 1, y % 4 ? '#4f9a4a' : '#6ab85a'); }
  },
  post(g, t, env) { const L = clamp((env.alt + 6) / 24, 0, 1);
    if (L > .25) { g.globalAlpha = (L - .25) * .22; for (let k = 0; k < 6; k++) { const bx = ((k * 61 + t * 5) % (W + 80)) - 40; for (let y = 0; y < 150; y++) R(g, bx + y * .3, y, Math.max(1, 7 - y / 26), 1, '#e8fbff'); } g.globalAlpha = 1; }
    for (let i = 0; i < W; i += 4) R(g, i, Math.sin(i / 9 + t * 2) > 0 ? 0 : 1, 3, 1, L > .3 ? '#d4f6ff' : '#2a4a7a');
    for (let i = 0; i < 10; i++) { const p = (t * .25 + i * .13) % 1, x = 78 + (i % 3) * 60 + Math.sin(p * 20 + i) * 2, y = 150 - p * 150; g.globalAlpha = .5; R(g, x, y, 1, 1, '#e8fbff'); R(g, x + 1, y - 1, 1, 1, '#e8fbff'); } g.globalAlpha = 1;
    if (env.dark > .5) { const rr = rng(Math.floor(t * 3)); for (let i = 0; i < 26; i++) { g.globalAlpha = (env.dark - .5) * 1.6 * rr(); R(g, rr() * W, 20 + rr() * 130, 1, 1, '#7fe3f0'); } g.globalAlpha = 1; } }
};

/* ---------- DEEP SEA ---------- */
SCN.deep = { hz: 0, water: true,
  build() { const P = Painter(W, H), r = rng(41);
    const strata = (x, y) => { const v = Math.sin(y * .35 + fbm(x / 8, y / 8, 3) * 3); return v > .6 ? '#2a3046' : v < -.5 ? '#161a28' : null; };
    for (let y = 30; y < H; y++) { const edge = 238 - (y - 30) * .32 + fbm(0, y / 6, 2) * 14; for (let x = Math.round(edge); x < W; x++) { const c = strata(x, y) || '#1e2234'; P.set(x, y, x - edge < 2 ? '#3a4260' : c); } }
    for (let y = 120; y < H; y++) { const edge = 26 + (y - 120) * .3 - fbm(0, y / 5, 7) * 8; for (let x = 0; x < edge; x++) P.set(x, y, x > edge - 2 ? '#343c58' : (strata(x, y) || '#1c2032')); }
    vgrad(P, 0, 170, W, 10, ['#232838', '#181c28'], (x, y) => !P.has(x, y));
    for (let i = 0; i < 120; i++) P.set(r() * W, 170 + r() * 10, '#2e3448');
    // whale fall
    paint(P, E(98, 168, 9, 4.4, '#c8c0a8', { pat: pat.spots('#e8e0c8', .2, 1, 3) })); paint(P, E(104, 171, 5, 1.6, '#a89c84'));
    for (let i = 0; i < 12; i++) { const x = 110 + i * 4.2; paint(P, E(x, 170, 1.8, 1.6, '#cfc7b0')); if (i > 1 && i < 9) paintLine(P, [[x, 169], [x - 2, 160 - Math.sin(i / 3) * 4], [x - 4, 164]], '#bdb59c'); }
    for (let i = 0; i < 40; i++) { const x = 92 + r() * 64, y = 165 + r() * 7; P.set(x, y, r() < .5 ? '#e8e0c8' : r() < .5 ? '#d88a4a' : '#d84a4a'); }
    // bamboo coral & sea pens on the wall
    const bamboo = (x, y, h) => { let px = x; for (let s = 0; s < h; s++) { px += Math.sin(s / 4 + x) * .3; P.set(px, y - s, s % 4 === 0 ? '#c8a040' : '#e0e4ea'); if (s > h / 2 && s % 5 === 0) { paintLine(P, [[px, y - s], [px + 3, y - s - 4]], '#e0e4ea'); } } };
    bamboo(262, 112, 18); bamboo(286, 90, 14); bamboo(250, 150, 16); bamboo(20, 140, 12);
    for (const [x, y] of [[200, 170], [214, 172], [60, 172]]) { paintLine(P, [[x, y], [x, y - 7]], '#e8a0b8'); for (let k = 1; k < 6; k++) { P.set(x - 1, y - k - 1, '#f0b8c8'); P.set(x + 1, y - k - 1, '#f0b8c8'); } }
    for (const [x, y] of [[150, 175], [180, 173], [40, 176]]) for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; paintLine(P, [[x, y], [x + Math.cos(a) * 3, y + Math.sin(a) * 1.5]], '#c86a5a'); }
    return { back: P.flush() }; },
  post(g, t) { for (let i = 0; i < 80; i++) { const mx = (i * 47.3) % W, my = ((i * 29.1) + t * 3 * (.5 + (i % 5) / 10)) % H; g.globalAlpha = .3 + (i % 3) * .1; R(g, mx + Math.sin(t + i) * 1.5, my, 1, 1, '#d8e4f0'); } g.globalAlpha = 1; }
};
function waterCanvas(kind, L) { const key = kind + Math.round(L * 24); if (WATERC[key]) return WATERC[key]; const P = Painter(W, H);
  if (kind === 'reef') vgrad(P, 0, 0, W, H, [mixH('#0b1c3c', '#6ad2e8', L), mixH('#081634', '#3aa6d0', L), mixH('#050c20', '#1a6a9c', L), mixH('#040a18', '#14507c', L)]);
  else vgrad(P, 0, 0, W, H, [mixH('#0a1430', '#2a6aa0', L), mixH('#060c22', '#0e2a4e', L), '#03060f', '#020409']);
  return WATERC[key] = P.flush(); }

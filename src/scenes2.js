/* ================= More scenery: London, Antarctica, Sahara; weather ================= */
function mountainRange(P, peaks, base, lit, shade, rock, rockLit, snowTop, seed, rockT) {
  const top = new Array(W);
  for (let x = 0; x < W; x++) { let best = 999, bi = 0; peaks.forEach((p, i) => { const h = p[1] + Math.abs(x - p[0]) * p[2]; if (h < best) { best = h; bi = i; } }); best += fbm(x / 6, seed, 3) * 4 - 2; top[x] = [Math.round(best), bi]; }
  for (let x = 0; x < W; x++) { const [ty, bi] = top[x], pk = peaks[bi];
    for (let y = Math.max(0, ty); y < base; y++) { const litSide = x < pk[0] + (y - pk[1]) * .35 + (fbm(x / 5, y / 5, seed + 1) - .5) * 8;
      const isRock = fbm(x / 7, y / 3, seed + 2) > (rockT ?? .6) - (y - ty) * .004 && y - ty > 2; let c = litSide ? lit : shade; if (isRock) c = litSide ? rockLit : rock; if (y === ty) c = snowTop; P.set(x, y, c); } }
}

/* ---------- LONDON ---------- */
const LONDON_WINDOWS = [];
SCN.london = { hz: 100, clouds: [[51, 80, 16, 40, 6], [52, 64, 14, 200, 16], [53, 90, 18, 300, 10]],
  season: m => m === 12 || m <= 2 ? 'winter' : m <= 4 ? 'spring' : m <= 9 ? 'summer' : 'autumn',
  build(se) { const P = Painter(W, H), r = rng(61); LONDON_WINDOWS.length = 0;
    // far skyline
    let x = 0; while (x < W) { const w = 6 + Math.floor(r() * 14), h = 14 + Math.floor(r() * 26); for (let yy = 100 - h; yy < 100; yy++) for (let xx = x; xx < x + w; xx++) P.set(xx, yy, xx === x ? '#7a80a0' : '#666c8c');
      for (let yy = 100 - h + 3; yy < 98; yy += 4) for (let xx = x + 2; xx < x + w - 1; xx += 3) if (r() < .5) LONDON_WINDOWS.push([xx, yy, 1, r()]); x += w + Math.floor(r() * 3); }
    for (let yy = 18; yy < 100; yy++) { const half = (yy - 18) * .14; for (let xx = Math.round(236 - half); xx <= Math.round(236 + half); xx++) P.set(xx, yy, xx < 236 ? '#9aa4c4' : '#6e7898'); }
    for (let yy = 24; yy < 96; yy += 5) LONDON_WINDOWS.push([236, yy, 1, r()]);
    paint(P, E(96, 72, 9, 9, '#8a90a8', { clip: (xx, yy) => yy < 72 })); P.rect(86, 72, 21, 12, '#767c98'); paintLine(P, [[96, 60], [96, 63]], '#9aa0b8'); P.rect(95, 62, 3, 2, '#9aa0b8');
    paintLine(P, [[160, 100], [160, 36], [192, 36]], '#c8a050'); paintLine(P, [[160, 40], [176, 36]], '#c8a050'); paintLine(P, [[190, 36], [190, 52]], '#8a8070');
    // terraced houses
    const doors = ['#b8302a', '#2a4a8a', '#2a6a4a', '#1a1a20', '#d8b040'];
    for (let i = 0; i < 5; i++) { const hx = i * 40, top = 72;
      for (let yy = top; yy < 132; yy++) for (let xx = hx; xx < hx + 40; xx++) { const brick = (yy % 3 === 0) || ((xx + (Math.floor(yy / 3) % 2) * 3) % 6 === 0); P.set(xx, yy, xx === hx ? '#5a2a20' : brick ? '#7a3a2c' : (hash(xx, yy, i) < .1 ? '#a05a44' : '#8c4a38')); }
      for (let k = 0; k < 10; k++) for (let xx = hx + k; xx < hx + 40 - k; xx++) P.set(xx, top - k, k === 0 ? '#3a3e48' : (xx % 3 ? '#4a4e5a' : '#565a66'));
      P.rect(hx + 28, top - 16, 6, 10, '#7a3a2c'); P.rect(hx + 28, top - 17, 6, 1, '#5a2a20'); P.rect(hx + 29, top - 19, 2, 2, '#c86a3a'); P.rect(hx + 32, top - 19, 2, 2, '#c86a3a');
      for (const [wx, wy] of [[hx + 6, top + 6], [hx + 22, top + 6], [hx + 6, top + 28], [hx + 22, top + 28]]) { P.rect(wx - 1, wy - 1, 11, 15, '#e8e4dc'); P.rect(wx, wy, 9, 13, '#34404e'); P.rect(wx, wy + 6, 9, 1, '#e8e4dc'); P.rect(wx + 4, wy, 1, 13, '#e8e4dc'); P.rect(wx - 2, wy + 13, 13, 2, '#d8d4cc');
        if (wx > hx + 10 && wy > top + 10) continue; LONDON_WINDOWS.push([wx, wy, 2, r()]); }
      P.rect(hx + 22, top + 30, 10, 26, '#e8e4dc'); P.rect(hx + 23, top + 32, 8, 24, doors[i]); P.set(hx + 30, top + 44, '#e8c860'); P.rect(hx + 21, top + 56, 12, 2, '#c8c4bc'); P.rect(hx + 20, top + 58, 14, 2, '#b8b4ac');
      LONDON_WINDOWS.push([hx + 24, top + 31, 3, r()]); }
    // pavement + park
    vgrad(P, 0, 132, 200, 10, ['#a8a8a4', '#8e8e8a']); for (let xx = 0; xx < 200; xx += 12) P.rect(xx, 132, 1, 10, '#7a7a76'); P.rect(0, 141, 200, 2, '#c8c8c0');
    const grass = se === 'winter' ? ['#6a7a4a', '#5a6a40', '#4a5a36'] : se === 'autumn' ? ['#6a8a3e', '#5a7a36', '#4a6a2e'] : ['#6a9a3e', '#5a8a36', '#4a7a2e'];
    vgrad(P, 0, 143, W, 37, grass, (xx, yy) => !P.has(xx, yy)); vgrad(P, 200, 118, 120, 25, [grass[0], grass[1]], (xx, yy) => !P.has(xx, yy));
    for (let i = 0; i < 1400; i++) { const xx = r() * W, yy = 120 + r() * 60; if (!(xx > 200 || yy > 143)) continue; P.set(xx, yy, r() < .5 ? mixH(grass[0], '#b8d070', .4) : grass[2]); }
    for (let xx = 0; xx < W; xx++) { const yy = Math.round(166 + Math.sin(xx / 40) * 3); for (let k = 0; k < 5; k++) P.set(xx, yy + k, k === 0 ? '#c8b890' : (hash(xx, k, 3) < .2 ? '#a89870' : '#bcac84')); }
    for (let xx = 200; xx < W; xx += 4) { paintLine(P, [[xx, 128], [xx, 142]], '#1a1c22'); P.set(xx, 127, '#3a3c44'); } P.rect(200, 131, 120, 1, '#1a1c22'); P.rect(200, 140, 120, 1, '#1a1c22');
    for (const [cx, cy, rx] of [[214, 128, 12], [300, 126, 14]]) paint(P, E(cx, cy, rx, 6, '#3f6a34', { pat: (xx, yy) => fbm(xx / 2, yy / 2, 4) > .62 ? '#5a8a44' : null }));
    // lamp, bin, bench, leaf pile
    paint(P, C(150, 142, 150, 98, 1.4, 1, '#2a2e34')); paint(P, E(150, 95, 3.2, 2.6, '#3a3e46')); P.rect(148, 96, 5, 2, '#e8d8a0'); paint(P, E(150, 143, 3, 1.2, '#2a2e34'));
    paint(P, C(120, 149, 120, 138, 5, 4.6, '#2e4a3a')); P.rect(114, 136, 13, 2, '#24382e'); paint(P, E(117, 150, 1.4, 1.4, '#1a1a1a')); paint(P, E(124, 150, 1.4, 1.4, '#1a1a1a'));
    P.rect(188, 150, 26, 2, '#6a4a2e'); P.rect(188, 146, 26, 2, '#7a5a3a'); P.rect(188, 142, 26, 2, '#6a4a2e'); P.rect(189, 152, 2, 6, '#2a2a2e'); P.rect(211, 152, 2, 6, '#2a2a2e');
    for (let i = 0; i < 160; i++) { const a = r() * Math.PI, rr = r() * 12; P.set(296 + Math.cos(a) * rr * 1.4, 172 - Math.sin(a) * rr * .6, ['#c87a2a', '#a8582a', '#8a4a22', '#d8a040'][i % 4]); }
    // plane tree
    const bark = pat.patches('#c8c8a0', 3.5, 6);
    paint(P, C(262, 162, 260, 96, 5.2, 3.4, '#8a8a6a', { pat: bark })); paint(P, Pg([[250, 164], [257, 150], [262, 164]], '#8a8a6a', { pat: bark })); paint(P, Pg([[274, 164], [266, 150], [262, 164]], '#7a7a5a', { pat: bark }));
    for (const b of [[260, 104, 230, 74, 2.4, 1.2], [261, 100, 290, 66, 2.4, 1.2], [260, 116, 304, 96, 2, 1], [260, 112, 218, 96, 1.8, .9], [262, 96, 262, 46, 2.2, 1.1], [240, 86, 226, 60, 1.2, .7], [280, 80, 300, 54, 1.2, .7]]) paint(P, C(...b, '#7a7a5a', { pat: bark }));
    if (se !== 'winter') { const leaf = se === 'autumn' ? '#c8782a' : se === 'spring' ? '#86b850' : '#4a7a3a'; const hi = se === 'autumn' ? '#e8a840' : se === 'spring' ? '#b8e07a' : '#6aa04a', lo = se === 'autumn' ? '#8a4a1e' : '#2e5a2a';
      const lp = (xx, yy) => { const v = fbm(xx / 2, yy / 2, 7); return v > .62 ? hi : v < .36 ? lo : null; };
      const cl = []; for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.sqrt(r()); cl.push([262 + Math.cos(a) * d * 42, 72 + Math.sin(a) * d * 32, 6 + r() * 5, 4 + r() * 3]); }
      cl.sort((p1, p2) => p1[1] - p2[1]); for (const [cx, cy, rx, ry] of cl) paint(P, E(cx, cy, rx, ry, leaf, { pat: lp, dither: .3 }));
      for (let i = 0; i < 120; i++) { const a = r() * TAU, d = Math.sqrt(r()); const xx = 262 + Math.cos(a) * d * 48, yy = 72 + Math.sin(a) * d * 36; if (P.has(xx, yy)) continue; P.set(xx, yy, r() < .5 ? leaf : lo); } }
    else for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (r() - .5) * 2.4, l = 10 + r() * 30, sx = 262 + (r() - .5) * 20, sy = 60 + r() * 40; paintLine(P, [[sx, sy], [sx + Math.cos(a) * l, sy + Math.sin(a) * l]], '#6a6a52'); }
    return { back: P.flush() }; },
  post(g, t, env) { const hr = env.lp.hour, dusk = env.alt < 2;
    if (dusk) for (const [x, y, s, v] of LONDON_WINDOWS) { const on = (hr >= 16 || hr < 1) ? v < .7 : (hr < 6 ? v < .12 : v < .35); if (!on) continue; const c = v < .2 ? '#ffd88a' : v < .5 ? '#ffe8b0' : '#f0c870';
      if (s === 2) { g.globalAlpha = .9; R(g, x, y, 4, 6, c); R(g, x + 5, y, 4, 6, c); R(g, x, y + 7, 4, 6, c); R(g, x + 5, y + 7, 4, 6, c); g.globalAlpha = .15; R(g, x - 3, y - 3, 15, 19, c); }
      else if (s === 3) { g.globalAlpha = .8; R(g, x, y, 6, 2, c); } else { g.globalAlpha = .85; R(g, x, y, 1, 1, c); } } g.globalAlpha = 1;
    if (env.alt < 1) { g.globalAlpha = .12; for (let y = 98; y < 160; y++) { const w = (y - 98) * .8 + 4; R(g, 150 - w / 2, y, w, 1, '#ffd88a'); } g.globalAlpha = .35; R(g, 145, 92, 11, 7, '#ffe4a0'); g.globalAlpha = 1; R(g, 148, 96, 5, 2, '#fff2c8'); } }
};

/* ---------- ANTARCTICA ---------- */
SCN.antarctica = { hz: 100, clouds: [[71, 90, 12, 80, 4], [72, 60, 10, 260, 10]],
  season: m => (m >= 11 || m <= 3) ? 'summer' : 'winter',
  build(se) { const P = Painter(W, H), r = rng(71), summer = se === 'summer';
    mountainRange(P, [[20, 60, .5], [80, 70, .55], [150, 56, .5], [220, 72, .6], [300, 62, .5]], 100, '#dfe8f6', '#a8b8d8', '#6a7088', '#8a90a8', '#ffffff', 31, .7);
    for (const [x0, w, h] of [[30, 44, 12], [232, 60, 16], [150, 20, 7]]) { for (let y = 100 - h; y < 102; y++) for (let x = x0; x < x0 + w; x++) P.set(x, y, y === 100 - h ? '#ffffff' : x > x0 + w * .7 ? '#9cc0e4' : (hash(x, y, 2) < .05 ? '#c8dcf0' : '#eef4fc')); }
    if (!summer) for (let y = 100; y < 118; y++) for (let x = 0; x < W; x++) P.set(x, y, (hash(x, Math.floor(y / 2), 5) < .03) ? '#b8cce4' : (y % 5 === 0 && x % 23 < 12 ? '#dbe6f4' : '#eaf1fa'));
    for (let x = 0; x < W; x++) { const ty = 118 + Math.round(1.5 * Math.sin(x / 13)); P.set(x, ty, '#ffffff'); P.set(x, ty + 1, '#8fb2d4'); vgrad(P, x, ty + 2, 1, H - ty - 2, ['#f2f6fc', '#e2eaf6', '#d4def0', '#c6d2ea']); }
    for (let i = 0; i < 8; i++) { let x = r() * W, y = 126 + r() * 50; for (let s = 0; s < 14; s++) { P.set(x, y, '#9ab8d8'); x += 1 + r(); y += r() < .5 ? 1 : -1; } }
    for (let i = 0; i < 6; i++) { const y0 = 134 + i * 7; for (let x = 0; x < W; x++) { const y = Math.round(y0 + 2 * Math.sin(x / (16 + i * 4) + i)); if (fbm(x / 18, i, 3) > .5) { P.set(x, y, '#ffffff'); P.set(x, y + 1, '#c4d2e8'); } } }
    for (let i = 0; i < 70; i++) { const x = 150 + r() * 90, y = 121 + r() * 7; P.set(x, y, '#1c1c26'); P.set(x, y + 1, r() < .7 ? '#f2f0e8' : '#1c1c26'); P.set(x, y - 1, '#1c1c26'); }
    return { back: P.flush() }; },
  anim(f, t, env, sky) { if (this._se !== 'summer') return;
    for (let y = 100; y < 118; y++) { const u = (y - 100) / 18; const c = mixH(mixH(sky[2], sky[1], .4), '#12283e', .35 + u * .45); R(f, 0, y, W, 1, c); }
    for (let i = 0; i < 18; i++) { const x = (i * 41 + t * 2.5) % W, y = 102 + (i * 7) % 14; R(f, x, y, 3 + i % 4, 1, mixH(sky[2], '#ffffff', .25)); }
    for (const [x, y, w] of [[60, 108, 14], [200, 112, 20], [290, 104, 10]]) { R(f, x, y, w, 1, '#ffffff'); R(f, x, y + 1, w, 1, '#d8e4f2'); R(f, x, y + 2, w, 1, '#7aa0c8'); } }
};

/* ---------- SAHARA ---------- */
SCN.desert = { hz: 110, clouds: [[81, 60, 10, 120, 12]], milky: true,
  build() { const P = Painter(W, H), r = rng(81);
    for (let x = 0; x < W; x++) { const top = Math.round(103 + (fbm(x / 30, 2, 2) > .55 ? -5 : 0) + Math.sin(x / 50) * 2); for (let y = top; y < 112; y++) P.set(x, y, y === top ? '#b88a7a' : ((y - top) / 8 > bay(x, y) ? '#8a6458' : '#9c7464')); }
    const dune = (base, amp, seed, lit, shade, crest) => { const h = x => base - amp * (Math.pow(Math.sin(x / (34 + seed * 3) + seed), 2) * .7 + fbm(x / 40, seed, 2) * .6);
      for (let x = 0; x < W; x++) { const y0 = Math.round(h(x)), facesLeft = h(x + 1) < h(x - 1);
        for (let y = y0; y < H; y++) { const d = y - y0; let c = facesLeft ? lit : shade; if (d === 0) c = crest; else if (!facesLeft && d < 2) c = mixH(shade, '#5a3020', .2);
          if ((y + Math.round(Math.sin(x / 5) * 1.5)) % 4 === 0 && d > 2) c = mixH(c, facesLeft ? '#fff0d0' : '#4a2818', .18); P.set(x, y, c); } } };
    dune(122, 20, 1, '#e8a868', '#b8704a', '#f8d0a0'); dune(146, 22, 2, '#eeb070', '#c07a4e', '#fbd8a8'); dune(172, 16, 3, '#f2bc7c', '#cc8656', '#fde0b0');
    // oasis palms
    const palm = (x, y, h, lean) => { for (let s = 0; s < h; s++) { const px = x + lean * (s / h) * (s / h) * 8; P.set(px, y - s, s % 3 ? '#6a4a2e' : '#8a6a44'); P.set(px + 1, y - s, '#5a3e26'); }
      const tx = x + lean * 8, ty = y - h; for (let k = 0; k < 7; k++) { const a = -Math.PI + k / 6 * Math.PI, pts = []; for (let s = 0; s < 12; s++) pts.push([tx + Math.cos(a) * s, ty + Math.sin(a) * s * .5 + s * s * .04]); for (let s = 0; s < pts.length - 1; s++) { P.set(pts[s][0], pts[s][1], s % 2 ? '#4a8a3a' : '#3a7a32'); P.set(pts[s][0], pts[s][1] + 1, '#2e5a28'); } } P.set(tx, ty + 1, '#8a5a2a'); P.set(tx + 1, ty + 2, '#8a5a2a'); };
    palm(22, 150, 30, 1); palm(40, 152, 24, -1); palm(10, 156, 20, .5);
    paint(P, E(30, 157, 18, 3, '#3a6a7a', { flat: 1 })); for (let i = 0; i < 12; i++) P.set(18 + i * 2, 156 + (i % 2), '#6aa0b0');
    // rocks
    for (const [cx, cy, rx, ry] of [[300, 142, 20, 10], [284, 148, 12, 6], [316, 150, 10, 8]]) paint(P, E(cx, cy, rx, ry, '#9a5a3a', { pat: pat.stripes('#7a4228', 3, 1, .1, .8) }));
    for (let i = 0; i < 18; i++) { const x = 60 + r() * 220, y = 160 + r() * 18; for (let k = -2; k <= 2; k++) P.set(x + k, y - Math.abs(k) % 2 - 1, '#8a7a4a'); P.set(x, y - 2, '#a89a5a'); }
    return { back: P.flush() }; }
};
/* Milky Way for the desert sky */
function drawMilky(g, env, t) { const a = clamp((-env.alt - 8) / 8, 0, 1); if (a <= 0) return; const r = rng(99);
  for (let i = 0; i < 700; i++) { const u = r(), x = u * W, cy = 20 + u * 60 + (r() - .5) * 26 * (1 - Math.abs(u - .5)); g.globalAlpha = a * (.15 + r() * .35); R(g, x, cy, 1, 1, r() < .2 ? '#ffe8d0' : '#dfe6ff'); }
  g.globalAlpha = a * .07; for (let x = 0; x < W; x += 2) { const cy = 20 + x / W * 60; R(g, x, cy - 8, 2, 16, '#c8d0ff'); } g.globalAlpha = 1; }

/* ---------- Weather ---------- */
function drawWeather(g, wx, t, kind, hz) { if (!wx || wx.kind === 'clear' || kind === 'deep') return;
  const under = kind === 'water';
  if (under) { if (wx.kind === 'rain' || wx.kind === 'storm') for (let i = 0; i < 30; i++) { const x = (i * 37 + Math.floor(t * 9) * 13) % W; g.globalAlpha = .6; R(g, x, 1, 2, 1, '#e8fbff'); } g.globalAlpha = 1; return; }
  if (wx.kind === 'cloudy' || wx.kind === 'rain' || wx.kind === 'storm' || wx.kind === 'snow') { g.globalAlpha = wx.kind === 'cloudy' ? .12 : .22; R(g, 0, 0, W, hz, '#6a7080'); g.globalAlpha = 1; }
  if (wx.kind === 'rain' || wx.kind === 'storm') { g.fillStyle = '#c8d8ec'; for (let i = 0; i < 160; i++) { const sp = 140 + (i % 5) * 20, x = ((i * 53.3) + t * sp * .35) % (W + 20) - 10, y = ((i * 97.1) + t * sp) % (H + 10) - 5; g.globalAlpha = .45; g.fillRect(x | 0, y | 0, 1, 3); g.fillRect((x - 1) | 0, (y + 3) | 0, 1, 1); } g.globalAlpha = 1; }
  if (wx.kind === 'snow') { for (let i = 0; i < 130; i++) { const x = ((i * 47.7) + Math.sin(t * .8 + i) * 6 + t * 4) % W, y = ((i * 71.3) + t * (10 + i % 7 * 2)) % H; g.globalAlpha = .85; R(g, x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, '#ffffff'); } g.globalAlpha = 1; }
  if (wx.kind === 'fog') { for (let k = 0; k < 6; k++) { const y = hz - 30 + k * 14, x = (t * (3 + k) + k * 70) % (W + 200) - 200; g.globalAlpha = .18; R(g, x, y, 260, 10, '#e4e8ee'); R(g, x + 40, y - 3, 180, 3, '#e4e8ee'); } g.globalAlpha = .12; R(g, 0, 0, W, H, '#dfe4ea'); g.globalAlpha = 1; }
  if (wx.kind === 'storm' && (Math.floor(t * 10) % 97) < 2) { g.globalAlpha = .45; R(g, 0, 0, W, H, '#f4f6ff'); g.globalAlpha = 1; }
}

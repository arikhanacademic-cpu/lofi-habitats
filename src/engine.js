/* ================= Pixel engine ================= */
const W = 320, H = 180;
const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + .5) / 16);
const bay = (x, y) => BAYER[((y & 3) << 2) + (x & 3)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TAU = Math.PI * 2;
function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + (s || 0) * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function vnoise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, s, o) { let v = 0, a = .5, f = 1; for (let i = 0; i < (o || 3); i++) { v += a * vnoise(x * f, y * f, s + i * 17); f *= 2; a *= .5; } return v; }

/* colour */
const hx2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
function mixH(a, b, t) { const A = hx2(a), B = hx2(b); t = clamp(t, 0, 1); return toHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
function hsl2hex(h, s, l) { h = ((h % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1); const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2; let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return toHex((r + m) * 255, (g + m) * 255, (b + m) * 255); }
function hueToward(h, target, amt) { let d = ((target - h + 540) % 360) - 180; return h + clamp(d, -amt, amt); }
const RAMPS = {};
/* 5-step ramp: deep, shade, base, light, highlight. Shadows drift toward violet, lights toward warm yellow. */
function ramp(hex) {
  if (RAMPS[hex]) return RAMPS[hex];
  const [h, s, l] = rgb2hsl(...hx2(hex));
  const grey = s < .08;
  const mk = (dl, tgt, amt, ds) => hsl2hex(grey ? hueToward(h || 230, tgt, amt) : hueToward(h, tgt, amt), grey ? Math.min(.25, s + Math.abs(ds) + .04) : s + ds, l + dl);
  return RAMPS[hex] = [mk(-.27 * (l > .85 ? 1.1 : 1), 255, 22, .06), mk(-.13, 250, 11, .04), hex, mk(.1, 52, 8, -.03), mk(.2, 55, 14, -.08)];
}
const U32 = {};
function u32(hex) { if (U32[hex] !== undefined) return U32[hex]; const [r, g, b] = hx2(hex); return U32[hex] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0; }

/* Painter: an RGBA buffer we can set pixels in, then turn into a canvas */
function Painter(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); const id = x.createImageData(w, h); const d = new Uint32Array(id.data.buffer);
  return { c, x, d, w, h, id,
    set(px, py, hex) { px |= 0; py |= 0; if (px < 0 || py < 0 || px >= w || py >= h || !hex) return; d[py * w + px] = u32(hex); },
    has(px, py) { px |= 0; py |= 0; return px >= 0 && py >= 0 && px < w && py < h && d[py * w + px] !== 0; },
    rect(px, py, rw, rh, hex) { for (let y = py | 0; y < (py + rh) | 0; y++) for (let x2 = px | 0; x2 < (px + rw) | 0; x2++) this.set(x2, y, hex); },
    flush() { x.putImageData(id, 0, 0); return c; } }; }

/* light: from upper-left, slightly in front */
const LX = -.5, LY = -.72, LZ = .48;
const LNRM = Math.hypot(LX, LY, LZ), Lx = LX / LNRM, Ly = LY / LNRM, Lz = LZ / LNRM;
const BANDS = [-.1, .26, .6, .86];

/* shape → per-pixel normal (or null) */
function shapeBox(p) {
  if (p.t === 'e') { const m = Math.max(p.rx, p.ry) + 1; return [p.cx - m, p.cy - m, p.cx + m, p.cy + m]; }
  if (p.t === 'c') { const m = Math.max(p.r1, p.r2) + 1; return [Math.min(p.x1, p.x2) - m, Math.min(p.y1, p.y2) - m, Math.max(p.x1, p.x2) + m, Math.max(p.y1, p.y2) + m]; }
  if (p.t === 'p') { const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]); return [Math.min(...xs) - 1, Math.min(...ys) - 1, Math.max(...xs) + 1, Math.max(...ys) + 1]; }
}
function shapeN(p, X, Y) {
  if (p.t === 'e') { const r = p.rot || 0, cs = Math.cos(r), sn = Math.sin(r); const dx = X - p.cx, dy = Y - p.cy; const lx = dx * cs + dy * sn, ly = -dx * sn + dy * cs;
    const u = lx / p.rx, v = ly / p.ry, d = u * u + v * v; if (d > 1) return null; const nz = Math.sqrt(1 - d); return [u * cs - v * sn, u * sn + v * cs, nz * (p.flatness || 1)]; }
  if (p.t === 'c') { const ax = p.x2 - p.x1, ay = p.y2 - p.y1, L2 = ax * ax + ay * ay || 1e-6; let t = ((X - p.x1) * ax + (Y - p.y1) * ay) / L2; t = clamp(t, 0, 1);
    const qx = p.x1 + ax * t, qy = p.y1 + ay * t, r = p.r1 + (p.r2 - p.r1) * t, dx = X - qx, dy = Y - qy, d = Math.hypot(dx, dy); if (d > r) return null; const k = d / r; return [dx / r, dy / r, Math.sqrt(Math.max(0, 1 - k * k))]; }
  if (p.t === 'p') { let ins = false; const q = p.pts; for (let i = 0, j = q.length - 1; i < q.length; j = i++) { if (((q[i][1] > Y) !== (q[j][1] > Y)) && (X < (q[j][0] - q[i][0]) * (Y - q[i][1]) / (q[j][1] - q[i][1]) + q[i][0])) ins = !ins; }
    if (!ins) return null; const b = p._b || (p._b = shapeBox(p)); const ry = (Y - b[1]) / (b[3] - b[1] || 1); return [0, (ry - .45) * .9, .8]; }
  return null;
}
function bandIdx(n, x, y, p) { if (p.flat) return p.flat === true ? 2 : p.flat;
  const nl = Math.hypot(n[0], n[1], n[2]) || 1; let I = (n[0] * Lx + n[1] * Ly + n[2] * Lz) / nl; I += (bay(x, y) - .5) * (p.dither ?? .16) + (p.bias || 0);
  let i = I > BANDS[3] ? 4 : I > BANDS[2] ? 3 : I > BANDS[1] ? 2 : I > BANDS[0] ? 1 : 0; return clamp(i, p.min || 0, p.shiny ? 4 : (p.max ?? 3)); }

/* line helper */
function linePts(x0, y0, x1, y1) { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); const pts = []; const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
  for (let i = 0; i < 400; i++) { pts.push([x0, y0]); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } return pts; }

/* ---- sprite part constructors ---- */
const E = (cx, cy, rx, ry, c, o) => Object.assign({ t: 'e', cx, cy, rx, ry, c }, o);
const C = (x1, y1, x2, y2, r1, r2, c, o) => Object.assign({ t: 'c', x1, y1, x2, y2, r1, r2: r2 ?? r1, c }, o);
const Pg = (pts, c, o) => Object.assign({ t: 'p', pts, c }, o);
const EYE = (x, y, o) => Object.assign({ t: 'eye', x, y }, o);
const PX = (pts, c, o) => Object.assign({ t: 'px', pts, c }, o);
const LN = (pts, c, o) => Object.assign({ t: 'ln', pts, c }, o);
const OUTLINE = '#120f1c';

/* rasterise a list of parts into a sprite frame */
function raster(w, h, parts, opt) {
  opt = opt || {};
  const N = w * h, col = new Array(N).fill(null), pid = new Int16Array(N).fill(-1), ri = new Int8Array(N), rp = new Array(N);
  const late = [];
  parts.forEach((p, k) => {
    if (!p) return;
    if (p.t === 'eye' || p.t === 'px' || p.t === 'ln') { late.push(p); return; }
    const R0 = ramp(p.c); const b = shapeBox(p);
    for (let y = Math.max(0, Math.floor(b[1])); y <= Math.min(h - 1, Math.ceil(b[3])); y++)
      for (let x = Math.max(0, Math.floor(b[0])); x <= Math.min(w - 1, Math.ceil(b[2])); x++) {
        const n = shapeN(p, x + .5, y + .5); if (!n) continue;
        if (p.clip && !p.clip(x, y)) continue;
        let R = R0; if (p.pat) { const pc = p.pat(x, y, n); if (pc) R = ramp(pc); }
        let idx = bandIdx(n, x, y, p); if (p.dim) idx = clamp(idx - p.dim, 0, 4);
        const i = y * w + x; col[i] = R[idx]; pid[i] = k; ri[i] = idx; rp[i] = R;
      }
  });
  const out = col.slice();
  // creases: darken the back part where a front part overlaps it
  for (let i = 0; i < N; i++) { const a = pid[i]; if (a < 0) continue; const x = i % w, y = (i / w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const b = pid[ny * w + nx];
      if (b > a && !parts[b].blend && !parts[a].noCrease) { out[i] = rp[i][Math.max(0, ri[i] - 2)]; break; } } }
  // selective outline
  if (!opt.noOutline) {
    const filled = i => pid[i] >= 0;
    for (let i = 0; i < N; i++) { if (filled(i)) continue; const x = i % w, y = (i / w) | 0; let best = null;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const j = ny * w + nx; if (filled(j) && !parts[pid[j]].noOutline) { best = rp[j]; if (dy === -1 || dx === -1) break; } }
      if (best) out[i] = mixH(best[0], OUTLINE, opt.soft ? .25 : .55); }
  }
  const eyes = [], glows = [];
  for (const p of late) {
    if (p.t === 'px') for (const [x, y] of p.pts) { if (x < 0 || y < 0 || x >= w || y >= h) continue; out[y * w + x] = p.c; if (p.glow) glows.push([x, y, p.c]); }
    if (p.t === 'ln') { for (let s = 0; s < p.pts.length - 1; s++) for (const [x, y] of linePts(p.pts[s][0], p.pts[s][1], p.pts[s + 1][0], p.pts[s + 1][1])) { if (x < 0 || y < 0 || x >= w || y >= h) continue; out[y * w + x] = p.c; if (p.glow) glows.push([x, y, p.c]); } }
    if (p.t === 'eye') { const x = Math.round(p.x), y = Math.round(p.y), s = p.size || 1;
      if (p.closed) { const under = rp[y * w + x] || ramp(p.lid || '#555555'); for (let k = 0; k < Math.max(2, s); k++) { const xx = x + k - (s > 1 ? 0 : 0); if (xx < w) out[y * w + xx] = under[0]; } continue; }
      const dark = p.pupil || '#120e18';
      if (s === 1) { out[y * w + x] = p.iris || dark; if (p.ring) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < w && yy < h && pid[yy * w + xx] >= 0) out[yy * w + xx] = p.ring; } }
      else { for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) { if (x + dx < w && y + dy < h) out[(y + dy) * w + x + dx] = p.iris || dark; }
        if (p.iris) out[(y + s - 1) * w + x + s - 1] = dark; out[y * w + x] = '#ffffff'; if (p.ring) for (let k = -1; k <= s; k++) { for (const [xx, yy] of [[x + k, y - 1], [x + k, y + s], [x - 1, y + k], [x + s, y + k]]) if (xx >= 0 && yy >= 0 && xx < w && yy < h && pid[yy * w + xx] >= 0 && out[yy * w + xx] !== '#ffffff') out[yy * w + xx] = p.ring; } }
      eyes.push([x + (s > 1 ? 1 : 0), y]); }
  }
  for (const p of parts) if (p && p.glow && p.t !== 'px' && p.t !== 'ln') { /* glowing filled part */ const b = shapeBox(p); for (let y = Math.max(0, Math.floor(b[1])); y <= Math.min(h - 1, Math.ceil(b[3])); y++) for (let x = Math.max(0, Math.floor(b[0])); x <= Math.min(w - 1, Math.ceil(b[2])); x++) if (shapeN(p, x + .5, y + .5)) glows.push([x, y, ramp(p.c)[3]]); }
  const P = Painter(w, h); for (let i = 0; i < N; i++) if (out[i]) P.d[i] = u32(out[i]); P.flush();
  // bounding box of content
  let x0 = w, y0 = h, x1 = 0, y1 = 0; for (let i = 0; i < N; i++) if (out[i]) { const x = i % w, y = (i / w) | 0; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  return { cv: P.c, w, h, eyes, glows, bb: [x0, y0, x1, y1] };
}

/* paint a shaded shape straight into a Painter (for scenery) */
function paint(P, p) {
  const R0 = ramp(p.c); const b = shapeBox(p);
  for (let y = Math.max(0, Math.floor(b[1])); y <= Math.min(P.h - 1, Math.ceil(b[3])); y++)
    for (let x = Math.max(0, Math.floor(b[0])); x <= Math.min(P.w - 1, Math.ceil(b[2])); x++) {
      const n = shapeN(p, x + .5, y + .5); if (!n) continue; if (p.clip && !p.clip(x, y)) continue;
      let R = R0; if (p.pat) { const pc = p.pat(x, y, n); if (pc) R = ramp(pc); }
      let idx = bandIdx(n, x, y, p); if (p.dim) idx = clamp(idx - p.dim, 0, 4);
      P.set(x, y, p.raw ? R[2] : R[idx]);
    }
}
function paintLine(P, pts, c) { for (let s = 0; s < pts.length - 1; s++) for (const [x, y] of linePts(pts[s][0], pts[s][1], pts[s + 1][0], pts[s + 1][1])) P.set(x, y, c); }
/* dithered vertical gradient over a list of colour stops */
function vgrad(P, x0, y0, w, h, stops, mask) {
  const lv = Math.max(2, Math.round(h / 4)), cols = [];
  for (let i = 0; i < lv; i++) { const t = i / (lv - 1) * (stops.length - 1), k = Math.min(stops.length - 2, Math.floor(t)); cols.push(mixH(stops[k], stops[k + 1], t - k)); }
  for (let y = y0; y < y0 + h; y++) { const t = (y - y0) / Math.max(1, h - 1) * (lv - 1); const i = Math.min(lv - 2, Math.floor(t)); const fr = t - i;
    for (let x = x0; x < x0 + w; x++) { if (mask && !mask(x, y)) continue; P.set(x, y, fr > bay(x, y) ? cols[i + 1] : cols[i]); } }
}
/* pattern helpers (return a function (x,y)->hex|null) */
const pat = {
  spots: (c, d, s, seed) => (x, y) => hash(Math.floor(x / (s || 1)), Math.floor(y / (s || 1)), seed || 3) < d ? c : null,
  stripes: (c, per, wid, ang, wob, seed) => (x, y) => { const a = ang || 0; const v = x * Math.cos(a) + y * Math.sin(a) + Math.sin(y * .7 + (seed || 0)) * (wob || 0); return ((v % per) + per) % per < wid ? c : null; },
  rosette: (c, inner, cell) => (x, y) => { cell = cell || 5; const cx = Math.floor(x / cell), cy = Math.floor(y / cell); let best = 9, bi = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i) * cell + hash(cx + i, cy + j, 7) * cell, py = (cy + j) * cell + hash(cx + i, cy + j, 9) * cell; const d = Math.hypot(x + .5 - px, y + .5 - py); if (d < best) { best = d; bi = hash(cx + i, cy + j, 11); } }
      if (best > 1.15 && best < 2.1 && hash(x, y, 5) > .18) return c; if (best <= 1.15 && inner && bi > .4) return inner; return null; },
  patches: (line, cell, seed) => (x, y) => { cell = cell || 5; const cx = Math.floor(x / cell), cy = Math.floor(y / cell); let d1 = 99, d2 = 99;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i) * cell + .2 * cell + hash(cx + i, cy + j, seed || 1) * cell * .6, py = (cy + j) * cell + .2 * cell + hash(cx + i, cy + j, (seed || 1) + 5) * cell * .6; const d = Math.hypot(x + .5 - px, y + .5 - py); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
      return d2 - d1 < .9 ? line : null; },
  rings: (c, cell) => (x, y) => { cell = cell || 4; const cx = Math.floor(x / cell), cy = Math.floor(y / cell); const px = cx * cell + cell / 2 + (hash(cx, cy, 2) - .5), py = cy * cell + cell / 2 + (hash(cx, cy, 4) - .5); const d = Math.hypot(x + .5 - px, y + .5 - py); return d > .9 && d < 1.7 && hash(cx, cy, 6) > .3 ? c : null; },
  any: (...fs) => (x, y, n) => { for (const f of fs) { const r = f(x, y, n); if (r) return r; } return null; },
};

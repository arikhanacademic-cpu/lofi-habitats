/* ================= Creatures ================= */
function sh(parts, dx, dy) {
  if (!dx && !dy) return parts;
  return parts.map(p => { if (!p) return p; const q = Object.assign({}, p);
    if (q.t === 'e') { q.cx += dx; q.cy += dy; } else if (q.t === 'c') { q.x1 += dx; q.x2 += dx; q.y1 += dy; q.y2 += dy; }
    else if (q.t === 'p') { q.pts = q.pts.map(([x, y]) => [x + dx, y + dy]); delete q._b; }
    else if (q.t === 'eye') { q.x += dx; q.y += dy; } else if (q.t === 'px' || q.t === 'ln') q.pts = q.pts.map(([x, y]) => [x + dx, y + dy]);
    return q; });
}
const S2 = (ph, k) => Math.sin((ph + (k || 0)) * TAU);
const step = (ph, n) => Math.floor(ph * n);

/* Four-legged walker. o.body/o.tail/o.head return parts; legs are generated. */
function quad(o) {
  return { w: o.w, h: o.h, ax: o.ax, ay: o.ay ?? o.h - 2, n: 4, draw(st, ph) {
    const sl = st === 'sleep', lay = sl && !o.sleepStand, L = o.legs;
    const drop = lay ? (o.layDrop ?? Math.round(L.len * .75)) : 0;
    const bob = !sl && (step(ph, 4) % 2 === 1) ? 1 : 0;
    const dy = drop + bob;
    const P = [];
    const leg = (x, off, far, front) => {
      const top = (front && L.ftop != null ? L.ftop : L.top) + dy, len = front && L.flen ? L.flen : L.len;
      const dim = far ? 1 : 0, c = L.c || o.c;
      if (lay) { const dir = front ? 1 : -1; return [C(x, top - 1, x + dir * len * .55, top + .5, L.r1, L.r2, c, { dim, pat: o.legPat, blend: true })]; }
      const a = sl ? 0 : S2(ph, off), sw = a * L.swing, lift = sl ? 0 : Math.max(0, -Math.cos((ph + off) * TAU)) * L.lift;
      const rk = L.rk ?? (L.r1 + L.r2) / 2;
      const kx = x + sw * .45 + (front ? -.4 : .9), ky = top + len * .5 - lift * .3, fx = x + sw, fy = top + len - lift;
      const r = [C(x, top - 1, kx, ky, L.r1, rk, c, { dim, pat: o.legPat, blend: true }), C(kx, ky, fx, fy, rk, L.r2, c, { dim, pat: o.legPat, blend: true })];
      if (L.foot) r.push(E(fx + .6, fy - .3, L.fr ?? L.r2 + .4, 1.1, L.foot, { dim, blend: true }));
      return r;
    };
    P.push(...leg(L.back + (L.farDx || 1), .5, true, false), ...leg(L.front + (L.farDx || 1), 0, true, true));
    const tail = o.tail ? sh(o.tail(sl, ph), 0, dy) : [];
    if (!(sl && o.curl)) P.push(...tail);
    P.push(...sh(o.body(sl, ph), 0, dy));
    P.push(...leg(L.back, 0, false, false), ...leg(L.front, .5, false, true));
    let hx = 0, hy = 0; if (lay) { hx = (o.layHead || [1, 2])[0]; hy = (o.layHead || [1, 2])[1]; } else if (sl) { hx = (o.droop || [0, 2])[0]; hy = (o.droop || [0, 2])[1]; }
    else if (o.headBob) hy = step(ph, 4) % 2 ? 0 : -o.headBob;
    P.push(...sh(o.head(sl, ph, hx, hy), 0, dy));
    if (sl && o.curl) P.push(...tail);
    return P;
  } };
}

/* Swimmer with a wagging tail */
function fish(o) { return { w: o.w, h: o.h, ay: o.ay ?? Math.round(o.h / 2), n: 4, alpha: o.alpha, draw(st, ph) { const sl = st === 'sleep'; const wag = sl ? 0 : S2(ph) * (o.wag ?? 1.5); return o.parts(sl, ph, wag); } }; }

const SPR = {};
const sleepEye = (x, y, sl, o) => EYE(x, y, Object.assign({ closed: sl }, o));

/* ---------- SAVANNAH ---------- */
SPR.lion = quad({ w: 46, h: 30, ay: 27, c: '#c99a55', sleepStand: false, layHead: [1, 3], headBob: 0,
  legs: { back: 12, front: 29, top: 16, len: 10, r1: 3.1, rk: 2.3, r2: 1.8, swing: 2.6, lift: 1.6, foot: '#c08a48', fr: 2.2 },
  body: () => [E(21, 13, 12, 6.2, '#c99a55'), E(29, 14.5, 5.5, 6, '#c99a55', { blend: true }), E(21, 17.5, 8, 1.8, '#e3c58e', { blend: true, max: 2, noCrease: true })],
  tail: (sl, ph) => { const s = sl ? 0 : S2(ph) * 1.2; return [C(9, 11, 4, 15, 1.1, .8, '#c99a55'), C(4, 15, 3 + s, 21, .8, .7, '#c99a55', { blend: true }), E(3 + s, 22, 1.6, 1.9, '#4d2e17')]; },
  head: (sl, ph, hx, hy) => sh([E(32, 11, 7, 8, '#7d4a22', { pat: pat.stripes('#5e3416', 3, 1, .9, .6) }), E(29, 13, 3, 5, '#7d4a22', { blend: true }), E(36, 10.5, 4.6, 4, '#d4a766'), E(39.3, 12.5, 2.6, 2, '#ead2a0', { blend: true }), E(33, 5.2, 1.6, 1.6, '#7d4a22'),
    PX([[41, 11], [42, 11], [41, 12]], '#3b2626'), PX([[40, 14]], '#5a3a2a'), sleepEye(37, 9, sl)], hx, hy) });

SPR.cheetah = quad({ w: 44, h: 28, ay: 25, c: '#dcae62', layHead: [1, 3],
  legs: { back: 11, front: 28, top: 14, len: 11, r1: 2.3, rk: 1.6, r2: 1.2, swing: 3.4, lift: 2, foot: '#d2a258', fr: 1.6 }, legPat: pat.spots('#2b2117', .14, 1, 4),
  body: () => [E(19, 12, 11.5, 4.7, '#dcae62', { pat: pat.spots('#2b2117', .2, 1, 3) }), E(28, 12.5, 4.6, 4.6, '#dcae62', { blend: true, pat: pat.spots('#2b2117', .2, 1, 3) }), E(19, 15.3, 8, 1.4, '#f0dcb0', { blend: true, noCrease: true, max: 2 })],
  tail: (sl, ph) => { const s = sl ? 0 : S2(ph) * 1.4; return [C(8, 11, 3, 15, 1.1, .9, '#dcae62'), C(3, 15, 4 + s, 22, .9, .8, '#dcae62', { blend: true, pat: pat.stripes('#2b2117', 2.2, 1, Math.PI / 2) }), PX([[4 + Math.round(s), 23]], '#f2ead8')]; },
  head: (sl, ph, hx, hy) => sh([C(29, 10, 33, 8, 3, 2.4, '#dcae62', { blend: true }), E(35, 8, 3.7, 3.2, '#dcae62', { pat: pat.spots('#2b2117', .1, 1, 6) }), E(37.8, 9.6, 1.9, 1.6, '#f2e2bc', { blend: true }), E(33.2, 4.8, 1.2, 1.2, '#b88a46'),
    PX([[39, 8], [39, 9]], '#2a1e1a'), LN([[36, 8], [36, 10], [37, 11]], '#2b2117'), sleepEye(36, 7, sl)], hx, hy) });

SPR.hyena = quad({ w: 42, h: 30, ay: 27, c: '#b89d72', layHead: [2, 3],
  legs: { back: 11, front: 27, top: 17, ftop: 15, len: 9, flen: 11, r1: 2.5, rk: 1.8, r2: 1.4, swing: 2.4, lift: 1.5, foot: '#6a5236', fr: 1.6 }, legPat: pat.spots('#4a3624', .2, 2, 8),
  body: () => [E(19, 14, 11, 6, '#b89d72', { rot: -.2, pat: pat.spots('#4a3624', .28, 2, 8) }), E(27, 12, 5, 5.5, '#b89d72', { blend: true, pat: pat.spots('#4a3624', .28, 2, 8) })],
  tail: (sl, ph) => [C(8, 14, 5, 19 + (sl ? 0 : S2(ph)), 1.2, 1, '#8a7050'), E(5, 20 + (sl ? 0 : S2(ph)), 1.3, 1.8, '#2e2218')],
  head: (sl, ph, hx, hy) => sh([C(27, 10, 32, 9, 4, 3.4, '#b89d72', { blend: true, pat: pat.spots('#4a3624', .2, 2, 9) }), LN([[25, 7], [30, 5]], '#4a3624'), E(34, 9.5, 4.6, 3.9, '#b89d72'), E(37.6, 11, 2.7, 2.2, '#4a3a2c', { blend: true }),
    E(32, 5, 1.8, 2, '#8a7050'), PX([[39, 10], [40, 10]], '#1a1412'), sleepEye(35, 8, sl)], hx, hy) });

SPR.zebra = quad({ w: 40, h: 34, ay: 31, c: '#efebe3', sleepStand: true, droop: [1, 3],
  legs: { back: 11, front: 25, top: 18, len: 12, r1: 2.7, rk: 1.9, r2: 1.4, swing: 2.2, lift: 1.4, foot: '#26222a', fr: 1.6 }, legPat: pat.stripes('#1c1a22', 2.4, 1.1, Math.PI / 2),
  body: () => [E(18, 15, 11.5, 6.2, '#efebe3', { pat: pat.stripes('#1c1a22', 3.2, 1.5, .1, 1.1) }), E(9, 14, 5, 5.6, '#efebe3', { blend: true, pat: pat.stripes('#1c1a22', 3, 1.3, 1.2, .5) })],
  tail: (sl, ph) => { const s = sl ? 0 : S2(ph) * .8; return [C(6, 12, 4 + s, 22, .9, .6, '#efebe3'), E(4 + s, 23, 1, 1.8, '#1c1a22')]; },
  head: (sl, ph, hx, hy) => sh([C(26, 12, 31, 6, 4.1, 3, '#efebe3', { blend: true, pat: pat.stripes('#1c1a22', 2.8, 1.3, .5, .3) }), LN([[25, 9], [30, 2]], '#1c1a22'), LN([[26, 9], [31, 3]], '#3a3640'),
    E(33, 6.5, 3.4, 2.8, '#efebe3', { rot: .6, pat: pat.stripes('#1c1a22', 2.6, 1.2, .9) }), C(33, 7, 36, 11, 2.6, 1.8, '#efebe3', { blend: true, pat: pat.stripes('#1c1a22', 2.6, 1.1, 2.1) }), E(36.6, 11.6, 1.7, 1.5, '#2a2730'),
    C(31.5, 3, 31, 0, 1, .6, '#efebe3'), sleepEye(33, 6, sl)], hx, hy) });

SPR.wildebeest = quad({ w: 40, h: 34, ay: 31, c: '#6d727d', layHead: [1, 4],
  legs: { back: 11, front: 26, top: 19, len: 11, r1: 2.3, rk: 1.6, r2: 1.1, swing: 2.2, lift: 1.4, c: '#5a5e68', foot: '#24242a', fr: 1.3 },
  body: () => [E(17, 15, 11, 6.4, '#6d727d', { pat: pat.stripes('#4e525c', 3, 1, .25, .8) }), E(25, 12, 6, 6.4, '#6d727d', { blend: true, pat: pat.stripes('#4e525c', 3, 1, .25, .8) })],
  tail: (sl, ph) => { const s = sl ? 0 : S2(ph); return [C(6, 13, 4 + s, 21, .8, .6, '#3a3c44'), E(4 + s, 22, 1.1, 2.6, '#26272d')]; },
  head: (sl, ph, hx, hy) => sh([C(26, 12, 30, 9, 3.7, 3, '#6d727d', { blend: true }), LN([[24, 7], [29, 6]], '#26272d'), C(31, 8, 35, 16, 3.2, 2.3, '#3a3c46'), E(35.4, 16.5, 1.8, 1.5, '#2a2a30'),
    LN([[30, 13], [30, 19]], '#e6e0d4'), LN([[31, 14], [31, 18]], '#d6d0c4'),
    LN([[31, 6], [29, 5], [28, 3], [29, 1]], '#2a2620'), LN([[33, 6], [35, 4], [35, 2], [34, 1]], '#3a3630'), sleepEye(33, 10, sl)], hx, hy) });

SPR.elephant = { w: 60, h: 46, ay: 43, n: 4, draw(st, ph) {
  const sl = st === 'sleep', c = '#8e8a88', skin = pat.spots('#7a7674', .12, 1, 21);
  const sw = k => sl ? 0 : S2(ph, k) * 1.6;
  const legP = (x, k, far) => { const s = sw(k); return [C(x, 27, x + s, 40, 4.8, 4.2, c, { dim: far ? 1 : 0, pat: skin, blend: true }), E(x + s + .4, 41.4, 4.6, 1.5, '#78726e', { dim: far ? 1 : 0, blend: true })]; };
  const ear = sl ? 0 : S2(ph) * 1.2, tr = sl ? 0 : S2(ph, .2) * 1.4, dh = sl ? 1 : 0;
  return [...legP(17, .5, true), ...legP(36, 0, true),
    C(9, 18, 6 + (sl ? 0 : S2(ph) * .6), 31, .9, .6, c), E(6, 32, .9, 1.6, '#3a3634'),
    E(25, 21, 16.5, 12, c, { pat: skin }), E(23, 13, 10, 5, c, { blend: true, pat: skin }),
    ...legP(20, 0, false), ...legP(39, .5, false),
    E(43, 17 + dh, 8, 8.6, c, { pat: skin }),
    E(38 - ear * .3, 18 + dh, 6.2 + ear, 8.8, '#8a8584', { rot: .12, pat: pat.any(pat.stripes('#78716f', 3.5, .8, 1.2, .8), skin) }),
    C(48, 22 + dh, 50 + tr * .4, 31 + dh, 3.3, 2.6, c, { pat: pat.stripes('#7a7674', 2, .8, Math.PI / 2) }), C(50 + tr * .4, 31 + dh, 49 + tr, 38 + dh, 2.6, 2, c, { blend: true, pat: pat.stripes('#7a7674', 2, .8, Math.PI / 2) }), C(49 + tr, 38 + dh, 51 + tr, 41 + dh, 2, 1.6, c, { blend: true }),
    C(46, 25 + dh, 53, 28 + dh, 1.2, .7, '#efe8d6', { shiny: true }),
    PX([[45, 27 + dh]], '#4a4442'), sleepEye(46, 15 + dh, sl)];
} };

SPR.giraffe = { w: 42, h: 64, ay: 61, n: 4, draw(st, ph) {
  const sl = st === 'sleep', c = '#c07834', pt = pat.patches('#f1e2c0', 4.6, 3);
  const legP = (x, k, far, front) => { const s = sl ? 0 : S2(ph, k) * 2.2, lift = sl ? 0 : Math.max(0, -Math.cos((ph + k) * TAU)) * 1.6; const kx = x + s * .45 + (front ? -.3 : .8);
    return [C(x, 39, kx, 49, 2.6, 1.8, c, { dim: far ? 1 : 0, pat: pt, blend: true }), C(kx, 49, x + s, 59 - lift, 1.8, 1.3, c, { dim: far ? 1 : 0, pat: pt, blend: true }), E(x + s + .4, 59.4 - lift, 1.6, 1, '#3a2a1e', { dim: far ? 1 : 0 })]; };
  const nk = sl ? 0 : S2(ph) * .8, dd = sl ? 2 : 0;
  return [...legP(12, .5, true), ...legP(23, 0, true, true),
    C(8, 33, 5, 45 + (sl ? 0 : S2(ph) * .5), .7, .5, c), E(5, 46, .9, 1.6, '#2a1e16'),
    E(17, 35, 10, 6.6, c, { rot: -.28, pat: pt }),
    ...legP(14, 0, false), ...legP(25, .5, false, true),
    C(23, 31, 31 + nk, 11 + dd, 4.2, 2.4, c, { pat: pt }), LN([[21, 29], [29 + nk, 9 + dd]], '#8a5a2a'), LN([[22, 29], [30 + nk, 9 + dd]], '#a8743a'),
    ...sh([E(33, 8, 3.4, 2.6, c, { rot: .5 }), C(33, 8, 37, 12, 2.4, 1.8, c, { blend: true }), E(37.3, 12.4, 1.4, 1.2, '#b88848', { blend: true }), C(31.5, 5, 30.6, 1.5, .9, .8, '#6a4020'), PX([[30, 1], [31, 1]], '#2a1a10'), C(30.5, 7, 27.5, 6, 1, .6, c), sleepEye(33, 7, sl)], nk, dd)];
} };

SPR.aardvark = quad({ w: 44, h: 26, ay: 23, c: '#b9917a', layHead: [1, 2],
  legs: { back: 12, front: 26, top: 15, len: 7, r1: 2.7, rk: 2.2, r2: 1.8, swing: 1.8, lift: 1.2, foot: '#8a6a5a', fr: 2.1 },
  body: () => [E(19, 12, 11, 6.6, '#b9917a', { rot: -.08, pat: pat.spots('#a07a64', .12, 1, 4) })],
  tail: (sl, ph) => [C(9, 12, 2, 19 + (sl ? 0 : S2(ph) * .6), 3.2, 1.2, '#b18a72')],
  head: (sl, ph, hx, hy) => sh([C(28, 11, 31, 13, 4.2, 3.2, '#b9917a', { blend: true }), E(32.5, 13, 3.4, 3, '#b9917a'), C(34, 13.5, 40, 16.5, 2.2, 1.3, '#c9a28c'), E(40.6, 16.6, 1.1, 1.1, '#e0b4a4'),
    C(31, 10, 30, 3, 1.7, 1.1, '#c79c86'), C(32, 10, 33, 4, 1.4, 1, '#b48a74'), sleepEye(33, 12, sl)], hx, hy) });

SPR.vulture = { w: 46, h: 30, ay: 25, n: 4, draw(st, ph) {
  const sl = st === 'sleep';
  if (sl) return [C(20, 22, 18, 28, 2.2, 1.4, '#3a2c24'), E(22, 17, 5, 7, '#4a3a30', { rot: .2, pat: pat.stripes('#3a2c24', 2.5, .9, .4) }), E(21, 13.5, 3.4, 2.6, '#e6dccc', { blend: true }),
    E(23, 12, 3.2, 1.8, '#ece4d6'), C(24, 11, 26, 8, 1.4, 1.2, '#9a8c88'), E(27, 7, 2.4, 2, '#8a7a78'), C(28, 7, 31, 8, 1, .6, '#3a3432'), PX([[21, 24], [23, 24], [22, 25], [24, 25]], '#6a6060'), EYE(27, 6, { closed: true })];
  const f = S2(ph) * 1.6;
  const band = (x, y) => { const d = Math.abs(x - 23); return d > 5 && d < 17 && y < 12.6 + f * (d / 20) ? '#e6dccc' : null; };
  const wing = s => { const tx = s < 0 ? 1 : 45, q = v => 23 + s * v; return Pg([[q(2), 10], [q(10), 9 + f * .5], [tx, 9 + f], [q(21), 11.5 + f], [q(22.5), 12 + f], [q(20), 13 + f], [q(21.5), 14 + f], [q(18), 14.5 + f], [q(19), 16 + f], [q(14), 15 + f * .6], [q(2), 15]], '#3e3028', { pat: band }); };
  return [wing(-1), wing(1), E(20, 13, 3.4, 2.2, '#3a2c24'), E(23.5, 12.6, 4.4, 2.8, '#4a3a30'), C(27, 12, 30, 11.5, 1.3, 1.1, '#9a8c88'), E(31, 11.4, 1.8, 1.5, '#8a7a78'), PX([[33, 12]], '#3a3432'), EYE(31, 11)];
} };

/* ---------- ARCTIC ---------- */
SPR.polarbear = quad({ w: 48, h: 30, ay: 27, c: '#f2efe4', layHead: [1, 3],
  legs: { back: 13, front: 31, top: 16, len: 9, r1: 3.8, rk: 3.1, r2: 2.9, swing: 2.1, lift: 1.3, foot: '#e0dacb', fr: 3.2 },
  body: () => [E(22, 14, 13, 7.2, '#f2efe4'), E(12, 13, 6, 6.6, '#f2efe4', { blend: true }), E(22, 19, 10, 2, '#e4ddca', { blend: true, noCrease: true, max: 2 })],
  tail: () => [E(7, 11, 1.4, 1.4, '#f2efe4')],
  head: (sl, ph, hx, hy) => sh([C(31, 13, 37, 14, 5.2, 3.4, '#f2efe4', { blend: true }), E(39, 15, 3.6, 3, '#f2efe4'), E(42, 16, 2.2, 1.7, '#ece6d6', { blend: true }), PX([[44, 15], [44, 16], [43, 15]], '#1a1820'), E(37, 11.5, 1.2, 1, '#e2ddcf'), sleepEye(40, 14, sl)], hx, hy) });

SPR.arcticfox = quad({ w: 32, h: 22, ay: 19, c: '#e9e7e8', curl: true, layDrop: 3, layHead: [-1, 3],
  legs: { back: 9, front: 18, top: 13, len: 5, r1: 1.7, rk: 1.3, r2: 1, swing: 1.7, lift: 1, c: '#cfcac4', foot: '#bdb6ae', fr: 1.1 },
  body: () => [E(14, 11, 7, 4.2, '#e9e7e8', { pat: pat.spots('#cfc8c0', .1, 1, 5) })],
  tail: (sl, ph) => sl ? [E(15, 13, 8, 2.8, '#eeeef0', { rot: .05 })] : [E(5, 9 + S2(ph) * .6, 5.4, 3, '#eeeef0', { rot: -.5 })],
  head: (sl, ph, hx, hy) => sh([C(19, 10, 22, 8, 3.1, 2.6, '#e9e7e8', { blend: true }), E(23.5, 8, 3, 2.6, '#e9e7e8'), C(25, 9, 28, 9.6, 1.6, .9, '#e9e7e8', { blend: true }), PX([[28, 9]], '#1a1820'),
    Pg([[20.5, 6.5], [21.5, 2.5], [23.5, 5.5]], '#e0dcd8'), sleepEye(24, 7, sl)], hx, hy) });

SPR.reindeer = quad({ w: 38, h: 36, ay: 33, c: '#9a8a74', layHead: [0, 4],
  legs: { back: 10, front: 22, top: 23, len: 9, r1: 2.7, rk: 2, r2: 1.5, swing: 2, lift: 1.3, c: '#8c7b66', foot: '#3a3028', fr: 1.7 },
  body: () => [E(16, 20, 11, 6.6, '#9a8a74', { pat: pat.spots('#b4a48c', .1, 1, 2) }), E(16, 24.5, 8, 2, '#ece6d8', { blend: true, noCrease: true })],
  tail: () => [E(5, 18, 1.6, 1.6, '#efe9dc')],
  head: (sl, ph, hx, hy) => sh([C(24, 18, 28, 13, 4.6, 3.2, '#e6e0d2', { blend: true }), E(30, 12, 3.3, 2.6, '#8c7b66', { rot: .5 }), E(32.6, 14, 2, 1.6, '#a4927a', { blend: true }), PX([[34, 14]], '#2a2220'),
    E(27.5, 9, 1.6, 1, '#8c7b66', { rot: -.5 }),
    LN([[29, 9], [28, 5], [26, 2], [24, 1]], '#d8c8a8'), LN([[28, 5], [30, 3]], '#d8c8a8'), LN([[26, 2], [27, 0]], '#d8c8a8'), LN([[30, 9], [31, 5], [33, 2]], '#c4b494'), LN([[31, 5], [33, 5]], '#c4b494'), sleepEye(30, 11, sl)], hx, hy) });

SPR.walrus = { w: 48, h: 30, ay: 28, n: 4, draw(st, ph) {
  const sl = st === 'sleep', hb = sl ? 2 : (step(ph, 4) % 2 ? 0 : -1), c = '#a8705a';
  return [E(6, 24, 4.2, 2.4, '#8a5a48', { rot: .4 }), E(21, 18, 16, 9, c, { pat: pat.spots('#c4887a', .12, 2, 3) }), E(18, 24, 12, 2.4, '#94604c', { blend: true, noCrease: true }),
    E(31, 25, 4.2, 2, '#8a5a48', { rot: .3 }),
    ...sh([E(35, 13, 7, 6.6, c, { pat: pat.spots('#c4887a', .1, 2, 5) }), E(40, 16, 4.2, 3.5, '#c79a84', { blend: true }), PX([[39, 15], [41, 15], [40, 17], [42, 16], [43, 17]], '#f0d8c8'),
      C(38, 19, 39, 27, 1.1, .7, '#f2ead8', { shiny: true }), C(41, 19, 42, 27, 1.1, .7, '#f2ead8', { shiny: true }), sleepEye(37, 10, sl)], 0, hb)];
} };

SPR.ringedseal = fish({ w: 36, h: 16, ay: 13, wag: 1.2, parts: (sl, ph, w) => [
  Pg([[5, 8], [0, 4 + w], [2, 8], [0, 12 + w], [5, 10]], '#6e747c'),
  E(17, 8.5, 14, 4.6, '#8a9098', { pat: pat.rings('#c6ccd2', 4) }), E(17, 11, 11, 1.8, '#b4bac0', { blend: true, noCrease: true }),
  E(29.5, 7.5, 4.3, 3.6, '#8a9098'), E(32.6, 8.6, 2, 1.6, '#9aa0a8', { blend: true }), PX([[34, 8]], '#1a1a20'), PX([[33, 10], [34, 9], [35, 10]], '#d8dce0'),
  E(23, 11.5, 2.6, 1.2, '#6e747c', { rot: .6 }), sleepEye(30, 6, sl, { size: 2 })] });

SPR.ptarmigan = { w: 18, h: 18, ay: 16, n: 2, draw(st, ph) { const sl = st === 'sleep';
  const mott = (x, y) => y < 8 && hash(x, y, 9) < .35 ? '#9a7a5a' : null;
  return [E(8, 10, 5.6, 4.6, '#f2f0ea', { pat: mott }), E(4, 9, 2.2, 2.4, '#f2f0ea', { rot: .5 }),
    ...(sl ? [E(10, 8, 2.8, 2.6, '#f2f0ea', { pat: mott }), EYE(11, 7, { closed: true })] :
      [E(12, 6 + (step(ph, 2) ? 1 : 0), 2.8, 2.6, '#f2f0ea', { pat: mott }), PX([[14, 6 + (step(ph, 2) ? 1 : 0)]], '#1a1820'), PX([[12, 4 + (step(ph, 2) ? 1 : 0)]], '#d8443a'), EYE(12, 5 + (step(ph, 2) ? 1 : 0))]),
    E(7, 15, 1.6, 1, '#e6e2d8'), E(10, 15, 1.6, 1, '#e6e2d8')];
} };

SPR.tern = { w: 28, h: 18, n: 4, draw(st, ph) { const sl = st === 'sleep';
  if (sl) return [E(12, 11, 5.5, 2.4, '#f4f4f6'), C(8, 10, 3, 9, 1.2, .5, '#e0e2e8'), C(10, 10, 16, 10, 1.6, 1, '#c9ced8'), E(17, 9, 2.4, 2, '#f4f4f6'), E(17.3, 7.9, 2.3, 1.2, '#18161c'), C(19, 9, 22, 10, .8, .4, '#d8302a'), PX([[11, 13], [13, 13], [11, 14], [13, 14]], '#d8302a')];
  const f = S2(ph) * 6;
  const wing = dim => C(14, 8, 9, 8 - f, 2.2, .7, '#c9ced8', { dim });
  return [wing(1), LN([[8, 9], [2, 6]], '#e8e8ec'), LN([[8, 10], [2, 12]], '#e8e8ec'), E(13, 9, 5, 2, '#f4f4f6'), E(18, 8, 2.4, 2, '#f4f4f6'), E(18.4, 6.9, 2.3, 1.2, '#18161c'), C(20, 8, 24, 9, .8, .4, '#d8302a'), wing(0)];
} };

SPR.littleauk = { w: 18, h: 14, ay: 11, n: 2, draw(st, ph) { const sl = st === 'sleep', b = sl ? 0 : step(ph, 2);
  return [E(8, 8 + b, 6, 3.4, '#1c1a24'), E(8, 10 + b, 5, 1.6, '#f2f2f4', { blend: true }), E(13, 5 + b, 2.8, 2.6, '#1c1a24'), PX([[16, 6 + b]], '#2a2830'), sleepEye(14, 4 + b, sl, { pupil: '#3a3844' }), PX([[14, 3 + b]], '#f2f2f4')];
} };

/* ---------- REEF ---------- */
SPR.clownfish = fish({ w: 20, h: 12, wag: 1.4, parts: (sl, ph, w) => {
  const band = (x) => (x >= 5 && x < 6.5) || (x >= 10 && x < 11.5) ? '#f6f6f2' : (x >= 4.3 && x < 5) || (x >= 6.5 && x < 7.2) || (x >= 9.3 && x < 10) || (x >= 11.5 && x < 12.2) ? '#1a1418' : null;
  return [Pg([[4, 6], [0, 2 + w], [1, 6], [0, 10 + w]], '#f07a18', { pat: (x) => x < 1 ? '#1a1418' : null }), E(10, 2.4, 4, 1.6, '#f07a18', { pat: (x, y) => y < 1.6 ? '#1a1418' : null }),
    E(10, 6, 7, 3.7, '#f07a18', { shiny: true, pat: band }), E(11, 8.6, 1.6, 1.2, '#f07a18', { pat: (x, y) => y > 9 ? '#1a1418' : null }), EYE(14, 4, { size: 2, iris: '#e86a10' }), PX([[17, 6]], '#c85a10')];
} });

SPR.parrotfish = fish({ w: 28, h: 16, wag: 1.6, parts: (sl, ph, w) => {
  const scl = (x, y) => (y % 2 === 0 && (x + (y % 4 ? 2 : 0)) % 4 === 0) ? '#e889b8' : null;
  return [Pg([[5, 8], [0, 2 + w], [2, 8], [0, 14 + w]], '#2fa3b8', { pat: (x, y) => x < 1.5 ? '#e889b8' : null }), E(14, 3, 7, 1.7, '#e889b8'),
    E(14, 8, 9.5, 5, '#2fb4a0', { shiny: true, pat: scl }), E(14, 12.3, 3, 1.4, '#e889b8'), E(23, 9, 2.1, 1.9, '#e9e4c8', { shiny: true }), PX([[24, 9], [23, 9]], '#9a9478'),
    LN([[20, 5], [22, 4]], '#f0a0c8'), EYE(20, 6, { size: 2, iris: '#f2c230' }), E(17, 9, 2, 1.2, '#38c8b0', { rot: .5 })];
} });

SPR.turtle = fish({ w: 40, h: 22, wag: 0, parts: (sl, ph) => {
  const fl = sl ? 0 : S2(ph) * 3, scale = pat.patches('#5a4e2e', 2.5, 4);
  return [C(25, 11, 28 - fl * .3, 17 + fl * .4, 2.2, 1.2, '#9a8e5a', { dim: 1, pat: scale }), E(7, 13, 3.2, 1.6, '#9a8e5a', { rot: .4, pat: scale }),
    E(18, 10, 11.5, 6.2, '#6c6a36', { shiny: true, pat: pat.patches('#3a3420', 5, 2) }), E(18, 15, 9, 1.4, '#c8b47a', { blend: true, noCrease: true, max: 2 }),
    C(29, 10, 31, 10, 2.6, 2.4, '#9a8e5a', { pat: scale }), E(33, 10, 3.5, 2.8, '#9a8e5a', { pat: scale }), PX([[36, 11], [36, 10]], '#4a4428'), sleepEye(34, 9, sl),
    C(25, 12, 30 + fl * .4, 18 + fl, 2.6, 1.3, '#9a8e5a', { pat: scale })];
} });

SPR.manta = { w: 54, h: 24, n: 4, draw(st, ph) { const f = S2(ph) * 4, c = '#2c3440';
  const wing = (s) => { const tx = s < 0 ? 2 : 52; return Pg([[27 + s * 4, 8], [tx, 4 + f], [tx + (s < 0 ? 3 : -3), 7 + f], [27 + s * 6, 14]], c, { pat: (x, y) => y > 10 + f * .3 && Math.abs(x - 27) > 8 ? '#e8ecf0' : (Math.abs(x - 27) > 6 && Math.abs(x - 27) < 11 && y < 9) ? '#c8ccd2' : null }); };
  return [wing(-1), wing(1), E(27, 10, 8, 4.6, c, { shiny: true }), LN([[27, 14], [27, 17], [28, 23]], '#1e242e'), C(22, 12, 19, 16, 1.4, .8, c), C(32, 12, 35, 16, 1.4, .8, c), EYE(21, 9), EYE(33, 9)];
} };

SPR.whitetip = fish({ w: 48, h: 18, wag: 1.8, parts: (sl, ph, w) => [
  Pg([[9, 9], [1, 1 + w], [4, 9], [2, 15 + w]], '#8a96a6', { pat: (x, y) => y < 3 + w ? '#f4f6f8' : null }),
  C(8, 9, 30, 9, 1.8, 4.4, '#8a96a6', { shiny: true }), E(35, 9.2, 7, 3.8, '#8a96a6', { blend: true, shiny: true }), E(26, 11.6, 11, 1.8, '#e8ecf0', { blend: true, noCrease: true, clip: (x, y) => y > 10 }),
  Pg([[20, 6], [25, 0], [27, 6]], '#8a96a6', { pat: (x, y) => y < 2 ? '#f4f6f8' : null }), Pg([[27, 11], [23, 16], [30, 12]], '#7a8696'),
  LN([[31, 8], [31, 10]], '#5a6676'), LN([[33, 8], [33, 10]], '#5a6676'), EYE(37, 8), PX([[41, 10], [40, 11]], '#5a6676')] });

SPR.moray = { w: 46, h: 16, n: 4, draw(st, ph) { const sl = st === 'sleep', c = '#7a7a3a', sp = pat.spots('#3a3a1c', .22, 1.5, 7);
  const P = []; const from = sl ? 24 : 3; let px0 = null;
  for (let x = from; x <= 34; x += 2) { const y = 9 + Math.sin(x * .25 + ph * TAU) * (sl ? 0 : 2), r = 1.4 + (x - 3) / 31 * 1.8; if (px0) P.push(C(px0[0], px0[1], x, y, px0[2], r, c, { blend: true, pat: sp })); px0 = [x, y, r]; }
  const hy = px0[1] - 1;
  P.push(E(38, hy, 5, 3.4, c, { pat: sp }), PX([[40, hy + 2], [41, hy + 2], [42, hy + 2], [43, hy + 1]], '#2a1e18'), PX([[41, hy + 3], [43, hy + 2]], '#efe6d0'), EYE(39, hy - 2, { iris: '#e8d040' }));
  return P;
} };

SPR.polyps = { w: 28, h: 22, ay: 21, n: 2, draw(st, ph) { const sl = st === 'sleep', c = '#c86a9a';
  const br = [[14, 21, 14, 11, 2.4, 1.7], [14, 14, 7, 7, 1.7, 1.2], [14, 12, 21, 5, 1.6, 1.1], [8, 9, 5, 2, 1.3, 1], [19, 7, 23, 2, 1.3, 1], [14, 11, 14, 2, 1.5, 1.1], [14, 16, 24, 12, 1.5, 1], [7, 7, 3, 9, 1.1, .9]];
  const P = br.map(b => C(...b, c, { blend: true, pat: sl ? pat.spots('#8a3a6a', .16, 1, 3) : pat.spots('#f8d0e6', .3, 1, 3 + step(ph, 2)) }));
  if (!sl) { const tips = [[5, 2], [23, 2], [14, 2], [24, 12], [3, 9], [21, 5], [7, 7]]; const k = step(ph, 2);
    for (const [x, y] of tips) P.push(PX([[x - 1, y - 1 - k], [x + 1, y - 1], [x, y - 2 + k], [x - 2, y + k], [x + 2, y - k]], '#fbe6f2')); }
  return P;
} };

SPR.crayfish = { w: 32, h: 16, ay: 14, n: 4, draw(st, ph) { const k = step(ph, 4);
  const legs = []; for (let i = 0; i < 4; i++) { const x = 15 + i * 2.4, o = ((k + i) % 2); legs.push(LN([[x, 11], [x - 1 + o, 14]], i % 2 ? '#e8d8b0' : '#d07a3a')); }
  return [...legs, Pg([[6, 10], [0, 7], [1, 10], [0, 13]], '#2f6aa0'), C(5, 10, 13, 9.6, 2.4, 3.1, '#2f6aa0', { pat: pat.stripes('#e8eef2', 3, .8, 0) }),
    E(19, 9, 6, 3.7, '#3a7ab0', { shiny: true, pat: pat.spots('#e8f0f0', .16, 1, 2) }), E(25, 8, 2.4, 2.4, '#5a9a70'),
    C(26, 7, 30, 2, 1, .5, '#d8cfc0'), LN([[30, 2], [31, 0]], '#d8cfc0'), C(26, 9, 31, 7, .8, .4, '#c8bfb0'), PX([[26, 6]], '#1a1418')];
} };

/* ---------- RAINFOREST ---------- */
SPR.jaguar = quad({ w: 46, h: 28, ay: 25, c: '#d79b3f', layHead: [1, 3], layDrop: 6,
  legs: { back: 12, front: 30, top: 15, len: 9, r1: 3, rk: 2.3, r2: 1.9, swing: 2.3, lift: 1.4, foot: '#e0b070', fr: 2 }, legPat: pat.spots('#2a1c12', .18, 1, 5),
  body: () => [E(21, 12.5, 12, 5.9, '#d79b3f', { pat: pat.rosette('#2a1c12', '#b5701f', 5) }), E(30, 13, 4.8, 5.3, '#d79b3f', { blend: true, pat: pat.rosette('#2a1c12', '#b5701f', 5) }), E(21, 16.8, 8, 1.6, '#ecd2a0', { blend: true, noCrease: true, max: 2 })],
  tail: (sl, ph) => { const s = sl ? 0 : S2(ph) * 1.2; return [C(9, 11, 4, 14, 1.4, 1.1, '#d79b3f', { pat: pat.spots('#2a1c12', .2, 1, 6) }), C(4, 14, 3 + s, 21, 1.1, 1, '#d79b3f', { blend: true, pat: pat.spots('#2a1c12', .25, 1, 6) })]; },
  head: (sl, ph, hx, hy) => sh([C(31, 11, 35, 10, 3.6, 3.3, '#d79b3f', { blend: true }), E(37, 10, 4.5, 3.9, '#d79b3f', { pat: pat.spots('#2a1c12', .14, 1, 8) }), E(40, 11.6, 2.3, 1.9, '#efd6a6', { blend: true }),
    E(34.6, 6, 1.4, 1.4, '#7a5126'), PX([[42, 10], [42, 11]], '#3a2420'), sleepEye(38, 9, sl)], hx, hy) });

SPR.sloth = { w: 28, h: 24, ax: 14, ay: 0, top: true, n: 4, draw(st, ph) { const sl = st === 'sleep', c = '#8c7a62', alg = pat.spots('#7a8a5a', .2, 2, 4), k = sl ? 0 : step(ph, 4);
  const a1 = k === 1 ? 1 : 0, a2 = k === 3 ? 1 : 0;
  return [C(7 + a1, 1, 9, 9, 1.7, 1.9, c, { pat: alg }), C(21 - a2, 1, 18, 9, 1.7, 1.9, c, { dim: 1, pat: alg }),
    C(10, 12, 9, 1, 1.8, 1.6, c, { dim: 1, pat: alg }), C(17, 12, 19, 1, 1.8, 1.6, c, { pat: alg }),
    E(14, 12, 8, 6, c, { pat: alg }),
    ...(sl ? [E(15, 16, 4, 3.4, c, { pat: alg })] : [E(20, 14, 4.2, 3.7, '#c8b89a'), E(20.5, 15.5, 2.4, 1.6, '#d8cab0', { blend: true }), LN([[17, 13], [19, 13]], '#3a2a20'), LN([[21, 13], [23, 13]], '#3a2a20'), EYE(18, 13), EYE(22, 13), PX([[20, 15]], '#2a1e18'), PX([[19, 16], [21, 16]], '#6a5a48')]),
    PX([[6 + a1, 0], [7 + a1, 0], [5 + a1, 1], [20 - a2, 0], [21 - a2, 0], [22 - a2, 1], [8, 0], [9, 0], [19, 0], [18, 0]], '#2e2620')];
} };

SPR.macaw = { w: 36, h: 32, ay: 16, n: 4, draw(st, ph) { const sl = st === 'sleep';
  if (sl) return [C(16, 15, 13, 29, 2, 1, '#d8301e', { pat: (x, y) => y > 22 ? '#2a6fd0' : null }), E(18, 10, 4, 6, '#d8301e', { rot: .25 }), E(17, 11, 3.2, 5, '#d8301e', { rot: .3, pat: (x, y) => y < 10 ? '#f2c12e' : y < 14 ? '#2a6fd0' : null }),
    E(19, 5, 3.2, 3, '#d8301e'), E(20.5, 5.4, 1.6, 1.6, '#f2ece6', { blend: true }), E(22.4, 6, 1.6, 2, '#efe4d0', { shiny: true }), PX([[22, 8]], '#2a2420'), EYE(20, 4.5, { closed: true }), PX([[17, 16], [19, 16]], '#6a6060')];
  const f = S2(ph) * 7;
  const wing = dim => Pg([[14, 13], [21, 13], [12, 13 - f], [9, 14 - f * .8]], '#d8301e', { dim, pat: (x, y) => { const d = Math.hypot(x - 17, y - 13); return d > 7 ? '#2a6fd0' : d > 4.5 ? '#f2c12e' : null; } });
  return [wing(1), C(13, 15, 1, 19, 1.6, .6, '#d8301e', { pat: (x) => x < 7 ? '#2a6fd0' : null }), E(18, 14, 6, 2.6, '#d8301e', { shiny: true }), E(25, 12.5, 2.8, 2.6, '#d8301e'), E(26, 12.6, 1.4, 1.4, '#f2ece6', { blend: true }), E(28.5, 13.5, 1.5, 1.6, '#efe4d0', { shiny: true }), EYE(25.6, 12), wing(0)];
} };

SPR.toucan = { w: 26, h: 24, ay: 13, n: 2, draw(st, ph) { const sl = st === 'sleep', t = sl ? 0 : step(ph, 2);
  const body = [C(5, 15, 4, 22, 1.7, 1.2, '#18161e'), E(6, 10, 3.8, 5.6, '#18161e', { rot: .15 }), PX([[6, 15], [7, 15]], '#d8342a'), PX([[6, 13], [8, 13]], '#5a5a60')];
  if (sl) return [...body, E(8, 7, 3.6, 3.2, '#18161e'), C(8, 5, 1, 9, 2.4, 1.1, '#18161e', { pat: (x, y) => y < 6 ? '#e8c43a' : null }), EYE(9, 6, { closed: true })];
  return [...body, E(8, 7, 2.6, 2.6, '#f4f0e4'), E(7, 4, 3, 2.8, '#18161e'), C(9, 4.5 - t * .5, 21, 6.5 - t, 2.6, 1.1, '#18161e', { shiny: true, pat: (x, y) => y < 4.6 - t * .5 ? '#e8c43a' : null }), E(10, 4.5, 1.2, 2.5, '#e8c43a'), EYE(8, 3, { ring: '#3a8ad8' })];
} };

SPR.howler = { w: 24, h: 28, ay: 19, n: 4, draw(st, ph) { const sl = st === 'sleep', fur = pat.stripes('#c8662e', 3, 1, .6, .5), k = step(ph, 4), howl = !sl && (k === 1 || k === 2);
  const P = [C(6, 15, 4, 22, 1.3, 1, '#9c3e1e'), C(4, 22, 6, 26, 1, .9, '#9c3e1e'), E(11, 11, 5.6, 6.6, '#a8441e', { pat: fur }), C(9, 15, 13, 18, 2.2, 1.6, '#9c3e1e'), C(14, 10, 17, 18, 1.6, 1.2, '#9c3e1e')];
  if (sl) return [...P, E(14, 9, 3.6, 3.2, '#8a321a'), EYE(15, 8, { closed: true })];
  return [...P, E(15, 6, 3.7, 3.4, '#8a321a'), E(17, 7.2, 2, 2.4, '#2a1a14', { blend: true }), E(16, 10 + (howl ? 1 : 0), 2.6, 2 + (howl ? 1 : 0), '#8a321a'), EYE(17, 6, { iris: '#e0a030' }), howl ? PX([[18, 9], [18, 10]], '#120a08') : PX([[18, 9]], '#3a2018')];
} };

SPR.dartfrog = { w: 13, h: 9, ay: 8, n: 2, draw(st, ph) { const k = st === 'sleep' ? 0 : step(ph, 2), str = pat.stripes('#f0d020', 2.6, 1, Math.PI / 2, .6);
  return [E(3, 6.5, 2.2 + k, 1.2, '#3a7ad8', { shiny: true, pat: pat.spots('#141218', .2, 1, 2) }), E(6, 4.6, 4.2, 2.6, '#1a1820', { shiny: true, pat: str }), E(9.6, 3.8, 2.2, 1.8, '#1a1820', { shiny: true, pat: str }),
    E(9, 6.6, 1.2, 1, '#3a7ad8', { shiny: true }), E(10.4, 2.6, 1, 1, '#1a1820', { shiny: true })];
} };

SPR.milkfrog = { w: 17, h: 12, ay: 11, n: 2, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 2), band = pat.stripes('#6a4a30', 3.2, 1.4, Math.PI / 2, .8);
  return [E(4, 8.5 - k * .5, 2.8 + k * .6, 1.6, '#b8a890', { pat: band }), E(8, 6.5, 6, 3.4, '#cfc3ae', { shiny: true, pat: band }), E(12.6, 5.2, 2.8, 2.4, '#cfc3ae', { shiny: true }), E(12, 8.8, 1.5, 1.2, '#b8a890'),
    sl ? EYE(13, 3.8, { closed: true }) : EYE(12.6, 3, { size: 2, iris: '#d8b040' })];
} };

SPR.nightmonkey = { w: 20, h: 26, ay: 17, n: 2, draw(st, ph) { const sl = st === 'sleep', c = '#8a8478';
  const P = [C(5, 14, 3, 24, 1.2, 1.4, '#6a6458', { pat: (x, y) => y > 21 ? '#1e1c1a' : null }), E(8, 10, 4.7, 5.7, c, { pat: pat.spots('#a49c8c', .15, 1, 2) }), E(9.6, 12, 2.4, 3.6, '#d8a060', { blend: true }), C(9, 14, 12, 16.5, 2, 1.5, c)];
  if (sl) return [...P, E(10, 7, 3.4, 3.2, c), EYE(11, 7, { closed: true })];
  const b = step(ph, 2);
  return [...P, E(11, 4.6 + b * .5, 3.7, 3.4, c), E(12.4, 5 + b * .5, 2.4, 2.3, '#d8d0bc', { blend: true }), LN([[10, 2 + b], [14, 2 + b]], '#1e1c1a'), EYE(12, 4 + b, { size: 2, iris: '#e8a030' }), PX([[15, 6 + b]], '#2a2420')];
} };

SPR.morpho = { w: 20, h: 16, n: 4, draw(st, ph) { const sl = st === 'sleep', k = sl ? 2 : step(ph, 4);
  const edge = (x, y, n) => Math.hypot(n[0], n[1]) > .78 ? '#14141c' : null;
  const body = C(10, 4, 10, 12, .8, .6, '#2a2420');
  if (k === 2) return [Pg([[10, 10], [4, 2], [11, 1]], '#8a6a40', { pat: (x, y) => Math.hypot(x - 7.5, y - 4.5) < 1.6 ? (Math.hypot(x - 7.5, y - 4.5) < .8 ? '#1a1418' : '#e8c050') : null }), body, LN([[10, 4], [12, 1]], '#2a2420')];
  const s = k === 0 ? 1 : .55;
  return [E(10 - 4 * s, 6, 5 * s, 4, '#2a8ae8', { shiny: true, pat: edge }), E(10 + 4 * s, 6, 5 * s, 4, '#2a8ae8', { shiny: true, pat: edge }), E(10 - 3 * s, 10.5, 3.6 * s, 3, '#2272d0', { shiny: true, pat: edge }), E(10 + 3 * s, 10.5, 3.6 * s, 3, '#2272d0', { shiny: true, pat: edge }),
    body, LN([[10, 4], [8, 0]], '#2a2420'), LN([[10, 4], [12, 0]], '#2a2420')];
} };

/* ---------- DEEP SEA ---------- */
SPR.lanternfish = fish({ w: 15, h: 9, wag: 1, parts: (sl, ph, w) => [Pg([[3, 4.5], [0, 1 + w], [0, 8 + w]], '#2e3c58'), E(7.5, 4.5, 5.6, 2.5, '#3a4a68', { shiny: true }), EYE(10, 3, { size: 2 }),
  PX([[4, 6], [6, 6], [8, 6], [10, 6], [12, 5]], '#7fe8ff', { glow: true })] });

SPR.humboldt = { w: 42, h: 16, n: 4, draw(st, ph) { const k = step(ph, 4), flash = k === 2, c = flash ? '#ead6cc' : '#c8402e';
  const arms = []; for (let i = 0; i < 5; i++) { const by = 6 + i, wv = Math.sin(ph * TAU + i) * 1.5; arms.push(LN([[27, by], [33, by + (i - 2) * .6 + wv * .5], [40, by + (i - 2) * 1.2 + wv]], flash ? '#f2e2d8' : '#d85a44')); }
  return [...arms, Pg([[3, 8], [6, 3], [9, 8], [6, 13]], c), C(4, 8, 22, 8, 2.5, 4.2, c, { shiny: true, pat: pat.spots(flash ? '#c8402e' : '#8a2018', .25, 1, 3 + k) }), E(25, 8, 3, 3.3, c), EYE(24.5, 6.5, { size: 2, iris: '#e8e0c0' })];
} };

SPR.krill = { w: 10, h: 6, n: 2, draw(st, ph) { const k = step(ph, 2);
  return [LN([[3, 4], [2, 5 + k]], '#f0b0b0'), LN([[5, 4], [5 - k, 5]], '#f0b0b0'), C(1, 2.5, 7, 2.5, .8, 1.3, '#e88a8a', { shiny: true }), PX([[8, 2]], '#1a1010'), PX([[9, 1], [9, 3]], '#f0b0b0'), PX([[4, 3]], '#8ad8ff', { glow: true })];
} };

SPR.angler = { w: 28, h: 24, ay: 22, n: 2, draw(st, ph) { const k = step(ph, 2);
  return [Pg([[4, 13], [0, 8], [0, 18]], '#2a2632'), E(12, 14, 9, 7.6, '#2a2632', { pat: pat.spots('#3a3444', .2, 1, 2) }), E(10, 19, 3, 1.4, '#3a3444'),
    Pg([[14, 15], [22, 12], [22, 19]], '#120e14', { flat: true }), PX([[16, 14], [18, 13], [20, 12], [17, 18], [19, 18], [21, 18]], '#f0ece0'),
    EYE(15, 10, { iris: '#c8d8e8' }), LN([[13, 7], [15, 2], [20, 1], [22, 3 + k]], '#5a5060'), E(22, 4.5 + k, 1.5, 1.5, '#e8f070', { glow: true, shiny: true })];
} };

SPR.barreleye = { w: 22, h: 14, n: 2, draw(st, ph) { const k = step(ph, 2);
  return [Pg([[4, 9], [0, 6], [0, 12]], '#3a3640'), Pg([[9, 10], [4, 14 - k], [11, 11]], '#5a5664'), E(10, 9, 7, 3.6, '#3a3640', { shiny: true }), LN([[11, 6], [13, 3], [17, 2], [20, 4], [20, 7]], '#9ad8e0'),
    E(15.5, 4.6, 1.3, 2, '#58e070', { shiny: true, glow: true }), PX([[18, 9], [17, 10]], '#1a1820')];
} };

SPR.vampsquid = { w: 28, h: 20, n: 2, draw(st, ph) { const k = step(ph, 2), o = k ? 2 : 0;
  return [E(6, 3, 2.2, 1.4, '#7a1f3a'), Pg([[14, 7], [26, 3 - o], [25, 17 + o], [14, 13]], '#5a1428', { pat: pat.stripes('#3a0a18', 3, .8, 1.3) }), E(10, 8, 6, 5.6, '#7a1f3a', { shiny: true }),
    EYE(12, 7, { size: 2, iris: '#5ab0ff' }), PX([[26, 3 - o], [25, 17 + o], [26, 10]], '#7fe8ff', { glow: true })];
} };

SPR.larvacean = { w: 34, h: 30, n: 2, alpha: .75, draw(st, ph) { const k = step(ph, 2), P = [];
  for (let r = 0; r < 3; r++) { const rx = 15 - r * 4, ry = 13 - r * 3.4, pts = []; for (let a = 0; a <= 16; a++) { const t = a / 16 * TAU; pts.push([17 + Math.cos(t) * rx, 15 + Math.sin(t) * ry]); } P.push(LN(pts, r === 0 ? '#5a8ea0' : '#86c0d0')); }
  P.push(E(17, 15, 4, 3, '#cfe8f0', { shiny: true }), E(17, 15, 2, 1.4, '#f0a0b8'), LN([[15, 15], [13, 14 + k], [11, 16 - k]], '#f0a0b8'));
  return P;
} };

const FRAMES = {};
function frame(key, st, f) { const d = SPR[key]; const n = st === 'sleep' ? 2 : d.n; f = ((f % n) + n) % n; const k = key + '|' + st + '|' + f; if (FRAMES[k]) return FRAMES[k]; return FRAMES[k] = raster(d.w, d.h, d.draw(st, f / n), d.opt); }

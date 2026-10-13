/* ================= More creatures: London, Antarctica, Sahara + seasonal coats ================= */
function foxLike(o) { const oy = o.oy || 0, es = o.ears || 1;
  return quad({ w: 36, h: 26 + oy, ay: 23 + oy, c: o.c, curl: true, layDrop: 3, layHead: [-1, 3],
    legs: { back: 11, front: 23, top: 15 + oy, len: 7, r1: 1.9, rk: 1.4, r2: 1.1, swing: 2.1, lift: 1.3, c: o.legC, foot: o.legC, fr: 1.3 },
    body: () => sh([E(17, 12, 8.4, 4.5, o.c), E(18, 15, 6, 1.6, o.belly, { blend: true, noCrease: true, max: 2 })], 0, oy),
    tail: (sl, ph) => sh(sl ? [E(18, 15, 9.5, 3, o.c, { pat: (x) => x > 25 ? o.tip : null })] : [C(10, 11, 2, 9 + S2(ph) * .9, 2.6, 3.2, o.tailC || o.c, { pat: (x) => x < 3.5 ? o.tip : null })], 0, oy),
    head: (sl, ph, hx, hy) => sh([C(23, 11, 27, 9, 3.2, 2.6, o.c, { blend: true }), E(27.5, 9, 3.1, 2.7, o.c), C(29, 10, 33, 10.6, 1.7, .9, o.c, { blend: true }), E(29.5, 11.4, 2.2, 1.1, o.belly, { blend: true }),
      PX([[33, 10]], '#1a1214'), Pg([[25, 7], [25.4, 7 - 4.2 * es], [28.2, 6.2]], o.earC, { pat: (x, y) => es > 1 && x > 25.8 && x < 27.2 && y < 5 ? '#f0b8a8' : null }), sleepEye(28, 8, sl)], hx, hy + oy) });
}
SPR.redfox = foxLike({ c: '#c8642a', belly: '#f2ece0', legC: '#2a1e1a', tip: '#f4f0e8', earC: '#a84a22' });
SPR.arcticfox_s = foxLike({ c: '#6e5e4e', belly: '#d8ccb4', legC: '#5a4a3c', tip: '#8a7a68', earC: '#5a4a3c' });
SPR.fennec = foxLike({ c: '#e6cc98', belly: '#f8f0dc', legC: '#d8b880', tip: '#2a2018', earC: '#e6cc98', ears: 2, oy: 4 });

SPR.ptarmigan_s = { w: 18, h: 18, ay: 16, n: 2, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 2);
  const mott = (x, y) => hash(x, y, 9) < .4 ? '#5a4028' : hash(x, y, 3) < .3 ? '#b89a6a' : null;
  return [E(8, 10, 5.6, 4.6, '#8a6a48', { pat: mott }), E(4, 9, 2.2, 2.4, '#6a5038', { rot: .5 }), E(8, 13, 4, 1.4, '#f2f0ea', { blend: true }),
    ...(sl ? [E(10, 8, 2.8, 2.6, '#8a6a48', { pat: mott }), EYE(11, 7, { closed: true })] : [E(12, 6 + k, 2.8, 2.6, '#8a6a48', { pat: mott }), PX([[14, 6 + k]], '#1a1820'), PX([[12, 4 + k]], '#d8443a'), EYE(12, 5 + k)]),
    E(7, 15, 1.6, 1, '#e6e2d8'), E(10, 15, 1.6, 1, '#e6e2d8')]; } };

/* ---------- LONDON ---------- */
SPR.hedgehog = { w: 20, h: 13, ay: 12, n: 4, draw(st, ph) { const sl = st === 'sleep', sp = (x, y) => hash(x, y, 3) < .42 ? '#dccca8' : hash(x, y, 5) < .3 ? '#3a2a1e' : null;
  if (sl) return [E(9, 7.5, 6.4, 4.6, '#7a6048', { pat: sp })];
  const k = step(ph, 4);
  return [PX([[5 + k % 2, 11], [6 + k % 2, 11], [11 - k % 2, 11], [12 - k % 2, 11]], '#5a4434'), E(8.5, 7, 6.4, 4.4, '#7a6048', { pat: sp }), E(14, 8.6, 2.9, 2.1, '#c8a888'), C(14.5, 9, 18, 9.6, 1.1, .6, '#c8a888', { blend: true }),
    PX([[18, 9]], '#1a1214'), PX([[12, 6]], '#a88868'), EYE(15, 8)]; } };
SPR.pipistrelle = { w: 20, h: 12, n: 4, draw(st, ph) { const f = S2(ph) * 4;
  const wing = s => { const q = v => 10 + s * v; return Pg([[q(1), 5], [q(9), 2 - f], [q(8), 5 - f * .5], [q(9), 8 - f * .2], [q(6), 7], [q(3), 8], [q(1), 7]], '#3e2c24', { pat: (x, y) => (Math.abs(x - 10) === 5 || Math.abs(x - 10) === 7) && y > 3 ? '#5e4434' : null }); };
  return [wing(-1), wing(1), E(10, 5.6, 2.2, 2.2, '#6a4a34'), E(10, 3.4, 1.7, 1.5, '#6a4a34'), PX([[9, 1], [11, 1]], '#4a3428'), PX([[9, 3], [11, 3]], '#14100e')]; } };
SPR.pigeon = { w: 22, h: 17, ay: 16, n: 4, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 4), hx = [0, 1, 2, 1][k];
  const P = [C(5, 10, 1, 11, 2, 1.5, '#7a8096', { pat: (x) => x < 2.5 ? '#2a2c38' : null }), E(10, 10, 6.2, 3.9, '#9298ac'), E(9, 9.5, 4.6, 2.8, '#a8aec0', { pat: (x, y) => (x === 7 || x === 10) && y > 9 ? '#2a2c38' : null }),
    PX([[9 + k % 2, 14], [12 - k % 2, 14], [9 + k % 2, 15], [12 - k % 2, 15]], '#d87a7a')];
  if (sl) return [...P, E(14, 7.6, 2.8, 2.6, '#6a8a8a', { pat: (x, y) => (x + y) % 3 === 0 ? '#8a6a9a' : null }), E(14.5, 6, 2.2, 2, '#7a8094'), EYE(15, 5, { closed: true })];
  return [...P, E(14, 7, 2.6, 2.8, '#6a8a8a', { pat: (x, y) => (x + y) % 3 === 0 ? '#8a6a9a' : null }), E(15.5 + hx * .5, 4.6, 2.2, 2, '#7a8094'), PX([[17 + Math.round(hx * .5), 5], [18 + Math.round(hx * .5), 5]], '#2a2a30'), PX([[17 + Math.round(hx * .5), 4]], '#e8e4e0'), EYE(16 + Math.round(hx * .5), 4, { iris: '#e86a20' })]; } };
SPR.robin = { w: 15, h: 14, ay: 13, n: 2, draw(st, ph) { const sl = st === 'sleep', sing = !sl && step(ph, 2) === 1;
  const P = [C(4, 8, 0, 6, 1.3, .8, '#7a5a3a'), E(6.5, 8, sl ? 5 : 4.4, sl ? 4 : 3.6, '#8a6a48'), E(8.5, 8.6, 2.8, 2.8, '#e0602a', { blend: true }), PX([[6, 12], [8, 12], [6, 13], [8, 13]], '#5a4a3a')];
  if (sl) return [...P, E(9, 6, 2.6, 2.4, '#8a6a48'), E(10, 6.6, 1.6, 1.6, '#e0602a', { blend: true }), EYE(10, 5, { closed: true })];
  return [...P, E(9.5, 5, 2.6, 2.4, '#8a6a48'), E(10.6, 5.6, 1.6, 1.6, '#e0602a', { blend: true }), sing ? PX([[13, 4], [13, 6]], '#2a2018') : PX([[13, 5]], '#2a2018'), EYE(10, 4)]; } };
SPR.tawnyowl = { w: 20, h: 24, ay: 22, n: 2, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 2), st2 = (x, y) => hash(x, y, 8) < .18 ? '#4a2e1a' : hash(x, y, 9) < .12 ? '#c89a68' : null;
  return [E(10, 14, 5.8, 7.2, '#8a5a32', { pat: st2 }), E(7, 14, 3, 5.6, '#7a4e2c', { pat: st2 }), E(10, 6, 5.2, 4.6, '#8a5a32', { pat: st2 }), E(10.5 + k * .5, 6.6, 3.8, 3.1, '#b88a58', { blend: true }),
    PX([[11 + k, 9]], '#d8c8a0'), EYE(8 + k, 5, { size: 2, closed: sl }), EYE(12 + k, 5, { size: 2, closed: sl }), PX([[8, 21], [9, 21], [11, 21], [12, 21]], '#c8a060')]; } };
SPR.squirrel = { w: 22, h: 19, ay: 18, n: 4, draw(st, ph) { const k = step(ph, 4), fl = k % 2, fur = (x, y) => hash(x, y, 2) < .3 ? '#c8c4bc' : null;
  return [C(8, 14, 3, 8 - fl, 2.6, 3.3, '#9a9a98', { pat: fur }), C(3, 8 - fl, 5, 2 - fl, 3.3, 2.4, '#9a9a98', { pat: fur, blend: true }), E(11, 12, 4.6, 4, '#8c8c8a', { rot: -.4 }), E(12.6, 13, 2, 3, '#e8e4dc', { blend: true }),
    E(10, 16, 2.8, 1.7, '#7a7a78'), E(15, 8, 2.8, 2.4, '#8c8c8a'), PX([[14, 5]], '#7a7a78'), PX([[18, 8]], '#1a1a1c'), PX([[14, 12], [15, 12]], '#6a6a68'), EYE(16, 7)]; } };
SPR.parakeet = { w: 28, h: 26, ay: 13, n: 4, draw(st, ph) { const sl = st === 'sleep';
  if (sl) return [C(9, 12, 6, 24, 1.2, .5, '#46b84a', { pat: (x, y) => y > 19 ? '#3a8ad8' : null }), E(10, 8, 3.3, 5, '#46b84a', { rot: .15 }), E(9, 9, 2.6, 4, '#3a9a3e'), E(12, 4, 2.6, 2.4, '#46b84a'), E(14.3, 4.6, 1.2, 1.4, '#d8302a', { shiny: true }), LN([[11, 6], [13, 7]], '#1a1a20'), EYE(12, 3, { closed: true }), PX([[9, 13], [11, 13]], '#6a6060')];
  const f = S2(ph) * 6;
  const wing = dim => Pg([[11, 9], [17, 9], [10, 9 - f], [8, 10 - f * .8]], '#46b84a', { dim, pat: (x, y) => Math.hypot(x - 14, y - 9) > 5 ? '#2a7a3a' : null });
  return [wing(1), C(10, 11, 0, 13, 1.4, .5, '#46b84a', { pat: (x) => x < 5 ? '#3a8ad8' : null }), E(15, 10, 5, 2.2, '#46b84a', { shiny: true }), E(21, 9, 2.4, 2.2, '#46b84a'), E(23.4, 9.6, 1.1, 1.3, '#d8302a', { shiny: true }), LN([[20, 11], [22, 11]], '#1a1a20'), EYE(21, 8), wing(0)]; } };

/* ---------- ANTARCTICA ---------- */
SPR.emperor = { w: 20, h: 29, ay: 28, n: 4, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 4), dx = [0, .6, 0, -.6][k];
  const P = [PX([[7, 28], [8, 28], [12, 28], [13, 28]], '#2a2a30'), C(6.5 + dx, 13, 5.5 + dx - (k === 1 ? 1 : 0), 21, 1.4, 1, '#26262e', { dim: 1 }), E(10 + dx, 17, 6, 10, '#1c1c26'), E(11.6 + dx, 18, 4.2, 8.6, '#f2f0e8', { blend: true }), E(12 + dx, 10.5, 2.2, 2.2, '#f4e2a0', { blend: true })];
  const hy = sl ? 2.5 : 0;
  return [...P, E(10.5 + dx, 6.5 + hy, 3.4, 3.2, '#1c1c26'), E(11.8 + dx, 8 + hy, 1.4, 1.8, '#f0b830', { blend: true }), C(12.5 + dx, 6.6 + hy, 17 + dx, 8.2 + hy, .9, .5, '#2a2a30'), PX([[14 + Math.round(dx), Math.round(7.6 + hy)]], '#e88a30'), EYE(12 + dx, 5.6 + hy, { closed: sl, pupil: '#3a3a44' }), C(13.5 + dx, 13, 15 + dx, 21, 1.4, 1, '#26262e')]; } };
SPR.emperorchick = { w: 14, h: 18, ay: 17, n: 2, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 2);
  return [PX([[5, 17], [8, 17]], '#2a2a30'), E(7, 11, 4.8, 6, '#a4aab4', { pat: pat.spots('#c4c8d0', .25, 1, 3) }), E(7.5, 4.6 + (sl ? 1.5 : 0), 3.2, 3, '#1c1c26'), E(8.5, 5.2 + (sl ? 1.5 : 0), 2, 2, '#f2f2f4', { blend: true }), PX([[11, 5 + (sl ? 1 : 0) + k]], '#2a2a30'), EYE(9, 4.6 + (sl ? 1.5 : 0), { closed: sl })]; } };
SPR.chinstrap = { w: 16, h: 23, ay: 22, n: 4, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 4), dx = [0, .5, 0, -.5][k];
  return [PX([[6, 22], [7, 22], [9, 22], [10, 22]], '#e89aa0'), C(5 + dx, 10, 4 + dx, 17, 1.2, .8, '#22222c', { dim: 1 }), E(8 + dx, 14, 4.8, 7.6, '#1c1c26'), E(9.4 + dx, 15, 3.4, 6.6, '#f4f2ec', { blend: true }),
    E(9 + dx, 5.4, 3, 2.8, '#1c1c26'), E(10 + dx, 6.2, 2.2, 2, '#f4f2ec', { blend: true }), LN([[8 + dx, 7.6], [11 + dx, 8.4]], '#1c1c26'), C(11 + dx, 5.4, 14 + dx, 6, .7, .4, '#1a1a20'), EYE(10 + dx, 4.6, { closed: sl, pupil: '#3a2a20' }), C(11 + dx, 10, 12 + dx, 17, 1.2, .8, '#22222c')]; } };
SPR.weddell = fish({ w: 42, h: 16, ay: 13, wag: .8, parts: (sl, ph, w) => [
  Pg([[6, 8], [0, 4 + w], [2, 8], [0, 12 + w], [6, 10]], '#3e4656'), E(19, 8.5, 15, 5, '#4f5868', { pat: pat.spots('#9aa4b0', .16, 2, 6) }), E(19, 11.3, 12, 1.8, '#6a7484', { blend: true, noCrease: true }),
  E(33, 8, 4.6, 4, '#4f5868'), E(36.2, 9.2, 2, 1.7, '#5a6474', { blend: true }), PX([[38, 9]], '#1a1a20'), PX([[36, 11], [37, 11]], '#2a2e38'), E(26, 12, 2.6, 1.2, '#3e4656', { rot: .6 }), sleepEye(34, 6.6, sl, { size: 2 })] });
SPR.leopardseal = fish({ w: 50, h: 16, ay: 13, wag: 1.2, parts: (sl, ph, w) => [
  Pg([[7, 9], [0, 5 + w], [2, 9], [0, 13 + w], [7, 11]], '#5a606c'), C(6, 9, 32, 9, 2.4, 5, '#7a808c', { shiny: true, pat: pat.spots('#4a505c', .1, 1, 4) }), E(24, 11.6, 11, 1.8, '#b8bec8', { blend: true, noCrease: true, pat: pat.spots('#5a606c', .2, 1, 5) }),
  E(38, 8.4, 6.6, 4.2, '#7a808c', { blend: true }), LN([[38, 10], [44, 10]], '#2a2e38'), PX([[45, 9]], '#1a1a20'), C(28, 11, 33, 15, 1.6, 1, '#5a606c'), sleepEye(40, 7, sl)] });
SPR.snowpetrel = { w: 24, h: 14, ay: 11, n: 4, draw(st, ph) { const sl = st === 'sleep';
  if (sl) return [E(11, 8, 5, 3, '#f8f8fa'), E(15.5, 5.5, 2.4, 2.2, '#f8f8fa'), PX([[18, 6]], '#1a1a20'), EYE(16, 5, { closed: true }), PX([[10, 11], [12, 11]], '#3a3a44')];
  const f = S2(ph) * 5, wing = dim => C(12, 7, 7, 7 - f, 2.2, .8, '#eef0f4', { dim });
  return [wing(1), C(7, 8, 2, 8, 1.4, .8, '#f4f4f6'), E(12, 8, 5, 2, '#f8f8fa'), E(17, 7, 2.2, 2, '#f8f8fa'), PX([[19, 7], [20, 7]], '#1a1a20'), EYE(17, 6), wing(0)]; } };
SPR.orca = fish({ w: 58, h: 22, ay: 13, wag: 1.6, parts: (sl, ph, w) => [
  Pg([[9, 13], [1, 9 + w], [3, 13], [1, 18 + w]], '#16161c'), C(8, 13, 40, 13, 2, 6.2, '#16161c', { shiny: true }), E(45, 13.5, 8, 5, '#16161c', { blend: true, shiny: true }),
  E(38, 17, 13, 2, '#f4f4f6', { clip: (x, y) => y > 16 }), E(45, 11, 2.8, 1.2, '#f4f4f6', { rot: -.2 }), E(29, 8.4, 4.4, 1.5, '#8a8a96'), Pg([[25, 8], [28, 0], [30, 8]], '#16161c'), E(39, 19, 3.2, 1.4, '#16161c', { rot: .6 }), PX([[47, 12]], '#0a0a0e')] });

/* ---------- SAHARA ---------- */
SPR.camel = quad({ w: 52, h: 50, ay: 48, c: '#c89a62', layDrop: 13, layHead: [0, -7],
  legs: { back: 15, front: 30, top: 30, len: 16, r1: 2.6, rk: 1.9, r2: 1.4, swing: 2.2, lift: 1.5, foot: '#a87a48', fr: 2 },
  body: () => [E(22, 26, 12.5, 7, '#c89a62', { pat: pat.spots('#b88a52', .1, 1, 4) }), E(21, 18.5, 7, 6, '#c89a62', { blend: true })],
  tail: (sl, ph) => [C(10, 24, 9 + (sl ? 0 : S2(ph) * .5), 34, .8, .6, '#b88a52'), E(9, 35, .9, 1.6, '#6a4a2a')],
  head: (sl, ph, hx, hy) => [C(32, 25, 38 + hx, 15 + hy, 3.8, 2.6, '#c89a62', { blend: true }), C(38 + hx, 15 + hy, 41 + hx, 10 + hy, 2.6, 2.3, '#c89a62', { blend: true }),
    E(43.5 + hx, 10 + hy, 4.2, 2.7, '#c89a62', { rot: .2 }), E(47 + hx, 11.6 + hy, 1.9, 1.6, '#b88a52', { blend: true }), PX([[41 + hx, 7 + hy]], '#a87a48'), PX([[49 + hx, 11 + hy]], '#3a2818'), sleepEye(44 + hx, 9 + hy, sl)] });
SPR.viper = { w: 30, h: 10, ay: 8, n: 4, draw(st, ph) { const sp = pat.spots('#a07a4a', .22, 2, 5), P = []; let p0 = null;
  for (let x = 2; x <= 21; x += 2) { const y = 5.5 + Math.sin(x * .42 + ph * TAU) * 2, r = 1 + (x - 2) / 19 * .9; if (p0) P.push(C(p0[0], p0[1], x, y, p0[2], r, '#d8b67a', { blend: true, pat: sp })); p0 = [x, y, r]; }
  const hy = p0[1] - 1;
  P.push(E(24, hy, 2.8, 1.9, '#d8b67a', { pat: sp }), PX([[24, hy - 2], [25, hy - 2]], '#b89660'), EYE(25, hy - 1, { iris: '#c8a040' }));
  if (step(ph, 4) === 2) P.push(PX([[27, hy + 1], [28, hy + 1]], '#d8302a'));
  return P; } };
SPR.silverant = { w: 10, h: 6, ay: 5, n: 2, draw(st, ph) { const k = step(ph, 2);
  return [LN([[3, 3], [2 + k, 5]], '#8a8e98'), LN([[5, 3], [6 - k, 5]], '#8a8e98'), LN([[6, 3], [7 + k, 5]], '#8a8e98'), E(2, 2.8, 1.8, 1.4, '#c8ccd4', { shiny: true }), E(4.8, 2.8, 1.2, .9, '#b8bcc6', { shiny: true }), E(7.2, 2.4, 1.1, 1, '#c8ccd4', { shiny: true }), PX([[9, 1]], '#8a8e98')]; } };
SPR.jerboa = { w: 18, h: 19, ay: 18, n: 2, draw(st, ph) { const k = st === 'sleep' ? 0 : step(ph, 2), u = k * 2;
  return [C(5, 12 - u, 1, 15, .5, .4, '#d8b888'), E(1, 15.6, 1, 1, '#f4ecd8'), PX([[0, 16]], '#1a1412'), E(8, 11 - u, 3.6, 3.2, '#d8b888'), E(9, 12 - u, 2, 2.2, '#f4ecd8', { blend: true }),
    C(7, 13 - u, 10, 17 - k, 1.4, .6, '#d8b888'), C(10, 17 - k, 13, 17.4 - k, .6, .5, '#d8b888'), E(11, 7.5 - u, 2.6, 2.4, '#d8b888'), C(10, 6 - u, 9, 2 - u, .9, .7, '#e8c8a8'), EYE(12, 7 - u, { size: 2 })]; } };
SPR.scorpion = { w: 18, h: 12, ay: 11, n: 4, uv: true, draw(st, ph) { const k = step(ph, 4), legs = [];
  for (let i = 0; i < 4; i++) { const x = 7 + i * 2, o = (k + i) % 2; legs.push(LN([[x, 9], [x - 1 + o, 11]], '#a88a40')); }
  return [...legs, C(5, 8, 3, 5, 1.2, 1, '#c8a850'), C(3, 5, 4, 2, 1, .9, '#c8a850', { blend: true }), C(4, 2, 7, 1.5, .9, .7, '#c8a850', { blend: true }), PX([[8, 2], [8, 3]], '#7a5a20'),
    E(9.5, 8, 4.4, 2, '#c8a850', { shiny: true }), C(13, 8, 15.5, 7, .8, .6, '#c8a850'), E(16, 6.4, 1.5, 1, '#c8a850', { shiny: true }), PX([[12, 7]], '#2a1e10')]; } };
SPR.eagleowl = { w: 20, h: 25, ay: 23, n: 2, draw(st, ph) { const sl = st === 'sleep', k = sl ? 0 : step(ph, 2), s2 = (x, y) => hash(x, y, 8) < .2 ? '#7a5a30' : null;
  return [E(10, 15, 5.8, 7.2, '#c8a070', { pat: s2 }), E(7, 15, 3, 5.6, '#b08a5a', { pat: s2 }), E(10, 7, 5, 4.4, '#c8a070', { pat: s2 }), E(10.4 + k * .4, 7.6, 3.6, 2.9, '#e0c49a', { blend: true }),
    PX([[6, 3], [7, 2], [13, 2], [14, 3]], '#8a6a40'), PX([[11 + k, 10]], '#3a2a20'), EYE(8 + k, 6, { size: 2, iris: '#f08a20', closed: sl }), EYE(12 + k, 6, { size: 2, iris: '#f08a20', closed: sl }), PX([[8, 22], [9, 22], [11, 22], [12, 22]], '#c8a060')]; } };

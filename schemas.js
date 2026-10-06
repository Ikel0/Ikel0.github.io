// Schémas des grands projets : ce que fait chaque projet, de gauche à droite, en SVG
// sans dépendance. Les nœuds, les arêtes et les scénarios viennent d'un JSON par projet
// (media/schemas/). Rien ne bouge au repos : survoler ou focaliser un nœud ou un scénario
// éclaire son trajet, et la ligne de lecture dit ce qui se passe. Sous 760 px, le schéma
// devient une liste d'étapes.

// Enveloppé : lineage.js déclare aussi init et renderList dans la portée globale.
(() => {
const NS = 'http://www.w3.org/2000/svg';
const narrow = matchMedia('(max-width: 760px)');
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'fr';

document.querySelectorAll('[data-schema]').forEach(init);

async function init(root) {
  let data;
  try {
    data = await (await fetch(root.dataset.schema)).json();
  } catch {
    return; // la légende et la ligne de lecture en HTML restent affichées
  }
  const stage = root.querySelector('.schema-stage');
  const readout = root.querySelector('.schema-readout');
  const bar = root.querySelector('.schema-scenarios');
  const idle = readout.textContent;
  const word = v => (v && typeof v === 'object' ? v[lang] : v) || '';

  const nodes = data.nodes.map(n => ({ ...n, lines: word(n.label).split('\n'), up: new Set(), down: new Set() }));
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const edges = data.edges.map(([a, b, kind]) => ({ a: byId[a], b: byId[b], cut: kind === 'cut' }));
  edges.forEach(e => { if (!e.cut) { e.b.up.add(e.a); e.a.down.add(e.b); } });
  const reach = (start, key) => {
    const seen = new Set([start]); const stack = [start];
    while (stack.length) for (const m of stack.pop()[key]) if (!seen.has(m)) { seen.add(m); stack.push(m); }
    return seen;
  };
  nodes.forEach(n => { n.trail = new Set([...reach(n, 'up'), ...reach(n, 'down')]); });
  const scenarios = data.scenarios.map(s => ({ ...s, set: new Set(s.nodes.map(id => byId[id])) }));

  // Ce qui est éclairé : un aperçu (survol, focus) passe devant une sélection (clic, toucher).
  let preview = null, pinned = null, view = null;
  const target = () => preview || pinned;
  function paint() {
    const t = target();
    const keep = t ? (t.set || t.trail) : null;
    if (view) view.light(keep, !!preview && !calm.matches);
    readout.textContent = t ? word(t.text) : idle;
    buttons.forEach(b => b.el.setAttribute('aria-pressed', String(pinned === b.s)));
  }
  const hover = t => { preview = t; paint(); };
  const pin = t => { pinned = pinned === t ? null : t; paint(); };

  const buttons = scenarios.map(s => {
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'schema-scenario'; el.textContent = word(s.label);
    el.setAttribute('aria-pressed', 'false');
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover(s); });
    el.addEventListener('pointerleave', () => hover(null));
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) hover(s); });
    el.addEventListener('blur', () => hover(null));
    el.addEventListener('click', () => pin(s));
    return { el, s };
  });
  bar.replaceChildren(...buttons.map(b => b.el));

  function render() {
    if (view) view.stop();
    view = null;
    if (!narrow.matches) view = renderSvg(stage, nodes, edges, { hover, pin, title: root.dataset.title || data.project });
    if (!view) view = renderList(stage, nodes);
    paint();
  }
  render();
  narrow.addEventListener('change', render);
  let lastWidth = stage.clientWidth, queued = 0;
  new ResizeObserver(() => {
    if (Math.abs(stage.clientWidth - lastWidth) < 2) return;
    lastWidth = stage.clientWidth;
    cancelAnimationFrame(queued); queued = requestAnimationFrame(render);
  }).observe(stage);
}

/* ---------- Grand écran : schéma de gauche à droite ---------- */
function renderSvg(stage, nodes, edges, on) {
  const W = Math.round(stage.clientWidth);
  if (W < 200) return null;
  const R = 7, PAD_X = 84, ROW = 84, TOP = 16, LINE = 17;
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const minY = Math.min(...ys), maxX = Math.max(...xs) || 1;
  const col = (W - 2 * PAD_X) / maxX;
  const at = n => [PAD_X + n.x * col, TOP + R + (n.y - minY) * ROW];
  const lowest = Math.max(...nodes.map(n => at(n)[1] + 22 + n.lines.length * LINE));
  const H = Math.ceil(lowest + 6);

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'schema-svg', role: 'group', 'aria-label': on.title });
  const gE = el('g'), gD = el('g', { 'aria-hidden': 'true' }), gN = el('g');
  const paths = edges.map(e => {
    const [x1, y1] = at(e.a), [x2, y2] = at(e.b);
    const sx = x1 + R + 4, ex = x2 - R - 4, mx = (sx + ex) / 2;
    const p = el('path', { d: `M${sx},${y1} C${mx},${y1} ${mx},${y2} ${ex},${y2}`, class: 'schema-edge' + (e.cut ? ' is-cut' : '') });
    gE.append(p);
    return { e, p };
  });
  const marks = nodes.map(n => {
    const [cx, cy] = at(n);
    const g = el('g', { class: `schema-node kind-${n.kind}`, transform: `translate(${cx},${cy})`, tabindex: '0', role: 'button', 'aria-label': n.lines.join(' ') });
    const t = el('text', { 'text-anchor': 'middle', y: 22 + 12 });
    n.lines.forEach((line, i) => {
      const s = el('tspan', { x: 0, dy: i ? LINE : 0 });
      if (i) s.setAttribute('class', 'sub');
      s.textContent = line; t.append(s);
    });
    g.append(el('rect', { class: 'schema-hit', x: -14, y: -14, width: 28, height: 28 }), el('circle', { r: R }), t);
    g.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') on.hover(n); });
    g.addEventListener('pointerleave', () => on.hover(null));
    g.addEventListener('focus', () => { if (g.matches(':focus-visible')) on.hover(n); });
    g.addEventListener('blur', () => on.hover(null));
    g.addEventListener('click', () => on.pin(n));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); on.pin(n); } });
    gN.append(g);
    return { n, g, t };
  });
  svg.append(gE, gD, gN);
  stage.replaceChildren(svg);

  // Étiquettes qui se chevauchent (écran intermédiaire) : la liste est plus lisible.
  const boxes = marks.map(m => { const b = m.t.getBBox(); const [cx, cy] = at(m.n); return { x: cx + b.x - 6, y: cy + b.y, w: b.width + 12, h: b.height }; });
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const clash = boxes.some((a, i) => boxes.some((b, j) => j > i && hit(a, b))) || boxes.some(b => b.x < 0 || b.x + b.w > W);
  if (clash) return null;

  let frame = 0, t0 = 0, moving = [];
  function flow(now) {
    const k = ((now - t0) / 1500) % 1;
    moving.forEach(({ p, len, dots }) => dots.forEach((d, j) => {
      const pt = p.getPointAtLength(((k + j / dots.length) % 1) * len);
      d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y);
    }));
    frame = requestAnimationFrame(flow);
  }
  function stopFlow() { cancelAnimationFrame(frame); frame = 0; moving = []; gD.replaceChildren(); }

  return {
    light(keep, animate) {
      marks.forEach(({ n, g }) => { g.classList.toggle('is-lit', !!keep && keep.has(n)); g.classList.toggle('is-dim', !!keep && !keep.has(n)); });
      const lit = paths.filter(({ e, p }) => {
        const on = !!keep && keep.has(e.a) && keep.has(e.b);
        p.classList.toggle('is-lit', on); p.classList.toggle('is-dim', !!keep && !on);
        return on && !e.cut;
      });
      stopFlow();
      if (!animate || !lit.length) return;
      moving = lit.map(({ p }) => {
        const dots = [0, 1].map(() => { const d = el('circle', { r: 2.5, class: 'schema-dot' }); gD.append(d); return d; });
        return { p, len: p.getTotalLength(), dots };
      });
      t0 = performance.now(); flow(t0);
    },
    stop: stopFlow,
  };
}

/* ---------- Mobile : les étapes en liste verticale, une ligne par colonne ---------- */
function renderList(stage, nodes) {
  const ol = document.createElement('ol');
  ol.className = 'schema-steps';
  const items = [];
  [...new Set(nodes.map(n => n.x))].sort((a, b) => a - b).forEach(x => {
    const li = document.createElement('li');
    nodes.filter(n => n.x === x).sort((a, b) => a.y - b.y).forEach(n => {
      const span = document.createElement('span');
      span.className = `schema-step kind-${n.kind}`;
      const name = document.createElement('b'); name.textContent = n.lines[0];
      span.append(name);
      if (n.lines.length > 1) { const sub = document.createElement('small'); sub.textContent = n.lines.slice(1).join(' '); span.append(' ', sub); }
      li.append(span);
      items.push({ n, span });
    });
    ol.append(li);
  });
  stage.replaceChildren(ol);
  return {
    light(keep) { items.forEach(({ n, span }) => { span.classList.toggle('is-lit', !!keep && keep.has(n)); span.classList.toggle('is-dim', !!keep && !keep.has(n)); }); },
    stop() {},
  };
}

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}
})();

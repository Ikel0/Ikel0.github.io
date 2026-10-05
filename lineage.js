// Lignage dbt réel du projet Comptoir (lu dans target/manifest.json), rendu en
// SVG sans dépendance, avec une vue 3D fixe chargée seulement si le visiteur la
// demande. Rien ne bouge tant que le visiteur ne survole ou ne sélectionne pas
// un modèle.

const root = document.querySelector('[data-lineage]');
if (root) init(root);

const LAYERS = ['source', 'staging', 'intermediate', 'core', 'mart'];

async function init(root) {
  const lang = document.documentElement.lang.startsWith('en') ? 'en' : 'fr';
  const T = {
    fr: { layer: { source: 'Sources', staging: 'Staging', intermediate: 'Intermédiaire', core: 'Faits et dimensions', mart: 'Marts' },
      tests: n => `${n} test${n > 1 ? 's' : ''}`, up: n => `${n} en amont`, down: n => `${n} en aval`,
      fedBy: 'Alimenté par :', feeds: 'Alimente :', none: 'rien',
      hint2d: 'Touchez ou survolez un modèle pour voir ce qui l’alimente et ce qu’il alimente.',
      hint3d: 'Vue fixe. Survolez un modèle pour suivre ses données.',
      to3d: 'Voir en 3D', to2d: 'Revenir à plat', loading: 'Chargement…', fail3d: 'La vue 3D n’a pas pu être chargée.' },
    en: { layer: { source: 'Sources', staging: 'Staging', intermediate: 'Intermediate', core: 'Facts and dimensions', mart: 'Marts' },
      tests: n => `${n} test${n > 1 ? 's' : ''}`, up: n => `${n} upstream`, down: n => `${n} downstream`,
      fedBy: 'Fed by:', feeds: 'Feeds:', none: 'nothing',
      hint2d: 'Tap or hover a model to see what feeds it and what it feeds.',
      hint3d: 'Fixed view. Hover a model to follow its data.',
      to3d: 'View in 3D', to2d: 'Back to flat', loading: 'Loading…', fail3d: 'The 3D view could not be loaded.' },
  }[lang];

  let data;
  try {
    data = await (await fetch(root.dataset.lineage)).json();
  } catch {
    return; // la légende en HTML reste affichée
  }

  const nodes = data.nodes.map((n, i) => ({ ...n, i, up: new Set(), down: new Set() }));
  data.edges.forEach(([a, b]) => { nodes[b].up.add(a); nodes[a].down.add(b); });
  const closure = (start, key) => {
    const seen = new Set(); const stack = [start];
    while (stack.length) for (const j of nodes[stack.pop()][key]) if (!seen.has(j)) { seen.add(j); stack.push(j); }
    return seen;
  };
  nodes.forEach(n => { n.allUp = closure(n.i, 'up'); n.allDown = closure(n.i, 'down'); });

  // Placement : une colonne par couche, les nœuds répartis verticalement.
  LAYERS.forEach((layer, li) => {
    const col = nodes.filter(n => n.layer === layer).sort((a, b) => a.name.localeCompare(b.name));
    col.forEach((n, k) => { n.x = (li - 2) * 2.1; n.y = ((col.length - 1) / 2 - k) * 0.62; });
  });

  const stage = root.querySelector('.lineage-stage');
  const readout = root.querySelector('.lineage-readout');
  const hintEl = root.querySelector('.lineage-hint');
  const describe = n => `${n.name} · ${T.layer[n.layer]} · ${T.tests(n.tests)} · ${T.up(n.allUp.size)}, ${T.down(n.allDown.size)}`;
  const idle = readout.textContent;
  const show = n => { readout.textContent = n ? (n.text || describe(n)) : idle; };

  hintEl.textContent = T.hint2d;
  render2d(stage, nodes, data.edges, show, T);

  // Vue 3D à la demande : vue fixe, sans parallaxe ni rotation, Three.js chargé
  // au premier clic seulement. Proposée sur grand écran, avec WebGL, sans
  // préférence de mouvement réduit.
  const wide = matchMedia('(min-width: 761px)').matches;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
  const tools = root.querySelector('.lineage-tools');
  if (!(wide && !calm && gl && tools)) return;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'lineage-toggle'; btn.textContent = T.to3d;
  tools.append(btn);
  let view3d = null, busy = false;
  btn.addEventListener('click', async () => {
    if (busy) return;
    btn.blur();
    if (view3d) {
      view3d.dispose(); view3d = null;
      render2d(stage, nodes, data.edges, show, T);
      hintEl.textContent = T.hint2d; btn.textContent = T.to3d; show(null);
      return;
    }
    busy = true; btn.disabled = true; btn.textContent = T.loading;
    try {
      const THREE = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js');
      view3d = render3d(THREE, stage, nodes, data.edges, show, T);
      hintEl.textContent = T.hint3d; btn.textContent = T.to2d; show(null);
    } catch {
      hintEl.textContent = T.fail3d; btn.textContent = T.to3d;
    } finally { busy = false; btn.disabled = false; }
  });
}

function palette() {
  const css = getComputedStyle(document.documentElement);
  const v = name => css.getPropertyValue(name).trim();
  return { ink: v('--ink') || '#14202a', muted: v('--muted') || '#56656b', line: v('--line') || '#cfd8da', accent: v('--blue') || '#1558d6' };
}

function lineageOf(n) {
  return n ? new Set([n.i, ...n.allUp, ...n.allDown]) : null;
}

/* ---------- Vue 2D (SVG), ou liste par couche sur mobile ---------- */
function render2d(stage, nodes, edges, show, T) {
  if (matchMedia('(max-width: 760px)').matches) return renderList(stage, nodes, show, T);
  const NS = 'http://www.w3.org/2000/svg';
  // Une colonne par couche, de gauche à droite, avec de la place pour les noms.
  const W = 1120, H = 420;
  const pos = n => [520 + n.x * 100, 210 - n.y * 120];
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'lineage-svg');
  svg.setAttribute('role', 'img');
  const gE = document.createElementNS(NS, 'g'), gN = document.createElementNS(NS, 'g');
  const lines = edges.map(([a, b]) => {
    const p = document.createElementNS(NS, 'path');
    const [x1, y1] = pos(nodes[a]), [x2, y2] = pos(nodes[b]);
    p.setAttribute('d', `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`);
    p.setAttribute('class', 'lineage-edge');
    gE.append(p);
    return { a, b, p };
  });
  const dots = nodes.map(n => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `lineage-node layer-${n.layer}`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', n.name);
    const [cx, cy] = pos(n);
    g.setAttribute('transform', `translate(${cx},${cy})`);
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 8);
    const t = document.createElementNS(NS, 'text'); t.setAttribute('x', 13); t.setAttribute('y', 5); t.textContent = n.name;
    g.append(c, t);
    const on = () => highlight(n), off = () => highlight(null);
    g.addEventListener('pointerenter', on); g.addEventListener('pointerleave', off);
    g.addEventListener('click', on);
    g.addEventListener('focus', on); g.addEventListener('blur', off);
    gN.append(g);
    return g;
  });
  function highlight(n) {
    const keep = lineageOf(n);
    dots.forEach((d, i) => d.classList.toggle('is-dim', !!keep && !keep.has(i)));
    lines.forEach(l => {
      const lit = keep && keep.has(l.a) && keep.has(l.b);
      l.p.classList.toggle('is-lit', !!lit); l.p.classList.toggle('is-dim', !!keep && !lit);
    });
    show(n);
  }
  svg.append(gE, gN);
  stage.replaceChildren(svg);
}

// Mobile : une liste par couche, sans arêtes. Toucher un modèle écrit ce qui
// l'alimente et ce qu'il alimente dans la ligne de lecture.
function renderList(stage, nodes, show, T) {
  const wrap = document.createElement('div');
  wrap.className = 'lineage-list';
  const items = [];
  LAYERS.forEach(layer => {
    const col = nodes.filter(n => n.layer === layer).sort((a, b) => a.name.localeCompare(b.name));
    if (!col.length) return;
    const h = document.createElement('p'); h.className = 'lineage-list-layer'; h.textContent = T.layer[layer];
    const ul = document.createElement('ul');
    col.forEach(n => {
      const li = document.createElement('li');
      const b = document.createElement('button'); b.type = 'button'; b.className = `lineage-item layer-${n.layer}`; b.textContent = n.name;
      b.addEventListener('click', () => {
        const keep = lineageOf(n);
        items.forEach(({ el, i }) => el.classList.toggle('is-dim', !keep.has(i)));
        const names = k => [...k].map(i => nodes[i].name).sort().join(', ') || T.none;
        show({ ...n, text: `${n.name} · ${T.layer[n.layer]} · ${T.tests(n.tests)}. ${T.fedBy} ${names(n.up)}. ${T.feeds} ${names(n.down)}.` });
      });
      items.push({ el: b, i: n.i });
      li.append(b); ul.append(li);
    });
    wrap.append(h, ul);
  });
  stage.replaceChildren(wrap);
}

/* ---------- Vue 3D (Three.js, à la demande) ---------- */
function render3d(THREE, stage, nodes, edges, show, T) {
  let col = palette();
  const canvas = document.createElement('canvas');
  canvas.className = 'lineage-canvas';
  const labels = document.createElement('div');
  labels.className = 'lineage-labels';
  labels.setAttribute('aria-hidden', 'true');
  stage.replaceChildren(canvas, labels);

  // Profondeur : les nœuds d'une même couche sont étagés en z pour qu'on lise la
  // structure en couches, sans que les sphères se masquent.
  LAYERS.forEach((layer, li) => {
    nodes.filter(n => n.layer === layer).sort((a, b) => a.name.localeCompare(b.name))
      .forEach((n, k) => { n.z = ((k % 3) - 1) * 0.55 + (li % 2 ? 0.25 : -0.25); });
  });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 2, 0.1, 100);
  camera.position.set(0, 0, 10.5);
  const group = new THREE.Group();
  group.rotation.set(-0.16, -0.38, 0); // vue fixe
  scene.add(group);

  const tone = n => (n.layer === 'mart' || n.layer === 'core') ? col.accent : n.layer === 'source' ? col.muted : col.ink;
  const geo = new THREE.SphereGeometry(0.11, 24, 16);
  const hitGeo = new THREE.SphereGeometry(0.3, 8, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const meshes = nodes.map(n => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: tone(n), transparent: true }));
    m.position.set(n.x, n.y, n.z);
    const hit = new THREE.Mesh(hitGeo, hitMat); hit.userData.n = n; m.add(hit);
    group.add(m);
    return m;
  });
  const curves = edges.map(([a, b]) => {
    const A = new THREE.Vector3(nodes[a].x, nodes[a].y, nodes[a].z), B = new THREE.Vector3(nodes[b].x, nodes[b].y, nodes[b].z);
    const mx = (A.x + B.x) / 2;
    const c = new THREE.CubicBezierCurve3(A, new THREE.Vector3(mx, A.y, A.z), new THREE.Vector3(mx, B.y, B.z), B);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(32)), new THREE.LineBasicMaterial({ color: col.line, transparent: true }));
    group.add(line);
    return { a, b, c, line };
  });
  // Points qui parcourent les arêtes de la lignée survolée, dans le sens des données.
  const flowGeo = new THREE.BufferGeometry();
  const flowMat = new THREE.PointsMaterial({ color: col.accent, size: 0.08 });
  group.add(new THREE.Points(flowGeo, flowMat));

  // Étiquettes de couche sur une même ligne, au-dessus des colonnes.
  const topY = Math.max(...nodes.map(n => n.y)) + 0.55;
  const tags = LAYERS.map((layer, li) => {
    const el = document.createElement('span');
    el.className = 'lineage-layer'; el.textContent = T.layer[layer]; labels.append(el);
    return { el, v: new THREE.Vector3((li - 2) * 2.1, topY, 0) };
  });
  const tip = document.createElement('span'); tip.className = 'lineage-tip'; tip.hidden = true; labels.append(tip);
  // Noms des nœuds : affichés pour la lignée éclairée, masqués sinon.
  const names = nodes.map(n => { const el = document.createElement('span'); el.className = 'lineage-name'; el.textContent = n.name; el.hidden = true; labels.append(el); return el; });

  let hovered = null, frame = 0, t0 = 0, alive = true;
  const lit = () => lineageOf(hovered);
  function paint() {
    const keep = lit();
    meshes.forEach((m, i) => { m.material.color.set(tone(nodes[i])); m.material.opacity = keep && !keep.has(i) ? 0.18 : 1; m.scale.setScalar(hovered && hovered.i === i ? 1.6 : 1); });
    curves.forEach(e => { const on = keep && keep.has(e.a) && keep.has(e.b); e.line.material.color.set(on ? col.accent : col.line); e.line.material.opacity = keep && !on ? 0.25 : 1; });
    flowMat.color.set(col.accent);
  }
  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  const project = v => {
    const p = v.clone().applyMatrix4(group.matrixWorld).project(camera);
    return [(p.x + 1) / 2 * stage.clientWidth, (1 - p.y) / 2 * stage.clientHeight];
  };
  function draw(now = performance.now()) {
    if (!alive) return;
    group.updateMatrixWorld();
    const keep = lit();
    const active = keep ? curves.filter(e => keep.has(e.a) && keep.has(e.b)) : [];
    const pts = [];
    active.forEach((e, k) => { for (let j = 0; j < 3; j++) pts.push(e.c.getPoint(((now - t0) / 1600 + j / 3 + k * 0.13) % 1)); });
    flowGeo.setFromPoints(pts);
    renderer.render(scene, camera);
    tags.forEach(t => { const [x, y] = project(t.v); t.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; });
    if (hovered) { const [x, y] = project(meshes[hovered.i].position); tip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -150%)`; }
    names.forEach((el, i) => {
      const on = !!keep && keep.has(i) && i !== hovered.i;
      el.hidden = !on;
      if (on) { const [x, y] = project(meshes[i].position); el.style.transform = `translate(${x + 9}px, ${y}px) translate(0, -50%)`; }
    });
    frame = active.length ? requestAnimationFrame(draw) : 0;
  }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const onMove = e => {
    const r = canvas.getBoundingClientRect();
    ptr.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(meshes.map(m => m.children[0]))[0];
    const n = hit ? hit.object.userData.n : null;
    if (n === hovered) return;
    hovered = n; t0 = performance.now(); paint(); show(n);
    tip.hidden = !n; if (n) tip.textContent = n.name;
    canvas.style.cursor = n ? 'pointer' : 'default';
    cancelAnimationFrame(frame); draw();
  };
  const onLeave = () => { hovered = null; paint(); show(null); tip.hidden = true; cancelAnimationFrame(frame); draw(); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  const ro = new ResizeObserver(() => { size(); cancelAnimationFrame(frame); draw(); });
  ro.observe(stage);
  const mo = new MutationObserver(() => { col = palette(); paint(); cancelAnimationFrame(frame); draw(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  size(); paint(); draw();

  return { dispose() {
    alive = false; cancelAnimationFrame(frame); ro.disconnect(); mo.disconnect();
    canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
    geo.dispose(); hitGeo.dispose(); flowGeo.dispose(); curves.forEach(e => { e.line.geometry.dispose(); e.line.material.dispose(); });
    meshes.forEach(m => m.material.dispose()); renderer.dispose();
  } };
}

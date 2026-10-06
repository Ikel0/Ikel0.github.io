#!/usr/bin/env python3
"""Images de partage (og:image) pour les notes, les études de cas et l'accueil.

Pour chaque page, le script écrit un SVG de 1200×630 (fond papier, titre, nom en bas,
sans décor), le rend en PNG avec Chrome headless dans media/og/<id>.png, puis pose ou met
à jour les balises og:* et twitter:card dans le <head> de la page.

    python3 build_og.py                 # toutes les pages
    python3 build_og.py --skip etudes/pacte.html   # sauf celles-ci
    python3 build_og.py notes/idempotence.html     # seulement celles-ci
"""
import argparse
import html
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'media' / 'og'
SITE = 'https://ikel0.github.io'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
AUTHOR = 'Ikel Ouedraogo'
W, H, MARGIN = 1200, 630, 96
FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@500;600'


def font_css():
    """Figtree embarquée en data: URI. Chrome headless ne se ferme plus quand le SVG importe
    une feuille distante ; on télécharge donc la police une fois et on l'inline. Sans réseau,
    le SVG retombe sur la sans du système."""
    import base64
    import urllib.request
    try:
        with urllib.request.urlopen(FONT_URL, timeout=15) as response:  # UA Python : Google sert un TTF par graisse
            css = response.read().decode()
        faces = []
        for weight, url in re.findall(r'font-weight: (\d+);\s*src: url\((https://[^)]+)\)', css):
            with urllib.request.urlopen(url, timeout=15) as response:
                data = base64.b64encode(response.read()).decode()
            faces.append(f"@font-face {{ font-family: Figtree; font-weight: {weight}; src: url(data:font/ttf;base64,{data}) format('truetype'); }}")
        return ' '.join(faces)
    except OSError as error:
        print(f'police non téléchargée ({error}) : sans du système', file=sys.stderr)
        return ''


FONT_CSS = None

HOME = {
    'index.html': ('accueil', 'Data Engineer orienté analytics', 'Pipelines fiables, modèles SQL, KPI et dashboards Power BI, IA appliquée vérifiable.'),
    'en/index.html': ('accueil-en', 'Analytics-minded Data Engineer', 'Reliable pipelines, SQL models, KPIs and Power BI dashboards, verifiable applied AI.'),
}


def wrap(text, size, width=W - 2 * MARGIN):
    """Coupe le titre en lignes ; Figtree 600 fait en moyenne 0,53 em par caractère."""
    per_line = int(width / (size * 0.53))
    lines, current = [], ''
    for word in text.split():
        candidate = f'{current} {word}'.strip()
        if len(candidate) > per_line and current:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def svg(title, kicker):
    size = 72 if len(title) <= 50 else 60 if len(title) <= 90 else 50  # lisible une fois réduit à 400 px
    lines = wrap(title, size)
    leading = round(size * 1.15)
    top = 212
    tspans = ''.join(
        f'<tspan x="{MARGIN}" y="{top + i * leading}">{html.escape(line)}</tspan>' for i, line in enumerate(lines)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <style>{FONT_CSS} text {{ font-family: Figtree, "Helvetica Neue", Arial, sans-serif; }}</style>
  <rect width="{W}" height="{H}" fill="#edf2f3"/>
  <text x="{MARGIN}" y="112" fill="#103e93" font-size="24" font-weight="500">{html.escape(kicker)}</text>
  <text fill="#172126" font-size="{size}" font-weight="600" letter-spacing="-0.01em">{tspans}</text>
  <line x1="{MARGIN}" y1="{H - 118}" x2="{W - MARGIN}" y2="{H - 118}" stroke="#172126" stroke-width="1"/>
  <text x="{MARGIN}" y="{H - 72}" fill="#172126" font-size="26" font-weight="600">{AUTHOR}</text>
  <text x="{W - MARGIN}" y="{H - 72}" fill="#58686e" font-size="22" font-weight="500" text-anchor="end">ikel0.github.io</text>
</svg>
'''


def render(svg_text, png, profile):
    """Chrome 154 (macOS) écrit parfois le PNG puis ne se ferme plus : on attend le fichier,
    on lui laisse trois secondes pour quitter, puis on l'arrête."""
    with tempfile.NamedTemporaryFile('w', suffix='.svg', delete=False, encoding='utf-8') as tmp:
        tmp.write(svg_text)
    png = Path(png)
    png.unlink(missing_ok=True)
    chrome = subprocess.Popen([
        CHROME, '--headless=new', '--no-first-run', '--disable-gpu', '--hide-scrollbars',
        f'--user-data-dir={profile}', f'--window-size={W},{H}',
        f'--screenshot={png}', f'file://{tmp.name}',
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    deadline = time.monotonic() + 60
    while chrome.poll() is None and time.monotonic() < deadline:
        if png.exists() and png.stat().st_size and time.monotonic() - png.stat().st_mtime > 1:
            try:
                chrome.wait(timeout=3)
            except subprocess.TimeoutExpired:
                chrome.kill()
                chrome.wait()
            break
        time.sleep(0.2)
    Path(tmp.name).unlink()
    if chrome.poll() is None:
        chrome.kill()
    if not png.exists():
        raise SystemExit(f'Chrome n’a pas écrit {png}')


def page_meta(source):
    title = re.search(r'<title>(.*?)</title>', source, re.S).group(1)
    title = html.unescape(re.sub(r'\s*·\s*Ikel Ouedraogo\s*$', '', title)).replace('\xa0', ' ')
    # Les études de cas : le H1 dit le sujet, le <title> ne fait que le classer.
    h1 = re.search(r'<h1>(.*?)</h1>', source, re.S)
    if h1 and title.startswith('Étude de cas'):
        title = html.unescape(re.sub(r'<[^>]+>', '', h1.group(1))).replace('\xa0', ' ').strip()
    description = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', source).group(1))
    kicker = re.search(r'class="article-meta">([^<]*)<', source)
    return title, description, html.unescape(kicker.group(1)) if kicker else ''


def og_block(url, title, description, image):
    return '\n'.join([
        '    <meta property="og:type" content="article" />',
        f'    <meta property="og:url" content="{url}" />',
        f'    <meta property="og:title" content="{html.escape(title, quote=True)}" />',
        f'    <meta property="og:description" content="{html.escape(description, quote=True)}" />',
        f'    <meta property="og:image" content="{image}" />',
        '    <meta property="og:image:width" content="1200" />',
        '    <meta property="og:image:height" content="630" />',
        '    <meta name="twitter:card" content="summary_large_image" />',
    ])


def update_article(path, image_url):
    source = path.read_text(encoding='utf-8')
    title, description, _ = page_meta(source)
    cleaned = re.sub(r'\n[ \t]*<meta (?:property="og:[^"]*"|name="twitter:card")[^>]*/>', '', source)
    anchor = re.search(r'\n[ \t]*<meta name="theme-color"[^>]*/>', cleaned)
    block = og_block(f'{SITE}/{path.relative_to(ROOT).as_posix()}', title, description, image_url)
    updated = cleaned[:anchor.end()] + '\n' + block + cleaned[anchor.end():]
    if updated != source:
        path.write_text(updated, encoding='utf-8')


def update_home(path, image_url):
    source = path.read_text(encoding='utf-8')
    updated = re.sub(r'(<meta property="og:image" content=")[^"]*(")', rf'\g<1>{image_url}\2', source)
    updated = re.sub(r'(<meta name="twitter:card" content=")[^"]*(")', r'\1summary_large_image\2', updated)
    if updated != source:
        path.write_text(updated, encoding='utf-8')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('pages', nargs='*', help='pages à traiter (défaut : accueil, notes, études)')
    parser.add_argument('--skip', action='append', default=[], help='page à laisser telle quelle')
    args = parser.parse_args()

    if args.pages:
        pages = [ROOT / p for p in args.pages]
    else:
        pages = [ROOT / p for p in HOME] + sorted(ROOT.glob('notes/*.html')) + sorted(ROOT.glob('etudes/*.html'))
    skipped = {(ROOT / s).resolve() for s in args.skip}
    pages = [p for p in pages if p.resolve() not in skipped and p.name != 'index.html' or str(p.relative_to(ROOT)) in HOME]

    global FONT_CSS
    FONT_CSS = font_css()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as profile:
        for path in pages:
            rel = path.relative_to(ROOT).as_posix()
            if rel in HOME:
                image_id, title, kicker = HOME[rel]
                image = svg(title, kicker)
            else:
                image_id = f'{path.parent.name}-{path.stem}' if path.parent.name == 'etudes' else path.stem
                title, _, kicker = page_meta(path.read_text(encoding='utf-8'))
                image = svg(title, kicker)
            png = OUT / f'{image_id}.png'
            render(image, png, profile)
            image_url = f'{SITE}/media/og/{image_id}.png'
            (update_home if rel in HOME else update_article)(path, image_url)
            print(f'{rel} -> media/og/{image_id}.png')


if __name__ == '__main__':
    if not Path(CHROME).exists():
        sys.exit(f'Chrome introuvable : {CHROME}')
    main()

#!/usr/bin/env python3
"""Écrit notes/feed.xml (Atom) à partir de notes/posts.js.

posts.js ne porte pas de date : la date d'une note est celle du commit qui a ajouté
son fichier HTML (git log --diff-filter=A), ou la date du jour si git ne la connaît pas.

    python3 build_feed.py
"""
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent
POSTS = ROOT / 'notes' / 'posts.js'
FEED = ROOT / 'notes' / 'feed.xml'
SITE = 'https://ikel0.github.io'
AUTHOR = 'Ikel Ouedraogo'


def read_posts():
    source = POSTS.read_text(encoding='utf-8')
    match = re.search(r'window\.publicationPosts\s*=\s*(\[.*?\]);', source, re.S)
    if not match:
        raise SystemExit('posts.js : tableau window.publicationPosts introuvable')
    return json.loads(match.group(1))


def added_on(href):
    out = subprocess.run(
        ['git', 'log', '--diff-filter=A', '--format=%aI', '--', f'notes/{href}'],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout.split()
    if out:
        return datetime.fromisoformat(out[-1])
    return datetime.now(timezone.utc).replace(microsecond=0)


def entry(post, date):
    url = f'{SITE}/notes/{post["href"]}'
    return f'''  <entry>
    <id>{url}</id>
    <title>{escape(post["title"])}</title>
    <link rel="alternate" type="text/html" href="{url}"/>
    <published>{date.isoformat()}</published>
    <updated>{date.isoformat()}</updated>
    <category term="{escape(post["type"])}" label="{escape(post["label"])}"/>
    <summary>{escape(post["summary"])}</summary>
  </entry>
'''


def main():
    posts = read_posts()
    dated = [(post, added_on(post['href'])) for post in posts]
    newest = max(date for _, date in dated)
    body = ''.join(entry(post, date) for post, date in dated)
    FEED.write_text(f'''<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
  <id>{SITE}/notes/feed.xml</id>
  <title>Publications · {AUTHOR}</title>
  <subtitle>Notes sur la data et l’IA, documentées avec leurs sources.</subtitle>
  <link rel="self" type="application/atom+xml" href="{SITE}/notes/feed.xml"/>
  <link rel="alternate" type="text/html" href="{SITE}/notes/"/>
  <updated>{newest.isoformat()}</updated>
  <author><name>{AUTHOR}</name><uri>{SITE}/</uri></author>
{body}</feed>
''', encoding='utf-8')
    print(f'{FEED.relative_to(ROOT)} : {len(dated)} entrées, dernière le {newest.date()}')


if __name__ == '__main__':
    main()

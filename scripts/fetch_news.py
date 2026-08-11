#!/usr/bin/env python3
"""
fetch_news.py
--------------
Scarica i feed RSS del Dipartimento di Informatica (Liceo Cortese, Orizzonte
Scuola, Wired), li normalizza e scrive data/news.json.

Progettato per essere eseguito da .github/workflows/update-news.yml su
GitHub Actions (Python 3, solo standard library, nessuna dipendenza esterna).

Comportamento in caso di errore su una singola fonte (requisito: non deve
fallire l'intero aggiornamento):
  1. se data/news.json esistente contiene già item per quella fonte, li
     riusa così com'erano (preserva l'ultimo stato noto-buono);
  2. altrimenti scrive un array "items" vuoto per quella fonte.
In entrambi i casi lo script stampa un warning su stderr e prosegue con le
altre fonti. Lo script esce sempre con codice 0: un problema di rete su un
feed non deve far fallire il job GitHub Actions.
"""

import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "news.json"

# Fonti: stessi URL già presenti nel loader RSS lato client rimosso da
# index.html, così il comportamento resta invariato per l'utente finale.
FEEDS = [
    {
        "source": "Liceo Cortese",
        "url": "https://www.liceoscientificocortese.edu.it/?feed=rss2",
    },
    {
        "source": "Orizzonte Scuola",
        "url": "https://www.orizzontescuola.it/feed/",
    },
    {
        "source": "Wired",
        "url": "https://www.wired.it/feed/rss",
    },
]

MAX_ITEMS_PER_FEED = 6          # la homepage ne mostra 4, un piccolo margine
                                 # evita che un singolo item scomparso svuoti
                                 # la sezione
DESCRIPTION_MAX_CHARS = 160
REQUEST_TIMEOUT_SECONDS = 15
USER_AGENT = (
    "Mozilla/5.0 (compatible; ScuolaNewsBot/1.0; "
    "+https://github.com/antonioadinolfi/scuola)"
)

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")


def log(message):
    print(message, file=sys.stderr)


def strip_html(text):
    """Rimuove tag HTML e normalizza gli spazi da un campo description RSS,
    che spesso contiene markup incorporato."""
    if not text:
        return ""
    no_tags = TAG_RE.sub(" ", text)
    return WHITESPACE_RE.sub(" ", no_tags).strip()


def truncate(text, max_chars):
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rstrip() + "…"


def fetch_raw(url):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        return response.read()


def parse_rss(xml_bytes):
    """Analizza un documento RSS 2.0 (o Atom minimale) ed estrae gli item."""
    root = ET.fromstring(xml_bytes)

    # RSS 2.0 standard: <rss><channel><item>...
    items = root.findall("./channel/item")
    if items:
        parsed = []
        for item in items[:MAX_ITEMS_PER_FEED]:
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_date = (item.findtext("pubDate") or "").strip()
            description = strip_html(item.findtext("description") or "")
            if not title or not link:
                continue
            parsed.append({
                "title": title,
                "link": link,
                "pubDate": pub_date,
                "description": truncate(description, DESCRIPTION_MAX_CHARS),
            })
        return parsed

    # Fallback Atom (namespace-aware), nel caso una fonte esponga Atom
    # invece di RSS 2.0.
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    entries = root.findall("atom:entry", ns)
    parsed = []
    for entry in entries[:MAX_ITEMS_PER_FEED]:
        title = (entry.findtext("atom:title", default="", namespaces=ns) or "").strip()
        link_el = entry.find("atom:link", ns)
        link = link_el.get("href", "").strip() if link_el is not None else ""
        pub_date = (entry.findtext("atom:updated", default="", namespaces=ns) or "").strip()
        description = strip_html(entry.findtext("atom:summary", default="", namespaces=ns) or "")
        if not title or not link:
            continue
        parsed.append({
            "title": title,
            "link": link,
            "pubDate": pub_date,
            "description": truncate(description, DESCRIPTION_MAX_CHARS),
        })
    return parsed


def load_previous_items_by_source():
    """Legge data/news.json esistente (se presente) per poter riusare gli
    ultimi item noti di una fonte quando il fetch fallisce."""
    if not OUTPUT_PATH.exists():
        return {}
    try:
        previous = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as err:
        log(f"[warn] impossibile leggere data/news.json precedente: {err}")
        return {}

    by_source = {}
    for feed in previous.get("feeds", []):
        source = feed.get("source")
        if source:
            by_source[source] = feed.get("items", [])
    return by_source


def main():
    previous_by_source = load_previous_items_by_source()
    result_feeds = []
    had_any_failure = False

    for feed in FEEDS:
        source = feed["source"]
        url = feed["url"]
        try:
            raw = fetch_raw(url)
            items = parse_rss(raw)
            if not items:
                raise ValueError("nessun item valido trovato nel feed")
            log(f"[ok] {source}: {len(items)} articoli recuperati")
        except (urllib.error.URLError, urllib.error.HTTPError, ET.ParseError, ValueError, TimeoutError) as err:
            had_any_failure = True
            fallback_items = previous_by_source.get(source, [])
            log(
                f"[warn] {source}: fetch/parsing fallito ({err}). "
                f"Riuso {len(fallback_items)} articoli dall'ultimo aggiornamento riuscito."
            )
            items = fallback_items

        result_feeds.append({"source": source, "items": items})

    output = {
        "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "feeds": result_feeds,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if had_any_failure:
        log("[info] aggiornamento completato con uno o più feed in fallback.")
    else:
        log("[info] aggiornamento completato, tutti i feed recuperati correttamente.")

    # Esce sempre con successo: un problema di rete su una fonte non deve
    # far fallire il job GitHub Actions (requisito esplicito).
    return 0


if __name__ == "__main__":
    sys.exit(main())

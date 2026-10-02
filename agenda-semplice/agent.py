import json, re, hashlib
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader

BASE = "https://www.liceoscientificocortese.edu.it"
SEEDS = [f"{BASE}/novita/", f"{BASE}/circolari/"]
CLASSES = ["1Asa","2Asa","3Asa","4Asa","5Asa","1Csa","2Fsa","4Fsa","5Csa"]
OUT = Path("agenda-semplice/agenda-agent.json")
HEADERS = {"User-Agent": "Antonio-Adinolfi-Agenda-Agent/1.0"}
TIME_RE = re.compile(r"(?<!\d)(\d{1,2})[:.](\d{2})(?!\d)")
DATE_NUM_RE = re.compile(r"\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b")
DATE_TEXT_RE = re.compile(r"\b(\d{1,2})\s+(GENNAIO|FEBBRAIO|MARZO|APRILE|MAGGIO|GIUGNO|LUGLIO|AGOSTO|SETTEMBRE|OTTOBRE|NOVEMBRE|DICEMBRE)\s+(20\d{2})\b", re.I)
MONTHS = {"GENNAIO":1,"FEBBRAIO":2,"MARZO":3,"APRILE":4,"MAGGIO":5,"GIUGNO":6,"LUGLIO":7,"AGOSTO":8,"SETTEMBRE":9,"OTTOBRE":10,"NOVEMBRE":11,"DICEMBRE":12}

def get(url):
    r = requests.get(url, headers=HEADERS, timeout=25)
    r.raise_for_status()
    return r

def normalize(s):
    return re.sub(r"\s+", " ", s.replace("\xa0", " ")).strip()

def extract_date(text):
    m = DATE_NUM_RE.search(text)
    if m:
        return f"{int(m.group(3)):04d}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    m = DATE_TEXT_RE.search(text.upper())
    if m:
        return f"{int(m.group(3)):04d}-{MONTHS[m.group(2).upper()]:02d}-{int(m.group(1)):02d}"
    return None

def extract_links(html, base):
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    for a in soup.find_all("a", href=True):
        u = urljoin(base, a["href"])
        if urlparse(u).netloc == urlparse(BASE).netloc:
            links.add(u.split("#")[0])
    return links

def pdf_text(url):
    data = get(url).content
    tmp = Path("/tmp/agenda.pdf")
    tmp.write_bytes(data)
    reader = PdfReader(str(tmp))
    return "\n".join((p.extract_text() or "") for p in reader.pages)

def html_text(html):
    soup = BeautifulSoup(html, "html.parser")
    for x in soup(["script","style","noscript"]):
        x.decompose()
    return "\n".join(normalize(x) for x in soup.stripped_strings)

def parse_events(text, source_url, source_title):
    lines = [normalize(x) for x in text.splitlines() if normalize(x)]
    events = []
    current_date = extract_date(text[:1000])
    for i, line in enumerate(lines):
        d = extract_date(line)
        if d:
            current_date = d
        upper = line.upper()
        matched = [c for c in CLASSES if re.search(rf"\b{re.escape(c)}\b", upper, re.I)]
        if not matched:
            continue
        tm = TIME_RE.search(line)
        if not tm:
            window = " ".join(lines[max(0,i-2):min(len(lines),i+3)])
            tm = TIME_RE.search(window)
        if not tm or not current_date:
            continue
        hh, mm = int(tm.group(1)), int(tm.group(2))
        if hh > 23 or mm > 59:
            continue
        for cls in matched:
            title = "Consiglio di classe" if "CONSIGLI" in upper or "CONSIGLIO" in upper else "Impegno scolastico"
            event = {
                "date": current_date,
                "time": f"{hh:02d}:{mm:02d}",
                "title": f"{title} — {cls}",
                "notes": f"Rilevato automaticamente dal sito della scuola. Fonte: {source_title or source_url}",
                "source": source_url,
                "class": cls,
                "automatic": True,
            }
            raw = f"{current_date}|{hh:02d}:{mm:02d}|{cls}|{title}"
            event["id"] = "agent-" + hashlib.sha1(raw.encode()).hexdigest()[:16]
            events.append(event)
    return events

def main():
    old = {}
    if OUT.exists():
        try:
            old = {e["id"]: e for e in json.loads(OUT.read_text(encoding="utf-8")).get("events", [])}
        except Exception:
            old = {}
    candidates = set(SEEDS)
    visited = set()
    for seed in SEEDS:
        try:
            r = get(seed)
            candidates |= {u for u in extract_links(r.text, seed) if any(x in u.lower() for x in ("/novita/", "/circolare", ".pdf", "/documento/"))}
        except Exception as e:
            print("seed error", seed, e)

    found = {}
    for url in sorted(candidates):
        if url in visited or len(visited) >= 80:
            continue
        visited.add(url)
        try:
            r = get(url)
            ctype = r.headers.get("content-type","").lower()
            if url.lower().endswith(".pdf") or "application/pdf" in ctype:
                text = pdf_text(url)
                title = Path(urlparse(url).path).name
            else:
                text = html_text(r.text)
                title = BeautifulSoup(r.text, "html.parser").title.get_text(" ", strip=True) if BeautifulSoup(r.text, "html.parser").title else url
            for e in parse_events(text, url, title):
                found[e["id"]] = e
        except Exception as e:
            print("skip", url, e)

    merged = dict(old)
    merged.update(found)
    events = sorted(merged.values(), key=lambda x: (x.get("date","9999"), x.get("time","99:99"), x.get("class",""), x.get("title","")))
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": BASE,
        "classes": CLASSES,
        "events": events
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Agenda agent: {len(events)} eventi, {len(found)} nuovi/aggiornati.")

if __name__ == "__main__":
    main()

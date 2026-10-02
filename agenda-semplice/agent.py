import json
import os
import re
import hashlib
from datetime import datetime, timedelta, timezone, date, time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from zoneinfo import ZoneInfo

import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
import icalendar
import recurring_ical_events

BASE = "https://www.liceoscientificocortese.edu.it"
SEEDS = [f"{BASE}/novita/", f"{BASE}/circolari/"]
CLASSES = ["1Asa","2Asa","3Asa","4Asa","5Asa","1Csa","2Fsa","4Fsa","5Csa"]
OUT = Path("agenda-semplice/agenda-agent.json")
HEADERS = {"User-Agent": "Antonio-Adinolfi-Agenda-Agent/2.0"}
ROME_TZ = ZoneInfo("Europe/Rome")

TIME_RE = re.compile(r"(?<!\d)(\d{1,2})[:.](\d{2})(?!\d)")
DATE_NUM_RE = re.compile(r"\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b")
DATE_TEXT_RE = re.compile(r"\b(\d{1,2})\s+(GENNAIO|FEBBRAIO|MARZO|APRILE|MAGGIO|GIUGNO|LUGLIO|AGOSTO|SETTEMBRE|OTTOBRE|NOVEMBRE|DICEMBRE)\s+(20\d{2})\b", re.I)
MONTHS = {"GENNAIO":1,"FEBBRAIO":2,"MARZO":3,"APRILE":4,"MAGGIO":5,"GIUGNO":6,"LUGLIO":7,"AGOSTO":8,"SETTEMBRE":9,"OTTOBRE":10,"NOVEMBRE":11,"DICEMBRE":12}


def get(url):
    r = requests.get(url, headers=HEADERS, timeout=30)
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
    for x in soup(["script", "style", "noscript"]):
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
            window = " ".join(lines[max(0, i - 2):min(len(lines), i + 3)])
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
                "sourceType": "school_site",
                "class": cls,
                "automatic": True,
            }
            raw = f"{current_date}|{hh:02d}:{mm:02d}|{cls}|{title}"
            event["id"] = "agent-" + hashlib.sha1(raw.encode()).hexdigest()[:16]
            events.append(event)

    return events


def calendar_urls():
    raw = os.getenv("GOOGLE_CALENDAR_ICAL_URLS", "").strip()
    if not raw:
        return []

    # Supports one or several secret iCal URLs, one per line or separated by ';'.
    return [x.strip() for x in re.split(r"[;\n]+", raw) if x.strip()]


def value(component, key, default=""):
    try:
        v = component.get(key)
        return str(v) if v is not None else default
    except Exception:
        return default


def local_datetime(value_dt):
    if isinstance(value_dt, datetime):
        if value_dt.tzinfo is None:
            return value_dt.replace(tzinfo=ROME_TZ)
        return value_dt.astimezone(ROME_TZ)
    if isinstance(value_dt, date):
        return datetime.combine(value_dt, time.min, tzinfo=ROME_TZ)
    return None


def calendar_source_id(url):
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def parse_calendar(data, source_url, calendar_name, source_id, start_window, end_window):
    cal = icalendar.Calendar.from_ical(data)
    query = recurring_ical_events.of(cal, skip_bad_series=True)
    items = query.between(start_window, end_window)
    events = []

    for item in items:
        dtstart_prop = item.get("DTSTART")
        if not dtstart_prop:
            continue

        dt = local_datetime(dtstart_prop.dt)
        if not dt:
            continue

        uid = value(item, "UID", "no-uid")
        summary = normalize(value(item, "SUMMARY", "Impegno da Google Calendar")) or "Impegno da Google Calendar"
        description = normalize(value(item, "DESCRIPTION", ""))
        location = normalize(value(item, "LOCATION", ""))

        extra = []
        if calendar_name:
            extra.append(f"Calendario: {calendar_name}")
        if location:
            extra.append(f"Luogo: {location}")
        if description:
            extra.append(f"Note: {description}")

        raw = f"google|{source_url}|{uid}|{dt.isoformat()}"
        event_id = "gcal-" + hashlib.sha1(raw.encode()).hexdigest()[:20]

        matched_classes = [c for c in CLASSES if re.search(rf"\b{re.escape(c)}\b", summary, re.I)]
        event = {
            "id": event_id,
            "date": dt.strftime("%Y-%m-%d"),
            "time": dt.strftime("%H:%M"),
            "title": summary,
            "notes": " · ".join(extra),
            "source": "Google Calendar",
            "sourceType": "google_calendar",
            "calendarName": calendar_name,
            "calendarSourceId": source_id,
            "calendarUid": uid,
            "automatic": True,
        }
        if location:
            event["location"] = location
        if matched_classes:
            event["class"] = matched_classes[0]

        events.append(event)

    return events


def import_google_calendars():
    urls = calendar_urls()
    if not urls:
        print("Google Calendar: nessun URL iCal configurato.")
        return [], set(), False

    now = datetime.now(ROME_TZ)
    start_window = now - timedelta(days=int(os.getenv("GOOGLE_CALENDAR_DAYS_BACK", "30")))
    end_window = now + timedelta(days=int(os.getenv("GOOGLE_CALENDAR_DAYS_FORWARD", "365")))

    found = []
    successful_sources = set()

    for url in urls:
        try:
            response = get(url)
            data = response.content
            cal = icalendar.Calendar.from_ical(data)
            calendar_name = value(cal, "X-WR-CALNAME", "")
            found.extend(parse_calendar(data, url, calendar_name, calendar_source_id(url), start_window, end_window))
            successful_sources.add(url)
            print(f"Google Calendar: {calendar_name or 'calendario'} -> OK")
        except Exception as exc:
            # If a calendar cannot be reached, retain its previous events rather than deleting them.
            print(f"Google Calendar: errore su calendario iCal: {exc}")

    return found, successful_sources, True


def import_school_site():
    candidates = set(SEEDS)
    visited = set()

    for seed in SEEDS:
        try:
            r = get(seed)
            candidates |= {
                u for u in extract_links(r.text, seed)
                if any(x in u.lower() for x in ("/novita/", "/circolare", ".pdf", "/documento/"))
            }
        except Exception as exc:
            print("seed error", seed, exc)

    found = {}
    for url in sorted(candidates):
        if url in visited or len(visited) >= 80:
            continue
        visited.add(url)

        try:
            r = get(url)
            ctype = r.headers.get("content-type", "").lower()

            if url.lower().endswith(".pdf") or "application/pdf" in ctype:
                text = pdf_text(url)
                title = Path(urlparse(url).path).name
            else:
                text = html_text(r.text)
                soup = BeautifulSoup(r.text, "html.parser")
                title = soup.title.get_text(" ", strip=True) if soup.title else url

            for event in parse_events(text, url, title):
                found[event["id"]] = event
        except Exception as exc:
            print("skip", url, exc)

    return list(found.values())


def main():
    old = {}
    if OUT.exists():
        try:
            old = {
                e["id"]: e
                for e in json.loads(OUT.read_text(encoding="utf-8")).get("events", [])
            }
        except Exception:
            old = {}

    # Existing school-site events are kept and refreshed.
    school_found = import_school_site()
    school_ids = {e["id"] for e in school_found}

    # Google Calendar is optional until its secret iCal URL is configured.
    calendar_found, successful_calendar_sources, calendar_configured = import_google_calendars()

    merged = {}

    for event_id, event in old.items():
        source_type = event.get("sourceType")

        # Calendar events belonging to a successfully fetched calendar are replaced
        # by the current feed, so deletions/moves in Google Calendar propagate.
        if source_type == "google_calendar":
            source_id = event.get("calendarSourceId", "")
            successful_ids = {calendar_source_id(u) for u in successful_calendar_sources}
            if calendar_configured and source_id in successful_ids:
                continue

        # Remove obsolete school-site automatic events only when the current
        # crawl produced a replacement set; manual events remain untouched.
        if source_type == "school_site" and school_found:
            continue

        merged[event_id] = event

    for event in school_found:
        merged[event["id"]] = event

    for event in calendar_found:
        merged[event["id"]] = event

    events = sorted(
        merged.values(),
        key=lambda x: (
            x.get("date", "9999"),
            x.get("time", "99:99"),
            x.get("class", ""),
            x.get("title", ""),
        ),
    )

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": BASE,
        "calendarSync": {
            "configured": calendar_configured,
            "calendarsUpdated": len(successful_calendar_sources),
            "eventsImported": len(calendar_found),
        },
        "classes": CLASSES,
        "events": events,
    }

    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Agenda agent: {len(events)} eventi totali; "
        f"{len(school_found)} dal sito; {len(calendar_found)} da Google Calendar."
    )


if __name__ == "__main__":
    main()

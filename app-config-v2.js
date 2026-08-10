const SCHOOL_YEAR_RANGE = {
  start: "2025-09-15",
  end: "2026-06-13"
};

const WEEKDAY_META = [
  { key: "lun", label: "LUN", offset: 0, weekend: false },
  { key: "mar", label: "MAR", offset: 1, weekend: false },
  { key: "mer", label: "MER", offset: 2, weekend: false },
  { key: "gio", label: "GIO", offset: 3, weekend: false },
  { key: "ven", label: "VEN", offset: 4, weekend: false },
  { key: "sab", label: "SAB", offset: 5, weekend: true }
];

const FIXED_TIMETABLE = [
  {
    hour: "1",
    lessons: {
      lun: { subject: "Informatica", classes: ["2Asa"], title: "Python: esercizi guidati", description: "Attività di consolidamento su input, output e primi algoritmi.", status: "planned", href: "classe.html?classe=2Asa" },
      mar: { subject: "Informatica", classes: ["3Asa"], title: "Liste e dizionari", description: "Esercizi su strutture dati e accesso agli elementi.", status: "planned", href: "classe.html?classe=3Asa" },
      mer: { subject: "Informatica", classes: ["4Asa"], title: "Laboratorio SQL", description: "Attività pratica SQL sul database scolastico.", status: "planned", href: "classe_sql.html?classe=4Asa" },
      gio: { subject: "Informatica", classes: ["4Csa"], title: "Laboratorio SQL", description: "Attività pratica SQL sul database scolastico.", status: "planned", href: "classe_sql.html?classe=4Csa" }
    }
  },
  {
    hour: "2",
    lessons: {
      lun: { subject: "Informatica", classes: ["4Asa"], title: "Classi e oggetti", description: "Esercizi guidati su metodi, attributi e costruttori.", status: "planned", href: "classe.html?classe=4Asa" },
      mer: { subject: "Informatica", classes: ["3Asa"], title: "Dizionari in Python", description: "Applicazioni su chiavi, valori e ricerche.", status: "planned", href: "classe.html?classe=3Asa" },
      gio: { subject: "Informatica", classes: ["4Fsa"], title: "Laboratorio SQL", description: "Esercitazioni SQL sul database scolastico.", status: "planned", href: "classe_sql.html?classe=4Fsa" }
    }
  },
  {
    hour: "3",
    lessons: {
      mar: { subject: "Informatica", classes: ["2Asa"], title: "Cicli e condizioni", description: "Esercizi progressivi su for, while e if.", status: "planned", href: "classe.html?classe=2Asa" },
      gio: { subject: "Informatica", classes: ["1Asa"], title: "Competenze digitali di base", description: "Attività operative e scheda di lavoro per la classe prima.", status: "planned", href: "classe.html?classe=1Asa" }
    }
  },
  {
    hour: "4",
    lessons: {
      mar: { subject: "Informatica", classes: ["4Csa"], title: "Strutture HTML e CSS", description: "Attività guidata di progettazione pagina web.", status: "planned", href: "classe.html?classe=4Csa" },
      sab: { subject: "Informatica", classes: ["1Asa"], title: "Verifica operativa", description: "Scheda di esercitazione e ripasso finale della settimana.", status: "planned", href: "classe.html?classe=1Asa" }
    }
  },
  {
    hour: "5",
    lessons: {
      lun: { subject: "Informatica", classes: ["3Fsa"], title: "Laboratorio Python", description: "Esercizi applicativi in browser e debug di base.", status: "planned", href: "classe.html?classe=3Fsa" },
      mer: { subject: "Informatica", classes: ["4Fsa"], title: "Simulazioni e coding", description: "Attività assegnata con esercizi da svolgere su classe.html.", status: "planned", href: "classe.html?classe=4Fsa" },
      sab: { subject: "Informatica", classes: ["3Fsa"], title: "Recupero e potenziamento", description: "Esercizi settimanali di rinforzo e approfondimento.", status: "planned", href: "classe.html?classe=3Fsa" }
    }
  },
  { hour: "6", lessons: {} }
];

const CLASS_ARCHIVE_FOLDERS = {
  "1Asa": "tracce/Prime",
  "2Asa": "tracce/Seconde",
  "3Asa": "tracce/Terze",
  "3Fsa": "tracce/Terze",
  "4Asa": "tracce/Quarte",
  "4Csa": "tracce/Quarte",
  "4Fsa": "tracce/Quarte"
};

const EXERCISE_ROWS = [
  ["2026-04-16", "1Asa", "Esercizio_10.pdf"],
  ["2026-04-27", "2Asa", "Esercizio_30.pdf"],
  ["2026-05-04", "2Asa", "Esercizio_40.pdf"],
  ["2026-04-15", "3Asa", "Esercizio_21.pdf"],
  ["2026-04-27", "3Fsa", "Esercizio_21.pdf"],
  ["2026-04-29", "4Asa", "https://script.google.com/a/macros/lscortese.com/s/AKfycbxoNA7maH0VX6yWmwwDh8YfGPwOz3OmhMhtnxk7UpcY9FcVDj_K2iB4i8d5WP4MBa7J4g/exec"],
  ["2026-04-30", "4Csa", "https://script.google.com/a/macros/lscortese.com/s/AKfycbxoNA7maH0VX6yWmwwDh8YfGPwOz3OmhMhtnxk7UpcY9FcVDj_K2iB4i8d5WP4MBa7J4g/exec"],
  ["2026-04-30", "4Fsa", "https://script.google.com/a/macros/lscortese.com/s/AKfycbxoNA7maH0VX6yWmwwDh8YfGPwOz3OmhMhtnxk7UpcY9FcVDj_K2iB4i8d5WP4MBa7J4g/exec"]
];

function lessonKey(dateISO, cls){ return `${dateISO}|${cls}`; }

const EXERCISE_ARCHIVE = Object.fromEntries(
  EXERCISE_ROWS
    .filter(row => Array.isArray(row) && row.length >= 3 && row[0] && row[1] && row[2])
    .map(([dateISO, cls, fileName]) => [lessonKey(dateISO, cls), fileName])
);

const LESSON_ASSIGNMENTS = {
  "2026-03-23|2Asa": { title: "Input, output e variabili", description: "Traccia della 2Asa caricata nella cartella tracce/Seconde e collegata automaticamente al calendario." },
  "2026-03-24|3Asa": { title: "Liste e dizionari: esercizi operativi", description: "Scheda della 3Asa con collegamento automatico al file dell'archivio esercizi." },
  "2026-03-25|4Asa": { title: "OOP: classi, metodi e oggetti", description: "Esercitazione della 4Asa collegata automaticamente alla cartella delle Quarte." }
};

function normalizePathPart(value){
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function isAbsoluteUrl(value){
  return /^https?:\/\//i.test(String(value || '').trim());
}

function resolveArchiveFilePath(dateISO, cls){
  const archiveFile = EXERCISE_ARCHIVE[lessonKey(dateISO, cls)];
  if(!archiveFile) return null;

  if(isAbsoluteUrl(archiveFile)) return archiveFile;

  const archiveFolder = CLASS_ARCHIVE_FOLDERS[cls];
  if(!archiveFolder) return null;

  return `${normalizePathPart(archiveFolder)}/${normalizePathPart(archiveFile)}`;
}

function buildDefaultLessonHref(cls, dateISO){
  const archivePath = resolveArchiveFilePath(dateISO, cls);
  if(archivePath){
    if(isAbsoluteUrl(archivePath)) return archivePath;
    const fileName = archivePath.split('/').pop();
    return `classe.html?classe=${encodeURIComponent(cls)}&data=${encodeURIComponent(dateISO)}&file=${encodeURIComponent(archivePath)}&title=${encodeURIComponent(fileName)}`;
  }
  return `classe.html?classe=${encodeURIComponent(cls)}&data=${encodeURIComponent(dateISO)}`;
}

function getArchiveHint(dateISO, cls){
  const archivePath = resolveArchiveFilePath(dateISO, cls);
  if(!archivePath) return `Nessun file specifico associato per ${cls} in questa data.`;
  if(isAbsoluteUrl(archivePath)) return `Risorsa esterna collegata.`;
  return `File esercizio collegato: ${archivePath}`;
}

const weeklyGrid = document.getElementById('weekly-grid');
const weeklyClassFilter = document.getElementById('weekly-class-filter');
const weeklyWeekLabel = document.getElementById('weekly-week-label');
const weeklyPrevBtn = document.getElementById('weekly-prev-btn');
const weeklyNextBtn = document.getElementById('weekly-next-btn');
const weeklyDetailTitle = document.getElementById('weekly-detail-title');
const weeklyDetailDate = document.getElementById('weekly-detail-date');
const weeklyDetailDescription = document.getElementById('weekly-detail-description');
const weeklyDetailLink = document.getElementById('weekly-detail-link');

function toDate(dateString){ const [year, month, day] = dateString.split('-').map(Number); return new Date(year, month - 1, day); }
function pad(n){ return String(n).padStart(2, '0'); }
function formatISO(date){ return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function formatIT(date){ return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`; }
function cloneDate(date){ return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function addDays(date, days){ const cloned = cloneDate(date); cloned.setDate(cloned.getDate() + days); return cloned; }
function getMonday(date){ const cloned = cloneDate(date); const jsDay = cloned.getDay(); const delta = jsDay === 0 ? -6 : 1 - jsDay; cloned.setDate(cloned.getDate() + delta); return cloned; }

function enrichLesson(lesson, dateISO){
  if(!lesson) return null;
  const enriched = { ...lesson, classes: [...(lesson.classes || [])] };
  const overrides = {};
  enriched.classes.forEach(cls => {
    const specific = LESSON_ASSIGNMENTS[lessonKey(dateISO, cls)];
    if(specific) overrides[cls] = specific;
  });
  if(Object.keys(overrides).length){
    enriched.overridesByClass = overrides;
    const firstSpecific = overrides[enriched.classes[0]] || Object.values(overrides)[0];
    if(firstSpecific?.title) enriched.title = firstSpecific.title;
    if(firstSpecific?.description) enriched.description = firstSpecific.description;
  }
  return enriched;
}

function buildWeekData(mondayDate){
  const days = WEEKDAY_META.map(day => {
    const date = addDays(mondayDate, day.offset);
    return { ...day, dateISO: formatISO(date), label: `${day.label} ${formatIT(date)}` };
  });

  const slots = FIXED_TIMETABLE.map(slot => {
    const lessons = {};
    Object.entries(slot.lessons || {}).forEach(([dayKey, lesson]) => {
      const dayMeta = days.find(d => d.key === dayKey);
      lessons[dayKey] = enrichLesson(lesson, dayMeta.dateISO);
    });
    return { hour: slot.hour, lessons };
  });

  return {
    start: formatISO(mondayDate),
    label: `${formatIT(days[0] ? toDate(days[0].dateISO) : mondayDate)} – ${formatIT(days[5] ? toDate(days[5].dateISO) : addDays(mondayDate, 5))}`,
    days,
    slots
  };
}

const firstSchoolMonday = getMonday(toDate(SCHOOL_YEAR_RANGE.start));
const lastSchoolMonday = getMonday(toDate(SCHOOL_YEAR_RANGE.end));
let currentMonday = getMonday(new Date());
if(currentMonday < firstSchoolMonday) currentMonday = cloneDate(firstSchoolMonday);
if(currentMonday > lastSchoolMonday) currentMonday = cloneDate(lastSchoolMonday);

function getWeeklyClasses(){
  const found = new Set();
  FIXED_TIMETABLE.forEach(slot => {
    Object.values(slot.lessons || {}).forEach(lesson => {
      (lesson.classes || []).forEach(cls => found.add(cls));
    });
  });
  return Array.from(found).sort((a, b) => a.localeCompare(b, 'it'));
}

function populateWeeklyClassFilter(){
  if(!weeklyClassFilter) return;
  const options = getWeeklyClasses().map(cls => `<option value="${cls}">${cls}</option>`).join('');
  weeklyClassFilter.innerHTML = `<option value="all">Tutte le classi</option>${options}`;
}

function resolveLessonHref(lesson, selectedClass, dateISO){
  if(!lesson) return '#';

  if(selectedClass && selectedClass !== 'all'){
    const specific = lesson.overridesByClass && lesson.overridesByClass[selectedClass];
    if(specific?.href) return specific.href;
    if(lesson.hrefByClass && lesson.hrefByClass[selectedClass]) return lesson.hrefByClass[selectedClass];
    return buildDefaultLessonHref(selectedClass, dateISO);
  }

  if(lesson.overridesByClass){
    const firstOverride = Object.values(lesson.overridesByClass)[0];
    if(firstOverride?.href) return firstOverride.href;
  }

  if(lesson.hrefByClass){
    const firstClass = (lesson.classes || [])[0];
    if(firstClass && lesson.hrefByClass[firstClass]) return lesson.hrefByClass[firstClass];
  }

  const firstClass = (lesson.classes || [])[0];
  return firstClass ? buildDefaultLessonHref(firstClass, dateISO) : (lesson.href || '#');
}

function getVisibleLessonText(lesson, selectedClass){
  if(!lesson) return '';
  if(selectedClass && selectedClass !== 'all' && lesson.overridesByClass && lesson.overridesByClass[selectedClass]?.title){
    return lesson.overridesByClass[selectedClass].title;
  }
  return lesson.title || lesson.description || 'Lezione disponibile';
}

function getVisibleLessonDescription(lesson, selectedClass, dateISO){
  if(!lesson) return '';
  if(selectedClass && selectedClass !== 'all' && lesson.overridesByClass && lesson.overridesByClass[selectedClass]?.description){
    return `${lesson.overridesByClass[selectedClass].description} ${getArchiveHint(dateISO, selectedClass)}`;
  }
  const firstClass = selectedClass && selectedClass !== 'all' ? selectedClass : ((lesson.classes || [])[0] || '');
  const baseDescription = lesson.description || lesson.title || 'Lezione disponibile.';
  return `${baseDescription} ${firstClass ? getArchiveHint(dateISO, firstClass) : ''}`.trim();
}

function updateWeeklyLessonDetail(dayLabel, hour, lesson, dateISO){
  if(!weeklyDetailTitle || !weeklyDetailDate || !weeklyDetailDescription || !weeklyDetailLink) return;

  if(!lesson){
    weeklyDetailTitle.textContent = 'Seleziona una lezione dal calendario';
    weeklyDetailDate.textContent = 'Il dettaglio della lezione comparirà qui.';
    weeklyDetailDescription.textContent = '';
    weeklyDetailLink.style.display = 'none';
    weeklyDetailLink.removeAttribute('target');
    weeklyDetailLink.removeAttribute('rel');
    return;
  }

  const selectedClass = weeklyClassFilter ? weeklyClassFilter.value : 'all';
  const visibleClasses = selectedClass !== 'all' ? [selectedClass] : (lesson.classes || []);
  const href = resolveLessonHref(lesson, selectedClass, dateISO);

  weeklyDetailTitle.textContent = `${lesson.subject} • ${visibleClasses.join(' - ')}`;
  weeklyDetailDate.textContent = `${dayLabel} • ${hour}ª ora`;
  weeklyDetailDescription.textContent = getVisibleLessonDescription(lesson, selectedClass, dateISO);
  weeklyDetailLink.href = href;
  weeklyDetailLink.style.display = 'inline-flex';

  if(isAbsoluteUrl(href)){
    weeklyDetailLink.target = '_blank';
    weeklyDetailLink.rel = 'noopener noreferrer';
  } else {
    weeklyDetailLink.removeAttribute('target');
    weeklyDetailLink.removeAttribute('rel');
  }
}

function renderWeeklyLessons(){
  if(!weeklyGrid || !weeklyWeekLabel) return;

  const week = buildWeekData(currentMonday);
  const selectedClass = weeklyClassFilter ? weeklyClassFilter.value : 'all';
  weeklyWeekLabel.textContent = `Settimana ${week.label}`;
  weeklyGrid.innerHTML = '';

  const headers = ['ORA', ...week.days.map(day => day.label)];
  headers.forEach((header, index) => {
    const cell = document.createElement('div');
    cell.className = 'weekly-grid-header';
    cell.textContent = header;
    if(index === 0) cell.style.minWidth = '72px';
    weeklyGrid.appendChild(cell);
  });

  week.slots.forEach(slot => {
    const hourCell = document.createElement('div');
    hourCell.className = 'weekly-grid-hour';
    hourCell.innerHTML = `<span>${slot.hour}</span>`;
    weeklyGrid.appendChild(hourCell);

    week.days.forEach(day => {
      const cell = document.createElement('div');
      const lesson = slot.lessons ? slot.lessons[day.key] : null;
      cell.className = `weekly-grid-cell${day.weekend ? ' weekend' : ''}${lesson ? '' : ' empty'}`;

      const visibleLesson = lesson && (selectedClass === 'all' || (lesson.classes || []).includes(selectedClass));

      if(visibleLesson){
        const link = document.createElement('a');
        const href = resolveLessonHref(lesson, selectedClass, day.dateISO);

        link.className = 'weekly-lesson-link';
        link.href = href;

        if(isAbsoluteUrl(href)){
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }

        link.innerHTML = `
          <span class="weekly-status ${lesson.status === 'confirmed' ? 'confirmed' : 'planned'}">
            <i class="fas ${lesson.status === 'confirmed' ? 'fa-check' : 'fa-pen'}"></i>
          </span>
          <span class="weekly-subject">${lesson.subject}</span>
          <span class="weekly-class">${selectedClass !== 'all' ? selectedClass : (lesson.classes || []).join(' - ')}</span>
          <span class="weekly-plus"><i class="fas fa-plus"></i></span>
        `;

        link.title = getVisibleLessonText(lesson, selectedClass);
        link.addEventListener('click', () => updateWeeklyLessonDetail(day.label, slot.hour, lesson, day.dateISO));
        cell.appendChild(link);
      } else {
        const empty = document.createElement('div');
        empty.className = 'weekly-empty-note';
        empty.textContent = selectedClass === 'all' ? '' : '—';
        cell.appendChild(empty);
      }

      weeklyGrid.appendChild(cell);
    });
  });

  if(weeklyPrevBtn) weeklyPrevBtn.disabled = currentMonday <= firstSchoolMonday;
  if(weeklyNextBtn) weeklyNextBtn.disabled = currentMonday >= lastSchoolMonday;
  updateWeeklyLessonDetail(null, null, null, null);
}

populateWeeklyClassFilter();
renderWeeklyLessons();

if(weeklyClassFilter){
  weeklyClassFilter.addEventListener('change', renderWeeklyLessons);
}

if(weeklyPrevBtn){
  weeklyPrevBtn.addEventListener('click', () => {
    const candidate = addDays(currentMonday, -7);
    if(candidate >= firstSchoolMonday){
      currentMonday = candidate;
      renderWeeklyLessons();
    }
  });
}

if(weeklyNextBtn){
  weeklyNextBtn.addEventListener('click', () => {
    const candidate = addDays(currentMonday, 7);
    if(candidate <= lastSchoolMonday){
      currentMonday = candidate;
      renderWeeklyLessons();
    }
  });
}

/* Corso Python OOP · rendering dei diagrammi UML (Mermaid classDiagram) nei colori del sito. */
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  themeVariables: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: '15px',
    primaryColor: '#e5f2f7',
    primaryBorderColor: '#176b87',
    primaryTextColor: '#102a43',
    lineColor: '#176b87',
    secondaryColor: '#fff4d6',
    tertiaryColor: '#ffffff'
  },
  class: { useMaxWidth: false }
});

try {
  await mermaid.run({ querySelector: 'pre.mermaid' });
} catch (err) {
  document.querySelectorAll('pre.mermaid').forEach(el => {
    if (!el.querySelector('svg')) el.insertAdjacentHTML('afterend', '<p class="muted">Diagramma non disponibile offline: il testo sopra ne riporta la struttura.</p>');
  });
}

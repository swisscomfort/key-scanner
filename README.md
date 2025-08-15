
# Dark PWA Starter (React + Vite + TS)

Moderne, installierbare Progressive Web App mit dunklem UI.

## Schnellstart

```bash
npm install
npm run dev
```

Build & Preview (Production):

```bash
npm run build
npm run preview
```

## Deployment auf GitHub Pages

Automatisches Deployment ist via GitHub Actions konfiguriert (`.github/workflows/deploy.yml`).

1. Repository auf GitHub erstellen (Name nach Wunsch, z. B. `dark-pwa-starter`).
2. Dieses Projekt pushen (siehe Befehle unten).
3. In den Repo-Einstellungen unter "Pages" als Source "GitHub Actions" wählen. Der Workflow deployed bei jedem Push auf `main`.

Technikdetails:
- Der Build nutzt eine Umgebungsvariable `BASE_PATH`, damit Vite unter Subpfaden (z. B. `/REPO/`) korrekt ausliefert.
- Manifest, Icons und Service Worker sind relativ verlinkt und funktionieren unter Subpfad.

### Initiales Pushen

```bash
git init
git branch -M main
git add -A
git commit -m "chore: initial commit"
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

Nach dem ersten erfolgreichen Workflow ist die Seite unter
`https://<USER>.github.io/<REPO>/` erreichbar. Für User/Org-Pages (`<USER>.github.io`) ist sie unter `https://<USER>.github.io/` erreichbar.

## Features

- **PWA-Ready**: Manifest, Service Worker, Offline-Fallback, Install-Button.
- **Dark UI**: Moderne, kontrastreiche Gestaltung mit CSS-Variablen.
- **React + Vite + TypeScript**: Schnell, modern, DX-freundlich.
- **Update-Flow**: Einfacher Update-Hinweis und Reload.

## Struktur

- `public/manifest.webmanifest` — App-Manifest
- `public/sw.js` — Service Worker
- `public/offline.html` — Offline-Fallback
- `src/` — React App
- `index.html` — Entry (Vite)

## Hinweise

- Der Service Worker wird nur in der gebauten App (`npm run build && npm run preview`) aktiv.
- Passen Sie `theme-color`, Icons und Texte an Ihr Projekt an.

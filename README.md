# Timo Kraft Baudienstleistungen – Website

Moderne Website für Timo Kraft Baudienstleistungen.

## Passwortschutz

Standard-Passwort: **TKBau2025!**

Um das Passwort zu ändern:
1. Browser-Konsole öffnen (F12)
2. Neuen Hash berechnen:
   ```js
   const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('DeinNeuesPasswort'));
   console.log([...new Uint8Array(h)].map(b => b.toString(16).padStart(2,'0')).join(''));
   ```
3. Den ausgegebenen Hex-String in `js/app.js` bei `PASS_HASH` ersetzen

## Bilder hinzufügen

Lege folgende Bilder im Ordner `img/` ab:

| Datei            | Beschreibung                        |
|------------------|-------------------------------------|
| `logo-icon.png`  | TK-Logo (quadratisch, transparent)  |
| `logo-full.png`  | Volles Logo mit Schriftzug          |
| `hero-bg.jpg`    | Hintergrundbild der Startseite      |
| `team.jpg`       | Teambild für „Über uns"             |
| `ref-1.jpg`      | Referenzprojekt 1                   |
| `ref-2.jpg`      | Referenzprojekt 2                   |
| `ref-3.jpg`      | Referenzprojekt 3                   |

## GitHub Pages aktivieren

1. Auf GitHub → Repository → **Settings**
2. → **Pages** → Source: **Deploy from branch** → Branch: `main` → `/root`
3. Speichern – die Seite ist dann unter `https://excause.github.io/T-k-bau/` erreichbar

## Kontaktformular

Das Formular zeigt derzeit eine Erfolgs-Meldung ohne echten Versand.  
Für echten E-Mail-Versand empfehlen wir [Formspree](https://formspree.io):
1. Account anlegen, Formular erstellen
2. In `js/app.js` den auskommentierten Fetch-Block aktivieren und `YOUR_ID` ersetzen

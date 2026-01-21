## Issue: Add requirements file structure + split MVP spec + add copy bank + clean README

Repo: service-crew

---

### Goal
Refactor the repo to use a clear markdown requirements structure (multiple files) instead of one big summary, add a complete copy bank, and update the README to reflect *this* project only.

---

## 1) Folder structure to create

Create the following structure in the repo:

/requirements
  /mvp
    00-overview.md
    01-landing-and-workshop.md
    02-mechanics-and-login.md
    03-calendar.md
    04-job-cards-and-planning.md
    05-status-and-context-menu.md
    06-booking-card-and-details-modal.md
    07-technical-guidelines.md
    08-storage-and-storage-service.md
    09-non-goals.md
  /features
    (future feature specs go here)
  /copy
    copy-bank.md
  /decisions
    adr-001-localstorage.md

Notes:
- requirements/mvp/00-overview.md is the entry point and should link to all other MVP files.
- Each file should be focused and relatively short.
- Use consistent linking (either Obsidian-style [[file]] or normal markdown links).

---

## 2) Split the existing MVP summary into files

Take the current large MVP markdown document and split it as follows:

- Landing page + “Skapa ny verkstad” → 01-landing-and-workshop.md
- Mechanics setup + fake auth → 02-mechanics-and-login.md
- Calendar rules + IDAG behaviour + unplanned column → 03-calendar.md
- Create job card (Step A) + drag & drop planning (Step B) → 04-job-cards-and-planning.md
- Status flow + context menu → 05-status-and-context-menu.md
- Calendar card content + details modal with expand animation → 06-booking-card-and-details-modal.md
- Tech stack, performance principles, animation guidance, component strategy → 07-technical-guidelines.md
- LocalStorage + StorageService abstraction + persistence rules → 08-storage-and-storage-service.md
- Non-goals → 09-non-goals.md
- Overview with links → 00-overview.md

Rules:
- Reorganize, do not rewrite.
- Do not invent new requirements.
- If something is unclear or missing, add a TODO note.

---

## 3) Add copy bank

Create requirements/copy/copy-bank.md with the following content.

---

# Copy bank — Service Crew

Principles:
- Short
- Readable
- One message at a time
- Tone: real workshop, slightly funny, not childish (target ~10 years)
- Never block play — always allow a way forward

---

## Landing page

Titles / headings:
- Välkommen till verkstaden
- Logga in
- Välj mekaniker
- Skapa mekaniker
- Verkstad

Buttons:
- Logga in
- Lägg till mekaniker
- Skapa ny verkstad
- Spara
- Avbryt
- Stäng

Empty state (no workshop):
- Ingen verkstad än. Skapa en ny för att börja.
- Skapa verkstad och öppna portarna.

Empty state (no mechanics):
- Inga mekaniker ännu. Lägg till första mekanikern.
- Lägg till en mekaniker så kan ni börja jobba.

---

## Skapa ny verkstad (reset)

Dialog title:
- Skapa ny verkstad

Body text variants:
- Starta om allt och skapa en ny verkstad?
- Ny verkstad = tom kalender, nya mekaniker och nya jobb.
- Ska vi öppna en helt ny verkstad från noll?

Buttons:
- Skapa verkstad
- Avbryt

Success:
- Ny verkstad skapad

---

## Login (PIN / lösenord)

Labels:
- Mekaniker
- PIN-kod
- Lösenord

Numpad helper:
- Ange din 4-siffriga kod

Wrong code dialog title:
- 🚫 Fel kod i verkstaden

Wrong code messages (randomize one):

Olja & verktyg:
- Nä… händerna var så oljiga att knapparna gled iväg!
- Fel kod. Skiftnyckeln tryckte visst på fel siffra.
- Oops! Det blev mer olja än kod.
- Tangenterna fick verktyg i sig… fel kod.

Maskiner & ljud:
- Motorn sa klonk… fel kod!
- Startmotorn hostade till – det där var inte rätt.
- Det skramlade lite… koden blev fel.
- Verkstaden blinkar rött – prova igen?

Mekaniker-humor:
- Mekanikern kliade sig i hjälmen – fel kod.
- Fel kod. Kaffepaus kanske?
- Nästan! Men verkstaden säger nej.
- Fel kod. Tur att det inte exploderade 😅

Wrong code buttons:
- Försök igen
- Logga in ändå

Login success:
- Porten är öppen
- Verkstaden är igång
- Du är inne

---

## Kalender

Navigation buttons:
- Idag
- Föregående vecka
- Nästa vecka

Selected workday badge:
- IDAG

Hint (optional):
- Klicka på en dag för att sätta IDAG

---

## Ej planerade (vänsterkolumn)

Column title:
- Ej planerade

Empty state:
- Inga jobb här just nu.
- Skapa ett jobbkort så dyker det upp här.

Microcopy:
- Dra ett jobb hit till kalendern när ni hittat en lucka.

---

## Skapa jobbkort (Steg A)

Form labels:
- Kund
- Telefon
- Typ
- Åtgärd
- Tid

Helpers:
- Skriv vad kunden sa
- Hur lång tid tar det?

Time buttons:
- − 1h
- + 1h

Buttons:
- Skapa jobbkort
- Avbryt

Success:
- Jobbkort skapat
- Uppskrivet i verkstadsboken
- Jobbet ligger i Ej planerade

---

## Drag & drop-planering (Steg B)

While dragging:
- Släpp för att planera
- Hitta en lucka och släpp

Invalid drop:
- Får inte plats där
- Upptaget här
- För tight, prova en annan tid
- Den luckan är full

Valid drop success:
- Planerat
- Inlagt i kalendern
- Jobbet är bokat

---

## Bokningskort (kalender)

Shown content:
- Fordonstyp
- Åtgärd (trunkerad)

Optional hint:
- Klicka för detaljer

---

## Detaljvy (bokning)

Sections:
- Kund
- Åtgärd
- Status
- Mekaniker

Buttons:
- Öppna meny
- Stäng

---

## Status & context-meny

Status names:
- Ej planerad
- Planerad
- Pågår
- Klar
- Hämtad

Context menu sections:
- Status
- Mekaniker

Save:
- Spara

Rule message:
- Välj en mekaniker först

---

## Status change messages

Planerad:
- Inplanerat
- Ligger i kalendern nu

Pågår:
- Jobbet är igång
- Mekanikern tar den
- Nu kör vi

Klar:
- Klart!
- Fixat
- Godkänt

Hämtad:
- Utlämnat
- Kunden hämtade
- Borta från verkstan

---

## Generic success
- Klart
- Sparat
- Uppdaterat
- Fixat

## Generic error (non-blocking)
- Något blev fel, men vi kör ändå
- Det blev knas, prova igen

---

## Workshop one-liners (generic)
- Rullar in…
- Skruvar lite…
- Kollar läget…
- Testar…
- Nästan klar…
- Stämplar…
- Allt ser bra ut…

---

## 4) Update README

Replace the template README with a short project-specific README that includes:
- What Service Crew is (kids workshop booking web app)
- Core concept: unplanned job cards → drag into weekly calendar → status flow
- Tech stack: Vite + React + Tailwind + LocalStorage
- Link to requirements entry point: requirements/mvp/00-overview.md
- Minimal run instructions or “Coming soon”

---

## Acceptance Criteria
- New requirements folder structure exists
- MVP spec is split across files with 00-overview.md as entry point
- Copy bank exists at requirements/copy/copy-bank.md
- README reflects Service Crew only (no template leftovers)
- Single source of truth for requirements (no duplicate old spec)

---

## Copilot prompt (paste into GitHub Copilot coding agent)

You are working in the repo "service-crew". Create the markdown requirements structure under /requirements as described above. Split the existing large MVP summary into the new /requirements/mvp/*.md files, preserving content and meaning. Add the full copy bank to /requirements/copy/copy-bank.md. Replace the template README with a concise, project-specific README for Service Crew that links to requirements/mvp/00-overview.md.

Constraints:
- Do not invent new requirements.
- Reorganize existing content only.
- If something is unclear, add a TODO comment.
- Use consistent linking between files.
- Leave exactly one source of truth for requirements.

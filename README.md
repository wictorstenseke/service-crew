# Service Crew

En lekfull verkstadsbokning-webapp för barn som leker verkstad.

## Vad är Service Crew?

Service Crew är ett digitalt verktyg som stödjer barns lek när de leker verkstad. Appen gör det möjligt att:

- Skapa jobbkort för olika fordon (cyklar, leksaksbilar, etc.)
- Planera in jobb i en veckokalender via drag & drop
- Följa jobb genom olika statusar (Ej planerad → Planerad → Pågår → Klar → Hämtad)
- Hantera flera mekaniker med lekfull inloggning

Appen är byggd för att kännas "på riktigt" men vara helt ofarlig: tydlig feedback, humor och full kontroll för barnen.

## Tech Stack

- **Vite + React 19** – snabb och modern utvecklingsmiljö
- **TypeScript** – type-safe utveckling
- **Tailwind CSS** – utility-first styling
- **LocalStorage** – all data lagras lokalt, ingen backend krävs

## Dokumentation

📖 **[Requirements och specifikation](requirements/mvp/00-overview.md)**

Fullständig MVP-specifikation finns i [requirements/mvp/](requirements/mvp/) katalogen:
- Funktionella krav och flöden
- Tekniska guidelines
- UX-principer och copy
- Architecture decisions

### Viktigt för utvecklare och AI-agenter

🤖 **[Läs alltid requirements innan du börjar arbeta](.github/WORKFLOW_REQUIREMENTS.md)**

Innan du startar någon uppgift, läs alltid relevanta dokument från `requirements/` katalogen. Se [arbetsflödesguiden](.github/WORKFLOW_REQUIREMENTS.md) för:
- Vilka dokument ska läsas först
- Hur man hittar rätt information snabbt
- Checklista för att starta en uppgift
- Integration med GitHub Copilot och AI-agenter

## Kom igång

Coming soon – instruktioner för att köra projektet lokalt.

### Prerequisites

- **Node.js** (>= 20.0.0)
- **npm** (>= 10.0.0)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Öppna `http://localhost:5173` i din webbläsare.

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Projektstruktur

```
service-crew/
├── .github/             # GitHub och AI-agent instruktioner
│   ├── agents/         # Agent-specifika konfigurationer
│   └── ...             # Copilot instruktioner och workflows
├── requirements/        # Specifikation och dokumentation
│   ├── mvp/            # MVP-krav och flöden
│   ├── copy/           # Copy bank med all text
│   ├── features/       # Framtida features
│   └── decisions/      # Architecture Decision Records
├── src/                # Källkod
├── public/             # Statiska assets
└── ...
```

# GitHub Copilot Instructions for Service Crew

## Project Overview
Service Crew är en lekfull verkstadsbokning-webapp för barn som leker verkstad. Appen är byggd med React, Vite, och Tailwind CSS, och använder LocalStorage för datalagring.

## Required Reading Before Starting Work

**VIKTIGT**: Innan du börjar arbeta på någon uppgift, läs alltid följande dokument för att förstå projektets struktur, krav och kontext:

### Grundläggande dokumentation (alltid läs först):
1. **[MVP Overview](../requirements/mvp/00-overview.md)** - Övergripande projektbeskrivning och MVP-scope
2. **[Technical Guidelines](../requirements/mvp/07-technical-guidelines.md)** - Tekniska riktlinjer och best practices
3. **[Storage och StorageService](../requirements/mvp/08-storage-and-storage-service.md)** - Hur data hanteras i appen

### Funktionell dokumentation (läs relevanta delar):
- **[Landing page och verkstad](../requirements/mvp/01-landing-and-workshop.md)** - Första sidan och verkstadsskapande
- **[Mekaniker och inloggning](../requirements/mvp/02-mechanics-and-login.md)** - Användarhantering
- **[Kalender](../requirements/mvp/03-calendar.md)** - Kalenderfunktionalitet
- **[Jobbkort och planering](../requirements/mvp/04-job-cards-and-planning.md)** - Jobbkort och drag & drop
- **[Status och context-meny](../requirements/mvp/05-status-and-context-menu.md)** - Statushantering
- **[Bokningskort och detaljvy](../requirements/mvp/06-booking-card-and-details-modal.md)** - Bokningskort UI

### Designprinciper och text:
- **[Copy Bank](../requirements/copy/copy-bank.md)** - All text och copy som används i appen
- **[Architecture Decision Records](../requirements/decisions/)** - Tekniska beslut och motiveringar

### Icke-mål:
- **[Icke-mål](../requirements/mvp/09-non-goals.md)** - Vad som medvetet INTE ingår i MVP

## Arbetsflöde

1. **Läs requirements**: Börja alltid med att läsa relevanta dokument från `requirements/` katalogen
2. **Förstå kontext**: Se till att du förstår projektet syfte - det är ett lekverktyg för barn
3. **Följ tekniska guidelines**: All kod ska följa de tekniska riktlinjerna i `07-technical-guidelines.md`
4. **Använd copy bank**: Använd text från `copy-bank.md` för all användarvända text
5. **Testa lokalt**: Kör `npm run dev` och verifiera att din implementation fungerar
6. **Kodstil**: Använd `npm run format` för att formatera kod innan commit

## Tech Stack
- **Frontend**: Vite + React 19
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: LocalStorage via StorageService
- **Ingen backend eller API**

## Viktiga principer
- **Lekfullhet**: Appen ska kännas "på riktigt" men vara helt ofarlig
- **Tydlig feedback**: Användaren ska alltid förstå vad som händer
- **Barnvänlig**: Designad för barn att använda självständigt
- **Ingen komplexitet**: Tekniskt enkelt, UX-mässigt genomtänkt

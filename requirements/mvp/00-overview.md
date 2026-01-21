# MVP – Verkstadsbokning för barn  
_Servicebokning av cyklar och andra fordon_

---

## Syfte
En lekfull webapp som fungerar som ett **verktyg i leken** när barn leker verkstad.  
Appen ska kännas "på riktigt" men vara helt ofarlig: tydlig feedback, humor och full kontroll för barnen.

Detta är **inte** ett produktionssystem – det är ett **lekstöd**.

---

## Övergripande flöde
1. Verkstad väljs eller skapas
2. Mekaniker loggar in (låtsas-auth)
3. Kund kommer in → barnen skapar ett **jobbkort**
4. Jobbkort planeras in i kalendern via drag & drop
5. Mekaniker tar jobb, jobbar, markerar klara
6. Dagen avslutas → barnen väljer själva nästa dag att jobba med

---

## Teknik (MVP)
- Frontend: **Vite + React**
- Styling: **Tailwind CSS**
- Data: **LocalStorage**
- Ingen backend, inga API-anrop
- Appen är helt klientbaserad

---

## MVP-specifikation

Denna översikt länkar till alla delar av MVP-specifikationen:

1. [Landing page och verkstadsskapande](01-landing-and-workshop.md)
2. [Mekaniker och inloggning](02-mechanics-and-login.md)
3. [Kalender](03-calendar.md)
4. [Jobbkort och planering](04-job-cards-and-planning.md)
5. [Status och context-meny](05-status-and-context-menu.md)
6. [Bokningskort och detaljvy](06-booking-card-and-details-modal.md)
7. [Tekniska guidelines](07-technical-guidelines.md)
8. [Storage och StorageService](08-storage-and-storage-service.md)
9. [Icke-mål](09-non-goals.md)

---

## Sammanfattning
MVP:n är:
- Snabb
- Lekfull
- Förlåtande
- Tydlig

Tekniskt enkel, UX-mässigt genomtänkt.  
All komplexitet som inte stärker leken är bortvald.

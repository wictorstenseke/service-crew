# MVP – Verkstadsbokning för barn  
_Servicebokning av cyklar och andra fordon_

---

## Syfte
En lekfull webapp som fungerar som ett **verktyg i leken** när barn leker verkstad.  
Appen ska kännas “på riktigt” men vara helt ofarlig: tydlig feedback, humor och full kontroll för barnen.

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

### Prestanda-princip
- Appen ska kännas **omedelbar och snabb**
- Inga tekniska loaders behövs eftersom:
  - All data finns lokalt
  - Datamängden är liten
- Eventuella delays används **endast** som lekfull feedback (micro-UX), aldrig av tekniska skäl

---

## Tekniska guidelines (MVP)

### State & arkitektur
- All data laddas från LocalStorage vid appstart
- State hålls i React (t.ex. Context eller enkel global store)
- Ingen server state / ingen caching-lösning behövs

### StorageService (viktig princip)
All åtkomst till LocalStorage ska gå via ett abstraherande lager.

**Exempel (konceptuellt):**
- `storageService.getWorkshop()`
- `storageService.setWorkshop(data)`
- `storageService.getBookings()`
- `storageService.saveBooking(booking)`
- `storageService.getMechanics()`
- `storageService.saveMechanic(mechanic)`

Syfte:
- Enkel testbarhet
- Möjlighet att senare byta till t.ex. Firebase/Supabase utan att skriva om UI
- Samlad plats för versionering / reset

### Persistens
- Spara till LocalStorage:
  - Vid varje relevant ändring
  - Eller med lätt debounce (valfritt)
- Inget behov av optimering – datamängden är minimal

### Animationer
- Använd CSS transitions / transforms (via Tailwind)
- Prioritera:
  - `opacity`
  - `transform: scale / translate`
- Undvik tunga animationer eller externa lib i MVP

### Komponentstrategi
- Inga tunga UI-bibliotek krävs
- Lekfullhet uppnås genom:
  - spacing
  - rundade former
  - animationer
  - copy
- Komponenter testas fram iterativt

---

## Lagring (MVP)
- All data lagras i **LocalStorage**
- En verkstad per browser (om inget annat skapas)
- Ingen synk mellan enheter

**Lagrade objekt:**
- Verkstad (namn + metadata)
- Mekaniker
- Kunder
- Fordonstyper
- Jobb/bokningar
- Vald arbetsdag (IDAG)

---

## Landing page

### Visar
- **Verkstadsnamn** (tydligt, högst upp)
- Mekaniker-login
- Knapp: **Lägg till mekaniker**

### Global åtgärd (övre högra hörnet)
- Knapp: **Skapa ny verkstad**

---

## Skapa ny verkstad

### Beteende
- Klick på **Skapa ny verkstad**:
  - Öppnar dialog/modal
  - Användaren anger:
    - **Verkstadsnamn**
- Vid bekräftelse:
  - All befintlig data rensas (LocalStorage reset via StorageService)
  - Ny tom verkstad skapas
  - Användaren skickas tillbaka till landing page

### UX-regel
- Tydlig bekräftelse krävs (”Är du säker?”)
- Lekfull copy, inte varningstung

---

## Mekaniker

### Lägg till mekaniker
Fält:
- **Namn**
  - Tillåter för- och efternamn med mellanslag
- **Inloggningsmetod**
  - PIN (4 siffror)
  - eller lösenord (fri text, inga regler)

Sparas i LocalStorage.

---

## Inloggning (Fake auth)

### Steg 1 – Välj mekaniker
- Lista/grid med mekanikernamn

### Steg 2 – Ange kod
- **PIN**
  - Numpad (0–9)
  - Fyra indikatorer (••••)
- **Lösenord**
  - Vanligt textfält
  - Inga krav, inga regler

### Validering
- Rätt kod:
  - Omedelbar success feedback
  - Route till kalendern
- Fel kod:
  - Lekfull feldialog
  - Alltid möjlighet att:
    - **Försök igen**
    - **Logga in ändå**

---

## Kalender – veckovy

### Grundregler
- Veckovy: **måndag–söndag**
- Visar **endast 07:00–17:00**
- Endast **hela timmar**
- Riktiga datum och månader
- Navigation:
  - Föregående / nästa vecka
  - Idag-knapp (hoppar till verkligt idag)

---

## Vald arbetsdag (“IDAG i verkstan”)
- Klick på ett daghuvud sätter den dagen som **aktiv arbetsdag**
- Den valda dagen:
  - Har **IDAG-badge**
  - Har tydlig visuell highlight
- Endast en dag kan vara IDAG åt gången

---

## Ej planerade jobbkort
- Fast kolumn **till vänster om måndag**
- Status: **Ej planerad**
- Färg: subtil **orange**
- Jobbkort kan dras in i kalendern

---

## Skapa jobbkort (Steg A)
1. **Kund** (namn + telefon)
2. **Typ** (fordonstyp, pills)
3. **Åtgärd** (textarea)
4. **Tid** (minst 1h, + / –)

Resultat:
- Jobbkort skapas som **Ej planerad**

---

## Planera jobb i kalendern (Steg B)
- Drag & drop från vänsterkolumn
- Visuellt “spöke” visar längd
- Endast giltiga släpp tillåts
- Vid släpp → status **Planerad**

---

## Statusflöde
Ej planerad → Planerad → Pågår → Klar → Hämtad

---

## Kalenderkort

**Visar:**
- Fordonstyp
- Åtgärd (trunkerad)
- Längd via kortets höjd
- Status via färg

---

## Klick på kalenderkort – Detaljvy
- Kortet animeras upp till modal/sheet
- Visar:
  - Fordonstyp
  - Status
  - Tid
  - Kund (namn + telefon)
  - Full åtgärdstext
- Åtgärder:
  - Öppna context-meny
  - Stäng

---

## Icke-mål för MVP
- Ingen backend
- Ingen ekonomi/betalning
- Ingen behörighetsmodell
- Ingen mobiloptimering initialt

---

## Sammanfattning
MVP:n är:
- Snabb
- Lekfull
- Förlåtande
- Tydlig

Tekniskt enkel, UX-mässigt genomtänkt.  
All komplexitet som inte stärker leken är bortvald.

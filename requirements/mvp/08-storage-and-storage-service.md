# Storage och StorageService

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] TypeScript interfaces for all data models (Workshop, Mechanic, Booking, etc.)
- [x] StorageService with LocalStorage abstraction
- [x] CRUD operations for all entities
- [x] AppContext for global state management
- [x] Reset/clear functionality
- [x] ID generator utility

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

## StorageService (viktig princip)
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

---

Se även: [Architecture Decision Record om LocalStorage](../decisions/adr-001-localstorage.md)

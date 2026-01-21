# Tekniska guidelines

[← Tillbaka till översikt](00-overview.md)

---

## Prestanda-princip
- Appen ska kännas **omedelbar och snabb**
- Inga tekniska loaders behövs eftersom:
  - All data finns lokalt
  - Datamängden är liten
- Eventuella delays används **endast** som lekfull feedback (micro-UX), aldrig av tekniska skäl

---

## State & arkitektur
- All data laddas från LocalStorage vid appstart
- State hålls i React (t.ex. Context eller enkel global store)
- Ingen server state / ingen caching-lösning behövs

---

## Persistens
- Spara till LocalStorage:
  - Vid varje relevant ändring
  - Eller med lätt debounce (valfritt)
- Inget behov av optimering – datamängden är minimal

---

## Animationer
- Använd CSS transitions / transforms (via Tailwind)
- Prioritera:
  - `opacity`
  - `transform: scale / translate`
- Undvik tunga animationer eller externa lib i MVP

---

## Komponentstrategi
- Inga tunga UI-bibliotek krävs
- Lekfullhet uppnås genom:
  - spacing
  - rundade former
  - animationer
  - copy
- Komponenter testas fram iterativt

---

Se även: [Storage och StorageService](08-storage-and-storage-service.md)

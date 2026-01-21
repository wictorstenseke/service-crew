# Landing page och verkstadsskapande

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] Landing page component created
- [x] Empty state for no workshop
- [x] "Skapa verkstad" button and modal
- [x] Workshop creation with name input
- [x] Workshop display with name
- [x] "Skapa ny verkstad" button in top right corner
- [x] Reset functionality with confirmation
- [x] Add mechanic modal integrated
- [x] Mechanic grid display (2-column layout)
- [x] Login flow fully implemented

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
- Tydlig bekräftelse krävs ("Är du säker?")
- Lekfull copy, inte varningstung

---

Se [copy-banken](../copy/copy-bank.md) för exakt copy.

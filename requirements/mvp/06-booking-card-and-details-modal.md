# Bokningskort och detaljvy

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] Booking card display in calendar
- [x] Status-based colors
- [x] Click to open details modal
- [x] Details modal with full information
- [x] Vehicle type, status, customer info, action text
- [x] Scheduled date and time display
- [x] Assigned mechanic display
- [x] Context menu button ("Öppna meny")
- [x] Close button

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
  - Öppna context-meny (se [status och context-meny](05-status-and-context-menu.md))
  - Stäng

### Animation
- Kortet ska expandera från sin position i kalendern till en större modal/sheet
- Använd CSS transitions för mjuka animationer

---

Se [copy-banken](../copy/copy-bank.md) för exakt copy.

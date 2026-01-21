# Bokningskort och detaljvy

[← Tillbaka till översikt](00-overview.md)

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

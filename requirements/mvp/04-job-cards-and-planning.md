# Jobbkort och planering

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] Create job card modal component
- [x] Customer name and phone fields
- [x] Vehicle type selection (pills)
- [x] Action textarea
- [x] Duration selector (+ / -)
- [x] Job card created as "Ej planerad"
- [x] Drag & drop from unplanned column to calendar
- [x] Visual feedback during drag
- [x] Status change to "Planerad" on drop
- [x] Job cards displayed with proper sizing based on duration

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
- Visuellt "spöke" visar längd
- Endast giltiga släpp tillåts
- Vid släpp → status **Planerad**

---

Se [copy-banken](../copy/copy-bank.md) för exakt copy.

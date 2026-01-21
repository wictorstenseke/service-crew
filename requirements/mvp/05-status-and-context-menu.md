# Status och context-meny

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] Status flow implemented (Ej planerad → Planerad → Pågår → Klar → Hämtad)
- [x] Context menu in booking details modal
- [x] Status selection UI
- [x] Mechanic selection UI
- [x] Validation: mechanic required for Pågår/Klar/Hämtad
- [x] Status-based color coding for booking cards

---

## Statusflöde
Ej planerad → Planerad → Pågår → Klar → Hämtad

---

## Context-meny
Öppnas från detaljvyn (se [bokningskort och detaljvy](06-booking-card-and-details-modal.md)).

Innehåller:
- **Status-sektion**
  - Välj ny status
- **Mekaniker-sektion**
  - Välj eller byt mekaniker

### Regler
- Om status ändras till "Pågår", "Klar" eller "Hämtad" måste en mekaniker vara vald
- Om ingen mekaniker är vald visas en regel-message

---

Se [copy-banken](../copy/copy-bank.md) för exakt copy och statusmeddelanden.

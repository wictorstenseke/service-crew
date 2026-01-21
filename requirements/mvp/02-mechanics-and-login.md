# Mekaniker och inloggning

[← Tillbaka till översikt](00-overview.md)

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

Se [copy-banken](../copy/copy-bank.md) för exakt copy.

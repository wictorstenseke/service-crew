# Mekaniker och inloggning

[← Tillbaka till översikt](00-overview.md)

## Implementation Status
- [x] Add mechanic modal component created
- [x] Name field
- [x] Login method toggle (PIN/Password)
- [x] PIN input (4 digits, numeric only)
- [x] Password input (free text)
- [x] Form validation
- [x] Save functionality
- [x] Mechanic grid display on landing page
- [x] Login modal with PIN numpad (0-9, backspace, OK)
- [x] Login modal with password entry
- [x] PIN indicators (4 dots)
- [x] Playful error messages for wrong codes (12 different messages)
- [x] "Försök igen" button
- [x] "Logga in ändå" bypass option
- [x] Successful login redirects to calendar placeholder

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

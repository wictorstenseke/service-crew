# Landing page och verkstadsskapande

[← Tillbaka till översikt](00-overview.md)

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

# ADR-001: LocalStorage för datapersistering

**Status:** Accepterad  
**Datum:** 2026-01-21  
**Kontext:** MVP för Service Crew verkstadsbokning

---

## Kontext
Service Crew är en lekfull webapp där barn kan leka verkstad. För MVP behöver vi en enkel, snabb och pålitlig lösning för att lagra data lokalt utan behov av backend eller nätverksanrop.

---

## Beslut
Vi använder **LocalStorage** som enda datalagringsmetod i MVP.

---

## Konsekvenser

### Fördelar
- **Enkel implementation** – ingen backend krävs
- **Snabb** – all data finns lokalt, inga nätverksanrop
- **Gratis** – ingen hosting eller databaskostnad
- **Perfekt för leksyfte** – barnen behöver inte skapa konton eller logga in på riktigt

### Nackdelar
- **Ingen synk mellan enheter** – data finns bara i en webbläsare
- **Risk för dataförlust** – om browsern rensas försvinner data
- **Begränsad storlek** – ca 5-10 MB per domän
- **Ingen delning** – flera barn kan inte dela samma verkstad

### Mitigering
- Vi bygger ett **StorageService-abstraktion** som gör det enkelt att byta till annan lagring senare (t.ex. Firebase, Supabase)
- För MVP är dessa begränsningar acceptabla eftersom:
  - Appen är ett lekverktyg, inte produktionssystem
  - Datamängden är liten
  - Barnen leker oftast på samma enhet

---

## Relaterade dokument
- [Storage och StorageService](../mvp/08-storage-and-storage-service.md)
- [Tekniska guidelines](../mvp/07-technical-guidelines.md)

# Service Crew - Project Status

**Last Updated:** 2026-01-21  
**Status:** ✅ **MVP COMPLETE**

## Quick Summary

The Service Crew MVP is **functionally complete** and ready for use. All requirements have been implemented and tested. The application is a playful workshop booking tool for children (target age ~10 years) who are playing mechanic.

## What Works

✅ **Everything in the MVP specification**

- Workshop creation and management
- Mechanic login with PIN or password (with playful errors)
- Weekly calendar view (Monday-Sunday, 07:00-17:00)
- Workday selection ("IDAG" badge)
- Job card creation (customer, vehicle type, action, duration)
- Drag & drop planning from "Ej planerade" to calendar
- Conflict detection (no overlapping bookings)
- Status management: Ej planerad → Planerad → Pågår → Klar → Hämtad
- Mechanic assignment
- Full data persistence in LocalStorage
- Toast notifications
- Playful copy throughout

## Tech Stack

- **Frontend:** Vite + React 19
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State:** React Context
- **Storage:** LocalStorage (via StorageService abstraction)
- **Dates:** date-fns with Swedish locale
- **No backend, no API calls** (by design)

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Format code
npm run format
```

## Documentation

All requirements and specifications are in the `requirements/` directory:

- **MVP Overview:** `requirements/mvp/00-overview.md`
- **Feature Specs:** `requirements/mvp/01-*.md` through `06-*.md`
- **Technical Guidelines:** `requirements/mvp/07-technical-guidelines.md`
- **Storage Design:** `requirements/mvp/08-storage-and-storage-service.md`
- **Non-Goals:** `requirements/mvp/09-non-goals.md`
- **Copy/Text:** `requirements/copy/copy-bank.md`
- **Architecture Decisions:** `requirements/decisions/adr-001-localstorage.md`

Each feature document includes implementation status checkmarks showing completion.

## What's NOT Included (By Design)

Per the non-goals document, the following are intentionally out of scope:

- ❌ Backend/API
- ❌ Real authentication
- ❌ Economic/payment tracking
- ❌ Permission system
- ❌ Mobile optimization (initial version)
- ❌ Multi-device sync

These may be added in future versions but are not needed for the MVP.

## Testing the Application

1. Open the app in a browser
2. Click "Skapa verkstad" and enter a workshop name
3. Click "Lägg till mekaniker" to create a mechanic with PIN or password
4. Click the mechanic to log in (try wrong code to see playful errors!)
5. Click "Logga in ändå" to bypass if needed
6. In the calendar, click "+ Skapa jobbkort"
7. Fill in customer info, select vehicle type, describe the job
8. The job card appears in "Ej planerade"
9. Drag the card to a time slot in the calendar
10. Click the card to see details and change status

## Project Structure

```
src/
├── components/          # React components
│   ├── AddMechanicModal.tsx
│   ├── BookingDetailsModal.tsx
│   ├── CreateJobCardModal.tsx
│   ├── LoginModal.tsx
│   └── Toast.tsx
├── context/            # Global state
│   └── AppContext.tsx
├── hooks/              # Custom hooks
│   └── useEscapeKey.ts
├── pages/              # Main pages
│   ├── LandingPage.tsx
│   └── CalendarPage.tsx
├── services/           # Business logic
│   └── StorageService.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utilities
│   └── idGenerator.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Next Steps

### Immediate (Optional)
- [ ] Test with actual children (target audience)
- [ ] Gather user feedback
- [ ] Iterate on copy/messaging if needed

### Future Enhancements (Post-MVP)
- [ ] Add micro-animations for more "lekfullhet"
- [ ] Add keyboard shortcuts
- [ ] Add undo/redo functionality
- [ ] Add data export/import
- [ ] Add unit tests
- [ ] Add E2E tests

### Long-term (Beyond MVP Scope)
- [ ] Backend integration (if needed)
- [ ] Real authentication system
- [ ] Mobile app or PWA
- [ ] Multi-tenant support
- [ ] Statistics and reports
- [ ] Customer history tracking

## Design Principles

From the requirements, the app follows these key principles:

1. **Lekfull** (Playful) - Feels like a real workshop tool but is safe and forgiving
2. **Tydlig** (Clear) - Always clear what's happening and what to do next
3. **Förlåtande** (Forgiving) - Mistakes are handled gracefully, with playful feedback
4. **På riktigt** (Authentic) - Feels like a real tool, not dumbed down for children

## Questions?

- Read the full requirements in `requirements/mvp/00-overview.md`
- Check specific features in the numbered feature docs
- Review technical decisions in `requirements/decisions/`
- All UI text is defined in `requirements/copy/copy-bank.md`

---

**Ready to play mechanic! 🔧🚲**

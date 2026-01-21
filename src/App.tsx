import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import CalendarPage from "./pages/CalendarPage";

function AppContent() {
  const { currentMechanicId } = useApp();
  const isLoggedIn = currentMechanicId !== null;

  return <>{!isLoggedIn ? <LandingPage /> : <CalendarPage />}</>;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

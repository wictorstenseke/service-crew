import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import CalendarPage from "./pages/CalendarPage";
import Toast from "./components/Toast";

function AppContent() {
  const { currentMechanicId, toasts, removeToast } = useApp();
  const isLoggedIn = currentMechanicId !== null;

  return (
    <>
      {!isLoggedIn ? <LandingPage /> : <CalendarPage />}

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

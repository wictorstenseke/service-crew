import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppProvider>
      {!isLoggedIn ? (
        <LandingPage />
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-3xl font-bold">Calendar View</h1>
            <p className="text-gray-600">Coming soon...</p>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logga ut
            </button>
          </div>
        </div>
      )}
    </AppProvider>
  );
}

export default App;

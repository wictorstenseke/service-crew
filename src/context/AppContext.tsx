// AppContext - Global state management for Service Crew
import { createContext, useContext, useState, useEffect } from "react";
import type {
  AppState,
  Workshop,
  Mechanic,
  Booking,
  Customer,
  WeeklyEvent,
} from "../types";
import { storageService } from "../services/StorageService";
import { preloadSound } from "../utils/soundPlayer";

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "error" | "success";
}

interface AppContextType extends AppState {
  setWorkshop: (workshop: Workshop) => void;
  addMechanic: (mechanic: Mechanic) => void;
  updateMechanic: (mechanic: Mechanic) => void;
  deleteMechanic: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  addWeeklyEvent: (event: WeeklyEvent) => void;
  updateWeeklyEvent: (event: WeeklyEvent) => void;
  deleteWeeklyEvent: (id: string) => void;
  setCurrentMechanicId: (id: string | null) => void;
  setSelectedWorkday: (date: string | null) => void;
  resetWorkshop: () => void;
  refreshState: () => void;
  showToast: (message: string, type?: "info" | "error" | "success") => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() =>
    storageService.loadState(),
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    return savedTheme || "dark";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Keep iOS status bar and browser UI in sync with app theme
    const statusBarMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    );
    if (statusBarMeta) {
      statusBarMeta.content = theme === "dark" ? "default" : "black";
    }

    const themeColorMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (themeColorMeta) {
      // Match the colors used for iPad backgrounds in index.css
      themeColorMeta.content = theme === "dark" ? "#0f172a" : "#f3f4f6";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Preload all sound effects on app initialization for instant playback
  useEffect(() => {
    const soundFiles = [
      "betalt.mp3", // Payment sound (BookingDetailsModal)
      "borr.mov", // Drilling sound (LandingPage, BookingDetailsModal)
      "check.mp3", // Check/confirm sound (CreateJobCardModal)
      "done.mp3", // Success sound (CalendarPage drop)
      "fart.mov", // Error/overlap sound (CalendarPage drop, CreateJobCardModal)
      "inlogg.mp3", // Login sound (LoginModal)
      "tuta.mp3", // Toot/horn sound (AddMechanicModal)
    ];

    // Preload all sounds in parallel
    Promise.all(soundFiles.map((file) => preloadSound(file).catch(() => {
      // Silently ignore preload failures - sounds will load on demand
      console.warn(`Failed to preload ${file}, will load on demand`);
    }))).then(() => {
      console.log("All sound effects preloaded successfully");
    });
  }, []); // Empty dependency array - only run once on mount

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const refreshState = () => {
    setState(storageService.loadState());
  };

  const showToast = (
    message: string,
    type: "info" | "error" | "success" = "success",
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const setWorkshop = (workshop: Workshop) => {
    storageService.saveWorkshop(workshop);
    refreshState();
  };

  const addMechanic = (mechanic: Mechanic) => {
    storageService.saveMechanic(mechanic);
    refreshState();
  };

  const updateMechanic = (mechanic: Mechanic) => {
    storageService.saveMechanic(mechanic);
    refreshState();
  };

  const deleteMechanic = (id: string) => {
    storageService.deleteMechanic(id);
    refreshState();
  };

  const addCustomer = (customer: Customer) => {
    storageService.saveCustomer(customer);
    refreshState();
  };

  const updateCustomer = (customer: Customer) => {
    storageService.saveCustomer(customer);
    refreshState();
  };

  const deleteCustomer = (id: string) => {
    storageService.deleteCustomer(id);
    refreshState();
  };

  const addBooking = (booking: Booking) => {
    storageService.saveBooking(booking);
    refreshState();
  };

  const updateBooking = (booking: Booking) => {
    storageService.saveBooking(booking);
    refreshState();
  };

  const deleteBooking = (id: string) => {
    storageService.deleteBooking(id);
    refreshState();
  };

  const addWeeklyEvent = (event: WeeklyEvent) => {
    storageService.saveWeeklyEvent(event);
    refreshState();
  };

  const updateWeeklyEvent = (event: WeeklyEvent) => {
    storageService.saveWeeklyEvent(event);
    refreshState();
  };

  const deleteWeeklyEvent = (id: string) => {
    storageService.deleteWeeklyEvent(id);
    refreshState();
  };

  const setCurrentMechanicId = (id: string | null) => {
    storageService.setCurrentMechanicId(id);
    refreshState();
  };

  const setSelectedWorkday = (date: string | null) => {
    storageService.setSelectedWorkday(date);
    refreshState();
  };

  const resetWorkshop = () => {
    storageService.resetAll();
    refreshState();
  };

  const contextValue: AppContextType = {
    ...state,
    setWorkshop,
    addMechanic,
    updateMechanic,
    deleteMechanic,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addBooking,
    updateBooking,
    deleteBooking,
    setCurrentMechanicId,
    setSelectedWorkday,
    resetWorkshop,
    refreshState,
    showToast,
    toasts,
    removeToast,
    theme,
    toggleTheme,
    addWeeklyEvent,
    updateWeeklyEvent,
    deleteWeeklyEvent,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

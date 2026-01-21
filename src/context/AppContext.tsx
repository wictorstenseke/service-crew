// AppContext - Global state management for Service Crew
import { createContext, useContext, useState } from "react";
import type { AppState, Workshop, Mechanic, Booking } from "../types";
import { storageService } from "../services/StorageService";

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
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  setCurrentMechanicId: (id: string | null) => void;
  setSelectedWorkday: (date: string | null) => void;
  resetWorkshop: () => void;
  refreshState: () => void;
  showToast: (message: string, type?: "info" | "error" | "success") => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() =>
    storageService.loadState(),
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshState = () => {
    setState(storageService.loadState());
  };

  const showToast = (message: string, type: "info" | "error" | "success" = "success") => {
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
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

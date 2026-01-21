// StorageService - Abstraction layer for LocalStorage
import type { AppState, Workshop, Mechanic, Booking } from "../types";

const STORAGE_KEY = "service-crew-data";
const STORAGE_VERSION = "1.0";

class StorageService {
  private getDefaultState(): AppState {
    return {
      workshop: null,
      mechanics: [],
      bookings: [],
      currentMechanicId: null,
      selectedWorkday: null,
    };
  }

  // Load all data from LocalStorage
  loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getDefaultState();
      }

      const parsed = JSON.parse(stored);
      // Basic validation
      if (parsed.version !== STORAGE_VERSION) {
        console.warn("Storage version mismatch, resetting data");
        return this.getDefaultState();
      }

      return parsed.state || this.getDefaultState();
    } catch (error) {
      console.error("Error loading state from LocalStorage:", error);
      return this.getDefaultState();
    }
  }

  // Save all data to LocalStorage
  saveState(state: AppState): void {
    try {
      const data = {
        version: STORAGE_VERSION,
        state,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving state to LocalStorage:", error);
    }
  }

  // Workshop operations
  getWorkshop(): Workshop | null {
    const state = this.loadState();
    return state.workshop;
  }

  saveWorkshop(workshop: Workshop): void {
    const state = this.loadState();
    state.workshop = workshop;
    this.saveState(state);
  }

  // Mechanic operations
  getMechanics(): Mechanic[] {
    const state = this.loadState();
    return state.mechanics;
  }

  saveMechanic(mechanic: Mechanic): void {
    const state = this.loadState();
    const existingIndex = state.mechanics.findIndex(
      (m) => m.id === mechanic.id,
    );

    if (existingIndex >= 0) {
      state.mechanics[existingIndex] = mechanic;
    } else {
      state.mechanics.push(mechanic);
    }

    this.saveState(state);
  }

  deleteMechanic(id: string): void {
    const state = this.loadState();
    state.mechanics = state.mechanics.filter((m) => m.id !== id);
    this.saveState(state);
  }

  // Booking operations
  getBookings(): Booking[] {
    const state = this.loadState();
    return state.bookings;
  }

  saveBooking(booking: Booking): void {
    const state = this.loadState();
    const existingIndex = state.bookings.findIndex((b) => b.id === booking.id);

    if (existingIndex >= 0) {
      state.bookings[existingIndex] = booking;
    } else {
      state.bookings.push(booking);
    }

    this.saveState(state);
  }

  deleteBooking(id: string): void {
    const state = this.loadState();
    state.bookings = state.bookings.filter((b) => b.id !== id);
    this.saveState(state);
  }

  // Current mechanic (logged in)
  getCurrentMechanicId(): string | null {
    const state = this.loadState();
    return state.currentMechanicId;
  }

  setCurrentMechanicId(mechanicId: string | null): void {
    const state = this.loadState();
    state.currentMechanicId = mechanicId;
    this.saveState(state);
  }

  // Selected workday (IDAG)
  getSelectedWorkday(): string | null {
    const state = this.loadState();
    return state.selectedWorkday;
  }

  setSelectedWorkday(date: string | null): void {
    const state = this.loadState();
    state.selectedWorkday = date;
    this.saveState(state);
  }

  // Reset all data (for creating new workshop)
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Check if workshop exists
  hasWorkshop(): boolean {
    return this.getWorkshop() !== null;
  }
}

// Export singleton instance
export const storageService = new StorageService();

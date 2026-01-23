// StorageService - Abstraction layer for LocalStorage
import type {
  AppState,
  Workshop,
  Mechanic,
  Booking,
  Customer,
  WeeklyEvent,
} from "../types";

const STORAGE_KEY = "service-crew-data";
const STORAGE_VERSION = "1.0";

class StorageService {
  private getDefaultState(): AppState {
    return {
      workshop: null,
      mechanics: [],
      customers: [],
      bookings: [],
      currentMechanicId: null,
      selectedWorkday: null,
      weeklyEvents: [],
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

      const state = parsed.state || this.getDefaultState();
      // Ensure customers array exists for backward compatibility
      if (!state.customers) {
        state.customers = [];
      }
      // Ensure weeklyEvents array exists for backward compatibility
      if (!state.weeklyEvents) {
        state.weeklyEvents = [];
      }
      return state;
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

  // Weekly events (Veckobokningar)
  getWeeklyEvents(): WeeklyEvent[] {
    const state = this.loadState();
    return state.weeklyEvents || [];
  }

  saveWeeklyEvent(event: WeeklyEvent): void {
    const state = this.loadState();
    if (!state.weeklyEvents) {
      state.weeklyEvents = [];
    }
    const existingIndex = state.weeklyEvents.findIndex((e) => e.id === event.id);

    if (existingIndex >= 0) {
      state.weeklyEvents[existingIndex] = event;
    } else {
      state.weeklyEvents.push(event);
    }

    this.saveState(state);
  }

  deleteWeeklyEvent(id: string): void {
    const state = this.loadState();
    if (!state.weeklyEvents) {
      state.weeklyEvents = [];
    }
    state.weeklyEvents = state.weeklyEvents.filter((e) => e.id !== id);
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

  // Customer operations
  getCustomers(): Customer[] {
    const state = this.loadState();
    return state.customers || [];
  }

  saveCustomer(customer: Customer): void {
    const state = this.loadState();
    if (!state.customers) {
      state.customers = [];
    }
    const existingIndex = state.customers.findIndex(
      (c) => c.id === customer.id,
    );

    if (existingIndex >= 0) {
      state.customers[existingIndex] = customer;
    } else {
      state.customers.push(customer);
    }

    this.saveState(state);
  }

  deleteCustomer(id: string): void {
    const state = this.loadState();
    if (!state.customers) {
      state.customers = [];
    }
    state.customers = state.customers.filter((c) => c.id !== id);
    this.saveState(state);
  }

  // Custom vehicle types operations
  getCustomVehicleTypes(): string[] {
    try {
      const stored = localStorage.getItem("service-crew-custom-vehicle-types");
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error loading custom vehicle types:", error);
      return [];
    }
  }

  saveCustomVehicleType(type: string): void {
    try {
      const customTypes = this.getCustomVehicleTypes();
      const upperType = type.trim().toUpperCase();
      if (!customTypes.includes(upperType)) {
        customTypes.push(upperType);
        localStorage.setItem(
          "service-crew-custom-vehicle-types",
          JSON.stringify(customTypes),
        );
      }
    } catch (error) {
      console.error("Error saving custom vehicle type:", error);
    }
  }

  removeCustomVehicleType(type: string): void {
    try {
      const customTypes = this.getCustomVehicleTypes();
      const upperType = type.trim().toUpperCase();
      const filtered = customTypes.filter((t) => t !== upperType);
      localStorage.setItem(
        "service-crew-custom-vehicle-types",
        JSON.stringify(filtered),
      );
    } catch (error) {
      console.error("Error removing custom vehicle type:", error);
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

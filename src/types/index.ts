// Core data types for Service Crew

export type LoginMethod = "PIN" | "PASSWORD";

export interface Mechanic {
  id: string;
  name: string;
  loginMethod: LoginMethod;
  credential: string; // PIN (4 digits) or password
  createdAt: string;
}

export interface Workshop {
  id: string;
  name: string;
  icon?: string; // Path to the workshop icon (e.g., "001-car-engine.png")
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export type VehicleType = string; // Allows default types and custom types

export type BookingStatus =
  | "EJ_PLANERAD"
  | "PLANERAD"
  | "PAGAR"
  | "KLAR"
  | "HAMTAD";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleType;
  action: string;
  durationHours: number;
  status: BookingStatus;
  mechanicId?: string;
  scheduledDate?: string; // ISO date string
  scheduledStartHour?: number; // 7-17
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyEvent {
  id: string;
  title: string;
  /**
   * Hour of day (24h) when the event starts, inclusive.
   * Example: 9 for 09:00.
   */
  fromHour: number;
  /**
   * Hour of day (24h) when the event ends, exclusive.
   * Example: 10 for a 09:00–10:00 block.
   */
  toHour: number;
}

export interface AppState {
  workshop: Workshop | null;
  mechanics: Mechanic[];
  customers: Customer[];
  bookings: Booking[];
  currentMechanicId: string | null;
  selectedWorkday: string | null; // ISO date string for "IDAG"
  weeklyEvents: WeeklyEvent[];
}

// Booking Details Modal - Shows full job information with status management
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Booking, BookingStatus, VehicleType } from "../types";
import { Save, X, ChevronDown, Plus, Minus } from "lucide-react";
import { playSound } from "../utils/soundPlayer";
import { storageService } from "../services/StorageService";
import { defaultVehicleTypes } from "../utils/vehicleTypes";

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusLabels: Record<BookingStatus, string> = {
  EJ_PLANERAD: "Ej planerad",
  PLANERAD: "Planerad",
  PAGAR: "Pågår",
  KLAR: "Klar",
  HAMTAD: "Hämtad",
};

const BASE_URL = "/service-crew/";

const availableIcons = [
  "001-car-engine.png",
  "003-piston.png",
  "004-mechanic.png",
  "005-mechanic-1.png",
  "006-engine-oil.png",
];

// Format date as "Onsdag 21 jan" (Swedish full day name + day number + month abbreviation)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const dayNames = [
    "Söndag",
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag",
  ];
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ];
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = monthNames[date.getMonth()];
  return `${dayName} ${dayNumber} ${monthName}`;
};

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const { mechanics, updateBooking, showToast, theme, bookings } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null,
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(
    null,
  );
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null);
  const [selectedDurationHours, setSelectedDurationHours] = useState<number>(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isVehicleTypeDropdownOpen, setIsVehicleTypeDropdownOpen] =
    useState(false);
  const [customVehicleTypes, setCustomVehicleTypes] = useState<string[]>([]);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const vehicleTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Load custom vehicle types
  useEffect(() => {
    if (isOpen) {
      const customTypes = storageService.getCustomVehicleTypes();
      setCustomVehicleTypes(customTypes);
    }
  }, [isOpen]);

  // Combine default and custom types
  const allVehicleTypes = [...defaultVehicleTypes, ...customVehicleTypes];

  // Initialize state from booking when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setSelectedStatus(booking.status);
      setSelectedMechanicId(booking.mechanicId || null);
      setSelectedVehicleType(booking.vehicleType);
      setSelectedDurationHours(booking.durationHours);
    }
  }, [isOpen, booking]);

  const handleClose = () => {
    onClose();
  };

  useEscapeKey(handleClose, isOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        vehicleTypeDropdownRef.current &&
        !vehicleTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsVehicleTypeDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen || isVehicleTypeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isStatusDropdownOpen, isVehicleTypeDropdownOpen]);

  if (!isOpen || !booking) return null;

  // Validation function for duration (similar to CalendarPage)
  const validateDuration = (
    durationHours: number,
    scheduledDate?: string,
    scheduledStartHour?: number,
  ): { valid: boolean; error?: string; suggestedDuration?: number } => {
    if (durationHours < 1) {
      return {
        valid: false,
        error: "Varaktighet måste vara minst 1 timme",
        suggestedDuration: 1,
      };
    }

    // If booking is scheduled, validate it fits
    if (scheduledDate && scheduledStartHour !== undefined) {
      const WORK_END_HOUR = 17;

      // Check if extends beyond work hours
      const maxAvailableHours = WORK_END_HOUR + 1 - scheduledStartHour;
      if (scheduledStartHour + durationHours > WORK_END_HOUR + 1) {
        return {
          valid: false,
          error: "Bokningen sträcker sig utanför arbetstid",
          suggestedDuration: Math.max(1, maxAvailableHours),
        };
      }

      // Check for conflicts with other bookings on the same day
      const dayBookings = bookings.filter(
        (b) =>
          b.scheduledDate === scheduledDate &&
          b.scheduledStartHour !== undefined &&
          b.id !== booking.id &&
          b.status !== "EJ_PLANERAD",
      );
      const newEnd = scheduledStartHour + durationHours;

      // Find the earliest conflict
      let earliestConflict: number | null = null;
      for (const existingBooking of dayBookings) {
        const existingStart = existingBooking.scheduledStartHour!;
        const existingEnd = existingStart + existingBooking.durationHours;

        if (scheduledStartHour < existingEnd && newEnd > existingStart) {
          // Calculate how many hours fit before this conflict
          const availableBeforeConflict = existingStart - scheduledStartHour;
          if (
            earliestConflict === null ||
            availableBeforeConflict < earliestConflict
          ) {
            earliestConflict = availableBeforeConflict;
          }
        }
      }

      if (earliestConflict !== null) {
        return {
          valid: false,
          error: "Tidsluckan är redan upptagen",
          suggestedDuration: Math.max(1, earliestConflict),
        };
      }
    }

    return { valid: true };
  };

  const handleSaveChanges = () => {
    if (!selectedStatus || !selectedVehicleType) return;

    // Validate duration
    const durationValidation = validateDuration(
      selectedDurationHours,
      booking.scheduledDate,
      booking.scheduledStartHour,
    );

    if (!durationValidation.valid) {
      showToast(durationValidation.error || "Ogiltig varaktighet", "error");
      if (durationValidation.suggestedDuration) {
        setSelectedDurationHours(durationValidation.suggestedDuration);
      }
      return;
    }

    const updatedBooking: Booking = {
      ...booking,
      status: selectedStatus,
      mechanicId: selectedMechanicId || undefined,
      vehicleType: selectedVehicleType,
      durationHours: selectedDurationHours,
      updatedAt: new Date().toISOString(),
    };

    updateBooking(updatedBooking);

    // Play sound effects based on status
    if (selectedStatus === "PAGAR") {
      playSound("borr.mov");
    } else if (selectedStatus === "HAMTAD") {
      playSound("betalt.mp3");
    }

    // Show success toast based on status
    const statusMessages: Record<BookingStatus, string> = {
      EJ_PLANERAD: "Status uppdaterad",
      PLANERAD: "Inplanerat",
      PAGAR: "Jobbet är igång",
      KLAR: "Klart!",
      HAMTAD: "Utlämnat",
    };
    showToast(statusMessages[selectedStatus]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-[640px] rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          {/* Mechanic selection buttons - left */}
          <div className="text-left">
            <label
              className={`mb-2 block text-left text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              Mekaniker
            </label>
            <div className="flex flex-wrap justify-start gap-2">
              {mechanics.map((mechanic, index) => {
                // Cycle through available icons for each mechanic
                const iconIndex = index % availableIcons.length;
                const mechanicIcon = availableIcons[iconIndex];
                const isSelected = selectedMechanicId === mechanic.id;

                return (
                  <button
                    key={mechanic.id}
                    onClick={() => {
                      // Toggle selection: if already selected, deselect; otherwise select
                      setSelectedMechanicId(isSelected ? null : mechanic.id);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                          ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <img
                      src={`${BASE_URL}${mechanicIcon}`}
                      alt={mechanicIcon.replace(".png", "")}
                      className="h-5 w-5 flex-shrink-0 object-contain"
                    />
                    <span>{mechanic.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status dropdown - right */}
          <div className="min-w-[140px] text-left">
            <label
              className={`mb-2 block text-left text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm font-medium transition focus:border-blue-500 focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-700 text-white hover:border-blue-600 focus:ring-blue-500/50"
                    : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:ring-blue-200"
                }`}
              >
                <span className="flex-1 text-left">
                  {selectedStatus
                    ? statusLabels[selectedStatus]
                    : "Välj status"}
                </span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  } ${theme === "dark" ? "text-blue-400" : "text-gray-400"}`}
                />
              </button>
              {isStatusDropdownOpen && (
                <div
                  className={`absolute z-50 mt-1 w-full rounded-lg border shadow-lg ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-700"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {(
                    [
                      "EJ_PLANERAD",
                      "PLANERAD",
                      "PAGAR",
                      "KLAR",
                      "HAMTAD",
                    ] as BookingStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                        selectedStatus === status
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-900"
                          : theme === "dark"
                            ? "text-white hover:bg-slate-600"
                            : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="space-y-6">
          {/* Row 1: FORDONSTYP, Åtgärd */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="text-left">
              <h3
                className={`mb-1 text-left text-xs font-medium uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                FORDONSTYP
              </h3>
              <div className="relative" ref={vehicleTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    setIsVehicleTypeDropdownOpen(!isVehicleTypeDropdownOpen)
                  }
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm font-medium transition focus:border-blue-500 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-700 text-white hover:border-blue-600 focus:ring-blue-500/50"
                      : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:ring-blue-200"
                  }`}
                >
                  <span className="flex-1 text-left">
                    {selectedVehicleType || "Välj typ"}
                  </span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform ${
                      isVehicleTypeDropdownOpen ? "rotate-180" : ""
                    } ${theme === "dark" ? "text-blue-400" : "text-gray-400"}`}
                  />
                </button>
                {isVehicleTypeDropdownOpen && (
                  <div
                    className={`absolute z-50 mt-1 w-full rounded-lg border shadow-lg ${
                      theme === "dark"
                        ? "border-blue-700/50 bg-slate-700"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {allVehicleTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedVehicleType(type);
                          setIsVehicleTypeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                          selectedVehicleType === type
                            ? theme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-900"
                            : theme === "dark"
                              ? "text-white hover:bg-slate-600"
                              : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-left">
              <h3
                className={`mb-1 text-left text-xs font-medium uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                Åtgärd
              </h3>
              <p
                className={`text-left ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {booking.action}
              </p>
            </div>
          </div>

          {/* Row 2: Kund, Planerad tid, Tid */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="text-left">
              <h3
                className={`mb-1 text-left text-xs font-medium uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                Kund
              </h3>
              <p
                className={`text-left ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {booking.customerName}
              </p>
              <p
                className={`text-left text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {booking.customerPhone}
              </p>
            </div>
            <div className="text-left">
              <h3
                className={`mb-1 text-left text-xs font-medium uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                Planerad tid
              </h3>
              {booking.scheduledDate && booking.scheduledStartHour ? (
                <p
                  className={`text-left ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatDate(booking.scheduledDate)} kl{" "}
                  {booking.scheduledStartHour}.00
                </p>
              ) : (
                <p
                  className={`text-left ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Ej planerad
                </p>
              )}
            </div>
            <div className="text-left">
              <h3
                className={`mb-1 text-left text-xs font-medium uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                Tid
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newDuration = Math.max(1, selectedDurationHours - 1);
                    setSelectedDurationHours(newDuration);
                  }}
                  className={`flex items-center justify-center rounded-lg p-1.5 transition ${
                    theme === "dark"
                      ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label="Minska varaktighet"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className={`min-w-[3rem] text-left ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedDurationHours} tim
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newDuration = selectedDurationHours + 1;
                    setSelectedDurationHours(newDuration);
                  }}
                  className={`flex items-center justify-center rounded-lg p-1.5 transition ${
                    theme === "dark"
                      ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label="Öka varaktighet"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleClose}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition ${
              theme === "dark"
                ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <X className="h-5 w-5" />
            STÄNG
          </button>
          <button
            onClick={handleSaveChanges}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            SPARA
          </button>
        </div>
      </div>
    </div>
  );
}

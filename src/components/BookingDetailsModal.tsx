// Booking Details Modal - Shows full job information with status management
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Booking, BookingStatus } from "../types";
import { Save, X, ChevronDown, AlertCircle } from "lucide-react";

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

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const { mechanics, updateBooking, showToast, theme } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null,
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(
    null,
  );
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize state from booking when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setSelectedStatus(booking.status);
      setSelectedMechanicId(booking.mechanicId || null);
    }
  }, [isOpen, booking]);

  // Check if mechanic is required for current status
  const requiresMechanic = selectedStatus
    ? ["PAGAR", "KLAR", "HAMTAD"].includes(selectedStatus)
    : false;
  const showMechanicError = requiresMechanic && !selectedMechanicId;

  const handleClose = () => {
    onClose();
  };

  useEscapeKey(handleClose, isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  if (!isOpen || !booking) return null;

  const handleSaveChanges = () => {
    if (!selectedStatus) return;

    // Check if mechanic is required for certain statuses
    if (requiresMechanic && !selectedMechanicId) {
      return; // Error is shown inline, don't proceed
    }

    const updatedBooking: Booking = {
      ...booking,
      status: selectedStatus,
      mechanicId: selectedMechanicId || undefined,
      updatedAt: new Date().toISOString(),
    };

    updateBooking(updatedBooking);

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
          <div className="text-left min-w-[140px]">
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
                    {selectedStatus ? statusLabels[selectedStatus] : "Välj status"}
                  </span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform ${
                      isStatusDropdownOpen ? "rotate-180" : ""
                    } ${
                      theme === "dark" ? "text-blue-400" : "text-gray-400"
                    }`}
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
              <p
                className={`text-left text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {booking.vehicleType}
              </p>
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
                className={`text-left text-lg ${
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
                  className={`text-left text-lg ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {booking.scheduledDate} kl {booking.scheduledStartHour}:00
                </p>
              ) : (
                <p
                  className={`text-left text-sm ${
                    theme === "dark" ? "text-blue-300" : "text-gray-500"
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
              <p
                className={`text-left text-lg ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {booking.durationHours} timmar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        {showMechanicError && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-lg border px-4 py-3 ${
              theme === "dark"
                ? "border-red-500/50 bg-red-900/20 text-red-300"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
            role="alert"
          >
            <AlertCircle
              className={`h-5 w-5 flex-shrink-0 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            />
            <p className="text-sm font-medium">Välj en mekaniker först</p>
          </div>
        )}
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

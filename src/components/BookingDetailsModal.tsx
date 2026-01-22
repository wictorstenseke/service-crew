// Booking Details Modal - Shows full job information with status management
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Booking, BookingStatus } from "../types";
import { Save, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`w-full max-w-4xl rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Jobbkort
          </h2>

          {/* Mechanic buttons and Status dropdown - top right */}
          <div className="flex flex-row items-end gap-6">
            {/* Mechanic selection buttons */}
            <div className="text-left">
              <label
                className={`mb-2 block text-left text-sm font-medium ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                Mekaniker
              </label>
              {showMechanicError && (
                <p
                  className={`mb-2 text-xs ${
                    theme === "dark" ? "text-red-300" : "text-red-600"
                  }`}
                >
                  Välj en mekaniker först
                </p>
              )}
              <div className="flex flex-wrap justify-start gap-2">
                <button
                  onClick={() => setSelectedMechanicId(null)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedMechanicId === null
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                        ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Ingen vald
                </button>
                {mechanics.map((mechanic) => (
                  <button
                    key={mechanic.id}
                    onClick={() => setSelectedMechanicId(mechanic.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      selectedMechanicId === mechanic.id
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                          ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {mechanic.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status dropdown */}
            <div className="text-left">
              <label
                className={`mb-2 block text-left text-sm font-medium ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <div className="group relative">
                <select
                  value={selectedStatus || ""}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as BookingStatus)
                  }
                  className={`w-full cursor-pointer appearance-none rounded-lg border py-2 pl-4 pr-10 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-700 text-white hover:border-blue-600 focus:ring-blue-500/50"
                      : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:ring-blue-200"
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
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className={`h-4 w-4 transition-colors ${
                      theme === "dark"
                        ? "text-blue-400 group-hover:text-blue-300"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
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
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSaveChanges}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            SPARA
          </button>
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
        </div>
      </div>
    </div>
  );
}

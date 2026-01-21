// Booking Details Modal - Shows full job information with status management
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import Toast from "./Toast";
import type { Booking, BookingStatus } from "../types";

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

const statusColors: Record<BookingStatus, string> = {
  EJ_PLANERAD: "bg-orange-100 text-orange-800",
  PLANERAD: "bg-blue-100 text-blue-800",
  PAGAR: "bg-yellow-100 text-yellow-800",
  KLAR: "bg-green-100 text-green-800",
  HAMTAD: "bg-gray-100 text-gray-800",
};

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const { mechanics, updateBooking, showToast } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null,
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize state from booking when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setSelectedStatus(booking.status);
      setSelectedMechanicId(booking.mechanicId || null);
      setErrorMessage(null);
    }
  }, [isOpen, booking]);

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  useEscapeKey(handleClose, isOpen);

  if (!isOpen || !booking) return null;

  const handleSaveChanges = () => {
    if (!selectedStatus) return;

    // Check if mechanic is required for certain statuses
    const requiresMechanic = ["PAGAR", "KLAR", "HAMTAD"].includes(
      selectedStatus,
    );
    if (requiresMechanic && !selectedMechanicId) {
      setErrorMessage("Välj en mekaniker först");
      return;
    }

    const updatedBooking: Booking = {
      ...booking,
      status: selectedStatus,
      mechanicId: selectedMechanicId || undefined,
      updatedAt: new Date().toISOString(),
    };

    updateBooking(updatedBooking);
    setErrorMessage(null);

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
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Jobbkort</h2>
          
          {/* Mechanic buttons and Status dropdown - top right */}
          <div className="flex flex-row gap-6 items-end">
            {/* Mechanic selection buttons */}
            <div className="text-left">
              <label className="mb-2 block text-left text-sm font-medium text-gray-700">
                Mekaniker
              </label>
              <div className="flex flex-wrap gap-2 justify-start">
                <button
                  onClick={() => setSelectedMechanicId(null)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedMechanicId === null
                      ? "bg-blue-600 text-white"
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
              <label className="mb-2 block text-left text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="group relative">
                <select
                  value={selectedStatus || ""}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as BookingStatus)
                  }
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 py-2 text-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600"
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

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}


        {/* Details section */}
        <div className="space-y-6">
          {/* Row 1: FORDONSTYP, Åtgärd */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="text-left">
              <h3 className="mb-1 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                FORDONSTYP
              </h3>
              <p className="text-left text-lg font-semibold text-gray-900">
                {booking.vehicleType}
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-1 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Åtgärd
              </h3>
              <p className="text-left text-gray-900">{booking.action}</p>
            </div>
          </div>

          {/* Row 2: Kund, Planerad tid, Tid */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="text-left">
              <h3 className="mb-1 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Kund
              </h3>
              <p className="text-left text-lg text-gray-900">{booking.customerName}</p>
              <p className="text-left text-sm text-gray-600">{booking.customerPhone}</p>
            </div>
            <div className="text-left">
              <h3 className="mb-1 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Planerad tid
              </h3>
              {booking.scheduledDate && booking.scheduledStartHour ? (
                <p className="text-left text-lg text-gray-900">
                  {booking.scheduledDate} kl {booking.scheduledStartHour}:00
                </p>
              ) : (
                <p className="text-left text-sm text-gray-500">Ej planerad</p>
              )}
            </div>
            <div className="text-left">
              <h3 className="mb-1 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Tid
              </h3>
              <p className="text-left text-lg text-gray-900">
                {booking.durationHours} timmar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSaveChanges}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            SPARA
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            STÄNG
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}

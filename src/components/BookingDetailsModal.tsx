// Booking Details Modal - Shows full job information with status management
import { useState } from "react";
import { useApp } from "../context/AppContext";
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
  const { mechanics, updateBooking } = useApp();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null,
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const assignedMechanic = booking.mechanicId
    ? mechanics.find((m) => m.id === booking.mechanicId)
    : null;

  const handleOpenContextMenu = () => {
    setSelectedStatus(booking.status);
    setSelectedMechanicId(booking.mechanicId || null);
    setShowContextMenu(true);
  };

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
    setShowContextMenu(false);
    setErrorMessage(null);
    onClose();
  };

  const handleClose = () => {
    setShowContextMenu(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {!showContextMenu ? (
          // Details view
          <>
            <div className="mb-6 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Jobbkort</h2>
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium ${statusColors[booking.status]}`}
              >
                {statusLabels[booking.status]}
              </span>
            </div>

            <div className="space-y-4">
              {/* Vehicle type */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Fordonstyp
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.vehicleType}
                </p>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Kund</h3>
                <p className="text-lg text-gray-900">{booking.customerName}</p>
                <p className="text-sm text-gray-600">{booking.customerPhone}</p>
              </div>

              {/* Action */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Åtgärd</h3>
                <p className="text-gray-900">{booking.action}</p>
              </div>

              {/* Duration */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Tid</h3>
                <p className="text-lg text-gray-900">
                  {booking.durationHours}h
                </p>
              </div>

              {/* Scheduled time */}
              {booking.scheduledDate && booking.scheduledStartHour && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Planerad tid
                  </h3>
                  <p className="text-lg text-gray-900">
                    {booking.scheduledDate} kl {booking.scheduledStartHour}:00
                  </p>
                </div>
              )}

              {/* Assigned mechanic */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Mekaniker</h3>
                <p className="text-lg text-gray-900">
                  {assignedMechanic ? assignedMechanic.name : "Ingen vald"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleOpenContextMenu}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Öppna meny
              </button>
              <button
                onClick={handleClose}
                className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Stäng
              </button>
            </div>
          </>
        ) : (
          // Context menu
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Ändra status och mekaniker
            </h2>

            <div className="space-y-6">
              {/* Status section */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-700">
                  Status
                </h3>
                <div className="space-y-2">
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
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full rounded-lg px-4 py-2 text-left transition ${
                        selectedStatus === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mechanic section */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-700">
                  Mekaniker
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMechanicId(null)}
                    className={`w-full rounded-lg px-4 py-2 text-left transition ${
                      selectedMechanicId === null
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Ingen vald
                  </button>
                  {mechanics.map((mechanic) => (
                    <button
                      key={mechanic.id}
                      onClick={() => setSelectedMechanicId(mechanic.id)}
                      className={`w-full rounded-lg px-4 py-2 text-left transition ${
                        selectedMechanicId === mechanic.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {mechanic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSaveChanges}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Spara
              </button>
              <button
                onClick={() => setShowContextMenu(false)}
                className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Avbryt
              </button>
            </div>
          </>
        )}
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

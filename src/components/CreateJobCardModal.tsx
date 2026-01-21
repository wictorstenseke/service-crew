// Create Job Card Modal
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { VehicleType, Booking } from "../types";

interface CreateJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const vehicleTypes: VehicleType[] = [
  "CYKEL",
  "MOPED",
  "MOTORCYKEL",
  "BIL",
  "LASTBIL",
  "BUSS",
  "TRAKTOR",
  "ANNAT",
];

export default function CreateJobCardModal({
  isOpen,
  onClose,
}: CreateJobCardModalProps) {
  const { addBooking, showToast } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType>("CYKEL");
  const [action, setAction] = useState("");
  const [durationHours, setDurationHours] = useState(1);

  const handleCancel = () => {
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedVehicleType("CYKEL");
    setAction("");
    setDurationHours(1);
    onClose();
  };

  useEscapeKey(handleCancel, isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !action.trim()) {
      return;
    }

    const newBooking: Booking = {
      id: generateId(),
      customerId: generateId(), // Simple customer ID for now
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      vehicleType: selectedVehicleType,
      action: action.trim(),
      durationHours: Math.max(1, durationHours),
      status: "EJ_PLANERAD",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addBooking(newBooking);

    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedVehicleType("CYKEL");
    setAction("");
    setDurationHours(1);

    showToast("Jobbkort skapat");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Skapa jobbkort
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer name */}
          <div>
            <label
              htmlFor="customerName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Kund
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Namn"
              required
            />
          </div>

          {/* Customer phone */}
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Telefon
            </label>
            <input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Telefonnummer"
              required
            />
          </div>

          {/* Vehicle type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Typ
            </label>
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedVehicleType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedVehicleType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            <label
              htmlFor="action"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Åtgärd
            </label>
            <textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              placeholder="Skriv vad kunden sa"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tid
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
              >
                − 1h
              </button>
              <span className="text-2xl font-bold text-gray-800">
                {durationHours}h
              </span>
              <button
                type="button"
                onClick={() => setDurationHours(durationHours + 1)}
                className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
              >
                + 1h
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">Hur lång tid tar det?</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Skapa jobbkort
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

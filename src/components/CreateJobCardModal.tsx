// Create Job Card Modal
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { storageService } from "../services/StorageService";
import type { VehicleType, Booking } from "../types";

interface CreateJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultVehicleTypes: VehicleType[] = [
  "CYKEL",
  "MOPED",
  "MOTORCYKEL",
  "BIL",
  "LASTBIL",
  "BUSS",
  "TRAKTOR",
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
  const [customVehicleTypes, setCustomVehicleTypes] = useState<string[]>([]);
  const [showAddTypeInput, setShowAddTypeInput] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState("");

  // Load custom vehicle types from localStorage
  useEffect(() => {
    if (isOpen) {
      const customTypes = storageService.getCustomVehicleTypes();
      setCustomVehicleTypes(customTypes);
    }
  }, [isOpen]);

  // Combine default and custom types
  const allVehicleTypes = [...defaultVehicleTypes, ...customVehicleTypes];

  const handleCancel = () => {
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedVehicleType("CYKEL");
    setAction("");
    setDurationHours(1);
    setShowAddTypeInput(false);
    setNewTypeInput("");
    onClose();
  };

  const handleAddType = () => {
    if (newTypeInput.trim()) {
      const upperType = newTypeInput.trim().toUpperCase();
      if (!allVehicleTypes.includes(upperType)) {
        storageService.saveCustomVehicleType(upperType);
        setCustomVehicleTypes([...customVehicleTypes, upperType]);
        setSelectedVehicleType(upperType);
        setShowAddTypeInput(false);
        setNewTypeInput("");
        showToast("Ny typ tillagd");
      } else {
        showToast("Typen finns redan", "error");
      }
    }
  };

  const handleAddTypeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddType();
    } else if (e.key === "Escape") {
      setShowAddTypeInput(false);
      setNewTypeInput("");
    }
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
          {/* Customer name and phone - same row */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Vehicle type */}
          <div>
            <div className="flex flex-wrap gap-2">
              {allVehicleTypes.map((type) => (
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
              {showAddTypeInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    onKeyDown={handleAddTypeKeyPress}
                    placeholder="Ny typ..."
                    className="rounded-full border-2 border-blue-500 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddType}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Spara
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTypeInput(false);
                      setNewTypeInput("");
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
                  >
                    Avbryt
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTypeInput(true)}
                  className="rounded-full border-2 border-dashed border-gray-400 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  + ADD
                </button>
              )}
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
              className="m-0 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              placeholder="Skriv vad kunden sa"
              required
            />
          </div>

          {/* Duration */}
          <div className="w-full">
            <div className="flex w-full items-center justify-center gap-6 rounded-lg bg-blue-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-semibold text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                −
              </button>
              <div className="flex min-w-[140px] items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {durationHours} timmar
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDurationHours(durationHours + 1)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-semibold text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                +
              </button>
            </div>
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

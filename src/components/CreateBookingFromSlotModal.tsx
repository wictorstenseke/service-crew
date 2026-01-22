// Create Booking From Slot Modal
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { storageService } from "../services/StorageService";
import type { VehicleType, Booking, Customer } from "../types";
import { Plus, Minus, CalendarPlus, X } from "lucide-react";
import CustomerCombobox from "./CustomerCombobox";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface CreateBookingFromSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: Date;
  hour: number;
  onValidate: (durationHours: number) => {
    valid: boolean;
    error?: string;
    suggestedDuration?: number;
  };
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

export default function CreateBookingFromSlotModal({
  isOpen,
  onClose,
  day,
  hour,
  onValidate,
}: CreateBookingFromSlotModalProps) {
  const { addBooking, addCustomer, customers, showToast, theme } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType>("CYKEL");
  const [action, setAction] = useState("");
  const [durationHours, setDurationHours] = useState(1);
  const [customVehicleTypes, setCustomVehicleTypes] = useState<string[]>([]);
  const [showAddTypeInput, setShowAddTypeInput] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestedDuration, setSuggestedDuration] = useState<number | null>(
    null,
  );

  // Load custom vehicle types from localStorage
  useEffect(() => {
    if (isOpen) {
      const customTypes = storageService.getCustomVehicleTypes();
      setCustomVehicleTypes(customTypes);
    }
  }, [isOpen]);

  // Validate time slot when duration changes
  useEffect(() => {
    if (isOpen) {
      const validation = onValidate(durationHours);
      if (!validation.valid) {
        setValidationError(validation.error || "Ogiltig tidslucka");
        setSuggestedDuration(validation.suggestedDuration || null);
      } else {
        setValidationError(null);
        setSuggestedDuration(null);
      }
    }
  }, [durationHours, isOpen, onValidate]);

  // Combine default and custom types
  const allVehicleTypes = [...defaultVehicleTypes, ...customVehicleTypes];

  // Handle customer selection from combobox
  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerPhone(customer.phone);
    } else {
      // Clear phone when customer is cleared
      setCustomerPhone("");
    }
  };

  const handleCancel = () => {
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedCustomer(null);
    setSelectedVehicleType("CYKEL");
    setAction("");
    setDurationHours(1);
    setShowAddTypeInput(false);
    setNewTypeInput("");
    setValidationError(null);
    setSuggestedDuration(null);
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

    // Validate booking slot
    const validation = onValidate(durationHours);
    if (!validation.valid) {
      setValidationError(validation.error || "Ogiltig tidslucka");
      setSuggestedDuration(validation.suggestedDuration || null);
      showToast(validation.error || "Ogiltig tidslucka", "error");
      return;
    }

    // Prevent submission if validation error exists
    if (validationError) {
      return;
    }

    // Save or update customer if it's a new customer or phone changed
    let customerId: string;
    if (selectedCustomer) {
      // Existing customer - use their ID
      customerId = selectedCustomer.id;
      // Update customer if phone number changed
      if (selectedCustomer.phone !== customerPhone.trim()) {
        const updatedCustomer: Customer = {
          ...selectedCustomer,
          phone: customerPhone.trim(),
        };
        addCustomer(updatedCustomer);
      }
    } else {
      // New customer - check if customer with same name exists
      const existingCustomer = customers.find(
        (c) => c.name.toLowerCase() === customerName.trim().toLowerCase(),
      );
      if (existingCustomer) {
        // Update existing customer with new phone
        customerId = existingCustomer.id;
        const updatedCustomer: Customer = {
          ...existingCustomer,
          phone: customerPhone.trim(),
        };
        addCustomer(updatedCustomer);
      } else {
        // Create new customer
        const newCustomer: Customer = {
          id: generateId(),
          name: customerName.trim(),
          phone: customerPhone.trim(),
        };
        addCustomer(newCustomer);
        customerId = newCustomer.id;
      }
    }

    const newBooking: Booking = {
      id: generateId(),
      customerId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      vehicleType: selectedVehicleType,
      action: action.trim(),
      durationHours: Math.max(1, durationHours),
      status: "PLANERAD",
      scheduledDate: format(day, "yyyy-MM-dd"),
      scheduledStartHour: hour,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addBooking(newBooking);

    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedCustomer(null);
    setSelectedVehicleType("CYKEL");
    setAction("");
    setDurationHours(1);
    setValidationError(null);
    setSuggestedDuration(null);

    showToast("Bokning skapad");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleCancel}
    >
      <div
        className={`w-full max-w-2xl rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={`mb-6 text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Skapa bokning
        </h2>

        {/* Pre-filled date/time info */}
        <div
          className={`mb-4 rounded-lg p-4 ${
            theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"
          }`}
        >
          <div
            className={`text-sm font-medium ${
              theme === "dark" ? "text-blue-200" : "text-blue-700"
            }`}
          >
            {format(day, "EEEE d MMMM", { locale: sv })} • {hour}:00
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer name and phone - same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="customerName"
                className={`mb-2 block text-sm font-medium ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                Kund
              </label>
              <CustomerCombobox
                value={customerName}
                onChange={setCustomerName}
                onSelect={handleCustomerSelect}
                customers={customers}
                placeholder="Namn"
                required
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className={`mb-2 block text-sm font-medium ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                Telefon
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300 focus:ring-blue-500/50"
                    : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
                }`}
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
                      : theme === "dark"
                        ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
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
                    className={`rounded-full border-2 border-blue-500 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-slate-700 text-white focus:ring-blue-500/50"
                        : "bg-white focus:ring-blue-200"
                    }`}
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
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      theme === "dark"
                        ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Avbryt
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTypeInput(true)}
                  className={`flex items-center gap-1 rounded-full border-2 border-dashed px-4 py-2 text-sm font-medium transition ${
                    theme === "dark"
                      ? "border-blue-700/50 text-blue-300 hover:border-blue-500 hover:bg-blue-900/30"
                      : "border-gray-400 text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  ADD
                </button>
              )}
            </div>
          </div>

          {/* Action */}
          <div>
            <label
              htmlFor="action"
              className={`mb-2 block text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              Åtgärd
            </label>
            <textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className={`m-0 w-full resize-none rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300 focus:ring-blue-500/50"
                  : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
              }`}
              rows={4}
              placeholder="Skriv vad kunden sa"
              required
            />
          </div>

          {/* Duration */}
          <div className="w-full">
            <div
              className={`flex w-full items-center justify-center gap-6 rounded-lg px-6 py-4 ${
                theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"
              }`}
            >
              <button
                type="button"
                onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-700 text-blue-200 hover:border-blue-500 hover:bg-blue-900/30"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Minus className="h-5 w-5" />
              </button>
              <div className="flex min-w-[140px] items-center justify-center">
                <span
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {durationHours} timmar
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDurationHours(durationHours + 1)}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-700 text-blue-200 hover:border-blue-500 hover:bg-blue-900/30"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div
              className={`rounded-lg border px-4 py-3 ${
                theme === "dark"
                  ? "border-red-500/50 bg-red-900/20 text-red-200"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">{validationError}</p>
                {suggestedDuration && suggestedDuration < durationHours && (
                  <button
                    type="button"
                    onClick={() => setDurationHours(suggestedDuration)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                      theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Testa {suggestedDuration} timmar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition ${
                theme === "dark"
                  ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <X className="h-5 w-5" />
              Avbryt
            </button>
            <button
              type="submit"
              disabled={!!validationError}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition ${
                validationError
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <CalendarPlus className="h-5 w-5" />
              Skapa bokning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

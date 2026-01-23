// Create Job Card Modal
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { storageService } from "../services/StorageService";
import type { VehicleType, Booking, Customer } from "../types";
import { Plus, Minus, FilePlus, X, Trash2 } from "lucide-react";
import CustomerCombobox from "./CustomerCombobox";
import { defaultVehicleTypes } from "../utils/vehicleTypes";

interface CreateJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional: when provided, the created job card will be planned
  // into this slot instead of being unplanned.
  scheduledDate?: string;
  scheduledStartHour?: number;
  onValidateSlot?: (durationHours: number) => {
    valid: boolean;
    error?: string;
    suggestedDuration?: number;
  };
}

export default function CreateJobCardModal({
  isOpen,
  onClose,
  scheduledDate,
  scheduledStartHour,
  onValidateSlot,
}: CreateJobCardModalProps) {
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
  const [pendingRemoveType, setPendingRemoveType] = useState<string | null>(
    null,
  );
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

  const handleRemoveTypeClick = (type: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the type when clicking delete
    setPendingRemoveType(type);
  };

  const performRemoveType = (type: string) => {
    if (selectedVehicleType === type) {
      // If the type being removed is currently selected, switch to default
      setSelectedVehicleType("CYKEL");
    }
    storageService.removeCustomVehicleType(type);
    setCustomVehicleTypes(customVehicleTypes.filter((t) => t !== type));
    showToast("Typ borttagen");
  };

  const handleConfirmRemoveType = () => {
    if (!pendingRemoveType) return;
    performRemoveType(pendingRemoveType);
    setPendingRemoveType(null);
  };

  const handleCancelRemoveType = () => {
    setPendingRemoveType(null);
  };

  useEscapeKey(handleCancel, isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedAction = action.trim();

    if (!trimmedName || !trimmedPhone || !trimmedAction) {
      return;
    }

    const hasSlot =
      Boolean(scheduledDate) && typeof scheduledStartHour === "number";

    // When creating directly from a calendar slot, validate the slot in the
    // background without showing any extra UI – only a toast on error.
    if (hasSlot && onValidateSlot) {
      const validation = onValidateSlot(durationHours);
      if (!validation.valid) {
        showToast(validation.error || "Ogiltig tidslucka", "error");
        return;
      }
    }

    // Save or update customer if it's a new customer or phone changed
    let customerId: string;
    if (selectedCustomer) {
      // Existing customer - use their ID
      customerId = selectedCustomer.id;
      // Update customer if phone number changed
      if (selectedCustomer.phone !== trimmedPhone) {
        const updatedCustomer: Customer = {
          ...selectedCustomer,
          phone: trimmedPhone,
        };
        addCustomer(updatedCustomer);
      }
    } else {
      // New customer - check if customer with same name exists
      const existingCustomer = customers.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (existingCustomer) {
        // Update existing customer with new phone
        customerId = existingCustomer.id;
        const updatedCustomer: Customer = {
          ...existingCustomer,
          phone: trimmedPhone,
        };
        addCustomer(updatedCustomer);
      } else {
        // Create new customer
        const newCustomer: Customer = {
          id: generateId(),
          name: trimmedName,
          phone: trimmedPhone,
        };
        addCustomer(newCustomer);
        customerId = newCustomer.id;
      }
    }

    const isPlanned = hasSlot;

    const newBooking: Booking = {
      id: generateId(),
      customerId,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      vehicleType: selectedVehicleType,
      action: trimmedAction,
      durationHours: Math.max(1, durationHours),
      status: isPlanned ? "PLANERAD" : "EJ_PLANERAD",
      ...(isPlanned
        ? {
            scheduledDate: scheduledDate!,
            scheduledStartHour: scheduledStartHour!,
          }
        : {}),
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

    showToast("Jobbkort skapat");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`relative w-full max-w-2xl rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleCancel}
          className={`absolute right-4 top-4 rounded-lg p-1 transition ${
            theme === "dark"
              ? "text-blue-200 hover:bg-slate-700 hover:text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          aria-label="Stäng"
        >
          <X className="h-5 w-5" />
        </button>

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
              {allVehicleTypes.map((type) => {
                const isCustom = customVehicleTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedVehicleType(type)}
                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedVehicleType === type
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                          ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span>{type}</span>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveTypeClick(type, e)}
                        className={`ml-1 rounded-full p-0.5 transition ${
                          selectedVehicleType === type
                            ? "text-white/80 hover:bg-white/20 hover:text-white"
                            : theme === "dark"
                              ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                              : "text-red-600 hover:bg-red-50 hover:text-red-700"
                        }`}
                        title="Ta bort typ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </button>
                );
              })}
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
              {pendingRemoveType && (
                <div
                  className={`mt-3 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-red-500/40 bg-red-900/40 text-red-100"
                      : "border-red-500/40 bg-red-50 text-red-800"
                  }`}
                >
                  <span>
                    Är du säker på att du vill ta bort typen&nbsp; &quot;
                    {pendingRemoveType}&quot;?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelRemoveType}
                      className={`rounded px-3 py-1 font-medium ${
                        theme === "dark"
                          ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Avbryt
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRemoveType}
                      className="rounded bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }}
              className={`m-0 w-full resize-none rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300 focus:ring-blue-500/50"
                  : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
              }`}
              rows={3}
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
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <FilePlus className="h-5 w-5" />
              Skapa jobbkort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

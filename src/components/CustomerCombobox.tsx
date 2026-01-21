// Customer Combobox - Autocomplete input for selecting or creating customers
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Customer } from "../types";

interface CustomerComboboxProps {
  value: string;
  onChange: (name: string) => void;
  onSelect: (customer: Customer | null) => void;
  customers: Customer[];
  placeholder?: string;
  required?: boolean;
}

export default function CustomerCombobox({
  value,
  onChange,
  onSelect,
  customers,
  placeholder = "Namn",
  required = false,
}: CustomerComboboxProps) {
  const { theme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter customers based on input value
  const filteredCustomers = value.trim()
    ? customers.filter((customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase()),
      )
    : customers;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    onSelect(null); // Clear selection when typing
  };

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    onChange(customer.name);
    onSelect(customer);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onSelect(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCustomers.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectCustomer(filteredCustomers[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll("[data-index]");
      const highlightedItem = items[highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 ${
            theme === "dark"
              ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300 focus:ring-blue-500/50"
              : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={`rounded p-1 transition ${
                theme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              inputRef.current?.focus();
            }}
            className={`rounded p-1 transition ${
              theme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
            tabIndex={-1}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filteredCustomers.length > 0 && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border shadow-lg ${
            theme === "dark"
              ? "border-blue-700/30 bg-slate-800"
              : "border-gray-200 bg-white"
          }`}
        >
          {filteredCustomers.map((customer, index) => (
            <button
              key={customer.id}
              type="button"
              data-index={index}
              onClick={() => handleSelectCustomer(customer)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                theme === "dark"
                  ? highlightedIndex === index
                    ? "bg-blue-900/50 text-blue-100"
                    : "text-blue-200 hover:bg-blue-900/30"
                  : highlightedIndex === index
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{customer.name}</div>
              <div className={`text-xs ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}>{customer.phone}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

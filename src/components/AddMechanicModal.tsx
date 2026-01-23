// Add Mechanic Modal - Form to add new mechanic
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Mechanic } from "../types";
import { Save, X } from "lucide-react";
import { playSound } from "../utils/soundPlayer";

interface AddMechanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMechanicModal({
  isOpen,
  onClose,
}: AddMechanicModalProps) {
  const { addMechanic, showToast, theme } = useApp();
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");

  const handleClose = () => {
    setName("");
    setCredential("");
    onClose();
  };

  useEscapeKey(handleClose, isOpen);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (!credential.trim()) return;

    // Validate PIN is 4 digits
    if (credential.length !== 4) {
      alert("PIN måste vara 4 siffror");
      return;
    }

    const newMechanic: Mechanic = {
      id: generateId(),
      name: name.trim(),
      loginMethod: "PIN",
      credential: credential.trim(),
      createdAt: new Date().toISOString(),
    };

    addMechanic(newMechanic);
    setName("");
    setCredential("");
    playSound("tuta.mp3");
    showToast("Mekaniker tillagd");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={`mb-4 text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Lägg till mekaniker
        </h2>

        <div className="mb-4">
          <label
            className={`mb-2 block text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-700"
            }`}
          >
            Namn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="För- och efternamn"
            className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none ${
              theme === "dark"
                ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300"
                : "border-gray-300 bg-white text-gray-800"
            }`}
            autoFocus
          />
        </div>

        <div className="mb-6">
          <label
            className={`mb-2 block text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-700"
            }`}
          >
            PIN-kod
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={credential}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setCredential(value);
            }}
            placeholder="Ange 4 siffror"
            className={`w-full rounded-md border px-4 py-2 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none ${
              theme === "dark"
                ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300"
                : "border-gray-300 bg-white text-gray-800"
            }`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold ${
              theme === "dark"
                ? "border-blue-700/50 text-blue-200 hover:bg-blue-900/50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <X className="h-5 w-5" />
            Avbryt
          </button>
          <button
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}

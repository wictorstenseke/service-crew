// Add Mechanic Modal - Form to add new mechanic
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import type { Mechanic, LoginMethod } from "../types";

interface AddMechanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMechanicModal({
  isOpen,
  onClose,
}: AddMechanicModalProps) {
  const { addMechanic } = useApp();
  const [name, setName] = useState("");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("PIN");
  const [credential, setCredential] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (!credential.trim()) return;

    // Validate PIN is 4 digits
    if (loginMethod === "PIN" && credential.length !== 4) {
      alert("PIN måste vara 4 siffror");
      return;
    }

    const newMechanic: Mechanic = {
      id: generateId(),
      name: name.trim(),
      loginMethod,
      credential: credential.trim(),
      createdAt: new Date().toISOString(),
    };

    addMechanic(newMechanic);
    setName("");
    setCredential("");
    setLoginMethod("PIN");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setCredential("");
    setLoginMethod("PIN");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Lägg till mekaniker</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Namn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="För- och efternamn"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Inloggningsmetod
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setLoginMethod("PIN");
                setCredential("");
              }}
              className={`flex-1 rounded-lg px-4 py-2 font-semibold transition ${
                loginMethod === "PIN"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              PIN (4 siffror)
            </button>
            <button
              onClick={() => {
                setLoginMethod("PASSWORD");
                setCredential("");
              }}
              className={`flex-1 rounded-lg px-4 py-2 font-semibold transition ${
                loginMethod === "PASSWORD"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Lösenord
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            {loginMethod === "PIN" ? "PIN-kod" : "Lösenord"}
          </label>
          {loginMethod === "PIN" ? (
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-center text-2xl tracking-widest focus:border-blue-500 focus:outline-none"
            />
          ) : (
            <input
              type="password"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Ange lösenord"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
          >
            Spara
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}

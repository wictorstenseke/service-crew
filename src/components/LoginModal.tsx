// Login Modal - PIN numpad and password entry for mechanic login
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Mechanic } from "../types";
import { ArrowLeft, Check, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  mechanic: Mechanic | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Playful error messages from copy-bank.md
const ERROR_MESSAGES = [
  // Olja & verktyg
  "Nä… händerna var så oljiga att knapparna gled iväg!",
  "Fel kod. Skiftnyckeln tryckte visst på fel siffra.",
  "Oops! Det blev mer olja än kod.",
  "Tangenterna fick verktyg i sig… fel kod.",
  // Maskiner & ljud
  "Motorn sa klonk… fel kod!",
  "Startmotorn hostade till – det där var inte rätt.",
  "Det skramlade lite… koden blev fel.",
  "Verkstaden blinkar rött – prova igen?",
  // Mekaniker-humor
  "Mekanikern kliade sig i hjälmen – fel kod.",
  "Fel kod. Kaffepaus kanske?",
  "Nästan! Men verkstaden säger nej.",
  "Fel kod. Tur att det inte exploderade 😅",
];

function getRandomErrorMessage(): string {
  return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
}

export default function LoginModal({
  isOpen,
  mechanic,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const { setCurrentMechanicId, theme } = useApp();
  const [pin, setPin] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pinRef = useRef(pin);

  // Keep ref in sync with state
  useEffect(() => {
    pinRef.current = pin;
  }, [pin]);

  useEscapeKey(onClose, isOpen);

  const handlePinClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handlePinBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (pin === mechanic?.credential) {
      // Success!
      setCurrentMechanicId(mechanic.id);
      setPin("");
      onSuccess();
    } else {
      // Wrong code - show playful error
      setErrorMessage(getRandomErrorMessage());
      setShowError(true);
      setPin("");
    }
  };

  // Handle keyboard input
  useEffect(() => {
    if (!isOpen || !mechanic || showError) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle number keys (0-9)
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setPin((currentPin) => {
          if (currentPin.length < 4) {
            return currentPin + e.key;
          }
          return currentPin;
        });
      }
      // Handle Backspace or Delete
      else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setPin((currentPin) => currentPin.slice(0, -1));
      }
      // Handle Enter to submit
      else if (e.key === "Enter") {
        e.preventDefault();
        const currentPin = pinRef.current;
        if (currentPin.length === 4) {
          if (currentPin === mechanic.credential) {
            // Success!
            setCurrentMechanicId(mechanic.id);
            setPin("");
            onSuccess();
          } else {
            // Wrong code - show playful error
            setErrorMessage(getRandomErrorMessage());
            setShowError(true);
            setPin("");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, mechanic, showError, setCurrentMechanicId, onSuccess]);

  if (!isOpen || !mechanic) return null;

  const handleLoginAnyway = () => {
    // Bypass - allow login anyway
    setCurrentMechanicId(mechanic.id);
    setPin("");
    setShowError(false);
    onSuccess();
  };

  const handleClose = () => {
    setPin("");
    setShowError(false);
    onClose();
  };

  if (showError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div
          className={`w-full max-w-md rounded-lg border p-6 shadow-2xl backdrop-blur-sm ${
            theme === "dark"
              ? "border-blue-700/30 bg-slate-800/95"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2
            className={`mb-4 text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            🚫 Fel kod i verkstaden
          </h2>
          <p
            className={`mb-6 text-lg ${
              theme === "dark" ? "text-blue-100" : "text-gray-700"
            }`}
          >
            {errorMessage}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowError(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              <Check className="h-5 w-5" />
              Försök igen
            </button>
            <button
              onClick={handleLoginAnyway}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold ${
                theme === "dark"
                  ? "border-blue-700/50 text-blue-200 hover:bg-blue-900/50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Logga in ändå
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-lg border p-6 shadow-2xl backdrop-blur-sm ${
          theme === "dark"
            ? "border-blue-700/30 bg-slate-800/95"
            : "border-gray-200 bg-white"
        }`}
      >
        <h2
          className={`mb-2 text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Logga in
        </h2>
        <p
          className={`mb-4 ${
            theme === "dark" ? "text-blue-100" : "text-gray-600"
          }`}
        >
          {mechanic.name}
        </p>

        <div className="mb-6">
          <p
            className={`mb-3 text-center text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            Ange din 4-siffriga kod
          </p>
          <div className="mb-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-md border-2 text-2xl font-bold ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-700/50 text-white"
                    : "border-gray-300 bg-gray-50 text-gray-800"
                }`}
              >
                {pin[index] ? "•" : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Numpad */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinClick(digit.toString())}
              className={`rounded-lg border-2 py-4 text-2xl font-bold transition ${
                theme === "dark"
                  ? "border-blue-700/50 bg-slate-700/50 text-white hover:bg-slate-600/50 active:bg-slate-500/50"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handlePinBackspace}
            className={`flex items-center justify-center rounded-lg border-2 py-4 transition ${
              theme === "dark"
                ? "border-blue-700/50 bg-slate-700/50 text-white hover:bg-slate-600/50 active:bg-slate-500/50"
                : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handlePinClick("0")}
            className={`rounded-lg border-2 py-4 text-2xl font-bold transition ${
              theme === "dark"
                ? "border-blue-700/50 bg-slate-700/50 text-white hover:bg-slate-600/50 active:bg-slate-500/50"
                : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            0
          </button>
          <button
            onClick={handlePinSubmit}
            disabled={pin.length !== 4}
            className={`flex items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold text-white transition ${
              pin.length !== 4
                ? theme === "dark"
                  ? "bg-gray-600 text-gray-400"
                  : "bg-gray-300 text-gray-500"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            <Check className="h-5 w-5" />
            OK
          </button>
        </div>

        <button
          onClick={handleClose}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold ${
            theme === "dark"
              ? "border-blue-700/50 text-blue-200 hover:bg-blue-900/50"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <X className="h-5 w-5" />
          Avbryt
        </button>
      </div>
    </div>
  );
}

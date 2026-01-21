// Login Modal - PIN numpad and password entry for mechanic login
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Mechanic } from "../types";

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
  const { setCurrentMechanicId } = useApp();
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEscapeKey(onClose, isOpen);

  if (!isOpen || !mechanic) return null;

  const isPinMethod = mechanic.loginMethod === "PIN";

  const handlePinClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handlePinBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (pin === mechanic.credential) {
      // Success!
      setCurrentMechanicId(mechanic.id);
      setPin("");
      setPassword("");
      onSuccess();
    } else {
      // Wrong code - show playful error
      setErrorMessage(getRandomErrorMessage());
      setShowError(true);
      setPin("");
    }
  };

  const handlePasswordSubmit = () => {
    if (password === mechanic.credential) {
      // Success!
      setCurrentMechanicId(mechanic.id);
      setPin("");
      setPassword("");
      onSuccess();
    } else {
      // Wrong code - show playful error
      setErrorMessage(getRandomErrorMessage());
      setShowError(true);
      setPassword("");
    }
  };

  const handleLoginAnyway = () => {
    // Bypass - allow login anyway
    setCurrentMechanicId(mechanic.id);
    setPin("");
    setPassword("");
    setShowError(false);
    onSuccess();
  };

  const handleClose = () => {
    setPin("");
    setPassword("");
    setShowError(false);
    onClose();
  };

  if (showError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">🚫 Fel kod i verkstaden</h2>
          <p className="mb-6 text-lg text-gray-700">{errorMessage}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowError(false)}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Försök igen
            </button>
            <button
              onClick={handleLoginAnyway}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Logga in ändå
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold">Logga in</h2>
        <p className="mb-4 text-gray-600">{mechanic.name}</p>

        {isPinMethod ? (
          <>
            <div className="mb-6">
              <p className="mb-3 text-center text-sm text-gray-600">
                Ange din 4-siffriga kod
              </p>
              <div className="mb-4 flex justify-center gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-gray-300 bg-gray-50 text-2xl font-bold"
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
                  className="rounded-lg border-2 border-gray-300 bg-white py-4 text-2xl font-bold transition hover:bg-gray-50 active:bg-gray-100"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handlePinBackspace}
                className="rounded-lg border-2 border-gray-300 bg-white py-4 text-lg font-semibold transition hover:bg-gray-50 active:bg-gray-100"
              >
                ←
              </button>
              <button
                onClick={() => handlePinClick("0")}
                className="rounded-lg border-2 border-gray-300 bg-white py-4 text-2xl font-bold transition hover:bg-gray-50 active:bg-gray-100"
              >
                0
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pin.length !== 4}
                className="rounded-lg bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-300"
              >
                OK
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                placeholder="Ange ditt lösenord"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="mb-3 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
            >
              Logga in
            </button>
          </>
        )}

        <button
          onClick={handleClose}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import type { WeeklyEvent } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORK_START_HOUR = 7;
const WORK_END_HOUR = 17;

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    theme,
    weeklyEvents,
    addWeeklyEvent,
    deleteWeeklyEvent,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [fromHour, setFromHour] = useState(9);
  const [toHour, setToHour] = useState(10);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setFromHour(9);
    setToHour(10);
    onClose();
  };

  const handleAddEvent = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Skriv en titel för veckobokningen", "error");
      return;
    }

    if (fromHour >= toHour) {
      showToast("Sluttiden måste vara efter starttiden", "error");
      return;
    }

    const newEvent: WeeklyEvent = {
      id: generateId(),
      title: trimmedTitle,
      fromHour,
      toHour,
    };

    addWeeklyEvent(newEvent);
    showToast("Veckobokning sparad");

    setTitle("");
    setFromHour(9);
    setToHour(10);
  };

  const handleDeleteEvent = (id: string) => {
    deleteWeeklyEvent(id);
    showToast("Veckobokning borttagen");
  };

  const fromOptions = Array.from(
    { length: WORK_END_HOUR - WORK_START_HOUR },
    (_, i) => WORK_START_HOUR + i,
  );
  const toOptions = Array.from(
    { length: WORK_END_HOUR - WORK_START_HOUR + 1 },
    (_, i) => WORK_START_HOUR + i + 1,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-lg p-6 shadow-xl ${
          theme === "dark"
            ? "border border-blue-700/30 bg-slate-800/95 backdrop-blur-sm"
            : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={`mb-2 text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Inställningar
        </h2>
        <p
          className={`mb-6 text-sm ${
            theme === "dark" ? "text-blue-100" : "text-gray-600"
          }`}
        >
          Hantera återkommande veckobokningar som visas som en svag bakgrund i
          kalendern. De blockerar inte bokningar utan fungerar som påminnelse.
        </p>

        {/* Veckobokning section */}
        <section className="space-y-4">
          <h3
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-800"
            }`}
          >
            Veckobokning
          </h3>

          {/* Existing events */}
          {weeklyEvents.length > 0 ? (
            <div
              className={`max-h-48 space-y-2 overflow-y-auto rounded-md border px-3 py-2 ${
                theme === "dark"
                  ? "border-blue-700/40 bg-slate-900/40"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {weeklyEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <div>
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-blue-100" : "text-gray-800"
                      }`}
                    >
                      {event.title}
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-600"
                      }`}
                    >
                      {formatHour(event.fromHour)} – {formatHour(event.toHour)}{" "}
                      (mån–fre)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event.id)}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                      theme === "dark"
                        ? "text-red-300 hover:bg-red-900/40"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-sm italic ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            >
              Inga veckobokningar ännu. Lägg till en nedan.
            </p>
          )}

          {/* Create new weekly event */}
          <div
            className={`mt-2 rounded-md p-4 ${
              theme === "dark" ? "bg-slate-900/40" : "bg-gray-50"
            }`}
          >
            <div className="mb-3">
              <label
                className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Till exempel: Frukost"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-slate-800/80 text-white placeholder-blue-300 focus:ring-blue-500/40"
                    : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
                }`}
              />
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col">
                <label
                  className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                    theme === "dark" ? "text-blue-300" : "text-gray-600"
                  }`}
                >
                  Från
                </label>
                <select
                  value={fromHour}
                  onChange={(e) => setFromHour(Number(e.target.value))}
                  className={`rounded-md border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-800/80 text-white focus:ring-blue-500/40"
                      : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
                  }`}
                >
                  {fromOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {formatHour(hour)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                    theme === "dark" ? "text-blue-300" : "text-gray-600"
                  }`}
                >
                  Till
                </label>
                <select
                  value={toHour}
                  onChange={(e) => setToHour(Number(e.target.value))}
                  className={`rounded-md border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-800/80 text-white focus:ring-blue-500/40"
                      : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200"
                  }`}
                >
                  {toOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {formatHour(hour)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddEvent}
                className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Lägg till
              </button>
            </div>

            <p
              className={`mt-3 text-xs ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            >
              Visas som en svag bakgrund i kalendern varje vecka, måndag till
              fredag, mellan tiderna du anger.
            </p>
          </div>
        </section>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              theme === "dark"
                ? "bg-slate-700 text-blue-200 hover:bg-slate-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}



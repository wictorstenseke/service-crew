// Landing page - Workshop selection and mechanic login
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import { useEscapeKey } from "../hooks/useEscapeKey";
import type { Workshop, Mechanic } from "../types";
import AddMechanicModal from "../components/AddMechanicModal";
import LoginModal from "../components/LoginModal";
import { Plus, Building2, RotateCcw, X, Sun, Moon } from "lucide-react";

const BASE_URL = "/service-crew/";

export default function LandingPage() {
  const {
    workshop,
    mechanics,
    setWorkshop,
    resetWorkshop,
    showToast,
    theme,
    toggleTheme,
  } = useApp();
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false);
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [workshopName, setWorkshopName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("004-mechanic.png");
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null,
  );
  const [showLogin, setShowLogin] = useState(false);

  const availableIcons = [
    "001-car-engine.png",
    "003-piston.png",
    "004-mechanic.png",
    "005-mechanic-1.png",
    "006-engine-oil.png",
  ];

  useEscapeKey(() => {
    if (showCreateWorkshop) {
      setShowCreateWorkshop(false);
      setWorkshopName("");
      setSelectedIcon("004-mechanic.png");
    }
  }, showCreateWorkshop);

  const handleCreateWorkshop = () => {
    if (!workshopName.trim()) return;

    const newWorkshop: Workshop = {
      id: generateId(),
      name: workshopName.trim(),
      icon: selectedIcon,
      createdAt: new Date().toISOString(),
    };

    resetWorkshop();
    setWorkshop(newWorkshop);
    setWorkshopName("");
    setSelectedIcon("004-mechanic.png");
    setShowCreateWorkshop(false);
    showToast("Ny verkstad skapad");
  };

  if (!workshop) {
    return (
      <div
        className={`relative flex min-h-screen items-center justify-center p-8 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
            : "bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50"
        }`}
      >
        <div className="absolute right-8 top-8">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition ${
              theme === "dark"
                ? "border-white text-white hover:bg-white hover:text-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            title={
              theme === "dark"
                ? "Växla till ljust läge"
                : "Växla till mörkt läge"
            }
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                Ljust läge
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Mörkt läge
              </>
            )}
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <img
              src={`${BASE_URL}004-mechanic.png`}
              alt="Mekaniker"
              className="h-[300px] w-[300px] object-contain transition-transform hover:scale-105"
            />
          </div>
          <div
            className={`w-full min-w-[520px] max-w-md rounded-lg border p-8 shadow-2xl backdrop-blur-sm ${
              theme === "dark"
                ? "border-blue-700/30 bg-slate-800/90"
                : "border-gray-200 bg-white"
            }`}
          >
            <h1
              className={`mb-6 text-center text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
            Välkommen till Service Crew
          </h1>
          <div
            className={`rounded-md border p-6 text-center ${
              theme === "dark"
                ? "border-blue-700/30 bg-blue-900/40"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-blue-100" : "text-blue-900"
              }`}
            >
              Kom igång genom att skapa din första verkstad
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowCreateWorkshop(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                <Building2 className="h-5 w-5" />
                Skapa verkstad
              </button>
            </div>
          </div>
          </div>
        </div>

        {showCreateWorkshop && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => {
              setShowCreateWorkshop(false);
              setWorkshopName("");
              setSelectedIcon("004-mechanic.png");
            }}
          >
            <div
              className={`w-full max-w-[640px] rounded-lg border p-6 shadow-2xl backdrop-blur-sm ${
                theme === "dark"
                  ? "border-blue-700/30 bg-slate-800/95"
                  : "border-gray-200 bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className={`mb-10 text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Skapa verkstad och öppna portarna.
              </h2>
              <div className="mb-10">
                <label
                  className={`mb-2 block text-sm font-semibold ${
                    theme === "dark" ? "text-blue-100" : "text-gray-700"
                  }`}
                >
                  Välj ikon för verkstaden
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`flex items-center justify-center rounded-lg border-2 p-3 transition ${
                        selectedIcon === icon
                          ? theme === "dark"
                            ? "border-blue-500 bg-blue-900/50"
                            : "border-blue-500 bg-blue-100"
                          : theme === "dark"
                            ? "border-blue-700/30 bg-slate-700/30 hover:border-blue-600 hover:bg-slate-700/50"
                            : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
                      }`}
                    >
                      <img
                        src={`${BASE_URL}${icon}`}
                        alt={icon}
                        className="h-16 w-16 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-10">
                <label
                  className={`mb-2 block text-sm font-semibold ${
                    theme === "dark" ? "text-blue-100" : "text-gray-700"
                  }`}
                >
                  Skriv ett namn
                </label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="Verkstadsnamn"
                  className={`w-full rounded-md border px-4 py-2 text-center text-xl focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "border-blue-700/50 bg-slate-700/50 text-white placeholder-blue-300 focus:border-blue-500 focus:ring-blue-500/50"
                      : "border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                  }`}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreateWorkshop(false);
                    setWorkshopName("");
                    setSelectedIcon("004-mechanic.png");
                  }}
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
                  onClick={handleCreateWorkshop}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  <Building2 className="h-5 w-5" />
                  Skapa verkstad
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col p-8 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50"
      }`}
    >
      <div className="absolute right-8 top-8 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition ${
            theme === "dark"
              ? "border-white text-white hover:bg-white hover:text-blue-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title={
            theme === "dark" ? "Växla till ljust läge" : "Växla till mörkt läge"
          }
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" />
              Ljust läge
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              Mörkt läge
            </>
          )}
        </button>
        <button
          onClick={() => {
            if (
              confirm(
                "Starta om allt och skapa en ny verkstad? Ny verkstad = tom kalender, nya mekaniker och nya jobb.",
              )
            ) {
              resetWorkshop();
            }
          }}
          className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition ${
            theme === "dark"
              ? "border-white text-white hover:bg-white hover:text-blue-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <RotateCcw className="h-5 w-5" />
          Skapa ny verkstad
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <img
              src={`${BASE_URL}${workshop.icon || "004-mechanic.png"}`}
              alt="Verkstad"
              className="h-[300px] w-[300px] object-contain transition-transform hover:scale-105"
            />
          </div>
          <div
            className={`w-full min-w-[520px] max-w-2xl rounded-lg border p-8 shadow-2xl backdrop-blur-sm ${
              theme === "dark"
                ? "border-blue-700/30 bg-slate-800/90"
                : "border-gray-200 bg-white"
            }`}
          >
            <h1
              className={`mb-6 text-center text-4xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
            {workshop.name}
          </h1>

          {mechanics.length === 0 ? (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAddMechanic(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500"
              >
                <Plus className="h-5 w-5" />
                Lägg till mekaniker
              </button>
            </div>
          ) : (
            <>
              <p
                className={`mb-8 text-center ${
                  theme === "dark" ? "text-blue-100" : "text-gray-600"
                }`}
              >
                Välj mekaniker
              </p>
              <div className="mb-6 flex flex-wrap justify-center gap-4">
                {mechanics.map((mechanic, index) => {
                  // Cycle through available icons for each mechanic
                  const iconIndex = index % availableIcons.length;
                  const mechanicIcon = availableIcons[iconIndex];
                  
                  return (
                    <button
                      key={mechanic.id}
                      onClick={() => {
                        setSelectedMechanic(mechanic);
                        setShowLogin(true);
                      }}
                      className={`flex items-center justify-center gap-4 rounded-lg border-2 pl-10 pr-12 py-6 text-center font-semibold transition ${
                        theme === "dark"
                          ? "border-blue-700/50 bg-slate-700/50 text-white hover:border-blue-500 hover:bg-blue-800/50"
                          : "border-gray-300 bg-white text-gray-800 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      <img
                        src={`${BASE_URL}${mechanicIcon}`}
                        alt={mechanicIcon.replace(".png", "")}
                        className="h-12 w-12 flex-shrink-0 object-contain"
                      />
                      <span className="text-xl whitespace-nowrap">{mechanic.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowAddMechanic(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500"
                >
                  <Plus className="h-5 w-5" />
                  Lägg till mekaniker
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      <AddMechanicModal
        isOpen={showAddMechanic}
        onClose={() => setShowAddMechanic(false)}
      />

      <LoginModal
        isOpen={showLogin}
        mechanic={selectedMechanic}
        onClose={() => {
          setShowLogin(false);
          setSelectedMechanic(null);
        }}
        onSuccess={() => {
          setShowLogin(false);
          setSelectedMechanic(null);
          // Redirect to calendar will be handled by parent App component
        }}
      />
    </div>
  );
}

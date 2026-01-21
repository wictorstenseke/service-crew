// Landing page - Workshop selection and mechanic login
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateId } from "../utils/idGenerator";
import type { Workshop, Mechanic } from "../types";
import AddMechanicModal from "../components/AddMechanicModal";
import LoginModal from "../components/LoginModal";

export default function LandingPage() {
  const { workshop, mechanics, setWorkshop, resetWorkshop } = useApp();
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false);
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [workshopName, setWorkshopName] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null,
  );
  const [showLogin, setShowLogin] = useState(false);

  const handleCreateWorkshop = () => {
    if (!workshopName.trim()) return;

    const newWorkshop: Workshop = {
      id: generateId(),
      name: workshopName.trim(),
      createdAt: new Date().toISOString(),
    };

    resetWorkshop();
    setWorkshop(newWorkshop);
    setWorkshopName("");
    setShowCreateWorkshop(false);
  };

  if (!workshop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Välkommen till verkstaden
          </h1>
          <div className="rounded-md bg-amber-50 p-6 text-center">
            <p className="mb-4 text-gray-700">
              Ingen verkstad än. Skapa en ny för att börja.
            </p>
            <button
              onClick={() => setShowCreateWorkshop(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Skapa verkstad
            </button>
          </div>
        </div>

        {showCreateWorkshop && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold">Skapa ny verkstad</h2>
              <p className="mb-4 text-gray-600">
                Skapa verkstad och öppna portarna.
              </p>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="Verkstadsnamn"
                className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateWorkshop}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Skapa verkstad
                </button>
                <button
                  onClick={() => {
                    setShowCreateWorkshop(false);
                    setWorkshopName("");
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="absolute right-8 top-8">
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
          className="rounded-lg border-2 border-white px-4 py-2 font-semibold text-white transition hover:bg-white hover:text-blue-600"
        >
          Skapa ny verkstad
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-center text-4xl font-bold text-gray-800">
            {workshop.name}
          </h1>
          <p className="mb-8 text-center text-gray-600">Välj mekaniker</p>

          {mechanics.length === 0 ? (
            <div className="rounded-md bg-amber-50 p-6 text-center">
              <p className="mb-4 text-gray-700">
                Inga mekaniker ännu. Lägg till första mekanikern.
              </p>
              <button
                onClick={() => setShowAddMechanic(true)}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Lägg till mekaniker
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-2 gap-4">
                {mechanics.map((mechanic) => (
                  <button
                    key={mechanic.id}
                    onClick={() => {
                      setSelectedMechanic(mechanic);
                      setShowLogin(true);
                    }}
                    className="rounded-lg border-2 border-gray-300 bg-white p-6 text-center font-semibold transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    {mechanic.name}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowAddMechanic(true)}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Lägg till mekaniker
                </button>
              </div>
            </>
          )}
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

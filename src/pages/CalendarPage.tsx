// Calendar page - Week view with job planning
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import CreateJobCardModal from "../components/CreateJobCardModal";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
} from "date-fns";
import { sv } from "date-fns/locale";

export default function CalendarPage() {
  const {
    selectedWorkday,
    setSelectedWorkday,
    setCurrentMechanicId,
    bookings,
  } = useApp();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [showCreateJobCard, setShowCreateJobCard] = useState(false);

  // Generate days for the current week (Monday-Sunday)
  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

  // Time slots (07:00-17:00)
  const timeSlots = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => i + 7); // 7 to 17
  }, []);

  // Get unplanned bookings
  const unplannedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "EJ_PLANERAD");
  }, [bookings]);

  // Get bookings for a specific day and hour
  const getBookingsForSlot = (day: Date, hour: number) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return bookings.filter(
      (b) =>
        b.scheduledDate === dayStr &&
        b.scheduledStartHour !== undefined &&
        b.scheduledStartHour === hour &&
        b.status !== "EJ_PLANERAD",
    );
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Handle day click to set as workday
  const handleDayClick = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    setSelectedWorkday(dayStr);
  };

  // Check if a day is the selected workday
  const isSelectedWorkday = (day: Date) => {
    if (!selectedWorkday) return false;
    try {
      const selectedDate = parseISO(selectedWorkday);
      return isSameDay(day, selectedDate);
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Kalender</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateJobCard(true)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                + Skapa jobbkort
              </button>
              <button
                onClick={goToToday}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Idag
              </button>
              <button
                onClick={() => setCurrentMechanicId(null)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Week navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="rounded-lg bg-white px-4 py-2 shadow hover:bg-gray-50"
          >
            ← Föregående vecka
          </button>
          <span className="font-medium text-gray-700">
            {format(currentWeekStart, "d MMM", { locale: sv })} -{" "}
            {format(weekDays[6], "d MMM yyyy", { locale: sv })}
          </span>
          <button
            onClick={goToNextWeek}
            className="rounded-lg bg-white px-4 py-2 shadow hover:bg-gray-50"
          >
            Nästa vecka →
          </button>
        </div>

        {/* Calendar grid */}
        <div className="flex gap-4">
          {/* Unplanned jobs column */}
          <div className="w-48 flex-shrink-0">
            <div className="rounded-lg bg-orange-50 p-4 shadow">
              <h3 className="mb-3 text-sm font-semibold text-orange-900">
                Ej planerade
              </h3>
              <div className="space-y-2">
                {unplannedBookings.length === 0 ? (
                  <p className="text-xs text-orange-700">
                    Inga jobb här just nu.
                  </p>
                ) : (
                  unplannedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="cursor-move rounded-lg bg-orange-200 p-2 text-xs shadow-sm hover:shadow-md"
                    >
                      <div className="font-semibold">{booking.vehicleType}</div>
                      <div className="truncate text-orange-900">
                        {booking.action}
                      </div>
                      <div className="mt-1 text-orange-700">
                        {booking.durationHours}h
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Week view */}
          <div className="flex-1 overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Day headers */}
              <div className="mb-2 grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isWorkday = isSelectedWorkday(day);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={`cursor-pointer rounded-lg p-3 text-center transition ${
                        isWorkday
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {format(day, "EEE", { locale: sv })}
                      </div>
                      <div className="text-lg font-bold">
                        {format(day, "d", { locale: sv })}
                      </div>
                      {isWorkday && (
                        <div className="mt-1 text-xs font-semibold">IDAG</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="space-y-1">
                    {timeSlots.map((hour) => {
                      const slotBookings = getBookingsForSlot(day, hour);
                      return (
                        <div
                          key={hour}
                          className="relative min-h-[60px] rounded border border-gray-200 bg-white p-1"
                        >
                          <div className="text-xs text-gray-400">
                            {hour}:00
                          </div>
                          {slotBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
                              style={{
                                height: `${booking.durationHours * 60 - 10}px`,
                              }}
                            >
                              <div className="font-semibold">
                                {booking.vehicleType}
                              </div>
                              <div className="truncate">
                                {booking.action.substring(0, 20)}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Job Card Modal */}
      <CreateJobCardModal
        isOpen={showCreateJobCard}
        onClose={() => setShowCreateJobCard(false)}
      />
    </div>
  );
}

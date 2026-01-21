// Calendar page - Week view with job planning
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import CreateJobCardModal from "../components/CreateJobCardModal";
import BookingDetailsModal from "../components/BookingDetailsModal";
import type { Booking } from "../types";
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
import type { BookingStatus } from "../types";
import { Plus, ChevronLeft, ChevronRight, Calendar, Moon, Sun } from "lucide-react";

// Constants
const MINUTES_PER_HOUR = 60;
const WORK_START_HOUR = 7;
const WORK_END_HOUR = 17;
const HOUR_HEIGHT_PX = 60;
const BOOKING_MARGIN_PX = 4;

// Status colors for booking cards - theme-aware
const getStatusColors = (theme: "dark" | "light"): Record<BookingStatus, string> => {
  if (theme === "dark") {
    return {
      EJ_PLANERAD: "bg-orange-600/40 hover:bg-orange-600/50 text-orange-100 border border-orange-600/30",
      PLANERAD: "bg-blue-600/40 hover:bg-blue-600/50 text-blue-100 border border-blue-600/30",
      PAGAR: "bg-yellow-600/40 hover:bg-yellow-600/50 text-yellow-100 border border-yellow-600/30",
      KLAR: "bg-green-600/40 hover:bg-green-600/50 text-green-100 border border-green-600/30",
      HAMTAD: "bg-gray-600/40 hover:bg-gray-600/50 text-gray-100 border border-gray-600/30",
    };
  } else {
    return {
      EJ_PLANERAD: "bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300",
      PLANERAD: "bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300",
      PAGAR: "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300",
      KLAR: "bg-green-100 hover:bg-green-200 text-green-900 border border-green-300",
      HAMTAD: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300",
    };
  }
};

export default function CalendarPage() {
  const {
    selectedWorkday,
    setSelectedWorkday,
    setCurrentMechanicId,
    bookings,
    updateBooking,
    showToast,
    mechanics,
    theme,
    toggleTheme,
  } = useApp();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [showCreateJobCard, setShowCreateJobCard] = useState(false);
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{
    day: string;
    hour: number;
  } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Generate days for the current week (Monday-Sunday)
  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

  // Find the index of the day with IDAG (selected workday)
  const idagDayIndex = useMemo(() => {
    if (!selectedWorkday) return -1;
    try {
      const selectedDate = parseISO(selectedWorkday);
      return weekDays.findIndex((day) => isSameDay(day, selectedDate));
    } catch {
      return -1;
    }
  }, [selectedWorkday, weekDays]);

  // Time slots (07:00-17:00)
  const timeSlots = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => i + 7); // 7 to 17
  }, []);

  // Get unplanned bookings
  const unplannedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "EJ_PLANERAD");
  }, [bookings]);

  // Get bookings for a specific day (not per hour - render once)
  const getBookingsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return bookings.filter(
      (b) =>
        b.scheduledDate === dayStr &&
        b.scheduledStartHour !== undefined &&
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

  // Drag & drop handlers
  const handleDragStart = (bookingId: string) => {
    setDraggedBookingId(bookingId);
  };

  const handleDragEnd = () => {
    setDraggedBookingId(null);
    setHoveredSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault(); // Allow drop
    const dayStr = format(day, "yyyy-MM-dd");
    setHoveredSlot({ day: dayStr, hour });
  };

  const handleDragLeave = () => {
    setHoveredSlot(null);
  };

  const isValidDropZone = (day: Date, hour: number): boolean => {
    if (!draggedBookingId) return false;

    const booking = bookings.find((b) => b.id === draggedBookingId);
    if (!booking) return false;

    const duration = booking.durationHours;

    // Check if booking extends beyond work hours
    if (hour + duration > WORK_END_HOUR + 1) return false;

    // Check if there are any conflicting bookings in the time range
    const dayBookings = getBookingsForDay(day);
    for (const existingBooking of dayBookings) {
      if (existingBooking.id === draggedBookingId) continue; // Skip self

      const existingStart = existingBooking.scheduledStartHour!;
      const existingEnd = existingStart + existingBooking.durationHours;
      const newEnd = hour + duration;

      // Check for overlap
      if (hour < existingEnd && newEnd > existingStart) {
        return false;
      }
    }

    return true;
  };

  const handleDrop = (day: Date, hour: number) => {
    if (!draggedBookingId) return;

    const booking = bookings.find((b) => b.id === draggedBookingId);
    if (!booking) return;

    // Check if drop is valid
    if (!isValidDropZone(day, hour)) {
      showToast("För tight, prova en annan tid", "error");
      setDraggedBookingId(null);
      setHoveredSlot(null);
      return;
    }

    // Update booking with scheduled date and time
    // Keep current status if already planned, otherwise set to PLANERAD
    const updatedBooking = {
      ...booking,
      scheduledDate: format(day, "yyyy-MM-dd"),
      scheduledStartHour: hour,
      status:
        booking.status === "EJ_PLANERAD"
          ? ("PLANERAD" as const)
          : booking.status,
      updatedAt: new Date().toISOString(),
    };

    updateBooking(updatedBooking);
    setDraggedBookingId(null);
    setHoveredSlot(null);
    showToast(booking.status === "EJ_PLANERAD" ? "Planerat" : "Omplanerat");
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCloseBookingDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
  };

  return (
    <div className={`min-h-screen relative ${
      theme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" 
        : "bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50"
    }`}>
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-4">
        {/* Week navigation */}
        <div className="mb-4 flex items-center gap-4">
          {/* Spacer to match unplanned column width */}
          <div className="w-48 flex-shrink-0"></div>
          {/* Calendar-aligned navigation */}
          <div className="flex flex-1 items-center justify-between" style={{ paddingLeft: "0px" }}>
            {/* Left side: Previous week + Today */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousWeek}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 shadow-lg transition ${
                  theme === "dark"
                    ? "bg-slate-800/90 border-blue-700/30 text-white hover:bg-slate-700/90"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Föregående vecka
              </button>
              <button
                onClick={goToToday}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
              >
                <Calendar className="h-4 w-4" />
                Idag
              </button>
            </div>
            {/* Center: Date */}
            <span className={`font-medium ${
              theme === "dark" ? "text-blue-100" : "text-gray-700"
            }`}>
              {format(currentWeekStart, "d MMM", { locale: sv })} -{" "}
              {format(weekDays[6], "d MMM yyyy", { locale: sv })}
            </span>
            {/* Right side: Next week */}
            <button
              onClick={goToNextWeek}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 shadow-lg transition ${
                theme === "dark"
                  ? "bg-slate-800/90 border-blue-700/30 text-white hover:bg-slate-700/90"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Nästa vecka
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex gap-4">
          {/* Unplanned jobs column */}
          <div className="flex w-48 flex-shrink-0 flex-col gap-4">
            <button
              onClick={() => setShowCreateJobCard(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Skapa jobbkort
            </button>
            <div className={`rounded-lg p-4 shadow-lg ${
              unplannedBookings.length === 0 ? "" : "flex-1"
            } ${
              theme === "dark"
                ? "bg-slate-800/90 border border-blue-700/30"
                : "bg-white border border-gray-200"
            }`}>
              <h3 className={`mb-4 text-sm font-semibold ${
                theme === "dark" ? "text-orange-300" : "text-orange-700"
              }`}>
                Ej planerade
              </h3>
              <div className={`space-y-2 ${unplannedBookings.length === 0 ? "min-h-0" : ""}`}>
                {unplannedBookings.length === 0 ? (
                  <p className={`text-xs ${
                    theme === "dark" ? "text-blue-200" : "text-gray-500"
                  }`}>
                    Inga jobb här just nu.
                  </p>
                ) : (
                  unplannedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      draggable
                      onDragStart={() => handleDragStart(booking.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleBookingClick(booking)}
                      className={`relative cursor-move rounded-lg p-2 text-xs shadow-sm transition-all hover:shadow-md border ${
                        theme === "dark"
                          ? draggedBookingId === booking.id
                            ? "bg-orange-700/50 opacity-50 border-orange-600/30"
                            : "bg-orange-600/20 text-orange-100 border-orange-600/30"
                          : draggedBookingId === booking.id
                            ? "bg-orange-200 opacity-50 border-orange-400"
                            : "bg-orange-100 text-orange-900 border-orange-300"
                      }`}
                      style={{
                        height: `${booking.durationHours * MINUTES_PER_HOUR}px`,
                      }}
                    >
                      <div className={`absolute top-2 right-2 font-medium ${
                        theme === "dark" ? "text-orange-300" : "text-orange-700"
                      }`}>
                        {booking.durationHours}h
                      </div>
                      <div className={`font-semibold pr-12 ${
                        theme === "dark" ? "text-orange-100" : "text-orange-900"
                      }`}>{booking.vehicleType}</div>
                      <div className={`truncate ${
                        theme === "dark" ? "text-orange-100" : "text-orange-800"
                      }`}>
                        {booking.action}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                theme === "dark"
                  ? "border-blue-700/50 bg-slate-800/90 text-blue-200 hover:bg-blue-900/30"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
              title={theme === "dark" ? "Växla till ljust läge" : "Växla till mörkt läge"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Ljust läge
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Mörkt läge
                </>
              )}
            </button>
            <button
              onClick={() => setCurrentMechanicId(null)}
              className={`flex w-full items-center justify-center rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                theme === "dark"
                  ? "border-blue-700/50 text-blue-200 hover:bg-blue-900/30"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              Logga ut
            </button>
          </div>

          {/* Week view */}
          <div className="flex-1 overflow-x-auto">
            {/* Theme-aware container with shadow */}
            <div className={`rounded-lg backdrop-blur-sm shadow-2xl overflow-hidden ${
              theme === "dark"
                ? "bg-slate-800/90 border border-blue-700/30"
                : "bg-white border border-gray-200"
            }`}>
              {/* Unified grid layout for day headers and calendar */}
              <div
                className="grid transition-all duration-500 ease-in-out"
                style={{
                  gridTemplateColumns: idagDayIndex >= 0
                    ? `60px ${weekDays
                        .map((_, index) =>
                          index === idagDayIndex
                            ? "minmax(250px, 2fr)"
                            : "minmax(120px, 1fr)"
                        )
                        .join(" ")}`
                    : "60px repeat(7, minmax(120px, 1fr))",
                }}
              >
                {/* Empty cell for time axis corner */}
                <div className={`border-b border-r ${
                  theme === "dark"
                    ? "border-blue-700/30 bg-slate-700/50"
                    : "border-gray-200 bg-gray-50"
                }`}></div>

                {/* Day headers aligned with columns */}
                {weekDays.map((day) => {
                  const isWorkday = isSelectedWorkday(day);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={`cursor-pointer border-b border-r text-center transition-all duration-500 ease-in-out p-3 ${
                        theme === "dark"
                          ? isWorkday
                            ? "border-blue-700/30 bg-blue-800/50 font-bold text-blue-200 border-t-[3px] border-t-blue-500"
                            : "border-blue-700/30 bg-slate-700/50 hover:bg-slate-600/50 text-white"
                          : isWorkday
                            ? "border-gray-200 bg-blue-100 font-bold text-blue-700 border-t-[3px] border-t-blue-600"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <div className={`text-xs font-medium uppercase ${
                        theme === "dark"
                          ? isWorkday ? "text-blue-200" : "text-blue-300"
                          : isWorkday ? "text-blue-700" : "text-gray-600"
                      }`}>
                        {format(day, "EEE", { locale: sv })}
                      </div>
                      <div className={`text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                        {format(day, "d", { locale: sv })}
                      </div>
                    </div>
                  );
                })}

                {/* Time axis column */}
                <div className={`flex flex-col border-r ${
                  theme === "dark"
                    ? "border-blue-700/30 bg-slate-700/50"
                    : "border-gray-200 bg-gray-50"
                }`}>
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className={`flex items-start justify-end border-b pr-2 pt-1 text-xs ${
                        theme === "dark"
                          ? "border-blue-700/20 text-blue-300"
                          : "border-gray-200 text-gray-500"
                      }`}
                      style={{ height: `${HOUR_HEIGHT_PX}px` }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>

                {/* Day columns with time slots */}
                {weekDays.map((day, dayIndex) => {
                  const dayStr = format(day, "yyyy-MM-dd");
                  const dayBookings = getBookingsForDay(day);
                  const isLastDay = dayIndex === weekDays.length - 1;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`relative ${
                        theme === "dark"
                          ? "bg-slate-700/30"
                          : "bg-white"
                      } ${isLastDay ? "" : theme === "dark" ? "border-r border-blue-700/20" : "border-r border-gray-200"}`}
                    >
                      {/* Hour grid lines */}
                      {timeSlots.map((hour) => {
                        const isHovered =
                          hoveredSlot?.day === dayStr &&
                          hoveredSlot?.hour === hour;
                        const isValid = isHovered && isValidDropZone(day, hour);
                        const isDragging = draggedBookingId !== null;
                        const draggedBooking = isDragging
                          ? bookings.find((b) => b.id === draggedBookingId)
                          : null;

                        return (
                          <div
                            key={hour}
                            onDragOver={(e) => handleDragOver(e, day, hour)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(day, hour)}
                            className={`relative border-b border-blue-700/10 transition-colors ${
                              isDragging
                                ? isHovered
                                  ? isValid
                                    ? "bg-green-900/30"
                                    : "bg-red-900/30"
                                  : "bg-slate-700/20"
                                : "hover:bg-slate-600/20"
                            }`}
                            style={{ height: `${HOUR_HEIGHT_PX}px` }}
                          >
                            {/* Drag preview: show placeholder for the full duration */}
                            {isDragging && isHovered && draggedBooking && (
                              <div
                                className={`absolute left-1 right-1 rounded-lg border-2 shadow-sm pointer-events-none opacity-75 ${
                                  theme === "dark"
                                    ? isValid
                                      ? "border-green-500 bg-green-900/40 text-green-100"
                                      : "border-red-500 bg-red-900/40 text-red-100"
                                    : isValid
                                      ? "border-green-500 bg-green-100 text-green-900"
                                      : "border-red-500 bg-red-100 text-red-900"
                                }`}
                                style={{
                                  top: `${BOOKING_MARGIN_PX / 2}px`,
                                  height: `${draggedBooking.durationHours * HOUR_HEIGHT_PX - BOOKING_MARGIN_PX}px`,
                                  zIndex: 10,
                                }}
                              >
                                <div className={`p-1 text-center text-xs font-medium ${
                                  theme === "dark"
                                    ? isValid ? "text-green-100" : "text-red-100"
                                    : isValid ? "text-green-900" : "text-red-900"
                                }`}>
                                  {isValid ? "Släpp här" : "Upptaget"}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Bookings rendered as absolute positioned blocks */}
                      {dayBookings.map((booking) => {
                        const startHour = booking.scheduledStartHour!;
                        const topPosition =
                          (startHour - WORK_START_HOUR) * HOUR_HEIGHT_PX;
                        const height =
                          booking.durationHours * HOUR_HEIGHT_PX -
                          BOOKING_MARGIN_PX;
                        const isDragging = draggedBookingId === booking.id;
                        const assignedMechanic = booking.mechanicId
                          ? mechanics.find((m) => m.id === booking.mechanicId)
                          : null;

                        return (
                          <div
                            key={booking.id}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleDragStart(booking.id);
                            }}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleBookingClick(booking)}
                            className={`absolute left-1 right-1 cursor-move rounded-lg p-2 text-xs shadow-md transition-all hover:shadow-lg flex flex-col ${getStatusColors(theme)[booking.status]} ${
                              isDragging ? "opacity-50" : ""
                            }`}
                            style={{
                              top: `${topPosition + BOOKING_MARGIN_PX / 2}px`,
                              height: `${height}px`,
                              zIndex: isDragging ? 1 : 5,
                            }}
                          >
                            <div className="flex-1">
                              <div className={`font-semibold ${
                                theme === "dark" ? "" : "text-gray-900"
                              }`}>
                                {booking.vehicleType}
                              </div>
                              <div className={`break-words leading-tight ${
                                theme === "dark" ? "" : "text-gray-800"
                              }`}>
                                {booking.action}
                              </div>
                            </div>
                            {assignedMechanic && (
                              <div className="mt-auto pt-1">
                                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                  theme === "dark"
                                    ? "bg-black/30 text-white"
                                    : "bg-white/90 text-gray-800"
                                }`}>
                                  {assignedMechanic.name}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
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

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showBookingDetails}
        onClose={handleCloseBookingDetails}
      />
    </div>
  );
}

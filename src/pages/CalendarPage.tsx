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

// Constants
const MINUTES_PER_HOUR = 60;
const MAX_ACTION_PREVIEW_LENGTH = 20;
const WORK_START_HOUR = 7;
const WORK_END_HOUR = 17;
const HOUR_HEIGHT_PX = 60;
const BOOKING_MARGIN_PX = 4;

// Status colors for booking cards
const statusColors: Record<BookingStatus, string> = {
  EJ_PLANERAD: "bg-orange-200 hover:bg-orange-300",
  PLANERAD: "bg-blue-200 hover:bg-blue-300",
  PAGAR: "bg-yellow-200 hover:bg-yellow-300",
  KLAR: "bg-green-200 hover:bg-green-300",
  HAMTAD: "bg-gray-200 hover:bg-gray-300",
};

export default function CalendarPage() {
  const {
    selectedWorkday,
    setSelectedWorkday,
    setCurrentMechanicId,
    bookings,
    updateBooking,
    showToast,
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
                      draggable
                      onDragStart={() => handleDragStart(booking.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleBookingClick(booking)}
                      className={`cursor-move rounded-lg p-2 text-xs shadow-sm transition-all hover:shadow-md ${
                        draggedBookingId === booking.id
                          ? "bg-orange-300 opacity-50"
                          : "bg-orange-200"
                      }`}
                      style={{
                        height: `${booking.durationHours * MINUTES_PER_HOUR}px`,
                      }}
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
            {/* White container with shadow */}
            <div className="rounded-lg bg-white shadow-md">
              {/* Unified grid layout for day headers and calendar */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "60px repeat(7, minmax(120px, 1fr))",
                }}
              >
                {/* Empty cell for time axis corner */}
                <div className="bg-white"></div>

                {/* Day headers aligned with columns */}
                {weekDays.map((day) => {
                  const isWorkday = isSelectedWorkday(day);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={`cursor-pointer border-b border-r border-gray-200 p-3 text-center transition ${
                        isWorkday
                          ? "bg-blue-50 font-bold text-blue-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xs font-medium uppercase text-gray-600">
                        {format(day, "EEE", { locale: sv })}
                      </div>
                      <div className="text-lg font-bold">
                        {format(day, "d", { locale: sv })}
                      </div>
                      {isWorkday && (
                        <div className="mt-1 text-xs font-semibold text-blue-600">
                          IDAG
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Time axis column */}
                <div className="flex flex-col border-r border-gray-200 bg-gray-50">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="flex items-start justify-end border-b border-gray-200 pr-2 pt-1 text-xs text-gray-500"
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
                      className={`relative bg-white ${isLastDay ? "" : "border-r border-gray-200"}`}
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
                            className={`relative border-b border-gray-100 transition-colors ${
                              isDragging
                                ? isHovered
                                  ? isValid
                                    ? "bg-green-50"
                                    : "bg-red-50"
                                  : "bg-gray-50"
                                : "hover:bg-gray-50"
                            }`}
                            style={{ height: `${HOUR_HEIGHT_PX}px` }}
                          >
                            {/* Drag preview: show placeholder for the full duration */}
                            {isDragging && isHovered && draggedBooking && (
                              <div
                                className={`absolute left-1 right-1 rounded-lg border-2 shadow-sm ${
                                  isValid
                                    ? "border-green-500 bg-green-100"
                                    : "border-red-500 bg-red-100"
                                } pointer-events-none opacity-75`}
                                style={{
                                  top: `${BOOKING_MARGIN_PX / 2}px`,
                                  height: `${draggedBooking.durationHours * HOUR_HEIGHT_PX - BOOKING_MARGIN_PX}px`,
                                  zIndex: 10,
                                }}
                              >
                                <div className="p-1 text-center text-xs font-medium">
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
                            className={`absolute left-1 right-1 cursor-move rounded-lg p-2 text-xs shadow-md transition-all hover:shadow-lg ${statusColors[booking.status]} ${
                              isDragging ? "opacity-50" : ""
                            }`}
                            style={{
                              top: `${topPosition + BOOKING_MARGIN_PX / 2}px`,
                              height: `${height}px`,
                              zIndex: isDragging ? 1 : 5,
                            }}
                          >
                            <div className="font-semibold">
                              {booking.vehicleType}
                            </div>
                            <div className="truncate">
                              {booking.action.substring(
                                0,
                                MAX_ACTION_PREVIEW_LENGTH,
                              )}
                            </div>
                            <div className="mt-1 text-xs opacity-75">
                              {startHour}:00 ({booking.durationHours}h)
                            </div>
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

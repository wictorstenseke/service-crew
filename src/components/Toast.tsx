// Toast notification component for user feedback
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "info" | "error" | "success";
  onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
        ? "bg-green-500"
        : "bg-blue-500";

  return (
    <div className="animate-fade-in">
      <div
        className={`${bgColor} rounded-lg px-6 py-4 text-white shadow-lg transition-all`}
        role="alert"
      >
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "10px",
          background: "#0f172a",
          color: "#fff",
          fontSize: "14px",
        },
      }}
    />
  );
}
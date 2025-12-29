import React from "react";
import ToastShelf from "../ToastShelf";

export const ToastContext = React.createContext();

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  function popToast(message, variant) {
    const newToast = {
      id: crypto.randomUUID(),
      message,
      variant,
      handleClose: () => dismissToast(newToast.id),
    };
    setToasts([...toasts, newToast]);
  }

  function dismissToast(id) {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }

  function dismissAllToasts() {
    setToasts([]);
  }

  // Listen for the escape key and dismiss all toasts.
  React.useEffect(() => {
    // Don't listen for the escape key, if there are no toasts.
    if (toasts.length === 0) {
      return;
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        dismissAllToasts();
      }
    }

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, popToast, dismissToast }}>
      {children}
      <ToastShelf />
    </ToastContext.Provider>
  );
}

export default ToastProvider;

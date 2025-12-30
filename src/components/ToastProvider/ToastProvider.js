import React from "react";
import ToastShelf from "../ToastShelf";
import useKeys from "../../hooks/useKeys";

export const ToastContext = React.createContext();

const DISMISS_KEYS = ["Escape"];

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

  const dismissAllToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  // Dismiss all toasts when the escape key is pressed.
  useKeys({
    keys: DISMISS_KEYS,
    callback: dismissAllToasts,
    enabled: toasts.length > 0,
  });

  return (
    <ToastContext.Provider value={{ toasts, popToast, dismissToast }}>
      {children}
      <ToastShelf />
    </ToastContext.Provider>
  );
}

export default ToastProvider;

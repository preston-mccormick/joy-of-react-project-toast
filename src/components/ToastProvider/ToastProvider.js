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

  return (
    <ToastContext.Provider value={{ toasts, popToast, dismissToast }}>
      {children}
      <ToastShelf />
    </ToastContext.Provider>
  );
}

export default ToastProvider;

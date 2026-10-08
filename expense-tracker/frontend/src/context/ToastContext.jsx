import { useState, useCallback } from 'react';
import { ToastContext } from './toastContextDef';
import ToastContainer from '../component/ui/Toast';

let toastCount = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration }) => {
      const id = ++toastCount;
      const defaultDuration = type === 'error' ? 6000 : 4000;
      const autoDismissDuration = duration !== undefined ? duration : defaultDuration;

      const newToast = { id, type, title, message };
      setToasts((prev) => [...prev.slice(-2), newToast]); // Keep max 3 toasts

      if (autoDismissDuration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, autoDismissDuration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', message, title }),
    error: (message, title = 'Error') => addToast({ type: 'error', message, title }),
    info: (message, title = 'Info') => addToast({ type: 'info', message, title }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', message, title }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", actions = null) => {
    const id = Math.random().toString(36).substring(7);
    const toast = { id, message, type, actions };

    setToasts((prev) => [...prev, toast]);

    // Elimină automat după 5 secunde (mai mult dacă are acțiuni)
    const timeout = actions ? 5000 : 3000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast trebuie folosit în interiorul ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 inset-x-0 mx-auto sm:inset-x-auto sm:right-6 sm:left-auto z-50 flex flex-col gap-3 pointer-events-none items-center sm:items-end px-4 sm:px-0 max-w-sm sm:max-w-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  return (
    <div
      className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-lg transition-all duration-300 animate-[slideIn_0.3s_ease-out] max-w-sm"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="flex-1 text-sm font-medium text-zinc-900">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-zinc-400 hover:text-zinc-600"
          aria-label="Închide"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {toast.actions && (
        <div className="flex gap-2 pt-1">
          {toast.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onRemove(toast.id);
              }}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                action.primary
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


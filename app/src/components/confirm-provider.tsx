"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Branded replacement for window.confirm / window.alert.
 *
 * Use via the {@link useConfirm} hook from any client component:
 *
 *     const confirm = useConfirm();
 *     async function handleDelete() {
 *       const ok = await confirm({
 *         title: "Delete invoice?",
 *         message: "This permanently removes the invoice.",
 *         confirmText: "Delete",
 *         destructive: true,
 *       });
 *       if (!ok) return;
 *       // ...
 *     }
 *
 * For info-only dialogs (no Cancel) pass `hideCancel: true`. The hook
 * still returns a Promise<boolean> (always true on confirm), so call
 * sites can `await` to know the user dismissed it.
 *
 * One ConfirmProvider must be mounted somewhere above the call site
 * — it lives in the authenticated app layout, so every page inside
 * (app)/* has access automatically.
 */

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  hideCancel?: boolean;
};

type ConfirmState = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

const ConfirmContext = createContext<
  ((opts: ConfirmOptions) => Promise<boolean>) | null
>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);

  const close = useCallback(
    (value: boolean) => {
      if (state) {
        state.resolve(value);
        setState(null);
      }
    },
    [state]
  );

  // Keyboard support: Escape cancels, Enter confirms. Standard dialog UX.
  useEffect(() => {
    if (!state) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close(false);
      else if (e.key === "Enter") close(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => close(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl border border-[#E2EBE4] shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {state.title && (
              <h3 className="font-semibold text-[#1A2E22] text-base mb-2">
                {state.title}
              </h3>
            )}
            <p className="text-sm text-[#3D5C48] whitespace-pre-line">
              {state.message}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              {!state.hideCancel && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-[#E2EBE4] bg-white text-[#1A2E22] hover:bg-[#F7F9F7] transition-colors"
                >
                  {state.cancelText ?? "Cancel"}
                </button>
              )}
              <button
                type="button"
                onClick={() => close(true)}
                autoFocus
                className={
                  state.destructive
                    ? "px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                    : "px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
                }
              >
                {state.confirmText ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error(
      "useConfirm must be used inside a <ConfirmProvider>. The (app) layout mounts one — make sure your component is inside that route group."
    );
  }
  return ctx;
}

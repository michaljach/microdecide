import { useEffect, useId, useRef } from "react";

/** React renders confirmation UI; native dialog supplies focus trapping and Escape handling. */
export function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby={title} onCancel={(event) => { event.preventDefault(); onCancel(); }}>
      <p id={title}>{message}</p>
      <div className="controls">
        <button className="secondary" onClick={onCancel} autoFocus>Cancel</button>
        <button onClick={onConfirm}>Delete</button>
      </div>
    </dialog>
  );
}

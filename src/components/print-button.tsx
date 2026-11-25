"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded border border-gold px-4 py-2 text-gold hover:bg-gold/10 transition-colors"
    >
      印刷
    </button>
  );
}

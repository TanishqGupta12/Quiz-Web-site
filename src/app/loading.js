/** Server-only fallback so a spinner still shows if client bundles are slow; does not import MUI. */
export default function Loading() {
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        aria-label="Loading"
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e5e7eb",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "quiz-spin 0.75s linear infinite",
        }}
      />
      <style>{`@keyframes quiz-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

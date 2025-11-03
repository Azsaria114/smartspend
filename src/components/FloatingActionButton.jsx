export default function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="floating-button text-white text-2xl"
      title="Add Expense"
      aria-label="Add Expense"
    >
      <span className="text-3xl">+</span>
    </button>
  );
}


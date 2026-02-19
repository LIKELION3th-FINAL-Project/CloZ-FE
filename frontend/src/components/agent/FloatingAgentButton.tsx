interface FloatingAgentButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingAgentButton({ onClick, isOpen }: FloatingAgentButtonProps) {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full border border-black bg-white text-black flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all duration-300 text-xs font-medium tracking-wide"
    >
      Agent
    </button>
  );
}

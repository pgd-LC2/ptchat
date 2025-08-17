import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function AppItem({ icon, label, active, onClick }: Props) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-base font-normal transition-colors ${
      }
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-base font-normal transition-colors ${
        active 
          ? 'bg-zinc-100 text-black' 
          : 'text-black hover:bg-zinc-50'
      }`}
      onClick={onClick}
    >
      <span className="text-black">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
}
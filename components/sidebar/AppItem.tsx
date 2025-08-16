import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export default function AppItem({ icon, label, active }: Props) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
        active 
          ? 'bg-zinc-100 text-black' 
          : 'text-black hover:bg-zinc-50'
      }`}
    >
      <span className="text-black/60">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
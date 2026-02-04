"use client";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none group py-2">
      <span className="text-sm text-[#E0E0E0] group-hover:text-white transition-colors">
        {label}
      </span>

      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {/* Trilho do Switch */}
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-[#C0A040]" : "bg-[#333333] border border-[#555]"
          }`}
        ></div>
        {/* Bolinha do Switch */}
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
}
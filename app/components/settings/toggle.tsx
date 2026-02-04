"use client";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function Toggle({
  label,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm text-[#E0E0E0]">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="
          h-5 w-5 
          appearance-none 
          border border-[#555] 
          rounded 
          bg-[#2A2A2A]
          checked:bg-[#C0A040]
          checked:border-[#C0A040]
          transition
          cursor-pointer
        "
      />
    </label>
  );
}

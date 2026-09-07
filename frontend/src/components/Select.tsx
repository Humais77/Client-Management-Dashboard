import type {
  SelectHTMLAttributes,
} from "react";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export default function Select({
  label,
  error,
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <select
        id={id}
        {...props}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 ${
          error
            ? "border-red-500"
            : "border-slate-300"
        }`}
      >
        {children}
      </select>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
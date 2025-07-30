import React from "react";

interface InputTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  multiline?: boolean;
  rows?: number;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  id,
  multiline = false,
  rows = 3,
}) => {
  const inputBaseClasses =
    "block w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-[var(--foreground)] bg-[var(--background)]";
  const inputNormalClasses =
    "border-[var(--brand-off-white)] hover:border-[var(--brand-light-brown)] focus:border-[var(--brand-brown)] focus:ring-[var(--brand-light-brown)]";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || label}
          className="block text-sm font-medium text-[var(--brand-light-brown)] mb-2"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={id || label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputBaseClasses} ${inputNormalClasses}`}
        />
      ) : (
        <input
          type="text"
          id={id || label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputBaseClasses} ${inputNormalClasses}`}
        />
      )}
      {/* Espacio reservado para mensajes de error/ayuda si se necesitan */}
      {/* <p className="mt-1 text-xs text-[var(--brand-light-brown)]">
        Mensaje de ayuda o error
      </p> */}
    </div>
  );
};

export default InputText;

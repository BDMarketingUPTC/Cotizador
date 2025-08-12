import React, { Dispatch, SetStateAction } from "react";

interface InputTextProps {
  label: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  className?: string;
  id?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean; // ✨ Propiedad 'disabled' agregada
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
  disabled = false, // ✨ La prop 'disabled' es recibida y tiene un valor por defecto
}) => {
  const inputBaseClasses =
    "block w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-[var(--foreground)] bg-[var(--background)]";

  // Clases que cambian si el input está deshabilitado
  const inputStateClasses = disabled
    ? "border-transparent text-[var(--brand-light-brown)] cursor-not-allowed"
    : "border-[var(--brand-off-white)] hover:border-[var(--brand-light-brown)] focus:border-[var(--brand-brown)] focus:ring-[var(--brand-light-brown)]";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || label}
          className="mb-2 block text-sm font-medium text-[var(--brand-light-brown)]"
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
          disabled={disabled} // ✨ Atributo 'disabled' usado en el textarea
          className={`${inputBaseClasses} ${inputStateClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          id={id || label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled} // ✨ Atributo 'disabled' usado en el input
          className={`${inputBaseClasses} ${inputStateClasses}`}
        />
      )}
    </div>
  );
};

export default InputText;

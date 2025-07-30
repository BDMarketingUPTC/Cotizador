// components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // Cambiado para recibir el evento del ratón, como lo esperaba InitialPrompt.tsx
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props // Captura cualquier otra prop nativa del botón (type, name, etc.)
}) => {
  // Clases base para todos los botones
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  // Variantes de botón
  const variantClasses = {
    primary: `
      bg-[var(--brand-brown)] text-white
      hover:bg-[var(--brand-light-brown)] hover:shadow-md
      focus:ring-[var(--brand-brown)] focus:ring-offset-background
      active:scale-[0.98]
    `,
    secondary: `
      bg-[var(--brand-off-white)] text-[var(--brand-brown)]
      hover:bg-gray-100 hover:shadow-sm
      focus:ring-[var(--brand-light-brown)] focus:ring-offset-background
      border border-[var(--brand-light-brown)]
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent text-[var(--brand-brown)]
      hover:bg-[var(--brand-off-white)] hover:shadow-sm
      focus:ring-[var(--brand-light-brown)] focus:ring-offset-background
      border border-[var(--brand-brown)]
      active:scale-[0.98]
    `,
  };

  // Tamaños de botón
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Estado disabled: aplicando el estilo `opacity` en lugar de una clase `bg-gray-200` fija
  // para que el color base de la variante deshabilitada sea el que corresponda.
  const disabledOverlayClasses = disabled
    ? "opacity-60 cursor-not-allowed"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabledOverlayClasses}
        ${className}
      `}
      {...props} // Pasa todas las demás props al botón (como `type="submit"`)
    >
      {children}
    </button>
  );
};

export default Button;

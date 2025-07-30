import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "light" | "dark";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
  size = "md",
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  const colorClasses = {
    primary:
      "border-t-[var(--brand-brown)] border-r-transparent border-b-transparent border-l-transparent",
    light:
      "border-t-[var(--brand-off-white)] border-r-transparent border-b-transparent border-l-transparent",
    dark: "border-t-[var(--brand-dark)] border-r-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label="Cargando..."
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

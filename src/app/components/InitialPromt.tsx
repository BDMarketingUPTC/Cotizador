// components/InitialPrompt.tsx
import React, { useState } from "react";
import InputText from "./InputText";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

interface InitialPromptProps {
  onPromptSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const InitialPrompt: React.FC<InitialPromptProps> = ({
  onPromptSubmit,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPromptSubmit(prompt);
    }
  };

  return (
    <div className="w-full bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--brand-off-white)]">
      {/* Encabezado con acento de marca */}
      <div className="mb-8 text-center">
        <div className="w-16 h-1 bg-[var(--brand-brown)] mx-auto mb-4 rounded-full"></div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Generador de Contratos
        </h1>
        <h2 className="text-xl text-[var(--brand-light-brown)] font-medium">
          Tegel Konst
        </h2>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-[var(--brand-light-brown)] mb-2"
          >
            Describe tu proyecto en detalle
          </label>
          <InputText
            id="project-description"
            label="" // Se añade la prop label, aunque vacía para evitar duplicidad visual
            value={prompt}
            onChange={setPrompt}
            placeholder="Ej: Necesito construir un muro de contención de 3 metros de largo en el jardín trasero, usando ladrillo visto..."
            className="min-h-[120px]"
            multiline
          />
          <p className="mt-2 text-xs text-[var(--brand-light-brown)]">
            Cuanto más detallado sea tu requerimiento, más precisa será nuestra
            cotización.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3 transition-all duration-200"
          variant="primary"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span>Procesando tu solicitud...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                  clipRule="evenodd"
                />
              </svg>
              Generar Cotización Inicial
            </span>
          )}
        </Button>
      </div>

      {/* Pie de página informativo */}
      <div className="mt-8 pt-6 border-t border-[var(--brand-off-white)]">
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[var(--brand-brown)] mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-[var(--brand-dark)]">
              Respuesta en menos de 1 minuto
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[var(--brand-brown)] mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-[var(--brand-dark)]">
              Datos protegidos y seguros
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPrompt;

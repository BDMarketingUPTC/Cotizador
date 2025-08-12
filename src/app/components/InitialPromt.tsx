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
    <div className="relative rounded-xl bg-[var(--background)] p-8 shadow-lg transition-all duration-300 mx-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[var(--brand-brown)]"></div>
        <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">
          Generador de Contratos
        </h1>
        <h2 className="text-xl font-medium text-[var(--brand-light-brown)]">
          Tegel Konst
        </h2>
      </div>

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[var(--background)]/80 backdrop-blur-md">
          <LoadingSpinner
            style="futuristic"
            size="lg"
            color="ai-gradient"
            withText="Generando contrato..."
            textPosition="bottom"
            className="flex-col text-center"
          />
        </div>
      )}

      {/* Formulario */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-medium text-[var(--brand-light-brown)]"
          >
            Describe tu proyecto en detalle
          </label>
          <InputText
            id="project-description"
            label=""
            value={prompt}
            onChange={setPrompt}
            placeholder="Ej: Necesito construir un muro de contención de 3 metros de largo en el jardín trasero, usando ladrillo visto..."
            className="min-h-[120px]"
            multiline
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-[var(--brand-light-brown)]">
            Cuanto más detallado sea tu requerimiento, más preciso será nuestro
            contrato.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3 transition-all duration-200"
          variant="primary"
        >
          Generar Contrato
        </Button>
      </div>

      {/* Pie de página informativo */}
      <div className="mt-8 border-t border-[var(--brand-off-white)] pt-6">
        <div className="flex flex-col justify-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[var(--brand-brown)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-sm text-[var(--brand-dark)]">
              Respuesta en menos de 1 minuto
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[var(--brand-brown)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-sm text-[var(--brand-dark)]">
              Datos protegidos y seguros
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPrompt;

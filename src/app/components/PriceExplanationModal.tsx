import React, { useState } from "react";
import Button from "./Button";
import InputText from "./InputText";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

interface PriceExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanationText: string;
  onSuggestionSubmit: (suggestion: string) => void;
  isLoading: boolean;
}

const PriceExplanationModal: React.FC<PriceExplanationModalProps> = ({
  isOpen,
  onClose,
  explanationText,
  onSuggestionSubmit,
  isLoading,
}) => {
  const [suggestion, setSuggestion] = useState<string>("");

  const handleSubmitSuggestion = () => {
    if (suggestion.trim()) {
      onSuggestionSubmit(suggestion);
      setSuggestion("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--brand-dark)]/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[var(--background)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--brand-off-white)]">
        {/* Encabezado */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--brand-off-white)] bg-[var(--brand-off-white)]">
          <h2 className="text-xl font-bold text-[var(--brand-brown)]">
            Explicación Detallada del Presupuesto
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--brand-light-brown)] hover:text-[var(--brand-brown)] transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="bg-[var(--brand-off-white)] p-5 rounded-lg border border-[var(--brand-off-white)]">
            <h3 className="text-sm font-semibold text-[var(--brand-light-brown)] mb-3">
              DESGLOSE DEL CÁLCULO
            </h3>
            <div className="prose prose-sm text-[var(--foreground)] whitespace-pre-wrap">
              {explanationText}
            </div>
          </div>

          <div className="border-t border-[var(--brand-off-white)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--brand-light-brown)] mb-3">
              ¿DESEA SUGERIR ALGÚN AJUSTE?
            </h3>
            <InputText
              label=""
              value={suggestion}
              onChange={setSuggestion}
              placeholder="Ej: Considerar un descuento por volumen, ajustar materiales o añadir costos adicionales..."
              multiline
              rows={3}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center p-6 border-t border-[var(--brand-off-white)] bg-[var(--brand-off-white)]">
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
            disabled={isLoading}
          >
            Cerrar
          </Button>
          <Button
            onClick={handleSubmitSuggestion}
            variant="primary"
            size="md"
            disabled={isLoading || !suggestion.trim()}
            className="min-w-[180px]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="light" />
                Enviando...
              </span>
            ) : (
              "Enviar Sugerencia"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceExplanationModal;

import React, { useState, useEffect } from "react";
import { Question, Answers } from "../utils/types"; // Asegúrate de que QuestionType esté exportado si lo usas
import InputText from "./InputText";
import SelectYesNo from "./SelectYesNo";
import StepCounter from "./StepCounter";
import Dropdown from "./Dropdown";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DynamicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSubmit: (answers: Answers) => void;
  isLoading: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const DynamicFormModal: React.FC<DynamicFormModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSubmit,
  isLoading,
  currentStep = 1,
  totalSteps = 1,
}) => {
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    if (isOpen && questions.length > 0) {
      const initialAnswers: Answers = {};
      questions.forEach((q) => {
        if (q.defaultValue !== undefined) {
          initialAnswers[q.id] = q.defaultValue;
        } else {
          // Asignación de valores iniciales basada en el tipo de pregunta
          switch (q.type) {
            case "text":
              initialAnswers[q.id] = "";
              break;
            case "yesNo":
              initialAnswers[q.id] = false;
              break;
            case "counter":
              initialAnswers[q.id] = q.min || 0;
              break;
            case "dropdown":
              if (q.options && q.options.length > 0) {
                initialAnswers[q.id] = q.options[0];
              } else {
                initialAnswers[q.id] = null; // O un valor por defecto adecuado si no hay opciones
              }
              break;
            default:
              initialAnswers[q.id] = undefined; // O un valor nulo para tipos no reconocidos
          }
        }
      });
      setAnswers(initialAnswers);
    }
  }, [isOpen, questions]);

  // Tipar `value` para que sea más específico que `any`
  const handleAnswerChange = (
    id: string,
    value: string | boolean | number | string[] | null
  ) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--brand-dark)]/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[var(--background)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--brand-off-white)]">
        {/* Encabezado */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--brand-off-white)] bg-[var(--brand-off-white)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--brand-brown)]">
              Detalles del Proyecto
            </h2>
            {totalSteps > 1 && (
              <p className="text-sm text-[var(--brand-light-brown)] mt-1">
                Paso {currentStep} de {totalSteps}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--brand-light-brown)] hover:text-[var(--brand-brown)] transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido del formulario */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="border-b border-[var(--brand-off-white)] pb-6 last:border-b-0"
              >
                {q.type === "text" && (
                  <InputText
                    label={q.label}
                    value={(answers[q.id] as string) || ""} // Casteo explícito a string
                    onChange={(val) => handleAnswerChange(q.id, val as string)}
                    placeholder={q.placeholder}
                  />
                )}
                {q.type === "yesNo" && (
                  <SelectYesNo
                    label={q.label}
                    value={(answers[q.id] as boolean) || false} // Casteo explícito a boolean
                    onChange={(val) => handleAnswerChange(q.id, val)}
                  />
                )}
                {q.type === "counter" && (
                  <StepCounter
                    label={q.label}
                    value={(answers[q.id] as number) || q.min || 0} // Casteo explícito a number
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    unit={q.unit}
                    min={q.min}
                    max={q.max}
                  />
                )}
                {q.type === "dropdown" && q.options && (
                  <Dropdown
                    label={q.label}
                    options={q.options}
                    // Casteo explícito, asegurando que el valor sea uno de los elementos de `options`
                    value={(answers[q.id] as string) || q.options[0]}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pie de página con acciones */}
        <div className="flex justify-between items-center p-6 border-t border-[var(--brand-off-white)] bg-[var(--brand-off-white)]">
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="md"
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Procesando...
              </div>
            ) : (
              `Continuar ${totalSteps > 1 ? `(Paso ${currentStep})` : ""}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;

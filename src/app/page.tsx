"use client";

import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import InitialPrompt from "./components/InitialPromt";
import DynamicFormModal from "./components/DynamicFormModal";
import ContractDisplay from "./components/ContractDisplay";
import PriceExplanationModal from "./components/PriceExplanationModal";
import { generateQuestions, generateContract } from "./services/geminiService";
import {
  Question,
  Answers,
  ContractResponse,
  ContractData,
} from "./utils/types";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const [initialPrompt, setInitialPrompt] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({}); // La advertencia aquí es porque 'answers' se usa indirectamente
  const [contractResponse, setContractResponse] =
    useState<ContractResponse | null>(null);
  const [parsedContractData, setParsedContractData] =
    useState<ContractData | null>(null);
  const [showDynamicFormModal, setShowDynamicFormModal] =
    useState<boolean>(false);
  const [showPriceExplanationModal, setShowPriceExplanationModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (contractResponse && contractResponse.contract) {
      if (typeof contractResponse.contract === "string") {
        try {
          setParsedContractData(JSON.parse(contractResponse.contract));
        } catch (e: unknown) {
          // Cambiado de 'any' a 'unknown'
          console.error("Error al parsear el JSON del contrato:", e);
          // Verificar si 'e' es una instancia de Error para acceder a 'message'
          setError(
            e instanceof Error
              ? `Error al procesar los datos de la cotización: ${e.message}. Por favor, inténtalo de nuevo.`
              : "Error al procesar los datos de la cotización. Por favor, inténtalo de nuevo."
          );
          setParsedContractData(null);
        }
      } else {
        setParsedContractData(contractResponse.contract);
      }
    } else {
      setParsedContractData(null);
    }
  }, [contractResponse]);

  const handleInitialPromptSubmit = async (prompt: string) => {
    setInitialPrompt(prompt);
    setIsLoading(true);
    setError(null);
    setCurrentStep(1);
    try {
      const generatedQuestions = await generateQuestions(prompt);
      setQuestions(generatedQuestions);
      setShowDynamicFormModal(true);
    } catch (err: unknown) {
      // Cambiado de 'any' a 'unknown'
      console.error("Error al generar preguntas:", err);
      // Verificar si 'err' es una instancia de Error para acceder a 'message'
      setError(
        err instanceof Error
          ? err.message
          : "Error al generar preguntas. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicFormSubmit = async (submittedAnswers: Answers) => {
    setAnswers(submittedAnswers); // 'answers' se usa aquí al ser pasado a generateContract
    setShowDynamicFormModal(false);
    setIsLoading(true);
    setError(null);
    setCurrentStep(2);
    try {
      const response = await generateContract(initialPrompt, submittedAnswers);
      setContractResponse(response);
    } catch (err: unknown) {
      // Cambiado de 'any' a 'unknown'
      console.error("Error al generar cotización:", err);
      // Verificar si 'err' es una instancia de Error para acceder a 'message'
      setError(
        err instanceof Error
          ? err.message
          : "Error al generar la cotización. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPriceExplanation = () => {
    setShowPriceExplanationModal(true);
  };

  const handleSuggestionSubmit = (suggestion: string) => {
    console.log("Sugerencia del usuario:", suggestion);
    setShowPriceExplanationModal(false);
  };

  const handleResetFlow = () => {
    setInitialPrompt("");
    setQuestions([]);
    setAnswers({});
    setContractResponse(null);
    setParsedContractData(null);
    setError(null);
    setCurrentStep(1);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col">
        {/* Header de progreso */}
        {!parsedContractData && (
          <div className="w-full bg-[var(--brand-off-white)] p-4 mb-8 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 1
                      ? "bg-[var(--brand-brown)] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= 1
                      ? "font-medium text-[var(--brand-brown)]"
                      : "text-gray-500"
                  }`}
                >
                  Describir proyecto
                </span>
              </div>

              <div className="h-px flex-1 bg-gray-300 mx-2"></div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 2
                      ? "bg-[var(--brand-brown)] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= 2
                      ? "font-medium text-[var(--brand-brown)]"
                      : "text-gray-500"
                  }`}
                >
                  Detalles
                </span>
              </div>

              <div className="h-px flex-1 bg-gray-300 mx-2"></div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 3
                      ? "bg-[var(--brand-brown)] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= 3
                      ? "font-medium text-[var(--brand-brown)]"
                      : "text-gray-500"
                  }`}
                >
                  Cotización
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {!parsedContractData ? (
            <InitialPrompt
              onPromptSubmit={handleInitialPromptSubmit}
              isLoading={isLoading}
            />
          ) : (
            <div className="w-full">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleResetFlow}
                  className="flex items-center text-[var(--brand-off-white)] hover:text-[var(--brand-brown)] transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm">
                    {" "}
                    <b>Nueva cotización</b>
                  </span>
                </button>
              </div>
              <ContractDisplay
                contractData={parsedContractData}
                onShowPriceExplanation={handleShowPriceExplanation}
              />
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md w-full">
              <div className="flex items-center text-red-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Error</h3>
              </div>
              <p className="mt-2 text-sm text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>

      <DynamicFormModal
        isOpen={showDynamicFormModal}
        onClose={() => setShowDynamicFormModal(false)}
        questions={questions}
        onSubmit={handleDynamicFormSubmit}
        isLoading={isLoading}
        currentStep={1}
        totalSteps={2}
      />

      {contractResponse && (
        <PriceExplanationModal
          isOpen={showPriceExplanationModal}
          onClose={() => setShowPriceExplanationModal(false)}
          explanationText={contractResponse.priceExplanation}
          onSuggestionSubmit={handleSuggestionSubmit}
          isLoading={isLoading}
        />
      )}
    </Layout>
  );
}

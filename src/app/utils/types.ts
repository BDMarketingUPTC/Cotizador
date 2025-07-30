// utils/types.ts

/**
 * Define los tipos de preguntas que la IA puede generar.
 */
export type QuestionType = 'text' | 'yesNo' | 'counter' | 'dropdown';

/**
 * Interfaz para una pregunta generada por la IA.
 */
export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string; // Para InputText
  options?: string[]; // Para Dropdown
  unit?: string; // Para StepCounter (ej. "m²")
  min?: number; // Para StepCounter
  max?: number; // Para StepCounter
  // defaultValue puede ser string, boolean, number, o incluso un array de strings si tu dropdown es multi-select
  defaultValue?: string | boolean | number | string[] | null;
}

/**
 * Interfaz para las respuestas del formulario dinámico.
 * Las respuestas pueden ser string, boolean, number, o un array de strings.
 * También pueden ser null o undefined si no se han establecido.
 */
export interface Answers {
  [key: string]: string | boolean | number | string[] | null | undefined;
}

/**
 * Interfaz para un servicio/ítem dentro de la cotización.
 */
export interface ServiceItem {
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  reason: string;
}

/**
 * Interfaz para los datos estructurados de la cotización.
 */
export interface ContractData {
  clientName: string;
  quoteNumber: string;
  description: string;
  services: ServiceItem[];
  subtotalAmount: number;
  ivaPercentage: number;
  ivaAmount: number;
  totalAmount: number;
  notes: string;
}

/**
 * Interfaz para la respuesta de la IA al generar el contrato (cotización).
 * La propiedad 'contract' ahora es de tipo ContractData.
 */
export interface ContractResponse {
  contract: ContractData; // Cambiado a ContractData
  priceExplanation: string;
}
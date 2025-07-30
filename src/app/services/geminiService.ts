// services/geminiService.ts

import { Question, ContractResponse } from '../utils/types';

// Función auxiliar para manejar reintentos con backoff exponencial
async function fetchWithExponentialBackoff(
  url: string,
  options: RequestInit,
  retries: number = 5,
  delay: number = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) { // Too Many Requests
        console.warn(`Demasiadas solicitudes. Reintentando en ${delay / 1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Duplicar el retraso
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }
      return response;
    } catch (error) {
      if (i < retries - 1) {
        console.error(`Error en la solicitud (intento ${i + 1}/${retries}):`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Número máximo de reintentos alcanzado');
}

/**
 * Simula la llamada a la API de Gemini para generar preguntas.
 * En un entorno real, esto llamaría a un endpoint de tu backend
 * que a su vez interactuaría con la API de Gemini.
 *
 * @param prompt El texto inicial del usuario describiendo el trabajo.
 * @returns Una promesa que resuelve con un array de objetos Question.
 */
export async function generateQuestions(prompt: string): Promise<Question[]> {
  console.log('Generando preguntas para el prompt:', prompt);

  // Define el payload para la llamada a la API de Gemini
  const chatHistory = [{ role: "user", parts: [{ text: `Analiza el siguiente prompt de un trabajo de albañilería (contexto colombiano, Duitama, Boyacá) y genera una lista de preguntas en formato JSON para obtener la información necesaria para calcular una cotización detallada. Incluye el 'id', 'type' (text, yesNo, counter, dropdown), 'label', y propiedades adicionales como 'placeholder', 'options', 'unit', 'min', 'max', 'defaultValue' según el tipo. Asegúrate de que las preguntas sean relevantes para el cálculo preciso del precio y los detalles específicos de la obra.

  Ejemplo de formato de salida JSON:
  [
    { "id": "area", "type": "counter", "label": "¿Cuántos metros cuadrados tiene la pared a intervenir?", "unit": "m²", "min": 1, "defaultValue": 10 },
    { "id": "paintType", "type": "dropdown", "label": "¿Qué tipo de acabado se requiere (pintura, estuco, pañete)?", "options": ["Pintura", "Estuco", "Pañete"], "defaultValue": "Pintura" },
    { "id": "prepNeeded", "type": "yesNo", "label": "¿Se necesita demolición o preparación previa de la superficie?", "defaultValue": false }
  ]

  Prompt del usuario: "${prompt}"` }] }];

  const payload = {
    contents: chatHistory,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            "id": { "type": "STRING" },
            "type": { "type": "STRING", "enum": ["text", "yesNo", "counter", "dropdown"] },
            "label": { "type": "STRING" },
            "placeholder": { "type": "STRING" },
            "options": { "type": "ARRAY", "items": { "type": "STRING" } },
            "unit": { "type": "STRING" },
            "min": { "type": "NUMBER" },
            "max": { "type": "NUMBER" },
            "defaultValue": { "type": "STRING" } // Puede ser string, boolean o number, lo manejaremos en la app
          },
          required: ["id", "type", "label"]
        }
      }
    }
  };

  // Accede a la API Key desde las variables de entorno de Next.js
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('La variable de entorno NEXT_PUBLIC_GOOGLE_AI_API_KEY no está definida.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetchWithExponentialBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text;
      // Asegurarse de que el JSON sea parseable, a veces Gemini puede devolver texto adicional
      const parsedJson = JSON.parse(jsonString);
      return parsedJson as Question[];
    } else {
      console.error('Estructura de respuesta inesperada de Gemini para preguntas:', result);
      throw new Error('No se pudieron generar las preguntas. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al llamar a la API de Gemini para generar preguntas:', error);
    throw new Error('Error al conectar con la IA para generar preguntas. Por favor, verifica tu conexión o inténtalo más tarde.');
  }
}

/**
 * Simula la llamada a la API de Gemini para generar la cotización y la explicación del precio.
 * Se mantiene el nombre 'generateContract' para compatibilidad con otros componentes.
 * La IA ahora devuelve datos estructurados para la cotización y una explicación.
 *
 * @param initialPrompt El prompt inicial del usuario.
 * @param answers Las respuestas del formulario dinámico.
 * @returns Una promesa que resuelve con un objeto ContractResponse.
 */
export async function generateContract(
  initialPrompt: string,
  answers: Record<string, string | boolean | number | string[] | null | undefined> // ¡Tipo corregido aquí!
): Promise<ContractResponse> {
  console.log('Generando datos de cotización (usando generateContract) para el prompt:', initialPrompt, 'y respuestas:', answers);

  const formattedAnswers = Object.entries(answers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // Ajustamos la fecha para que se base en la fecha actual del servidor al momento de la generación
  // Para Duitama, Boyacá, Colombia
  const currentDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' });

  const chatHistory = [{ role: "user", parts: [{ text: `Basado en el siguiente trabajo de albañilería y la información adicional proporcionada, genera los DATOS ESTRUCTURADOS para una cotización de servicios formal y una explicación detallada de cómo se calculó el precio.
  Estamos en un contexto Colombiano, específicamente en Duitama, Boyacá. Los costos deben estar en pesos colombianos (COP). La fecha actual es ${currentDate}.

  La cotización debe tener un desglose de costos en forma de tabla. Quiero los datos JSON con las siguientes claves:
  - "clientName": Nombre del cliente (si es inferible del prompt o respuestas, si no "Cliente").
  - "quoteNumber": Un número de cotización (ej. "COT-2025-001").
  - "description": Una breve descripción general del trabajo.
  - "services": Un array de objetos, donde cada objeto representa un servicio/ítem:
    - "item": Nombre del servicio (ej. "Mano de obra para estucado", "Materiales - Cemento").
    - "unit": Unidad (ej. "m²", "kg", "día", "global").
    - "quantity": Cantidad.
    - "unitPrice": Precio unitario en COP.
    - "subtotal": Cantidad * Precio Unitario.
    - "reason": Una explicación persuasiva del costo y la necesidad del servicio.
  - "subtotalAmount": Suma de todos los subtotales de los servicios.
  - "ivaPercentage": Porcentaje de IVA (ej. 19 para Colombia, si aplica, si no 0).
  - "ivaAmount": Monto del IVA calculado.
  - "totalAmount": Suma de subtotal + IVA.
  - "notes": Un texto breve final para cualquier observación.

  Asegúrate de que la cotización sea persuasiva, detallando la razón de cobro de cada servicio.

  Devuelve la respuesta en formato JSON con dos claves principales: "contract" (que contendrá el JSON de la cotización estructurada) y "priceExplanation" (la explicación detallada del cálculo).

  Ejemplo de formato de salida JSON:
  {
    "contract": {
      "clientName": "Juan Pérez",
      "quoteNumber": "COT-2025-001",
      "description": "Remodelación de baño principal.",
      "services": [
        {
          "item": "Mano de obra - Demolición",
          "unit": "global",
          "quantity": 1,
          "unitPrice": 250000,
          "subtotal": 250000,
          "reason": "Preparación esencial para garantizar la seguridad y el buen inicio de la obra."
        },
        {
          "item": "Suministro e instalación de cerámica",
          "unit": "m²",
          "quantity": 15,
          "unitPrice": 80000,
          "subtotal": 1200000,
          "reason": "Incluye cerámica de alta durabilidad y adhesivo flexible para un acabado impecable."
        }
      ],
      "subtotalAmount": 1450000,
      "ivaPercentage": 0,
      "ivaAmount": 0,
      "totalAmount": 1450000,
      "notes": "Los precios pueden variar si se requieren cambios adicionales no especificados."
    },
    "priceExplanation": "El cálculo del precio se basa en la suma de la mano de obra por demolición y el costo por metro cuadrado de cerámica..."
  }

  Prompt inicial: "${initialPrompt}"
  Información adicional:
  ${formattedAnswers}` }] }];

  const payload = {
    contents: chatHistory,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          "contract": { // Esto contendrá el JSON estructurado de la cotización
            type: "OBJECT",
            properties: {
              "clientName": { "type": "STRING" },
              "quoteNumber": { "type": "STRING" },
              "description": { "type": "STRING" },
              "services": {
                "type": "ARRAY",
                "items": {
                  "type": "OBJECT",
                  "properties": {
                    "item": { "type": "STRING" },
                    "unit": { "type": "STRING" },
                    "quantity": { "type": "NUMBER" },
                    "unitPrice": { "type": "NUMBER" },
                    "subtotal": { "type": "NUMBER" },
                    "reason": { "type": "STRING" }
                  },
                  "required": ["item", "unit", "quantity", "unitPrice", "subtotal", "reason"]
                }
              },
              "subtotalAmount": { "type": "NUMBER" },
              "ivaPercentage": { "type": "NUMBER" },
              "ivaAmount": { "type": "NUMBER" },
              "totalAmount": { "type": "NUMBER" },
              "notes": { "type": "STRING" }
            },
            "required": ["clientName", "quoteNumber", "description", "services", "subtotalAmount", "ivaPercentage", "ivaAmount", "totalAmount", "notes"]
          },
          "priceExplanation": { "type": "STRING" }
        },
        required: ["contract", "priceExplanation"]
      }
    }
  };

  // Accede a la API Key desde las variables de entorno de Next.js
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('La variable de entorno NEXT_PUBLIC_GOOGLE_AI_API_KEY no está definida.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetchWithExponentialBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(jsonString);
      return parsedJson as ContractResponse;
    } else {
      console.error('Estructura de respuesta inesperada de Gemini para cotización (usando generateContract):', result);
      throw new Error('No se pudo generar la cotización. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al llamar a la API de Gemini para generar cotización (usando generateContract):', error);
    throw new Error('Error al conectar con la IA para generar la cotización. Por favor, verifica tu conexión o inténtalo más tarde.');
  }
}
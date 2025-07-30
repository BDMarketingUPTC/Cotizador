import React from "react";
import { ContractData } from "../utils/types";

interface ContractDisplayProps {
  contractData: ContractData;
  onShowPriceExplanation: () => void;
}

const ContractDisplay: React.FC<ContractDisplayProps> = ({
  contractData,
  onShowPriceExplanation,
}) => {
  if (!contractData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <p className="text-gray-700 text-lg">
            Cargando cotización o datos no disponibles...
          </p>
        </div>
      </div>
    );
  }

  // Información general
  const maestroAlbañil = "Rigoberto Martínez";
  const empresaNombre = "Tegel Konst";
  const empresaContacto = "+57 310 123 4567";
  const fechaEmision = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const validezCotizacion =
    "La validez de los costos presentados en esta cotización no es superior a un mes a partir de la fecha de emisión.";
  const clausulaTrabajosExtras =
    "Esta cotización sirve como evidencia de que, en caso de confusiones de trabajo o si el cliente solicita un arreglo o trabajo extra que no haya sido expresamente detallado y acordado en este documento, dicho trabajo no forma parte del costo final acordado y generará recargos adicionales.";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 font-inter">
      <div className="w-full  bg-white shadow-lg rounded-lg p-3 sm:p-5 md:p-7 border border-gray-200">
        {/* Encabezado - Mejorado para móviles */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              COTIZACIÓN DE SERVICIOS
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              <span className="font-medium">Maestro:</span> {maestroAlbañil}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">{empresaNombre}</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              {empresaContacto}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-gray-700 text-xs sm:text-sm">
              <span className="font-medium">Fecha:</span> {fechaEmision}
            </p>
            <p className="text-gray-700 text-xs sm:text-sm">
              <span className="font-medium">Cotización #:</span>{" "}
              {contractData.quoteNumber}
            </p>
            <p className="text-gray-700 text-xs sm:text-sm">
              <span className="font-medium">Cliente:</span>{" "}
              {contractData.clientName}
            </p>
          </div>
        </div>

        {/* Descripción - Texto más ajustado para móviles */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Descripción del Trabajo
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            {contractData.description}
          </p>
        </div>

        {/* Tabla - Mejor scroll horizontal en móviles */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Desglose de Servicios
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Servicio
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Cant.
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Unitario
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contractData.services.map((service, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="px-2 py-2 whitespace-normal text-xs sm:text-sm text-gray-900 max-w-[120px]">
                            {service.item}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {service.quantity} {service.unit}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {formatCurrency(service.unitPrice)}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {formatCurrency(service.subtotal)}
                          </td>
                        </tr>
                        {service.reason && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-2 py-1 text-xs text-gray-600 italic bg-gray-50"
                            >
                              <span className="font-medium">Razón:</span>{" "}
                              {service.reason}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Totales - Mejor disposición en móviles */}
        <div className="mb-4">
          <div className="w-full sm:w-2/3 md:w-1/2 ml-auto">
            <div className="flex justify-between py-1 border-b text-xs sm:text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-gray-900 font-medium">
                {formatCurrency(contractData.subtotalAmount)}
              </span>
            </div>
            {contractData.ivaPercentage > 0 && (
              <div className="flex justify-between py-1 border-b text-xs sm:text-sm">
                <span className="text-gray-700">
                  IVA ({contractData.ivaPercentage}%):
                </span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(contractData.ivaAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 mt-1 bg-blue-50 rounded p-2 text-sm sm:text-base">
              <span className="font-bold text-blue-700">Total a Pagar:</span>
              <span className="font-bold text-blue-700">
                {formatCurrency(contractData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Notas - Texto más ajustado */}
        <div className="mb-4 border-t pt-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Notas y Condiciones
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2">
            {contractData.notes}
          </p>
          <p className="text-gray-700 text-xs sm:text-sm font-medium mb-2">
            {validezCotizacion}
          </p>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            {clausulaTrabajosExtras}
          </p>
        </div>

        {/* Firma - Tamaño ajustado */}
        <div className="mt-6 pt-3 border-t border-gray-300 text-center">
          <p className="text-gray-800 font-medium text-sm sm:text-base">
            Atentamente,
          </p>
          <p className="text-gray-800 font-bold text-base sm:text-lg mt-1">
            {maestroAlbañil}
          </p>
          <p className="text-gray-600 text-xs">Maestro Albañil a Cargo</p>
        </div>

        {/* Botón - Mejor tamaño para móviles */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onShowPriceExplanation}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white font-medium text-sm sm:text-base rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Ver Explicación Detallada del Precio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractDisplay;

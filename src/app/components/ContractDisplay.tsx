"use client";

import React, { useState, useRef, useCallback } from "react";
import { ContractData, ServiceItem } from "../utils/types";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { BlobProvider } from "@react-pdf/renderer";
import { motion, AnimatePresence } from "framer-motion";
import ContractDocument from "./ContractDocument";

interface EditableContractDisplayProps {
  contractData: ContractData;
  onShowPriceExplanation: () => void;
}

// Generador de IDs únicos para servicios
const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

const EditableContractDisplay: React.FC<EditableContractDisplayProps> = ({
  contractData,
  onShowPriceExplanation,
}) => {
  const [editableContract, setEditableContract] = useState<ContractData>(
    () => ({
      ...contractData,
      services: contractData.services.map((service) => ({
        ...service,
        id: service.id || generateUniqueId(),
      })),
    })
  );

  const [editing, setEditing] = useState<{
    itemId: string | null;
    field: "quantity" | "unitPrice" | "item" | null;
  }>({ itemId: null, field: null });

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    editableContract.description
  );
  const [editedValue, setEditedValue] = useState<string | number | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ServiceItem | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Nuevo estado para forzar la remonta del BlobProvider
  const [pdfKey, setPdfKey] = useState(0);

  // Forzar un nuevo render del PDF para reflejar los cambios
  const updatePdf = useCallback(() => {
    setPdfKey((prev) => prev + 1);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const recalculateTotals = useCallback(
    (services: ServiceItem[]): ContractData => {
      const newSubtotal = services.reduce(
        (acc, service) => acc + service.quantity * service.unitPrice,
        0
      );
      const newTotalAmount = newSubtotal; // Total es igual al subtotal sin IVA

      return {
        ...editableContract,
        services,
        subtotalAmount: newSubtotal,
        totalAmount: newTotalAmount,
      };
    },
    [editableContract]
  );

  const handleEdit = useCallback(
    (itemId: string, field: "quantity" | "unitPrice" | "item", value: any) => {
      setEditing({ itemId, field });
      setEditedValue(value);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!editing.itemId || !editing.field) return;

    const { itemId, field } = editing;

    const updatedServices = editableContract.services.map((service) => {
      if (service.id === itemId) {
        const updatedService = { ...service };
        const value =
          field === "item"
            ? (editedValue as string)
            : parseFloat(editedValue as string);

        switch (field) {
          case "item":
            updatedService.item = value as string;
            break;
          case "quantity":
            updatedService.quantity = value as number;
            break;
          case "unitPrice":
            updatedService.unitPrice = value as number;
            break;
        }

        updatedService.subtotal =
          updatedService.quantity * updatedService.unitPrice;
        return updatedService;
      }
      return service;
    });

    setEditableContract(recalculateTotals(updatedServices));
    setEditing({ itemId: null, field: null });
    setEditedValue(undefined);
    updatePdf(); // Forzar la actualización del PDF después de guardar
  }, [editing, editedValue, editableContract, recalculateTotals, updatePdf]);

  const handleCancel = useCallback(() => {
    setEditing({ itemId: null, field: null });
    setEditedValue(undefined);
  }, []);

  const handleAddService = useCallback(() => {
    const newService: ServiceItem = {
      id: generateUniqueId(),
      item: "Nuevo servicio",
      quantity: 1,
      unit: "unidad",
      unitPrice: 0,
      subtotal: 0,
      reason: "",
    };

    setEditableContract((prev) =>
      recalculateTotals([...prev.services, newService])
    );

    setTimeout(() => {
      formRef.current?.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
    updatePdf(); // Forzar la actualización del PDF después de agregar
  }, [recalculateTotals, updatePdf]);

  const handleDeleteClick = useCallback((service: ServiceItem) => {
    setItemToDelete(service);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;

    let updatedServices = editableContract.services.filter(
      (service) => service.id !== itemToDelete.id
    );

    if (updatedServices.length === 0) {
      updatedServices = [
        {
          id: generateUniqueId(),
          item: "Nuevo servicio",
          quantity: 1,
          unit: "unidad",
          unitPrice: 0,
          subtotal: 0,
          reason: "",
        },
      ];
    }

    setEditableContract(recalculateTotals(updatedServices));
    setShowDeleteModal(false);
    setItemToDelete(null);

    updatePdf(); // Forzar la actualización del PDF después de eliminar
  }, [itemToDelete, editableContract, recalculateTotals, updatePdf]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const handleGeneralDescriptionEdit = useCallback(() => {
    setIsEditingDescription(true);
    setEditedDescription(editableContract.description);
  }, [editableContract.description]);

  const handleSaveGeneralDescription = useCallback(() => {
    setEditableContract((prev) => ({
      ...prev,
      description: editedDescription,
    }));
    setIsEditingDescription(false);
    updatePdf(); // Forzar la actualización del PDF después de guardar
  }, [editedDescription, updatePdf]);

  const handleCancelGeneralDescription = useCallback(() => {
    setIsEditingDescription(false);
    setEditedDescription(editableContract.description);
  }, [editableContract.description]);

  // Datos estáticos para el display
  const maestroAlbañil = "Rigoberto Martínez";
  const empresaNombre = "Tegel Konst";
  const empresaContacto = "316 443 74 25";
  const fechaEmision = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const validezCotizacion =
    "La validez de los costos presentados en esta cotización no es superior a un mes a partir de la fecha de emisión.";
  const clausulaTrabajosExtras =
    "Esta cotización sirve como evidencia de que, en caso de confusiones de trabajo o si el cliente solicita un arreglo o trabajo extra que no haya sido expresamente detallado y acordado en este documento, dicho trabajo no forma parte del costo final acordado y generará recargos adicionales.";

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 font-inter">
      {/* Encabezado con botón de PDF */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-800">
          Editor de Cotización
        </h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowPriceExplanation}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Explicación de Precios
          </motion.button>
          <BlobProvider
            // Esta es la corrección clave para forzar la remonta del componente
            key={`pdf-${pdfKey}`}
            document={<ContractDocument contractData={editableContract} />}
          >
            {({ url, loading, error }) => (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-lg shadow transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                aria-disabled={loading}
              >
                {loading ? "Generando..." : "Descargar PDF"}
                <DocumentArrowDownIcon className="w-5 h-5" />
              </motion.a>
            )}
          </BlobProvider>
        </div>
      </div>
      {/* Contenedor principal del contrato */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={formRef}
        className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="bg-gray-800 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo de la Empresa"
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">COTIZACIÓN</h1>
                <p className="text-gray-300 text-sm">{empresaNombre}</p>
              </div>
            </div>
            <div className="text-sm text-gray-300 sm:text-right">
              <p>
                <span className="font-medium">Fecha:</span> {fechaEmision}
              </p>
              <p>
                <span className="font-medium">Cotización #:</span>{" "}
                {editableContract.quoteNumber}
              </p>
              <p>
                <span className="font-medium">Cliente:</span>{" "}
                {editableContract.clientName}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {/* Descripción del trabajo */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Descripción del Trabajo
              </h2>
              {!isEditingDescription && (
                <button
                  onClick={handleGeneralDescriptionEdit}
                  className="text-blue-600 hover:text-blue-800 transition"
                  aria-label="Editar descripción"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {isEditingDescription ? (
              <div className="space-y-3">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  rows={4}
                  placeholder="Describe el trabajo a realizar..."
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveGeneralDescription}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Guardar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelGeneralDescription}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Cancelar
                  </motion.button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-line">
                {editableContract.description || (
                  <span className="text-gray-400 italic">
                    Haz clic en el ícono de lápiz para agregar una descripción
                  </span>
                )}
              </p>
            )}
          </div>
          {/* Servicios */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Desglose de Servicios
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddService}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                <PlusIcon className="w-4 h-4" />
                Agregar Servicio
              </motion.button>
            </div>

            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cant.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unitario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editableContract.services.map((service) => (
                    <React.Fragment key={service.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-normal max-w-xs">
                          {editing.itemId === service.id &&
                          editing.field === "item" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editedValue as string}
                                onChange={(e) => setEditedValue(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-800"
                                  aria-label="Guardar"
                                >
                                  <CheckIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-800"
                                  aria-label="Cancelar"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex justify-between items-center cursor-pointer group"
                              onDoubleClick={() =>
                                handleEdit(service.id, "item", service.item)
                              }
                            >
                              <span className="break-words">
                                {service.item || (
                                  <span className="text-gray-400 italic">
                                    Sin nombre
                                  </span>
                                )}
                              </span>
                              <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {editing.itemId === service.id &&
                          editing.field === "quantity" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={editedValue as number}
                                onChange={(e) =>
                                  setEditedValue(parseFloat(e.target.value))
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-800"
                                  aria-label="Guardar"
                                >
                                  <CheckIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-800"
                                  aria-label="Cancelar"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex justify-between items-center cursor-pointer group"
                              onDoubleClick={() =>
                                handleEdit(
                                  service.id,
                                  "quantity",
                                  service.quantity
                                )
                              }
                            >
                              <span>
                                {service.quantity} {service.unit}
                              </span>
                              <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {editing.itemId === service.id &&
                          editing.field === "unitPrice" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                value={editedValue as number}
                                onChange={(e) =>
                                  setEditedValue(parseFloat(e.target.value))
                                }
                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={handleSave}
                                  className="text-green-600 hover:text-green-800"
                                  aria-label="Guardar"
                                >
                                  <CheckIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-600 hover:text-red-800"
                                  aria-label="Cancelar"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex justify-between items-center cursor-pointer group"
                              onDoubleClick={() =>
                                handleEdit(
                                  service.id,
                                  "unitPrice",
                                  service.unitPrice
                                )
                              }
                            >
                              <span>{formatCurrency(service.unitPrice)}</span>
                              <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {formatCurrency(service.subtotal)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteClick(service)}
                            className="text-red-600 hover:text-red-800 transition"
                            aria-label="Eliminar servicio"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                      {service.reason && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-2 text-xs text-gray-600 italic bg-gray-50"
                          >
                            <span className="font-medium">Nota:</span>{" "}
                            {service.reason}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nueva vista de tarjetas para dispositivos móviles */}
            <div className="block sm:hidden space-y-4">
              {editableContract.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-500 uppercase">
                      Servicio
                    </span>
                    <button
                      onClick={() => handleDeleteClick(service)}
                      className="text-red-600 hover:text-red-800 transition"
                      aria-label="Eliminar servicio"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-4">
                    {editing.itemId === service.id &&
                    editing.field === "item" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedValue as string}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800"
                            aria-label="Guardar"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Cancelar"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex justify-between items-center cursor-pointer group"
                        onDoubleClick={() =>
                          handleEdit(service.id, "item", service.item)
                        }
                      >
                        <span className="text-base font-medium break-words">
                          {service.item || (
                            <span className="text-gray-400 italic">
                              Sin nombre
                            </span>
                          )}
                        </span>
                        <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Cantidad:
                      </span>
                      {editing.itemId === service.id &&
                      editing.field === "quantity" ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editedValue as number}
                            onChange={(e) =>
                              setEditedValue(parseFloat(e.target.value))
                            }
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-800"
                              aria-label="Guardar"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Cancelar"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex justify-between items-center cursor-pointer group"
                          onDoubleClick={() =>
                            handleEdit(service.id, "quantity", service.quantity)
                          }
                        >
                          <span className="mt-1 block">
                            {service.quantity} {service.unit}
                          </span>
                          <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Precio Unitario:
                      </span>
                      {editing.itemId === service.id &&
                      editing.field === "unitPrice" ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={editedValue as number}
                            onChange={(e) =>
                              setEditedValue(parseFloat(e.target.value))
                            }
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-800"
                              aria-label="Guardar"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Cancelar"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex justify-between items-center cursor-pointer group"
                          onDoubleClick={() =>
                            handleEdit(
                              service.id,
                              "unitPrice",
                              service.unitPrice
                            )
                          }
                        >
                          <span className="mt-1 block">
                            {formatCurrency(service.unitPrice)}
                          </span>
                          <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Subtotal:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(service.subtotal)}
                    </span>
                  </div>
                  {service.reason && (
                    <p className="mt-2 text-xs text-gray-600 italic">
                      <span className="font-medium">Nota:</span>{" "}
                      {service.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Totales */}
          <div className="mb-8">
            <div className="w-full md:w-1/2 ml-auto space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(editableContract.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-4">
                <span className="font-bold text-blue-800">Total a Pagar:</span>
                <span className="font-bold text-blue-800 text-lg">
                  {formatCurrency(editableContract.totalAmount)}
                </span>
              </div>
            </div>
          </div>
          {/* Notas y condiciones */}
          <div className="mb-6 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Notas y Condiciones
            </h2>
            <div className="space-y-3">
              {editableContract.notes && (
                <p className="text-gray-700 whitespace-pre-line">
                  {editableContract.notes}
                </p>
              )}
              <p className="text-gray-700 font-medium">{validezCotizacion}</p>
              <p className="text-gray-700">{clausulaTrabajosExtras}</p>
            </div>
          </div>
          {/* Firma */}
          <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-800 font-medium">Atentamente,</p>
            <p className="text-gray-800 font-bold text-lg mt-1">
              {maestroAlbañil}
            </p>
            <p className="text-gray-600 text-sm">Maestro Albañil a Cargo</p>
          </div>
        </div>
      </motion.div>
      {/* Modal de confirmación */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Confirmar eliminación
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                ¿Estás seguro de que quieres eliminar el servicio:{" "}
                <span className="font-semibold text-gray-700">
                  {itemToDelete?.item}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(EditableContractDisplay);

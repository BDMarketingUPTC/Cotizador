/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ContractData } from "../utils/types";

// Definición de la paleta de colores para la identidad visual
const brandColors = {
  brown: "#331A05",
  lightBrown: "#8C5B30",
  offWhite: "#E5E5E5",
  dark: "#171717",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: brandColors.white,
    padding: 30,
    fontFamily: "Helvetica",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: brandColors.brown,
    borderBottomStyle: "solid",
    paddingBottom: 15,
    marginBottom: 20,
    alignItems: "flex-end",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: brandColors.dark,
    textTransform: "uppercase",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  headerText: {
    fontSize: 10,
    color: brandColors.dark,
    lineHeight: 1.5,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
    color: brandColors.brown,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  text: {
    fontSize: 9,
    marginBottom: 4,
    color: brandColors.dark,
    lineHeight: 1.5,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  tableContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: brandColors.offWhite,
    backgroundColor: brandColors.white,
    borderRadius: 4,
    overflow: "hidden",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: brandColors.brown,
    borderBottomWidth: 1,
    borderBottomColor: brandColors.brown,
    fontWeight: "bold",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: brandColors.offWhite,
    alignItems: "center",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 9,
    color: brandColors.white,
    textTransform: "uppercase",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: brandColors.dark,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  col1: { width: "40%", display: "flex" },
  col2: { width: "15%", display: "flex" },
  col3: { width: "25%", display: "flex" },
  col4: { width: "20%", display: "flex" },
  totalSection: {
    marginLeft: "auto",
    width: "50%",
    marginTop: 15,
    padding: 10,
    backgroundColor: brandColors.offWhite,
    borderRadius: 4,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: brandColors.offWhite,
    borderBottomStyle: "solid",
    paddingVertical: 5,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  totalLabel: {
    fontSize: 10,
    color: brandColors.dark,
    fontWeight: "bold",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  totalAmount: {
    fontSize: 10,
    fontWeight: "bold",
    color: brandColors.brown,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  notes: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: brandColors.offWhite,
    paddingTop: 10,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  signature: {
    textAlign: "center",
    marginTop: 40,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  signatureText: {
    fontSize: 10,
    color: brandColors.dark,
    lineHeight: 1.5,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  reasonCell: {
    padding: 8,
    fontSize: 8,
    color: brandColors.dark,
    fontStyle: "italic",
    paddingLeft: 16,
    borderRightWidth: 1,
    borderRightColor: brandColors.offWhite,
    width: "100%",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  reasonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: brandColors.offWhite,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  // Nuevos estilos para corregir los errores de tipo
  totalRowNoBorder: {
    borderBottomWidth: 0,
    paddingVertical: 10,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  totalAmountFinal: {
    color: brandColors.brown,
    fontSize: 12,
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
  // Estilo para el View que estaba causando un error
  textAlignRight: {
    textAlign: "right",
    // Corregido: añadido display para satisfacer los tipos de v4
    display: "flex",
  },
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface ContractDocumentProps {
  contractData: ContractData;
}

const ContractDocument: React.FC<ContractDocumentProps> = ({
  contractData,
}) => {
  // Validación de datos
  if (
    !contractData ||
    !contractData.services ||
    contractData.services.length === 0
  ) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: No hay datos válidos para generar el contrato</Text>
        </Page>
      </Document>
    );
  }

  const validezCotizacion =
    "La validez de los costos presentados en esta cotización no es superior a un mes a partir de la fecha de emisión.";
  const clausulaTrabajosExtras =
    "Esta cotización sirve como evidencia de que, en caso de confusiones de trabajo o si el cliente solicita un arreglo o trabajo extra que no haya sido expresamente detallado y acordado en este documento, dicho trabajo no forma parte del costo final acordado y generará recargos adicionales.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <View style={styles.logoContainer}>
              <Image src="/logo.png" style={styles.logo} />

              <Text style={styles.title}>COTIZACIÓN</Text>
            </View>
            <Text style={styles.headerText}>Maestro: Rigoberto Martínez</Text>
            <Text style={styles.headerText}>Tegel Konst</Text>
            <Text style={styles.headerText}>316 443 74 25</Text>
          </View>
          <View style={styles.textAlignRight}>
            <Text style={styles.headerText}>
              Fecha: {new Date().toLocaleDateString("es-CO")}
            </Text>
            <Text style={styles.headerText}>
              Cotización #: {contractData.quoteNumber}
            </Text>
            <Text style={styles.headerText}>
              Cliente: {contractData.clientName}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Descripción del Trabajo</Text>
        <Text style={styles.text}>{contractData.description}</Text>

        <Text style={styles.sectionTitle}>Desglose de Servicios</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.col1]}>Servicio</Text>
            <Text style={[styles.tableCellHeader, styles.col2]}>Cant.</Text>
            <Text style={[styles.tableCellHeader, styles.col3]}>Unitario</Text>
            <Text style={[styles.tableCellHeader, styles.col4]}>Subtotal</Text>
          </View>
          {contractData.services.map((service, index) => (
            <React.Fragment key={`${service.item}-${index}`}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>
                  {service.item}
                </Text>
                <Text style={[styles.tableCell, styles.col2]}>
                  {service.quantity} {service.unit}
                </Text>
                <Text style={[styles.tableCell, styles.col3]}>
                  {formatCurrency(service.unitPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  {formatCurrency(service.subtotal)}
                </Text>
              </View>
              {service.reason && (
                <View style={styles.reasonRow}>
                  <Text style={styles.reasonCell}>Nota: {service.reason}</Text>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text
              style={[
                styles.totalAmount,
                { color: brandColors.dark, display: "flex" },
              ]}
            >
              {formatCurrency(contractData.subtotalAmount)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowNoBorder]}>
            <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
            <Text style={[styles.totalAmount, styles.totalAmountFinal]}>
              {formatCurrency(contractData.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Notas y Condiciones</Text>
          <Text style={styles.text}>{contractData.notes}</Text>
          <Text style={styles.text}>{validezCotizacion}</Text>
          <Text style={styles.text}>{clausulaTrabajosExtras}</Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.signatureText}>Atentamente,</Text>
          <Text
            style={[
              styles.signatureText,
              { fontWeight: "bold", display: "flex" },
            ]}
          >
            Rigoberto Martínez
          </Text>
          <Text style={styles.signatureText}>Maestro Albañil a Cargo</Text>
        </View>
      </Page>
    </Document>
  );
};

export default React.memo(ContractDocument);

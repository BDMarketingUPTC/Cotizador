import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Título claro que describe la función principal de la app
  title: "Tegel Konst | Generador de Cotizaciones y Contratos",

  // Descripción detallada para SEO
  description:
    "Crea, edita y gestiona cotizaciones y contratos de servicios de albañilería de forma rápida y profesional para tu negocio Tegel Konst.",

  // Open Graph (para compartir en redes sociales como Facebook, LinkedIn)
  openGraph: {
    title: "Tegel Konst | Generador de Cotizaciones",
    description:
      "Crea cotizaciones y contratos profesionales en minutos. Edita servicios, cantidades y precios, y descarga PDFs listos para tus clientes.",
    url: "https://cotizador-pied.vercel.app/", // Cambia esto por el dominio real de tu aplicación
    siteName: "Tegel Konst",
    images: [
      {
        url: "https://cotizador-pied.vercel.app/logo.png", // URL de una imagen representativa para redes sociales
        width: 1200,
        height: 630,
        alt: "Generador de Cotizaciones Tegel Konst",
      },
    ],
    locale: "es_CO", // Ajusta el idioma y la región si es necesario
    type: "website",
  },

  // Twitter Card (para compartir en Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Tegel Konst | Generador de Cotizaciones",
    description:
      "Crea cotizaciones y contratos profesionales en minutos. Edita servicios, cantidades y precios, y descarga PDFs listos para tus clientes.",
    creator: "@briam_torres", // Opcional: tu usuario de Twitter
    images: ["https://cotizador-pied.vercel.app/logo.png"], // URL de la imagen de Twitter
  },

  // Favicon y otros íconos
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {" "}
      {/* Se recomienda cambiar el idioma a "es" */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

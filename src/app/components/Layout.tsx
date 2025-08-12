// components/Layout.tsx
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Contenedor principal con fondo y un min-height para que cubra toda la pantalla
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-900">
      {/* Contenedor flexible para alinear el contenido principal */}
      <div className="mx-auto w-full max-w-5xl py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;

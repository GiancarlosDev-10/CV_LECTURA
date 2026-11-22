import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Acción de mejora preventiva tras el escaneo base de ZAP (alertas medias y bajas, E13).
  // SAMEORIGIN y no DENY: el detalle de la postulación muestra el PDF en un iframe del mismo sitio.
  poweredByHeader: false,
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // cacheComponents/partialPrefetching (activados por create-next-app) se desactivan:
  // todas las páginas dependen de la sesión del usuario y se renderizan por petición.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

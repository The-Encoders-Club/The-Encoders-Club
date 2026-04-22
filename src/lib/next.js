// Archivo de configuración y utilidades de Next.js para The Encoders Club
// Este archivo maneja la lógica de inicialización y compatibilidad con Cloudflare

export const config = {
  runtime: 'edge', // Asegura que corra en el entorno rápido de Cloudflare
};

export default function initNext() {
  console.log("Next.js logic initialized for The Encoders Club");
  // Aquí puedes añadir lógica personalizada de inicialización si es necesario
}

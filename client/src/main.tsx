import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Renderizamos la aplicación de React
createRoot(document.getElementById("root")!).render(<App />);

// Control del Splash Screen inyectado en index.html
const handleSplashScreen = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    // Tiempo reducido de 3s → 1.2s para mejorar el rendimiento percibido
    setTimeout(() => {
      // Detener el generador de partículas antes de ocultar
      if (typeof (window as any).stopParticles === 'function') {
        (window as any).stopParticles();
      }

      splash.style.opacity = "0";
      // Transición reducida de 1s → 0.6s
      setTimeout(() => {
        splash.style.display = "none";
      }, 600);
    }, 1200);
  }
};

// Ejecutamos el controlador del splash
handleSplashScreen();

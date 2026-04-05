import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Renderizamos la aplicación de React
createRoot(document.getElementById("root")!).render(<App />);

// Control del Splash Screen inyectado en index.html
const handleSplashScreen = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    // El splash screen aparece cada vez que se recarga la página
    // Tiempo mínimo de visualización: 8 segundos
    setTimeout(() => {
      splash.style.opacity = "0";
      // Eliminamos el elemento del DOM después de la transición de 1.5s
      setTimeout(() => {
        splash.style.display = "none";
      }, 1500);
    }, 8000);
  }
};

// Ejecutamos el controlador del splash
handleSplashScreen();

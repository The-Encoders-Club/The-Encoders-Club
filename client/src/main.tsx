import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Renderizamos la aplicación de React
createRoot(document.getElementById("root")!).render(<App />);

// Control del Splash Screen inyectado en index.html
const handleSplashScreen = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    // Solo mostramos el splash si no se ha visto en esta sesión
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      splash.style.display = "none";
    } else {
      // Tiempo mínimo de visualización: 5 segundos
      setTimeout(() => {
        splash.style.opacity = "0";
        sessionStorage.setItem("hasSeenSplash", "true");
        // Eliminamos el elemento del DOM después de la transición de 1.5s
        setTimeout(() => {
          splash.style.display = "none";
        }, 1500);
      }, 5000);
    }
  }
};

// Ejecutamos el controlador del splash
handleSplashScreen();

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Renderizamos la aplicación de React
createRoot(document.getElementById("root")!).render(<App />);

// Control del Splash Screen inyectado en index.html
const handleSplashScreen = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    setTimeout(() => {
      if (typeof (window as any).stopParticles === 'function') {
        (window as any).stopParticles();
      }
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
      }, 1000);
    }, 3000);
  }
};

handleSplashScreen();

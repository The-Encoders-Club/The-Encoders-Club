import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Proyectos from "./pages/Proyectos";
import Cursos from "./pages/Cursos";
import Noticias from "./pages/Noticias";
import Donar from "./pages/Donar";
import SplashScreen from "./components/SplashScreen";
import BackgroundParticles from "./components/BackgroundParticles";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/proyectos" component={Proyectos} />
      <Route path="/cursos" component={Cursos} />
      <Route path="/noticias" component={Noticias} />
      <Route path="/donar" component={Donar} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Verificamos si ya se vio el splash en esta sesión
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    // Solo marcamos como visto y ocultamos cuando el componente SplashScreen avisa que terminó
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {/* El Splash Screen ahora controla su propia duración (4s) antes de llamar a handleSplashComplete */}
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          
          <Toaster />
          <BackgroundParticles />
          
          {/* Solo mostramos el contenido principal cuando el splash ha terminado */}
          {!showSplash && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

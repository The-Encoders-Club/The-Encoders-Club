import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BackgroundParticles from "./components/BackgroundParticles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Proyectos from "./pages/Proyectos";
import Cursos from "./pages/Cursos";
import Noticias from "./pages/Noticias";
import Donar from "./pages/Donar";
import NotFound from "./pages/NotFound";

// CAMBIO: Navbar, Footer y BackgroundParticles centralizados aquí.
// Se eliminaron de cada página individual para evitar duplicados que
// causaban bajo rendimiento en móviles (especialmente Honor X5 Plus).

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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {/* Una sola instancia de BackgroundParticles para toda la app */}
          <BackgroundParticles />
          <Navbar />
          <Router />
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

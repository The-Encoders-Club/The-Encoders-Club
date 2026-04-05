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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

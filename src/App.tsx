
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import ChatsDashboard from "./pages/ChatsDashboard";
import KnowledgeManager from "./pages/KnowledgeManager";
import ClientsDashboard from "./pages/ClientsDashboard";
import Evolution from "./pages/Evolution";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import ConfigurationManager from "./pages/ConfigurationManager";
import Funcionarios from "./pages/Funcionarios";
import PetsProntuarios from "./pages/PetsProntuarios";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Estoque from "./pages/Estoque";
import Pedidos from "./pages/Pedidos";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/metrics" element={<MetricsDashboard />} />
              <Route path="/chats" element={<ChatsDashboard />} />
              <Route path="/knowledge" element={<KnowledgeManager />} />
              <Route path="/clients" element={<ClientsDashboard />} />
              <Route path="/evolution" element={<Evolution />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/configuration" element={<ConfigurationManager />} />
              <Route path="/funcionarios" element={<Funcionarios />} />
              <Route path="/pets-prontuarios" element={<PetsProntuarios />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/pedidos" element={<Pedidos />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

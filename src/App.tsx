import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiseaseDetection from "./pages/DiseaseDetection";
import Dashboard from "./pages/Dashboard";
import MarketPrices from "./pages/MarketPrices";
import Services from "./pages/Services";
import Schemes from "./pages/Schemes";
import Weather from "./pages/Weather";
import PestAlerts from "./pages/PestAlerts";
import SowingCalendar from "./pages/SowingCalendar";
import OrganicFarmingTips from './pages/OrganicFarmingTips';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/detection" element={<DiseaseDetection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prices" element={<MarketPrices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/pest-alerts" element={<PestAlerts />} />
          <Route path="/sowing-calendar" element={<SowingCalendar />} />
          <Route path="/organic-farming" element={<OrganicFarmingTips />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

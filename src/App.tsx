import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { StartBusinessPage } from "./components/StartBusinessPage";
import { SellOnlinePage } from "./components/SellOnlinePage";
import { ProductFormPage } from "./components/ProductFormPage";
import { PlatformRecommenderPage } from "./components/PlatformRecommenderPage";
import { ListingGuidePage } from "./components/ListingGuidePage";
import { AIProductListingPage } from "./components/AIProductListingPage";
import { AIPricingPage } from "./components/AIPricingPage";
import { AIMarketingPage } from "./components/AIMarketingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/start-business" element={<StartBusinessPage />} />
          <Route path="/sell-online" element={<SellOnlinePage />} />
          <Route path="/product-form" element={<ProductFormPage />} />
          <Route path="/platform-recommender" element={<PlatformRecommenderPage />} />
          <Route path="/listing-guide" element={<ListingGuidePage />} />
          <Route path="/ai-product-listing" element={<AIProductListingPage />} />
          <Route path="/ai-pricing" element={<AIPricingPage />} />
          <Route path="/ai-marketing" element={<AIMarketingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

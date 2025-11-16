import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import MyCards from "./pages/MyCards";
import CardCreator from "./pages/CardCreator";
import PublicCard from "./pages/PublicCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public card route without navigation */}
          <Route path="/card/:slug" element={<PublicCard />} />
          
          {/* Main app routes with navigation */}
          <Route path="/*" element={
            <div className="min-h-screen bg-background">
              <nav className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-3 flex gap-2">
                  <NavLink to="/my-cards">My Cards</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/">Templates</NavLink>
                </div>
              </nav>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-cards" element={<MyCards />} />
                <Route path="/cards/new" element={<CardCreator />} />
                <Route path="/cards/edit/:id" element={<CardCreator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

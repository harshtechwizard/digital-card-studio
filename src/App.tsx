import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import MyCards from "./pages/MyCards";
import CardCreator from "./pages/CardCreator";
import PublicCard from "./pages/PublicCard";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppNav() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/my-cards">My Cards</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/card/:slug" element={<PublicCard />} />
            
            {/* Protected routes with navigation */}
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <AppNav />
                  <Routes>
                    <Route path="/" element={<Navigate to="/profile" replace />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-cards" element={<MyCards />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/cards/new" element={<CardCreator />} />
                    <Route path="/cards/edit/:id" element={<CardCreator />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

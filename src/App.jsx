import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/Admin";    // FIXED
import SuperAdmin from "./pages/SuperAdmin";
import Scanner from "./pages/Scanner";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Login/Signup */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/signup" element={<Signup />} />

            {/* Dashboards */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

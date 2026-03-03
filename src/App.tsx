import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import FTPConnection from "./pages/FTPConnection";
import PGPSettings from "./pages/PGPSettings";
import Configurations from "./pages/Configurations";
import ConfigEditor from "./pages/ConfigEditor";
import Scheduling from "./pages/Scheduling";
import RunsLogs from "./pages/RunsLogs";
import DatabasePage from "./pages/DatabasePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ftp" element={<FTPConnection />} />
            <Route path="/pgp" element={<PGPSettings />} />
            <Route path="/configurations" element={<Configurations />} />
            <Route path="/configurations/:name" element={<ConfigEditor />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/runs" element={<RunsLogs />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import "./global.css";
import "@/lib/resize-observer-fix";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Suppress ResizeObserver errors globally
const suppressResizeObserverErrors = () => {
  // Override console.error to filter out ResizeObserver warnings
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    if (errorMessage.includes('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled errors
  const handleError = (event: ErrorEvent) => {
    if (event.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };

  // Handle unhandled promise rejections
  const handleRejection = (event: PromiseRejectionEvent) => {
    if (event.reason?.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.preventDefault();
      return false;
    }
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  return () => {
    console.error = originalConsoleError;
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
};

// Initialize error suppression immediately
suppressResizeObserverErrors();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

import { Login } from "./pages/login";
import { Forms } from "./pages/forms";
import { Dashboard } from "./pages/dashboard";
import { ReactNode } from "react";
import { ResearchByUser } from "./pages/researchs-by-user";
import { ExternalResearch } from "./pages/external-research";
import { ResearchOverview } from "./pages/research-overview";
import { Routes, Route, Navigate } from "react-router-dom";

import Cookies from "js-cookie";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = Cookies.get("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/"/>;
  }
  
  return children;
};

export function ListRoutes() {
  const isAuthenticated = Cookies.get("token");

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/formularios" /> : <Login />}
      />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/formularios" 
        element={
          <PrivateRoute>
            <Forms />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/dashboard/:idResearch" 
        element={
          <PrivateRoute>
            <ResearchOverview />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/formulario/pesquisa-externa" 
        element={
          <PrivateRoute>
            <ExternalResearch />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/pesquisas" 
        element={
          <PrivateRoute>
            <ResearchByUser />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

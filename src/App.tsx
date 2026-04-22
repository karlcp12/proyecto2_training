import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./components/pages/LoginPage/LoginPage";
import { RecoverPasswordPage } from "./components/pages/RecoverPasswordPage/RecoverPasswordPage";
import { MainLayout } from "./components/templates/MainLayout/MainLayout";
import { MainMenuDefaultPage } from "./components/pages/MainMenuDefaultPage/MainMenuDefaultPage";
import { DashboardPage } from "./components/pages/DashboardPage/DashboardPage";
import { MaterialesPage } from "./components/pages/MaterialesPage/MaterialesPage";
import { AreasPage } from "./components/pages/AreasPage/AreasPage";
import { AreaBodegaPage } from "./components/pages/AreaBodegaPage/AreaBodegaPage";
import { FichasPage } from "./components/pages/FichasPage/FichasPage";
import { UsuariosPage } from "./components/pages/UsuariosPage/UsuariosPage";
import { ReportesPage } from "./components/pages/ReportesPage/ReportesPage";
import { NotificacionesPage } from "./components/pages/NotificacionesPage/NotificacionesPage";
import { ActualizarStockPage } from "./components/pages/ActualizarStockPage/ActualizarStockPage";
import { SolicitudesPage } from "./components/pages/SolicitudesPage/SolicitudesPage";
import { VerificacionMaterialesPage } from "./components/pages/VerificacionMaterialesPage/VerificacionMaterialesPage";
import { AprendicesPage } from "./components/pages/AprendicesPage/AprendicesPage";
import { ProtectedRoute } from "./components/templates/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="materiales" element={<MaterialesPage />} />
          <Route path="areas" element={<AreasPage />} />
          <Route path="areas/:id/bodega" element={<AreaBodegaPage />} />
          <Route path="fichas" element={<FichasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
            <Route path="actualizar-stock" element={<ActualizarStockPage />} />
            <Route path="solicitudes" element={<SolicitudesPage />} />
            <Route path="aprendices" element={<AprendicesPage />} />
            <Route path="verificacion" element={<VerificacionMaterialesPage />} />
          </Route>
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
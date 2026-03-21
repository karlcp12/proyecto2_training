import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage } from "./components/pages/LoginPage/LoginPage";
import { RecoverPasswordPage } from "./components/pages/RecoverPasswordPage/RecoverPasswordPage";
import { MainLayout } from "./components/templates/MainLayout/MainLayout";
import { MainMenuDefaultPage } from "./components/pages/MainMenuDefaultPage/MainMenuDefaultPage";
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

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<MainMenuDefaultPage />} />
          <Route path="materiales" element={<MaterialesPage />} />
          <Route path="areas" element={<AreasPage />} />
          <Route path="areas/:id/bodega" element={<AreaBodegaPage />} />
          <Route path="fichas" element={<FichasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
          <Route path="actualizar-stock" element={<ActualizarStockPage />} />
          <Route path="solicitudes" element={<SolicitudesPage />} />
          <Route path="verificacion" element={<VerificacionMaterialesPage />} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
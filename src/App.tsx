import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage } from "./components/pages/LoginPage/LoginPage";
import { RecoverPasswordPage } from "./components/pages/RecoverPasswordPage/RecoverPasswordPage";
import { MainLayout } from "./components/templates/MainLayout/MainLayout";
import { MainMenuDefaultPage } from "./components/pages/MainMenuDefaultPage/MainMenuDefaultPage";
import { MaterialesPage } from "./components/pages/MaterialesPage/MaterialesPage";
import { AreasPage } from "./components/pages/AreasPage/AreasPage";
import { FichasPage } from "./components/pages/FichasPage/FichasPage";
import { UsuariosPage } from "./components/pages/UsuariosPage/UsuariosPage";
import { ReportesPage } from "./components/pages/ReportesPage/ReportesPage";
import { NotificacionesPage } from "./components/pages/NotificacionesPage/NotificacionesPage";
import { ActualizarStockPage } from "./components/pages/ActualizarStockPage/ActualizarStockPage";
import { SolicitudesPage } from "./components/pages/SolicitudesPage/SolicitudesPage";
import { VerificacionMaterialesPage } from "./components/pages/VerificacionMaterialesPage/VerificacionMaterialesPage";
import { RoleGate } from "./components/auth/RoleGate";

import { ProfilePage } from "./components/pages/ProfilePage/ProfilePage";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<MainMenuDefaultPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="materiales" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><MaterialesPage /></RoleGate>} />
          <Route path="areas" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><AreasPage /></RoleGate>} />
          <Route path="fichas" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><FichasPage /></RoleGate>} />
          <Route path="usuarios" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><UsuariosPage /></RoleGate>} />
          <Route path="reportes" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><ReportesPage /></RoleGate>} />
          <Route path="notificaciones" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><NotificacionesPage /></RoleGate>} />
          <Route path="actualizar-stock" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><ActualizarStockPage /></RoleGate>} />
          <Route path="solicitudes" element={<SolicitudesPage />} />
          <Route path="verificacion" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><VerificacionMaterialesPage /></RoleGate>} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
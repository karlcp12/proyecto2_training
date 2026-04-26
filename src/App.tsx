import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSettings, SettingsProvider } from "./context/SettingsContext";

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
import { SettingsPage } from "./components/pages/SettingsPage/SettingsPage";
import { AuditPage } from "./components/pages/AuditPage/AuditPage";

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SettingsProvider>
  );
}

function AppContent() {
  const { settings } = useSettings();
  const location = useLocation();

  const lastStatuses = useRef<Record<number, string>>({});
  const notifiedAlerts = useRef<Record<number, number>>({}); 

  useEffect(() => {
    const checkAlerts = async () => {
      if (!settings.enableToasts) return;
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        // Clear tracking if logged out
        notifiedAlerts.current = {};
        lastStatuses.current = {};
        return;
      }
      
      const user = JSON.parse(userStr);
      if (!user.rol) return;

      try {
        // 1. Check general system alerts
        const resAlerts = await fetch('http://localhost:3001/stats/alertas');
        const dataAlerts = await resAlerts.json();
        
        if (dataAlerts && dataAlerts.length > 0) {
            dataAlerts.forEach((alert: any) => {
                const now = Date.now();
                const lastNotified = notifiedAlerts.current[alert.id_alerta] || 0;
                
                // Notify if: Never notified OR it was more than 1 hour ago (3600000ms)
                if (now - lastNotified > 3600000) {
                    toast(`Alerta: ${alert.descripcion}`, {
                        icon: '🔔',
                        duration: 6000,
                        id: `alert-${alert.id_alerta}-${Math.floor(now / 3600000)}` // New ID every hour
                    });
                    notifiedAlerts.current[alert.id_alerta] = now;
                }
            });
        }

        // 2. Check personal requests for Vocero
        if (user.rol === 'Vocero') {
            const resReq = await fetch(`http://localhost:3001/solicitudes/usuario/${user.id_usuario}`);
            const dataReq = await resReq.json();
            
            dataReq.forEach((req: any) => {
                const prevStatus = lastStatuses.current[req.id_solicitud];
                if (prevStatus && prevStatus !== req.estado) {
                    if (req.estado === 'Aceptada') {
                        toast.success(`¡Tu solicitud de ${req.nombre_material} ha sido ACEPTADA!`, { icon: '✅', duration: 8000 });
                    } else if (req.estado === 'Rechazada') {
                        toast.error(`Tu solicitud de ${req.nombre_material} ha sido RECHAZADA.`, { icon: '❌', duration: 8000 });
                    }
                }
                lastStatuses.current[req.id_solicitud] = req.estado;
            });
        }
      } catch (err) { /* silent */ }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, settings.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [settings.refreshInterval, settings.enableToasts, location.pathname]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<MainMenuDefaultPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="configuracion" element={<RoleGate allowedRoles={['Administrador']}><SettingsPage /></RoleGate>} />
          <Route path="materiales" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><MaterialesPage /></RoleGate>} />
          <Route path="areas" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><AreasPage /></RoleGate>} />
          <Route path="fichas" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><FichasPage /></RoleGate>} />
          <Route path="usuarios" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><UsuariosPage /></RoleGate>} />
          <Route path="reportes" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><ReportesPage /></RoleGate>} />
          <Route path="notificaciones" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><NotificacionesPage /></RoleGate>} />
          <Route path="actualizar-stock" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><ActualizarStockPage /></RoleGate>} />
          <Route path="solicitudes" element={<SolicitudesPage />} />
          <Route path="auditoria" element={<RoleGate allowedRoles={['Administrador']}><AuditPage /></RoleGate>} />
          <Route path="verificacion" element={<RoleGate allowedRoles={['Administrador', 'Instructor']}><VerificacionMaterialesPage /></RoleGate>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
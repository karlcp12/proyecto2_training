import { Navigate } from 'react-router-dom';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGate: React.FC<RoleGateProps> = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = currentUser.rol;

  if (!role || !allowedRoles.includes(role)) {
    // If user is Vocero and tries to access restricted area, send to solicitudes
    if (role === 'Vocero') {
        return <Navigate to="/app/solicitudes" replace />;
    }
    // Otherwise go to home/login
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

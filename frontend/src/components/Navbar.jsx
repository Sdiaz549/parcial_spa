import { CalendarDays, Flower2, LayoutDashboard, LogOut, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Serenity Spa inicio">
        <span className="brand-mark"><Flower2 size={22} /></span>
        <span>Serenity Spa</span>
      </Link>

      <nav className="nav-links" aria-label="Navegacion principal">
        <NavLink to="/services"><Sparkles size={17} /> Servicios</NavLink>
        {isAuthenticated && <NavLink to="/book"><CalendarDays size={17} /> Reservar</NavLink>}
        {isAuthenticated && <NavLink to="/dashboard"><LayoutDashboard size={17} /> Dashboard</NavLink>}
        {role === 'ADMIN' && <NavLink to="/admin/services"><ShieldCheck size={17} /> Admin</NavLink>}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="user-pill">{user?.name}</span>
            <button className="icon-button" onClick={handleLogout} title="Cerrar sesion" aria-label="Cerrar sesion">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">Login</Link>
            <Link className="primary-button compact" to="/register"><UserPlus size={17} /> Registro</Link>
          </>
        )}
      </div>
    </header>
  );
}

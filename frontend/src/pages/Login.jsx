import { LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'user@spa.com', password: 'user123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-visual">
        <span className="eyebrow">Acceso Serenity</span>
        <h1>Agenda, reservas y administracion en una misma experiencia.</h1>
      </div>
      <form className="form-panel" onSubmit={handleSubmit}>
        <h2>Iniciar sesion</h2>
        <label>
          Correo
          <span className="input-icon"><Mail size={18} /></span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Password
          <span className="input-icon"><LockKeyhole size={18} /></span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error && <div className="alert error">{error}</div>}
        <button className="primary-button full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="muted-text">Admin: admin@spa.com / admin123</p>
        <p className="form-footer">No tienes cuenta? <Link to="/register">Registrate</Link></p>
      </form>
    </section>
  );
}

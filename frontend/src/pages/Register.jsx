import { Mail, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-visual register">
        <span className="eyebrow">Nuevo perfil</span>
        <h1>Crea tu cuenta y reserva experiencias Serenity.</h1>
      </div>
      <form className="form-panel" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <label>
          Nombre
          <span className="input-icon"><User size={18} /></span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
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
          <input
            type="password"
            minLength="6"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <label>
          Rol
          <span className="input-icon"><ShieldCheck size={18} /></span>
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        {error && <div className="alert error">{error}</div>}
        <button className="primary-button full" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
        <p className="form-footer">Ya tienes cuenta? <Link to="/login">Inicia sesion</Link></p>
      </form>
    </section>
  );
}

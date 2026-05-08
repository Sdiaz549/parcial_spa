import { CalendarCheck2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { spaApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookAppointment() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: params.get('serviceId') || '',
    appointmentDate: new Date().toISOString().slice(0, 10),
    appointmentTime: '10:00'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    spaApi.services().then(setServices).catch((err) => setError(err.message));
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === String(form.serviceId)),
    [services, form.serviceId]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await spaApi.createAppointment({ ...form, serviceId: Number(form.serviceId) }, token);
      setMessage('Reserva creada correctamente');
      setTimeout(() => navigate('/my-appointments'), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell two-column">
      <div className="form-panel wide">
        <span className="eyebrow dark">Nueva reserva</span>
        <h1>Reservar cita</h1>
        <form onSubmit={handleSubmit} className="stacked-form">
          <label>
            Servicio
            <select
              value={form.serviceId}
              onChange={(event) => setForm({ ...form, serviceId: event.target.value })}
              required
            >
              <option value="">Selecciona un servicio</option>
              {services.filter((service) => service.active).map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label>
              Fecha
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.appointmentDate}
                onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })}
                required
              />
            </label>
            <label>
              Hora
              <input
                type="time"
                value={form.appointmentTime}
                onChange={(event) => setForm({ ...form, appointmentTime: event.target.value })}
                required
              />
            </label>
          </div>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <button className="primary-button full" disabled={loading || !form.serviceId}>
            <CalendarCheck2 size={18} /> {loading ? 'Reservando...' : 'Confirmar reserva'}
          </button>
        </form>
      </div>

      <aside className="detail-panel">
        {selectedService ? (
          <>
            <img src={selectedService.imageUrl} alt={selectedService.name} />
            <h2>{selectedService.name}</h2>
            <p>{selectedService.description}</p>
            <div className="summary-row"><span>Duracion</span><strong>{selectedService.durationMinutes} min</strong></div>
            <div className="summary-row"><span>Precio</span><strong>${Number(selectedService.price).toFixed(2)}</strong></div>
          </>
        ) : (
          <div className="empty-state">Selecciona un servicio para ver el resumen.</div>
        )}
      </aside>
    </section>
  );
}

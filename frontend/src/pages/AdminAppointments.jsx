import { RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { spaApi } from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];

export default function AdminAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(await spaApi.appointments(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    setMessage('');
    try {
      await spaApi.updateAppointmentStatus(id, status, token);
      setMessage('Estado actualizado');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Eliminar esta reserva?')) {
      return;
    }
    await spaApi.deleteAppointment(id, token);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow dark">Gestion de agenda</span>
          <h1>Admin reservas</h1>
        </div>
        <button className="secondary-button" onClick={load}><RefreshCcw size={17} /> Actualizar</button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}
      {loading ? (
        <div className="empty-state">Cargando reservas...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Cambiar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.userEmail}</td>
                  <td>{appointment.serviceName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime?.slice(0, 5)}</td>
                  <td><StatusBadge status={appointment.status} /></td>
                  <td>
                    <select value={appointment.status} onChange={(event) => updateStatus(appointment.id, event.target.value)}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="table-actions">
                    <button className="icon-button danger" onClick={() => remove(appointment.id)} title="Eliminar">
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && <div className="empty-state">No hay reservas registradas.</div>}
        </div>
      )}
    </section>
  );
}

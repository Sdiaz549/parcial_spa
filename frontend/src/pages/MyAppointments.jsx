import { RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { spaApi } from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(await spaApi.myAppointments(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <span className="eyebrow dark">Agenda personal</span>
          <h1>Mis reservas</h1>
        </div>
        <button className="secondary-button" onClick={load}><RefreshCcw size={17} /> Actualizar</button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="empty-state">Cargando reservas...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">Aun no tienes reservas.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.serviceName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime?.slice(0, 5)}</td>
                  <td><StatusBadge status={appointment.status} /></td>
                  <td className="table-actions">
                    <button className="icon-button danger" onClick={() => remove(appointment.id)} title="Eliminar">
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

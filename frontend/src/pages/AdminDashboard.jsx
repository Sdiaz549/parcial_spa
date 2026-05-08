import { CalendarCheck, ClipboardList, PlusCircle, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { spaApi } from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    Promise.all([spaApi.services(), spaApi.appointments(token)])
      .then(([serviceData, appointmentData]) => {
        setServices(serviceData);
        setAppointments(appointmentData);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page-shell">
      <div className="dashboard-hero admin">
        <div>
          <span className="eyebrow">Dashboard ADMIN</span>
          <h1>Gestion Serenity Spa</h1>
          <p>{user?.name}, administra servicios, reservas y estados desde un panel central.</p>
        </div>
        <div className="hero-actions small">
          <Link className="primary-button" to="/admin/services"><PlusCircle size={18} /> Servicios</Link>
          <Link className="secondary-button" to="/admin/appointments"><Settings2 size={18} /> Reservas</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><ClipboardList size={22} /><span>Servicios</span><strong>{services.length}</strong></div>
        <div className="stat-card"><CalendarCheck size={22} /><span>Reservas</span><strong>{appointments.length}</strong></div>
        <div className="stat-card"><Settings2 size={22} /><span>Pendientes</span><strong>{appointments.filter((item) => item.status === 'PENDING').length}</strong></div>
      </div>

      <div className="section-heading compact-heading">
        <h2>Reservas recientes</h2>
        <Link className="text-link" to="/admin/appointments">Gestionar</Link>
      </div>
      <div className="appointment-list">
        {appointments.slice(0, 5).map((appointment) => (
          <div className="appointment-item" key={appointment.id}>
            <div>
              <strong>{appointment.serviceName}</strong>
              <span>{appointment.userEmail} - {appointment.appointmentDate}</span>
            </div>
            <StatusBadge status={appointment.status} />
          </div>
        ))}
        {appointments.length === 0 && <div className="empty-state">No hay reservas registradas.</div>}
      </div>
    </section>
  );
}

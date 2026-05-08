import { CalendarDays, Flower2, ListChecks, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { spaApi } from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserDashboard() {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([spaApi.myAppointments(token), spaApi.services()])
      .then(([appointmentData, serviceData]) => {
        setAppointments(appointmentData);
        setServices(serviceData);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page-shell">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Dashboard USER</span>
          <h1>Hola, {user?.name}</h1>
          <p>Gestiona tus reservas y encuentra tu proxima experiencia Serenity.</p>
        </div>
        <Link className="primary-button" to="/book"><CalendarDays size={18} /> Nueva reserva</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><Flower2 size={22} /><span>Servicios</span><strong>{services.length}</strong></div>
        <div className="stat-card"><ListChecks size={22} /><span>Mis reservas</span><strong>{appointments.length}</strong></div>
        <div className="stat-card"><Sparkles size={22} /><span>Confirmadas</span><strong>{appointments.filter((item) => item.status === 'CONFIRMED').length}</strong></div>
      </div>

      <div className="section-heading compact-heading">
        <h2>Reservas recientes</h2>
        <Link className="text-link" to="/my-appointments">Ver todas</Link>
      </div>
      <div className="appointment-list">
        {appointments.slice(0, 4).map((appointment) => (
          <div className="appointment-item" key={appointment.id}>
            <div>
              <strong>{appointment.serviceName}</strong>
              <span>{appointment.appointmentDate} - {appointment.appointmentTime?.slice(0, 5)}</span>
            </div>
            <StatusBadge status={appointment.status} />
          </div>
        ))}
        {appointments.length === 0 && <div className="empty-state">No tienes reservas recientes.</div>}
      </div>
    </section>
  );
}

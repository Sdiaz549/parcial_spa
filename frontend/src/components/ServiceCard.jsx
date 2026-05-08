import { CalendarPlus, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ServiceCard({ service }) {
  const { isAuthenticated } = useAuth();
  const image = service.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="service-card">
      <img src={image} alt={service.name} loading="lazy" />
      <div className="service-card-body">
        <div className="service-card-title">
          <h3>{service.name}</h3>
          <span className={service.active ? 'status active' : 'status muted'}>{service.active ? 'Activo' : 'Inactivo'}</span>
        </div>
        <p>{service.description}</p>
        <div className="service-meta">
          <span><Clock size={16} /> {service.durationMinutes} min</span>
          <span><DollarSign size={16} /> {Number(service.price).toFixed(2)}</span>
        </div>
        <Link className="primary-button full" to={isAuthenticated ? `/book?serviceId=${service.id}` : '/login'}>
          <CalendarPlus size={18} /> Reservar cita
        </Link>
      </div>
    </article>
  );
}

import { ArrowRight, CalendarDays, CheckCircle2, Gem, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { spaApi } from '../api/client.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const [services, setServices] = useState([]);

  useEffect(() => {
    spaApi.services()
      .then((data) => setServices(data.slice(0, 3)))
      .catch(() => setServices([]));
  }, []);

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> Bienestar premium</span>
          <h1>Serenity Spa</h1>
          <p>
            Reserva rituales de relajacion, faciales y terapias corporales desde una plataforma moderna con gestion completa para clientes y administradores.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to={isAuthenticated ? '/book' : '/register'}>
              <CalendarDays size={19} /> Reservar ahora
            </Link>
            <Link className="secondary-button" to="/services">
              Ver servicios <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section intro-grid">
        <div>
          <span className="eyebrow dark"><Gem size={16} /> Experiencia Serenity</span>
          <h2>Un spa digital listo para operar</h2>
        </div>
        <div className="feature-list">
          <span><CheckCircle2 size={18} /> Rituales personalizados</span>
          <span><CheckCircle2 size={18} /> Agenda clara</span>
          <span><CheckCircle2 size={18} /> Atencion premium</span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">Servicios destacados</span>
            <h2>Rituales disenados para descansar</h2>
          </div>
          <Link className="text-link" to="/services">Explorar catalogo</Link>
        </div>
        <div className="cards-grid">
          {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </section>

      <section className="content-section split-band">
        <div>
          <h2>{role === 'ADMIN' ? 'Panel administrativo completo' : 'Tu agenda de bienestar en un solo lugar'}</h2>
          <p>
            {role === 'ADMIN'
              ? 'Gestiona servicios, supervisa reservas y cambia estados con una experiencia limpia y rapida.'
              : 'Consulta tus citas, reserva nuevos servicios y mantente al dia con el estado de cada experiencia.'}
          </p>
        </div>
        <Link className="primary-button" to={isAuthenticated ? '/dashboard' : '/login'}>
          Entrar al panel <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}

import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { spaApi } from '../api/client.js';
import ServiceCard from '../components/ServiceCard.jsx';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setServices(await spaApi.services());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow dark">Catalogo Serenity</span>
          <h1>Servicios del spa</h1>
        </div>
        <button className="secondary-button" onClick={load}><RefreshCcw size={17} /> Actualizar</button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="empty-state">Cargando servicios...</div>
      ) : (
        <div className="cards-grid">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
      )}
    </section>
  );
}

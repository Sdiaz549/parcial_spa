import { Edit3, RefreshCcw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { spaApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  durationMinutes: '',
  imageUrl: '',
  active: true
};

export default function AdminServices() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setError('');
    try {
      setServices(await spaApi.services());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      ...form,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes)
    };
    try {
      if (editingId) {
        await spaApi.updateService(editingId, payload, token);
        setMessage('Servicio actualizado');
      } else {
        await spaApi.createService(payload, token);
        setMessage('Servicio creado');
      }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      imageUrl: service.imageUrl || '',
      active: Boolean(service.active)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm('Eliminar este servicio?')) {
      return;
    }
    try {
      await spaApi.deleteService(id, token);
      setMessage('Servicio eliminado');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-shell admin-grid">
      <div className="form-panel wide">
        <span className="eyebrow dark">CRUD servicios</span>
        <h1>{editingId ? 'Editar servicio' : 'Crear servicio'}</h1>
        <form className="stacked-form" onSubmit={save}>
          <label>
            Nombre
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Descripcion
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" required />
          </label>
          <div className="form-grid">
            <label>
              Precio
              <input type="number" step="0.01" min="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            </label>
            <label>
              Duracion min
              <input type="number" min="1" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} required />
            </label>
          </div>
          <label>
            Imagen URL
            <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          </label>
          <label className="check-row">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
            Servicio activo
          </label>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <div className="form-actions">
            <button className="primary-button" type="submit"><Save size={18} /> Guardar</button>
            {editingId && <button className="secondary-button" type="button" onClick={reset}><X size={18} /> Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="management-panel">
        <div className="panel-heading">
          <h2>Servicios registrados</h2>
          <button className="icon-button" onClick={load} title="Actualizar"><RefreshCcw size={17} /></button>
        </div>
        <div className="service-admin-list">
          {services.map((service) => (
            <article className="service-admin-item" key={service.id}>
              <img src={service.imageUrl} alt={service.name} />
              <div>
                <strong>{service.name}</strong>
                <span>${Number(service.price).toFixed(2)} - {service.durationMinutes} min</span>
              </div>
              <div className="row-actions">
                <button className="icon-button" onClick={() => edit(service)} title="Editar"><Edit3 size={17} /></button>
                <button className="icon-button danger" onClick={() => remove(service.id)} title="Eliminar"><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const labels = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada'
};

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${status?.toLowerCase()}`}>{labels[status] || status}</span>;
}

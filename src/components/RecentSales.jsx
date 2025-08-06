import React from 'react';

const RecentSales = () => {
  const recentSales = [
    {
      id: '#001',
      customer: 'María García',
      items: 'Tomates, Lechugas, Zanahorias',
      amount: '$45.50',
      time: '10:30 AM',
      status: 'Completada'
    },
    {
      id: '#002',
      customer: 'Carlos Ruiz',
      items: 'Manzanas, Plátanos, Naranjas',
      amount: '$32.00',
      time: '10:15 AM',
      status: 'Completada'
    },
    {
      id: '#003',
      customer: 'Ana López',
      items: 'Papas, Cebollas, Cilantro',
      amount: '$28.75',
      time: '09:45 AM',
      status: 'Completada'
    },
    {
      id: '#004',
      customer: 'Pedro Martín',
      items: 'Brócoli, Espinacas, Apio',
      amount: '$38.90',
      time: '09:20 AM',
      status: 'Pendiente'
    }
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-history text-primary-blue me-2"></i>
          Ventas Recientes
        </h5>
        <button className="btn btn-outline-primary-orange btn-sm">
          Ver todas
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0 fw-semibold">ID</th>
                <th className="border-0 fw-semibold">Cliente</th>
                <th className="border-0 fw-semibold">Productos</th>
                <th className="border-0 fw-semibold">Total</th>
                <th className="border-0 fw-semibold">Hora</th>
                <th className="border-0 fw-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale, index) => (
                <tr key={index}>
                  <td className="fw-semibold text-primary-blue">{sale.id}</td>
                  <td>{sale.customer}</td>
                  <td className="text-muted small">{sale.items}</td>
                  <td className="fw-bold text-primary-green">{sale.amount}</td>
                  <td className="text-muted small">{sale.time}</td>
                  <td>
                    <span className={`badge ${sale.status === 'Completada' ? 'bg-primary-green' : 'bg-primary-orange'} bg-opacity-10 text-${sale.status === 'Completada' ? 'primary-green' : 'primary-orange'}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
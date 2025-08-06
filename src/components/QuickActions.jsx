import React from 'react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Nueva Venta',
      description: 'Registra una nueva transacción',
      icon: 'fas fa-cash-register',
      color: 'primary-orange',
      bgColor: 'bg-primary-orange'
    },
    {
      title: 'Agregar Producto',
      description: 'Añade productos al inventario',
      icon: 'fas fa-plus-circle',
      color: 'primary-green',
      bgColor: 'bg-primary-green'
    },
    {
      title: 'Ver Inventario',
      description: 'Consulta el stock disponible',
      icon: 'fas fa-warehouse',
      color: 'primary-blue',
      bgColor: 'bg-primary-blue'
    },
    {
      title: 'Reportes',
      description: 'Genera reportes de ventas',
      icon: 'fas fa-chart-bar',
      color: 'secondary-gray',
      bgColor: 'bg-secondary-gray'
    }
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 pb-0">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-bolt text-primary-orange me-2"></i>
          Acciones Rápidas
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {actions.map((action, index) => (
            <div key={index} className="col-md-6">
              <div className="d-flex align-items-center p-3 bg-light rounded-3 border border-light hover-shadow cursor-pointer">
                <div className={`${action.bgColor} bg-opacity-10 rounded-circle p-3 me-3`}>
                  <i className={`${action.icon} text-${action.color} fs-5`}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">{action.title}</h6>
                  <p className="mb-0 small text-muted">{action.description}</p>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
import React from 'react';

const LowStockAlert = () => {
  const lowStockItems = [
    {
      name: 'Tomates Cherry',
      current: 5,
      minimum: 20,
      unit: 'kg',
      urgency: 'high'
    },
    {
      name: 'Lechugas Romanas',
      current: 8,
      minimum: 15,
      unit: 'unidades',
      urgency: 'medium'
    },
    {
      name: 'Zanahorias',
      current: 12,
      minimum: 25,
      unit: 'kg',
      urgency: 'medium'
    },
    {
      name: 'Cilantro Fresco',
      current: 3,
      minimum: 10,
      unit: 'manojos',
      urgency: 'high'
    }
  ];

  const getUrgencyColor = (urgency) => {
    return urgency === 'high' ? 'primary-orange' : 'secondary-gray';
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-exclamation-triangle text-primary-orange me-2"></i>
          Productos con Stock Bajo
        </h5>
      </div>
      <div className="card-body">
        {lowStockItems.map((item, index) => (
          <div key={index} className="d-flex align-items-center mb-3 p-3 bg-light rounded-3">
            <div className={`bg-${getUrgencyColor(item.urgency)} bg-opacity-10 rounded-circle p-2 me-3`}>
              <i className={`fas fa-exclamation text-${getUrgencyColor(item.urgency)}`}></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-semibold">{item.name}</h6>
              <div className="d-flex align-items-center">
                <small className="text-muted me-3">
                  Stock actual: <span className="fw-bold">{item.current} {item.unit}</span>
                </small>
                <small className="text-muted">
                  Mínimo: <span className="fw-bold">{item.minimum} {item.unit}</span>
                </small>
              </div>
              <div className="progress mt-2" style={{height: '4px'}}>
                <div 
                  className={`progress-bar bg-${getUrgencyColor(item.urgency)}`}
                  style={{width: `${(item.current / item.minimum) * 100}%`}}
                ></div>
              </div>
            </div>
            <button className="btn btn-outline-primary-blue btn-sm">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        ))}
        <div className="text-center mt-3">
          <button className="btn btn-primary-blue btn-sm">
            Ver todo el inventario
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
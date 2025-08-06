import React from 'react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Ventas Hoy',
      value: '$2,450',
      icon: 'fas fa-dollar-sign',
      color: 'primary-orange',
      change: '+12%'
    },
    {
      title: 'Productos',
      value: '156',
      icon: 'fas fa-apple-alt',
      color: 'primary-green',
      change: '+3'
    },
    {
      title: 'Stock Bajo',
      value: '8',
      icon: 'fas fa-exclamation-triangle',
      color: 'primary-blue',
      change: '-2'
    },
    {
      title: 'Clientes',
      value: '45',
      icon: 'fas fa-users',
      color: 'secondary-gray',
      change: '+8'
    }
  ];

  return (
    <div className="row g-4 mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className={`flex-shrink-0 bg-${stat.color} bg-opacity-10 rounded-3 p-3`}>
                  <i className={`${stat.icon} text-${stat.color} fs-4`}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="row align-items-center g-0">
                    <div className="col">
                      <h3 className="mb-0 fw-bold">{stat.value}</h3>
                      <p className="text-muted mb-0 small">{stat.title}</p>
                    </div>
                    <div className="col-auto">
                      <span className={`badge bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
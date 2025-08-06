import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesByBranchChart = ({ data }) => {
  // Calcular estadísticas
  const totalSales = data?.reduce((acc, item) => acc + (item.total_ventas || 0), 0) || 0;
  const topBranch = data?.length ? data.reduce((prev, current) => (prev.total_ventas > current.total_ventas) ? prev : current) : null;
  const activeBranches = data?.length || 0;

  return (
    <div className="card border-0 shadow-sm h-100 fade-in-up">
      <div className="card-header bg-white border-0 pb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-store text-primary-orange me-2"></i>
              Ventas por Sucursal
            </h5>
            <small className="text-muted">Comparativo de rendimiento</small>
          </div>
          <div className="text-end">
            <div className="fw-bold text-primary-orange">
              {activeBranches}
            </div>
            <small className="text-muted">Sucursales</small>
          </div>
        </div>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBranch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-orange)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-orange)" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorBranchHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-blue)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-blue)" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="sucursal_nombre" 
              tick={{ fontSize: 11, fill: '#6c757d' }}
              axisLine={{ stroke: '#dee2e6' }}
              tickLine={{ stroke: '#dee2e6' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6c757d' }}
              axisLine={{ stroke: '#dee2e6' }}
              tickLine={{ stroke: '#dee2e6' }}
              tickFormatter={(value) => `₡${(value/1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`₡${value.toLocaleString('es-CR')}`, 'Ventas Totales']}
              labelFormatter={(label) => `Sucursal: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="total_ventas" 
              fill="url(#colorBranch)" 
              name="Ventas Totales"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Información de la sucursal líder */}
        {topBranch && (
          <div className="mt-3 pt-3 border-top">
            <div className="row align-items-center">
              <div className="col-8">
                <div className="d-flex align-items-center">
                  <i className="fas fa-trophy text-primary-orange me-2"></i>
                  <div>
                    <div className="fw-bold text-dark">{topBranch.sucursal_nombre}</div>
                    <small className="text-muted">Sucursal líder</small>
                  </div>
                </div>
              </div>
              <div className="col-4 text-end">
                <div className="fw-bold text-primary-orange">
                  ₡{topBranch.total_ventas.toLocaleString('es-CR')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesByBranchChart;
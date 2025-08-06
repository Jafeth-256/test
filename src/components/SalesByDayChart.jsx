import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesByDayChart = ({ data }) => {
  // Calcular estadísticas para mostrar en el resumen
  const totalSales = data?.reduce((acc, item) => acc + (Number(item.venta_total) || 0), 0) || 0;
  const averageSales = data?.length && totalSales > 0 ? totalSales / data.length : 0;
  const maxSales = data?.length ? Math.max(...data.map(item => Number(item.venta_total) || 0)) : 0;

  return (
    <div className="card border-0 shadow-sm h-100 fade-in-up">
      <div className="card-header bg-white border-0 pb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-chart-line text-primary-blue me-2"></i>
              Evolución de Ventas
            </h5>
            <small className="text-muted">Tendencia de ventas por día</small>
          </div>
          <div className="text-end">
            <div className="fw-bold text-primary-blue">
              ₡{totalSales.toLocaleString('es-CR')}
            </div>
            <small className="text-muted">Total período</small>
          </div>
        </div>
      </div>
      <div className="card-body">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-blue)" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="var(--primary-blue)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary-blue)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="fecha_venta" 
                tick={{ fontSize: 11, fill: '#6c757d' }}
                axisLine={{ stroke: '#dee2e6' }}
                tickLine={{ stroke: '#dee2e6' }}
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
                formatter={(value) => [`₡${value.toLocaleString('es-CR')}`, 'Venta Total']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Area 
                type="monotone" 
                dataKey="venta_total" 
                stroke="var(--primary-blue)" 
                strokeWidth={2}
                fill="url(#colorSales)" 
                name="Venta Total"
                dot={{ fill: 'var(--primary-blue)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'var(--primary-orange)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-5">
            <div className="position-relative d-inline-block mb-4">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%)',
                  opacity: '0.1'
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#fff'
                  }}
                >
                  <i className="fas fa-chart-line text-primary-blue fa-2x"></i>
                </div>
              </div>
            </div>
            <h6 className="fw-bold text-muted mb-2">Sin datos de ventas</h6>
            <p className="text-muted small mb-0">La evolución de ventas aparecerá aquí cuando haya registros disponibles</p>
          </div>
        )}
        
        {/* Resumen de estadísticas */}
        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold text-primary-blue">
                ₡{averageSales > 0 ? averageSales.toLocaleString('es-CR', { maximumFractionDigits: 0 }) : '0'}
              </div>
              <small className="text-muted">Promedio diario</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-primary-green">
                ₡{maxSales.toLocaleString('es-CR')}
              </div>
              <small className="text-muted">Día máximo</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-primary-orange">
                {data?.length || 0}
              </div>
              <small className="text-muted">Días registrados</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesByDayChart;
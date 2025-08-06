import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colores consistentes con el tema
const COLORS = {
  'Efectivo': '#28a745', // primary-green
  'Tarjeta': '#007bff',  // primary-blue  
  'SINPE': '#fd7e14'     // primary-orange
};

const PaymentMethodChart = ({ data }) => {
  const paymentData = [
    { 
      name: 'Efectivo', 
      value: Number(data?.total_efectivo) || 0,
      icon: 'fas fa-money-bill-wave',
      color: COLORS['Efectivo']
    },
    { 
      name: 'Tarjeta', 
      value: Number(data?.total_tarjeta) || 0,
      icon: 'fas fa-credit-card',
      color: COLORS['Tarjeta']
    },
    { 
      name: 'SINPE', 
      value: Number(data?.total_sinpe) || 0,
      icon: 'fas fa-mobile-alt',
      color: COLORS['SINPE']
    }
  ].filter(item => item.value > 0);

  const totalPayments = paymentData.reduce((acc, item) => acc + item.value, 0);
  const mostUsedMethod = paymentData.length > 0 ? 
    paymentData.reduce((prev, current) => (prev.value > current.value) ? prev : current) : null;

  return (
    <div className="card border-0 shadow-sm h-100 fade-in-up">
      <div className="card-header bg-white border-0 pb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-credit-card text-primary-blue me-2"></i>
              Métodos de Pago
            </h5>
            <small className="text-muted">Distribución por tipo de pago</small>
          </div>
          <div className="text-end">
            <div className="fw-bold text-primary-blue">
              {paymentData.length}
            </div>
            <small className="text-muted">Métodos</small>
          </div>
        </div>
      </div>
      <div className="card-body">
        {paymentData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    if (percent < 0.08) return null;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="white" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`₡${value.toLocaleString('es-CR')}`, 'Monto']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Resumen total */}
            <div className="text-center mb-3 p-3 bg-light rounded">
              <div className="fw-bold text-primary-blue h5 mb-1">
                ₡{totalPayments.toLocaleString('es-CR')}
              </div>
              <small className="text-muted">Total en ventas</small>
            </div>

            {/* Detalles de métodos de pago */}
            <div className="mt-3 pt-3 border-top">
              {paymentData.map((method, index) => {
                const percentage = totalPayments > 0 ? (method.value / totalPayments) * 100 : 0;
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <i className={`${method.icon} me-2`} style={{ color: method.color }}></i>
                      <span className="fw-medium">{method.name}</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold" style={{ color: method.color }}>
                        ₡{method.value.toLocaleString('es-CR')}
                      </div>
                      {percentage > 0 && <small className="text-muted">{percentage.toFixed(1)}%</small>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Método más usado */}
            {mostUsedMethod && (
              <div className="mt-3 pt-3 border-top bg-light rounded p-2">
                <div className="d-flex align-items-center justify-content-center">
                  <i className={`${mostUsedMethod.icon} me-2`} style={{ color: mostUsedMethod.color }}></i>
                  <div className="text-center">
                    <div className="fw-bold text-dark">{mostUsedMethod.name}</div>
                    <small className="text-muted">Método más utilizado</small>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            {/* Círculo de estadísticas vacío */}
            <div className="position-relative d-inline-block mb-4">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-orange) 100%)',
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
                  <i className="fas fa-chart-pie text-primary-blue fa-2x"></i>
                </div>
              </div>
            </div>
            <h6 className="fw-bold text-muted mb-2">Sin datos disponibles</h6>
            <p className="text-muted small mb-0">Los métodos de pago aparecerán aquí cuando haya ventas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodChart;
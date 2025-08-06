import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockChart = ({ data }) => {
  return (
    <div className="card border-0 shadow-sm h-100 fade-in-up">
      <div className="card-header bg-white border-0 pb-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-boxes text-primary-green me-2"></i>
          Stock Actual de Productos
        </h5>
        <small className="text-muted">Inventario disponible por producto</small>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorStock" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="colorStockHover" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="var(--primary-orange)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-orange)" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#6c757d' }}
              axisLine={{ stroke: '#dee2e6' }}
            />
            <YAxis 
              dataKey="nombre_producto" 
              type="category" 
              width={150} 
              tick={{ fontSize: 11, fill: '#6c757d' }}
              axisLine={{ stroke: '#dee2e6' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value} unidades`, 'Stock Actual']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="stock_actual" 
              fill="url(#colorStock)" 
              name="Stock Actual"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Indicador de estado del stock */}
        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold text-primary-green">
                {data?.filter(item => item.stock_actual > 50).length || 0}
              </div>
              <small className="text-muted">Stock Alto</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-primary-orange">
                {data?.filter(item => item.stock_actual > 10 && item.stock_actual <= 50).length || 0}
              </div>
              <small className="text-muted">Stock Medio</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-danger">
                {data?.filter(item => item.stock_actual <= 10).length || 0}
              </div>
              <small className="text-muted">Stock Bajo</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
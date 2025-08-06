import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import QuickActions from '../components/QuickActions';
import RecentSales from '../components/RecentSales';
import LowStockAlert from '../components/LowStockAlert';
import '../styles/custom.css';

const Home = () => {
  return (
    <div className="app-layout bg-light">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="main-content">
        {/* Header */}
        <Header />
        
        {/* Área de contenido */}
        <div className="content-area">
          <div className="container-fluid p-4">
            {/* Header de bienvenida */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h3 className="fw-bold text-dark mb-1">¡Buen día, Juan!</h3>
                    <p className="text-muted mb-0">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary-green">
                      <i className="fas fa-download me-1"></i>
                      Exportar
                    </button>
                    <button className="btn btn-primary-orange">
                      <i className="fas fa-plus me-1"></i>
                      Nueva Venta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="fade-in-up">
              <StatsCards />
            </div>

            {/* Contenido principal */}
            <div className="row g-4">
              {/* Columna izquierda */}
              <div className="col-xl-8 col-lg-7">
                {/* Acciones rápidas */}
                <div className="mb-4 fade-in-up">
                  <QuickActions />
                </div>
                
                {/* Ventas recientes */}
                <div className="fade-in-up">
                  <RecentSales />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-xl-4 col-lg-5">
                {/* Alerta de stock bajo */}
                <div className="mb-4 fade-in-up">
                  <LowStockAlert />
                </div>

                {/* Información adicional */}
                <div className="card border-0 shadow-sm fade-in-up">
                  <div className="card-header bg-white border-0">
                    <h5 className="card-title mb-0 fw-bold">
                      <i className="fas fa-info-circle text-primary-blue me-2"></i>
                      Resumen del Día
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Ventas completadas</span>
                      <span className="fw-bold text-primary-green">24</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Productos vendidos</span>
                      <span className="fw-bold">156 unidades</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Promedio por venta</span>
                      <span className="fw-bold text-primary-blue">$38.50</span>
                    </div>
                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Meta del día</span>
                      <span className="fw-bold text-primary-orange">85% completada</span>
                    </div>
                    <div className="progress mt-2" style={{height: '6px'}}>
                      <div 
                        className="progress-bar bg-primary-orange" 
                        style={{width: '85%'}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Widget de clima del día */}
                <div className="card border-0 shadow-sm mt-4 fade-in-up">
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-sun text-primary-orange fs-3 me-2"></i>
                      <div>
                        <h6 className="fw-bold mb-0">Clima ideal</h6>
                        <small className="text-muted">Para venta de productos frescos</small>
                      </div>
                    </div>
                    <div className="row text-center mt-3">
                      <div className="col-6">
                        <div className="fw-bold text-primary-green">28°C</div>
                        <small className="text-muted">Temperatura</small>
                      </div>
                      <div className="col-6">
                        <div className="fw-bold text-primary-blue">65%</div>
                        <small className="text-muted">Humedad</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
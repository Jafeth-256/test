// components/ReportButton.js
import React, { useState } from 'react';
import usePDFReport from '../hooks/useReports';

const ReportButton = ({ 
  ventas, 
  estadisticas, 
  sucursales, 
  showWeeklyView,
  filtroFecha,
  filtroSucursal,
  getWeeklyData,
  getWeeklyStats 
}) => {
  const { generateSalesReport, isGenerating } = usePDFReport();
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerateReport = async () => {
    try {
      // Obtener nombre de la sucursal si hay filtro
      const sucursalNombre = filtroSucursal ? 
        sucursales.find(s => s.id == filtroSucursal)?.nombre : null;

      // Preparar datos según el tipo de vista
      const reportData = {
        ventas: showWeeklyView ? getWeeklyData() : ventas,
        estadisticas: showWeeklyView ? getWeeklyStats() : estadisticas,
        showWeeklyView
      };

      // Filtros aplicados
      const filters = {
        filtroFecha,
        filtroSucursal,
        sucursalNombre,
        fechaGeneracion: new Date().toISOString()
      };

      await generateSalesReport(reportData, filters);
      setShowOptions(false);
      
      // Mostrar mensaje de éxito
      showSuccessMessage();
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage();
    }
  };

  const showSuccessMessage = () => {
    // Crear toast de éxito
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show position-fixed" 
           style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
        <i class="fas fa-check-circle me-2"></i>
        Reporte generado exitosamente
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 5000);
  };

  const showErrorMessage = () => {
    // Crear toast de error
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show position-fixed" 
           style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
        <i class="fas fa-exclamation-circle me-2"></i>
        Error al generar el reporte
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 5000);
  };

  return (
    <div className="position-relative">
      <button 
        className="btn btn-outline-primary-green dropdown-toggle"
        onClick={() => setShowOptions(!showOptions)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Generando...
          </>
        ) : (
          <>
            <i className="fas fa-download me-1"></i>
            Exportar
          </>
        )}
      </button>

      {showOptions && (
        <div className="dropdown-menu show position-absolute" style={{ top: '100%', left: 0 }}>
          <div className="dropdown-header">
            <small className="text-muted">Generar reporte de ventas</small>
          </div>
          <div className="dropdown-divider"></div>
          
          <div className="px-3 py-2">
            <div className="small text-muted mb-2">Tipo de reporte:</div>
            <div className="small">
              <i className="fas fa-file-pdf text-danger me-1"></i>
              {showWeeklyView ? 'Reporte Semanal' : 'Reporte Diario'}
            </div>
          </div>

          {(filtroFecha || filtroSucursal) && (
            <>
              <div className="dropdown-divider"></div>
              <div className="px-3 py-2">
                <div className="small text-muted mb-2">Filtros aplicados:</div>
                {filtroFecha && (
                  <div className="small">
                    <i className="fas fa-calendar me-1"></i>
                    {new Date(filtroFecha).toLocaleDateString('es-ES')}
                  </div>
                )}
                {filtroSucursal && (
                  <div className="small">
                    <i className="fas fa-store me-1"></i>
                    {sucursales.find(s => s.id == filtroSucursal)?.nombre}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="dropdown-divider"></div>
          <div className="px-3 py-2">
            <button 
              className="btn btn-primary-green btn-sm w-100"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Generando PDF...
                </>
              ) : (
                <>
                  <i className="fas fa-file-pdf me-1"></i>
                  Generar PDF
                </>
              )}
            </button>
          </div>
          
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item small text-muted"
            onClick={() => setShowOptions(false)}
          >
            <i className="fas fa-times me-1"></i>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportButton;
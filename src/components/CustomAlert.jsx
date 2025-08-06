import React from 'react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  showCopyButton = false, 
  copyText = '',
  confirmText = 'Aceptar',
  onConfirm
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: 'fa-check-circle', color: 'text-success' };
      case 'error':
        return { icon: 'fa-exclamation-circle', color: 'text-danger' };
      case 'warning':
        return { icon: 'fa-exclamation-triangle', color: 'text-warning' };
      case 'password':
        return { icon: 'fa-key', color: 'text-primary-purple' };
      default:
        return { icon: 'fa-info-circle', color: 'text-info' };
    }
  };

  const { icon, color } = getIconAndColor();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      // Mostrar feedback visual de copiado
      const copyBtn = document.getElementById('copy-btn');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check me-1"></i>¡Copiado!';
      copyBtn.classList.add('btn-success');
      copyBtn.classList.remove('btn-outline-primary');
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-outline-primary');
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <i className={`fas ${icon} ${color} fa-2x me-3`}></i>
              <h5 className="modal-title fw-bold mb-0">{title}</h5>
            </div>
          </div>
          <div className="modal-body pt-2">
            <p className="text-muted mb-3">{message}</p>
            
            {showCopyButton && copyText && (
              <div className="bg-light p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1">
                    <small className="text-muted">Contraseña temporal:</small>
                    <div className="fw-bold font-monospace text-dark fs-5">{copyText}</div>
                  </div>
                  <button 
                    id="copy-btn"
                    className="btn btn-outline-primary btn-sm ms-2"
                    onClick={handleCopy}
                  >
                    <i className="fas fa-copy me-1"></i>Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button 
              type="button" 
              className="btn btn-primary-purple px-4"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
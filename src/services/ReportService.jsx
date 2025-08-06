import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



class ReportService {
  constructor() {
    this.doc = null;
    this.currentY = 0;
  }

  colors = {
    primary: '#2E7D32',
    secondary: '#1976D2',
    accent: '#FF9800',
    purple: '#7B1FA2',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    dark: '#212529',
    light: '#F8F9FA'
  };

  initDocument() {
    this.doc = new jsPDF();
    this.currentY = 20;
  }

  addHeader(title, subtitle = '', filters = {}) {
    const pageWidth = this.doc.internal.pageSize.width;

    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.primary);
    this.doc.text('SISTEMA DE VENTAS', pageWidth / 2, this.currentY, { align: 'center' });

    this.currentY += 10;

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.dark);
    this.doc.text(title, pageWidth / 2, this.currentY, { align: 'center' });

    this.currentY += 8;

    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(this.colors.secondary);
      this.doc.text(subtitle, pageWidth / 2, this.currentY, { align: 'center' });
      this.currentY += 8;
    }

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(this.colors.dark);
    this.doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 
                  pageWidth - 20, this.currentY, { align: 'right' });

    this.currentY += 10;
  }

  formatCurrency(amount) {
    return `CRC ${parseFloat(amount || 0).toLocaleString('es-CR', { minimumFractionDigits: 2 })}`;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  addFooter() {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;

    this.doc.setDrawColor(this.colors.light);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(this.colors.secondary);
    this.doc.text('Sistema de Gestión de Ventas - Generado automáticamente', 
                  pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  generateWeeklyReportBySucursal(ventas) {
    this.initDocument();

    const semanas = {};
    ventas.forEach(venta => {
      const fecha = new Date(venta.fecha_venta);
      const dia = fecha.getDay();
      const diferencia = (dia >= 2) ? dia - 2 : dia + 5;
      const inicio = new Date(fecha);
      inicio.setDate(fecha.getDate() - diferencia);
      inicio.setHours(0, 0, 0, 0);

      const clave = inicio.toISOString().split('T')[0];
      if (!semanas[clave]) semanas[clave] = [];
      semanas[clave].push(venta);
    });

    const sortedSemanas = Object.entries(semanas).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );

    sortedSemanas.forEach(([fechaInicio, ventasSemana]) => {
      const inicio = new Date(fechaInicio);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);

      this.doc.setFontSize(14);
      this.doc.setTextColor(this.colors.primary);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Semana del ${this.formatDate(inicio)} al ${this.formatDate(fin)}`, 20, this.currentY);
      this.currentY += 8;

      const sucursales = ventasSemana.reduce((acc, venta) => {
        const key = venta.sucursal_nombre;
        if (!acc[key]) acc[key] = [];
        acc[key].push(venta);
        return acc;
      }, {});

      Object.entries(sucursales).forEach(([sucursal, ventasSucursal]) => {
        this.doc.setFontSize(12);
        this.doc.setTextColor(this.colors.dark);
        this.doc.text(`Sucursal: ${sucursal}`, 20, this.currentY);
        this.currentY += 6;

        const tableData = ventasSucursal.map(v => [
          v.sucursal_tipo,
          this.formatDate(v.fecha_venta),
          this.formatCurrency(v.venta_efectivo),
          this.formatCurrency(v.venta_tarjeta),
          this.formatCurrency(v.venta_sinpe),
          this.formatCurrency(v.venta_total),
          this.capitalizeFirst(v.estado)
        ]);

        autoTable(this.doc, {
          head: [['Tipo', 'Fecha', 'Efectivo', 'Tarjeta', 'SINPE', 'Total', 'Estado']],
          body: tableData,
          startY: this.currentY,
          theme: 'grid',
          headStyles: {
            fillColor: [46, 125, 50],
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [33, 37, 41]
          },
          styles: {
            overflow: 'linebreak',
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 'wrap' },
            1: { cellWidth: 'wrap' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' },
            6: { halign: 'center' }
          },
          margin: { left: 20, right: 20 }
        });

        this.currentY = this.doc.lastAutoTable.finalY + 10;
      });

      this.doc.setDrawColor(this.colors.light);
      this.doc.line(20, this.currentY, this.doc.internal.pageSize.width - 20, this.currentY);
      this.currentY += 10;
    });

    this.addFooter();
    return this.doc;
  }

  downloadPDF(filename = 'reporte.pdf') {
    if (this.doc) {
      this.doc.save(filename);
    }
  }

  getPDFBlob() {
    if (this.doc) {
      return this.doc.output('blob');
    }
    return null;
  }

  generateDailyReport(ventas, estadisticas, filters = {}) {
  this.initDocument();

  // Header
  this.addHeader('REPORTE DE VENTAS DIARIAS', 'Detalle de ventas por día', filters);

  // Estadísticas (totales generales)
  this.doc.setFontSize(14);
  this.doc.setFont('helvetica', 'bold');
  this.doc.setTextColor(this.colors.dark);
  this.doc.text(`Resumen General`, 20, this.currentY);
  this.currentY += 10;

  const statsData = [
    ['Concepto', 'Monto'],
    ['Total Ventas', this.formatCurrency(estadisticas.total_ventas)],
    ['Efectivo', this.formatCurrency(estadisticas.total_efectivo)],
    ['Tarjeta', this.formatCurrency(estadisticas.total_tarjeta)],
    ['SINPE', this.formatCurrency(estadisticas.total_sinpe)]
  ];

  autoTable(this.doc, {
    head: [statsData[0]],
    body: statsData.slice(1),
    startY: this.currentY,
    theme: 'grid',
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: 255,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [33, 37, 41],
      fontSize: 9
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2
    },
    margin: { left: 20, right: 20 }
  });

  this.currentY = this.doc.lastAutoTable.finalY + 10;

  // Verificar si hay ventas
  if (!ventas || ventas.length === 0) {
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.colors.secondary);
    this.doc.text('No se encontraron registros para los filtros aplicados.', 20, this.currentY);
    return this.doc;
  }

  // Tabla de ventas
  this.doc.setFontSize(14);
  this.doc.setFont('helvetica', 'bold');
  this.doc.setTextColor(this.colors.dark);
  this.doc.text('Detalle de Ventas', 20, this.currentY);
  this.currentY += 8;

  const tableData = ventas.map(v => [
    v.sucursal_nombre,
    v.sucursal_tipo,
    this.formatDate(v.fecha_venta),
    this.formatCurrency(v.venta_efectivo),
    this.formatCurrency(v.venta_tarjeta),
    this.formatCurrency(v.venta_sinpe),
    this.formatCurrency(v.venta_total),
    this.capitalizeFirst(v.estado)
  ]);

  autoTable(this.doc, {
    head: [['Sucursal', 'Tipo', 'Fecha', 'Efectivo', 'Tarjeta', 'SINPE', 'Total', 'Estado']],
    body: tableData,
    startY: this.currentY,
    theme: 'striped',
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [33, 37, 41]
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 'wrap' },
      1: { cellWidth: 'wrap' },
      2: { cellWidth: 'wrap' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' },
      7: { halign: 'center' }
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    }
  });

  this.addFooter();
  return this.doc;
}

generateInventoryReport(inventory, filters = {}) {
    this.initDocument();

    // Header
    this.addHeader('REPORTE DE INVENTARIO', 'Estado actual del inventario', filters);

    // Verify if there is inventory
    if (!inventory || inventory.length === 0) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(this.colors.secondary);
      this.doc.text('No se encontraron registros de inventario.', 20, this.currentY);
      this.addFooter();
      return this.doc;
    }

    // Inventory table
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.dark);
    this.doc.text('Detalle de Inventario', 20, this.currentY);
    this.currentY += 8;

    const tableData = inventory.map(i => [
      i.nombre_producto,
      i.categoria,
      i.stock_actual,
      i.stock_minimo,
      this.formatCurrency(i.precio_unitario),
      this.formatDate(i.fecha_ingreso),
      i.fecha_vencimiento ? this.formatDate(i.fecha_vencimiento) : 'N/A',
      this.capitalizeFirst(i.estado)
    ]);

    autoTable(this.doc, {
      head: [['Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Precio Unitario', 'Fecha Ingreso', 'Fecha Venc.', 'Estado']],
      body: tableData,
      startY: this.currentY,
      theme: 'striped',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [33, 37, 41]
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { cellWidth: 'wrap' },
        6: { cellWidth: 'wrap' },
        7: { halign: 'center' }
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    this.addFooter();
    return this.doc;
  }

  generateProductReport(products, filters = {}) {
    this.initDocument();

    // Header
    this.addHeader('REPORTE DE PRODUCTOS', 'Listado de productos registrados', filters);

    // Verify if there are products
    if (!products || products.length === 0) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(this.colors.secondary);
      this.doc.text('No se encontraron registros de productos.', 20, this.currentY);
      this.addFooter();
      return this.doc;
    }

    // Products table
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.dark);
    this.doc.text('Detalle de Productos', 20, this.currentY);
    this.currentY += 8;

    const tableData = products.map(p => [
      p.nombre,
      p.categoria,
      p.unidad_medida,
      p.descripcion,
      this.capitalizeFirst(p.estado),
      this.formatDate(p.fecha_registro)
    ]);

    autoTable(this.doc, {
      head: [['Nombre', 'Categoría', 'Unidad', 'Descripción', 'Estado', 'Fecha Registro']],
      body: tableData,
      startY: this.currentY,
      theme: 'striped',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [33, 37, 41]
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'wrap' },
        4: { halign: 'center' },
        5: { cellWidth: 'wrap' }
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    this.addFooter();
    return this.doc;
  }

  generateSupplierReport(suppliers, filters = {}) {
    this.initDocument();

    // Header
    this.addHeader('REPORTE DE PROVEEDORES', 'Listado de proveedores registrados', filters);

    // Verify if there are suppliers
    if (!suppliers || suppliers.length === 0) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(this.colors.secondary);
      this.doc.text('No se encontraron registros de proveedores.', 20, this.currentY);
      this.addFooter();
      return this.doc;
    }

    // Suppliers table
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.dark);
    this.doc.text('Detalle de Proveedores', 20, this.currentY);
    this.currentY += 8;

    const tableData = suppliers.map(s => [
      s.nombre,
      s.empresa,
      s.telefono,
      s.email,
      s.direccion,
      s.ciudad,
      s.tipo_proveedor,
      this.capitalizeFirst(s.estado)
    ]);

    autoTable(this.doc, {
      head: [['Nombre', 'Empresa', 'Teléfono', 'Email', 'Dirección', 'Ciudad', 'Tipo', 'Estado']],
      body: tableData,
      startY: this.currentY,
      theme: 'striped',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [33, 37, 41]
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'wrap' },
        4: { cellWidth: 'wrap' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { halign: 'center' }
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    this.addFooter();
    return this.doc;
  }

}

export default ReportService;

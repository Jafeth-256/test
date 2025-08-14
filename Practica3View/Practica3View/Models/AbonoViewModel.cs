using System.ComponentModel.DataAnnotations;

namespace Practica3View.Models
{
    public class AbonoViewModel
    {
        [Required(ErrorMessage = "Debe seleccionar una compra")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una compra válida")]
        public long Id_Compra { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El saldo debe ser mayor a cero")]
        public decimal SaldoAnterior { get; set; }

        [Required(ErrorMessage = "El abono es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El abono debe ser mayor a cero")]
        public decimal Abono { get; set; }

        public List<Principal> ComprasPendientes { get; set; } = new List<Principal>();
    }
}
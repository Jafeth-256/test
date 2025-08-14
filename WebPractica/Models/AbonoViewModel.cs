using System.ComponentModel.DataAnnotations;

namespace WebPractica.Models
{
    public class AbonoViewModel
    {
        [Display(Name = "Compra")]
        [Required(ErrorMessage = "Debe seleccionar una compra.")]
        public long Id_Compra { get; set; }

        [Display(Name = "Saldo Anterior")]
        [DataType(DataType.Currency)]
        public decimal Saldo_Anterior { get; set; }

        [Display(Name = "Abono")]
        [Required(ErrorMessage = "El monto del abono es requerido.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El abono debe ser mayor a cero.")]
        [DataType(DataType.Currency)]
        public decimal Monto { get; set; }
    }
}

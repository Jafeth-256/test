namespace Practica3View.Models
{
    public class Principal
    {
        public long Id_Compra { get; set; }
        public decimal Precio { get; set; }
        public decimal Saldo { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
    }

    public class Abonos
    {
        public long Id_Compra { get; set; }
        public long Id_Abono { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
    }

    public class RespuestaEstandar
    {
        public int Codigo { get; set; }
        public string? Mensaje { get; set; }
        public object? Contenido { get; set; }
    }

    public class AbonoViewModel
    {
        public long Id_Compra { get; set; }
        public decimal SaldoAnterior { get; set; }
        public decimal Abono { get; set; }
        public List<Principal> ComprasPendientes { get; set; } = new List<Principal>();
    }
}
using Dapper;
using Practica3.Models;
using Practica3.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Practica3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUtilitarios _utilitarios;

        public ComprasController(IConfiguration configuration, IUtilitarios utilitarios)
        {
            _configuration = configuration;
            _utilitarios = utilitarios;
        }

        [HttpGet]
        [Route("ConsultarCompras")]
        public IActionResult ConsultarCompras()
        {
            using (var context = new SqlConnection(_configuration.GetSection("ConnectionStrings:Connection").Value))
            {
                var resultado = context.Query<Principal>("ConsultarCompras");

                if (resultado != null && resultado.Any())
                    return Ok(_utilitarios.RespuestaCorrecta(resultado));
                else
                    return BadRequest(_utilitarios.RespuestaIncorrecta("No hay información registrada"));
            }
        }

        [HttpGet]
        [Route("ConsultarComprasPendientes")]
        public IActionResult ConsultarComprasPendientes()
        {
            using (var context = new SqlConnection(_configuration.GetSection("ConnectionStrings:Connection").Value))
            {
                var resultado = context.Query<Principal>("ConsultarComprasPendientes");

                if (resultado != null && resultado.Any())
                    return Ok(_utilitarios.RespuestaCorrecta(resultado));
                else
                    return BadRequest(_utilitarios.RespuestaIncorrecta("No hay compras pendientes"));
            }
        }

        [HttpGet]
        [Route("ObtenerSaldoCompra")]
        public IActionResult ObtenerSaldoCompra(long idCompra)
        {
            using (var context = new SqlConnection(_configuration.GetSection("ConnectionStrings:Connection").Value))
            {
                var resultado = context.QueryFirstOrDefault<decimal>("ObtenerSaldoCompra",
                    new { Id_Compra = idCompra });

                return Ok(_utilitarios.RespuestaCorrecta(resultado));
            }
        }

        [HttpPost]
        [Route("RegistrarAbono")]
        public IActionResult RegistrarAbono(Abonos abono)
        {
            using (var context = new SqlConnection(_configuration.GetSection("ConnectionStrings:Connection").Value))
            {
                var resultado = context.Execute("RegistrarAbono",
                    new
                    {
                        abono.Id_Compra,
                        abono.Monto
                    });

                if (resultado > 0)
                    return Ok(_utilitarios.RespuestaCorrecta(null));
                else
                    return BadRequest(_utilitarios.RespuestaIncorrecta("El abono no fue registrado"));
            }
        }
    }
}
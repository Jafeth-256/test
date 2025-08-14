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
            try
            {
                using (var context = new SqlConnection(_configuration.GetConnectionString("Connection")))
                {
                    var resultado = context.Query<Principal>("ConsultarCompras", commandType: System.Data.CommandType.StoredProcedure);

                    if (resultado != null && resultado.Any())
                        return Ok(_utilitarios.RespuestaCorrecta(resultado));
                    else
                        return Ok(_utilitarios.RespuestaIncorrecta("No hay información registrada"));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, _utilitarios.RespuestaIncorrecta($"Error interno: {ex.Message}"));
            }
        }

        [HttpGet]
        [Route("ConsultarComprasPendientes")]
        public IActionResult ConsultarComprasPendientes()
        {
            try
            {
                using (var context = new SqlConnection(_configuration.GetConnectionString("Connection")))
                {
                    var resultado = context.Query<Principal>("ConsultarComprasPendientes", commandType: System.Data.CommandType.StoredProcedure);

                    if (resultado != null && resultado.Any())
                        return Ok(_utilitarios.RespuestaCorrecta(resultado));
                    else
                        return Ok(_utilitarios.RespuestaIncorrecta("No hay compras pendientes"));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, _utilitarios.RespuestaIncorrecta($"Error interno: {ex.Message}"));
            }
        }

        [HttpGet]
        [Route("ObtenerSaldoCompra")]
        public IActionResult ObtenerSaldoCompra(long idCompra)
        {
            try
            {
                using (var context = new SqlConnection(_configuration.GetConnectionString("Connection")))
                {
                    var resultado = context.QueryFirstOrDefault<decimal?>("ObtenerSaldoCompra",
                        new { Id_Compra = idCompra },
                        commandType: System.Data.CommandType.StoredProcedure);

                    return Ok(_utilitarios.RespuestaCorrecta(resultado ?? 0));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, _utilitarios.RespuestaIncorrecta($"Error interno: {ex.Message}"));
            }
        }

        [HttpPost]
        [Route("RegistrarAbono")]
        public IActionResult RegistrarAbono([FromBody] Abonos abono)
        {
            try
            {
                if (abono == null || abono.Id_Compra <= 0 || abono.Monto <= 0)
                {
                    return BadRequest(_utilitarios.RespuestaIncorrecta("Datos inválidos"));
                }

                using (var context = new SqlConnection(_configuration.GetConnectionString("Connection")))
                {
                    var resultado = context.Execute("RegistrarAbono",
                        new
                        {
                            Id_Compra = abono.Id_Compra,
                            Monto = abono.Monto
                        },
                        commandType: System.Data.CommandType.StoredProcedure);

                    if (resultado > 0)
                        return Ok(_utilitarios.RespuestaCorrecta("Abono registrado correctamente"));
                    else
                        return BadRequest(_utilitarios.RespuestaIncorrecta("El abono no fue registrado"));
                }
            }
            catch (SqlException ex)
            {
                return BadRequest(_utilitarios.RespuestaIncorrecta(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, _utilitarios.RespuestaIncorrecta($"Error interno: {ex.Message}"));
            }
        }
    }
}
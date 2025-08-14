using Microsoft.AspNetCore.Mvc;
using ApiPractica.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiPractica.Controllers
{
    [Route("api/compras")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly string _connectionString;

        public ComprasController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    var result = await dbConnection.QueryAsync<Principal>("SP_Consultar_Productos", commandType: CommandType.StoredProcedure);
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("pendientes")]
        public async Task<IActionResult> GetPendientes()
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    dbConnection.Open();
                    var result = await dbConnection.QueryAsync<CompraPendiente>("SP_Consultar_Pendientes", commandType: CommandType.StoredProcedure);
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/saldo")]
        public async Task<IActionResult> GetSaldo(long id)
        {
            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@Id_Compra", id);

                    dbConnection.Open();
                    var result = await dbConnection.QueryFirstOrDefaultAsync<decimal?>("SP_Consultar_Saldo", parameters, commandType: CommandType.StoredProcedure);

                    if (result == null)
                    {
                        return NotFound();
                    }

                    return Ok(new { Saldo = result.Value });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("abonos")]
        public async Task<IActionResult> RegistrarAbono([FromBody] Abono abono)
        {
            if (abono == null || abono.Monto <= 0)
            {
                return BadRequest("Invalid abono data.");
            }

            try
            {
                using (IDbConnection dbConnection = Connection)
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@Id_Compra", abono.Id_Compra);
                    parameters.Add("@Monto", abono.Monto);

                    dbConnection.Open();
                    await dbConnection.ExecuteAsync("SP_Registrar_Abono", parameters, commandType: CommandType.StoredProcedure);

                    return Ok(new { Message = "Abono registrado exitosamente." });
                }
            }
            catch (SqlException ex)
            {
                // You might want to check for specific SQL error numbers, e.g., foreign key violations
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

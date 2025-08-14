using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Practica3.Services;

namespace Practica3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUtilitarios _utilitarios;

        public ErrorController(IConfiguration configuration, IUtilitarios utilitarios)
        {
            _configuration = configuration;
            _utilitarios = utilitarios;
        }

        [Route("CapturarError")]
        public IActionResult CapturarError()
        {
            var ex = HttpContext.Features.Get<IExceptionHandlerFeature>();

            var DescripcionError = ex?.Error?.Message ?? "Error desconocido";
            var Origen = ex?.Path ?? "Origen desconocido";

            // Log del error (opcional - puedes implementar logging aquí)
            Console.WriteLine($"Error: {DescripcionError} - Origen: {Origen}");

            return StatusCode(500, _utilitarios.RespuestaIncorrecta("Se presentó un error interno"));
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Practica3View.Models;
using Practica3View.Services;
using System.Text.Json;

namespace Practica3View.Controllers
{
    public class ComprasController : Controller
    {
        private readonly IApiService _apiService;
        private readonly ILogger<ComprasController> _logger;

        public ComprasController(IApiService apiService, ILogger<ComprasController> logger)
        {
            _apiService = apiService;
            _logger = logger;
        }

        // GET: Compras/Consulta
        public async Task<IActionResult> Consulta()
        {
            try
            {
                _logger.LogInformation("Iniciando consulta de compras");

                var compras = await _apiService.ConsultarComprasAsync();

                _logger.LogInformation($"Se obtuvieron {compras.Count} compras");

                if (compras == null || !compras.Any())
                {
                    ViewBag.Error = "No se encontraron compras o no se pudo conectar con el servicio.";
                    return View(new List<Principal>());
                }

                return View(compras);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar las compras");
                ViewBag.Error = "Error al consultar las compras: " + ex.Message;
                return View(new List<Principal>());
            }
        }

        // GET: Compras/Registro
        public async Task<IActionResult> Registro()
        {
            try
            {
                _logger.LogInformation("Cargando formulario de registro de abono");

                var comprasPendientes = await _apiService.ConsultarComprasPendientesAsync();

                _logger.LogInformation($"Se obtuvieron {comprasPendientes.Count} compras pendientes");

                var viewModel = new AbonoViewModel
                {
                    ComprasPendientes = comprasPendientes,
                    Id_Compra = 0,
                    SaldoAnterior = 0,
                    Abono = 0
                };

                if (!comprasPendientes.Any())
                {
                    ViewBag.Error = "No hay compras pendientes disponibles.";
                }

                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cargar las compras pendientes");
                ViewBag.Error = "Error al cargar las compras pendientes: " + ex.Message;
                return View(new AbonoViewModel());
            }
        }

        // POST: Compras/Registro
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Registro(AbonoViewModel model)
        {
            try
            {
                _logger.LogInformation($"=== INICIANDO REGISTRO DE ABONO ===");
                _logger.LogInformation($"Datos recibidos: {JsonSerializer.Serialize(model)}");
                _logger.LogInformation($"ModelState válido: {ModelState.IsValid}");

                // Log de errores de ModelState
                if (!ModelState.IsValid)
                {
                    foreach (var error in ModelState)
                    {
                        _logger.LogWarning($"Error en {error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                    }
                }

                if (ModelState.IsValid)
                {
                    _logger.LogInformation($"Procesando abono para compra {model.Id_Compra}");

                    // Validaciones adicionales
                    if (model.Id_Compra <= 0)
                    {
                        _logger.LogWarning("ID de compra inválido");
                        ModelState.AddModelError("Id_Compra", "Debe seleccionar una compra válida.");
                    }

                    if (model.Abono <= 0)
                    {
                        _logger.LogWarning("Abono inválido");
                        ModelState.AddModelError("Abono", "El abono debe ser mayor a cero.");
                    }

                    if (model.SaldoAnterior <= 0)
                    {
                        _logger.LogWarning("Saldo anterior inválido");
                        ModelState.AddModelError("SaldoAnterior", "El saldo anterior debe ser mayor a cero.");
                    }

                    if (model.Abono > model.SaldoAnterior)
                    {
                        _logger.LogWarning($"Abono ({model.Abono}) mayor que saldo anterior ({model.SaldoAnterior})");
                        ModelState.AddModelError("Abono", "El abono no puede ser mayor al saldo anterior.");
                    }

                    if (ModelState.IsValid)
                    {
                        var abono = new Abonos
                        {
                            Id_Compra = model.Id_Compra,
                            Monto = model.Abono
                        };

                        _logger.LogInformation($"Enviando abono al API: {JsonSerializer.Serialize(abono)}");

                        var resultado = await _apiService.RegistrarAbonoAsync(abono);

                        _logger.LogInformation($"Resultado del API: {resultado}");

                        if (resultado)
                        {
                            TempData["Success"] = $"El abono de ₡{model.Abono:N2} se registró correctamente.";
                            _logger.LogInformation($"Abono registrado exitosamente: {model.Abono} para compra {model.Id_Compra}");
                            return RedirectToAction("Consulta");
                        }
                        else
                        {
                            _logger.LogError("El API retornó false al registrar el abono");
                            ModelState.AddModelError("", "Error al registrar el abono. El API retornó un error.");
                        }
                    }
                }

                // Si llegamos aquí, hay errores - recargar las compras pendientes
                _logger.LogWarning("Recargando vista debido a errores de validación");
                model.ComprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error crítico al procesar el registro de abono");
                ModelState.AddModelError("", "Error interno: " + ex.Message);

                try
                {
                    model.ComprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                }
                catch (Exception ex2)
                {
                    _logger.LogError(ex2, "Error adicional al recargar compras pendientes");
                    model.ComprasPendientes = new List<Principal>();
                }

                return View(model);
            }
        }

        // AJAX: Obtener saldo de una compra
        [HttpGet]
        public async Task<JsonResult> ObtenerSaldo(long idCompra)
        {
            try
            {
                _logger.LogInformation($"Obteniendo saldo para compra {idCompra}");

                var saldo = await _apiService.ObtenerSaldoCompraAsync(idCompra);

                _logger.LogInformation($"Saldo obtenido: {saldo} para compra {idCompra}");

                return Json(new { success = true, saldo = saldo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener saldo para compra {idCompra}");
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
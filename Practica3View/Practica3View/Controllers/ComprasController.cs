using Microsoft.AspNetCore.Mvc;
using Practica3View.Models;
using Practica3View.Services;

namespace Practica3View.Controllers
{
    public class ComprasController : Controller
    {
        private readonly IApiService _apiService;

        public ComprasController(IApiService apiService)
        {
            _apiService = apiService;
        }

        // GET: Compras/Consulta
        public async Task<IActionResult> Consulta()
        {
            try
            {
                var compras = await _apiService.ConsultarComprasAsync();
                return View(compras);
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Error al consultar las compras: " + ex.Message;
                return View(new List<Principal>());
            }
        }

        // GET: Compras/Registro
        public async Task<IActionResult> Registro()
        {
            try
            {
                var comprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                var viewModel = new AbonoViewModel
                {
                    ComprasPendientes = comprasPendientes
                };
                return View(viewModel);
            }
            catch (Exception ex)
            {
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
                if (ModelState.IsValid)
                {
                    // Validar que el abono no sea mayor al saldo anterior
                    if (model.Abono > model.SaldoAnterior)
                    {
                        ModelState.AddModelError("Abono", "El abono no puede ser mayor al saldo anterior.");
                        model.ComprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                        return View(model);
                    }

                    var abono = new Abonos
                    {
                        Id_Compra = model.Id_Compra,
                        Monto = model.Abono
                    };

                    var resultado = await _apiService.RegistrarAbonoAsync(abono);

                    if (resultado)
                    {
                        TempData["Success"] = "El abono se registró correctamente.";
                        return RedirectToAction("Consulta");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Error al registrar el abono.");
                    }
                }

                model.ComprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                return View(model);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Error interno: " + ex.Message);
                model.ComprasPendientes = await _apiService.ConsultarComprasPendientesAsync();
                return View(model);
            }
        }

        // AJAX: Obtener saldo de una compra
        [HttpGet]
        public async Task<JsonResult> ObtenerSaldo(long idCompra)
        {
            try
            {
                var saldo = await _apiService.ObtenerSaldoCompraAsync(idCompra);
                return Json(new { success = true, saldo = saldo });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
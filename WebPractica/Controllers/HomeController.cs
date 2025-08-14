using Microsoft.AspNetCore.Mvc;
using WebPractica.Models;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;

namespace WebPractica.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public HomeController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public IActionResult Index()
        {
            return RedirectToAction("Consulta");
        }

        public async Task<IActionResult> Consulta()
        {
            var client = _httpClientFactory.CreateClient("ApiClient");
            var response = await client.GetAsync("compras");

            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                var productos = JsonConvert.DeserializeObject<List<PrincipalViewModel>>(jsonString);
                return View(productos);
            }

            return View(new List<PrincipalViewModel>());
        }

        [HttpGet]
        public async Task<IActionResult> Registro()
        {
            var client = _httpClientFactory.CreateClient("ApiClient");
            var response = await client.GetAsync("compras/pendientes");

            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                ViewBag.ComprasPendientes = JsonConvert.DeserializeObject<List<CompraPendienteViewModel>>(jsonString);
            }
            else
            {
                ViewBag.ComprasPendientes = new List<CompraPendienteViewModel>();
            }

            return View(new AbonoViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Registro(AbonoViewModel model)
        {
            // The validation that abono is not greater than saldo anterior will be done client-side with JavaScript.
            // A server-side check is also good practice.
            if (!ModelState.IsValid)
            {
                // Repopulate dropdown if model state is invalid
                var client = _httpClientFactory.CreateClient("ApiClient");
                var response = await client.GetAsync("compras/pendientes");
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    ViewBag.ComprasPendientes = JsonConvert.DeserializeObject<List<CompraPendienteViewModel>>(jsonString);
                }
                return View(model);
            }

            var apiClient = _httpClientFactory.CreateClient("ApiClient");
            var jsonContent = new StringContent(JsonConvert.SerializeObject(new { model.Id_Compra, model.Monto }), Encoding.UTF8, "application/json");

            var postResponse = await apiClient.PostAsync("compras/abonos", jsonContent);

            if (postResponse.IsSuccessStatusCode)
            {
                return RedirectToAction("Consulta");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Ocurrió un error al registrar el abono.");
                // Repopulate dropdown on error
                 var client = _httpClientFactory.CreateClient("ApiClient");
                var response = await client.GetAsync("compras/pendientes");
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    ViewBag.ComprasPendientes = JsonConvert.DeserializeObject<List<CompraPendienteViewModel>>(jsonString);
                }
                return View(model);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

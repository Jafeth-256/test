using Microsoft.AspNetCore.Mvc;
using Practica3View.Models;
using Newtonsoft.Json;
using System.Text;

namespace Practica3View.Services
{
    public interface IApiService
    {
        Task<List<Principal>> ConsultarComprasAsync();
        Task<List<Principal>> ConsultarComprasPendientesAsync();
        Task<decimal> ObtenerSaldoCompraAsync(long idCompra);
        Task<bool> RegistrarAbonoAsync(Abonos abono);
    }

    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ApiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _httpClient.BaseAddress = new Uri(_configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7204");
        }

        public async Task<List<Principal>> ConsultarComprasAsync()
        {
            var response = await _httpClient.GetAsync("api/Compras/ConsultarCompras");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                {
                    return JsonConvert.DeserializeObject<List<Principal>>(apiResponse.Contenido.ToString() ?? "[]") ?? new List<Principal>();
                }
            }

            return new List<Principal>();
        }

        public async Task<List<Principal>> ConsultarComprasPendientesAsync()
        {
            var response = await _httpClient.GetAsync("api/Compras/ConsultarComprasPendientes");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                {
                    return JsonConvert.DeserializeObject<List<Principal>>(apiResponse.Contenido.ToString() ?? "[]") ?? new List<Principal>();
                }
            }

            return new List<Principal>();
        }

        public async Task<decimal> ObtenerSaldoCompraAsync(long idCompra)
        {
            var response = await _httpClient.GetAsync($"api/Compras/ObtenerSaldoCompra?idCompra={idCompra}");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                {
                    return Convert.ToDecimal(apiResponse.Contenido);
                }
            }

            return 0;
        }

        public async Task<bool> RegistrarAbonoAsync(Abonos abono)
        {
            var json = JsonConvert.SerializeObject(abono);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/Compras/RegistrarAbono", content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(responseContent);
                return apiResponse?.Codigo == 0;
            }

            return false;
        }
    }
}
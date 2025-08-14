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

            // Configurar la base URL si no está configurada
            if (_httpClient.BaseAddress == null)
            {
                var baseUrl = _configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7066";
                _httpClient.BaseAddress = new Uri(baseUrl);
            }
        }

        public async Task<List<Principal>> ConsultarComprasAsync()
        {
            try
            {
                Console.WriteLine($"Llamando a: {_httpClient.BaseAddress}api/Compras/ConsultarCompras");

                var response = await _httpClient.GetAsync("api/Compras/ConsultarCompras");

                Console.WriteLine($"Status Code: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Respuesta API: {content}");

                    var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                    if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                    {
                        var jsonContent = apiResponse.Contenido.ToString();
                        var result = JsonConvert.DeserializeObject<List<Principal>>(jsonContent) ?? new List<Principal>();
                        Console.WriteLine($"Compras obtenidas: {result.Count}");
                        return result;
                    }
                    else
                    {
                        Console.WriteLine($"API Response Code: {apiResponse?.Codigo}, Message: {apiResponse?.Mensaje}");
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error en API: {response.StatusCode} - {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ConsultarComprasAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

            return new List<Principal>();
        }

        public async Task<List<Principal>> ConsultarComprasPendientesAsync()
        {
            try
            {
                Console.WriteLine($"Llamando a: {_httpClient.BaseAddress}api/Compras/ConsultarComprasPendientes");

                var response = await _httpClient.GetAsync("api/Compras/ConsultarComprasPendientes");

                Console.WriteLine($"Status Code: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Respuesta API: {content}");

                    var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                    if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                    {
                        var jsonContent = apiResponse.Contenido.ToString();
                        var result = JsonConvert.DeserializeObject<List<Principal>>(jsonContent) ?? new List<Principal>();
                        Console.WriteLine($"Compras pendientes obtenidas: {result.Count}");
                        return result;
                    }
                    else
                    {
                        Console.WriteLine($"API Response Code: {apiResponse?.Codigo}, Message: {apiResponse?.Mensaje}");
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error en API: {response.StatusCode} - {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ConsultarComprasPendientesAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

            return new List<Principal>();
        }

        public async Task<decimal> ObtenerSaldoCompraAsync(long idCompra)
        {
            try
            {
                Console.WriteLine($"Llamando a: {_httpClient.BaseAddress}api/Compras/ObtenerSaldoCompra?idCompra={idCompra}");

                var response = await _httpClient.GetAsync($"api/Compras/ObtenerSaldoCompra?idCompra={idCompra}");

                Console.WriteLine($"Status Code: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Respuesta API: {content}");

                    var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(content);

                    if (apiResponse?.Codigo == 0 && apiResponse.Contenido != null)
                    {
                        var saldo = Convert.ToDecimal(apiResponse.Contenido);
                        Console.WriteLine($"Saldo obtenido: {saldo}");
                        return saldo;
                    }
                    else
                    {
                        Console.WriteLine($"API Response Code: {apiResponse?.Codigo}, Message: {apiResponse?.Mensaje}");
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error en API: {response.StatusCode} - {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ObtenerSaldoCompraAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

            return 0;
        }

        public async Task<bool> RegistrarAbonoAsync(Abonos abono)
        {
            try
            {
                Console.WriteLine($"Registrando abono: {JsonConvert.SerializeObject(abono)}");

                var json = JsonConvert.SerializeObject(abono);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("api/Compras/RegistrarAbono", content);

                Console.WriteLine($"Status Code: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Respuesta API: {responseContent}");

                    var apiResponse = JsonConvert.DeserializeObject<RespuestaEstandar>(responseContent);
                    var success = apiResponse?.Codigo == 0;
                    Console.WriteLine($"Abono registrado exitosamente: {success}");
                    return success;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error en API: {response.StatusCode} - {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en RegistrarAbonoAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }

            return false;
        }
    }
}
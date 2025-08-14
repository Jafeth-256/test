using Practica3View.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configurar HttpClient para el API Service con configuración más específica
builder.Services.AddHttpClient<IApiService, ApiService>("ApiClient", (serviceProvider, client) =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    var baseUrl = configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7066";

    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(60);

    // Headers adicionales si son necesarios
    client.DefaultRequestHeaders.Add("Accept", "application/json");

    Console.WriteLine($"HttpClient configurado con BaseAddress: {baseUrl}");
});

// También registrar como singleton para asegurar la configuración
builder.Services.AddSingleton<IApiService>(serviceProvider =>
{
    var httpClientFactory = serviceProvider.GetRequiredService<IHttpClientFactory>();
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();

    var httpClient = httpClientFactory.CreateClient("ApiClient");
    return new ApiService(httpClient, configuration);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

Console.WriteLine("Aplicación iniciada correctamente");
app.Run();
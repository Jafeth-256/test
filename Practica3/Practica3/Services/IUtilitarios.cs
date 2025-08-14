using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using Practica3.Models;

namespace Practica3.Services
{
    public interface IUtilitarios
    {
        RespuestaEstandar RespuestaCorrecta(object? contenido);
        RespuestaEstandar RespuestaIncorrecta(string mensaje);
        void EnviarCorreo(string destinatario, string asunto, string cuerpo);
    }
}
﻿using Microsoft.AspNetCore.Mvc;

namespace Practica3.Models
{
    public class RespuestaEstandar
    {
        public int Codigo { get; set; }
        public string? Mensaje { get; set; }
        public object? Contenido { get; set; }
    }
}
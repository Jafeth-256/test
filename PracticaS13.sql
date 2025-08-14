USE [master]
GO

CREATE DATABASE [PracticaS13]
GO

USE [PracticaS13]
GO

CREATE TABLE [dbo].[Abonos](
	[Id_Abono] [bigint] IDENTITY(1,1) NOT NULL,
	[Id_Compra] [bigint] NOT NULL,
	[Monto] [decimal](18, 2) NOT NULL,
	[Fecha] [datetime] NOT NULL,
 CONSTRAINT [PK_Abonos] PRIMARY KEY CLUSTERED
(
	[Id_Abono] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Principal](
	[Id_Compra] [bigint] IDENTITY(1,1) NOT NULL,
	[Precio] [decimal](18, 2) NOT NULL,
	[Saldo] [decimal](18, 2) NOT NULL,
	[Descripcion] [varchar](500) NOT NULL,
	[Estado] [varchar](100) NOT NULL,
 CONSTRAINT [PK_Principal] PRIMARY KEY CLUSTERED
(
	[Id_Compra] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [dbo].[Principal] ON
GO
INSERT [dbo].[Principal] ([Id_Compra], [Precio], [Saldo], [Descripcion], [Estado]) VALUES (1, CAST(50000.00 AS Decimal(18, 2)), CAST(50000.00 AS Decimal(18, 2)), N'Producto 1', N'Pendiente')
GO
INSERT [dbo].[Principal] ([Id_Compra], [Precio], [Saldo], [Descripcion], [Estado]) VALUES (2, CAST(13500.00 AS Decimal(18, 2)), CAST(13500.00 AS Decimal(18, 2)), N'Producto 2', N'Pendiente')
GO
INSERT [dbo].[Principal] ([Id_Compra], [Precio], [Saldo], [Descripcion], [Estado]) VALUES (3, CAST(83600.00 AS Decimal(18, 2)), CAST(83600.00 AS Decimal(18, 2)), N'Producto 3', N'Pendiente')
GO
INSERT [dbo].[Principal] ([Id_Compra], [Precio], [Saldo], [Descripcion], [Estado]) VALUES (4, CAST(1220.00 AS Decimal(18, 2)), CAST(1220.00 AS Decimal(18, 2)), N'Producto 4', N'Pendiente')
GO
INSERT [dbo].[Principal] ([Id_Compra], [Precio], [Saldo], [Descripcion], [Estado]) VALUES (5, CAST(480.00 AS Decimal(18, 2)), CAST(480.00 AS Decimal(18, 2)), N'Producto 5', N'Pendiente')
GO
SET IDENTITY_INSERT [dbo].[Principal] OFF
GO

ALTER TABLE [dbo].[Abonos]  WITH CHECK ADD  CONSTRAINT [FK_Abonos_Principal] FOREIGN KEY([Id_Compra])
REFERENCES [dbo].[Principal] ([Id_Compra])
GO

ALTER TABLE [dbo].[Abonos] CHECK CONSTRAINT [FK_Abonos_Principal]
GO

-------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS
-------------------------------------------------

-- SP para consultar todos los productos
CREATE PROCEDURE [dbo].[SP_Consultar_Productos]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id_Compra, Precio, Saldo, Descripcion, Estado
    FROM dbo.Principal
    ORDER BY CASE WHEN Estado = 'Pendiente' THEN 0 ELSE 1 END, Id_Compra;
END
GO

-- SP para consultar las compras con estado pendiente
CREATE PROCEDURE [dbo].SP_Consultar_Pendientes
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id_Compra, Descripcion
    FROM dbo.Principal
    WHERE Estado = 'Pendiente'
    ORDER BY Descripcion;
END
GO

-- SP para consultar el saldo de una compra específica
CREATE PROCEDURE [dbo].[SP_Consultar_Saldo]
    @Id_Compra bigint
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Saldo
    FROM dbo.Principal
    WHERE Id_Compra = @Id_Compra;
END
GO

-- SP para registrar un abono
CREATE PROCEDURE [dbo].[SP_Registrar_Abono]
    @Id_Compra bigint,
    @Monto decimal(18, 2)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Insertar el abono
        INSERT INTO dbo.Abonos (Id_Compra, Monto, Fecha)
        VALUES (@Id_Compra, @Monto, GETDATE());

        -- 2. Actualizar el saldo en la tabla principal
        UPDATE dbo.Principal
        SET Saldo = Saldo - @Monto
        WHERE Id_Compra = @Id_Compra;

        -- 3. Verificar si el saldo es cero y actualizar estado
        DECLARE @NuevoSaldo decimal(18, 2);
        SELECT @NuevoSaldo = Saldo FROM dbo.Principal WHERE Id_Compra = @Id_Compra;

        IF @NuevoSaldo <= 0
        BEGIN
            UPDATE dbo.Principal
            SET Estado = 'Cancelado', Saldo = 0
            WHERE Id_Compra = @Id_Compra;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        -- Re-throw la excepcion para que la capa de aplicacion la maneje
        THROW;
    END CATCH
END
GO

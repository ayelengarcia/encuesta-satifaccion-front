const URLlista = "https://suscripcionesbackendrailway-production.up.railway.app/todo";

// Conecto con API
fetch(URLlista)
  .then((response) => response.json())
  .then((data) => {
    //filtra solo los que contengan suscripcion="SI"
    const datosConSuscripcionSI = data.filter(
      (item) => item.suscripcion === "SI"
    );

    // Obtiene la fecha actual en el mismo formato que se encuentra en los datos
    const now = new Date();

    const currentFormattedDate = `${now
      .getDate()
      .toString()
      .padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear().toString()}`;

    // Filtra los datos para obtener solo aquellos con la fecha actual
    const datosFechaActual = data.filter((item) => {
      const itemFormattedDate = item.respuesta.fecha.split(" ")[0];
      return itemFormattedDate === currentFormattedDate;
    });

    // Define un conjunto para almacenar los números de pedido utilizados
    const numerosDePedidoUtilizados = new Set();

    // Función para generar números de pedido únicos
    function generarNumeroPedidoUnico() {
      let numeroPedido = 1;
      while (numerosDePedidoUtilizados.has(numeroPedido.toString().padStart(3, "0"))) {
        numeroPedido++;
      }
      numerosDePedidoUtilizados.add(numeroPedido.toString().padStart(3, "0"));
      return numeroPedido.toString().padStart(3, "0");
    }

    const datosContacto = data.map((item) => ({
      ID: item._id,

      Fecha: item.respuesta.fecha,
      Nombre: item.respuesta.nombre,
      Apellido: item.respuesta.apellido,
      Celular: item.respuesta.celular,
      Email: item.respuesta.email,

      Genero: item.respuesta.genero || "",
      Incontinencia: item.respuesta.incontinencia || "",
      Talle: item.respuesta.talle || "",

      Suscripcion: item.suscripcion,
      Titulo: item.producto.titulo,
      EAN: item.producto.EAN,

      Frecuencia: item.contacto.frecuencia,
    }));

    let contador = 2;

    const datosPedidos = datosConSuscripcionSI.map((item) => {
      const filaCompra = contador;
      const filaFacturado = contador;

      contador++;
      return {
        idPedido: generarNumeroPedidoUnico(),

        fechaCreacion: item.respuesta.fecha,
        nombreFactura: item.respuesta.nombre,
        apellidoFactura: item.respuesta.apellido,
        dniFactura: item.contacto.dni,
        telefonoFactura: item.respuesta.celular,
        dirCalleFactura: item.contacto.calle,
        dirNroFactura: item.contacto.altura,
        dirPisoFactura: item.contacto.piso,
        dirCPFactura: item.contacto.CP,
        email: item.respuesta.email,
        nombreRetiro: item.respuesta.nombre,
        apellidoRetiro: item.respuesta.apellido,
        dniRetiro: item.contacto.dni,
        telefonoRetiro: item.respuesta.celular,
        idSucursal: 84,
        codigoProducto: item.producto.EAN,
        precioBase: 5,
        precioCompra: `=R${filaCompra}`,
        cantidad: 1,
        descuentoItem: 0,
        precioFacturado: `=R${filaFacturado}*T${filaFacturado}`,
        importeTotal: `=R${filaFacturado}*T${filaFacturado}`,
        medioPago: "mercadopago_fco",
        costoFinanciero: 0,
        costoEnvio: 0,
        localidad: item.contacto.localidad,
        cuotas: 1,
        creditCard: "",
        metododeenvio: "mercadoEnvio",
        cupon: "",
        canal: 10,
        observaciones: "#2000004919844713",
        entregaFull: 2,
        item: 0,
      }
    });

    mostrarDatosEnPagina(datosFechaActual);
    descargarCSV(datosContacto);
    descargarCSVpedidos(datosPedidos);
  })
  .catch((error) => {
    console.error("Error al obtener datos del servidor:", error);
  });

// Función para mostrar los datos en la tabla
function mostrarDatosEnPagina(datos) {
  const tablaBody = document.getElementById("tablaBody");

  datos.forEach((dato) => {
    const filaHTML = `
  <tr class="columna">
    <td class="column-id">${dato._id}</td>

    <td>${dato.respuesta.fecha}</td>
    <td>${dato.respuesta.nombre}</td>
    <td>${dato.respuesta.apellido}</td>
    <td>${dato.respuesta.celular}</td>
    <td class="column-email">${dato.respuesta.email}</td>

    <td>${dato.respuesta.genero}</td>
    <td>${dato.respuesta.incontinencia}</td>
    <td class="column-small">${dato.respuesta.talle}</td>

    <td>${dato.suscripcion}</td>
    <td class="column-email">${dato.producto.titulo}</td>
    <td>${dato.producto.EAN}</td>

    <td>${dato.contacto.frecuencia}</td>
  </tr>
`;

    // Agregar la fila a la tabla
    tablaBody.innerHTML += filaHTML;
  });
}

// Función para convertir un arreglo de objetos en formato CSV
function convertirA_CSV(datos) {
  const encabezados = Object.keys(datos[0]);
  const filas = [encabezados.join(",")];

  datos.forEach((dato) => {
    const fila = encabezados.map((campo) => dato[campo]);
    filas.push(fila.join(","));
  });

  return filas.join("\n");
}

// Función para descargar el archivo CSV para contacto.
function descargarCSV(data) {
  const contenidoCSV = convertirA_CSV(data).replace(/,/g, ";");

  const blob = new Blob([contenidoCSV], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "datosContacto.csv";
  a.textContent = "Descargar CSV contacto";

  const btnDescargar = document.getElementById("descargar");
  btnDescargar.appendChild(a);
}

// Función para descargar el archivo CSV para pedidos
function descargarCSVpedidos(data) {
  const contenidoCSV = convertirA_CSV(data).replace(/,/g, ";");

  const blob = new Blob([contenidoCSV], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "datosPedido.csv";
  a.textContent = "Descargar CSV pedidos";

  const btnDescargar = document.getElementById("descargarPedidos");
  btnDescargar.appendChild(a);
}
// const URLlista = "http://127.0.0.1:8080/todo";
const URLlista = "https://suscripciones-encuesta-back.onrender.com/todo";

// Conecto con API
fetch(URLlista)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    const datos = data.map((item) => ({
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

      Frecuencia: item.contacto.frecuencia
    }));

    mostrarDatosEnPagina(data);
    descargarCSV(datos);
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

    <td class="column-small">${dato.respuesta.fecha}</td>
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

// Función para descargar el archivo CSV
function descargarCSV(data) {
  const contenidoCSV = convertirA_CSV(data).replace(/,/g, ";");

  const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  
  const a = document.createElement("a");
  a.href = url;
  a.download = "datos.csv";
  a.textContent = "Descargar CSV";

  const btnDescargar = document.getElementById("descargar");
  btnDescargar.appendChild(a);
}

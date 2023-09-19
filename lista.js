// Conecto con API
fetch("https://best-heliotrope-sphynx.glitch.me/todo")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    const datos = data.map((item) => ({
      ID: item.id,
      Nombre: item.respuesta.nombre,
      Apellido: item.respuesta.apellido,
      Email: item.respuesta.email,
      Celular: item.respuesta.celular,
      Titulo: item.producto[0].titulo,
      EAN: item.producto[0].EAN,
      Tipo: item.respuesta.tipo,
      Genero: item.respuesta.genero,
      Incontinencia: item.respuesta.incontinencia,
      Talle: item.respuesta.talle,
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
    <td class="filaP">${dato.id}</td>
    <td>${dato.respuesta.nombre}</td>
    <td>${dato.respuesta.apellido}</td>
    <td class="filaG">${dato.respuesta.email}</td>
    <td>${dato.respuesta.celular}</td>
    <td class="filaG">${dato.producto[0].titulo}</td>
    <td>${dato.producto[0].EAN}</td>
    <td>${dato.respuesta.tipo}</td>
    <td>${dato.respuesta.genero}</td>
    <td>${dato.respuesta.incontinencia}</td>
    <td class="filaP">${dato.respuesta.talle}</td>
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

// 7794626011184;
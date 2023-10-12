const PRODUCTOS = [];
const URLproductos = "http://127.0.0.1:8080/todo/productos";
const URLlista = "http://127.0.0.1:8080/todo";
// const URLproductos = "https://suscripciones-encuesta-back.onrender.com/todo/productos";
// const URLlista = "https://suscripciones-encuesta-back.onrender.com/todo";

const containerRecomendados2 = document.getElementById(
  "container-recomendados2"
);
const encuestaForm2 = document.getElementById("encuestaForm2");
const error = document.getElementById("error");

fetch(URLproductos)
  .then((response) => response.json())
  .then((data) => {
    PRODUCTOS.push(...data);

    recorrerObjetos(PRODUCTOS, returnProducto, containerRecomendados2);

    encuestaForm2.addEventListener("submit", function (e) {
      e.preventDefault();

      // Verificar si hay un valor seleccionado
      const valorSeleccionado = capturarValores();

      if (valorSeleccionado.length > 0) {
        const productoSeleccionado = PRODUCTOS.find((producto) => {
          return valorSeleccionado.includes(producto.EAN);
        });

        // Captura la información de contacto
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const celular = document.getElementById("celular").value;
        const email = document.getElementById("email").value;

        const respuestaUser = {
          fecha: data.fecha,
          nombre,
          apellido,
          celular,
          email,
          genero: "",
          incontinencia: "",
          talle: ""
        };

        // Obtener datos para contacto
        const frecuencia = document.getElementById("frecuencia").value;
        const contactoRta = {
          frecuencia,
        };

        const datosCompletos = {
          respuesta: respuestaUser,
          suscripcion: "SI",
          producto: productoSeleccionado,
          contacto: contactoRta,
        };

        // Envía los datos a la URL especificada
        fetch(URLlista, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosCompletos),
        })
          .then((response) => response.json())
          .then((data) => console.log("Respuesta del servidor:", data))
          .catch((error) => console.error("Error al enviar los datos:", error));
      } else {
        error.innerHTML = "Seleccione un producto deseado";
      }
    });
  });

// RECORRER OBJETOS
const recorrerObjetos = (array, template, contenedor) => {
  contenedor.innerHTML = "";
  if (array.length > 0) {
    array.forEach((elemento) => {
      contenedor.innerHTML += template(elemento);
    });
  }
};

//templates
const returnProducto = (producto) => {
  return `
        <div id="productoRecomendado">
          <img class="img-producto" src="${producto.imagen}" alt="${producto.titulo}">
          <div class="description-product">
            <h3 class="margen titulo-card">${producto.titulo}</h3>
            <p class="margen">${producto.tipo}</p>
            <p class="margen">${producto.descripción}</p>
            
            <div class="contenedor-select-product">
              <input id="${producto._id}" class="check-select-product input-seleccionar2" type="radio" value="${producto.EAN}" name="producto" data-seccion="producto"/>
              <label class="mi-producto" for="${producto._id}">Seleccionar</label>
            </div>
          </div>
        </div>
        `;
};

//PRODUCTOS
function capturarValores() {
  const checkboxes = document.querySelectorAll(".input-seleccionar2");
  const valorSeleccionado = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) valorSeleccionado.push(checkbox.value);
  });
  return valorSeleccionado;
}

const PRODUCTOS = [];
// const URLproductos = "http://127.0.0.1:8080/todo/productos";
// const URLlista = "http://127.0.0.1:8080/todo";
const URLproductos = "https://suscripciones-encuesta-back.onrender.com/todo/productos";
const URLlista = "https://suscripciones-encuesta-back.onrender.com/todo";
const containerRecomendados = document.getElementById("container-recomendados");
const encuestaForm = document.getElementById("encuestaForm");
const resultado = document.getElementById("resultado");
const enviarBtn = document.getElementById("enviarBtn");
const secciones = document.querySelectorAll(".seccion");
const error = document.getElementById("error");
const errorP = document.getElementById("errorP");
resultado.classList.add("d-none");

const btnCapturarValores = document.getElementById("capturarValores");
let respuestaGlobal;

fetch(URLproductos)
  .then((response) => response.json())
  .then((data) => {
    PRODUCTOS.push(...data);

    encuestaForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Obtener selecciones del user
      const genero = obtenerSeleccion("genero");
      const incontinencia = obtenerSeleccion("incontinencia");
      const talle = obtenerSeleccion("talle");

      // Obtener datos personales del user
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const celular = document.getElementById("celular").value;
      const email = document.getElementById("email").value;

      // Buscar producto basado en las selecciones del usuario
      const productosFiltrados = filtrarProductos(
        genero,
        incontinencia,
        talle
      );

      // Crear objeto con los datos del usuario
      const respuestaUser = {
        fecha: data.fecha,
        nombre,
        apellido,
        celular,
        email,
        genero: genero[0],
        incontinencia: incontinencia[0],
        talle: talle[0],
      };

      // Mapear productos filtrados y obtener título y EAN
      const productoRecomendado = [];
      productosFiltrados.forEach((producto) => {
        productoRecomendado.push({
          titulo: producto.titulo,
          EAN: producto.EAN,
        });
      });

      const productoVacio = {
        titulo: "",
        EAN: ""
      }

      const contactoRtaVacia = {
        frecuencia: ""
      }

      // Objeto para la lista
      const datosCompletos = {
        respuesta: respuestaUser,
        recomendados: productosFiltrados,
        suscripcion: "NO",
        producto: productoVacio,
        contacto: contactoRtaVacia
      };

      // Enviar datos para crear la lista
      fetch(URLlista, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosCompletos),
      })
        .then((response) => response.json())
        .then((response) => {
          const idLista = response._id;

          btnCapturarValores.addEventListener("click", function (e) {
            e.preventDefault();
          
            // Verificar si hay un valor seleccionado
            const valorSeleccionado = capturarValores();
            if (valorSeleccionado.length > 0) {
              const productoSeleccionado = productosFiltrados.find((producto) => {
                return valorSeleccionado.includes(producto.EAN);
              });

              // Obtener datos para contacto
              const frecuencia = document.getElementById("frecuencia").value;

              const contactoRta = {
                frecuencia
              };
          
              // Objeto con los datos ACTUALIZADOS
              const datosCompletos2 = {
                respuesta: respuestaUser,
                recomendados: productosFiltrados,
                suscripcion: "SI",
                producto: productoSeleccionado,
                contacto: contactoRta,
              };
          
              // Solicitud PUT para actualizar la respuesta existente
              fetch(URLlista + "/" + idLista, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datosCompletos2),
              })
                .then((response) => response.json())
                .catch((error) => {
                  console.error("Error al enviar datos al servidor:", error);
                });
            } else {
              errorP.innerHTML = "Seleccione un producto deseado";
            }
          });
          
        })
        .catch((error) => {
          console.error("Error al enviar datos al servidor:", error);
        });

      encuestaForm.classList.add("d-none");
      resultado.classList.remove("d-none");

      // Mostrar el producto recomendado
      recorrerObjetos(productosFiltrados, returnProducto, containerRecomendados);
    });
  });


// Funcion condicional para envio del form
enviarBtn.addEventListener("click", function (e) {
  const checkboxesSeleccionadas = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  if (checkboxesSeleccionadas.length === 3) return;
  e.preventDefault();
  error.innerHTML = "Por favor, completa todos los campos.";
});

//Función para seleccionar un check por seccion
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const seccion = this.getAttribute("data-seccion");

    checkboxes.forEach((otherCheckbox) => {
      if (
        otherCheckbox.getAttribute("data-seccion") === seccion &&
        otherCheckbox !== this
      ) {
        otherCheckbox.checked = false;
      }
    });
  });
});

// Función para obtener las selecciones del usuario en una sección
function obtenerSeleccion(seccion) {
  const checkboxes = document.querySelectorAll(
    `input[name=${seccion}]:checked`
  );
  const seleccion = Array.from(checkboxes).map((checkbox) => checkbox.value);

  return seleccion;
}

// Función para filtrar productos basados en las seleccion del user (tipo- quitado temporalmente)
function filtrarProductos( genero, incontinencia, talle) {
  const productosFiltrados = [];

  PRODUCTOS.forEach((producto) => {
    const cumpleTalle = talle.some((selTalle) =>
      producto.talle.includes(selTalle)
    );
    const cumpleGenero = genero.some((selGenero) =>
      producto.genero.includes(selGenero)
    );
    const cumpleIncontinencia = incontinencia.some((selIncontinencia) =>
      producto.incontinencia.includes(selIncontinencia)
    );

    if ( cumpleGenero && cumpleIncontinencia && cumpleTalle) {
      productosFiltrados.push(producto);
    }
  });

  return productosFiltrados;
}

// RECORRER OBJETOS
const recorrerObjetos = (array, template, contenedor) => {
  contenedor.innerHTML = "";
  if (array.length > 0) {
    array.forEach((elemento) => {
      contenedor.innerHTML += template(elemento);
    });
  }
};


//PRODUCTOS RECOMENDADOS

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
        <input id="${producto._id}" class="check-select-product input-seleccionar" type="radio" value="${producto.EAN}" name="producto" data-seccion="producto"/>
        <label class="mi-producto" for="${producto._id}">Seleccionar</label>
      </div>
    </div>
  </div>
  `;
}

function capturarValores() {
  const checkboxes = document.querySelectorAll('.input-seleccionar');
  const valorSeleccionado = []

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) valorSeleccionado.push(checkbox.value)
  });
  return valorSeleccionado
}



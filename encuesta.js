const PRODUCTOS = [];
const URLproductos = "https://suscripciones-encuesta-back.onrender.com/todo/productos";
const URLlista = "https://suscripciones-encuesta-back.onrender.com/todo";
const encuestaForm = document.getElementById("encuestaForm");
const resultado = document.getElementById("resultado");
const enviarBtn = document.getElementById("enviarBtn");
const secciones = document.querySelectorAll(".seccion");
const error = document.getElementById("error");
resultado.classList.add("d-none");

fetch(URLproductos)
  .then((response) => response.json())
  .then((data) => {
    PRODUCTOS.push(...data);

    encuestaForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Obtener selecciones del user
      const tipo = obtenerSeleccion("tipo");
      const genero = obtenerSeleccion("genero");
      const incontinencia = obtenerSeleccion("incontinencia");
      const talle = obtenerSeleccion("talle");

      // Obtener datos personales del user
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const celular = document.getElementById("celular").value;
      const email = document.getElementById("email").value;

      // Buscar producto basado en las seleccion del user
      const productoFiltrado = filtrarProductos(
        tipo,
        genero,
        incontinencia,
        talle
      );

      // Crear objeto con los datos del user
      const respuestaUser = {
        nombre,
        apellido,
        celular,
        email,
        tipo: tipo[0],
        genero: genero[0],
        incontinencia: incontinencia[0],
        talle: talle[0],
      };

      // Mapear productos filtrados y obtener título y EAN
      const productoSeleccionado = [];
      productoFiltrado.forEach((producto) => {
        productoSeleccionado.push({
          titulo: producto.titulo,
          EAN: producto.EAN,
        });
      });

      //Objeto para lista
      const datosCompletos = {
        respuesta: respuestaUser,
        producto: productoSeleccionado,
      };

      //Enviar datos a /todo
      fetch(URLlista, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosCompletos),
      })
        .then((response) => response.json())

        .catch((error) => {
          console.error("Error al enviar datos al servidor:", error);
        });

      encuestaForm.classList.add("d-none");
      resultado.classList.remove("d-none");

      // Mostrar el producto recomendado
      mostrarProductoRecomendado(productoFiltrado);
    });
  });

// Funcion condicional para envio del form
enviarBtn.addEventListener("click", function (e) {
  const checkboxesSeleccionadas = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  if (checkboxesSeleccionadas.length === 4) return;
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

// Función para filtrar productos basados en las seleccion del user
function filtrarProductos(tipo, genero, incontinencia, talle) {
  const productosFiltrados = [];

  PRODUCTOS.forEach((producto) => {
    const cumpleTipo = tipo.some((selTipo) => producto.tipo.includes(selTipo));
    const cumpleTalle = talle.some((selTalle) =>
      producto.talle.includes(selTalle)
    );
    const cumpleGenero = genero.some((selGenero) =>
      producto.genero.includes(selGenero)
    );
    const cumpleIncontinencia = incontinencia.some((selIncontinencia) =>
      producto.incontinencia.includes(selIncontinencia)
    );

    if (cumpleTipo && cumpleGenero && cumpleIncontinencia && cumpleTalle) {
      productosFiltrados.push(producto);
    }
  });

  return productosFiltrados;
}

// Función para mostrar el producto recomendado
function mostrarProductoRecomendado(productosFiltrados) {
  if (productosFiltrados.length > 0) {
    const productoRecomendado = productosFiltrados[0];
    const resultadoDiv = document.getElementById("productoRecomendado");
    resultadoDiv.innerHTML = `
            <img class="img-producto" src="${productoRecomendado.imagen}" alt="${productoRecomendado.titulo}">
            <div class="description-product">
              <h3 class="margen">${productoRecomendado.titulo}</h3>
              <p class="margen">${productoRecomendado.descripción}</p>
              <p class="margen">Marca: ${productoRecomendado.marca}</p>
              <p class="margen">EAN: ${productoRecomendado.EAN}</p>
            </div>

        `;
  } else {
    document.getElementById("productoRecomendado").innerHTML =
      "<p>No se encontraron productos que coincidan con tus preferencias. Selecciona todas las preferencias.</p>";
  }
}

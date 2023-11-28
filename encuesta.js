const PRODUCTOS = [];
 const URLproductos = "https://suscripcionesbackendrailway-production.up.railway.app/todo/productos";
 const URLlista = "https://suscripcionesbackendrailway-production.up.railway.app/todo";
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

const modalFin = document.querySelector(".modalFin");
const containerModal = document.querySelector(".container-modal");
containerModal.classList.remove("d-flex");
containerModal.classList.add("d-none");
modalFin.classList.remove("d-flex");
modalFin.classList.add("d-none");

const tiempoRedireccion = 6000;
const tiempoRedireccionElement = document.querySelector(".tiempoRedireccion");
let segundosRestantes = tiempoRedireccion / 1000;

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
      const productosFiltrados = filtrarProductos(genero, incontinencia, talle);

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
          descuento: producto.descuento,
        });
      });

      const productoVacio = {
        titulo: "",
        EAN: "",
        descuento: "",
      };

      const contactoRtaVacia = {
        dni: "",
        calle: "",
        altura: "",
        piso: "",
        localidad: "",
        CP: "",
        frecuencia: "",
      };

      // Objeto para la lista
      const datosCompletos = {
        respuesta: respuestaUser,
        suscripcion: "NO",
        producto: productoVacio,
        contacto: contactoRtaVacia,
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

            // Obtener datos para contacto
            const dni = document.getElementById("dni").value;
            const calle = document.getElementById("calle").value;
            const altura = document.getElementById("altura").value;
            const piso = document.getElementById("piso").value;
            const localidad = document.getElementById("localidad").value;
            const CP = document.getElementById("CP").value;
            const frecuencia = document.getElementById("frecuencia").value;

            if (dni && calle && altura && localidad && CP && frecuencia) {
              // Verificar si hay un valor seleccionado
              const valorSeleccionado = capturarValores();
              if (valorSeleccionado.length > 0) {
                const productoSeleccionado = productosFiltrados.find(
                  (producto) => {
                    return valorSeleccionado.includes(producto.EAN);
                  }
                );

                // Objeto con los datos ACTUALIZADOS
                const datosCompletos2 = {
                  respuesta: respuestaUser,
                  suscripcion: "SI",
                  producto: productoSeleccionado,
                  contacto: {
                    dni,
                    calle,
                    altura,
                    piso,
                    localidad,
                    CP,
                    frecuencia,
                  },
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
                  .then(() => {
                    modalFin.classList.add("d-flex");
                    containerModal.classList.add("d-flex");
                    modalFin.classList.remove("d-none");
                    containerModal.classList.remove("d-none");
                    modalFin.classList.add("fadeInModal");
                    containerModal.classList.add("fadeInModal");

                    void modalFin.offsetWidth;
                    void containerModal.offsetWidth;

                    modalFin.classList.add("show");
                    containerModal.classList.add("show");

                    actualizarCuentaRegresiva();
                    limpiarFormulario();
                  })
                  .catch((error) => {
                    console.error("Error al enviar datos al servidor:", error);
                  });
              } else {
                errorP.innerHTML = "Seleccione un producto deseado";
              }
            } else {
              errorP.innerHTML = "Complete todos los campos de contacto.";
            }
          });
        })
        .catch((error) => {
          console.error("Error al enviar datos al servidor:", error);
        });

      encuestaForm.classList.add("d-none");
      resultado.classList.remove("d-none");

      // Mostrar el producto recomendado
      recorrerObjetos(
        productosFiltrados,
        returnProducto,
        containerRecomendados
      );
    });
  })
  .then(() => encuestaForm.reset());

function limpiarFormulario() {
  const inputs = document.querySelector(".input-contacto");

  inputs.value = "";
}

// Función redirigir y cuenta regresiva
function actualizarCuentaRegresiva() {
  tiempoRedireccionElement.textContent = ` ${segundosRestantes}s`;
  segundosRestantes--;

  if (segundosRestantes >= 0) {
    setTimeout(actualizarCuentaRegresiva, 1000);
  } else {
    window.location.href = "https://www.centraloeste.com.ar/";
  }
}

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
function filtrarProductos(genero, incontinencia, talle) {
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

    if (cumpleGenero && cumpleIncontinencia && cumpleTalle) {
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
  const dinamicaColorClass =
    producto.descuento === 10 ? "dinamica-color2" : "dinamica-color";
  return `
        <div id="productoRecomendado">
          <img class="img-producto" src="${producto.imagen}" alt="${producto.titulo}">
          <div class="description-product">
            <h3 class="margen titulo-card">${producto.titulo}</h3>
            <h6 class="dinamica ${dinamicaColorClass}">% ${producto.descuento} OFF</h6>
            <p class="margen size-tipo">${producto.tipo}</p>
            <p class="margen size-description">${producto.descripción}</p>
            
            <div class="contenedor-select-product">
              <input id="${producto._id}" class="check-select-product input-seleccionar2" type="radio" value="${producto.EAN}" name="producto" data-seccion="producto"/>
              <label class="mi-producto" for="${producto._id}">Seleccionar</label>
            </div>
          </div>
        </div>
        `;
};

function capturarValores() {
  const checkboxes = document.querySelectorAll(".input-seleccionar2");
  const valorSeleccionado = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) valorSeleccionado.push(checkbox.value);
  });
  return valorSeleccionado;
}

const button = document.getElementById("scrollButton");
let isAtBottom = false;

button.addEventListener("click", () => {
  if (isAtBottom) {
    // Cuando estamos en la parte inferior, llevamos de vuelta arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Cuando estamos en la parte superior, llevamos abajo
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
});

// Evento de desplazamiento (scroll)
window.addEventListener("scroll", () => {
  // Detecta si estoy en top o bottom
  if (window.scrollY === 0) {
    isAtBottom = false;
    button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="arrow"
      viewBox="0 0 16 16">
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
    </svg>`;
  } else if (
    window.scrollY + window.innerHeight >=
    document.body.scrollHeight
  ) {
    isAtBottom = true;
    button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="arrow" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                    </svg>`;
  }
});

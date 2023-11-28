const PRODUCTOS = [];
const URLproductos = "https://suscripcionesbackendrailway-production.up.railway.app/todo/productos";
const URLlista = "https://suscripcionesbackendrailway-production.up.railway.app/todo";

const containerRecomendados2 = document.getElementById(
  "container-recomendados2"
);
const encuestaForm2 = document.getElementById("encuestaForm2");
const error = document.getElementById("error");

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
          talle: "",
        };

        // Obtener datos para contacto
        const dni = document.getElementById("dni").value;
        const calle = document.getElementById("calle").value;
        const altura = document.getElementById("altura").value;
        const piso = document.getElementById("piso").value;
        const localidad = document.getElementById("localidad").value;
        const CP = document.getElementById("CP").value;
        const frecuencia = document.getElementById("frecuencia").value;

        const contactoRta = {
          dni,
          calle,
          altura,
          piso,
          localidad,
          CP,
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
          })
          .catch((error) => console.error("Error al enviar los datos:", error));
      } else {
        error.innerHTML = "Seleccione un producto deseado";
      }
    });
  });

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

//PRODUCTOS
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

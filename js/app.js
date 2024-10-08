"use strict";

const nombreProductos = ["bag", "banana", "bathroom", "boots", "breakfast", "bubblegum", "chair", "cthulhu", "dog-duck", "dragon", "pen", "pet-sweep", "scissors", "shark", "sweep", "tauntaun", "unicorn", "water-can", "wine-glass"];
const allProductos = [];

function Producto(name, path) {
  this.name = name;
  this.path = path;
  this.click = 0;
  this.views = 0;
}

function listarProductos() {
  for (let i = 0; i < nombreProductos.length; i++) {
    let extension = nombreProductos[i] === "sweep" ? ".png" : ".jpg";
    let producto = new Producto(nombreProductos[i], "img/" + nombreProductos[i] + extension);
    allProductos.push(producto);
  }
}

function cargarDatos() {
  const datosGuardados = localStorage.getItem("productos");
  if (datosGuardados) {
    const productosCargados = JSON.parse(datosGuardados);
    for (let i = 0; i < allProductos.length; i++) {
      allProductos[i].click = productosCargados[i].click || 0;
      allProductos[i].views = productosCargados[i].views || 0;
    }
  }
}

function guardarDatos() {
  localStorage.setItem("productos", JSON.stringify(allProductos));
}

listarProductos();
cargarDatos(); 

const productRank = {
  totalClick: allProductos.reduce((total, producto) => total + producto.click, 0),
  votosRonda: 25,
  objetoIzq: null,
  objetoCent: null,
  objetoDer: null,
  elementoIzq: document.getElementById("img1"),
  elementoCent: document.getElementById("img2"),
  elementoDer: document.getElementById("img3"),
  contenedorImagenes: document.getElementById("imagenes"),
  elementosResultados: document.getElementById("resultados"),
  botonResultados: document.getElementById("mostrarResultados"),
  botonReiniciar: document.getElementById("reiniciar"),

  numeroAleatorio: function () {
    return Math.floor(Math.random() * nombreProductos.length);
  },

  mostrarImagenes: function () {
    this.objetoIzq = allProductos[this.numeroAleatorio()];
    this.objetoCent = allProductos[this.numeroAleatorio()];
    this.objetoDer = allProductos[this.numeroAleatorio()];

    while (this.objetoIzq === this.objetoCent || this.objetoIzq === this.objetoDer || this.objetoCent === this.objetoDer) {
      this.objetoCent = allProductos[this.numeroAleatorio()];
      this.objetoDer = allProductos[this.numeroAleatorio()];
    }

    this.objetoIzq.views += 1;
    this.objetoCent.views += 1;
    this.objetoDer.views += 1;

    this.elementoIzq.src = this.objetoIzq.path;
    this.elementoIzq.name = this.objetoIzq.name;
    this.elementoCent.src = this.objetoCent.path;
    this.elementoCent.name = this.objetoCent.name;
    this.elementoDer.src = this.objetoDer.path;
    this.elementoDer.name = this.objetoDer.name;

    guardarDatos();
  },

  contarClick: function (id) {
    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i].name === id) {
        allProductos[i].click += 1;
        this.totalClick += 1;
        console.log(`${allProductos[i].name} tiene ${allProductos[i].click} click(s)`);
        guardarDatos();
      }
    }
  },

  mostrarResultados: function () {
    const lista = document.createElement("ul");
    for (let i = 0; i < allProductos.length; i++) {
      const item = document.createElement("li");
      const contenido = allProductos[i].name + ": " + allProductos[i].click + " click(s), " + allProductos[i].views + " vista(s)";
      item.textContent = contenido;
      lista.appendChild(item);
    }
    const itemFinal = document.createElement("li");
    itemFinal.textContent = `Total de clics: ${this.totalClick}`;
    lista.appendChild(itemFinal);
    this.elementosResultados.appendChild(lista);
  },

  mostrarBoton: function () {
    this.botonResultados.hidden = false;
    this.botonResultados.addEventListener("click", () => {
      this.botonReiniciar.hidden = false;
      this.botonResultados.hidden = true;
      this.mostrarResultados();
      renderChart();
      this.botonReiniciar.addEventListener("click", function () {
        localStorage.removeItem("productos"); 
        location.reload();
      });
    });
  },

  onClick: function (event) {
    if (
      event.target.name === productRank.objetoIzq.name ||
      event.target.name === productRank.objetoCent.name ||
      event.target.name === productRank.objetoDer.name
    ) {
      productRank.contarClick(event.target.name);

      if (productRank.totalClick % productRank.votosRonda === 0) {
        productRank.contenedorImagenes.removeEventListener("click", productRank.onClick);
        productRank.mostrarBoton();
      } else {
        productRank.mostrarImagenes();
      }
    } else {
      alert("Haz clic en una imagen válida");
    }
  },
};

const botonVerResultados = document.getElementById("verResultados");

botonVerResultados.addEventListener("click", function () {
  const contenedorResultados = document.getElementById("resultados");
  contenedorResultados.innerHTML = "";

  const lista = document.createElement("ul");

  for (let i = 0; i < allProductos.length; i++) {
    const item = document.createElement("li");
    const contenido = allProductos[i].name + " tiene " + allProductos[i].click + " votos, y se ha visto " + allProductos[i].views + " veces.";
    item.textContent = contenido;
    lista.appendChild(item);
  }

  contenedorResultados.appendChild(lista);
});

function renderChart() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const productVotes = [];
  const productTitle = [];
  const productViews = [];

  for (let index = 0; index < allProductos.length; index++) {
    const elemento = allProductos[index];
    productVotes.push(elemento.click);
    productTitle.push(elemento.name);
    productViews.push(elemento.views);
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productTitle,
      datasets: [
        {
          label: '# de click',
          data: productVotes,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderWidth: 1
        },
        {
          label: '# de views',
          data: productViews,
          backgroundColor: [
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

productRank.mostrarImagenes();
productRank.contenedorImagenes.addEventListener("click", productRank.onClick.bind(productRank));

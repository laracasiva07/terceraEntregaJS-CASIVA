function principal(){
    let productos = [
        { id: 1, nombre: 'LADRILLO BLOCK', precio: 170, categoria: 'materiales de construccion', rutaImagen:"block.jpg", stock: 100},
        { id: 2, nombre: 'CEMENTO', precio: 9800, categoria: 'materiales de construccion', rutaImagen: "cemento.jpg", stock: 50},
        { id: 3, nombre: 'HIERRO', precio: 7800, categoria: 'materiales de construccion', rutaImagen: "hierros.jpeg", stock: 60},
        { id: 4, nombre: 'TABIQUE ROJO', precio: 510, categoria: 'materiales de construccion', rutaImagen: "ladrillos.jpg", stock: 200},
        { id: 5, nombre: 'AMOLADORA', precio: 40000, categoria: 'herramientas', rutaImagen: "amoladora.jpg",stock: 5},
        { id: 6, nombre: 'BALDE DE ALBAÑIL', precio: 1800, categoria: 'herramientas', rutaImagen: "baldes.jpg", stock: 20},
        { id: 7, nombre: 'DESTORNILLADORES', precio: 2500, categoria: 'herramientas', rutaImagen: "destornillador.jpeg", stock: 20},
        { id: 8, nombre: 'PINZA', precio: 4500, categoria: 'herramientas', rutaImagen: "pinza.jpg", stock: 15},
        { id: 9, nombre: 'CAÑO TERMOFUSION', precio: 7800, categoria: 'instalaciones', rutaImagen: "cañosagua.jpg", stock: 25},
        { id: 10, nombre: 'CAÑO FUSION GAS', precio: 8500, categoria: 'instalaciones', rutaImagen: "cañosgas.jpg", stock: 60},
        { id: 11, nombre: 'ACCESORIOS FUSION', precio: 5444, categoria: 'instalaciones', rutaImagen: "termofusion.jpg", stock: 80},
        { id: 12, nombre: 'ACCESORIOS POLIPROPILENO', precio: 548, categoria: 'instalaciones', rutaImagen: "polipropileno.jpg", stock: 29},
        { id: 13, nombre: 'MANGUERA DE RIEGO', precio: 7000, categoria: 'accesorios', rutaImagen: "manguera.jpeg", stock: 18},
        { id: 14, nombre: 'LATEX DE 20 LTS.', precio: 50000, categoria: 'accesorios', rutaImagen: "pinturas.jpg", stock: 50},
        { id: 15, nombre: 'SANITARIOS', precio: 105000, categoria: 'accesorios', rutaImagen: "santarios.jpg", stock: 100},
    ]
    let carrito = recuperarDelStorage("carrito")
    if (!carrito){
        carrito = []
    }
    renderizarCarrito(carrito)
    crearTarjetaProducto(productos)
    configurarFiltros(productos)
    configurarBotonesAgregarCarrito(productos)
    
    let botonProductos = document.getElementById ("productosCarrito")
    botonProductos.addEventListener("click", verOcultarCarrito)
}
principal()

function calcularTotalCarrito (carrito){
    let total = 0
    for (let i = 0; i<carrito.length; i++){
        let producto = carrito [i]
        total += producto.precioUnitario * producto.unidades
    }
    return total 
}

function verOcultarCarrito(e){
    let carrito = document.getElementById("carrito")
    let contenedorProductos = document.getElementById("contenedorProductos")
    carrito.classList.toggle("oculta")
    contenedorProductos.classList.toggle("oculta")
    if (e.target.innerText === "Carrito"){
        e.target.innerText = "Productos"
    }else{
        e.target.innerText = "Carrito"
    }
}

function crearTarjetaProducto(productos) {
    let contenedor = document.getElementById("contenedorProductos")
    contenedor.innerHTML = ""
    productos.forEach(producto => {
        let mensaje = "Unidades: " + producto.stock
        if (producto.stock < 50){
            mensaje = "Quedan pocas unidades"
        }
        contenedor.innerHTML += `
        <div class=producto>
        <img src=./img/${producto.rutaImagen}>
        <h3>${producto.nombre}</h3>
        <h4>${producto.precio}</h4>
        <p>${mensaje}</p>
        <button class= botonAgregarCarrito id=${producto.id}>Agregar carrito</button>
        </div>
        `
    })
}

function agregarProductoAlCarrito(event, productos, carrito){
    let id = Number(event.target.id)
    let productoOriginal = productos.find(producto => producto.id === id)
    let indiceProductoEnCarrito = carrito.findIndex(producto => producto.id === id)
    if (indiceProductoEnCarrito === -1){
        carrito.push({
            id: productoOriginal.id,
            nombre: productoOriginal.nombre,
            precioUnitario: productoOriginal.precio,
            unidades: 1,
            subtotal: productoOriginal.precio, 
        })
    }else{
        carrito[indiceProductoEnCarrito].unidades++
        carrito[indiceProductoEnCarrito].subtotal = carrito[indiceProductoEnCarrito].precioUnitario * carrito[indiceProductoEnCarrito].unidades
    }

    guardarEnStorage("carrito", carrito)
    renderizarCarrito(carrito)
}

function renderizarCarrito(carrito){
    let contenedorCarrito = document.getElementById("carrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.innerHTML =`
            <p>${producto.nombre}</p>
            <p>$${producto.precioUnitario}</p>
            <p>${producto.unidades}</p>
            <p>$${producto.subtotal}</p>
            <button class="eliminarProducto" data-id="${producto.id}">Eliminar</button>
        `
    contenedorCarrito.appendChild(tarjetaCarrito)
    })

    let total = calcularTotalCarrito(carrito)
    let totalCarrito = document.createElement("div")
    totalCarrito.className = "totalCarrito"
    totalCarrito.innerHTML = `
        <h3>Total: $${total}</h3>
    `
    contenedorCarrito.appendChild(totalCarrito)

    document.getElementById("carrito").addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminarProducto")) {
            const id = Number(e.target.getAttribute("data-id"))
            carrito = carrito.filter(producto => producto.id !== id)
            guardarEnStorage("carrito", carrito)
            renderizarCarrito(carrito)
        }
    })
   
}

function aplicarFiltros(productos) {
    const buscador = document.getElementById("buscador").value.toLowerCase()
    const filtroCategoria = document.getElementById("filtroCategoria").value

    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(buscador)
        const coincideCategoria = filtroCategoria === "todos" || producto.categoria === filtroCategoria
        return coincideBusqueda && coincideCategoria
    })

    crearTarjetaProducto(productosFiltrados)
    configurarBotonesAgregarCarrito(productos)
}

function configurarFiltros(productos) {
    document.getElementById("buscador").addEventListener("input", () => aplicarFiltros(productos))
    document.getElementById("filtroCategoria").addEventListener("change", () => aplicarFiltros(productos))
}

function configurarBotonesAgregarCarrito (productos){
    let carrito = recuperarDelStorage("carrito") || []
    let botonesAgregarCarrito = document.getElementsByClassName("botonAgregarCarrito")
    for (const boton of botonesAgregarCarrito) {
        boton.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos, carrito))
    }
}

function guardarEnStorage(clave,valor){
    let valorJson = JSON.stringify(valor)
    localStorage.setItem(clave, valorJson)
}

function recuperarDelStorage(clave){
    let valorJson = localStorage.getItem(clave)
    return JSON.parse(valorJson)
}

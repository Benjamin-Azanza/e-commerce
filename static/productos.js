// static/productos.js

// === LISTA DE PRODUCTOS ===
const productos = [
    { id: 1, nombre: "Gorra Algodón", precio: 19.99, imagen: "Gorra Celeste Pastel", descripcion: "Algodón peinado ultra-suave. Perfecta para un look minimalista." },
    { id: 2, nombre: "Gorro Alpaca", precio: 29.99, imagen: "Gorro Lana Gris", descripcion: "Lana 100% natural de alpaca. Suave y cálido." },
    { id: 3, nombre: "Gorra Negra", precio: 22.50, imagen: "Gorra Negra Minimal", descripcion: "Diseño minimalista en algodón negro." },
    { id: 4, nombre: "Gorro Beige", precio: 25.00, imagen: "Gorro Beige Suave", descripcion: "Suave gorro beige para los días fríos." }
];

// === FUNCIONES GENERALES ===
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function guardarCarrito(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function actualizarContador() {
    const cart = obtenerCarrito();
    const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = total;
}

// === INDEX.HTML ===
function mostrarProductos() {
    if (!window.location.pathname.includes('index.html')) return;
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    productos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'col-10 col-md-4 col-lg-3';
        div.innerHTML = `
            <div class="card h-100 shadow-sm" style="cursor:pointer;">
                <div class="card-body text-center" onclick="window.location.href='detalle.html?id=${p.id}'">
                    <div class="bg-secondary-subtle py-5 mb-3 rounded">${p.imagen}</div>
                    <h5 class="fw-normal">${p.nombre}</h5>
                    <p class="text-muted mb-0">$${p.precio.toFixed(2)}</p>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

// === DETALLE.HTML ===
function mostrarDetalle() {
    if (!window.location.pathname.includes('detalle.html')) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    const producto = productos.find(p => p.id === id);

    const contenedor = document.getElementById('detalle-producto');
    if (!contenedor) return;

    if (!producto) {
        contenedor.innerHTML = "<h2 class='text-center mt-5'>Producto no encontrado</h2>";
        return;
    }

    contenedor.innerHTML = `
        <div class="col-12 col-md-6">
            <div class="d-flex justify-content-center align-items-center bg-light" style="height:400px;">
                <span class="text-muted">${producto.imagen}</span>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <h1>${producto.nombre}</h1>
            <p class="fs-4">$${producto.precio.toFixed(2)}</p>
            <p>${producto.descripcion}</p>
            <div class="mb-3">
                <label class="form-label fw-bold">Cantidad:</label>
                <input type="number" id="cantidad" class="form-control" value="1" min="1" max="10">
            </div>
            <button class="btn btn-primary w-100" id="btn-agregar">Añadir a la cesta</button>
        </div>
    `;

    document.getElementById('btn-agregar').addEventListener('click', () => {
        const cantidad = parseInt(document.getElementById('cantidad').value);
        if (cantidad < 1 || cantidad > 10) {
            alert('Por favor selecciona una cantidad entre 1 y 10');
            return;
        }

        let cart = obtenerCarrito();
        const i = cart.findIndex(item => item.id === producto.id);

        if (i >= 0) cart[i].cantidad += cantidad;
        else cart.push({ ...producto, cantidad });

        guardarCarrito(cart);
        actualizarContador();
        alert(`Añadido al carrito: ${producto.nombre} (x${cantidad})`);
    });
}

// === CARRITO.HTML ===
function mostrarCarrito() {
    if (!window.location.pathname.includes('carrito.html')) return;

    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('checkout-btn');

    if (!contenedor || !totalElem || !btnCheckout) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p class='text-center mt-4 text-muted'>Tu cesta está vacía 🛒</p>";
        totalElem.textContent = "$0.00";
        btnCheckout.disabled = true;
        return;
    }

    let total = 0;
    contenedor.innerHTML = "";

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        const div = document.createElement('div');
        div.className = "list-group-item d-flex justify-content-between align-items-center";
        div.innerHTML = `
            <div>
                <h5>${p.nombre}</h5>
                <small class="text-muted">$${p.precio.toFixed(2)} c/u</small>
                <div class="mt-2">
                    <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad(${p.id}, -1)">-</button>
                    <span class="mx-2">${p.cantidad}</span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad(${p.id}, 1)">+</button>
                </div>
            </div>
            <div>
                <span class="fw-bold">$${subtotal.toFixed(2)}</span>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${p.id})">×</button>
            </div>
        `;
        contenedor.appendChild(div);
    });

    totalElem.textContent = `$${total.toFixed(2)}`;
    btnCheckout.disabled = false;
}

// Cambiar cantidad en carrito
function cambiarCantidad(id, cambio) {
    let cart = obtenerCarrito();
    const i = cart.findIndex(p => p.id === id);
    if (i === -1) return;

    cart[i].cantidad += cambio;
    if (cart[i].cantidad <= 0) cart.splice(i, 1);

    guardarCarrito(cart);
    mostrarCarrito();
    actualizarContador();
}

// Eliminar item del carrito
function eliminarDelCarrito(id) {
    let cart = obtenerCarrito();
    cart = cart.filter(p => p.id !== id);
    guardarCarrito(cart);
    mostrarCarrito();
    actualizarContador();
}

// === AL CARGAR PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();   // index.html
    mostrarDetalle();     // detalle.html
    mostrarCarrito();     // carrito.html
    actualizarContador(); // contador en todas
});

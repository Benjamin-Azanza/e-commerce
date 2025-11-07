const productos = [
    { id: 1, nombre: "Gorra Algodón", precio: 19.99, imagen: "Gorra Celeste", descripcion: "Algodón peinado ultra-suave. Perfecta para un look minimalista." },
    { id: 2, nombre: "Gorro Alpaca", precio: 29.99, imagen: "Gorro Lana Gris", descripcion: "Lana 100% natural de alpaca. Suave y cálido." },
    { id: 3, nombre: "Gorra Negra", precio: 22.50, imagen: "Gorra Negra Minimal", descripcion: "Diseño minimalista en algodón negro." },
    { id: 4, nombre: "Gorro Beige", precio: 25.00, imagen: "Gorro Beige Suave", descripcion: "Suave gorro beige para los días fríos." }
];

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function guardarCarrito(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function actualizarContador() {
    const cart = obtenerCarrito();
    const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const $contador = $('#cart-count');
    if ($contador.length > 0) $contador.text(total);
}

function mostrarProductos() {
    if (!window.location.pathname.includes('productos.html')) return;

    const $grid = $('#product-grid');
    if ($grid.length === 0) return;
    $grid.empty();

    productos.forEach(p => {
        const $div = $('<div></div>')
            .addClass('col-10 col-md-4 col-lg-3')
            .html(`
                <div class="card h-100 shadow-sm" style="cursor:pointer;">
                    <div class="card-body text-center producto-clickable" data-id="${p.id}">
                        <div class="bg-secondary-subtle py-5 mb-3 rounded">${p.imagen}</div>
                        <h5 class="fw-normal">${p.nombre}</h5>
                        <p class="text-muted mb-0">$${p.precio.toFixed(2)}</p>
                    </div>
                </div>
            `);
        $grid.append($div);
    });
}

function mostrarDetalle() {
    if (!window.location.pathname.includes('detalle.html')) return;
    
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    const producto = productos.find(p => p.id === id);
    const $contenedor = $('#detalle-producto');
    if ($contenedor.length === 0) return;

    if (!producto) {
        $contenedor.html("<h2 class='text-center mt-5'>Producto no encontrado</h2>");
        return;
    }

    $contenedor.html(`
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
    `);

    $('#btn-agregar').on('click', () => {
        const cantidad = parseInt($('#cantidad').val());
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

function mostrarCarrito() {
    if (!window.location.pathname.includes('carrito.html')) return;

    const carrito = obtenerCarrito();
    const $contenedor = $('#cart-items');
    const $totalElem = $('#cart-total');
    const $btnCheckout = $('#checkout-btn');
    if ($contenedor.length === 0) return;

    if (carrito.length === 0) {
        $contenedor.html("<p class='text-center mt-4 text-muted'>Tu cesta está vacía 🛒</p>");
        $totalElem.text("$0.00");
        $btnCheckout.prop('disabled', true);
        return;
    }

    let total = 0;
    $contenedor.empty();

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        const $div = $('<div></div>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .html(`
                <div>
                    <h5>${p.nombre}</h5>
                    <small class="text-muted">$${p.precio.toFixed(2)} c/u</small>
                    <div class="mt-2">
                        <button class="btn btn-outline-secondary btn-sm btn-restar" data-id="${p.id}">-</button>
                        <span class="mx-2">${p.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm btn-sumar" data-id="${p.id}">+</button>
                    </div>
                </div>
                <div>
                    <span class="fw-bold">$${subtotal.toFixed(2)}</span>
                    <button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${p.id}">×</button>
                </div>
            `);
        $contenedor.append($div);
    });

    $totalElem.text(`$${total.toFixed(2)}`);
    $btnCheckout.prop('disabled', false);
}

function cambiarCantidad(id, cambio) {
    let cart = obtenerCarrito();
    const i = cart.findIndex(p => p.id === id);
    if (i === -1) return;
    
    cart[i].cantidad += cambio;
    if (cart[i].cantidad <= 0) cart = cart.filter(p => p.id !== id);
    
    guardarCarrito(cart);
    mostrarCarrito();
    actualizarContador();
}

function eliminarDelCarrito(id) {
    let cart = obtenerCarrito();
    cart = cart.filter(p => p.id !== id);
    guardarCarrito(cart);
    mostrarCarrito();
    actualizarContador();
}

$(function() {
    mostrarProductos();
    mostrarDetalle();
    mostrarCarrito();
    actualizarContador();

    $('#product-grid').on('click', '.producto-clickable', function() {
        const id = $(this).data('id');
        window.location.href = `detalle.html?id=${id}`;
    });

    $('#cart-items').on('click', '.btn-restar', function() {
        const id = $(this).data('id');
        cambiarCantidad(id, -1);
    });

    $('#cart-items').on('click', '.btn-sumar', function() {
        const id = $(this).data('id');
        cambiarCantidad(id, 1);
    });

    $('#cart-items').on('click', '.btn-eliminar', function() {
        const id = $(this).data('id');
        eliminarDelCarrito(id);
    });

    
    const $contactForm = $('#contactForm');
    
    // Usamos el mismo truco: si el formulario existe en esta página...
    if ($contactForm.length > 0) {
        // Seleccionamos los mensajes
        const $loadingMsg = $('.mensaje.loading');
        const $successMsg = $('.mensaje.success');
        const $errorMsg = $('.mensaje.error');

        // Manejamos el evento 'submit' con jQuery
        $contactForm.on('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue

            // Ocultamos mensajes y mostramos 'cargando'
            $successMsg.hide();
            $errorMsg.hide();
            $loadingMsg.show(); // .show() es el .css('display', 'block') de jQuery

            // Simulación de envío
            setTimeout(() => {
                $loadingMsg.hide();     // .hide() es el .css('display', 'none')
                $successMsg.show();

                // .reset() es una función nativa de formulario
                // $(this)[0] se refiere al elemento DOM del formulario
                $(this)[0].reset(); 

                // Ocultar el mensaje de éxito después de 5 seg
                setTimeout(() => {
                    $successMsg.hide();
                }, 5000);
            }, 1500);
        });
    }




});
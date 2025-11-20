export function mostrarProductosVista(productos) {

    // Asegura que solo se ejecute en productos.html
    const page = window.location.pathname.split("/").pop();
    if (page !== "productos.html") return;

    const $grid = $('#product-grid');
    if ($grid.length === 0) return;

    $grid.empty();

    productos.forEach(p => {
        const $div = $('<div></div>')
            .addClass('col-10 col-md-4 col-lg-3 producto-clickable')
            .attr('data-id', p.id)
            .html(`
                <div class="card h-100 shadow-sm" style="cursor:pointer;">
                    <img src="${p.imagen}" class="card-img-top" style="height:200px; object-fit:cover;">
                    <div class="card-body text-center">
                        <h5>${p.nombre}</h5>
                        <p class="text-muted mb-0">$${p.precio.toFixed(2)}</p>
                    </div>
                </div>
            `);
        $grid.append($div);
    });

    // Evento de click para entrar a detalle
    $('.producto-clickable').on('click', function () {
        const id = $(this).data('id');
        window.location.href = `detalle.html?id=${id}`;
    });
}


export function mostrarDetalleVista(producto) {
    const $contenedor = $('#detalle-producto');
    if ($contenedor.length === 0) return;

    if (!producto) {
        $contenedor.html("<h2 class='text-center mt-5'>Producto no encontrado</h2>");
        return;
    }

    $contenedor.html(`
        <div class="col-12 col-md-6">
            <img src="${producto.imagen}" class="img-fluid rounded" style="max-height:400px; object-fit:cover;">
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
}


export function mostrarCarritoVista(carrito) {
    const $contenedor = $('#cart-items');
    const $totalElem = $('#cart-total');
    const $btnCheckout = $('#checkout-btn');

    if ($contenedor.length === 0) return;

    if (carrito.length === 0) {
        $contenedor.html("<p class='text-center mt-4 text-muted'>Tu carrito está vacío.</p>");
        if ($totalElem.length) $totalElem.text("$0.00");
        if ($btnCheckout.length) $btnCheckout.prop("disabled", true);
        return;
    }

    let total = 0;
    $contenedor.empty();

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        const $item = $(`
            <div class="list-group-item d-flex justify-content-between align-items-center">
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
            </div>
        `);

        $contenedor.append($item);
    });

    if ($totalElem.length) $totalElem.text(`$${total.toFixed(2)}`);
    if ($btnCheckout.length) $btnCheckout.prop('disabled', false);
}

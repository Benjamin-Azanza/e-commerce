import { productos, obtenerCarrito, guardarCarrito }
    from '/js/nvc/models/productModel.js';

import {
    mostrarProductosVista,
    mostrarDetalleVista,
    mostrarCarritoVista
} from '/js/nvc/views/productView.js';

function actualizarContador() {
    const cart = obtenerCarrito();
    const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const $contador = $('#cart-count');
    if ($contador.length > 0) $contador.text(total);
}

function cambiarCantidad(id, cambio) {
    let cart = obtenerCarrito();
    const i = cart.findIndex(p => p.id === id);

    if (i === -1) return;

    cart[i].cantidad += cambio;
    if (cart[i].cantidad <= 0) cart = cart.filter(p => p.id !== id);

    guardarCarrito(cart);
    mostrarCarritoVista(cart);
    actualizarContador();
}

function eliminarDelCarrito(id) {
    let cart = obtenerCarrito();
    cart = cart.filter(p => p.id !== id);
    guardarCarrito(cart);
    mostrarCarritoVista(cart);
    actualizarContador();
}

$(function() {

    /** ---------------- PRODUCTOS ---------------- */
    mostrarProductosVista(productos);

    /** ---------------- DETALLE ---------------- */
    if (window.location.pathname.includes('detalle.html')) {

        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id')) || 1;
        const producto = productos.find(p => p.id === id);

        mostrarDetalleVista(producto);

        $('#detalle-producto').on('click', '#btn-agregar', () => {
            const cantidad = parseInt($('#cantidad').val());

            if (cantidad < 1 || cantidad > 10) {
                alert("Cantidad inválida");
                return;
            }

            let cart = obtenerCarrito();
            const i = cart.findIndex(item => item.id === producto.id);

            if (i >= 0) cart[i].cantidad += cantidad;
            else cart.push({ ...producto, cantidad });

            guardarCarrito(cart);
            actualizarContador();
            alert(`Añadido: ${producto.nombre} (x${cantidad})`);
        });
    }

    /** ---------------- CARRITO ---------------- */
    if (window.location.pathname.includes('carrito.html')) {
        mostrarCarritoVista(obtenerCarrito());
    }

    $('#cart-items').on('click', '.btn-restar', function() {
        cambiarCantidad($(this).data('id'), -1);
    });

    $('#cart-items').on('click', '.btn-sumar', function() {
        cambiarCantidad($(this).data('id'), 1);
    });

    $('#cart-items').on('click', '.btn-eliminar', function() {
        eliminarDelCarrito($(this).data('id'));
    });

    actualizarContador();
});

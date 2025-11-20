export const productos = [
    {
        id: 1,
        nombre: "Gorra Beige",
        precio: 19.99,
        imagen: "static/img/gorrabeige.jpg",
        descripcion: "Gorra beige clásica y sencilla. Tejido transpirable. Comodidad para el día a día."
    },
    {
        id: 2,
        nombre: "Gorra Morada",
        precio: 29.99,
        imagen: "static/img/gorramorada.jpg",
        descripcion: "Gorra color lavanda. Ajustable y suave. Un toque de color vintage."
    },
    {
        id: 3,
        nombre: "Gorra Celeste",
        precio: 22.50,
        imagen: "static/img/gorranegramin.jpg",
        descripcion: "Gorra de visera plana azul cielo. Diseño con bordado de nubes y estilo urbano."
    },
    {
        id: 4,
        nombre: "Gorra Negra",
        precio: 25.00,
        imagen: "static/img/gorranewera.jpg",
        descripcion: "Gorra Negra New Era 59Fifty. Logo 'NY' blanco. El clásico deportivo y urbano."
    }
];

export function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

export function guardarCarrito(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

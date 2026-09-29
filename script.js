// Número de teléfono de atención
const SAMY_WHATSAPP_NUMBER = "51936329133"; // Reemplaza con el número de teléfono real

let cart = [];
let currentSlide = 0;

// Actualización del objeto catalogDatabase en script.js
const catalogDatabase = {
    refrigeracion: [
        {
            id: "ref-01",
            title: "Pasta Térmica Arctic MX-4 (8g)",
            desc: "Alta conductividad térmica (8.5 W/mK), no conductora de electricidad.",
            price: "S/ 35.00", // <-- Puedes cambiar el precio aquí
            tag: "RECOMENDADO",
            image: "ARCTICMX-4.png", // <-- Foto del producto
            specs: [
                "Conductividad térmica: 8.5 W/mK",
                "Viscosidad: 870 poise",
                "Densidad: 2.5 g/cm³",
                "Uso recomendado: Procesadores (CPU) y Tarjetas de Video (GPU)"
            ]
        },
        {
            id: "ref-02",
            title: "Pasta Térmica Arctic MX-6 (8g)",
            desc: "Rendimiento extremo para Overclocking y laptops gamer.",
            price: "S/ 55.00",
            tag: "TOP RENDIMIENTO",
            image: "ARCTICMX-6.png",
            specs: [
                "Conductividad térmica: 12.5 W/mK",
                "Resistencia térmica: 0.0032 K/W",
                "Temperatura de trabajo: -200 °C / +350 °C",
                "Ideal para: Laptops Gamer y Overclocking extremo"
            ]
        },
        {   
            id: "ref-03",
            title: "Pasta Térmica Arctic MX-7 (8g)",
            desc: "La mejor pasta térmica para entusiastas y overclockers profesionales.",
            price: "S/ 75.00",
            tag: "NUEVO",
            image: "ARCTICMX-7.png",
            specs: [
                "Conductividad térmica: 15.0 W/mK",
                "Resistencia térmica: 0.0025 K/W",
                "Temperatura de trabajo: -200 °C / +350 °C",
                "Ideal para: Overclocking profesional y sistemas de alto rendimiento"
            ]
        }
        // ... Agrega o edita los demás insumos aquí
    ],
    pcs: [],
    laptops: [],
    componentes: [],
    servicios: []
};
    

    // CATEGORÍA ACTIVA: SERVICIOS TÉCNICOS
    servicios: [
        {
            id: "srv-01",
            title: "Mantenimiento Preventivo de PC / Laptop",
            category: "servicios",
            desc: "Limpieza profunda de chasis, cambio de pasta térmica y diagnóstico general de componentes.",
            price: "S/ 80.00",
            tag: "TALLER",
            icon: "fa-screwdriver-wrench"
        },
        {
            id: "srv-02",
            title: "Mantenimiento de Impresoras EcoTank",
            category: "servicios",
            desc: "Limpieza de inyectores, cambio de almohadillas y descarte de atascos mecánicos.",
            price: "Cotización",
            tag: "TALLER",
            icon: "fa-print"
        }
    ]


// FUNCIÓN PARA RENDERIZAR LOS PRODUCTOS DE CADA CATEGORÍA
function showCategory(categoryKey, btnElement) {
    // Actualizar clase activa en los botones de pestaña
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const container = document.getElementById('catalogGrid');
    if (!container) return;

    container.innerHTML = '';
    const items = catalogDatabase[categoryKey];

    // Si la categoría no tiene productos aún (está vacía)
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; opacity: 0.7;">
                <i class="fa-solid fa-boxes-packing" style="font-size: 3rem; margin-bottom: 15px; color: var(--samy-electric-blue);"></i>
                <h3>Próximamente más modelos disponibles</h3>
                <p>Estamos actualizando nuestro stock de esta sección. ¡Consúltanos por WhatsApp!</p>
            </div>
        `;
        return;
    }

    // Renderizado dinámico de tarjetas
    items.forEach(item => {
    const cardHTML = `
    <div class="card" onclick="openProductModal('${item.id}', '${categoryKey}')">
        <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.title}" class="product-thumb-img" onerror="this.onerror=null; this.src='https://via.placeholder.com/300?text=SamybalTech';">
            ${item.tag ? `<span class="tag-badge new">${item.tag}</span>` : ''}
        </div>
        <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.desc}</p>
            <div class="card-price">${item.price}</div>
            <button class="btn-add" onclick="event.stopPropagation(); addToCart('${item.title}', '${item.price}')">
                <i class="fa-solid fa-cart-plus"></i> Añadir al Pedido
            </button>
        </div>
    </div>
`;
    container.innerHTML += cardHTML;
});
}

// FUNCIONALIDAD DEL CARRITO
function addToCart(title, price) {
    cart.push({ title, price });
    updateCartUI();
    // Ya no hace scroll automático hacia abajo
}

// ELIMINAR UN PRODUCTO DEL CARRITO POR SU ÍNDICE
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function calculateCartTotal() {
    return cart.reduce((total, item) => {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return total + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
}

function updateCartUI() {
    const cartList = document.getElementById('cartList');
    const cartBadge = document.getElementById('cartBadge');
    const floatingBtn = document.querySelector('.floating-cart-btn'); // Seleccion del botón flotante

    // Mostrar u ocultar el botón flotante según si hay productos en el carrito
    if (floatingBtn) {
        if (cart.length > 0) {
            floatingBtn.classList.add('visible'); // Muestra el botón flotante
        } else {
            floatingBtn.classList.remove('visible'); // Oculta el botón flotante
        }
    }
    
    // Actualizar el contador numérico flotante
    if (cartBadge) {
        cartBadge.textContent = cart.length;
        // Muestra u oculta la insignia si hay productos
        cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
    }

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = `<li style="opacity: 0.6; text-align: center; padding: 15px;">No has añadido productos o servicios a la lista.</li>`;
        return;
    }

    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div>
                <strong>${item.title}</strong>
                <span style="font-size: 0.85rem; opacity: 0.8; display: block;">${item.price}</span>
            </div>
            <button style="color:red; background:none; border:none; cursor:pointer;" onclick="removeFromCart(${index})" aria-label="Eliminar ${item.title} de la lista de pedidos">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartList.appendChild(li);
    });

    // Agregar fila de Total al final del carrito
    const totalAmount = calculateCartTotal();
    if (totalAmount > 0) {
        const totalLi = document.createElement('li');
        totalLi.style.cssText = "display:flex; justify-content:space-between; padding-top:10px; font-weight:bold; border-top:2px solid var(--card-border); margin-top:10px;";
        totalLi.innerHTML = `
            <span>Estimado Total:</span>
            <span style="color: var(--samy-red);">S/${totalAmount.toFixed(2)}</span>
        `;
        cartList.appendChild(totalLi);
    }
}

// FUNCIÓN PARA IR A LA SECCIÓN DEL CARRITO AL PRESIONAR EL BOTÓN FLOTANTE
function scrollToCart() {
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        cartSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ENVÍO DE ORDEN VÍA WHATSAPP
function sendToWhatsApp() {
    let message = "¡Hola *SamybalTech*! Vengo de la página web y me gustaría consultar la disponibilidad del siguiente pedido:\n\n";

    if (cart.length === 0) {
        message += "Quisiera información sobre sus equipos en stock y servicio técnico.";
    } else {
        cart.forEach((item, idx) => {
            message += `${idx + 1}. *${item.title}* - ${item.price}\n`;
        });

        const total = calculateCartTotal();
        if (total > 0) {
            message += `\n*Monto Total Estimado:* S/${total.toFixed(2)}\n`;
        }
        message += "\nQuedo a la espera de su atención.";
    }

    const url = `https://wa.me/${SAMY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// CONTROL DEL CARRUSEL DE PORTADA
function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// MODO OSCURO TOGGLE
function toggleDarkMode() {
    document.body.classList.toggle('gamer-mode');
    const modeText = document.getElementById('modeText');
    const modeIcon = document.querySelector('#modeToggleBtn i');

    if (document.body.classList.contains('gamer-mode')) {
        if (modeText) modeText.textContent = "Modo Claro";
        if (modeIcon) modeIcon.className = "fa-solid fa-sun";
    } else {
        if (modeText) modeText.textContent = "Modo Oscuro";
        if (modeIcon) modeIcon.className = "fa-solid fa-moon";
    }
}

// INICIALIZAR VISTA PREDETERMINADA AL CARGAR
document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.tab-btn.active');
    showCategory('refrigeracion', firstTab);
});

// Abrir el Modal con los datos del producto
function openProductModal(productId, categoryKey) {
    const product = catalogDatabase[categoryKey]?.find(item => item.id === productId);
    if (!product) return;

    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = product.price;
    document.getElementById('modalProductDesc').textContent = product.desc;

    // Cargar Etiqueta
    const tagElem = document.getElementById('modalProductTag');
    if (product.tag) {
        tagElem.textContent = product.tag;
        tagElem.style.display = 'inline-block';
    } else {
        tagElem.style.display = 'none';
    }

    // Cargar Lista de Especificaciones
    const specsList = document.getElementById('modalProductSpecs');
    specsList.innerHTML = '';
    if (product.specs && product.specs.length > 0) {
        product.specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });
    } else {
        specsList.innerHTML = '<li>Consultar más detalles técnicos por WhatsApp.</li>';
    }

    // Configurar el botón del modal para agregar al carrito
    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.onclick = () => {
        addToCart(product.title, product.price);
        closeProductModal();
    };

    // Mostrar modal
    document.getElementById('productModal').classList.add('active');
}

// Cerrar el Modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}
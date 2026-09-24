// Número de teléfono de atención
const SAMY_WHATSAPP_NUMBER = "51936329133"; // Reemplaza con el número de teléfono real

let cart = [];
let currentSlide = 0;

// BASE DE DATOS DE COMPUTADORAS SEGÚN CANAL / CATEGORÍA
const pcDatabase = {
    oficina: [
        { title: "PC Hogar & Tareas Básicas", desc: "Navegación fluida, tareas escolares, llamadas Zoom e impresiones.", price: "S/800.00", icon: "fa-desktop" },
        { title: "PC Oficina Pro Veloz", desc: "Procesador rápido, arranque en segundos y excelente desempeño en Excel masivo.", price: "S/1650.00", icon: "fa-briefcase" }
    ],
    gamer: [
        { title: "PC Gamer Gama Entrada (1080p)", desc: "Optimizada para Valorant, Fortnite, CS:GO y League of Legends.", price: "S/2400.00", icon: "fa-gamepad" },
        { title: "PC Ultra Gamer & Streaming", desc: "Chasis RGB, gráfica dedicada de alta potencia para transmitir y jugar sin tirones.", price: "S/7000.00", icon: "fa-headset" }
    ],
    ingenieria: [
        { title: "Workstation AutoCAD & Planos 2D/3D", desc: "Procesador de alto rendimiento por núcleo y memoria ultrarrápida.", price: "S/7500.00", icon: "fa-compass-drafting" },
        { title: "Estación de Render 3D & SolidWorks", desc: "Tarjeta gráfica dedicada con soporte CUDA/OpenCL para renderizado exigente.", price: "S/8000.00", icon: "fa-cubes" }
    ]
};

// CAMBIAR PESTAÑA / CANAL DE ENSAMBLADOS (CORREGIDO PARA EVITAR ERRORES DE EVENTO)
function switchCategory(categoryKey, element) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    } else if (buttons.length > 0) {
        buttons[0].classList.add('active');
    }

    const container = document.getElementById('pcsGrid');
    if (!container) return;
    
    container.innerHTML = '';

    const items = pcDatabase[categoryKey];
    if (items) {
        items.forEach(item => {
            const cardHTML = `
                <div class="card">
                    <div class="card-img-wrapper">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-desc">${item.desc}</p>
                        <div class="card-price">${item.price}</div>
                        <button class="btn-add" onclick="addToCart('${item.title}', '${item.price}')">
                            <i class="fa-solid fa-cart-plus"></i> Añadir al Pedido
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }
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
    switchCategory('oficina');
});
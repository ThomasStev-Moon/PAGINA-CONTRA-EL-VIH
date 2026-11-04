document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. NAVEGACIÓN MÓVIL (MENÚ HAMBURGUESA)
       ========================================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('activo');
            menuBtn.innerHTML = navMenu.classList.contains('activo') ? '✕' : '☰';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('activo');
                menuBtn.innerHTML = '☰';
            });
        });
    }

    /* ==========================================================
       2. SLIDER INTERACTIVO
       ========================================================== */
    const slides = document.querySelectorAll('.slide');
    const puntos = document.querySelectorAll('.punto');
    const btnPrev = document.getElementById('prevSlide');
    const btnNext = document.getElementById('nextSlide');
    
    let slideActual = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;

    function mostrarSlide(index) {
        if (index >= totalSlides) slideActual = 0;
        else if (index < 0) slideActual = totalSlides - 1;
        else slideActual = index;

        slides.forEach(slide => slide.classList.remove('activo'));
        puntos.forEach(punto => punto.classList.remove('activo'));

        slides[slideActual].classList.add('activo');
        if (puntos[slideActual]) {
            puntos[slideActual].classList.add('activo');
        }
    }

    function siguienteSlide() {
        mostrarSlide(slideActual + 1);
    }

    function anteriorSlide() {
        mostrarSlide(slideActual - 1);
    }

    if (btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            siguienteSlide();
            reiniciarAutoplay();
        });
        btnPrev.addEventListener('click', () => {
            anteriorSlide();
            reiniciarAutoplay();
        });
    }

    puntos.forEach(punto => {
        punto.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            mostrarSlide(index);
            reiniciarAutoplay();
        });
    });

    function iniciarAutoplay() {
        autoplayTimer = setInterval(siguienteSlide, 5000);
    }

    function reiniciarAutoplay() {
        clearInterval(autoplayTimer);
        iniciarAutoplay();
    }

    iniciarAutoplay();

    /* ==========================================================
       3. GALERÍA CON VISOR MODAL (LIGHTBOX)
       ========================================================== */
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img-real');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCerrar = document.getElementById('lightboxCerrar');

    galeriaItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            const alt = item.getAttribute('data-alt');

            if (lightboxImg && lightbox) {
                lightboxImg.src = src;
                lightboxImg.alt = alt;
                if (lightboxCaption) lightboxCaption.textContent = alt;
                lightbox.classList.add('activo');
            }
        });
    });

    function cerrarLightbox() {
        if (lightbox) {
            lightbox.classList.remove('activo');
        }
    }

    if (lightboxCerrar) {
        lightboxCerrar.addEventListener('click', cerrarLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                cerrarLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('activo')) {
            cerrarLightbox();
        }
    });

    /* ==========================================================
       4. INTEGRACIÓN DE CHATBOT (DEEPSEEK API + INFOVIH PROMPT)
       ========================================================== */
    const API_KEY = '';
    const API_URL = '';

    const SYSTEM_PROMPT = `
Eres "InfoVIH", un asistente virtual educativo especializado EXCLUSIVAMENTE en brindar información clara, precisa y actualizada sobre el VIH (Virus de Inmunodeficiencia Humana) y el SIDA.

Tus principios son:
1. Brindas información basada en evidencia científica y en guías de organismos de salud reconocidos (OMS, ONUSIDA, CDC, ministerios de salud).
2. Hablas con un tono cálido, respetuoso, empático y libre de juicios o estigma.
3. Cubres temas como: formas de transmisión y NO transmisión, prevención (preservativo, PrEP, PEP), pruebas de detección, tratamiento antirretroviral, indetectable = intransmisible (I=I), vivir con VIH, derechos de las personas con VIH, y desmentir mitos comunes.
4. NUNCA diagnosticas a una persona ni das indicaciones de dosis de medicamentos. Para diagnóstico, tratamiento personalizado o resultados de pruebas, siempre remites a un médico, centro de salud o línea de atención especializada.
5. Si detectas angustia emocional, una posible exposición reciente de riesgo, o pensamientos de autolesión, respondes con calma, validas la emoción y recomiendas buscar ayuda profesional o de emergencia de inmediato, sin dejar de responder con información útil.
6. Si te preguntan algo fuera del tema VIH/salud sexual, indicas amablemente que tu especialidad es el VIH y rediriges la conversación a ese tema.
7. Usas lenguaje sencillo, evitas tecnicismos innecesarios y explicas los términos médicos cuando los usas.

Recuerda siempre cerrar temas sensibles recordando que este chatbot no sustituye una consulta médica profesional.
`;

    let historialMensajes = [];

    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    const closeChat = document.getElementById('closeChat');
    const clearChat = document.getElementById('clearChat');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const openChatNav = document.getElementById('openChatNav');

    function toggleChatWidget() {
        chatWidget.classList.toggle('activo');
    }

    if (chatToggle) chatToggle.addEventListener('click', toggleChatWidget);
    if (closeChat) closeChat.addEventListener('click', toggleChatWidget);
    if (openChatNav) {
        openChatNav.addEventListener('click', (e) => {
            e.preventDefault();
            chatWidget.classList.add('activo');
        });
    }

    if (clearChat) {
        clearChat.addEventListener('click', () => {
            historialMensajes = [];
            chatMessages.innerHTML = `
                <div class="chat-message assistant">
                    ¡Hola! 👋 Soy <strong>InfoVIH</strong>. Puedes preguntarme sobre prevención, pruebas de detección, tratamiento, PrEP/PEP, o cualquier duda relacionada con el VIH. ¿En qué puedo ayudarte hoy?
                </div>
            `;
        });
    }

    function agregarMensaje(rol, texto) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', rol);
        msgDiv.innerHTML = texto;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

    async function enviarADeepSeek(promptUsuario) {
        historialMensajes.push({ role: 'user', content: promptUsuario });

        const loadingDiv = agregarMensaje('typing', 'Escribiendo respuesta...');

        const payload = {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...historialMensajes
            ],
            temperature: 0.4
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            chatMessages.removeChild(loadingDiv);

            if (!response.ok) {
                const errData = await response.json();
                agregarMensaje('assistant', `❌ Error (${response.status}): ${errData.error?.message || 'No se pudo obtener respuesta.'}`);
                return;
            }

            const data = await response.json();
            const respuestaBot = data.choices[0].message.content;

            historialMensajes.push({ role: 'assistant', content: respuestaBot });
            
            // Formatear respuestas simples de Markdown a HTML
            let formattedResponse = respuestaBot
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            agregarMensaje('assistant', formattedResponse);

        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            agregarMensaje('assistant', `🔌 Error de conexión: ${error.message}`);
        }
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const texto = chatInput.value.trim();
            if (texto === '') return;

            agregarMensaje('user', texto);
            chatInput.value = '';
            enviarADeepSeek(texto);
        });
    }
});
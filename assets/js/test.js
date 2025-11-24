// Variáveis para controle do scroll
let headerEl = document.querySelector("header");
let headerPosition = headerEl.offsetTop;
let lastScrollTop = 0;
let isScrollingUp = false;

// Função para adicionar sticky class ao header se scroll up e esconder em scroll down
function handleHeaderScroll() {
	const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

	// Só aplica o efeito se o scroll for maior que 72px
	if (currentScrollTop > headerPosition && currentScrollTop > 72) {
		// Determina a direção do scroll
		isScrollingUp = currentScrollTop < lastScrollTop;

		if (isScrollingUp) {
			// Scroll para cima - mostra header
			headerEl.classList.remove("hidden");
		} else {
			// Scroll para baixo - esconde header
			headerEl.classList.add("hidden");
		}
	} else {
		// Está no topo da página ou menor que 72px - remove classes
		headerEl.classList.remove("hidden");
	}

	// Atualiza a última posição do scroll
	lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

// Event listener para o scroll com throttling para melhor performance
let scrollTimeout;
window.addEventListener('scroll', function () {
	if (!scrollTimeout) {
		scrollTimeout = setTimeout(function () {
			handleHeaderScroll();
			scrollTimeout = null;
		}, 10);
	}
});

// Chama a função uma vez para definir o estado inicial
handleHeaderScroll();

// Função para detectar quando o scroll terminou e esconder o header
function hideHeaderAfterScroll() {
	let scrollEndTimer;

	return new Promise((resolve) => {
		const checkScrollEnd = () => {
			clearTimeout(scrollEndTimer);
			scrollEndTimer = setTimeout(() => {
				headerEl.classList.add("hidden");
				window.removeEventListener('scroll', checkScrollEnd);
				resolve();
			}, 150); // Espera 150ms após o último evento de scroll
		};

		window.addEventListener('scroll', checkScrollEnd);
		checkScrollEnd(); // Chama imediatamente caso já esteja no destino
	});
}

// Esconder o header quando clicar nos links de navegação
document.querySelectorAll('header .nav-link').forEach(link => {
	link.addEventListener('click', function () {
		hideHeaderAfterScroll();
	});
});

// Função para esconder o menu do Bootstrap após clicar em um link
function closeBootstrapMenu() {
	const navbarCollapse = document.querySelector('.navbar-collapse.show');
	if (navbarCollapse) {
		const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
		bsCollapse.hide();
	}
}

// Adiciona o evento para fechar o menu ao clicar em um link do menu
document.querySelectorAll('header .nav-link').forEach(link => {
	link.addEventListener('click', function () {
		closeBootstrapMenu();
	});
});

// Função para fazer scroll suave para o topo da página
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// Event listener para botões de "voltar ao topo"
function initScrollToTopButtons() {
	// Seleciona elementos que podem servir como botões de voltar ao topo
	const scrollToTopElements = document.querySelectorAll(
		'.scroll-to-top, .back-to-top, [data-scroll-to-top], .btn-top'
	);

	scrollToTopElements.forEach(element => {
		element.addEventListener('click', function (e) {
			e.preventDefault();
			scrollToTop();
		});
	});
}

// Chama a função para configurar os botões de scroll to top
initScrollToTopButtons();

// Função para adicionar classe animate quando elementos estiverem visíveis na tela
function initAnimateOnScroll() {
	const elementsToAnimate = document.querySelectorAll('[data-animate], .animate-on-scroll');

	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.25 // 25% do elemento visível
	};

	const observerCallback = (entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate');
				// Opcional: parar de observar após animar (descomente a linha abaixo se quiser animar apenas uma vez)
				// observer.unobserve(entry.target);
			} else {
				entry.target.classList.remove('animate');
			}
		});
	};

	const observer = new IntersectionObserver(observerCallback, observerOptions);

	elementsToAnimate.forEach(element => {
		observer.observe(element);
	});
}

// Chama a função para configurar a animação ao scroll
initAnimateOnScroll();

// Inicializa tooltips usando Bootstrap
document.addEventListener('DOMContentLoaded', function () {
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.forEach(function (tooltipTriggerEl) {
		new bootstrap.Tooltip(tooltipTriggerEl, {
			offset: [0, 10]
		});
	});
});

// Função para fazer um elemento apontar para o mouse dentro de uma div específica
function initMouseFollowElement() {
	const containers = document.querySelectorAll('[data-mouse-follow-container]');

	containers.forEach(container => {
		const targetSelector = container.getAttribute('data-mouse-follow-target');
		const targetElement = container.querySelector(targetSelector);

		if (!targetElement) return;

		container.addEventListener('mousemove', function (e) {
			const containerRect = container.getBoundingClientRect();
			const targetRect = targetElement.getBoundingClientRect();

			// Calcula a posição do mouse relativa ao centro do elemento
			const targetCenterX = targetRect.left + targetRect.width / 2;
			const targetCenterY = targetRect.top + targetRect.height / 2;

			const mouseX = e.clientX;
			const mouseY = e.clientY;

			// Calcula o ângulo em radianos
			const angleRad = Math.atan2(mouseY - targetCenterY, mouseX - targetCenterX);

			// Converte para graus
			const angleDeg = angleRad * (180 / Math.PI);

			// Aplica a rotação ao elemento
			targetElement.style.transform = `rotate(${angleDeg}deg)`;
		});

		container.addEventListener('mouseleave', function () {
			// Opcional: reseta a rotação quando o mouse sair
			targetElement.style.transform = 'rotate(0deg)';
		});
	});
}

// Chama a função para inicializar o mouse follow
initMouseFollowElement();

// Adiciona/remover a classe 'prevent' ao header ao abrir/fechar o menu
const navbarCollapse = document.querySelector('.navbar-collapse');
if (navbarCollapse) {
	navbarCollapse.addEventListener('show.bs.collapse', function () {
		headerEl.classList.add('prevent');
	});
	navbarCollapse.addEventListener('hide.bs.collapse', function () {
		headerEl.classList.remove('prevent');
	});
}

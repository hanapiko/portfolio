// Particle Animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const pulseParticles = [];
const floatingCount = 60;
const pulseCount = 20;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = 'rgba(100, 255, 218, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class PulseParticle {
    constructor(side) {
        this.side = side;
        this.reset();
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.8 + 0.4;
    }

    reset() {
        this.y = Math.random() * canvas.height;
        this.distance = 0;
        this.maxDistance = Math.random() * 200 + 150;

        if (this.side === 'left') {
            this.x = 0;
            this.angle = Math.random() * Math.PI - Math.PI / 2;
        } else {
            this.x = canvas.width;
            this.angle = Math.random() * Math.PI + Math.PI / 2;
        }
    }

    update() {
        this.distance += this.speed;

        if (this.distance > this.maxDistance) {
            this.reset();
        }

        if (this.side === 'left') {
            this.x = this.distance;
        } else {
            this.x = canvas.width - this.distance;
        }

        this.y += Math.sin(this.angle) * 0.5;
    }

    draw() {
        ctx.fillStyle = 'rgba(100, 255, 218, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < floatingCount; i++) {
        particles.push(new Particle());
    }

    for (let i = 0; i < pulseCount; i++) {
        pulseParticles.push(new PulseParticle('left'));
        pulseParticles.push(new PulseParticle('right'));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allParticles = [...particles, ...pulseParticles];

    for (let i = 0; i < allParticles.length; i++) {
        allParticles[i].update();
        allParticles[i].draw();

        for (let j = i + 1; j < allParticles.length; j++) {
            const dx = allParticles[i].x - allParticles[j].x;
            const dy = allParticles[i].y - allParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(allParticles[i].x, allParticles[i].y);
                ctx.lineTo(allParticles[j].x, allParticles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Form Submission
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

    alert(`Thank you, ${name}! Opening your email client to send the message...`);
    window.location.href = `mailto:apikojuma94@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    form.reset();
});

// Scroll Animation for Nav
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        nav.style.boxShadow = 'none';
    } else {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// Typing Animation for Hero Name
const heroName = document.querySelector('#hero h1');
const nameText = heroName.textContent;
heroName.textContent = '';
heroName.style.fontFamily = "'Space Mono', monospace";
heroName.style.borderRight = '3px solid var(--secondary)';

let charIndex = 0;
function typeWriter() {
    if (charIndex < nameText.length) {
        heroName.textContent += nameText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        setTimeout(() => {
            heroName.style.borderRight = 'none';
        }, 500);
    }
}

setTimeout(typeWriter, 500);

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', () => {
    initMagneticHover();
});

// Magnetic Hover Effect for Project Cards
function initMagneticHover() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

initMagneticHover();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'light') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Enhanced Design Modal with Gallery
const modal = document.getElementById('design-modal');
const modalTitle = document.getElementById('modal-title');
const figmaLink = document.getElementById('figma-link');
const closeModal = document.querySelector('.close-modal');
const mediaContainer = document.getElementById('media-container');
const modalImg = document.getElementById('modal-img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
const currentIndexSpan = document.getElementById('current-index');
const totalImagesSpan = document.getElementById('total-images');
const zoomBtn = document.getElementById('zoom-btn');

let currentProject = null;
let currentMediaIndex = 0;
let isZoomed = false;

const designData = {
    happiness: {
        title: 'Happiness Events App',
        figmaUrl: 'https://www.figma.com/design/kmGg7kbM1LsJpVCEu58y3A/Happiness?node-id=13-1989&p=f&t=IA2WFRLyWbzZD1LR-0',
        media: [
            { type: 'image', src: 'images/happiness/Landing Page.png', alt: 'Landing Page Design' },
            { type: 'image', src: 'images/happiness/Events page.png', alt: 'Events Listing Page' },
            { type: 'image', src: 'images/happiness/Event detail page.png', alt: 'Event Detail Page' },
            { type: 'image', src: 'images/happiness/Frame 1171279295.png', alt: 'Additional Design Frame' }
        ]
    },
    chichwa: {
        title: 'Chichwa Agricultural Marketplace',
        figmaUrl: 'https://www.figma.com/design/30y4o1lvhkrBnGocDZgSD8/UNDP-DESIGNS?node-id=735-11400&t=CUDaUXogAqvhMrkG-0',
        media: [
            { type: 'image', src: 'images/chichwa/Landing_Page_HiFi_1.png', alt: 'Landing Page Design' },
            { type: 'image', src: 'images/chichwa/Login Page.png', alt: 'Login Interface' },
            { type: 'image', src: 'images/chichwa/Registration-page.png', alt: 'Registration Page' },
            { type: 'image', src: 'images/chichwa/overview super-user page.png', alt: 'Super User Dashboard' }
        ]
    },
    chiro: {
        title: 'Chiro E-Commerce Platform',
        figmaUrl: 'https://www.figma.com/design/qILuyMlQL2cJzNrbeqrlP4/chiro?node-id=100-22194&t=NQ7N6M66AzM8gcx1-0',
        media: [
            { type: 'image', src: 'images/chiro/Covers.png', alt: 'Platform Overview' },
            { type: 'image', src: 'images/chiro/Desktop - 30.png', alt: 'Dashboard Interface' },
            { type: 'image', src: 'images/chiro/Desktop - 31.png', alt: 'Patient Management' },
            { type: 'image', src: 'images/chiro/Desktop - 53.png', alt: 'Treatment Tracking' }
        ]
    }
};

function updateMedia() {
    const media = currentProject.media[currentMediaIndex];

    if (media.type === 'video') {
        mediaContainer.innerHTML = `<video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
            <source src="${media.src}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
        zoomBtn.style.display = 'none';
    } else {
        mediaContainer.innerHTML = `<img id="modal-img" src="${media.src}" alt="${media.alt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">`;
        zoomBtn.style.display = 'block';
    }

    currentIndexSpan.textContent = currentMediaIndex + 1;
    totalImagesSpan.textContent = currentProject.media.length;

    prevBtn.disabled = currentMediaIndex === 0;
    nextBtn.disabled = currentMediaIndex === currentProject.media.length - 1;

    updateThumbnails();
    resetZoom();
}

function updateThumbnails() {
    thumbnailsContainer.innerHTML = '';

    currentProject.media.forEach((media, index) => {
        const thumb = document.createElement('img');
        thumb.src = media.type === 'video' ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA2MCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjMEExOTJGIi8+Cjx0ZXh0IHg9IjMwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM2NEZGREEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklERU88L3RleHQ+Cjwvc3ZnPgo=' : media.src;
        thumb.alt = media.alt;
        thumb.className = `thumbnail ${index === currentMediaIndex ? 'active' : ''}`;
        thumb.addEventListener('click', () => {
            currentMediaIndex = index;
            updateMedia();
        });
        thumbnailsContainer.appendChild(thumb);
    });
}

function resetZoom() {
    isZoomed = false;
    mediaContainer.classList.remove('zoomed');
    const zoomIcon = zoomBtn.querySelector('i');
    zoomIcon.className = 'fas fa-search-plus';
}

function toggleZoom() {
    const currentMedia = mediaContainer.querySelector('img, video');
    if (!currentMedia || currentProject.media[currentMediaIndex].type === 'video') return;

    isZoomed = !isZoomed;
    const zoomIcon = zoomBtn.querySelector('i');

    if (isZoomed) {
        mediaContainer.classList.add('zoomed');
        zoomIcon.className = 'fas fa-search-minus';
    } else {
        mediaContainer.classList.remove('zoomed');
        zoomIcon.className = 'fas fa-search-plus';
    }
}

// Event Listeners
document.querySelectorAll('.view-design-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const designCard = btn.closest('.design-card');
        const designType = designCard.getAttribute('data-design');
        currentProject = designData[designType];
        currentMediaIndex = 0;

        modalTitle.textContent = currentProject.title;
        figmaLink.href = currentProject.figmaUrl;
        console.log('Figma URL set to:', currentProject.figmaUrl);

        updateMedia();

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

prevBtn.addEventListener('click', () => {
    if (currentMediaIndex > 0) {
        currentMediaIndex--;
        updateMedia();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentMediaIndex < currentProject.media.length - 1) {
        currentMediaIndex++;
        updateMedia();
    }
});

zoomBtn.addEventListener('click', toggleZoom);

// Figma link click handler
figmaLink.addEventListener('click', (e) => {
    console.log('Figma link clicked:', figmaLink.href);
    if (figmaLink.href && figmaLink.href !== '#') {
        window.open(figmaLink.href, '_blank');
    } else {
        e.preventDefault();
        console.log('No valid Figma URL');
    }
});

mediaContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && currentProject.media[currentMediaIndex].type === 'image') {
        toggleZoom();
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetZoom();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentMediaIndex > 0) {
                    currentMediaIndex--;
                    updateMedia();
                }
                break;
            case 'ArrowRight':
                if (currentMediaIndex < currentProject.media.length - 1) {
                    currentMediaIndex++;
                    updateMedia();
                }
                break;
            case 'Escape':
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetZoom();
                break;
        }
    }
});

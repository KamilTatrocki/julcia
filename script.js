// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(4, 6, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(4, 6, 10, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(el => {
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger on load

// --------------------------------------------------------
// Candlestick Chart Canvas Animation
// --------------------------------------------------------
const canvas = document.getElementById('financial-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Candlestick {
    constructor(x) {
        this.x = x;
        this.width = 10 + Math.random() * 8; // width of body
        
        // Price simulation
        this.open = height / 2 + (Math.random() - 0.5) * 200;
        this.close = this.open + (Math.random() - 0.5) * 60;
        
        // High and Low for the wicks
        this.high = Math.min(this.open, this.close) - Math.random() * 40;
        this.low = Math.max(this.open, this.close) + Math.random() * 40;
        
        this.isBullish = this.close <= this.open; // Canvas y is inverted
        
        this.opacity = 0.05 + Math.random() * 0.15; // Subtle opacity
        this.speedX = 0.2 + Math.random() * 0.5; // Slow movement to the left
    }

    update() {
        this.x -= this.speedX;
    }

    draw(ctx) {
        // Emerald for bullish (up), Red for bearish (down)
        const color = this.isBullish ? `rgba(16, 185, 129, ${this.opacity})` : `rgba(239, 68, 68, ${this.opacity})`;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        // Draw Wick
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.high);
        ctx.lineTo(this.x + this.width / 2, this.low);
        ctx.stroke();

        // Draw Body
        const bodyY = Math.min(this.open, this.close);
        const bodyHeight = Math.abs(this.close - this.open);
        
        // Avoid 0 height body
        const finalBodyHeight = Math.max(bodyHeight, 2);

        ctx.fillRect(this.x, bodyY, this.width, finalBodyHeight);
    }
}

let candles = [];
const maxCandles = Math.floor(window.innerWidth / 20); // Responsive amount of candles

function initCandles() {
    candles = [];
    for (let i = 0; i < maxCandles; i++) {
        // Distribute them across the screen initially
        candles.push(new Candlestick(Math.random() * width));
    }
}

initCandles();

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines for finance feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for(let i=0; i<height; i+=50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    candles.forEach((candle, index) => {
        candle.update();
        candle.draw(ctx);

        // Reset candle when it goes off screen
        if (candle.x + candle.width < 0) {
            candles.splice(index, 1);
            candles.push(new Candlestick(width + Math.random() * 50));
        }
    });

    requestAnimationFrame(animateCanvas);
}

animateCanvas();

// ==========================================================================
// script.js - PARALLAX & INTERACTIONS
// Clean separated JS - each part commented
// ==========================================================================

// 1. GLOBAL PARALLAX - moves background layers at different speeds
// data-speed attribute controls speed: 0.4 = fast/deep, 0.1 = slow/close
// This creates depth till bottom

const parallaxEls = document.querySelectorAll('.parallax');
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || 0);

        // For orbs, include mouse offset for 3D feel
        if (el.id === 'orb' || el.id === 'orbSmall') {
            const mx = parseFloat(el.dataset.mx || 0);
            const my = parseFloat(el.dataset.my || 0);
            // translate3d uses GPU - smoother parallax
            el.style.transform = `translate3d(${mx}px, ${scrollY * speed + my}px, 0)`;
        } else {
            el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        }
    });

    ticking = false;
}

// Use requestAnimationFrame for smooth 60fps parallax
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// 2. MOUSE PARALLAX - orb follows mouse slightly
// Makes yellow orb feel alive and aesthetic (boy vibe)

const orb = document.getElementById('orb');
const orbSmall = document.getElementById('orbSmall');

window.addEventListener('mousemove', (e) => {
    // Calculate mouse position from center (-15 to 15 px)
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    if (orb) {
        orb.dataset.mx = x;
        orb.dataset.my = y;
    }
    if (orbSmall) {
        // Small orb moves opposite for depth
        orbSmall.dataset.mx = -x * 0.5;
        orbSmall.dataset.my = -y * 0.5;
    }

    updateParallax();
});

// 3. REVEAL ON SCROLL - project cards fade up when visible
// Uses IntersectionObserver - modern and performant

const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');

            // Stagger effect - each card delayed a bit
            const index = Array.from(revealEls).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.08}s`;
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// 4. SNAKE GAME - contribution grid left to right
const grid = document.getElementById('contribGrid');
if (grid) {
    const COLS = 12, ROWS = 7, TOTAL = COLS * ROWS;
    const cells = [];
    for (let i = 0; i < TOTAL; i++) {
        const div = document.createElement('div');
        div.className = 'cell dim';
        cells.push(div);
        grid.appendChild(div);
    }
    let snake = [{ row: 0, col: 0 }];
    let food = null;
    const path = [];
    for (let r = 0; r < ROWS; r++) {
        if (r % 2 === 0) for (let c = 0; c < COLS; c++) path.push({ row: r, col: c });
        else for (let c = COLS - 1; c >= 0; c--) path.push({ row: r, col: c });
    }
    let pathIndex = 0;
    function getIndex(row, col) { return row * COLS + col; }
    function placeFood() {
        let attempts = 0;
        while (attempts < 20) {
            const ahead = (pathIndex + 5 + Math.floor(Math.random() * 8)) % path.length;
            const pos = path[ahead];
            const isOnSnake = snake.some(s => s.row === pos.row && s.col === pos.col);
            if (!isOnSnake) { food = { ...pos }; break; }
            attempts++;
        }
    }
    function draw() {
        cells.forEach(c => c.className = 'cell dim');
        if (food) cells[getIndex(food.row, food.col)].className = 'cell snake-food';
        snake.forEach((segment, i) => {
            const idx = getIndex(segment.row, segment.col);
            if (idx >= 0 && idx < cells.length) {
                if (i === 0) cells[idx].className = 'cell snake-head';
                else if (i === 1) cells[idx].className = 'cell snake-body';
                else if (i === 2) cells[idx].className = 'cell snake-body-2';
                else cells[idx].className = 'cell snake-body-3';
            }
        });
    }
    function moveSnake() {
        const nextPos = path[pathIndex];
        if (food && nextPos.row === food.row && nextPos.col === food.col) {
            snake.unshift({ ...nextPos });
            if (snake.length > 6) snake.pop();
            placeFood();
        } else {
            snake.unshift({ ...nextPos });
            snake.pop();
        }
        pathIndex = (pathIndex + 1) % path.length;
        draw();
    }
    placeFood(); draw();
    setInterval(moveSnake, 180);
}


// 5. SMOOTH SCROLL - offset for fixed navbar

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Initial call to set positions
updateParallax();

console.log('%c Tausif Akbar // NITEBOY17 — Black x Yellow Portfolio ', 'background:#FFD60A;color:#000;padding:6px 12px;border-radius:4px;font-weight:bold');
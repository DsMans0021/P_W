function byId(id) {
    return document.getElementById(id);
}

function toggleTheme() {
    document.body.classList.add('theme-transition');
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('prefersDark', String(isDark));
    setTimeout(() => document.body.classList.remove('theme-transition'), 350);
}

function restoreThemePreference() {
    const stored = localStorage.getItem('prefersDark');
    if (stored === 'true') {
        document.body.classList.add('dark');
    }
}

function updateScrollProgress() {
    const progress = byId('scroll-progress');
    if (!progress) return;
    const scrolled = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progress.style.width = pct + '%';
}

function detectBrowserInfo() {
    const infoEl = byId('browser-info');
    if (!infoEl) return;
    const ua = navigator.userAgent;
    const lang = navigator.language || 'en';
    const online = navigator.onLine ? 'online' : 'offline';
    infoEl.textContent = `User agent: ${ua} | Language: ${lang} | Network: ${online}`;
}

const accentQueue = [
    { h: 230, s: '85%', l: '56%', label: 'Indigo' },
    { h: 190, s: '90%', l: '50%', label: 'Cyan' },
    { h: 280, s: '70%', l: '50%', label: 'Purple' },
    { h: 150, s: '65%', l: '44%', label: 'Green' },
    { h: 12,  s: '85%', l: '54%', label: 'Orange' }
];

function cycleAccentColor() {
    const currentHue = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-h').trim();
    const currentIndex = accentQueue.findIndex(c => String(c.h) === currentHue);
    const next = accentQueue[(currentIndex + 1) % accentQueue.length];
    document.documentElement.style.setProperty('--accent-h', String(next.h));
    document.documentElement.style.setProperty('--accent-s', next.s);
    document.documentElement.style.setProperty('--accent-l', next.l);

    const label = byId('accent-label');
    const dot = byId('accent-preview');
    if (label) label.textContent = `Current: ${next.label}`;
    if (dot) dot.style.background = `hsl(${next.h} ${next.s} ${next.l})`;
}

function renderConfettiBurst() {
    const canvas = byId('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const particleCount = 100;
    const hues = [230, 190, 280, 150, 12];
    const particles = Array.from({ length: particleCount }, (_, i) => {
        const hue = hues[i % hues.length];
        return {
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 2,
            size: Math.random() * 4 + 2,
            hue
        };
    });

    let frames = 0;
    function tick() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.03;
            ctx.fillStyle = `hsl(${p.hue} 90% 55%)`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        frames++;
        if (frames < 120) requestAnimationFrame(tick);
    }
    tick();
}

function startLiveClock() {
    const out = byId('live-clock');
    if (!out) return;
    const update = () => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        out.textContent = `${h}:${m}:${s}`;
    };
    update();
    return setInterval(update, 1000);
}

function toggleAchievementsFilter() {
    const list = document.querySelectorAll('#achievements li');
    if (!list || list.length === 0) return;
    list.forEach(li => {
        const text = li.textContent?.toLowerCase() || '';
        const isTech = /python|unity|game|raspberry|ai|tool|hacking|security|c\#/.test(text);
        if (isTech) li.classList.toggle('highlight-tech');
    });
}

function initializeMixer() {
    const red = byId('mix-r');
    const green = byId('mix-g');
    const blue = byId('mix-b');
    const swatch = byId('mix-swatch');
    const label = byId('mix-label');
    if (!(red && green && blue && swatch && label)) return;

    const apply = () => {
        const r = Number(red.value);
        const g = Number(green.value);
        const b = Number(blue.value);
        swatch.style.background = `rgb(${r}, ${g}, ${b})`;
        label.textContent = `rgb(${r}, ${g}, ${b})`;
    };
    [red, green, blue].forEach(inp => inp.addEventListener('input', apply));
    apply();
}

function initializeTiltCard() {
    const card = document.querySelector('.tilt-card');
    const inner = document.querySelector('.tilt-card .tilt-inner');
    if (!(card && inner)) return;
    const limit = 12;
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * limit * 2;
        const rotX = (0.5 - y) * limit * 2;
        inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0) rotateY(0)';
    });
}

function mergeUniqueSkills() {
    const core = ['Unity', 'Python', 'Cybersecurity'];
    const more = ['Raspberry Pi', 'Automation', 'Unity'];
    const mergedUnique = [...new Set([...core, ...more])];
    const el = byId('merged-skills');
    if (el) el.textContent = mergedUnique.join(' • ');
    return mergedUnique;
}

document.addEventListener('DOMContentLoaded', () => {
    restoreThemePreference();
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress);

    const themeBtn = byId('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const detectBtn = byId('detect-browser');
    if (detectBtn) detectBtn.addEventListener('click', detectBrowserInfo);

    const accentBtn = byId('cycle-accent');
    if (accentBtn) accentBtn.addEventListener('click', cycleAccentColor);

    const confettiBtn = byId('confetti-button');
    if (confettiBtn) confettiBtn.addEventListener('click', renderConfettiBurst);

    const liveClockInterval = startLiveClock();
    if (liveClockInterval) window.addEventListener('beforeunload', () => clearInterval(liveClockInterval));

    const filterBtn = byId('toggle-achievements-filter');
    if (filterBtn) filterBtn.addEventListener('click', toggleAchievementsFilter);

    initializeMixer();
    initializeTiltCard();
    mergeUniqueSkills();
});



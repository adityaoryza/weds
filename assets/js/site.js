// --- Core Interactions ---
function handleBodyClick(e) {
    // Magic Dust Cursor Effect
    const dust = document.createElement("div");
    dust.classList.add("magic-dust");

    // Randomize Symbol
    const symbols = ["✨", "★", "⋆", "✧", "🌸"];
    dust.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    // Position exactly at cursor
    dust.style.left = `${e.pageX}px`;
    dust.style.top = `${e.pageY}px`;

    // Random color from palette (Pink & Gold)
    const colors = ["#FFD1DC", "#FFB7B2", "#E6E6FA", "#FFD700", "#FFFFFF"];
    dust.style.color = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(dust);

    // Cleanup
    setTimeout(() => dust.remove(), 1000);
}

// Add mousemove trail for desktop "magic dust"
document.addEventListener('mousemove', (e) => {
    // Throttle creation to avoid lag
    if (Math.random() > 0.85) {
        handleBodyClick(e);
    }
});

// --- Background Particles ---
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return; // Guard clause

    // Create persistent particles
    const particleCount = window.innerWidth < 768 ? 15 : 30; // Fewer on mobile

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const p = document.createElement('div');
    p.classList.add('particle');

    // Random Size
    const size = Math.random() * 6 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    // Random Position
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;

    // Random Opacity
    p.style.opacity = Math.random() * 0.5 + 0.1;

    // Color (White or Pinkish)
    // Color (Theme Aware via CSS Vars)
    p.style.background = Math.random() > 0.5 ? 'var(--particle-1)' : 'var(--particle-2)';

    // Animation
    const duration = Math.random() * 20 + 10;
    p.style.animation = `drift-right ${duration}s linear infinite`;
    p.style.animationDelay = `-${Math.random() * 20}s`;

    container.appendChild(p);
}


// --- Navigation ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.style.transform === 'translateY(0%)';
    menu.style.transform = isOpen ? 'translateY(-100%)' : 'translateY(0%)';
}

// --- Theme ---
function toggleTheme() {
    document.body.classList.toggle('day-mode');
    document.body.classList.toggle('night-mode');
    document.documentElement.classList.toggle('dark');

    const isNight = document.body.classList.contains('night-mode');
    const iconName = isNight ? 'bedtime' : 'wb_sunny';
    document.getElementById('theme-icon-desk').innerText = iconName;
    document.getElementById('theme-icon-mobile').innerText = iconName;

    playChime();
}

// --- Minigame Logic (Robust) ---
let unicornsFound = 0;
const totalUnicorns = 5;

function foundUnicorn(el) {
    // Stop propagation to prevent body ripple
    event.stopPropagation();

    if (el.classList.contains('found')) return;

    unicornsFound++;
    el.classList.add('found');

    // Update Score
    const scoreEl = document.getElementById('score-text');
    scoreEl.innerText = `${unicornsFound}/${totalUnicorns}`;
    scoreEl.classList.add('scale-125', 'text-pink-500');
    setTimeout(() => scoreEl.classList.remove('scale-125', 'text-pink-500'), 200);

    // UI Reveal
    const ui = document.getElementById('game-ui');
    ui.classList.remove('translate-x-40');

    // Feedback
    playChime('high');
    createConfetti(el.getBoundingClientRect().left, el.getBoundingClientRect().top);

    // Win Condition
    if (unicornsFound === totalUnicorns) {
        setTimeout(triggerGrandFinale, 800);
    }
}

// --- Grand Finale Effect ---
function triggerGrandFinale() {
    const container = document.getElementById('finale-container');
    const msg = document.getElementById('finale-message');
    const gameUI = document.getElementById('game-ui');

    // Hide Game UI smoothly
    if (gameUI) {
        gameUI.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        gameUI.style.opacity = '0';
        gameUI.style.transform = 'scale(0) translateX(100%)';
    }

    container.classList.remove('hidden');
    // Ensure overlay is visible
    const overlay = document.getElementById('finale-overlay');
    if (overlay) overlay.classList.remove('opacity-0');

    setTimeout(() => msg.classList.remove('scale-0'), 100);

    // 1. Release massive amount of lanterns
    let lanternInterval = setInterval(() => {
        const l = document.createElement('div');
        l.className = 'lantern';
        l.style.left = Math.random() * 100 + '%';
        l.style.bottom = '-100px';
        l.style.transform = `scale(${0.5 + Math.random()})`;

        const duration = 5 + Math.random() * 5;
        l.style.animation = `floatUp ${duration}s linear forwards`;
        container.appendChild(l);

        // Self-cleanup individual lanterns
        setTimeout(() => l.remove(), duration * 1000);
    }, 100);

    // 2. Confetti Storm
    let confettiInterval = setInterval(() => {
        createConfetti(Math.random() * window.innerWidth, -10, 5);
    }, 200);

    // 3. Audio
    playChime('high');
    setTimeout(() => playChime('high'), 500);

    // 4. Stop creating new elements after 3 seconds (Burst effect)
    setTimeout(() => {
        clearInterval(lanternInterval);
        clearInterval(confettiInterval);
    }, 3000);

    // 5. Hide UI Message & Overlay after 6 seconds (let lanterns keep floating)
    setTimeout(() => {
        msg.classList.add('scale-0'); // Shrink message
        if (overlay) overlay.classList.add('opacity-0'); // Fade out black overlay
    }, 6000);

    // 6. Final Cleanup after 14 seconds (when all lanterns are gone)
    setTimeout(() => {
        container.classList.add('hidden');
        // Reset container content
        container.innerHTML = '<div class="absolute inset-0 bg-black/40 transition-opacity duration-1000" id="finale-overlay"></div><div class="absolute inset-0 flex items-center justify-center"><div class="text-center transform scale-0 transition-transform duration-1000" id="finale-message"><h2 class="text-6xl md:text-8xl font-handwriting text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">Magic Unlocked!</h2><p class="text-white text-xl mt-4 font-bold tracking-widest uppercase">The wedding is blessed</p></div></div>';
    }, 14000);
}

function createConfetti(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;background:hsl(${Math.random() * 360},100%,70%);border-radius:50%;z-index:9999;pointer-events:none`;
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const vel = Math.random() * 150 + 50;

        p.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * vel}px, ${Math.sin(angle) * vel}px) scale(0)`, opacity: 0 }
        ], { duration: 1000, easing: 'cubic-bezier(0, .9, .57, 1)' }).onfinish = () => p.remove();
    }
}

// --- Lanterns ---
function releaseLantern() {
    const input = document.getElementById('wish-input');
    const l = document.createElement('div');

    // Set wish text (visual only for this effect)
    const wishText = input.value.trim() !== "" ? input.value : "✨";
    input.value = "";

    l.className = 'lantern text-[8px] text-white font-bold flex items-center justify-center';
    l.innerText = wishText.length > 5 ? "✨" : wishText;

    // Random horizontal start
    l.style.left = Math.random() * 80 + 10 + '%';

    document.body.appendChild(l);

    // Particle burst at bottom start
    createConfetti(window.innerWidth / 2, window.innerHeight - 50, 5);

    setTimeout(() => l.remove(), 15000);
    playChime();
}

// --- Audio ---
let bgMusic = new Audio('assets/music/bgm.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

async function toggleMusic() {
    // Attempt to play/pause
    if (bgMusic.paused) {
        try {
            await bgMusic.play();
            document.getElementById('music-icon').innerText = 'volume_up';
        } catch (e) {
            console.log("Audio play failed (user interaction needed):", e);
        }
    } else {
        bgMusic.pause();
        document.getElementById('music-icon').innerText = 'volume_off';
    }
}
async function playChime(type) {
    if (Tone.context.state !== 'running') return;
    const s = new Tone.Synth().toDestination();
    s.volume.value = -8;
    s.triggerAttackRelease(type === 'high' ? "C6" : "E5", "8n");
}

// --- Utils & Observers ---

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initParticles();

    // Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% visible

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Scroll Progress
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Optional: Add a scroll progress bar if element exists
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) progressEl.style.width = (winScroll / height) * 100 + "%";
});

// Countdown
const date = new Date("Jan 24, 2026 16:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const d = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    const h = Math.floor(((date - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor(((date - now) % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor(((date - now) % (1000 * 60)) / 1000);

    const boxClass = "glass w-20 h-24 md:w-28 md:h-32 rounded-2xl flex flex-col items-center justify-center border border-pink-200 dark:border-purple-500 shadow-md backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 bg-white/40 dark:bg-black/20";
    const numClass = "font-handwriting text-3xl md:text-5xl font-bold text-pink-600 dark:text-pink-300 drop-shadow-sm leading-none mb-1";
    const labelClass = "text-[10px] md:text-xs font-bold tracking-widest text-purple-900 dark:text-purple-200 uppercase opacity-70";

    document.getElementById('countdown').innerHTML = `
        <div class="${boxClass}">
            <span class="${numClass}">${d}</span>
            <span class="${labelClass}">Hari</span>
        </div>
        <div class="${boxClass}">
            <span class="${numClass}">${h}</span>
            <span class="${labelClass}">Jam</span>
        </div>
        <div class="${boxClass}">
            <span class="${numClass}">${m}</span>
            <span class="${labelClass}">Menit</span>
        </div>
        <div class="${boxClass}">
            <span class="${numClass}">${s}</span>
            <span class="${labelClass}">Detik</span>
        </div>
    `;
}, 1000);

// RSVP Form Logic
function submitRSVP(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Sending...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');

    // Simulate API call
    setTimeout(() => {
        // 1. Audio & Visual Feedback
        playChime('high');
        createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);

        // 2. Change Form Content to Success Message
        const container = e.target.closest('.glass');
        container.innerHTML = `
            <div class="text-center py-12 flex flex-col items-center animate-sparkle-fade">
                <div class="text-6xl mb-4 animate-bounce">💌</div>
                <h3 class="text-4xl font-handwriting text-purple-800 dark:text-white mb-2">Message Sent!</h3>
                <p class="opacity-80 max-w-sm mx-auto mb-6">Your response has been delivered to the stars. Thank you for being part of our fairytale.</p>
                <button onclick="location.reload()" class="text-pink-500 font-bold hover:underline text-sm uppercase tracking-widest">
                    Send another response
                </button>
            </div>
        `;
    }, 1500);
}

// RSVP & Map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const pos = { lat: -7.7956, lng: 110.3695 }; // Yogyakarta
    const map = new Map(document.getElementById("map"), {
        center: pos, zoom: 12, mapId: "DEMO_MAP_ID", disableDefaultUI: true
    });
    const pin = new PinElement({ background: "#d8b4fe", borderColor: "#fff", glyphColor: "#fff" });
    new AdvancedMarkerElement({ map, position: pos, content: pin.element });
}

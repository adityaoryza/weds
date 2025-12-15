        // --- Core Interactions ---
        function handleBodyClick(e) {
            // Magic Dust Cursor Effect
            const dust = document.createElement("div");
            dust.classList.add("magic-dust");

            // Randomize Symbol
            const symbols = ["✨", "★", "⋆", "✧"];
            dust.innerText = symbols[Math.floor(Math.random() * symbols.length)];

            // Position exactly at cursor
            dust.style.left = `${e.pageX}px`;
            dust.style.top = `${e.pageY}px`;

            // Random color from palette
            const colors = ["#FFD1DC", "#E6E6FA", "#FFD700", "#FFFFFF"];
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

            const stars = document.getElementById('stars-layer');
            stars.classList.toggle('opacity-0', !isNight);

            if (isNight && stars.children.length === 0) {
                for (let i = 0; i < 60; i++) {
                    const s = document.createElement('div');
                    s.className = 'absolute bg-white rounded-full animate-twinkle';
                    s.style.width = Math.random() * 2 + 1 + 'px';
                    s.style.height = s.style.width;
                    s.style.left = Math.random() * 100 + '%';
                    s.style.top = Math.random() * 100 + '%';
                    s.style.animation = `twinkle ${Math.random() * 2 + 2}s infinite`;
                    stars.appendChild(s);
                }
            }
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

            container.classList.remove('hidden');
            setTimeout(() => msg.classList.remove('scale-0'), 100);

            // 1. Release massive amount of lanterns
            let lanternInterval = setInterval(() => {
                const l = document.createElement('div');
                l.className = 'lantern';
                l.style.left = Math.random() * 100 + '%';
                l.style.bottom = '-100px';
                l.style.transform = `scale(${0.5 + Math.random()})`;
                l.style.animation = `floatUp ${5 + Math.random() * 5}s linear forwards`;
                container.appendChild(l);
            }, 100);

            // 2. Confetti Storm
            let confettiInterval = setInterval(() => {
                createConfetti(Math.random() * window.innerWidth, -10, 5);
            }, 200);

            // 3. Audio
            playChime('high');
            setTimeout(() => playChime('high'), 500);

            // 4. Cleanup after 8 seconds
            setTimeout(() => {
                clearInterval(lanternInterval);
                clearInterval(confettiInterval);
                msg.classList.add('scale-0');
                setTimeout(() => {
                    container.classList.add('hidden');
                    container.innerHTML = '<div class="absolute inset-0 bg-black/40 transition-opacity duration-1000" id="finale-overlay"></div><div class="absolute inset-0 flex items-center justify-center"><div class="text-center transform scale-0 transition-transform duration-1000" id="finale-message"><h2 class="text-6xl md:text-8xl font-handwriting text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">Magic Unlocked!</h2><p class="text-white text-xl mt-4 font-bold tracking-widest uppercase">The wedding is blessed</p></div></div>';
                    alert("✨ Thank you for blessing our union! ✨");
                }, 1000);
            }, 8000);
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
        let synth;
        async function toggleMusic() {
            await Tone.start();
            if (!synth) {
                synth = new Tone.PolySynth().toDestination();
                synth.volume.value = -12;
                const notes = ["C4", "E4", "G4", "B4"];
                new Tone.Loop(time => {
                    if (Math.random() > 0.6) synth.triggerAttackRelease(notes[Math.floor(Math.random() * 4)], "4n", time);
                }, "8n").start(0);
                Tone.Transport.start();
                document.getElementById('music-icon').innerText = 'pause';
            } else {
                if (Tone.Transport.state === 'started') {
                    Tone.Transport.pause();
                    document.getElementById('music-icon').innerText = 'play_arrow';
                } else {
                    Tone.Transport.start();
                    document.getElementById('music-icon').innerText = 'pause';
                }
            }
        }
        async function playChime(type) {
            if (Tone.context.state !== 'running') return;
            const s = new Tone.Synth().toDestination();
            s.volume.value = -8;
            s.triggerAttackRelease(type === 'high' ? "C6" : "E5", "8n");
        }

        // --- Utils ---
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            document.getElementById('scroll-progress').style.width = (winScroll / height) * 100 + "%";

            document.querySelectorAll('.reveal').forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight * 0.85) el.classList.add('active');
            });
        });

        // Countdown
        const date = new Date("Aug 24, 2025 16:00:00").getTime();
        setInterval(() => {
            const now = new Date().getTime();
            const d = Math.floor((date - now) / (1000 * 60 * 60 * 24));
            const h = Math.floor(((date - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor(((date - now) % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('countdown').innerHTML = `
                <div class="flex flex-col items-center"><span class="text-4xl font-bold text-purple-600 dark:text-white">${d}</span><span class="text-[10px] uppercase opacity-60">Days</span></div>
                <div class="flex flex-col items-center"><span class="text-4xl font-bold text-purple-600 dark:text-white">${h}</span><span class="text-[10px] uppercase opacity-60">Hrs</span></div>
                <div class="flex flex-col items-center"><span class="text-4xl font-bold text-purple-600 dark:text-white">${m}</span><span class="text-[10px] uppercase opacity-60">Mins</span></div>
            `;
        }, 1000);

        // RSVP
        function toggleGuestInput(show) {
            const el = document.getElementById('guest-section');
            if (show) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
        function handleRSVP(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.innerText = 'Sending...';
            setTimeout(() => {
                document.getElementById('rsvp-form').classList.add('hidden');
                document.getElementById('rsvp-success').classList.remove('hidden');
                createConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
            }, 1500);
        }

        // Init Map
        async function initMap() {
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
            const pos = { lat: 34.0927, lng: -118.8055 };
            const map = new Map(document.getElementById("map"), {
                center: pos, zoom: 14, mapId: "DEMO_MAP_ID", disableDefaultUI: true
            });
            const pin = new PinElement({ background: "#d8b4fe", borderColor: "#fff", glyphColor: "#fff" });
            new AdvancedMarkerElement({ map, position: pos, content: pin.element });
        }
        initMap();

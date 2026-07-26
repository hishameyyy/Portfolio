// Ensure initial theme is applied immediately on load
(function applyInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.documentElement.classList.add("light");
        if (document.body) {
            document.body.classList.add("light");
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                document.body.classList.add("light");
            });
        }
    } else {
        document.documentElement.classList.remove("light");
        if (document.body) {
            document.body.classList.remove("light");
        }
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. LOADER
    const loader = document.getElementById("loader");
    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.transition = "opacity 0.5s ease";
                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);
            }, 600);
        });
        // Fallback timeout in case load event fired early
        setTimeout(() => {
            if (loader.style.display !== "none") {
                loader.style.opacity = "0";
                loader.style.transition = "opacity 0.5s ease";
                setTimeout(() => { loader.style.display = "none"; }, 500);
            }
        }, 1500);
    }

    // 2. TYPED.JS
    const typingElement = document.getElementById("typing");
    if (typingElement && typeof Typed !== "undefined") {
        new Typed("#typing", {
            strings: [
                "Creative Developer",
                "Frontend Engineer",
                "UI Designer",
                "Freelancer"
            ],
            typeSpeed: 70,
            backSpeed: 50,
            loop: true
        });
    }

    // 3. THEME TOGGLE & PERSISTENCE
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
        const icon = themeBtn.querySelector("i");
        
        // Sync icon with current theme
        if (document.body.classList.contains("light")) {
            if (icon) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }

        themeBtn.addEventListener("click", () => {
            const isLight = document.body.classList.contains("light") || document.documentElement.classList.contains("light");
            if (isLight) {
                document.body.classList.remove("light");
                document.documentElement.classList.remove("light");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.add("light");
                document.documentElement.classList.add("light");
                localStorage.setItem("theme", "light");
            }
            const currentIsLight = document.body.classList.contains("light");

            if (icon) {
                if (currentIsLight) {
                    icon.classList.remove("fa-moon");
                    icon.classList.add("fa-sun");
                } else {
                    icon.classList.remove("fa-sun");
                    icon.classList.add("fa-moon");
                }
            }
            if (typeof updateSphereTheme === "function") {
                updateSphereTheme();
            }
        });
    }

    function updateSphereTheme() {
        const s = window.sphere;
        if (s && s.material) {
            const isLight = document.body.classList.contains("light");
            s.material.color.setHex(isLight ? 0x0077ff : 0x00e5ff);
            s.material.emissive.setHex(isLight ? 0x0077ff : 0x00e5ff);
            s.material.emissiveIntensity = isLight ? 0.35 : 0.5;
        }
    }

    // 4. MOBILE MENU TOGGLE
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector("header nav");
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                if (nav.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove("active");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close menu when clicking nav links
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // 5. SMOOTH SCROLL
    document.querySelectorAll("a").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            if (this.id === "contactIcon" || !this.hash || this.hash === "#") {
                return;
            }

            // Only smooth scroll if anchor points to current page
            const currentPath = window.location.pathname.replace(/^\//, '');
            const targetPath = this.pathname.replace(/^\//, '');
            if (targetPath && targetPath !== currentPath && targetPath !== '') {
                return;
            }

            try {
                const target = document.querySelector(this.hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            } catch (err) {
                console.warn("Smooth scroll target invalid:", this.hash, err);
            }
        });
    });

    // 6. CONTACT TOGGLE
    const contactIcon = document.getElementById("contactIcon");
    const contactNumber = document.getElementById("contactNumber");
    if (contactIcon && contactNumber) {
        contactIcon.addEventListener("click", function(event) {
            event.preventDefault();
            const isVisible = contactNumber.classList.toggle('visible');
            if (isVisible) {
                contactNumber.hidden = false;
                contactNumber.style.display = 'inline-block';
                contactIcon.setAttribute('aria-label', 'Hide phone number');
            } else {
                contactNumber.hidden = true;
                contactNumber.style.display = 'none';
                contactIcon.setAttribute('aria-label', 'Show phone number');
            }
        });
    }

    // 7. BACK TO TOP BUTTON
    const topBtn = document.getElementById("topBtn");
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.style.display = "flex";
                topBtn.style.alignItems = "center";
                topBtn.style.justifyContent = "center";
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 8. STATS COUNTER ANIMATION
    const counters = document.querySelectorAll(".counter");
    if (counters.length > 0) {
        let animated = false;
        const animateCounters = () => {
            const statsSection = document.querySelector(".stats");
            if (!statsSection) return;
            const rect = statsSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0 && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute("data-target"), 10);
                    if (isNaN(target)) return;
                    let count = 0;
                    const duration = 1500;
                    const stepTime = 30;
                    const steps = duration / stepTime;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.innerText = target + "+";
                            clearInterval(timer);
                        } else {
                            counter.innerText = Math.ceil(count);
                        }
                    }, stepTime);
                });
            }
        };
        window.addEventListener("scroll", animateCounters);
        animateCounters();
    }

    // 9. CONTACT FORM SUBMISSION
    const contactForm = document.querySelector(".contact form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn ? submitBtn.innerText : "Send Message";

            if (submitBtn) {
                submitBtn.innerText = "Message Sent! ✓";
                submitBtn.style.background = "#10b981";
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = "";
                    submitBtn.disabled = false;
                }
            }, 3000);
        });
    }

    // 10. PARTICLES.JS INITIALIZATION
    if (typeof particlesJS === "function" && document.getElementById("particles-js")) {
        try {
            particlesJS("particles-js", {
                particles: {
                    number: { value: 60 },
                    size: { value: 3 },
                    move: { speed: 2 },
                    line_linked: { enable: true },
                    color: { value: "#00e5ff" }
                }
            });
        } catch (e) {
            console.warn("Particles.js init failed:", e);
        }
    }

    // 11. CANVAS WAVE BACKGROUND
    if (typeof initWaves === "function") {
        try { initWaves(); } catch (e) { console.error("initWaves failed:", e); }
    }

    // 12. VANILLA TILT INITIALIZATION
    if (typeof VanillaTilt !== "undefined") {
        VanillaTilt.init(document.querySelectorAll(".tilt-card, .service-card, .project-card, .testimonial-card, .stat-box, .profile-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.15
        });
    }

    // 13. MOUSE GLOW TRACKING
    const mouseGlow = document.querySelector(".mouse-glow");
    if (mouseGlow) {
        window.addEventListener("mousemove", (e) => {
            mouseGlow.style.left = e.clientX + "px";
            mouseGlow.style.top = e.clientY + "px";
        });
    }
});

// Canvas wave background implementation
function initWaves() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    const waves = [
        { amp: 100, freq: 0.0042, speed: 0.0085, phase: 0, colors: ['rgba(59,130,246,0.18)', 'rgba(124,58,237,0.08)'], lineWidth: 2 },
        { amp: 130, freq: 0.0032, speed: 0.0065, phase: 2.1, colors: ['rgba(14,165,233,0.14)', 'rgba(59,130,246,0.07)'], lineWidth: 2 },
        { amp: 55, freq: 0.0068, speed: 0.018, phase: 1.3, colors: ['rgba(0,229,255,0.10)', 'rgba(79,70,229,0.05)'], lineWidth: 1.5 }
    ];

    let t = 0;
    let mouseX = w / 2, mouseY = h / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const horizontalOffset = (mouseX - w / 2) * 0.02;
        const verticalOffset = (mouseY - h / 2) * 0.015;

        waves.forEach((wv, idx) => {
            const step = Math.max(14, Math.round(w / 240));
            const mid = h / 2 + (idx - 1) * 26 + verticalOffset;

            const grad = ctx.createLinearGradient(0, mid - wv.amp, w, mid + wv.amp);
            grad.addColorStop(0, wv.colors[0]);
            grad.addColorStop(1, wv.colors[1]);

            ctx.beginPath();
            ctx.moveTo(0, mid);
            for (let x = 0; x <= w; x += step) {
                const y = mid + Math.sin((x * wv.freq) + (t * wv.speed) + wv.phase + horizontalOffset * 0.03) * wv.amp;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();

            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.26;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, mid);
            for (let x = 0; x <= w; x += step) {
                const y = mid + Math.sin((x * wv.freq) + (t * wv.speed) + wv.phase + horizontalOffset * 0.02) * wv.amp;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = grad;
            ctx.lineWidth = wv.lineWidth;
            ctx.globalAlpha = 0.9;
            ctx.stroke();
        });

        ctx.restore();
        t += 1;
        requestAnimationFrame(draw);
    }

    draw();
}

/* ===========================
   3D Tilt Effect
=========================== */

if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"),{

        max:18,

        speed:400,

        glare:true,

        "max-glare":0.25,

        perspective:1200,

        scale:1.04

    });
}

/* ===========================
   Mouse Glow
=========================== */

const glow = document.querySelector(".mouse-glow");

if (glow) {
    document.addEventListener("mousemove",(e)=>{

        glow.style.left=e.clientX+"px";

        glow.style.top=e.clientY+"px";

    });
}



/* ===========================
   Magnetic Buttons
=========================== */

document.querySelectorAll(".btn1, .btn2, .project-btn, button").forEach(btn=>{

    btn.addEventListener("mousemove",(e)=>{

        const rect=btn.getBoundingClientRect();

        const x=e.clientX-rect.left-rect.width/2;

        const y=e.clientY-rect.top-rect.height/2;

        btn.style.transform=`translate(${x*0.15}px,${y*0.15}px)`;

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translate(0,0)";

    });

});

/* ===========================
   GSAP Animations
=========================== */

if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Step 2: Hero Animation
    if (document.querySelector(".hero-text")) {
        gsap.from(".hero-text", {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power4.out"
        });
    }

    if (document.querySelector(".hero-image")) {
        gsap.from(".hero-image", {
            opacity: 0,
            x: 150,
            duration: 1.4,
            ease: "power4.out"
        });
    }

    // Step 3: Animate Every Section
    document.querySelectorAll("section").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 80,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Step 4: Animate Cards
    gsap.utils.toArray(".service-card, .project-card, .testimonial-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            opacity: 0,
            y: 50,
            scale: .9,
            duration: .8,
            ease: "back.out(1.4)"
        });
    });

    // Step 5: Animate Statistics
    if (document.querySelector(".stat-box")) {
        gsap.from(".stat-box", {
            scrollTrigger: {
                trigger: ".stats"
            },
            opacity: 0,
            scale: .5,
            stagger: .2,
            duration: 1
        });
    }

    // Step 6: Animate Skills
    if (document.querySelector(".skill")) {
        gsap.from(".skill", {
            scrollTrigger: {
                trigger: ".skills"
            },
            opacity: 0,
            x: -100,
            stagger: .2,
            duration: 1
        });
    }

    // Step 7: Animate Buttons
    if (document.querySelector(".btn1, .btn2")) {
        gsap.from(".btn1, .btn2", {
            opacity: 0,
            y: 30,
            delay: .8,
            stagger: .2,
            duration: .8
        });
    }
}

/*============================
Three.js Scene
=============================*/

if (typeof THREE !== "undefined" && document.getElementById("three-bg")) {
    const container = document.getElementById("three-bg");
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    container.appendChild(renderer.domElement);

    camera.position.z = 4;

    // Step 6 – Create a glowing sphere
    const geometry = new THREE.IcosahedronGeometry(
        1,
        32
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        wireframe: true,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.5
    });

    const sphere = new THREE.Mesh(
        geometry,
        material
    );

    window.sphere = sphere;
    if (document.body.classList.contains("light")) {
        sphere.material.color.setHex(0x0077ff);
        sphere.material.emissive.setHex(0x0077ff);
        sphere.material.emissiveIntensity = 0.35;
    }

    scene.add(sphere);

    // Step 7 – Lights
    const light1 = new THREE.PointLight(
        0xffffff,
        3
    );

    light1.position.set(
        5,
        5,
        5
    );

    scene.add(light1);

    const light2 = new THREE.AmbientLight(
        0xffffff,
        0.5
    );

    scene.add(light2);

    // Step 8 – Animation
    function animate() {
        requestAnimationFrame(animate);

        sphere.rotation.x += 0.003;
        sphere.rotation.y += 0.005;

        renderer.render(
            scene,
            camera
        );
    }

    animate();

    // Step 9 – Resize support
    window.addEventListener(
        "resize",
        () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    );

    // Step 10 – Mouse Interaction
    document.addEventListener(
        "mousemove",
        (event) => {
            const mouseX = (event.clientX / window.innerWidth) - 0.5;
            const mouseY = (event.clientY / window.innerHeight) - 0.5;

            sphere.rotation.y = mouseX * 2;
            sphere.rotation.x = mouseY * 2;
        }
    );
}

/* ===========================
   Page Loader & Scroll Progress
=========================== */

window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }
    }, 1200);
});

window.addEventListener("scroll", () => {
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            progressBar.style.width = (scroll / height) * 100 + "%";
        }
    }
});

// Ensure initial theme is applied immediately on load (Default: Light / White theme)
(function applyInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.remove("light");
        if (document.body) {
            document.body.classList.remove("light");
        }
    } else {
        document.documentElement.classList.add("light");
        if (document.body) {
            document.body.classList.add("light");
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                document.body.classList.add("light");
            });
        }
    }
})();

/* ===========================
   LENIS ULTRA-SMOOTH PREMIUM SCROLL
=========================== */

const lenis = (typeof Lenis !== "undefined") ? new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential momentum curve for buttery smooth inertia
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.15,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false
}) : null;

if (lenis && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
} else if (lenis) {
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

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
    const nav = document.getElementById("mobileNav") || document.querySelector(".mobile-nav") || document.querySelector("header nav");
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = nav.classList.toggle("active");
            document.body.style.overflow = isActive ? "hidden" : "";
            const icon = menuBtn.querySelector("i");
            if (icon) {
                if (isActive) {
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
                document.body.style.overflow = "";
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close menu when clicking a nav link
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if (nav.classList.contains("active")) {
                    nav.classList.remove("active");
                    document.body.style.overflow = "";
                    const icon = menuBtn.querySelector("i");
                    if (icon) {
                        icon.classList.remove("fa-xmark");
                        icon.classList.add("fa-bars");
                    }
                }
            });
        });
    }

    // 5. SMOOTH SCROLL (LENIS)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            if (this.id === "contactIcon") return;
            const targetAttr = this.getAttribute("href");
            if (!targetAttr || targetAttr === "#") return;

            const target = document.querySelector(targetAttr);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, {
                        duration: 1.5
                    });
                } else {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });



    // STEP 1 — BACK TO TOP BUTTON (LENIS + STANDALONE)
    const topBtn = document.getElementById("backToTop") || document.getElementById("topBtn");
    if (topBtn) {
        const handleTopBtn = () => {
            const scrollYPos = window.scrollY || document.documentElement.scrollTop;
            if (scrollYPos > 400) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        };

        window.addEventListener("scroll", handleTopBtn);
        if (typeof lenis !== "undefined" && lenis) {
            lenis.on("scroll", handleTopBtn);
        }

        topBtn.addEventListener("click", () => {
            if (typeof lenis !== "undefined" && lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    // STEP 4 — ACTIVE NAVIGATION ON SCROLL
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a, .nav-links a");
    if (sections.length > 0 && navLinks.length > 0) {
        const updateActiveNav = () => {
            let current = "";
            const scrollPos = window.scrollY || document.documentElement.scrollTop;

            sections.forEach(section => {
                const top = section.offsetTop - 150;
                if (scrollPos >= top && section.id) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                const href = link.getAttribute("href");
                if (href === "#" + current || href === "index.html#" + current) {
                    link.classList.add("active");
                }
            });
        };

        window.addEventListener("scroll", updateActiveNav);
        if (typeof lenis !== "undefined" && lenis) {
            lenis.on("scroll", updateActiveNav);
        }
    }

    // STEP 3 — TOAST NOTIFICATION HELPER
    window.showToast = function showToast() {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

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

            if (typeof window.showToast === "function") {
                window.showToast();
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
            max: 15,
            speed: 500,
            glare: true,
            "max-glare": 0.2,
            scale: 1.03
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
   Magnetic Buttons
=========================== */

document.querySelectorAll(".btn1, .btn2, .project-btn").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
        btn.style.transform = `translate(${x}px, ${y - 4}px) scale(1.04)`;
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
    });
});

// Step 9: Parallax Effect on Hero Image
const heroImage = document.querySelector(".hero-image");
if (heroImage) {
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 20;
        const y = (e.clientY / window.innerHeight - .5) * 20;
        heroImage.style.transform = `translate(${x}px, ${y}px)`;
    });
}

/* ===========================
   GSAP Animations
=========================== */

if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Step 4: Hero Animation Timeline
    if (document.querySelector(".hero")) {
        const isMobile = window.innerWidth <= 768;
        gsap.timeline()
            .from(".hero-text h1", {
                opacity: 0,
                y: isMobile ? 30 : 100,
                duration: 1.2,
                ease: "power4.out"
            })
            .from(".hero-text h2", {
                opacity: 0,
                y: isMobile ? 25 : 80,
                duration: 1,
                ease: "power4.out"
            }, "-=0.8")
            .from(".hero-text p", {
                opacity: 0,
                y: isMobile ? 20 : 60,
                duration: 1
            }, "-=0.7")
            .from(".hero-buttons, .buttons", {
                opacity: 0,
                y: isMobile ? 15 : 40,
                duration: .8
            }, "-=0.6")
            .from(".hero-image", {
                opacity: 0,
                x: isMobile ? 0 : 120,
                y: isMobile ? 30 : 0,
                scale: .85,
                duration: 1.2,
                ease: "power4.out"
            }, "-=1");
    }

    // Navbar & Social Dock Animation
    if (document.querySelector("header")) {
        gsap.from("header", {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        });
    }

    if (document.querySelector(".social-dock")) {
        gsap.from(".social-dock", {
            x: -80,
            opacity: 0,
            duration: 1.2,
            delay: 0.8,
            ease: "power4.out"
        });
    }

    if (document.querySelector(".hero-socials")) {
        gsap.from(".hero-socials a", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 1,
            stagger: 0.1,
            ease: "power4.out"
        });
    }

    // Step 6: About Section
    if (document.querySelector(".about")) {
        if (document.querySelector(".about-content, .about-text")) {
            gsap.from(".about-content, .about-text", {
                scrollTrigger: {
                    trigger: ".about",
                    start: "top 80%"
                },
                x: -100,
                opacity: 0,
                duration: 1.2
            });
        }

        if (document.querySelector(".about-image")) {
            gsap.from(".about-image", {
                scrollTrigger: {
                    trigger: ".about",
                    start: "top 80%"
                },
                x: 100,
                opacity: 0,
                duration: 1.2
            });
        }
    }

    // Step 7: Services Animation
    if (document.querySelector(".services")) {
        gsap.from(".service-card", {
            scrollTrigger: {
                trigger: ".services",
                start: "top 75%"
            },
            opacity: 0,
            y: 80,
            stagger: .2,
            duration: 1,
            ease: "back.out(1.4)"
        });
    }

    // Step 11: Project Cards GSAP Animation
    if (document.querySelector(".projects")) {
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: ".projects",
                start: "top 80%"
            },
            opacity: 0,
            y: 120,
            stagger: .25,
            duration: 1,
            ease: "power4.out"
        });
    }

    // Step 9: Skills Animation
    if (document.querySelector(".skills")) {
        gsap.from(".skill", {
            scrollTrigger: {
                trigger: ".skills",
                start: "top 80%"
            },
            opacity: 0,
            x: -80,
            stagger: .15,
            duration: .8
        });
    }

    // Step 10: Contact Section
    if (document.querySelector(".contact")) {
        gsap.from(".contact", {
            scrollTrigger: {
                trigger: ".contact",
                start: "top 85%"
            },
            opacity: 0,
            y: 80,
            duration: 1
        });
    }

    // Step 11: Footer
    if (document.querySelector("footer")) {
        gsap.from("footer", {
            scrollTrigger: {
                trigger: "footer",
                start: "top 95%"
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    }

    // Animate Statistics & Counter Numbers
    if (document.querySelector(".stats")) {
        gsap.from(".stat-box", {
            scrollTrigger: {
                trigger: ".stats",
                start: "top 85%"
            },
            opacity: 0,
            y: 50,
            scale: .85,
            stagger: .2,
            duration: 1,
            ease: "power3.out"
        });

        document.querySelectorAll(".counter").forEach(counter => {
            const targetVal = parseInt(counter.getAttribute("data-target"), 10);
            if (isNaN(targetVal)) return;

            const countObj = { val: 0 };
            gsap.to(countObj, {
                val: targetVal,
                duration: 1.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".stats",
                    start: "top 85%",
                    once: true
                },
                onUpdate: () => {
                    counter.innerText = Math.ceil(countObj.val) + "+";
                },
                onComplete: () => {
                    counter.innerText = targetVal + "+";
                }
            });
        });
    }
}

/*============================
Three.js Particle & Sphere Scene
=============================*/

if (typeof THREE !== "undefined" && document.getElementById("three-bg")) {
    const container = document.getElementById("three-bg");
    container.innerHTML = ""; // Clear existing elements

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    // Step 5 – Create Particle Field
    const particleCount = 3000;
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Step 6 – Add a Floating Wireframe Sphere
    const sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 3),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff
        })
    );
    scene.add(sphere);

    // Step 7 – Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    // Step 8 – Mouse Interaction
    const mouse = { x: 0, y: 0 };
    document.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Step 9 – Animate
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.0007;
        particles.rotation.x += 0.0003;

        sphere.rotation.x += 0.003;
        sphere.rotation.y += 0.005;

        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Step 10 – Resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
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

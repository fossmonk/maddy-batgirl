document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Language Switcher Logic ---
    const btnEn = document.getElementById('lang-en');
    const btnMl = document.getElementById('lang-ml');
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    
    function setLanguage(lang) {
        if (!translations[lang]) return;
        
        // Update page title
        if (translations[lang].pageTitle) {
            document.title = translations[lang].pageTitle;
        }

        // Update active class on buttons
        if (lang === 'en') {
            btnEn.classList.add('active');
            btnMl.classList.remove('active');
            document.body.classList.remove('lang-ml');
        } else {
            btnMl.classList.add('active');
            btnEn.classList.remove('active');
            document.body.classList.add('lang-ml');
        }
        
        // Translate elements
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

    btnEn.addEventListener('click', () => setLanguage('en'));
    btnMl.addEventListener('click', () => setLanguage('ml'));

    // Initialize with English
    setLanguage('en');


    // --- 2. Countdown Timer Logic ---
    // Target: 22nd January 2027, 06:30 AM (IST ideally, but local browser time is fine for this invite)
    const weddingDate = new Date('2027-01-22T06:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    // --- 3. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const unlockBtn = document.getElementById('unlock-btn');
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.envelope-flap');

    // Unlock Animation
    unlockBtn.addEventListener('click', () => {
        const tl = gsap.timeline();
        
        // Open envelope flap
        tl.to(envelopeFlap, { rotationX: 180, duration: 0.5, transformOrigin: "top" })
          // Fade out the lock
          .to(unlockBtn, { opacity: 0, scale: 0.5, duration: 0.3 }, "-=0.3")
          // Scale up the envelope to cover screen or fade out preloader
          .to(envelope, { scale: 5, opacity: 0, duration: 0.8, ease: "power2.inOut" })
          // Fade out preloader background
          .to(preloader, { opacity: 0, duration: 0.5, onComplete: () => {
              preloader.style.display = 'none';
              mainContent.style.display = 'block';
              gsap.to(mainContent, { opacity: 1, duration: 0.5 });
              initScrollAnimations();
          } }, "-=0.4");
    });

    // Scroll Animations
    function initScrollAnimations() {
        ScrollTrigger.refresh();

        // Sections
        const sections = document.querySelectorAll('.slide-section');
        sections.forEach(section => {
            
            // Fade up elements inside section
            const fadeUps = section.querySelectorAll('.fade-up');
            if(fadeUps.length > 0) {
                gsap.to(fadeUps, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            }

            // Fade left/right for story section
            const fadeRight = section.querySelector('.fade-right');
            const fadeLeft = section.querySelector('.fade-left');
            
            if(fadeRight && fadeLeft) {
                gsap.to([fadeRight, fadeLeft], {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        });
    }
});

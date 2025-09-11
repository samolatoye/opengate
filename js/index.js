// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.padding = '0.5rem 0';
        nav.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
    } else {
        nav.style.padding = '1rem 0';
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease';
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card, .service-card, .blog-card').forEach(el => {
    observer.observe(el);
});

// Add hover effect for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Blog card animations
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add category filtering functionality (optional enhancement)
document.querySelectorAll('.blog-category').forEach(category => {
    category.addEventListener('click', function(e) {
        e.preventDefault();
        const categoryText = this.textContent;
        console.log(`Filter by category: ${categoryText}`);
        // Could implement actual filtering logic here
    });
});

// Active navigation highlight (scroll spy)
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    let scrollPos = window.scrollY + 120; // offset for fixed nav
    let currentId = null;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            currentId = sec.id;
        }
    });
    navLinks.forEach(link => {
        if (link.getAttribute('href').slice(1) === currentId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);

// Mobile Menu Functionality
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && mobileNavLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileNavLinks.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavLinks.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileNavLinks.contains(e.target)) {
            mobileNavLinks.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// Blog Carousel Functionality
class BlogCarousel {
    constructor() {
        this.carousel = document.getElementById('blogCarousel');
        this.indicators = document.getElementById('blogIndicators');
        this.prevBtn = document.getElementById('blogPrev');
        this.nextBtn = document.getElementById('blogNext');
        this.slides = document.querySelectorAll('.blog-slide');
        this.currentSlide = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    
    init() {
        if (!this.carousel || !this.slides.length) return;
        
        this.createIndicators();
        this.bindEvents();
        this.startAutoPlay();
        this.updateCarousel();
    }
    
    createIndicators() {
    if (!this.indicators || window.innerWidth <= 768) return;
    
    this.indicators.innerHTML = '';
    this.slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `blog-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => this.goToSlide(index));
        this.indicators.appendChild(indicator);
    });
}

    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Handle touch/swipe events for mobile
        this.handleTouchEvents();
        
        // Pause on tab visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }
    
    handleTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoPlay();
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.resumeAutoPlay();
        });
    }
    
    updateCarousel() {
        if (!this.carousel) return;
        
        const translateX = -this.currentSlide * 100;
        this.carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        const indicators = this.indicators?.querySelectorAll('.blog-indicator');
        indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    destroy() {
        this.pauseAutoPlay();
        this.isAutoPlaying = false;
    }
}

// Initialize blog carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        new BlogCarousel(); // Desktop: arrows + dots
    }
});


// Performance optimization: Lazy load images in carousel
const observeImages = () => {
    const images = document.querySelectorAll('.blog-image img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Call image observer
observeImages();

// Stats Count-Up Animation (no HTML changes required)
const animateCounter = (el) => {
    // Extract the number and suffix (e.g. "5000+" → number: 5000, suffix: +)
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\D*)$/); 
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";
    const duration = 2000; // 2 seconds
    const frameRate = 60; // fps
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const counterAnim = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out
        const current = Math.floor(easedProgress * target);

        el.textContent = current + suffix;
        if (frame === totalFrames) {
            clearInterval(counterAnim);
            el.textContent = target + suffix;
        }
    }, 1000 / frameRate);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(".stat-number").forEach(animateCounter);
            observer.unobserve(entry.target); // only run once
        }
    });
}, { threshold: 0.5 });

// Attach to your stats section
document.querySelectorAll(".stats").forEach(section => {
    statsObserver.observe(section);
});

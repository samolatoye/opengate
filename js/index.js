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

// Carousel Functionality
class ResponsiveCarousel {
  constructor() {
    this.track = document.getElementById('carouselTrack');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.cards = Array.from(this.track.children);
    this.currentIndex = this.cards.length;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isMobile = window.innerWidth <= 768;

    this.setupInfiniteLoop();
    this.setupEventListeners();
    this.setupAutoplay();
    this.updateCarouselPosition();
  }

  setupInfiniteLoop() {
    const cardsClone = this.cards.map(card => card.cloneNode(true));
    const cardsClone2 = this.cards.map(card => card.cloneNode(true));

    this.track.append(...cardsClone, ...cardsClone2);
    this.cards = Array.from(this.track.children);

    this.currentIndex = this.cards.length / 3;
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    if (!this.isMobile) {
      this.track.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.track.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      if (wasMobile !== this.isMobile) {
        this.updateCarouselPosition();
      }
    });
  }

  handleSwipe() {
    if (!this.isMobile) return;

    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      diff > 0 ? this.nextSlide() : this.prevSlide();
    }
  }

  updateCarouselPosition() {
    const cardWidth = this.isMobile ? 100 : 33.333;
    const translateX = -this.currentIndex * cardWidth;
    this.track.style.transform = `translateX(${translateX}%)`;
  }

  nextSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex++;
    this.updateCarouselPosition();

    setTimeout(() => {
      if (this.currentIndex >= this.cards.length - this.cards.length / 3) {
        this.track.style.transition = 'none';
        this.currentIndex = this.cards.length / 3;
        this.updateCarouselPosition();

        setTimeout(() => {
          this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          this.isTransitioning = false;
        }, 50);
      } else {
        this.isTransitioning = false;
      }
    }, 600);
  }

  prevSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex--;
    this.updateCarouselPosition();

    setTimeout(() => {
      if (this.currentIndex < this.cards.length / 3) {
        this.track.style.transition = 'none';
        this.currentIndex = this.cards.length - this.cards.length / 3 - 1;
        this.updateCarouselPosition();

        setTimeout(() => {
          this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          this.isTransitioning = false;
        }, 50);
      } else {
        this.isTransitioning = false;
      }
    }, 600);
  }

  setupAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  pauseAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  resumeAutoplay() {
    this.setupAutoplay();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveCarousel();
});


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

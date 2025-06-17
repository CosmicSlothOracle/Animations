// ===== GIF GALLERY FUNCTIONALITY =====

class GifGallery {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.currentMobileIndex = 0;
        this.mobileGifs = [];
        this.gifList = [];
        this.gridCols = 3; // Desktop: 3 Spalten
        this.gridRows = 3; // Desktop: 3 Reihen
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    async init() {
        await this.loadGifList();
        this.renderGallery();
        this.setupModal();
        this.setupEventListeners();
        this.handleResize();
    }

    async loadGifList() {
        try {
            const res = await fetch('gifs.json');
            this.gifList = await res.json();
        } catch (e) {
            this.gifList = [];
        }
    }

    renderGallery() {
        if (this.isMobile) {
            this.renderMobileGallery();
        } else {
            this.renderDesktopGrid();
        }
    }

    // ===== DESKTOP GRID FUNCTIONALITY =====
    renderDesktopGrid() {
        const grid = document.getElementById('gif-grid');
        grid.innerHTML = '';
        if (!this.gifList.length) {
            grid.innerHTML = '<div style="padding:2rem;text-align:center;color:#c00;">Keine GIFs gefunden.</div>';
            return;
        }
        const cells = this.gridCols * this.gridRows;
        // GIFs gleichmäßig auf Zellen verteilen
        const gifsPerCell = Math.ceil(this.gifList.length / cells);
        let gifIndex = 0;
        for (let i = 0; i < cells; i++) {
            const cell = document.createElement('div');
            cell.className = 'gif-cell';
            cell.dataset.cell = i;
            const container = document.createElement('div');
            container.className = 'gif-container';
            // GIFs für diese Zelle
            const gifs = [];
            for (let j = 0; j < gifsPerCell && gifIndex < this.gifList.length; j++, gifIndex++) {
                const gif = this.gifList[gifIndex];
                const img = document.createElement('img');
                img.className = 'gif-image' + (j === 0 ? ' active' : '');
                img.src = `assets/gifs/${gif}`;
                img.alt = gif;
                img.loading = 'lazy';
                container.appendChild(img);
                gifs.push(img);
            }
            cell.appendChild(container);
            // Controls nur wenn mehrere GIFs
            if (gifs.length > 1) {
                const controls = document.createElement('div');
                controls.className = 'gif-controls';
                const prevBtn = document.createElement('button');
                prevBtn.className = 'control-btn control-btn--prev';
                prevBtn.textContent = '‹';
                const nextBtn = document.createElement('button');
                nextBtn.className = 'control-btn control-btn--next';
                nextBtn.textContent = '›';
                const indicators = document.createElement('div');
                indicators.className = 'control-indicators';
                gifs.forEach((_, idx) => {
                    const indicator = document.createElement('span');
                    indicator.className = 'indicator' + (idx === 0 ? ' active' : '');
                    indicator.dataset.index = idx;
                    indicators.appendChild(indicator);
                });
                controls.appendChild(prevBtn);
                controls.appendChild(indicators);
                controls.appendChild(nextBtn);
                cell.appendChild(controls);
                // Navigation-Logik
                let currentIndex = 0;
                prevBtn.addEventListener('click', () => {
                    currentIndex = currentIndex > 0 ? currentIndex - 1 : gifs.length - 1;
                    this.updateDesktopImage(gifs, indicators.children, currentIndex);
                });
                nextBtn.addEventListener('click', () => {
                    currentIndex = currentIndex < gifs.length - 1 ? currentIndex + 1 : 0;
                    this.updateDesktopImage(gifs, indicators.children, currentIndex);
                });
                Array.from(indicators.children).forEach((indicator, idx) => {
                    indicator.addEventListener('click', () => {
                        currentIndex = idx;
                        this.updateDesktopImage(gifs, indicators.children, currentIndex);
                    });
                });
                setInterval(() => {
                    if (!cell.matches(':hover')) {
                        currentIndex = currentIndex < gifs.length - 1 ? currentIndex + 1 : 0;
                        this.updateDesktopImage(gifs, indicators.children, currentIndex);
                    }
                }, 5000);
            }
            grid.appendChild(cell);
        }
    }

    updateDesktopImage(images, indicators, activeIndex) {
        Array.from(images).forEach((img, idx) => {
            img.classList.toggle('active', idx === activeIndex);
        });
        Array.from(indicators).forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === activeIndex);
        });
    }

    // ===== MOBILE GALLERY FUNCTIONALITY =====
    renderMobileGallery() {
        const mobileGallery = document.getElementById('mobile-gallery');
        mobileGallery.innerHTML = '';
        if (!this.gifList.length) {
            mobileGallery.innerHTML = '<div style="padding:2rem;text-align:center;color:#c00;">Keine GIFs gefunden.</div>';
            return;
        }
        const container = document.createElement('div');
        container.className = 'mobile-container';
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-gif-wrapper';
        this.mobileGifs = [];
        this.gifList.forEach((gif, idx) => {
            const img = document.createElement('img');
            img.className = 'mobile-gif' + (idx === 0 ? ' active' : '');
            img.src = `assets/gifs/${gif}`;
            img.alt = gif;
            img.loading = 'lazy';
            img.addEventListener('click', () => this.openModal(img.src));
            wrapper.appendChild(img);
            this.mobileGifs.push(img);
        });
        container.appendChild(wrapper);
        // Controls
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'mobile-btn mobile-btn--prev';
        prevBtn.textContent = '‹';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'mobile-btn mobile-btn--next';
        nextBtn.textContent = '›';
        const indicators = document.createElement('div');
        indicators.className = 'mobile-indicators';
        this.mobileGifs.forEach((_, idx) => {
            const indicator = document.createElement('span');
            indicator.className = 'mobile-indicator' + (idx === 0 ? ' active' : '');
            indicator.dataset.index = idx;
            indicator.addEventListener('click', () => {
                this.currentMobileIndex = idx;
                this.updateMobileDisplay();
            });
            indicators.appendChild(indicator);
        });
        controls.appendChild(prevBtn);
        controls.appendChild(indicators);
        controls.appendChild(nextBtn);
        container.appendChild(controls);
        mobileGallery.appendChild(container);
        // Touch/Swipe
        this.setupTouchEvents(wrapper);
        // Button navigation
        prevBtn.addEventListener('click', () => this.navigateMobile('prev'));
        nextBtn.addEventListener('click', () => this.navigateMobile('next'));
        this.currentMobileIndex = 0;
        this.updateMobileDisplay();
    }

    navigateMobile(direction) {
        if (direction === 'next') {
            this.currentMobileIndex = this.currentMobileIndex < this.mobileGifs.length - 1
                ? this.currentMobileIndex + 1
                : 0;
        } else {
            this.currentMobileIndex = this.currentMobileIndex > 0
                ? this.currentMobileIndex - 1
                : this.mobileGifs.length - 1;
        }
        this.updateMobileDisplay();
    }

    updateMobileDisplay() {
        this.mobileGifs.forEach((gif, idx) => {
            gif.classList.toggle('active', idx === this.currentMobileIndex);
        });
        const indicators = document.querySelectorAll('.mobile-indicator');
        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === this.currentMobileIndex);
        });
    }

    // ===== TOUCH EVENTS =====
    setupTouchEvents(element) {
        element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        element.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigateMobile('next');
            } else {
                this.navigateMobile('prev');
            }
        }
    }

    // ===== MODAL FUNCTIONALITY =====
    setupModal() {
        const modal = document.getElementById('fullscreen-modal');
        const closeBtn = document.querySelector('.modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'ArrowLeft') {
                    this.navigateMobile('prev');
                    this.updateModalImage();
                } else if (e.key === 'ArrowRight') {
                    this.navigateMobile('next');
                    this.updateModalImage();
                }
            }
        });
    }
    openModal(imageSrc) {
        const modal = document.getElementById('fullscreen-modal');
        const modalImage = document.querySelector('.modal__image');
        if (modal && modalImage) {
            modalImage.src = imageSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    closeModal() {
        const modal = document.getElementById('fullscreen-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    updateModalImage() {
        const modalImage = document.querySelector('.modal__image');
        const activeMobileGif = this.mobileGifs[this.currentMobileIndex];
        if (modalImage && activeMobileGif) {
            modalImage.src = activeMobileGif.src;
        }
    }

    // ===== RESPONSIVE HANDLING =====
    setupEventListeners() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            if (wasMobile !== this.isMobile) {
                this.renderGallery();
            }
        });
    }
    handleResize() {
        // Initial Layout
        this.isMobile = window.innerWidth <= 768;
        this.renderGallery();
    }
}

// ===== INITIALIZE GALLERY =====
document.addEventListener('DOMContentLoaded', () => {
    new GifGallery();
});

// ===== CONFIGURATION OBJECT =====
// This can be used to easily modify GIF sources
const GIF_CONFIG = {
    desktop: [
        {
            cell: 0,
            gifs: [
                { src: 'assets/gifs/gif1.gif', alt: 'GIF 1' },
                { src: 'assets/gifs/gif2.gif', alt: 'GIF 2' }
            ]
        },
        {
            cell: 1,
            gifs: [
                { src: 'assets/gifs/gif3.gif', alt: 'GIF 3' },
                { src: 'assets/gifs/gif4.gif', alt: 'GIF 4' },
                { src: 'assets/gifs/gif5.gif', alt: 'GIF 5' }
            ]
        }
        // Add more cells as needed
    ],
    mobile: [
        { src: 'assets/gifs/mobile1.gif', alt: 'Mobile GIF 1' },
        { src: 'assets/gifs/mobile2.gif', alt: 'Mobile GIF 2' },
        { src: 'assets/gifs/mobile3.gif', alt: 'Mobile GIF 3' },
        { src: 'assets/gifs/mobile4.gif', alt: 'Mobile GIF 4' },
        { src: 'assets/gifs/mobile5.gif', alt: 'Mobile GIF 5' }
    ]
};

// Function to update GIFs from config (for future use)
function updateGifsFromConfig() {
    // This function can be implemented to dynamically load GIFs from the config
    // Useful for when you want to load GIFs from a JSON file or API
    console.log('GIF config:', GIF_CONFIG);
}
// ===== PINTEREST-STYLE GIF GALLERY =====

class PinterestGifGallery {
    constructor() {
        this.gifs = [];
        this.currentModalIndex = 0;
        this.init();
    }

    async init() {
        await this.loadGifs();
        this.renderGallery();
        this.setupModal();
        this.setupEventListeners();
    }

    async loadGifs() {
        try {
            const response = await fetch('gifs.json');
            this.gifs = await response.json();

            // Add random sizes if not specified
            this.gifs = this.gifs.map(gif => ({
                ...gif,
                size: gif.size || this.getRandomSize()
            }));
        } catch (error) {
            console.error('Error loading GIFs:', error);
            this.gifs = [];
        }
    }

    getRandomSize() {
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const weights = [0.3, 0.4, 0.2, 0.1]; // Higher probability for medium sizes

        const random = Math.random();
        let sum = 0;

        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                return sizes[i];
            }
        }

        return 'medium';
    }

    renderGallery() {
        const grid = document.getElementById('gif-grid');

        if (!this.gifs.length) {
            grid.innerHTML = '<div class="loading">No GIFs found...</div>';
            return;
        }

        grid.innerHTML = '';

        this.gifs.forEach((gif, index) => {
            const card = this.createGifCard(gif, index);
            grid.appendChild(card);
        });
    }

    createGifCard(gif, index) {
        const card = document.createElement('div');
        card.className = `gif-card size-${gif.size}`;
        card.style.animationDelay = `${index * 0.1}s`;

        const img = document.createElement('img');
        img.className = 'gif-image';
        img.src = gif.url;
        img.alt = gif.title || 'GIF Animation';
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gif-overlay';

        const title = document.createElement('h3');
        title.className = 'gif-title';
        title.textContent = gif.title || 'Animated GIF';

        const actions = document.createElement('div');
        actions.className = 'gif-actions';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'action-btn';
        viewBtn.textContent = '👁️ View';
        viewBtn.onclick = (e) => {
            e.stopPropagation();
            this.openModal(index);
        };

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'action-btn';
        downloadBtn.textContent = '💾 Download';
        downloadBtn.onclick = (e) => {
            e.stopPropagation();
            this.downloadGif(gif.url, gif.title || 'gif');
        };

        const shareBtn = document.createElement('button');
        shareBtn.className = 'action-btn';
        shareBtn.textContent = '🔗 Share';
        shareBtn.onclick = (e) => {
            e.stopPropagation();
            this.shareGif(gif.url);
        };

        actions.appendChild(viewBtn);
        actions.appendChild(downloadBtn);
        actions.appendChild(shareBtn);

        overlay.appendChild(title);
        overlay.appendChild(actions);

        card.appendChild(img);
        card.appendChild(overlay);

        // Add click handler for opening modal
        card.addEventListener('click', () => {
            this.openModal(index);
        });

        // Add loading error handler
        img.addEventListener('error', () => {
            card.innerHTML = `
                <div class="loading" style="color: #ff6b6b;">
                    ❌ Failed to load GIF
                </div>
            `;
        });

        // Add loading effect
        img.addEventListener('load', () => {
            card.classList.add('loaded');
        });

        return card;
    }

    async downloadGif(url, filename) {
        try {
            // Show loading indicator
            const originalText = event.target.textContent;
            event.target.textContent = '⏳ Downloading...';

            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.gif`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(link.href);

            // Restore button text
            event.target.textContent = originalText;

            // Show success feedback
            this.showNotification('✅ Download started!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            event.target.textContent = '❌ Failed';
            setTimeout(() => {
                event.target.textContent = '💾 Download';
            }, 2000);

            this.showNotification('❌ Download failed', 'error');
        }
    }

    async shareGif(url) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this GIF!',
                    url: url
                });
                this.showNotification('✅ Shared successfully!', 'success');
            } catch (error) {
                this.copyToClipboard(url);
            }
        } else {
            this.copyToClipboard(url);
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('📋 Link copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('📋 Link copied to clipboard!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(45deg, #4ade80, #22c55e)' :
                          type === 'error' ? 'linear-gradient(45deg, #ef4444, #dc2626)' :
                          'linear-gradient(45deg, #3b82f6, #2563eb)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            z-index: 1001;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    setupModal() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

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
                    this.navigateModal(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateModal(1);
                }
            }
        });
    }

    openModal(index) {
        this.currentModalIndex = index;
        const modal = document.getElementById('fullscreen-modal');
        const modalImage = document.querySelector('.modal__image');

        if (modal && modalImage) {
            modalImage.src = this.gifs[index].url;
            modalImage.alt = this.gifs[index].title || 'GIF Animation';
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

    navigateModal(direction) {
        const newIndex = this.currentModalIndex + direction;

        if (newIndex >= 0 && newIndex < this.gifs.length) {
            this.currentModalIndex = newIndex;
            const modalImage = document.querySelector('.modal__image');
            if (modalImage) {
                modalImage.style.opacity = '0';
                setTimeout(() => {
                    modalImage.src = this.gifs[this.currentModalIndex].url;
                    modalImage.alt = this.gifs[this.currentModalIndex].title || 'GIF Animation';
                    modalImage.style.opacity = '1';
                }, 150);
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            // Recalculate masonry layout on resize
            this.debounce(() => {
                this.renderGallery();
            }, 250)();
        });

        // Add smooth scrolling for better UX
        document.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public method to add new GIFs dynamically
    addGif(url, title, size = 'medium') {
        this.gifs.push({ url, title, size });
        this.renderGallery();
    }

    // Public method to remove GIF
    removeGif(index) {
        if (index >= 0 && index < this.gifs.length) {
            this.gifs.splice(index, 1);
            this.renderGallery();
        }
    }
}

// ===== INITIALIZE GALLERY =====
document.addEventListener('DOMContentLoaded', () => {
    window.gifGallery = new PinterestGifGallery();
});

// ===== UTILITY FUNCTIONS =====
function addNewGif(url, title, size) {
    if (window.gifGallery) {
        window.gifGallery.addGif(url, title, size);
    }
}

function removeGif(index) {
    if (window.gifGallery) {
        window.gifGallery.removeGif(index);
    }
}
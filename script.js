document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_USER = 'web-mix';
    const GITHUB_REPO = 'mattari-room';
    const IMAGES_PATH = 'assets/images';

    // Modal elements
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryGrid = document.getElementById('gallery-grid');

    // Fetch images from GitHub API
    async function loadGallery() {
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${IMAGES_PATH}`);
            if (!response.ok) throw new Error('Failed to fetch image list');

            const files = await response.json();

            // Filter image files (png, jpg, jpeg, webp)
            const imageFiles = files.filter(file =>
                file.type === 'file' &&
                /\.(png|jpe?g|webp)$/i.test(file.name)
            );

            if (imageFiles.length === 0) {
                galleryGrid.innerHTML = '<p>No images found in the gallery.</p>';
                return;
            }

            // Clear spinner
            galleryGrid.innerHTML = '';

            imageFiles.forEach(file => {
                const title = formatTitle(file.name);
                const item = createGalleryItem(file.path, title);
                galleryGrid.appendChild(item);
            });

            // Initialize intersection observer for newly added items
            initAnimationObserver();

        } catch (error) {
            console.error('Error loading gallery:', error);
            galleryGrid.innerHTML = '<p> Error loading images. Please try again later.</p>';
        }
    }

    function formatTitle(filename) {
        // Remove extension and replace underscores/hyphens with spaces
        let name = filename.substring(0, filename.lastIndexOf('.')) || filename;
        return name.replace(/[_-]/g, ' ');
    }

    function createGalleryItem(imagePath, title) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-image', imagePath);
        div.setAttribute('data-title', title);

        div.innerHTML = `
            <img src="${imagePath}" alt="${title}" loading="lazy">
            <div class="overlay">
                <span>View More</span>
            </div>
        `;

        div.addEventListener('click', () => {
            openModal(imagePath, title);
        });

        return div;
    }

    // Modal functionality
    function openModal(imgSrc, title) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        modalImg.src = imgSrc;
        modalTitle.textContent = title;
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in
    function initAnimationObserver() {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.gallery-item, .section-title, .section-desc, .about-content');
        animatedElements.forEach(el => {
            // Apply initial state if not already done
            if (el.style.opacity !== '1') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            }
            observer.observe(el);
        });
    }

    // Start loading
    loadGallery();
});

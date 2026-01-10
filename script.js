document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_USER = 'web-mix';
    const GITHUB_REPO = 'mattari-room';
    const IMAGES_PATH = 'assets/images';

    // Modal elements
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryGrid = document.getElementById('gallery-grid');

    // Fetch files from GitHub API
    async function loadGallery() {
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${IMAGES_PATH}`);
            if (!response.ok) throw new Error('Failed to fetch file list');

            const files = await response.json();

            // Filter and group files
            const mediaMap = groupMediaFiles(files);

            if (Object.keys(mediaMap).length === 0) {
                galleryGrid.innerHTML = '<p>No media found in the gallery.</p>';
                return;
            }

            // Clear spinner
            galleryGrid.innerHTML = '';

            Object.values(mediaMap).forEach(media => {
                const item = createGalleryItem(media);
                galleryGrid.appendChild(item);
            });

            // Initialize intersection observer for newly added items
            initAnimationObserver();

        } catch (error) {
            console.error('Error loading gallery:', error);
            galleryGrid.innerHTML = '<p> Error loading gallery. Please try again later.</p>';
        }
    }

    function groupMediaFiles(files) {
        const map = {};

        files.forEach(file => {
            if (file.type !== 'file') return;

            const ext = file.name.split('.').pop().toLowerCase();
            const baseName = file.name.substring(0, file.name.lastIndexOf('.'));

            if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
                if (!map[baseName]) map[baseName] = { name: baseName };
                map[baseName].image = file.path;
            } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
                if (!map[baseName]) map[baseName] = { name: baseName };
                map[baseName].video = file.path;
            }
        });

        return map;
    }

    function formatTitle(name) {
        return name.replace(/[_-]/g, ' ');
    }

    function createGalleryItem(media) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        const title = formatTitle(media.name);

        div.setAttribute('data-title', title);

        if (media.video) {
            div.setAttribute('data-video', media.video);
            // Use image as thumbnail if available, otherwise use video
            if (media.image) {
                div.innerHTML = `
                    <img src="${media.image}" alt="${title}" loading="lazy">
                    <div class="video-indicator">▶</div>
                    <div class="overlay"><span>Play Video</span></div>
                `;
            } else {
                div.innerHTML = `
                    <video src="${media.video}" muted loop playsinline></video>
                    <div class="video-indicator">▶</div>
                    <div class="overlay"><span>Play Video</span></div>
                `;
                // Play on hover
                div.addEventListener('mouseenter', () => div.querySelector('video').play());
                div.addEventListener('mouseleave', () => {
                    const v = div.querySelector('video');
                    v.pause();
                    v.currentTime = 0;
                });
            }
        } else {
            div.setAttribute('data-image', media.image);
            div.innerHTML = `
                <img src="${media.image}" alt="${title}" loading="lazy">
                <div class="overlay"><span>View More</span></div>
            `;
        }

        div.addEventListener('click', () => {
            openModal(media);
        });

        return div;
    }

    // Modal functionality
    function openModal(media) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        const title = formatTitle(media.name);
        modalTitle.textContent = title;

        if (media.video) {
            modalImg.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = media.video;
            modalVideo.play();
        } else {
            modalVideo.style.display = 'none';
            modalImg.style.display = 'block';
            modalImg.src = media.image;
        }

        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        modal.classList.remove('show');
        modalVideo.pause();
        modalVideo.src = ''; // Clear source to stop buffering
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

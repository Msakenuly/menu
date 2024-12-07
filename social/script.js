document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('load_images.php');
        const imageList = await response.json();

        imageList.forEach((image, index) => {
            images.push({ url: image.filepath });
        });

        displayImages();
    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
    }
});

const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const caption = document.getElementById('caption');
const closeModal = document.querySelector('.close');
const dropZone = document.getElementById('dropZone');

let images = [];
let currentImageIndex = 0;

uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const imageFiles = document.getElementById('imageFile').files;
    handleFiles(imageFiles);
    uploadForm.reset();
});

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    const imageFiles = event.dataTransfer.files;
    handleFiles(imageFiles);
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            images.push({ url: imageUrl });
        }
    }
    displayImages();
}

function displayImages() {
    gallery.innerHTML = '';
    images.forEach((image, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${image.url}" alt="Image ${index + 1}" />
            <button class="delete-button" data-index="${index}">❌</button>
        `;
        gallery.appendChild(div);

        div.querySelector('img').addEventListener('click', () => {
            openModal(index);
        });

        div.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            images.splice(index, 1);
            displayImages();
        });
    });
}

function openModal(index) {
    currentImageIndex = index;
    modal.style.display = 'block';
    modalImage.src = images[currentImageIndex].url;
    caption.textContent = `Image ${currentImageIndex + 1}`;
    window.addEventListener('keydown', handleKeyboardNavigation);
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    window.removeEventListener('keydown', handleKeyboardNavigation);
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        window.removeEventListener('keydown', handleKeyboardNavigation);
    }
});

function handleKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft') {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            modalImage.src = images[currentImageIndex].url;
            caption.textContent = `Image ${currentImageIndex + 1}`;
        }
    } else if (event.key === 'ArrowRight') {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            modalImage.src = images[currentImageIndex].url;
            caption.textContent = `Image ${currentImageIndex + 1}`;
        }
    } else if (event.key === 'Escape') {
        modal.style.display = 'none';
        window.removeEventListener('keydown', handleKeyboardNavigation);
    }
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        modalImage.src = images[currentImageIndex].url;
        caption.textContent = `Image ${currentImageIndex + 1}`;
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        modalImage.src = images[currentImageIndex].url;
        caption.textContent = `Image ${currentImageIndex + 1}`;
    }
});

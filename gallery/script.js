let images = [];
let currentIndex = 0;

async function loadGallery() {
  const res = await fetch("images.php");
  images = await res.json();

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => openLightbox(index);
    gallery.appendChild(img);
  });
}

function openLightbox(index) {
  currentIndex = index;
  document.getElementById("lightbox").style.display = "flex";
  showImage();
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function showImage() {
  const img = document.getElementById("lightbox-img");
  img.src = images[currentIndex];
}

function changeImage(n) {
  currentIndex = (currentIndex + n + images.length) % images.length;
  showImage();
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") changeImage(-1);
  if (e.key === "ArrowRight") changeImage(1);
  if (e.key === "Escape") closeLightbox();
});

// Touch (swipe) support
let touchStartX = 0;
document.getElementById("lightbox").addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
document.getElementById("lightbox").addEventListener("touchend", (e) => {
  let touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) changeImage(1);
  if (touchEndX - touchStartX > 50) changeImage(-1);
});

// Lightbox controls
document.querySelector(".close").onclick = closeLightbox;
document.querySelector(".prev").onclick = () => changeImage(-1);
document.querySelector(".next").onclick = () => changeImage(1);

loadGallery();

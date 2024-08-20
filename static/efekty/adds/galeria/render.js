// Definiujemy tablicę obrazów
var PATH = "http://127.0.0.1/efekty/adds/galeria/";
var ASSETS = "http://127.0.0.1/efekty/adds/galeria/assets/";

var images = [

];

async function loadCSS(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

async function loadJS(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
async function loadAssets() {
    await Promise.all([
      loadCSS(PATH+'css/galeria-main.css'),
      loadJS(PATH+'js/galeria-main.js')
    ]);
  }

async function pobierzZawartoscKatalogu() {
  try {
    const response = await fetch(ASSETS);
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas pobierania zawartości katalogu.');
    }
    const htmlText = await response.text(); // Pobierz zawartość odpowiedzi jako tekst HTML
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlText, 'text/html'); // Parsuj tekst HTML na obiekt dokumentu HTML
    const links = htmlDocument.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]'); // Wybierz wszystkie linki do plików obrazów
    const imagesData = Array.from(links).map(link => ({
      nazwaPliku: link.textContent.trim(),
      // Można dodać więcej informacji, jeśli są dostępne, np. URL pliku
    }));
    return imagesData;
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    return [];
  }
}

async function dodajObrazyZKataloguDoTablicy() {
  try {
    const zawartoscKatalogu = await pobierzZawartoscKatalogu();
    zawartoscKatalogu.forEach(item => {
      images.push(ASSETS + item.nazwaPliku);
    });
    console.log(images); // Sprawdzenie zawartości tablicy images po dodaniu obrazów
    loadImages(); // Wywołanie funkcji do ładowania obrazów
  } catch (error) {
    console.error('Wystąpił błąd podczas dodawania obrazów z katalogu:', error);
  }
}

async function loadImages() {
  const swiperWrapper = document.querySelector('.swiper-wrapper');

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = images[i];
    await img.decode(); // Oczekiwanie na załadowanie obrazu
    const swiperSlide = document.createElement('div');
    swiperSlide.className = 'swiper-slide';
    swiperSlide.style.width = '392px';
    swiperSlide.innerHTML = `
      <div class="swiper-material-wrapper" style="width: 0%; transform: translate3d(-${i * 408}px, 0px, 0px); transition-duration: 0ms;">
        <div class="swiper-material-content">
          <img class="demo-material-image" data-swiper-material-scale="1.25" src="${images[i]}" style="transform: scale(1.25); transition-duration: 0ms;">
          <span class="demo-material-label swiper-material-animate-opacity" style="opacity: 1; transition-duration: 0ms;">Slide ${i + 1}</span>
        </div>
      </div>
    `;
    swiperWrapper.appendChild(swiperSlide);
  }
}

dodajObrazyZKataloguDoTablicy();
loadAssets();

// Wywołujemy funkcję do ładowania obrazów po załadowaniu DOM
document.addEventListener('DOMContentLoaded', loadImages);
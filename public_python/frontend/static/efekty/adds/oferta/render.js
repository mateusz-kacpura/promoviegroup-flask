// Globalna zmienna na dane
document.addEventListener('DOMContentLoaded', function() {
  // Nazwa pliku JSON, który chcesz załadować
  const fileName = 'oferta.json'; // Możesz tutaj ustawić dynamiczną nazwę pliku, jeśli to potrzebne

  // Pobierz dane z serwera
  fetch(`/get-json?file=${fileName}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(jsonData => {
          // Przypisz dane do zmiennej lokalnej
          date = jsonData;
          console.log('Dane wczytane:', date);

          // Wywołaj funkcje renderujące HTML po załadowaniu danych
          renderContent(date);
      })
      .catch(error => {
          console.error('Błąd:', error);
      });
});

function renderContent() {
  // Call render functions
  renderHeroSection(date);
  renderServicesSection(date);
  renderContactSection(date);
  renderFeature1Section(date);
  renderFeature2Section(date);
  //renderBlogSection(date);
  renderContactBannerSection(date);
  renderAboutUsSection(date)
}

// Function to render Hero Section
function renderHeroSection(date) {
  var heroHTML = `
    <div class="hero-slant overlay" date-stellar-background-ratio="0.5" style="background-image: url('${date.hero.backgroundImage}');">
      <div class="container">
        <div class="row align-items-center justify-content-center min-vh-50">
          <div class="col-lg-7 text-center">
            <div class="hero-content p-4" style="background: rgba(0, 0, 0, 0.6); border-radius: 8px; max-width: 80%; margin: auto;">
              <h1 class="text-white font-weight-bold mb-4" date-aos="fade-up" date-aos-delay="0">${date.hero.title}</h1>
              <p class="text-white mb-4" date-aos="fade-up" date-aos-delay="100">${date.hero.subtitle}</p>
              <p date-aos="fade-up" date-aos-delay="200">
                <a href="${date.hero.buttonLink}" class="btn btn-primary btn-lg">${date.hero.buttonText}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="slant" style="background-image: url('images/slant.svg');"></div>
    </div>
  `;
  document.getElementById('heroSection').innerHTML = heroHTML;

  // Initialize MDB Bootstrap parallax effect
  if (window.MDB) {
    MDB.scrollspy.init();
  }
}

// Funkcja do dodawania stylów CSS do dokumentu
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .custom-list {
      list-style-type: none; /* Usuwa domyślne punkty listy */
      padding-left: 0; /* Usuwa domyślne wcięcie */
      margin-left: 0; /* Usuwa domyślne wcięcie */
    }
    
    .custom-list li {
      position: relative;
      padding-left: 1.5rem; /* Zmniejsza przestrzeń na dużą kropkę, bliżej tekstu */
      margin-bottom: 0.5rem; /* Odstęp między elementami listy */
      line-height: 1.5; /* Ustawia wysokość linii dla lepszej czytelności */
    }

    .custom-list li::before {
      content: '\\2022'; /* Unicode dla dużej kropki */
      font-size: 1.5rem; /* Zmniejsza rozmiar kropki */
      color: #dc3545; /* Kolor kropki (czerwony) */
      position: absolute;
      left: 0;
      top: 50%; /* Wyśrodkowuje kropkę w pionie */
      transform: translateY(-50%); /* Korekcja wyśrodkowania kropki */
    }

    .icon span {
      font-size: 2rem; /* Zwiększa rozmiar ikonki */
      color: #dc3545; /* Ustawia kolor czerwony */
    }

    .hero-slant {
      position: relative;
      overflow: hidden;
    }
    
    .hero-slant::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Dark overlay */
      z-index: 1;
    }
    
    .hero-slant .container {
      position: relative;
      z-index: 2;
    }
    
    .parallax {
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      min-height: 100vh; /* Ustawia minimalną wysokość kontenera na 100% wysokości widoku */
    }
  `;
  document.head.appendChild(style);
}

// Function to render Services Section
function renderServicesSection(data) {
  addStyles(); // Dodajemy style na początku

  let servicesHTML = `
    <section class="site-section">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center" data-aos="fade-up">
            <h2 class="display-4 font-weight-bold mb-4">Produkty oferowane przez freelancerów Pro Movie Group</h2>
          </div>
        </div>
        <div id="servicesList" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">`;

  data.services.forEach((service, index) => {
    servicesHTML += `
      <div class="col">
        <div class="card shadow-sm" data-aos="fade-up" data-aos-delay="0">
          <div class="card-body d-flex align-items-start">
            <div class="icon me-3 text-danger fs-4">
              <span class="${service.icon}"></span>
            </div>
            <div>
              <h3 class="card-title">${service.title}</h3>
              <p class="card-text">${service.description}</p>
              <ul class="custom-list">`;

    service.services.forEach(subService => {
      servicesHTML += `<li>${subService}</li>`;
    });

    servicesHTML += `
              </ul>
              <p><button class="btn btn-primary" onclick='showDetails(${index}, ${JSON.stringify(data)})'>${service.buttonText}</button></p>
            </div>
          </div>
        </div>
      </div>`;
  });

  servicesHTML += `
        </div>
        <div id="serviceDetails" class="service-details" style="display: none;">
          <!-- Dynamic content for details will be injected here -->
        </div>
      </div>
    </section>`;

  document.getElementById('servicesSection').innerHTML = servicesHTML;
}

function showDetails(index, data) {
  const service = data.services[index];
  let detailsHTML = `
    <div class="row">
      <div class="col-12">
        <button class="btn btn-secondary mb-3 float-end" onclick="hideDetails()">&#10005; Wróć do listy produktów</button>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <ul class="custom-list">`;

  service.details.products.forEach(product => {
    detailsHTML += `
      <li>
        <strong>${product.name}</strong> - ${product.price}
        <p>${product.details}</p>
      </li>`;
  });

  detailsHTML += `
        </ul>
        <p>${service.details.additionalInfo}</p>
        <div class="d-flex justify-content-between">
          <button class="btn btn-primary" onclick='showPrevious(${index}, ${JSON.stringify(data)})'>Poprzednia</button>
          <button class="btn btn-primary" onclick='showNext(${index}, ${JSON.stringify(data)})'>Następna</button>
        </div>
      </div>
    </div>`;

  document.getElementById('servicesList').style.display = 'none';
  const serviceDetails = document.getElementById('serviceDetails');
  serviceDetails.innerHTML = detailsHTML;
  serviceDetails.style.display = 'block';
}

function hideDetails() {
  document.getElementById('servicesList').style.display = 'flex';
  document.getElementById('serviceDetails').style.display = 'none';
}

function showPrevious(currentIndex, data) {
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
  showDetails(previousIndex, data);
}

function showNext(currentIndex, data) {
  const nextIndex = currentIndex < data.services.length - 1 ? currentIndex + 1 : currentIndex;
  showDetails(nextIndex, data);
}


// Function to render Contact Section
function renderContactSection(date) {
  // Check if the element with the ID 'contactSection' exists
  const contactSectionElement = document.getElementById('contactSection');
  if (!contactSectionElement) {
    console.error('Element with ID "contactSection" not found.');
    return;
  }

  // Create HTML content for the contact section
  const contactSectionHTML = `
    <div class="site-section overlay parallax" style="background-image: url('${date.contactSection.backgroundImage}');">
      <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100 text-center">
          <div class="col-lg-7">
            <h2 class="text-white mb-4">${date.contactSection.title}</h2>
            <p class="mb-0">
              <a href="${date.contactSection.buttonLink}" rel="noopener" class="btn btn-primary">${date.contactSection.buttonText}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set the inner HTML of the contact section element
  contactSectionElement.innerHTML = contactSectionHTML;

  // Add MDB Bootstrap custom styling
  const style = document.createElement('style');
  style.textContent = `
    .site-section {
      position: relative;
      overflow: hidden;
    }
    .site-section.overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Dark overlay */
      z-index: 1;
    }
    .site-section .container {
      position: relative;
      z-index: 2;
    }
    .parallax {
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
    }
  `;
  document.head.appendChild(style);

  // Initialize MDB Bootstrap parallax effect
  if (window.MDB) {
    MDB.scrollspy.init();
  }
}
;

// Function to render Feature 1 Section
function renderFeature1Section(date) {
  var feature1HTML = `
  <div class="features-lg">
    <div class="container">
      <div class="row feature align-items-center justify-content-between">
        <div class="col-lg-7 section-stack order-lg-2 mb-4 mb-lg-0 position-relative" date-aos="fade-up" date-aos-delay="0">
          <div class="image-stack">
            <div class="image-stack__item image-stack__item--top">
              <img src="${date.feature1.imageTop}" alt="Film 1">
            </div>
            <div class="image-stack__item image-stack__item--bottom">
              <img src="${date.feature1.imageBottom}" alt="Film 2">
            </div>
          </div>
        </div>
        <div class="col-lg-4 section-title" date-aos="fade-up" date-aos-delay="100">
          <h2 class="font-weight-bold mb-4 heading">${date.feature1.title}</h2>
          <p class="mb-4">${date.feature1.description}</p>
          <p><a href="${date.feature1.buttonLink}" class="btn btn-primary">${date.feature1.buttonText}</a></p>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('feature1Section').innerHTML = feature1HTML;
}

// Function to render Feature 2 Section
function renderFeature2Section(date) {
  var feature2HTML = `
  <div class="features-lg">
    <div class="container">
      <div class="row feature align-items-center justify-content-between">
        <div class="col-lg-7 mb-4 mb-lg-0 section-stack" date-aos="fade-up" date-aos-delay="0">
          <img src="${date.feature2.image}" alt="Fotografia" class="img-fluid">
        </div>
        <div class="col-lg-4 section-title" date-aos="fade-up" date-aos-delay="100">
          <h2 class="font-weight-bold mb-4">${date.feature2.title}</h2>
          <p class="mb-4">${date.feature2.description}</p>
          <p><a href="${date.feature2.buttonLink}" class="btn btn-primary">${date.feature2.buttonText}</a></p>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('feature2Section').innerHTML = feature2HTML;
}

// Function to render Blog Section
function renderBlogSection(date) {
  var blogHTML = `<div class="site-section bg-light" id="blog-section">
    <div class="container">
      <div class="row">
        <div class="col-7 mb-4 position-relative text-center mx-auto">
          <h2 class="font-weight-bold text-center">${date.blog.title}</h2>
          <p>${date.blog.subtitle}</p>
        </div>
      </div>
      <div class="row">`;
  date.blog.posts.forEach(post => {
    blogHTML += `<div class="col-md-6 mb-5 mb-lg-0 col-lg-4">
        <div class="blog_entry">
          <a href="#"><img src="${post.image}" alt="${post.title}" class="img-fluid"></a>
          <div class="p-4 bg-white">
            <h3><a href="#">${post.title}</a></h3>
            <span class="date">${post.date}</span>
            <p>${post.content}</p>
            <p class="more"><a href="#">${post.buttonText}</a></p>
          </div>
        </div>
      </div>`;
  });
  blogHTML += `</div>
      <div class="row mt-5">
        <div class="col-lg-4 mx-auto">
          <a href="${date.blog.buttonLink}" class="btn btn-primary btn-block">${date.blog.buttonText}</a>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('blogSection').innerHTML = blogHTML;
}

// Function to render Contact Banner Section
function renderContactBannerSection(date) {
  var contactBannerHTML = `
    <div class="site-section overlay site-cover-2" style="background-image: url('${date.contactBanner.backgroundImage}')">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 mx-auto text-center">
            <h2 class="text-white mb-4">${date.contactBanner.title}</h2>
            <p class="mb-0">
              <a href="${date.contactBanner.buttonLink}" rel="noopener" class="btn btn-primary btn-md">
                ${date.contactBanner.buttonText}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('contactBannerSection').innerHTML = contactBannerHTML;
}

function renderAboutUsSection(date) {
  var aboutUsSection = document.getElementById('about-us-section');
  var aboutUsHTML = `
    <div class="site-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <video class="img-fluid rounded" autoplay loop muted>
              <source src="${date.aboutUs.imageSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="col-lg-6 pl-lg-5">
            <h3 class="mb-4 font-weight-bold">${date.aboutUs.title}</h3>
            <p>${date.aboutUs.description}</p>
            <ul class="list-check list-unstyled primary">
  `;
  // Dodanie punktów listy do sekcji
  date.aboutUs.bulletPoints.forEach(function(point) {
    aboutUsHTML += `
      <li>${point}</li>
    `;
  });

  aboutUsHTML += `
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  aboutUsSection.innerHTML = aboutUsHTML;
}

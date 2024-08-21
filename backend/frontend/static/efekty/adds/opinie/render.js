document.addEventListener('DOMContentLoaded', async function() {
  const fileName = 'opinie.json';

  try {
      const response = await fetch(`/get-json?file=${fileName}`);
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      
      // Załaduj dane do zmiennej date
      const date = jsonData;

      // Sprawdź, czy dane zostały poprawnie załadowane
      testLoadedData(date);

      // Wypisz wyniki testów w konsoli
      console.log('Dane wczytane:', date);

      // Wyrenderuj stronę
      lazyLoadSections(date);
      
  } catch (error) {
      console.error('Błąd:', error);
  }
});

function testLoadedData(data) {
  // Przykładowe testy
  if (!data) {
      console.error('Dane są puste.');
      return;
  }

  // Testuj, czy wszystkie sekcje są obecne w danych
  const requiredSections = ['hero', 'about', 'clients', 'testimonials', 'aboutUs', 'contact'];
  requiredSections.forEach(section => {
      if (!data[section]) {
          console.warn(`Brak sekcji: ${section}`);
      } else {
          console.log(`Sekcja ${section} została załadowana.`);
      }
  });

  // Testuj strukturę klientów
  if (data.clients && Array.isArray(data.clients)) {
      console.log('Sekcja klientów zawiera:', data.clients.length, 'elementów.');
  } else {
      console.warn('Sekcja klientów jest pusta lub nie jest tablicą.');
  }

  // Testuj strukturę referencji
  if (data.testimonials && Array.isArray(data.testimonials)) {
      console.log('Sekcja referencji zawiera:', data.testimonials.length, 'elementów.');
  } else {
      console.warn('Sekcja referencji jest pusta lub nie jest tablicą.');
  }
}


function lazyLoadSections(data) {
  const sections = [
      { selector: '#hero-section', render: () => renderHeroSection(data) },
      { selector: '#about-section', render: () => renderAboutSection(data) },
      { selector: '#clients-section', render: () => renderClientsSection(data.clients) },
      { selector: '#testimonial-section', render: () => renderTestimonialSection(data) },
      { selector: '#about-us-section', render: () => renderAboutUsSection(data) },
      { selector: '#contact-section', render: () => renderContactSection(data) }
  ];

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const section = sections.find(s => s.selector === `#${entry.target.id}`);
              if (section) {
                  section.render();
                  observer.unobserve(entry.target); // Unobserve after rendering
              }
          }
      });
  }, { threshold: 0.1 });

  sections.forEach(section => {
      const element = document.querySelector(section.selector);
      if (element) {
          observer.observe(element);
      }
  });
}

// Funkcja do renderowania sekcji Hero
function renderHeroSection(date) {
  var heroSection = document.getElementById('hero-section');
  heroSection.innerHTML = `
    <div class="hero-slant overlay" data-stellar-background-ratio="0.5" style="background-image: url('${date.hero.backgroundImage}')">
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-lg-7 intro">
            <h1 class="text-white font-weight-bold mb-4">${date.hero.title}</h1>
            <p class="text-white mb-4">${date.hero.description}</p>
            <form id="sign-up-form" class="sign-up-form d-flex">
              <input type="email" id="email" class="form-control" placeholder="Wpisz adres email" required>
              <input type="submit" class="btn btn-primary" value="Zapisz się">
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="slant" style="background-image: url('efekty/adds/service-website-template/images/slant.svg');"></div>
  `;

  // Obsługa wysyłania formularza
  document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    fetch('/save_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(date => {
      if (date.status === 'success') {
        alert('Email zapisany pomyślnie');
      } else {
        alert('Wystąpił błąd: ' + date.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
}

  // Funkcja do renderowania sekcji o nas
  function renderAboutSection(date) {
    var aboutSection = document.getElementById('about-section');
    aboutSection.innerHTML = `
      <div class="site-section about-section">
        <div class="container">
          <div class="row align-items-center justify-content-between">
            <div class="col-lg-4">
              <h2 class="section-title mb-4">${date.about.title}</h2>
              <p>${date.about.description}</p>
              <p class="mt-4"><a href="kontakt" class="btn btn-primary btn-md">${date.about.buttonText}</a></p>
            </div>
            <div class="col-lg-7 pl-lg-5 position-relative">
              <div class="section-stack">
                <div class="image-stack">
                  <div class="image-stack__item image-stack__item--top">
                    <img src="${date.about.image1}" alt="Fotografia filmowa">
                  </div>
                  <div class="image-stack__item image-stack__item--bottom">
                    <img src="${date.about.image2}" alt="Fotografia filmowa">
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    `;
  }

function renderClientsSection(clients) {
  var clientsSection = document.getElementById('clients-section');
  if (!clients || !Array.isArray(clients)) {
    console.error('Niepoprawne dane dla sekcji klientów:', clients);
    return;
  }

  var clientsHTML = `
    <div class="site-section bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 text-center">
            <h3 class="font-weight-bold">Nasi partnerzy</h3></br>
          </div>
        </div>

        <div class="owl-logos owl-carousel">
  `;
  
  clients.forEach(function(client) {
    if (typeof client !== 'string') {
      console.error('Niepoprawny format logo klienta:', client);
      return;
    }
    clientsHTML += `
      <div class="item">
        <img src="${client}" alt="Image" class="img-fluid" loading="lazy">
      </div>
    `;
  });

  clientsHTML += `
        </div>
      </div>
    </div>
  `;
  clientsSection.innerHTML = clientsHTML;

  // Inicjalizacja Owl Carousel po dodaniu HTML
  $(document).ready(function(){
    $('.owl-carousel').owlCarousel({
      items: 5, // Liczba elementów na raz
      loop: true, // Powtarzanie
      margin: 10, // Margines między elementami
      autoplay: true, // Autoodtwarzanie
      autoplayTimeout: 2000, // Czas trwania jednej klatki (1000 ms = 1 sekunda)
      autoplayHoverPause: true, // Wstrzymywanie autoodtwarzania po najechaniu myszką
      nav: true, // Strzałki nawigacyjne
    });
  });
}


function renderTestimonialSection(data) {
  var testimonialSection = document.getElementById('testimonial-section');
  if (!data.testimonials || !Array.isArray(data.testimonials)) {
    console.error('Niepoprawne dane dla sekcji referencji:', data.testimonials);
    return;
  }

  console.log('Renderowanie sekcji referencji z danymi:', data.testimonials);

  var testimonialHTML = `
    <div class="testimonial-section">
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-lg-4 mb-5 section-title" data-aos="fade-up" data-aos-delay="0">
            <h2 class="mb-4 font-weight-bold heading">Opinie naszych klientów</h2>
            <p class="mb-4">Zobacz, co nasi klienci mówią o współpracy z nami.</p>
            <p><a href="galeria" class="btn btn-primary">Zobacz naszą galerię</a></p>
          </div>
          <div class="col-lg-7" data-aos="fade-up" data-aos-delay="100">
            <div class="testimonial--wrap">
              <div class="owl-single owl-carousel no-dots no-nav">
  `;
  
  // Dodanie opinii klientów do sekcji
  data.testimonials.forEach(function(testimonial, index) {
    if (!testimonial.photo || !testimonial.author || !testimonial.quote) {
      console.error('Niepoprawne dane referencji:', testimonial);
    }
    testimonialHTML += `
    <div class="testimonial-item mb-4">
      <div class="d-flex align-items-start">
        <div class="photo me-3">
          <img src="${testimonial.photo}" alt="Image" class="img-fluid rounded-circle" loading="lazy">
        </div>
        <div class="author">
          <cite class="d-block mb-1 fw-bold">${testimonial.author}</cite>
          <span class="text-muted">${testimonial.occupation || ''}</span>
          <div class="social-icons mt-2">
            <ul class="social list-unstyled d-flex">
              ${testimonial.social ? `
                <li class="me-2">
                  <a href="${testimonial.social.facebook}" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: transparent; text-decoration: none; color: #4267B2; font-size: 1.5rem; transition: color 0.3s ease;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li class="me-2">
                  <a href="${testimonial.social.twitter}" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: transparent; text-decoration: none; color: #1DA1F2; font-size: 1.5rem; transition: color 0.3s ease;">
                    <i class="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="${testimonial.social.instagram}" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: transparent; text-decoration: none; color: #C13584; font-size: 1.5rem; transition: color 0.3s ease;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </li>
              ` : '<li>Brak linków społecznościowych</li>'}
            </ul>
          </div>
        </div>
      </div>
      <blockquote class="blockquote mt-3">
        <p>&ldquo;${testimonial.quote}&rdquo;</p>
      </blockquote>
    </div>
    `;
  });

  testimonialHTML += `
              </div>
              <div class="custom-nav-wrap">
                <a href="#" class="custom-owl-prev"><span class="icon-keyboard_backspace"></span></a>
                <a href="#" class="custom-owl-next"><span class="icon-keyboard_backspace"></span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  testimonialSection.innerHTML = testimonialHTML;

  console.log('Sekcja referencji została wyrenderowana.');

  // Sprawdź, czy karuzela już jest zainicjalizowana
  if (!$('.owl-single').hasClass('owl-loaded')) {
    $('.owl-single').owlCarousel({
      items: 1, // Wyświetlaj jedną opinię na raz
      loop: true, // Powtarzanie
      margin: 10, // Margines między elementami
      autoplay: true, // Autoodtwarzanie
      autoplayTimeout: 5000, // Czas trwania jednej klatki (5000 ms = 5 sekund)
      autoplayHoverPause: true, // Wstrzymywanie autoodtwarzania po najechaniu myszką
      nav: true, // Strzałki nawigacyjne
      navText: ['<span class="icon-keyboard_backspace"></span>', '<span class="icon-keyboard_backspace"></span>'], // Tekst nawigacji
      dots: false, // Brak kropek nawigacyjnych
      onInitialized: function() {
        // Ustaw style dla strzałek
        $('.custom-owl-prev').on('click', function(event) {
          event.preventDefault(); // Zapobiega przewijaniu do góry strony
          $('.owl-single').trigger('prev.owl.carousel');
        });
        $('.custom-owl-next').on('click', function(event) {
          event.preventDefault(); // Zapobiega przewijaniu do góry strony
          $('.owl-single').trigger('next.owl.carousel');
        });
      }
    });
  }
}


function renderAboutUsSection(date) {
  const aboutUsSection = document.getElementById('about-us-section');
  
  // Generowanie sekcji HTML
  const aboutUsHTML = `
    <div class="site-section" style="position: relative;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6" style="position: relative;"> 
            <video class="img-fluid rounded" autoplay loop muted playsinline style="top: -20%; left: -20%; width: 140%; height: 140%; z-index: -1;">
              <source src="${date.aboutUs.videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="col-lg-6 pl-lg-5">
            <h3 class="mb-4 font-weight-bold">${date.aboutUs.title}</h3>
            <p>${date.aboutUs.description}</p>
            <ul class="list-check list-unstyled primary">
              ${date.aboutUs.bulletPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ustawienie wygenerowanego HTML do sekcji
  aboutUsSection.innerHTML = aboutUsHTML;
}

// Funkcja do dodawania stylów CSS do dokumentu
function addContactSectionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .site-section {
      position: relative;
      padding: 4rem 0; /* Ustawia odstęp na górze i dole */
    }
    
    .overlay {
      position: relative;
    }
    
    .overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Overlay z półprzezroczystością */
      z-index: 1;
    }
    
    .site-cover-2 {
      background-attachment: fixed; /* Efekt paralaksy */
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .container {
      position: relative;
      z-index: 2;
    }
    
    .btn-primary {
      background-color: #dc3545; /* Kolor przycisku */
      border-color: #dc3545; /* Kolor obramowania przycisku */
    }
    
    .btn-primary:hover {
      background-color: #c82333; /* Kolor przycisku przy najechaniu */
      border-color: #bd2130; /* Kolor obramowania przycisku przy najechaniu */
    }
  `;
  document.head.appendChild(style);
}

// Funkcja do renderowania sekcji Kontakt
function renderContactSection(date) {
  // Dodajemy style CSS na początku
  addContactSectionStyles();

  var contactSection = document.getElementById('contact-section');
  contactSection.innerHTML = `
    <div class="site-section overlay site-cover-2" style="background-image: url('${date.contact.backgroundImage}');">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-7 text-center">
            <h2 class="text-white mb-4">${date.contact.title}</h2>
            <p class="mb-0">
              <a href="${date.contact.buttonLink}" rel="noopener" class="btn btn-primary btn-lg">${date.contact.buttonText}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
;
